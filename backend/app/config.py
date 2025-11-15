import os 
from dotenv import load_dotenv

load_dotenv()

class Settings:
    ENV = os.getenv("ENV", "development")
    AI_MODEL_PATH = "models"
    DECOY_TEMPLATE = "app/decoy/template"

settings = Settings()