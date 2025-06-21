# 🚨 SYSTÈME DE SURVEILLANCE RÉSEAU LOUNA RAIL TP

## © 2025 Ahmed Chaira - Tous droits réservés

Système de surveillance réseau complet avec centralisation des logs et envoi d'alertes par email.

---

## 📊 FONCTIONNALITÉS

### 🔍 Détection Automatique
- **Clics droits** sur les images et contenus
- **Tentatives de copie** (Ctrl+C)
- **Captures d'écran** (PrtScn)
- **Outils de développement** (F12)
- **Drag & drop** d'images
- **Tentatives de téléchargement** (Ctrl+clic)
- **Sélection de texte**
- **Sauvegarde** (Ctrl+S)
- **Impression** (Ctrl+P)
- **Zoom** (Ctrl+molette)
- **Navigation suspecte**

### 📧 Alertes Email Automatiques
- **Envoi immédiat** à `contact@lounarailtp.com`
- **Détails complets** de chaque violation
- **Informations techniques** (IP, User-Agent, etc.)
- **Horodatage précis**

### 💾 Stockage Centralisé
- **Base de données SQLite** pour toutes les violations
- **Logs détaillés** avec horodatage
- **Statistiques en temps réel**
- **Sauvegarde locale** en cas de déconnexion

---

## 🚀 INSTALLATION

### 1. Prérequis
```bash
# Python 3.7+ requis
python --version

# Pip installé
pip --version
```

### 2. Installation des dépendances
```bash
# Installation automatique via le script de démarrage
python start_surveillance.py

# Ou installation manuelle
pip install -r requirements_surveillance.txt
```

### 3. Configuration Email
1. **Modifiez** `config_surveillance.env` :
```env
SURVEILLANCE_EMAIL=contact@lounarailtp.com
EMAIL_PASSWORD=votre_mot_de_passe_app_gmail
```

2. **Créez un mot de passe d'application Gmail** :
   - Allez dans les paramètres Google
   - Sécurité → Authentification à 2 facteurs
   - Mots de passe d'application
   - Générez un mot de passe pour "Mail"

---

## 🎯 DÉMARRAGE

### Démarrage automatique
```bash
python start_surveillance.py
```

### Démarrage manuel
```bash
# 1. Configuration de l'environnement
export SURVEILLANCE_PORT=5001

# 2. Démarrage du serveur
python api/surveillance.py
```

### Vérification du fonctionnement
```bash
python test_surveillance.py
```

---

## 📊 MONITORING

### Endpoints API
- `POST /api/violation` - Réception des violations
- `GET /api/surveillance/stats` - Statistiques
- `GET /api/surveillance/logs` - Logs détaillés

### Fichiers de logs
- `logs/surveillance.log` - Logs du serveur
- `data/surveillance_violations.db` - Base de données
- `localStorage` - Sauvegarde locale côté client

### Statistiques disponibles
- **Total violations** par type
- **Sessions uniques** surveillées
- **Violations 24h** en temps réel
- **Géolocalisation** des IPs

---

## 🔧 CONFIGURATION AVANCÉE

### Variables d'environnement
```env
# Serveur
SURVEILLANCE_PORT=5001
SURVEILLANCE_HOST=0.0.0.0

# Email
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587

# Base de données
DB_PATH=data/surveillance_violations.db

# Logging
LOG_LEVEL=INFO
LOG_FILE=logs/surveillance.log
```

### Personnalisation des alertes
Modifiez `api/surveillance.py` pour personnaliser :
- **Format des emails**
- **Destinataires multiples**
- **Filtres de violations**
- **Actions automatiques**

---

## 🛡️ SÉCURITÉ

### Protection du serveur
- **CORS configuré** pour les domaines autorisés
- **Validation des données** reçues
- **Logs de sécurité** détaillés
- **Base de données sécurisée**

### Chiffrement
- **HTTPS recommandé** en production
- **Mots de passe chiffrés** dans la config
- **Sessions sécurisées**

---

## 📈 DASHBOARD

### Interface web (optionnelle)
```bash
# Accès aux statistiques
curl http://localhost:5001/api/surveillance/stats

# Récupération des logs
curl http://localhost:5001/api/surveillance/logs?limit=10
```

### Exemple de réponse
```json
{
  "success": true,
  "stats": {
    "total_violations": 42,
    "unique_sessions": 15,
    "violations_24h": 8,
    "violations_by_type": {
      "CLIC_DROIT": 20,
      "TENTATIVE_COPIE": 12,
      "OUTILS_DEVELOPPEMENT": 10
    }
  }
}
```

---

## 🚨 DÉPANNAGE

### Problèmes courants

#### Serveur ne démarre pas
```bash
# Vérifiez les dépendances
pip install flask flask-cors python-dotenv

# Vérifiez le port
netstat -an | grep 5001
```

#### Emails non envoyés
```bash
# Vérifiez la configuration Gmail
# Utilisez un mot de passe d'application
# Activez l'authentification à 2 facteurs
```

#### Violations non détectées
```bash
# Vérifiez la console du navigateur
# Assurez-vous que surveillance.js est chargé
# Testez avec test_surveillance.py
```

### Logs de débogage
```bash
# Logs du serveur
tail -f logs/surveillance.log

# Logs du navigateur
# Ouvrez la console développeur (F12)
```

---

## 📞 SUPPORT

### Contact
- **Email** : contact@lounarailtp.com
- **Propriétaire** : Ahmed Chaira
- **Projet** : Louna Rail TP

### Documentation
- **Code source** : `assets/js/surveillance.js`
- **Serveur API** : `api/surveillance.py`
- **Configuration** : `config_surveillance.env`

---

## ⚖️ LÉGAL

### Avertissement
Ce système de surveillance est conforme aux lois françaises et européennes sur la protection des données. Toute utilisation doit respecter le RGPD et les droits des utilisateurs.

### Licence
© 2025 Ahmed Chaira - Tous droits réservés
Louna Rail TP - Système de surveillance propriétaire

---

## 🔄 MAINTENANCE

### Sauvegarde
```bash
# Sauvegarde de la base de données
cp data/surveillance_violations.db backup/

# Sauvegarde des logs
cp logs/surveillance.log backup/
```

### Mise à jour
```bash
# Mise à jour des dépendances
pip install -r requirements_surveillance.txt --upgrade

# Redémarrage du serveur
python start_surveillance.py
```

---

**🚨 SYSTÈME DE SURVEILLANCE RÉSEAU LOUNA RAIL TP - VERSION 1.0**  
**© 2025 Ahmed Chaira - Tous droits réservés** 