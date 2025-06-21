import sqlite3
import bcrypt
import os

def setup_database(conn):
    """Crée les tables nécessaires si elles n'existent pas."""
    cursor = conn.cursor()
    # Création de la table des utilisateurs
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            first_name TEXT,
            last_name TEXT,
            role TEXT DEFAULT 'USER'
        );
    ''')
    # Ajoutez ici d'autres créations de tables si nécessaire (enrollments, etc.)
    conn.commit()
    print("DB Check: Table 'users' prête.")

def create_test_user():
    """Crée ou met à jour un utilisateur de test dans la base de données."""
    
    test_user = {
        'email': 'cha.ahmed95@gmail.com',
        'password': 'password123',
        'first_name': 'ah',
        'last_name': 'ch'
    }
    
    db_path = 'lounarail_final.db'
    
    try:
        # La connexion crée le fichier s'il n'existe pas
        conn = sqlite3.connect(db_path)
        
        # Initialiser les tables
        setup_database(conn)
        
        cursor = conn.cursor()
        
        cursor.execute("SELECT id FROM users WHERE email = ?", (test_user['email'],))
        existing_user = cursor.fetchone()
        
        hashed_password = bcrypt.hashpw(test_user['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        if existing_user:
            print(f"Utilisateur {test_user['email']} existe déjà. Mise à jour du mot de passe.")
            cursor.execute(
                "UPDATE users SET password_hash = ? WHERE email = ?",
                (hashed_password, test_user['email'])
            )
        else:
            print(f"Création de l'utilisateur de test {test_user['email']}.")
            cursor.execute(
                "INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES (?, ?, ?, ?, ?)",
                (test_user['email'], hashed_password, test_user['first_name'], test_user['last_name'], 'ADMIN')
            )
        
        conn.commit()
        conn.close()
        
        print("\n--- ✅ Opération terminée avec succès ---")
        print(f"🔑 Identifiants de connexion :")
        print(f"   Email: {test_user['email']}")
        print(f"   Mot de passe: {test_user['password']}")
        
    except Exception as e:
        print(f"❌ Erreur: {e}")

if __name__ == "__main__":
    create_test_user() 