from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import json
from config import Config
import sqlite3
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager
from datetime import timedelta, datetime

# Les variables sont déjà chargées par config.py

app = Flask(__name__, static_folder='.', static_url_path='')
app.config["JWT_SECRET_KEY"] = Config.SECRET_KEY
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
app.config["JWT_TOKEN_LOCATION"] = ["headers"]
app.config["JWT_HEADER_NAME"] = "Authorization"
app.config["JWT_HEADER_TYPE"] = "Bearer"

CORS(app, resources={r"/api/*": {"origins": "*"}})
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
DATABASE = Config.DATABASE

# Configuration email depuis config.py
EMAIL_CONFIG = Config.get_email_config()

# Vérification de la configuration email au démarrage
email_configured = EMAIL_CONFIG['sender_password'] and EMAIL_CONFIG['sender_password'] != ''
print(f"Email config: {'OK' if email_configured else 'KO'}")
if not email_configured:
    print("   /!\\ SENDER_PASSWORD n'est pas configure dans config_surveillance.env")

# --- Gestion de la base de données ---
def get_db():
    db = sqlite3.connect(DATABASE)
    db.row_factory = sqlite3.Row
    return db

def setup_database():
    """Crée les tables si elles n'existent pas."""
    conn = get_db()
    # Activer les clés étrangères pour assurer l'intégrité des données
    conn.execute("PRAGMA foreign_keys = ON;")
    
    # Création de la table des tentatives de quiz
    conn.execute('''
        CREATE TABLE IF NOT EXISTS quiz_attempts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            quiz_id TEXT NOT NULL,
            score INTEGER NOT NULL,
            passed BOOLEAN NOT NULL,
            attempt_date DATETIME NOT NULL,
            time_taken_seconds INTEGER NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        );
    ''')
    
    print("DB Check: Table 'quiz_attempts' OK.")
    conn.commit()
    conn.close()

def init_db():
    with app.app_context():
        db = get_db()
        with app.open_resource('schema.sql', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()

@app.cli.command('initdb')
def initdb_command():
    """Initialise la base de données."""
    init_db()
    print('Base de données initialisée.')

# --- Modèle Utilisateur ---
class User(object):
    def __init__(self, id, email, first_name, last_name):
        self.id = id
        self.email = email
        self.first_name = first_name
        self.last_name = last_name

    def __str__(self):
        return f"User(id='{self.id}')"

def fetch_user_by_id(user_id):
    conn = get_db()
    user_data = conn.execute('SELECT id, email, first_name, last_name FROM users WHERE id = ?', (user_id,)).fetchone()
    conn.close()
    if user_data:
        return User(id=user_data['id'], email=user_data['email'], first_name=user_data['first_name'], last_name=user_data['last_name'])
    return None

# --- Routes API ---
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email', None)
    password = data.get('password', None)

    conn = get_db()
    user_data = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
    conn.close()

    if user_data and bcrypt.check_password_hash(user_data['password_hash'], password):
        # L'identité du jeton est maintenant juste l'ID de l'utilisateur (une chaîne de caractères)
        access_token = create_access_token(identity=str(user_data['id']))
        return jsonify(access_token=access_token)

    return jsonify({"msg": "Email ou mot de passe incorrect"}), 401

# Lancer la configuration de la base de données au démarrage
with app.app_context():
    setup_database()

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'success': False, 'message': 'Données manquantes'}), 400

    email = data['email'].lower().strip()
    password = data['password']
    # On récupère aussi le prénom et le nom depuis le formulaire d'inscription
    first_name = data.get('first_name', '')
    last_name = data.get('last_name', '')

    conn = get_db()
    existing_user = conn.execute('SELECT id FROM users WHERE email = ?', (email,)).fetchone()
    if existing_user:
        conn.close()
        return jsonify({'success': False, 'message': 'Cet email est déjà utilisé'}), 409

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    
    try:
        conn.execute('INSERT INTO users (email, password_hash, first_name, last_name) VALUES (?, ?, ?, ?)',
                     (email, hashed_password, first_name, last_name))
        conn.commit()
    except sqlite3.Error as e:
        conn.close()
        return jsonify({"msg": f"Erreur de base de données : {e}"}), 500

    conn.close()
    return jsonify({"msg": "Inscription réussie"}), 201

