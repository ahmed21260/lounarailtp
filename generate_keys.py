#!/usr/bin/env python3
"""
Script pour générer les clés de sécurité pour le déploiement Vercel
Louna Rail TP - Surveillance System
"""

import hashlib
import secrets
import os

def generate_session_secret():
    """Génère une clé secrète pour les sessions"""
    return secrets.token_hex(32)

def hash_password(password):
    """Hash un mot de passe avec SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

def generate_vercel_env_file():
    """Génère un fichier .env pour Vercel"""
    
    # Demander les informations
    print("🔧 Configuration des clés de sécurité pour Vercel")
    print("=" * 60)
    
    # Mot de passe d'application Gmail
    print("\n📧 Configuration SMTP Gmail:")
    print("1. Allez sur https://myaccount.google.com/security")
    print("2. Activez l'authentification à 2 facteurs")
    print("3. Générez un mot de passe d'application")
    print("4. Nommez-le 'Louna Rail TP Surveillance'")
    
    smtp_password = input("\nEntrez votre mot de passe d'application Gmail (16 caractères): ").strip()
    
    if len(smtp_password) != 16:
        print("❌ Le mot de passe d'application doit faire 16 caractères")
        return False
    
    # Mot de passe du dashboard
    print("\n🔐 Configuration Dashboard:")
    dashboard_password = input("Entrez le mot de passe pour le dashboard (défaut: 'password'): ").strip()
    if not dashboard_password:
        dashboard_password = "password"
    
    # Générer les clés
    session_secret = generate_session_secret()
    password_hash = hash_password(dashboard_password)
    
    # Créer le contenu du fichier .env
    env_content = f"""# Configuration Vercel - Louna Rail TP Surveillance
# © 2025 Ahmed Chaira - Tous droits réservés

# Configuration Email
SENDER_PASSWORD={smtp_password}

# Configuration Sécurité
SESSION_SECRET={session_secret}

# Configuration Dashboard
DASHBOARD_USERNAME=admin
DASHBOARD_PASSWORD_HASH={password_hash}

# Configuration SMTP
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SENDER_EMAIL=contact@lounarailtp.com
RECIPIENT_EMAIL=contact@lounarailtp.com

# Configuration Système
ALERT_ENABLED=true
CORS_ENABLED=true
ALLOWED_ORIGINS=*
"""
    
    # Sauvegarder le fichier
    with open('.env.vercel', 'w', encoding='utf-8') as f:
        f.write(env_content)
    
    print("\n✅ Fichier .env.vercel généré avec succès!")
    
    # Afficher les informations importantes
    print("\n📋 Informations importantes:")
    print(f"   Dashboard Username: admin")
    print(f"   Dashboard Password: {dashboard_password}")
    print(f"   Session Secret: {session_secret}")
    print(f"   Password Hash: {password_hash}")
    
    print("\n📝 Instructions pour Vercel:")
    print("1. Copiez le contenu du fichier .env.vercel")
    print("2. Dans votre dashboard Vercel, allez dans 'Settings' > 'Environment Variables'")
    print("3. Ajoutez chaque variable une par une")
    print("4. Redéployez votre application")
    
    return True

def generate_emailjs_config():
    """Génère la configuration EmailJS"""
    print("\n📧 Configuration EmailJS:")
    print("1. Allez sur https://www.emailjs.com/")
    print("2. Créez un compte gratuit")
    print("3. Dans 'Email Services', ajoutez un service 'Custom SMTP':")
    print("   - SMTP Server: smtp.gmail.com")
    print("   - Port: 587")
    print("   - Email: contact@lounarailtp.com")
    print("   - Password: [votre mot de passe d'application Gmail]")
    
    print("\n4. Dans 'Email Templates', créez un template:")
    template_content = """Nouveau message reçu via le formulaire de contact Louna Rail TP

Nom : {{from_name}}
Email : {{from_email}}
Message : {{message}}

---
Ce message a été envoyé depuis le site web lounarailtp.com"""
    
    print("Template à utiliser:")
    print("-" * 40)
    print(template_content)
    print("-" * 40)
    
    print("\n5. Récupérez vos clés:")
    public_key = input("Public Key: ").strip()
    service_id = input("Service ID: ").strip()
    template_id = input("Template ID: ").strip()
    
    if public_key and service_id and template_id:
        # Créer un fichier de configuration EmailJS
        emailjs_config = f"""// Configuration EmailJS - Louna Rail TP
// Remplacez dans tous les fichiers HTML

// Initialisation
emailjs.init("{public_key}");

// Envoi d'email
emailjs.send('{service_id}', '{template_id}', {{
    from_name: nom,
    from_email: email,
    message: message
}});
"""
        
        with open('emailjs_config.js', 'w', encoding='utf-8') as f:
            f.write(emailjs_config)
        
        print("\n✅ Fichier emailjs_config.js généré!")
        print("📝 Remplacez les clés dans vos fichiers HTML:")
        print(f"   - Public Key: {public_key}")
        print(f"   - Service ID: {service_id}")
        print(f"   - Template ID: {template_id}")
    
    return True

def main():
    """Fonction principale"""
    print("🔑 Générateur de Clés - Louna Rail TP")
    print("=" * 60)
    
    try:
        # Générer la configuration Vercel
        if not generate_vercel_env_file():
            return 1
        
        # Générer la configuration EmailJS
        generate_emailjs_config()
        
        print("\n🎉 Configuration terminée!")
        print("\n📋 Prochaines étapes:")
        print("1. Configurez les variables d'environnement dans Vercel")
        print("2. Remplacez les clés EmailJS dans vos fichiers HTML")
        print("3. Déployez sur Vercel")
        print("4. Testez le système")
        
        return 0
        
    except KeyboardInterrupt:
        print("\n\n❌ Configuration annulée")
        return 1
    except Exception as e:
        print(f"\n❌ Erreur: {str(e)}")
        return 1

if __name__ == "__main__":
    import sys
    sys.exit(main()) 