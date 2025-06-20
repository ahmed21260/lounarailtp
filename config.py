import os
from dotenv import load_dotenv

# Charger les variables d'environnement depuis .env
load_dotenv()

class Config:
    # Configuration email Louna Rail TP
    SMTP_SERVER = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
    SMTP_PORT = int(os.getenv('SMTP_PORT', 587))
    SENDER_EMAIL = os.getenv('SENDER_EMAIL', 'contact@lounarailtp.com')
    SENDER_PASSWORD = os.getenv('SENDER_PASSWORD', '')
    RECIPIENT_EMAIL = os.getenv('RECIPIENT_EMAIL', 'contact@lounarailtp.com')
    
    # Configuration du serveur
    SECRET_KEY = os.getenv('SECRET_KEY', 'lounarailtp-secret-key-2025')
    DEBUG = os.getenv('DEBUG', 'True').lower() == 'true'
    
    # Configuration du domaine
    DOMAIN = 'lounarailtp.com'
    SITE_NAME = 'Louna Rail TP'
    
    @classmethod
    def get_email_config(cls):
        return {
            'smtp_server': cls.SMTP_SERVER,
            'smtp_port': cls.SMTP_PORT,
            'sender_email': cls.SENDER_EMAIL,
            'sender_password': cls.SENDER_PASSWORD,
            'recipient_email': cls.RECIPIENT_EMAIL
        } 