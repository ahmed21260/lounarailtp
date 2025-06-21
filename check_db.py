import sqlite3
import os

def check_database():
    db_path = 'lounarail_final.db'
    
    if not os.path.exists(db_path):
        print(f"❌ Base de données {db_path} n'existe pas!")
        return
    
    print(f"✅ Base de données {db_path} trouvée!")
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Lister toutes les tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        
        print(f"\n📋 Tables trouvées ({len(tables)}):")
        for table in tables:
            print(f"  - {table[0]}")
        
        # Vérifier la table users
        if ('users',) in tables:
            print(f"\n👥 Contenu de la table 'users':")
            cursor.execute("SELECT id, email, first_name, last_name FROM users")
            users = cursor.fetchall()
            
            if users:
                print(f"  ✅ {len(users)} utilisateur(s) trouvé(s):")
                for user in users:
                    print(f"    - ID: {user[0]}, Email: {user[1]}, Nom: {user[2]} {user[3]}")
            else:
                print("  ❌ Aucun utilisateur dans la table")
        else:
            print("\n❌ Table 'users' n'existe pas!")
            
        # Vérifier la table quiz_attempts
        if ('quiz_attempts',) in tables:
            cursor.execute("SELECT COUNT(*) FROM quiz_attempts")
            count = cursor.fetchone()[0]
            print(f"\n📊 Quiz attempts: {count} tentative(s)")
        
        conn.close()
        
    except Exception as e:
        print(f"❌ Erreur lors de la lecture de la base: {e}")

if __name__ == "__main__":
    check_database() 