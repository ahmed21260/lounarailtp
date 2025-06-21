#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SYSTÈME DE SURVEILLANCE RÉSEAU LOUNA RAIL TP
© 2025 Ahmed Chaira - Tous droits réservés

Endpoint API pour la centralisation des violations et envoi d'alertes
"""

import json
import smtplib
import sqlite3
import logging
from datetime import datetime, timedelta
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import hashlib
import secrets

# Chargement des variables d'environnement
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('surveillance.log'),
        logging.StreamHandler()
    ]
)

# Configuration email (synchronisée avec config.py)
EMAIL_CONFIG = {
    'smtp_server': os.getenv('SMTP_SERVER', 'smtp.gmail.com'),
    'smtp_port': int(os.getenv('SMTP_PORT', 587)),
    'email': os.getenv('SENDER_EMAIL', 'contact@lounarailtp.com'),
    'password': os.getenv('SENDER_PASSWORD', ''),
    'alert_recipient': os.getenv('RECIPIENT_EMAIL', 'contact@lounarailtp.com')
}

# Configuration authentification dashboard
DASHBOARD_CONFIG = {
    'admin_username': os.getenv('DASHBOARD_USERNAME', 'admin'),
    'admin_password_hash': os.getenv('DASHBOARD_PASSWORD_HASH', ''),
    'session_secret': os.getenv('SESSION_SECRET', secrets.token_hex(32))
}

# Configuration base de données
DB_PATH = 'surveillance_violations.db'

# Stockage des sessions actives (en production, utilisez Redis)
active_sessions = {}

def create_session(user_id):
    """Crée une session sécurisée pour l'utilisateur"""
    session_id = secrets.token_hex(32)
    expiry = datetime.now() + timedelta(hours=24)
    active_sessions[session_id] = {
        'user_id': user_id,
        'expires': expiry
    }
    return session_id

def validate_session(session_id):
    """Valide une session et retourne l'utilisateur si valide"""
    if session_id not in active_sessions:
        return None
    
    session = active_sessions[session_id]
    if datetime.now() > session['expires']:
        del active_sessions[session_id]
        return None
    
    return session['user_id']

