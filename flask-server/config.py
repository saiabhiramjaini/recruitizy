import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    TOGETHER_AI_API_KEY = os.getenv("TOGETHER_AI_API_KEY")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")