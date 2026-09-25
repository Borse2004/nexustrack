import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# 1. Calculate the exact path to the backend folder
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
env_path = os.path.join(BASE_DIR, ".env")

# 2. Force it to load that specific file
load_dotenv(env_path)

# 3. Get the URL
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# 4. A safety check!
if not SQLALCHEMY_DATABASE_URL:
    raise ValueError(f"🚨 I cannot find the DATABASE_URL! I looked inside: {env_path}")

# Connect to Postgres
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()