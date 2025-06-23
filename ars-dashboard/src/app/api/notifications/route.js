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
    // Prend la première IP en cas de proxy et nettoie les espaces
    const ip = headersList.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';

    // === Géolocalisation par IP ===
    let locationInfo = '';
    try {
      // On évite de requêter les IP locales pour les tests
      if (ip !== '127.0.0.1' && !ip.startsWith('192.168.')) {
        const geoResponse = await fetch(`http://ip-api.com/json/${ip}?fields=status,city,country`);
        const geoData = await geoResponse.json();
        if (geoData.status === 'success' && geoData.city) {
          locationInfo = `📍 <b>Localisation :</b> ${geoData.city}, ${geoData.country}`;
        }
      }
    } catch (e) {
      console.error('Erreur de géolocalisation:', e);
    }

    // Formatage du message selon le type
    let message = '';
    let subject = '';

    switch (type) {
      case 'visitor':
        message = `
✅  <b>NOUVEAU VISITEUR</b>

📄 <b>Page :</b> ${data.page || 'Inconnue'}
${locationInfo}
💻 <b>Appareil :</b> ${data.device || 'Inconnu'}
🌐 <b>IP :</b> ${ip}
🕒 <b>Heure :</b> ${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}
        `;
        subject = 'Nouveau visiteur';
        break;

      case 'security':
        // Formateur de message centralisé pour la sécurité
        const formatSecurityDetails = (type, details) => {
            switch (type) {
                case 'CLIC_DROIT':
                    const className = details.className || 'Aucune';
                    const truncatedClassName = className.length > 60 ? `${className.substring(0, 60)}...` : className;
                    const traduireCible = (cible) => {
                      switch(cible?.toUpperCase()) {
                        case 'DIV': return 'Une section (div)';
                        case 'A': return 'Un lien (a)';
                        case 'IMG': return 'Une image (img)';
                        case 'BUTTON': return 'Un bouton (button)';
                        case 'P': return 'Un paragraphe (p)';
                        case 'H1': case 'H2': case 'H3': return 'Un titre (h)';
                        case 'SECTION': return 'Une grande section (section)';
                        default: return cible || 'Inconnue';
                      }
                    };
                    return `
📋 <b>Détails de l'action :</b>
   - 🖱️ <b>Cible :</b> <code>${traduireCible(details.target)}</code>
   - 🆔 <b>ID :</b> <code>${details.id || 'Aucun'}</code>
   - 🎨 <b>Style :</b> <code>${truncatedClassName}</code>
   - 📍 <b>Coords :</b> ${details.x || '?'}, ${details.y || '?'}`;

                case 'PAGE_LEAVE':
                    return `🔗 <b>A quitté la page :</b>\n<code>${details.url || 'URL Inconnue'}</code>`;
                case 'NAVIGATION_ATTEMPT':
                    return `🔗 <b>Tentative de navigation (Précédent/Suivant)</b>`;
                case 'TENTATIVE_COPIE':
                    return `📋 <b>Contenu copié (extrait) :</b>\n<code>${details.selection || 'Aucun'}</code>`;
                case 'TENTATIVE_CAPTURE':
                case 'OUTILS_DEVELOPPEMENT':
                case 'TENTATIVE_SAUVEGARDE':
                case 'TENTATIVE_IMPRESSION':
                    return `<i>Aucun détail supplémentaire pour cette action.</i>`;
                default:
                    return `📝 <b>Détails:</b>\n<code>${JSON.stringify(details, null, 2)}</code>`;
            }
        };

        const securityDetails = typeof data.message === 'object' ? data.message : JSON.parse(data.message || '{}');
        let detailsText = formatSecurityDetails(data.type, securityDetails);
        
        message = `
🚨 <b>ALERTE SÉCURITÉ</b> 🚨

⚠️ <b>Type :</b> ${data.type || 'Inconnu'}
📄 <b>Page :</b> ${data.page || 'Inconnue'}
🌐 <b>IP :</b> ${ip}
${locationInfo}
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

    // Email (pour les alertes importantes) - Désactivé pour le moment
    /*
    if (priority === 'high' || type === 'security' || type === 'error') {
      promises.push(sendEmailNotification(subject, message.replace(/<[^>]*>/g, '')));
    }
    */

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