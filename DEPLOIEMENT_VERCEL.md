# 🚀 Guide de Déploiement Vercel - Louna Rail TP

## 📋 Prérequis

- Compte Vercel (gratuit)
- Compte Gmail avec authentification à 2 facteurs activée
- Mot de passe d'application Gmail généré

## 🔧 Configuration SMTP Gmail

### 1. Activer l'authentification à 2 facteurs
1. Allez sur https://myaccount.google.com/security
2. Activez "Validation en 2 étapes"
3. Suivez les instructions

### 2. Générer un mot de passe d'application
1. Dans les paramètres de sécurité Google
2. Cliquez sur "Mots de passe d'application"
3. Sélectionnez "Autre (nom personnalisé)"
4. Nommez-le "Louna Rail TP Surveillance"
5. Copiez le mot de passe généré (16 caractères)

## 🌐 Déploiement sur Vercel

### 1. Préparer le projet
```bash
# Assurez-vous que tous les fichiers sont présents
- api/surveillance.py
- requirements_surveillance.txt
- vercel.json
- dashboard_surveillance.html
- config_surveillance.env
```

### 2. Variables d'environnement Vercel

Dans votre dashboard Vercel, ajoutez ces variables :

```env
# Configuration Email
SENDER_PASSWORD=votre_mot_de_passe_app_gmail_16_caracteres

# Configuration Sécurité
SESSION_SECRET=votre_cle_secrete_aleatoire_32_caracteres

# Configuration Dashboard
DASHBOARD_USERNAME=admin
DASHBOARD_PASSWORD_HASH=5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8

# Configuration SMTP
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SENDER_EMAIL=contact@lounarailtp.com
RECIPIENT_EMAIL=contact@lounarailtp.com

# Configuration Système
ALERT_ENABLED=true
CORS_ENABLED=true
ALLOWED_ORIGINS=*
```

### 3. Déployer sur Vercel

1. **Via GitHub** (Recommandé)
   ```bash
   # Poussez votre code sur GitHub
   git add .
   git commit -m "Configuration surveillance pour Vercel"
   git push origin main
   
   # Connectez votre repo GitHub à Vercel
   # Vercel détectera automatiquement la configuration
   ```

2. **Via Vercel CLI**
   ```bash
   npm i -g vercel
   vercel login
   vercel --prod
   ```

### 4. Configuration du domaine

1. Dans Vercel, allez dans "Settings" > "Domains"
2. Ajoutez votre domaine : `api.lounarailtp.com`
3. Configurez les DNS selon les instructions Vercel

## 🔐 Configuration EmailJS (Formulaires de contact)

### 1. Créer un compte EmailJS
1. Allez sur https://www.emailjs.com/
2. Créez un compte gratuit
3. Vérifiez votre email

### 2. Configurer le service SMTP
1. Dans EmailJS, allez dans "Email Services"
2. Cliquez sur "Add New Service"
3. Choisissez "Custom SMTP"
4. Configurez :
   - **SMTP Server** : `smtp.gmail.com`
   - **Port** : `587`
   - **Email** : `contact@lounarailtp.com`
   - **Password** : Votre mot de passe d'application Gmail

### 3. Créer un template
1. Allez dans "Email Templates"
2. Créez un nouveau template :

```html
Nouveau message reçu via le formulaire de contact Louna Rail TP

Nom : {{from_name}}
Email : {{from_email}}
Message : {{message}}

---
Ce message a été envoyé depuis le site web lounarailtp.com
```

### 4. Récupérer les clés
1. **Public Key** : Account > API Keys
2. **Service ID** : Email Services (ID de votre service)
3. **Template ID** : Email Templates (ID de votre template)

### 5. Mettre à jour le code
Remplacez dans tous les fichiers HTML :

```javascript
// Remplacer YOUR_EMAILJS_PUBLIC_KEY par votre vraie clé
emailjs.init("VOTRE_PUBLIC_KEY_ICI");

// Remplacer les IDs dans les appels emailjs.send
emailjs.send('VOTRE_SERVICE_ID_ICI', 'VOTRE_TEMPLATE_ID_ICI', {
    from_name: nom,
    from_email: email,
    message: message
});
```

## 🛡️ Test de la Surveillance

### 1. Tester l'API
```bash
# Test de l'endpoint de surveillance
curl -X POST https://api.lounarailtp.com/api/violation \
  -H "Content-Type: application/json" \
  -d '{
    "type": "CLIC_DROIT",
    "page_url": "https://lounarailtp.com",
    "ip_address": "127.0.0.1",
    "user_agent": "Test Browser"
  }'
```

### 2. Tester le dashboard
1. Ouvrez `dashboard_surveillance.html`
2. Connectez-vous avec :
   - **Utilisateur** : `admin`
   - **Mot de passe** : `password`
3. Vérifiez que les données s'affichent

### 3. Tester les emails
1. Déclenchez une violation sur le site
2. Vérifiez votre boîte email `contact@lounarailtp.com`
3. Vous devriez recevoir une alerte

## 🔧 Dépannage

### Erreur SMTP
```
Erreur lors de l'envoi de l'email d'alerte
```
**Solutions :**
1. Vérifiez le mot de passe d'application Gmail
2. Assurez-vous que l'authentification à 2 facteurs est activée
3. Vérifiez les variables d'environnement Vercel

### Erreur CORS
```
Access to fetch at 'https://api.lounarailtp.com' from origin 'https://lounarailtp.com' has been blocked by CORS policy
```
**Solutions :**
1. Vérifiez `ALLOWED_ORIGINS` dans Vercel
2. Assurez-vous que `CORS_ENABLED=true`

### Dashboard ne se charge pas
```
Erreur de connexion au serveur
```
**Solutions :**
1. Vérifiez l'URL de l'API dans le dashboard
2. Assurez-vous que l'API est déployée et accessible
3. Vérifiez les logs Vercel

## 📊 Monitoring

### Logs Vercel
1. Dans votre dashboard Vercel
2. Allez dans "Functions" > "api/surveillance.py"
3. Consultez les logs en temps réel

### Métriques
- **Fonction Calls** : Nombre d'appels à l'API
- **Execution Time** : Temps de réponse
- **Errors** : Erreurs éventuelles

## 🔄 Mise à jour

Pour mettre à jour le déploiement :

```bash
# Modifiez votre code
git add .
git commit -m "Mise à jour surveillance"
git push origin main

# Vercel redéploiera automatiquement
```

## 📞 Support

- **Vercel Support** : https://vercel.com/support
- **EmailJS Support** : https://www.emailjs.com/support
- **Gmail Security** : https://myaccount.google.com/security

---
**Domaine API** : api.lounarailtp.com  
**Dashboard** : dashboard_surveillance.html  
**Statut** : Prêt pour production 