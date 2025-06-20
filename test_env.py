import os
from dotenv import load_dotenv

print("Chemin courant :", os.getcwd())
load_dotenv()
print('SENDER_PASSWORD:', os.getenv('SENDER_PASSWORD'))
print('SENDER_EMAIL:', os.getenv('SENDER_EMAIL'))