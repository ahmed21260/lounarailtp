from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import json
from config import Config

app = Flask(__name__)
CORS(app)

# Configuration email depuis config.py
EMAIL_CONFIG = Config.get_email_config()

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

# Cette nouvelle route générique sert tous les autres fichiers (HTML, CSS, JS, images...)
@app.route('/<path:path>')
def static_proxy(path):
    return send_from_directory('.', path)

@app.route('/api/contact', methods=['POST'])
def contact():
    try:
        data = request.get_json()
        
        # Validation des données
        if not data or not all(key in data for key in ['nom', 'email', 'message']):
            return jsonify({'success': False, 'message': 'Données manquantes'}), 400
        
        nom = data['nom'].strip()
        email = data['email'].strip()
        message = data['message'].strip()
        
        if not nom or not email or not message:
            return jsonify({'success': False, 'message': 'Tous les champs sont obligatoires'}), 400
        
        # Validation email basique
        if '@' not in email or '.' not in email:
            return jsonify({'success': False, 'message': 'Format email invalide'}), 400
        
        # Préparation de l'email
        subject = f"Nouveau message de {nom} - {Config.SITE_NAME}"
        
        email_content = f"""
        Nouveau message reçu via le formulaire de contact :
        
        Nom : {nom}
        Email : {email}
        Message : {message}
        
        ---
        Ce message a été envoyé depuis le site web {Config.SITE_NAME} ({Config.DOMAIN}).
        """
        
        # Vérification de la configuration email
        if not EMAIL_CONFIG['sender_password']:
            print("⚠️ Mot de passe email non configuré - simulation d'envoi")
            print(f"Message simulé de {nom} ({email}): {message}")
            return jsonify({
                'success': True, 
                'message': 'Votre message a été reçu ! Nous vous répondrons dans les plus brefs délais.'
            })
        
        # Envoi de l'email
        try:
            msg = MIMEMultipart()
            msg['From'] = EMAIL_CONFIG['sender_email']
            msg['To'] = EMAIL_CONFIG['recipient_email']
            msg['Subject'] = subject
            
            msg.attach(MIMEText(email_content, 'plain'))
            
            server = smtplib.SMTP(EMAIL_CONFIG['smtp_server'], EMAIL_CONFIG['smtp_port'])
            server.starttls()
            server.login(EMAIL_CONFIG['sender_email'], EMAIL_CONFIG['sender_password'])
            server.send_message(msg)
            server.quit()
            
            print(f"✅ Email envoyé avec succès de {nom} ({email}) vers {EMAIL_CONFIG['recipient_email']}")
            
        except smtplib.SMTPAuthenticationError:
            print("❌ Erreur d'authentification SMTP - Vérifiez vos identifiants")
            return jsonify({
                'success': False, 
                'message': 'Erreur de configuration email. Veuillez contacter l\'administrateur.'
            }), 500
            
        except smtplib.SMTPException as e:
            print(f"❌ Erreur SMTP: {str(e)}")
            return jsonify({
                'success': False, 
                'message': 'Erreur lors de l\'envoi de l\'email. Veuillez réessayer.'
            }), 500
        
        return jsonify({
            'success': True, 
            'message': 'Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.'
        })
        
    except Exception as e:
        print(f"Erreur lors de l'envoi: {str(e)}")
        return jsonify({
            'success': False, 
            'message': 'Une erreur est survenue lors de l\'envoi. Veuillez réessayer.'
        }), 500

@app.route('/api/test')
def test():
    return jsonify({
        'status': 'OK', 
        'message': 'Serveur opérationnel',
        'domain': Config.DOMAIN,
        'email_configured': bool(EMAIL_CONFIG['sender_password'])
    })

if __name__ == '__main__':
    print(f"🚀 Serveur {Config.SITE_NAME} démarré sur http://localhost:5000")
    print(f"📧 API Contact: http://localhost:5000/api/contact")
    print(f"🧪 Test API: http://localhost:5000/api/test")
    print(f"🌐 Domaine: {Config.DOMAIN}")
    print(f"📮 Email configuré: {'✅' if EMAIL_CONFIG['sender_password'] else '❌'}")
    app.run(debug=Config.DEBUG, host='0.0.0.0', port=5000) 