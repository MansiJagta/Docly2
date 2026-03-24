from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# 1. Define where your database file will live
# This creates 'app.db' in your document_backend folder
DATABASE_URL = "sqlite:///./app.db"

# 2. Create the Engine
# 'check_same_thread' is False because SQLite needs this to work with FastAPI
engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)

# 3. Create SessionLocal
# This is what your background tasks will use to create their own connections
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4. Dependency for your API routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()