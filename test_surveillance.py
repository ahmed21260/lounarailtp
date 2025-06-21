#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SCRIPT DE TEST - SYSTÈME DE SURVEILLANCE LOUNA RAIL TP
© 2025 Ahmed Chaira - Tous droits réservés

Teste le fonctionnement du système de surveillance
"""

import requests
import json
import time
from datetime import datetime

def test_surveillance_system():
    """Teste le système de surveillance"""
    print("🧪 TEST DU SYSTÈME DE SURVEILLANCE LOUNA RAIL TP")
    print("=" * 60)
    
    # Configuration
    base_url = "http://localhost:5001"
    
    # Test 1: Vérification de la connectivité
    print("1️⃣ Test de connectivité...")
    try:
        response = requests.get(f"{base_url}/api/surveillance/stats", timeout=5)
        if response.status_code == 200:
            print("✅ Serveur de surveillance accessible")
        else:
            print(f"❌ Erreur serveur: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Serveur non accessible: {e}")
        print("💡 Assurez-vous que le serveur de surveillance est démarré")
        return False
    
    # Test 2: Envoi d'une violation de test
    print("2️⃣ Test d'envoi de violation...")
    test_violation = {
        "type": "TEST_VIOLATION",
        "sessionId": f"test_session_{int(time.time())}",
        "userAgent": "Test Browser/1.0",
        "url": "http://localhost/test",
        "timestamp": datetime.now().isoformat(),
        "details": {
            "test": True,
            "message": "Test du système de surveillance"
        }
    }
    
    try:
        response = requests.post(
            f"{base_url}/api/violation",
            json=test_violation,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        if response.status_code == 200:
            result = response.json()
            if result.get('success'):
                print("✅ Violation de test envoyée avec succès")
                print(f"   Email envoyé: {result.get('email_sent', False)}")
            else:
                print(f"❌ Erreur lors de l'envoi: {result.get('error')}")
        else:
            print(f"❌ Erreur HTTP: {response.status_code}")
    except Exception as e:
        print(f"❌ Erreur lors du test: {e}")
    
    # Test 3: Récupération des statistiques
    print("3️⃣ Test des statistiques...")
    try:
        response = requests.get(f"{base_url}/api/surveillance/stats", timeout=5)
        if response.status_code == 200:
            stats = response.json()
            if stats.get('success'):
                data = stats.get('stats', {})
                print("✅ Statistiques récupérées:")
                print(f"   - Total violations: {data.get('total_violations', 0)}")
                print(f"   - Sessions uniques: {data.get('unique_sessions', 0)}")
                print(f"   - Violations 24h: {data.get('violations_24h', 0)}")
            else:
                print(f"❌ Erreur stats: {stats.get('error')}")
        else:
            print(f"❌ Erreur HTTP stats: {response.status_code}")
    except Exception as e:
        print(f"❌ Erreur récupération stats: {e}")
    
    # Test 4: Récupération des logs
    print("4️⃣ Test des logs...")
    try:
        response = requests.get(f"{base_url}/api/surveillance/logs?limit=5", timeout=5)
        if response.status_code == 200:
            logs = response.json()
            if logs.get('success'):
                violations = logs.get('violations', [])
                print(f"✅ {len(violations)} violations récupérées")
                for i, violation in enumerate(violations[:3]):
                    print(f"   {i+1}. {violation.get('type')} - {violation.get('timestamp')}")
            else:
                print(f"❌ Erreur logs: {logs.get('error')}")
        else:
            print(f"❌ Erreur HTTP logs: {response.status_code}")
    except Exception as e:
        print(f"❌ Erreur récupération logs: {e}")
    
    print("=" * 60)
    print("🎯 Tests terminés")
    print("📧 Vérifiez votre email contact@lounarailtp.com pour les alertes")
    print("📝 Consultez les logs dans logs/surveillance.log")
    
    return True

def test_email_config():
    """Teste la configuration email"""
    print("📧 TEST DE LA CONFIGURATION EMAIL")
    print("=" * 40)
    
    try:
        from dotenv import load_dotenv
        import os
        
        load_dotenv('config_surveillance.env')
        
        email = os.getenv('SURVEILLANCE_EMAIL')
        password = os.getenv('EMAIL_PASSWORD')
        
        print(f"Email: {email}")
        print(f"Mot de passe configuré: {'✅' if password and password != 'votre_mot_de_passe_app_gmail' else '❌'}")
        
        if not password or password == 'votre_mot_de_passe_app_gmail':
            print("⚠️ IMPORTANT: Configurez votre mot de passe Gmail dans config_surveillance.env")
            print("   Utilisez un mot de passe d'application Gmail")
        
    except Exception as e:
        print(f"❌ Erreur configuration email: {e}")

if __name__ == '__main__':
    print("🚨 SYSTÈME DE SURVEILLANCE LOUNA RAIL TP - TESTS")
    print("© 2025 Ahmed Chaira - Tous droits réservés")
    print()
    
    # Test de la configuration email
    test_email_config()
    print()
    
    # Test du système de surveillance
    test_surveillance_system() 