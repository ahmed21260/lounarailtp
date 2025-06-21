# Guide de Déploiement Vercel - Louna Rail TP

## Prérequis

1. Compte Vercel (gratuit)
2. CLI Vercel installé : `npm i -g vercel`
3. Git configuré

## Structure du Projet

```
LounaRailTp/
├── api/
│   └── index.py          # Point d'entrée Vercel
├── assets/               # Fichiers statiques
├── images/               # Images du site
├── server.py             # Application Flask principale
├── config.py             # Configuration
├── requirements.txt      # Dépendances Python
├── vercel.json           # Configuration Vercel
└── *.html                # Pages du site
```

## Déploiement

### 1. Installation des dépendances locales
```bash
pip install -r requirements.txt
```

### 2. Configuration des variables d'environnement
Créer un fichier `.env` avec :
```
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SENDER_EMAIL=contact@lounarailtp.com
SENDER_PASSWORD=votre_mot_de_passe
RECIPIENT_EMAIL=contact@lounarailtp.com
SECRET_KEY=votre_cle_secrete
```

### 3. Test local
```bash
python server.py
```
Le site sera accessible sur `http://localhost:5000`

### 4. Déploiement Vercel

#### Option A : Via CLI
```bash
# Connexion à Vercel
vercel login

# Déploiement
vercel

# Déploiement en production
vercel --prod
```

#### Option B : Via GitHub
1. Pousser le code sur GitHub
2. Connecter le repository à Vercel
3. Configurer les variables d'environnement dans Vercel Dashboard

### 5. Configuration Vercel Dashboard

#### Variables d'environnement à configurer :
- `SMTP_SERVER`
- `SMTP_PORT`
- `SENDER_EMAIL`
- `SENDER_PASSWORD`
- `RECIPIENT_EMAIL`
- `SECRET_KEY`

#### Domaines personnalisés :
- Ajouter `lounarailtp.com` dans les paramètres du projet
- Configurer les DNS selon les instructions Vercel

## Fonctionnalités

### API Endpoints
- `/api/login` - Connexion utilisateur
- `/api/register` - Inscription utilisateur
- `/api/contact` - Formulaire de contact
- `/api/quiz-history` - Historique des quiz
- `/api/enroll` - Inscription aux formations
- `/api/dashboard-data` - Données du tableau de bord

### Pages Statiques
- `/` - Page d'accueil
- `/formations.html` - Formations
- `/prestation.html` - Prestations
- `/connexion.html` - Connexion
- `/inscription.html` - Inscription
- `/dashboard.html` - Tableau de bord

## Maintenance

### Mise à jour du site
```bash
# Modifier le code
git add .
git commit -m "Mise à jour"
git push

# Vercel se déploie automatiquement
```

### Logs et monitoring
- Accéder aux logs via Vercel Dashboard
- Monitoring des performances inclus
- Analytics disponibles

## Support

Pour toute question technique :
- Documentation Vercel : https://vercel.com/docs
- Support Flask : https://flask.palletsprojects.com/ 