def hash_password(password):
    """Hash un mot de passe avec SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

def init_database():
    """Initialise la base de données pour stocker les violations"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS violations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT NOT NULL,
            violation_type TEXT NOT NULL,
            details TEXT,
            user_agent TEXT,
            ip_address TEXT,
            url TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            email_sent BOOLEAN DEFAULT FALSE,
            email_sent_at DATETIME
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT UNIQUE NOT NULL,
            start_time DATETIME,
            end_time DATETIME,
            total_violations INTEGER DEFAULT 0,
            user_agent TEXT,
            ip_address TEXT
        )
    ''')
    
    conn.commit()
    conn.close()
    logging.info("Base de données de surveillance initialisée")

def send_alert_email(violation_data):
    """Envoie une alerte par email pour chaque violation"""
    try:
        # Préparation du message
        msg = MIMEMultipart()
        msg['From'] = EMAIL_CONFIG['email']
        msg['To'] = EMAIL_CONFIG['alert_recipient']
        msg['Subject'] = f"🚨 ALERTE SURVEILLANCE LOUNA RAIL TP - {violation_data['type']}"
        
        # Corps du message
        body = f"""
🚨 VIOLATION DÉTECTÉE SUR LE SITE LOUNA RAIL TP 🚨

📊 DÉTAILS DE LA VIOLATION :
• Type : {violation_data['type']}
• Session ID : {violation_data['sessionId']}
• URL : {violation_data['url']}
• Timestamp : {violation_data['timestamp']}
• User Agent : {violation_data['userAgent']}

🔍 DÉTAILS TECHNIQUES :
{json.dumps(violation_data['details'], indent=2, ensure_ascii=False)}

🌐 INFORMATIONS SESSION :
• IP : {violation_data.get('ip', 'Non détectée')}
• Page visitée : {violation_data['url']}

⚠️ ACTION REQUISE :
Cette violation a été automatiquement enregistrée dans notre système de surveillance.
Toute tentative de copie, reproduction ou ingénierie inverse est strictement interdite.

© 2025 Ahmed Chaira - Louna Rail TP
Système de surveillance automatique
        """
        
        msg.attach(MIMEText(body, 'plain', 'utf-8'))
        
        # Connexion et envoi
        server = smtplib.SMTP(EMAIL_CONFIG['smtp_server'], EMAIL_CONFIG['smtp_port'])
        server.starttls()
        server.login(EMAIL_CONFIG['email'], EMAIL_CONFIG['password'])
        server.send_message(msg)
        server.quit()
        
        logging.info(f"Email d'alerte envoyé pour violation: {violation_data['type']}")
        return True
        
    except Exception as e:
        logging.error(f"Erreur lors de l'envoi de l'email d'alerte: {str(e)}")
        return False

def store_violation(violation_data):
    """Stocke la violation dans la base de données"""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Récupération de l'IP
        ip_address = request.remote_addr if request else 'Unknown'
        
        # Insertion de la violation
        cursor.execute('''
            INSERT INTO violations 
            (session_id, violation_type, details, user_agent, ip_address, url, timestamp)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            violation_data['sessionId'],
            violation_data['type'],
            json.dumps(violation_data['details']),
            violation_data['userAgent'],
            ip_address,
            violation_data['url'],
            violation_data['timestamp']
        ))
        
        # Mise à jour du compteur de violations pour la session
        cursor.execute('''
            INSERT OR REPLACE INTO sessions 
            (session_id, start_time, total_violations, user_agent, ip_address)
            VALUES (?, ?, 
                COALESCE((SELECT total_violations FROM sessions WHERE session_id = ?), 0) + 1,
                ?, ?)
        ''', (
            violation_data['sessionId'],
            violation_data['timestamp'],
            violation_data['sessionId'],
            violation_data['userAgent'],
            ip_address
        ))
        
        conn.commit()
        conn.close()
        
        logging.info(f"Violation stockée: {violation_data['type']} - Session: {violation_data['sessionId']}")
        return True
        
    except Exception as e:
        logging.error(f"Erreur lors du stockage de la violation: {str(e)}")
        return False

@app.route('/api/violation', methods=['POST'])
def receive_violation():
    """Endpoint pour recevoir les violations de surveillance"""
    try:
        # Récupération des données
        violation_data = request.get_json()
        
        if not violation_data:
            return jsonify({'success': False, 'error': 'Données manquantes'}), 400
        
        # Validation des données requises
        required_fields = ['type', 'sessionId', 'userAgent', 'url', 'timestamp', 'details']
        for field in required_fields:
            if field not in violation_data:
                return jsonify({'success': False, 'error': f'Champ manquant: {field}'}), 400
        
        # Ajout de l'IP
        violation_data['ip'] = request.remote_addr
        
        # Stockage en base
        if store_violation(violation_data):
            # Envoi de l'alerte email
            email_sent = send_alert_email(violation_data)
            
            # Log de la violation
            logging.warning(f"VIOLATION DÉTECTÉE: {violation_data['type']} - IP: {violation_data['ip']} - Session: {violation_data['sessionId']}")
            
            return jsonify({
                'success': True,
                'message': 'Violation enregistrée et alerte envoyée',
                'email_sent': email_sent,
                'violation_id': violation_data['sessionId']
            })
        else:
            return jsonify({'success': False, 'error': 'Erreur lors du stockage'}), 500
            
    except Exception as e:
        logging.error(f"Erreur lors du traitement de la violation: {str(e)}")
        return jsonify({'success': False, 'error': 'Erreur interne'}), 500

