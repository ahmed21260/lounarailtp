import os
from dotenv import load_dotenv

# Charger les variables d'environnement depuis config_surveillance.env
# C'est le bon endroit pour le faire, pour que toutes les variables soient prêtes
load_dotenv('config_surveillance.env')

# Obtenir le chemin absolu du répertoire du projet
basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    # Configuration email Louna Rail TP
    SMTP_SERVER = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
    SMTP_PORT = int(os.getenv('SMTP_PORT', 587))
    SENDER_EMAIL = os.getenv('SENDER_EMAIL', 'contact@lounarailtp.com')
    SENDER_PASSWORD = os.getenv('SENDER_PASSWORD', '')
    RECIPIENT_EMAIL = os.getenv('RECIPIENT_EMAIL', 'contact@lounarailtp.com')
    
    # Configuration du serveur
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'une-super-cle-secrete-difficile-a-deviner'
    DEBUG = os.environ.get('FLASK_DEBUG', 'False').lower() in ('true', '1', 't')
    
    # Configuration du domaine
    DOMAIN = 'lounarailtp.com'
    SITE_NAME = 'Louna Rail TP'
    
    # Configuration de la base de données
    DATABASE = os.path.join(basedir, 'lounarail_final.db')
    
    @classmethod
    def get_email_config(cls):
        return {
            'smtp_server': cls.SMTP_SERVER,
            'smtp_port': cls.SMTP_PORT,
            'sender_email': cls.SENDER_EMAIL,
            'sender_password': cls.SENDER_PASSWORD,
            'recipient_email': cls.RECIPIENT_EMAIL
        } 