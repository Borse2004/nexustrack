import os
import sys
from logging.config import fileConfig
from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context

# 1. Get the exact path to your backend folder
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

# 2. Force it to load the .env file from that exact folder
from dotenv import load_dotenv
env_path = os.path.join(BASE_DIR, ".env")
load_dotenv(env_path)

# 3. Import your models
from app.db.database import Base
import app.models.user
import app.models.game

# Alembic Config
config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata

def run_migrations_offline() -> None:
    url = os.getenv("DATABASE_URL")
    context.configure(
        url=url, target_metadata=target_metadata, literal_binds=True, dialect_opts={"paramstyle": "named"}
    )
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    # Grab the URL
    db_url = os.getenv("DATABASE_URL")
    
    # SAFETY CHECK: If it still can't find it, tell us exactly why!
    if not db_url:
        print(f"\n🚨 ERROR: Alembic cannot find the DATABASE_URL!")
        print(f"🚨 It is looking for it exactly here: {env_path}\n")
        sys.exit(1)

    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
        url=db_url
    )

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()