@app.route('/api/surveillance/stats', methods=['GET'])
def get_surveillance_stats():
    """Endpoint pour obtenir les statistiques de surveillance"""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Statistiques globales
        cursor.execute('SELECT COUNT(*) FROM violations')
        total_violations = cursor.fetchone()[0]
        
        cursor.execute('SELECT COUNT(DISTINCT session_id) FROM violations')
        unique_sessions = cursor.fetchone()[0]
        
        # Violations par type
        cursor.execute('''
            SELECT violation_type, COUNT(*) 
            FROM violations 
            GROUP BY violation_type 
            ORDER BY COUNT(*) DESC
        ''')
        violations_by_type = dict(cursor.fetchall())
        
        # Violations récentes (24h)
        cursor.execute('''
            SELECT COUNT(*) 
            FROM violations 
            WHERE timestamp > datetime('now', '-1 day')
        ''')
        violations_24h = cursor.fetchone()[0]
        
        conn.close()
        
        return jsonify({
            'success': True,
            'stats': {
                'total_violations': total_violations,
                'unique_sessions': unique_sessions,
                'violations_24h': violations_24h,
                'violations_by_type': violations_by_type,
                'last_update': datetime.now().isoformat()
            }
        })
        
    except Exception as e:
        logging.error(f"Erreur lors de la récupération des stats: {str(e)}")
        return jsonify({'success': False, 'error': 'Erreur interne'}), 500

@app.route('/api/surveillance/logs', methods=['GET'])
def get_surveillance_logs():
    """Endpoint pour obtenir les logs de surveillance"""
    try:
        limit = request.args.get('limit', 100, type=int)
        offset = request.args.get('offset', 0, type=int)
        
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT session_id, violation_type, details, user_agent, ip_address, url, timestamp
            FROM violations 
            ORDER BY timestamp DESC 
            LIMIT ? OFFSET ?
        ''', (limit, offset))
        
        violations = []
        for row in cursor.fetchall():
            violations.append({
                'session_id': row[0],
                'type': row[1],
                'details': json.loads(row[2]) if row[2] else {},
                'user_agent': row[3],
                'ip_address': row[4],
                'url': row[5],
                'timestamp': row[6]
            })
        
        conn.close()
        
        return jsonify({
            'success': True,
            'violations': violations,
            'total': len(violations)
        })
        
    except Exception as e:
        logging.error(f"Erreur lors de la récupération des logs: {str(e)}")
        return jsonify({'success': False, 'error': 'Erreur interne'}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Route d'authentification pour le dashboard"""
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'error': 'Nom d\'utilisateur et mot de passe requis'}), 400
        
        # Vérification des identifiants
        if (username == DASHBOARD_CONFIG['admin_username'] and 
            hash_password(password) == DASHBOARD_CONFIG['admin_password_hash']):
            
            session_id = create_session(username)
            return jsonify({
                'success': True,
                'session_id': session_id,
                'message': 'Connexion réussie'
            })
        else:
            return jsonify({'error': 'Identifiants invalides'}), 401
            
    except Exception as e:
        logging.error(f"Erreur lors de la connexion: {str(e)}")
        return jsonify({'error': 'Erreur serveur'}), 500

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    """Route de déconnexion"""
    try:
        data = request.get_json()
        session_id = data.get('session_id')
        
        if session_id and session_id in active_sessions:
            del active_sessions[session_id]
        
        return jsonify({'success': True, 'message': 'Déconnexion réussie'})
        
    except Exception as e:
        logging.error(f"Erreur lors de la déconnexion: {str(e)}")
        return jsonify({'error': 'Erreur serveur'}), 500

@app.route('/api/auth/verify', methods=['POST'])
def verify_session():
    """Vérifie si une session est valide"""
    try:
        data = request.get_json()
        session_id = data.get('session_id')
        
        user_id = validate_session(session_id)
        if user_id:
            return jsonify({'valid': True, 'user_id': user_id})
        else:
            return jsonify({'valid': False}), 401
            
    except Exception as e:
        logging.error(f"Erreur lors de la vérification de session: {str(e)}")
        return jsonify({'error': 'Erreur serveur'}), 500

if __name__ == '__main__':
    # Initialisation de la base de données
    init_database()
    
    # Démarrage du serveur
    port = int(os.getenv('SURVEILLANCE_PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=False)
    logging.info(f"Serveur de surveillance démarré sur le port {port}") 