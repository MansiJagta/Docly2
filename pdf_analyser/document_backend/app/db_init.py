# app/db_init.py

from sqlalchemy import text
from app.db.session import engine   # same engine used by every API route
from app.models.base import Base

# IMPORTANT: Import ALL models so SQLAlchemy registers tables
from app.models.profile_model import Profile
from app.models.document_model import Document
from app.models.summary_model import Summary
from app.models.qa_model import QA
from app.models.embedding_model import Embedding


_MIGRATIONS = [
    # (table, column_name, column_definition)
    # ALTER TABLE ... ADD COLUMN is safe to retry — we catch the error if it already exists.
    ("document", "workspace_id",  "VARCHAR"),
    ("document", "content_summary", "TEXT"),
    ("document", "error_message",   "TEXT"),
]


def _apply_migrations():
    """Add columns that may be missing in databases created before this schema version."""
    with engine.connect() as conn:
        for table, column, col_type in _MIGRATIONS:
            try:
                conn.execute(text(f"ALTER TABLE {table} ADD COLUMN {column} {col_type}"))
                conn.commit()
                print(f"  ✅ Migration applied: {table}.{column}")
            except Exception:
                # Column already exists — safe to ignore.
                pass


def init_db():
    Base.metadata.create_all(bind=engine)
    _apply_migrations()
