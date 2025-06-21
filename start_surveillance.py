#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SCRIPT DE DÉMARRAGE - SYSTÈME DE SURVEILLANCE LOUNA RAIL TP
© 2025 Ahmed Chaira - Tous droits réservés

Démarre le serveur de surveillance avec toutes les configurations
"""

import os
import sys
import subprocess
import logging
from datetime import datetime

def check_dependencies():
    """Vérifie et installe les dépendances nécessaires"""
    required_packages = [
        'flask',
        'flask-cors',
        'python-dotenv'
    ]
    
    print("🔍 Vérification des dépendances...")
    
    for package in required_packages:
        try:
            __import__(package.replace('-', '_'))
            print(f"✅ {package} - OK")
        except ImportError:
            print(f"❌ {package} - Manquant, installation...")
            try:
                subprocess.check_call([sys.executable, '-m', 'pip', 'install', package])
                print(f"✅ {package} - Installé")
            except subprocess.CalledProcessError:
                print(f"❌ Erreur lors de l'installation de {package}")
                return False
    
    return True

def setup_environment():
    """Configure l'environnement de surveillance"""
    print("⚙️ Configuration de l'environnement...")
    
    # Création du dossier de logs
    if not os.path.exists('logs'):
        os.makedirs('logs')
        print("✅ Dossier logs créé")
    
    # Création du dossier de base de données
    if not os.path.exists('data'):
        os.makedirs('data')
        print("✅ Dossier data créé")
    
    # Configuration du logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler('logs/surveillance.log'),
            logging.StreamHandler()
        ]
    )
    
    print("✅ Environnement configuré")

def check_email_config():
    """Vérifie la configuration email"""
    print("📧 Vérification de la configuration email...")
    
    # Vérification du fichier de configuration
    config_file = 'config_surveillance.env'
    if not os.path.exists(config_file):
        print(f"❌ Fichier de configuration {config_file} manquant")
        print("📝 Création du fichier de configuration...")
        
        config_content = """# CONFIGURATION SYSTÈME DE SURVEILLANCE LOUNA RAIL TP
# © 2025 Ahmed Chaira - Tous droits réservés

# Configuration Email
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SURVEILLANCE_EMAIL=contact@lounarailtp.com
EMAIL_PASSWORD=votre_mot_de_passe_app_gmail

# Configuration Serveur
SURVEILLANCE_PORT=5001
SURVEILLANCE_HOST=0.0.0.0

# Configuration Base de Données
DB_PATH=data/surveillance_violations.db

# Configuration Logging
LOG_LEVEL=INFO
LOG_FILE=logs/surveillance.log

# Configuration Sécurité
ALLOWED_ORIGINS=*
CORS_ENABLED=true

# Configuration Alertes
ALERT_EMAIL=contact@lounarailtp.com
ALERT_ENABLED=true
"""
        
        with open(config_file, 'w', encoding='utf-8') as f:
            f.write(config_content)
        
        print(f"✅ Fichier {config_file} créé")
        print("⚠️ IMPORTANT: Modifiez EMAIL_PASSWORD avec votre mot de passe Gmail")
        return False
    
    print("✅ Configuration email trouvée")
    return True

def start_surveillance_server():
    """Démarre le serveur de surveillance"""
    print("🚀 Démarrage du serveur de surveillance...")
    
    try:
        # Import du serveur de surveillance
        sys.path.append('api')
        from surveillance import app, init_database
        
        # Initialisation de la base de données
        init_database()
        
        # Configuration du port
        port = int(os.getenv('SURVEILLANCE_PORT', 5001))
        
        print(f"🌐 Serveur de surveillance démarré sur le port {port}")
        print(f"📊 Endpoints disponibles:")
        print(f"   - POST /api/violation (réception des violations)")
        print(f"   - GET  /api/surveillance/stats (statistiques)")
        print(f"   - GET  /api/surveillance/logs (logs)")
        print(f"📧 Alertes email: contact@lounarailtp.com")
        print(f"📝 Logs: logs/surveillance.log")
        print(f"💾 Base de données: data/surveillance_violations.db")
        print("=" * 60)
        
        # Démarrage du serveur
        app.run(
            host='0.0.0.0',
            port=port,
            debug=False,
            threaded=True
        )
        
    except Exception as e:
        print(f"❌ Erreur lors du démarrage: {str(e)}")
        return False
    
    return True

def main():
    """Fonction principale"""
    print("=" * 60)
    print("🚨 SYSTÈME DE SURVEILLANCE RÉSEAU LOUNA RAIL TP")
    print("© 2025 Ahmed Chaira - Tous droits réservés")
    print("=" * 60)
    print(f"🕐 Démarrage: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # Vérification des dépendances
    if not check_dependencies():
        print("❌ Erreur: Dépendances manquantes")
        return
    
    # Configuration de l'environnement
    setup_environment()
    
    # Vérification de la configuration email
    email_configured = check_email_config()
    if not email_configured:
        print("⚠️ Configuration email à compléter")
        print("   Modifiez config_surveillance.env avec vos identifiants Gmail")
    
    print()
    print("🎯 Démarrage du système de surveillance...")
    print()
    
    # Démarrage du serveur
    start_surveillance_server()

if __name__ == '__main__':
    main() 