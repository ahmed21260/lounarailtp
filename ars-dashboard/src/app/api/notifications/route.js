import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

// Configuration Telegram Bot
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Fonction pour envoyer une notification Telegram
async function sendTelegramNotification(message) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('Telegram bot non configuré');
    return false;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    const result = await response.json();
    return result.ok;
  } catch (error) {
    console.error('Erreur envoi Telegram:', error);
    return false;
  }
}

// Fonction pour envoyer un email
async function sendEmailNotification(subject, message) {
  const email = process.env.ADMIN_EMAIL;
  if (!email) {
    console.warn('Email admin non configuré');
    return false;
  }

  try {
    // Utilisation d'un service d'email simple (Resend, SendGrid, etc.)
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: email,
        subject: `🚨 Louna Rail TP - ${subject}`,
        html: message,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Erreur envoi email:', error);
    return false;
  }
}

export async function POST(request) {
  try {
    const { type, data, priority = 'normal' } = await request.json();

    // === Détection améliorée de l'IP côté serveur ===
    const headersList = headers();
    const ip = headersList.get('x-forwarded-for') || '127.0.0.1';

    // Formatage du message selon le type
    let message = '';
    let subject = '';

    switch (type) {
      case 'visitor':
        message = `
🚨 <b>Nouveau Visiteur</b>

📍 <b>Pays:</b> ${data.country || 'Inconnu'}
🌐 <b>Page:</b> ${data.page || 'Inconnue'}
📱 <b>Device:</b> ${data.device || 'Inconnu'}
🌍 <b>IP:</b> ${ip}
⏰ <b>Heure:</b> ${new Date().toLocaleString('fr-FR')}
        `;
        subject = 'Nouveau visiteur';
        break;

      case 'security':
        const securityDetails = typeof data.message === 'object' ? data.message : JSON.parse(data.message || '{}');
        let detailsText = '';

        // Formatage spécifique selon le type d'alerte de sécurité
        if (data.type === 'CLIC_DROIT') {
          detailsText = `
📋 <b>Détails de l'action :</b>
   - 🖱️ <b>Cible :</b> <code>${securityDetails.target || 'N/A'}</code>
   - 🆔 <b>ID de l'élément :</b> <code>${securityDetails.id || 'Aucun'}</code>
   - 🔡 <b>Classe :</b> <code>${securityDetails.className || 'Aucune'}</code>
   - 📍 <b>Coords (X, Y) :</b> ${securityDetails.x || '?'}, ${securityDetails.y || '?'}`;
        } else if (data.type === 'NAVIGATION_ATTEMPT') {
          detailsText = `
🔗 <b>URL de destination :</b>
<code>${securityDetails.url || 'Inconnue'}</code>`;
        } else {
          detailsText = `📝 <b>Détails:</b> ${data.message || 'Aucun détail'}`;
        }

        message = `
🚨 <b>ALERTE SÉCURITÉ</b> 🚨

⚠️ <b>Type d'alerte :</b> ${data.type || 'Inconnu'}
🔗 <b>Page :</b> ${data.page || 'Inconnue'}
🌐 <b>IP :</b> ${ip}
${detailsText}
🕒 <b>Heure :</b> ${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}`;
        subject = 'Alerte sécurité';
        break;

      case 'error':
        message = `
❌ <b>ERREUR SERVEUR</b>

🔧 <b>Type:</b> ${data.type || 'Inconnu'}
📝 <b>Message:</b> ${data.message || 'Aucun détail'}
🌍 <b>IP:</b> ${ip}
⏰ <b>Heure:</b> ${new Date().toLocaleString('fr-FR')}
        `;
        subject = 'Erreur serveur';
        break;

      case 'form':
        message = `
📝 <b>NOUVEAU MESSAGE</b>

👤 <b>Nom:</b> ${data.nom || 'Anonyme'}
📧 <b>Email:</b> ${data.email || 'Non renseigné'}
📱 <b>Téléphone:</b> ${data.telephone || 'Non renseigné'}
💬 <b>Message:</b> ${data.message?.substring(0, 100)}...
⏰ <b>Heure:</b> ${new Date().toLocaleString('fr-FR')}
        `;
        subject = 'Nouveau message';
        break;

      default:
        message = `
ℹ️ <b>NOTIFICATION</b>

📝 <b>Type:</b> ${type}
🌐 <b>IP :</b> ${ip}
📄 <b>Données:</b> ${JSON.stringify(data, null, 2)}
⏰ <b>Heure:</b> ${new Date().toLocaleString('fr-FR')}
        `;
        subject = 'Notification';
    }

    // Envoi des notifications selon la priorité
    const promises = [];

    // Telegram (toujours)
    promises.push(sendTelegramNotification(message));

    // Email (pour les alertes importantes)
    if (priority === 'high' || type === 'security' || type === 'error') {
      promises.push(sendEmailNotification(subject, message.replace(/<[^>]*>/g, '')));
    }

    const results = await Promise.all(promises);
    const success = results.some(result => result);

    return NextResponse.json({
      success,
      message: success ? 'Notification envoyée' : 'Erreur envoi notification'
    });

  } catch (error) {
    console.error('Erreur notification:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur interne' },
      { status: 500 }
    );
  }
} 