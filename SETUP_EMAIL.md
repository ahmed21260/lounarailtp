# Configuration Email - Louna Rail TP

## 🚀 Configuration Rapide

### 1. Créer le fichier .env
```bash
# Copiez le contenu de env_example.txt dans un nouveau fichier .env
cp env_example.txt .env
```

### 2. Configurer Gmail (Recommandé)

#### Option A : Gmail avec mot de passe d'application
1. Allez sur https://myaccount.google.com/security
2. Activez l'authentification à 2 facteurs
3. Créez un mot de passe d'application pour "Mail"
4. Utilisez ce mot de passe dans votre .env

#### Option B : Gmail avec OAuth2 (Plus sécurisé)
1. Créez un projet Google Cloud
2. Activez l'API Gmail
3. Créez des identifiants OAuth2
4. Configurez les redirections

### 3. Configuration .env
```env
# Configuration Email Louna Rail TP
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SENDER_EMAIL=contact@lounarailtp.com
SENDER_PASSWORD=votre-mot-de-passe-app-gmail
RECIPIENT_EMAIL=contact@lounarailtp.com
```

## 🌐 Configuration Serveur SMTP Personnalisé

Si vous avez un serveur SMTP pour votre domaine lounarailtp.com :

```env
SMTP_SERVER=mail.lounarailtp.com
SMTP_PORT=587
SENDER_EMAIL=contact@lounarailtp.com
SENDER_PASSWORD=votre-mot-de-passe-smtp
RECIPIENT_EMAIL=contact@lounarailtp.com
```

## 📧 Services Email Recommandés

### 1. Gmail (Gratuit)
- ✅ Facile à configurer
- ✅ Fiable
- ❌ Limite de 500 emails/jour

### 2. SendGrid (Payant)
- ✅ 100 emails/jour gratuits
- ✅ Excellente délivrabilité
- ✅ API simple

### 3. Mailgun (Payant)
- ✅ 5000 emails/mois gratuits
- ✅ API robuste
- ✅ Bonne délivrabilité

## 🔧 Test de Configuration

### 1. Installer les dépendances
```bash
pip install -r requirements.txt
```

### 2. Démarrer le serveur
```bash
python server.py
```

### 3. Tester l'API
```bash
curl http://localhost:5000/api/test
```

### 4. Tester l'envoi d'email
- Ouvrez http://localhost:5000
- Remplissez le formulaire de contact
- Vérifiez les logs du serveur

## 🛡️ Sécurité

### Variables d'environnement
- ✅ Ne jamais commiter le fichier .env
- ✅ Utiliser des mots de passe forts
- ✅ Limiter les permissions

### Protection contre le spam
- ✅ Validation côté serveur
- ✅ Rate limiting (à implémenter)
- ✅ Captcha (optionnel)

## 📋 Checklist de Déploiement

- [ ] Fichier .env configuré
- [ ] Mot de passe email valide
- [ ] Test d'envoi réussi
- [ ] Logs de debug activés
- [ ] Backup de la configuration
- [ ] Monitoring des erreurs

## 🚨 Dépannage

### Erreur d'authentification SMTP
```
❌ Erreur d'authentification SMTP - Vérifiez vos identifiants
```
**Solution :**
1. Vérifiez le mot de passe d'application
2. Activez l'authentification à 2 facteurs
3. Vérifiez que l'email est correct

### Erreur de connexion SMTP
```
❌ Erreur SMTP: [Errno 11001] getaddrinfo failed
```
**Solution :**
1. Vérifiez l'adresse du serveur SMTP
2. Vérifiez votre connexion internet
3. Testez avec un autre serveur SMTP

### Email non reçu
**Vérifications :**
1. Spam/junk folder
2. Configuration du serveur de réception
3. Logs du serveur SMTP
4. Test avec un autre email

## 📞 Support

Pour toute question sur la configuration email :
- Consultez les logs du serveur
- Vérifiez la configuration .env
- Testez avec un email de test simple

---
**Dernière mise à jour :** 2025
**Domaine :** lounarailtp.com 