#!/usr/bin/env python3
"""
Script de test pour vérifier la configuration avant déploiement Vercel
Louna Rail TP - Surveillance System
"""

import os
import sys
import hashlib
import requests
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv('config_surveillance.env')

def test_smtp_configuration():
    """Test de la configuration SMTP"""
    print("🔧 Test de la configuration SMTP...")
    
    smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
    smtp_port = int(os.getenv('SMTP_PORT', 587))
    sender_email = os.getenv('SENDER_EMAIL', 'contact@lounarailtp.com')
    sender_password = os.getenv('SENDER_PASSWORD', '')
    recipient_email = os.getenv('RECIPIENT_EMAIL', 'contact@lounarailtp.com')
    
    print(f"   SMTP Server: {smtp_server}")
    print(f"   SMTP Port: {smtp_port}")
    print(f"   Sender Email: {sender_email}")
    print(f"   Recipient Email: {recipient_email}")
    
    if not sender_password:
        print("   ❌ SENDER_PASSWORD non configuré")
        return False
    
    try:
        # Test de connexion SMTP
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(sender_email, sender_password)
        
        # Test d'envoi d'email
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = recipient_email
        msg['Subject'] = "Test Configuration Surveillance - Louna Rail TP"
        
        body = """
        Ceci est un test de configuration pour le système de surveillance Louna Rail TP.
        
        Si vous recevez cet email, la configuration SMTP est correcte.
        
        ---
        Système de surveillance Louna Rail TP
        """
        
        msg.attach(MIMEText(body, 'plain'))
        
        server.send_message(msg)
        server.quit()
        
        print("   ✅ Configuration SMTP OK - Email de test envoyé")
        return True
        
    except Exception as e:
        print(f"   ❌ Erreur SMTP: {str(e)}")
        return False

def test_dashboard_configuration():
    """Test de la configuration du dashboard"""
    print("\n🔐 Test de la configuration Dashboard...")
    
    username = os.getenv('DASHBOARD_USERNAME', 'admin')
    password_hash = os.getenv('DASHBOARD_PASSWORD_HASH', '')
    session_secret = os.getenv('SESSION_SECRET', '')
    
    print(f"   Username: {username}")
    print(f"   Password Hash: {password_hash[:10]}..." if password_hash else "   Password Hash: Non configuré")
    print(f"   Session Secret: {session_secret[:10]}..." if session_secret else "   Session Secret: Non configuré")
    
    # Test du hash du mot de passe par défaut
    default_password = "password"
    expected_hash = hashlib.sha256(default_password.encode()).hexdigest()
    
    if password_hash == expected_hash:
        print("   ✅ Hash du mot de passe OK")
    else:
        print("   ⚠️  Hash du mot de passe différent du mot de passe par défaut")
    
    if session_secret:
        print("   ✅ Session Secret configuré")
    else:
        print("   ⚠️  Session Secret non configuré")
    
    return True

def test_api_endpoints():
    """Test des endpoints de l'API"""
    print("\n🌐 Test des endpoints API...")
    
    # URL de base (à adapter selon votre déploiement)
    base_url = "http://localhost:5001"
    
    endpoints = [
        "/api/violation",
        "/api/stats",
        "/api/violations",
        "/api/auth/login",
        "/api/auth/logout",
        "/api/auth/verify"
    ]
    
    for endpoint in endpoints:
        try:
            response = requests.get(f"{base_url}{endpoint}", timeout=5)
            print(f"   {endpoint}: {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"   {endpoint}: ❌ Erreur de connexion")
    
    return True

def test_files_existence():
    """Test de l'existence des fichiers nécessaires"""
    print("\n📁 Test des fichiers nécessaires...")
    
    required_files = [
        "api/surveillance.py",
        "requirements_surveillance.txt",
        "vercel.json",
        "dashboard_surveillance.html",
        "config_surveillance.env"
    ]
    
    all_exist = True
    for file_path in required_files:
        if os.path.exists(file_path):
            print(f"   ✅ {file_path}")
        else:
            print(f"   ❌ {file_path} - MANQUANT")
            all_exist = False
    
    return all_exist

def test_environment_variables():
    """Test des variables d'environnement"""
    print("\n🔧 Test des variables d'environnement...")
    
    required_vars = [
        'SMTP_SERVER',
        'SMTP_PORT',
        'SENDER_EMAIL',
        'RECIPIENT_EMAIL',
        'DASHBOARD_USERNAME'
    ]
    
    optional_vars = [
        'SENDER_PASSWORD',
        'DASHBOARD_PASSWORD_HASH',
        'SESSION_SECRET'
    ]
    
    all_required = True
    for var in required_vars:
        value = os.getenv(var)
        if value:
            print(f"   ✅ {var}: {value}")
        else:
            print(f"   ❌ {var}: Non configuré")
            all_required = False
    
    print("\n   Variables optionnelles (pour Vercel):")
    for var in optional_vars:
        value = os.getenv(var)
        if value:
            print(f"   ✅ {var}: Configuré")
        else:
            print(f"   ⚠️  {var}: Non configuré")
    
    return all_required

def main():
    """Fonction principale de test"""
    print("🚀 Test de Configuration - Louna Rail TP Surveillance")
    print("=" * 60)
    
    tests = [
        ("Fichiers nécessaires", test_files_existence),
        ("Variables d'environnement", test_environment_variables),
        ("Configuration Dashboard", test_dashboard_configuration),
        ("Configuration SMTP", test_smtp_configuration),
        ("Endpoints API", test_api_endpoints)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"   ❌ Erreur lors du test {test_name}: {str(e)}")
            results.append((test_name, False))
    
    # Résumé
    print("\n" + "=" * 60)
    print("📊 RÉSUMÉ DES TESTS")
    print("=" * 60)
    
    passed = 0
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} {test_name}")
        if result:
            passed += 1
    
    print(f"\nRésultat: {passed}/{total} tests réussis")
    
    if passed == total:
        print("🎉 Tous les tests sont passés ! Le déploiement est prêt.")
        print("\n📋 Prochaines étapes:")
        print("1. Configurez SENDER_PASSWORD dans Vercel")
        print("2. Générez un SESSION_SECRET aléatoire")
        print("3. Déployez sur Vercel")
        print("4. Testez le dashboard")
    else:
        print("⚠️  Certains tests ont échoué. Vérifiez la configuration.")
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main()) 