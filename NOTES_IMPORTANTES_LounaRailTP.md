# 📒 NOTES IMPORTANTES - Louna Rail TP

## 🔑 Accès & Codes

- **Email principal** : lounarailtp@gmail.com
- **Mot de passe SMTP (Gmail App)** : `eulgeerftlkvdhaq`
- **Dashboard Surveillance**
  - **Utilisateur** : `admin`
  - **Mot de passe** : `password` (par défaut, à changer si besoin)
- **Clé secrète session** : `lounarailtp-secret-key-2025-surveillance`

## 🌐 Liens Utiles

- **Site principal** : [https://lounarailtp.com](https://lounarailtp.com)
- **Dashboard Surveillance** : `dashboard_surveillance.html` (ouvrir localement ou sur le serveur)
- **API Surveillance** :
  - Local : `http://localhost:5001/api/`
  - Production (Vercel) : `https://api.lounarailtp.com/api/`
- **Vercel Dashboard** : [https://vercel.com/dashboard](https://vercel.com/dashboard)
- **EmailJS** : [https://www.emailjs.com/](https://www.emailjs.com/)
- **Gmail Sécurité** : [https://myaccount.google.com/security](https://myaccount.google.com/security)

## 📧 EmailJS (Formulaires de contact)

- **Public Key** : À compléter
- **Service ID** : À compléter
- **Template ID** : À compléter
- **Lien EmailJS** : [https://dashboard.emailjs.com/admin](https://dashboard.emailjs.com/admin)
- **Configuration SMTP** :
  - Serveur : `smtp.gmail.com`
  - Port : `587`
  - Email : `lounarailtp@gmail.com`
  - Mot de passe : `eulgeerftlkvdhaq`

## ⚙️ Variables d'Environnement (Vercel)

```env
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SENDER_EMAIL=lounarailtp@gmail.com
SENDER_PASSWORD=eulgeerftlkvdhaq
RECIPIENT_EMAIL=lounarailtp@gmail.com
DASHBOARD_USERNAME=admin
DASHBOARD_PASSWORD_HASH=5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8
SESSION_SECRET=lounarailtp-secret-key-2025-surveillance
ALERT_ENABLED=true
CORS_ENABLED=true
ALLOWED_ORIGINS=*
```

## 🛠️ Commandes Utiles

- **Tester la configuration** :
  ```bash
  python test_deployment.py
  ```
- **Générer les clés de sécurité** :
  ```bash
  python generate_keys.py
  ```
- **Démarrer l'API localement** :
  ```bash
  python api/surveillance.py
  ```

## 📝 Instructions Rapides

1. **Déploiement Vercel** :
   - Pousser le code sur GitHub
   - Connecter le repo à Vercel
   - Ajouter les variables d'environnement ci-dessus
   - Déployer
2. **EmailJS** :
   - Créer un compte, configurer le service SMTP, créer un template, récupérer les clés
   - Remplacer les clés dans les fichiers HTML
3. **Sécurité** :
   - Ne jamais partager ce fichier publiquement
   - Changer le mot de passe dashboard si besoin
   - Changer le mot de passe SMTP si fuite

## 📞 Support & Documentation

- **Guide déploiement** : `DEPLOIEMENT_VERCEL.md`
- **Guide email** : `CONFIGURATION_EMAIL.md`
- **Guide surveillance** : `SURVEILLANCE_README.md`
- **Support Vercel** : [https://vercel.com/support](https://vercel.com/support)
- **Support EmailJS** : [https://www.emailjs.com/support](https://www.emailjs.com/support)

---
**Dernière mise à jour** : 21/06/2025

> ⚠️ **Ce fichier contient des informations sensibles. À conserver en lieu sûr !** 