@app.route('/api/submit-quiz-result', methods=['POST'])
@jwt_required()
def submit_quiz_result():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # --- BLOC DE DIAGNOSTIC AMÉLIORÉ ---
    print("\n--- [DIAGNOSTIC] Réception d'un résultat de quiz ---")
    print(f"  - User ID: {user_id}")
    print(f"  - Données reçues: {data}")

    required_fields = ['quiz_id', 'score', 'passed', 'time_taken_seconds', 'formation_id']
    if not all(field in data for field in required_fields):
        print("  - ERREUR: Champs manquants.")
        return jsonify({"msg": "Données manquantes"}), 400

    score = data['score']
    passed = data['passed']
    formation_id = data['formation_id']
    
    print(f"  - Quiz Réussi (Passed): {passed}")
    
    conn = get_db()
    try:
        conn.execute("PRAGMA foreign_keys = ON;")
        
        # 1. Enregistrer la tentative dans l'historique (toujours)
        conn.execute(
            '''INSERT INTO quiz_attempts (user_id, quiz_id, score, passed, attempt_date, time_taken_seconds)
               VALUES (?, ?, ?, ?, datetime('now'), ?)''',
            (user_id, data['quiz_id'], score, passed, data['time_taken_seconds'])
        )
        print("  - Succès: Tentative enregistrée dans 'quiz_attempts'.")
        
        # 2. Si le quiz est réussi, tenter de mettre à jour la progression
        if passed:
            print(f"  - Tentative de mise à jour de la progression pour la formation ID: {formation_id}")
            cursor = conn.execute(
                '''UPDATE enrollments 
                   SET progress = ? 
                   WHERE user_id = ? AND formation_id = ? AND progress < ?''',
                (score, user_id, formation_id, score)
            )
            
            if cursor.rowcount > 0:
                print(f"  - SUCCÈS: {cursor.rowcount} ligne(s) mise(s) à jour dans 'enrollments'. La progression devrait être visible.")
            else:
                print("  - INFO: Aucune ligne mise à jour dans 'enrollments'. Raisons possibles :")
                print("    1. Le score actuel est inférieur ou égal au score déjà enregistré.")
                print("    2. L'utilisateur n'est pas inscrit à cette formation (ID de formation incorrect ?).")
        else:
            print("  - INFO: Le quiz n'a pas été réussi. La progression n'est pas mise à jour.")

        conn.commit()
        
    except sqlite3.IntegrityError as e:
        conn.close()
        print(f"  - ERREUR D'INTÉGRITÉ: {e}. L'ID utilisateur ou l'ID de formation est-il valide ?")
        return jsonify({"msg": f"Erreur d'intégrité de la base de données : {e}"}), 500
    except sqlite3.Error as e:
        conn.close()
        print(f"  - ERREUR DB: {e}")
        return jsonify({"msg": f"Erreur de base de données : {e}"}), 500
    
    conn.close()
    print("--- [DIAGNOSTIC] Fin du traitement ---")
    return jsonify({"msg": "Résultat du quiz enregistré avec succès"}), 200

@app.route('/api/quiz-history', methods=['GET'])
@jwt_required()
def get_quiz_history():
    user_id = get_jwt_identity()
    conn = get_db()
    try:
        attempts = conn.execute(
            'SELECT quiz_id, score, passed, attempt_date, time_taken_seconds FROM quiz_attempts WHERE user_id = ? ORDER BY attempt_date DESC',
            (user_id,)
        ).fetchall()
        
        # Convertir les lignes de la base de données en une liste de dictionnaires
        history = [dict(row) for row in attempts]
        
    except sqlite3.Error as e:
        conn.close()
        return jsonify({"msg": f"Erreur de base de données : {e}"}), 500
    
    conn.close()
    return jsonify(history), 200

@app.route('/api/update-progress', methods=['POST'])
@jwt_required()
def update_user_progress():
    # Cette route est maintenant obsolète et sera supprimée, 
    # mais on la garde temporairement pour éviter des erreurs 404
    return jsonify({"msg": "Cette route est obsolète. Utilisez /api/submit-quiz-result."}), 410

