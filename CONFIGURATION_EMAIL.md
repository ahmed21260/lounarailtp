# Configuration Email Réel - Louna Rail TP

## 🎯 Objectif
Configurer l'envoi d'email réel vers votre adresse `contact@lounarailtp.com`

## 🚀 Solution : EmailJS (Gratuit et Simple)

### Étape 1 : Créer un compte EmailJS
1. Allez sur https://www.emailjs.com/
2. Cliquez sur "Sign Up" (Inscription gratuite)
3. Créez votre compte

### Étape 2 : Configurer votre service email
1. Dans EmailJS, allez dans "Email Services"
2. Cliquez sur "Add New Service"
3. Choisissez votre fournisseur email :
   - **Gmail** (si vous utilisez Gmail)
   - **Outlook** (si vous utilisez Outlook)
   - **Autre** (pour votre serveur SMTP)

### Étape 3 : Créer un template d'email
1. Allez dans "Email Templates"
2. Cliquez sur "Create New Template"
3. Utilisez ce template :

```html
Nouveau message reçu via le formulaire de contact Louna Rail TP

Nom : {{from_name}}
Email : {{from_email}}
Message : {{message}}

---
Ce message a été envoyé depuis le site web lounarailtp.com
```

### Étape 4 : Récupérer vos clés
1. **Public Key** : Dans "Account" > "API Keys"
2. **Service ID** : Dans "Email Services" (ID de votre service)
3. **Template ID** : Dans "Email Templates" (ID de votre template)

### Étape 5 : Configurer le code
Remplacez dans `lounarailtp.html` :

```javascript
// Ligne 1 : Votre Public Key
emailjs.init("VOTRE_PUBLIC_KEY_ICI");

// Ligne 2 : Votre Service ID
'VOTRE_SERVICE_ID_ICI'

// Ligne 3 : Votre Template ID  
'VOTRE_TEMPLATE_ID_ICI'
```

## 📧 Configuration pour contact@lounarailtp.com

### Option A : Si vous avez un serveur SMTP
1. Dans EmailJS, choisissez "Custom SMTP"
2. Configurez :
   - SMTP Server : votre serveur SMTP
   - Port : 587 (ou 465)
   - Email : contact@lounarailtp.com
   - Mot de passe : votre mot de passe

### Option B : Si vous utilisez Gmail
1. Activez l'authentification à 2 facteurs sur Gmail
2. Créez un mot de passe d'application
3. Utilisez ce mot de passe dans EmailJS

### Option C : Service d'email professionnel
- **SendGrid** : 100 emails/jour gratuits
- **Mailgun** : 5000 emails/mois gratuits
- **Amazon SES** : Très économique

## 🔧 Test de Configuration

### 1. Ouvrir la page
```bash
# Double-cliquez sur lounarailtp.html
# Ou ouvrez dans votre navigateur
```

### 2. Tester le formulaire
- Remplissez le formulaire de contact
- Cliquez sur "Envoyer"
- Vérifiez votre boîte email `contact@lounarailtp.com`

### 3. Vérifier les logs
- Ouvrez la console du navigateur (F12)
- Regardez les messages de log

## 🚨 Dépannage

### EmailJS non configuré
```
⚠️ Configuration EmailJS manquante
```
**Solution :** Suivez les étapes de configuration ci-dessus

### Erreur d'authentification
```
Erreur lors de l'envoi
```
**Solution :** Vérifiez vos clés EmailJS

### Email non reçu
**Vérifications :**
1. Spam/junk folder
2. Configuration du template
3. Adresse email correcte

## 💡 Avantages EmailJS

- ✅ **Gratuit** : 200 emails/mois gratuits
- ✅ **Simple** : Pas de serveur nécessaire
- ✅ **Sécurisé** : Chiffrement SSL
- ✅ **Fiable** : Service professionnel
- ✅ **Support** : Documentation complète

## 📞 Support

- **EmailJS Support** : https://www.emailjs.com/support
- **Documentation** : https://www.emailjs.com/docs
- **Templates** : https://www.emailjs.com/templates

---
**Votre domaine :** lounarailtp.com  
**Email de contact :** contact@lounarailtp.com  
**Statut :** Prêt pour configuration 