#!/usr/bin/env python3
"""
Script de test pour vérifier la configuration avant déploiement Vercel
"""

import os
import sys
import importlib.util
from pathlib import Path

def check_file_exists(filepath, description):
    """Vérifie si un fichier existe"""
    if os.path.exists(filepath):
        print(f"✅ {description}: {filepath}")
        return True
    else:
        print(f"❌ {description}: {filepath} - MANQUANT")
        return False

def check_python_dependencies():
    """Vérifie les dépendances Python"""
    required_packages = [
        'flask',
        'flask_cors',
        'flask_bcrypt',
        'flask_jwt_extended',
        'python_dotenv'
    ]
    
    missing_packages = []
    for package in required_packages:
        try:
            importlib.import_module(package.replace('-', '_'))
            print(f"✅ Package {package} installé")
        except ImportError:
            print(f"❌ Package {package} manquant")
            missing_packages.append(package)
    
    return len(missing_packages) == 0

def check_flask_app():
    """Vérifie que l'application Flask peut être importée"""
    try:
        from server import app
        print("✅ Application Flask importée avec succès")
        return True
    except Exception as e:
        print(f"❌ Erreur lors de l'import de l'app Flask: {e}")
        return False

def check_vercel_config():
    """Vérifie la configuration Vercel"""
    vercel_files = [
        ('vercel.json', 'Configuration Vercel'),
        ('requirements.txt', 'Dépendances Python'),
        ('api/index.py', 'Point d\'entrée Vercel'),
        ('package.json', 'Configuration Node.js')
    ]
    
    all_files_exist = True
    for filepath, description in vercel_files:
        if not check_file_exists(filepath, description):
            all_files_exist = False
    
    return all_files_exist

def check_static_files():
    """Vérifie les fichiers statiques essentiels"""
    static_files = [
        ('index.html', 'Page d\'accueil'),
        ('assets/css/styles.css', 'Styles CSS'),
        ('images/logo lr 2.png', 'Logo principal')
    ]
    
    all_files_exist = True
    for filepath, description in static_files:
        if not check_file_exists(filepath, description):
            all_files_exist = False
    
    return all_files_exist

def main():
    """Fonction principale de test"""
    print("🚀 Test de configuration pour déploiement Vercel")
    print("=" * 50)
    
    # Vérifications
    checks = [
        ("Configuration Vercel", check_vercel_config),
        ("Dépendances Python", check_python_dependencies),
        ("Application Flask", check_flask_app),
        ("Fichiers statiques", check_static_files)
    ]
    
    all_passed = True
    for check_name, check_func in checks:
        print(f"\n📋 {check_name}:")
        if not check_func():
            all_passed = False
    
    print("\n" + "=" * 50)
    if all_passed:
        print("🎉 Tous les tests sont passés! Le projet est prêt pour le déploiement.")
        print("\n📋 Prochaines étapes:")
        print("   1. Exécuter: vercel login")
        print("   2. Exécuter: vercel --prod")
        print("   3. Configurer les variables d'environnement dans Vercel Dashboard")
    else:
        print("❌ Certains tests ont échoué. Veuillez corriger les problèmes avant le déploiement.")
        sys.exit(1)

if __name__ == "__main__":
    main() 