import sqlite3
import bcrypt
import os

def init_vercel_database():
    """Initialise la base de données sur Vercel avec les données de test"""
    
    # Chemin de la base de données sur Vercel
    db_path = '/tmp/lounarail_final.db'
    
    print(f"🚀 Initialisation de la base de données sur Vercel: {db_path}")
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Créer la table users si elle n'existe pas
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                first_name TEXT,
                last_name TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Créer la table formations
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS formations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                duration INTEGER,
                price REAL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Créer la table enrollments
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS enrollments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                formation_id INTEGER NOT NULL,
                progress INTEGER DEFAULT 0,
                status TEXT DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id),
                FOREIGN KEY (formation_id) REFERENCES formations (id)
            )
        ''')
        
        # Créer la table quiz_attempts
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS quiz_attempts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                quiz_id TEXT NOT NULL,
                score INTEGER NOT NULL,
                passed BOOLEAN NOT NULL,
                attempt_date DATETIME NOT NULL,
                time_taken_seconds INTEGER NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        # Ajouter l'utilisateur de test
        test_user = {
            'email': 'cha.ahmed95@gmail.com',
            'password': 'password123',  # Changez par votre vrai mot de passe
            'first_name': 'ah',
            'last_name': 'ch'
        }
        
        # Vérifier si l'utilisateur existe déjà
        cursor.execute("SELECT id FROM users WHERE email = ?", (test_user['email'],))
        existing_user = cursor.fetchone()
        
        if not existing_user:
            # Créer le nouvel utilisateur
            hashed_password = bcrypt.hashpw(test_user['password'].encode('utf-8'), bcrypt.gensalt())
            cursor.execute(
                "INSERT INTO users (email, password_hash, first_name, last_name) VALUES (?, ?, ?, ?)",
                (test_user['email'], hashed_password.decode('utf-8'), test_user['first_name'], test_user['last_name'])
            )
            print(f"✅ Utilisateur {test_user['email']} créé")
        else:
            print(f"✅ Utilisateur {test_user['email']} existe déjà")
        
        # Ajouter quelques formations de test
        formations = [
            ('Formation Sécurité Ferroviaire', 'Formation complète sur la sécurité dans le secteur ferroviaire', 40, 299.99),
            ('Conduite de Pelle Rail', 'Apprentissage de la conduite de pelle sur rail', 60, 499.99),
            ('Maintenance Équipements', 'Formation à la maintenance des équipements ferroviaires', 30, 199.99)
        ]
        
        for formation in formations:
            cursor.execute(
                "INSERT OR IGNORE INTO formations (title, description, duration, price) VALUES (?, ?, ?, ?)",
                formation
            )
        
        print(f"✅ {len(formations)} formations ajoutées")
        
        conn.commit()
        conn.close()
        
        print("🎉 Base de données initialisée avec succès!")
        print(f"\n🔑 Identifiants de connexion :")
        print(f"   Email: {test_user['email']}")
        print(f"   Mot de passe: {test_user['password']}")
        
    except Exception as e:
        print(f"❌ Erreur lors de l'initialisation: {e}")

if __name__ == "__main__":
    init_vercel_database() 