@app.route('/api/user', methods=['GET'])
@jwt_required()
def get_user_profile():
    # On récupère l'ID de l'utilisateur depuis le jeton
    current_user_id = get_jwt_identity()
    user = fetch_user_by_id(current_user_id)
    
    if not user:
        return jsonify({"msg": "Utilisateur non trouvé"}), 404

    # On retourne les informations complètes de l'utilisateur
    return jsonify({
        "id": user.id,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name
    })

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
        "message": "API de test Louna Rail TP - OK",
        "email_configured": email_configured,
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/enroll', methods=['POST'])
@jwt_required()
def enroll_in_formation():
    user_id = get_jwt_identity()
    data = request.get_json()
    formation_id = data.get('formation_id')

    if not formation_id:
        return jsonify({"msg": "ID de formation manquant"}), 400

    conn = get_db()
    # Vérifier que l'inscription n'existe pas déjà
    existing = conn.execute('SELECT id FROM enrollments WHERE user_id = ? AND formation_id = ?', (user_id, formation_id)).fetchone()
    if existing:
        conn.close()
        return jsonify({"msg": "Déjà inscrit à cette formation"}), 409

    conn.execute('INSERT INTO enrollments (user_id, formation_id, progress) VALUES (?, ?, ?)', (user_id, formation_id, 0))
    conn.commit()
    conn.close()
    
    return jsonify({"msg": "Inscription réussie"}), 201

@app.route('/api/dashboard-data', methods=['GET'])
@jwt_required()
def get_dashboard_data():
    user_id = get_jwt_identity()
    conn = get_db()
    
    try:
        # --- BLOC D'AUTO-RÉPARATION DES INSCRIPTIONS ---
        # 1. Obtenir toutes les formations existantes
        all_formations_cursor = conn.execute('SELECT id FROM formations').fetchall()
        all_formation_ids = {row['id'] for row in all_formations_cursor}
        
        # 2. Obtenir les formations auxquelles l'utilisateur est déjà inscrit
        enrolled_formations_cursor = conn.execute('SELECT formation_id FROM enrollments WHERE user_id = ?', (user_id,)).fetchall()
        enrolled_formation_ids = {row['formation_id'] for row in enrolled_formations_cursor}
        
        # 3. Trouver les inscriptions manquantes
        missing_enrollments = all_formation_ids - enrolled_formation_ids
        
        # 4. S'il en manque, les créer avec une progression de 0
        if missing_enrollments:
            print(f"INFO: Auto-inscription de l'utilisateur {user_id} aux formations manquantes: {missing_enrollments}")
            for formation_id in missing_enrollments:
                conn.execute('INSERT INTO enrollments (user_id, formation_id, progress) VALUES (?, ?, 0)', (user_id, formation_id))
            conn.commit()
        # --- FIN DU BLOC D'AUTO-RÉPARATION ---

        # Récupérer les données du tableau de bord (maintenant à jour)
        enrollments_data = conn.execute(
            'SELECT f.id, f.name, f.description, f.image_url, e.progress '
            'FROM formations f JOIN enrollments e ON f.id = e.formation_id '
            'WHERE e.user_id = ?',
            (user_id,)
        ).fetchall()
        
        user_info = conn.execute('SELECT email, first_name FROM users WHERE id = ?', (user_id,)).fetchone()

    except sqlite3.Error as e:
        conn.close()
        return jsonify({"msg": f"Erreur de base de données: {e}"}), 500

    conn.close()
    
    # Formatter les données pour le client
    formations_list = [dict(row) for row in enrollments_data]
    user_details = dict(user_info) if user_info else {}
    
    return jsonify({
        "user": user_details,
        "formations": formations_list
    })

@app.route('/api/all-formations', methods=['GET'])
@jwt_required()
def get_all_formations():
    conn = get_db()
    formations_data = conn.execute('SELECT id, name, description, image_url FROM formations').fetchall()
    conn.close()
    formations = [dict(row) for row in formations_data]
    return jsonify(formations)

# --- Service des fichiers statiques ---

@app.route('/')
def serve_index():
    # Sert la page d'accueil par défaut quand on accède à la racine du site
    static_folder = app.static_folder or ''
    return send_from_directory(static_folder, 'lounarailtp.html')

@app.route('/<path:path>')
def serve_static_files(path):
    # Sert n'importe quel autre fichier (HTML, JS, CSS, image, etc.)
    # send_from_directory est sécurisé contre les attaques de traversée de répertoire
    static_folder = app.static_folder or ''
    return send_from_directory(static_folder, path)

# --- Démarrage du serveur ---
if __name__ == '__main__':
    print(f"Demarrage du serveur Louna Rail TP sur http://localhost:{os.getenv('PORT', 5000)}")
    app.run(
        host=os.getenv('HOST', '0.0.0.0'),
        port=int(os.getenv('PORT', 5000)),
        debug=Config.DEBUG
    ) 