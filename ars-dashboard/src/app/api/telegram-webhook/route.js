import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// Fonction pour envoyer une réponse à Telegram
async function sendTelegramResponse(chatId, text) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML',
      }),
    });
  } catch (error) {
    console.error('Erreur envoi réponse Telegram:', error);
  }
}

// Le "Poste d'Écoute" pour les commandes Telegram
export async function POST(request) {
  try {
    const body = await request.json();
    const message = body.message;

    // S'assurer que le message et le texte existent
    if (!message || !message.text) {
      return NextResponse.json({ status: 'ok' });
    }

    const chatId = message.chat.id;
    const command = message.text.split(' ')[0]; // Extrait la commande, ex: /rapportjour

    // Logique pour chaque commande
    switch (command) {
      case '/start':
        await sendTelegramResponse(
          chatId,
          `Bonjour ! Je suis le bot d'alerte de Louna Rail TP. Envoyez /aide pour voir les commandes.`
        );
        break;
        
      case '/rapportjour':
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const visitorsToday = await prisma.visitor.count({
          where: { createdAt: { gte: yesterday } },
        });
        const pageViewsToday = await prisma.pageView.count({
            where: { createdAt: { gte: yesterday } },
        });

        await sendTelegramResponse(
          chatId,
          `📊 <b>Rapport des dernières 24h :</b>\n\n- Visiteurs uniques : <b>${visitorsToday}</b>\n- Pages vues : <b>${pageViewsToday}</b>`
        );
        break;

      case '/derniersvisiteurs':
        const lastVisitors = await prisma.visitor.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: { ipAddress: true, country: true, city: true, pageUrl: true, createdAt: true },
        });
        
        if (lastVisitors.length === 0) {
            await sendTelegramResponse(chatId, "Aucun visiteur récent trouvé.");
            break;
        }

        const visitorList = lastVisitors.map(v => 
          `👤 <b>IP:</b> ${v.ipAddress} (${v.country || 'N/A'})\n   - <b>Page:</b> ${v.pageUrl}\n   - <b>Quand:</b> ${v.createdAt.toLocaleString('fr-FR')}`
        ).join('\n\n');

        await sendTelegramResponse(
          chatId,
          `🛰️ <b>5 derniers visiteurs uniques :</b>\n\n${visitorList}`
        );
        break;

      case '/statistiques':
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const weeklyVisitors = await prisma.visitor.count({
            where: { createdAt: { gte: sevenDaysAgo } },
        });

        const weeklyPageViews = await prisma.pageView.count({
            where: { createdAt: { gte: sevenDaysAgo } },
        });

        await sendTelegramResponse(
          chatId,
          `📈 <b>Statistiques sur 7 jours :</b>\n\n- Visiteurs uniques : <b>${weeklyVisitors}</b>\n- Total pages vues : <b>${weeklyPageViews}</b>`
        );
        break;
        
      case '/aide':
        await sendTelegramResponse(
          chatId,
          `<b>Commandes disponibles :</b>\n\n/rapportjour - Résumé des dernières 24h.\n/derniersvisiteurs - Affiche les 5 derniers visiteurs.\n/statistiques - Visites sur les 7 derniers jours.`
        );
        break;
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Erreur webhook Telegram:', error);
    // On renvoie une réponse positive pour éviter que Telegram ne réessaie
    return NextResponse.json({ status: 'error', message: error.message });
  }
} 