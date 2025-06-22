# 🔔 Configuration des Notifications Telegram

## 📱 Pourquoi Telegram ?

- **Gratuit** et illimité
- **Notifications instantanées** sur ton téléphone
- **Interface simple** et intuitive
- **Sécurisé** et privé
- **Pas besoin d'app supplémentaire** (tu as déjà Telegram)

## 🚀 Setup en 5 minutes

### 1. Créer un Bot Telegram

1. **Ouvre Telegram** sur ton téléphone
2. **Cherche** `@BotFather`
3. **Envoie** `/newbot`
4. **Donne un nom** à ton bot (ex: "Louna Rail TP Alerts")
5. **Donne un username** (ex: `lounarailtp_alerts_bot`)
6. **Copie le TOKEN** que BotFather te donne

### 2. Obtenir ton Chat ID

1. **Envoie un message** à ton bot
2. **Va sur** : `https://api.telegram.org/bot<TON_TOKEN>/getUpdates`
3. **Copie le `chat_id`** (ex: `123456789`)

### 3. Configurer les Variables d'Environnement

Ajoute dans ton fichier `.env.local` :

```env
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=123456789

# Email Admin (optionnel)
ADMIN_EMAIL=ton-email@gmail.com
```

### 4. Tester la Configuration

Redémarre ton serveur et visite ton site. Tu devrais recevoir une notification Telegram !

## 📋 Types d'Alertes

### 🚨 Alertes Visiteurs
- Nouveau visiteur sur le site
- Pays, ville, page visitée
- Device et navigateur

### ⚠️ Alertes Sécurité
- Clic droit détecté
- Inspection du code
- Tentatives d'attaque

### ❌ Erreurs Serveur
- Problèmes techniques
- Erreurs 500, 404, etc.

### 📝 Nouveaux Messages
- Messages via formulaire de contact
- Demandes de devis

## 🎯 Exemples de Notifications

```
🚨 Nouveau Visiteur

📍 Pays: France
🌐 Page: /prestation.html
📱 Device: Desktop
🌍 IP: 192.168.1.1
⏰ Heure: 27/01/2025 14:30:25
```

```
🚨 ALERTE SÉCURITÉ

⚠️ Type: CLIC_DROIT
📍 Page: /lounarailtp.html
🌍 IP: 192.168.1.1
📝 Détails: Right-click detected
⏰ Heure: 27/01/2025 14:30:25
```

## 🔧 Personnalisation

### Modifier les Messages

Édite le fichier `ars-dashboard/src/app/api/notifications/route.js` pour personnaliser :

- **Emojis** et formatage
- **Informations** affichées
- **Priorités** des alertes

### Filtrer les Alertes

Tu peux désactiver certains types :

```javascript
// Désactiver les notifications visiteurs
if (type === 'visitor') return; // Skip

// Seulement les alertes importantes
if (priority !== 'high') return; // Skip
```

## 📱 Configuration Mobile

### Notifications Push
1. **Ouvre Telegram** sur ton téléphone
2. **Va dans** Paramètres > Notifications
3. **Active** "Notifications push"
4. **Personnalise** le son et vibration

### Chat Privé
- Crée un **chat privé** avec ton bot
- **Épingle** le chat en haut
- **Active** les notifications pour ce chat

## 🚀 Déploiement Vercel

### Variables d'Environnement
Ajoute dans ton dashboard Vercel :

```
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=123456789
ADMIN_EMAIL=ton-email@gmail.com
```

### Test Post-Déploiement
1. **Visite** ton site en ligne
2. **Vérifie** que tu reçois les notifications
3. **Teste** les différents types d'alertes

## 🔒 Sécurité

### Protection du Bot
- **Ne partage jamais** ton TOKEN
- **Utilise** un bot privé
- **Limite** l'accès au chat

### Rate Limiting
Le système inclut une protection contre le spam :
- **Max 10 notifications** par minute
- **Cooldown** automatique
- **Filtrage** des doublons

## 🎉 Résultat Final

Tu auras maintenant :
- ✅ **Notifications instantanées** sur ton téléphone
- ✅ **Alertes en temps réel** pour tout événement important
- ✅ **Historique** de toutes les activités
- ✅ **Sécurité renforcée** avec monitoring

## 🆘 Support

Si tu as des problèmes :
1. **Vérifie** que le bot est bien créé
2. **Teste** le TOKEN sur l'API Telegram
3. **Vérifie** les variables d'environnement
4. **Regarde** les logs du serveur

---

**🎯 Tu seras maintenant notifié de TOUT ce qui se passe sur ton site en temps réel !** 