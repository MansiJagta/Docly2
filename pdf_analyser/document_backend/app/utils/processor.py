import asyncio
import logging

from app.db.session import SessionLocal
from app.models.document_model import Document
from app.services.document_processor import process_document


logger = logging.getLogger(__name__)

# Single global lock: only one AI pipeline run at a time (8GB RAM safeguard).
AI_LOCK = asyncio.Lock()


async def process_sequential(doc_id: int) -> None:
    """Process one document at a time and update durable status transitions."""
    async with AI_LOCK:
        db = SessionLocal()
        try:
            doc = db.query(Document).filter(Document.id == doc_id).first()
            if not doc:
                logger.error("Document %s not found for sequential processing", doc_id)
                return

            doc.status = "processing"
            doc.error_message = None
            db.commit()

            await process_document(doc_id)

            # Reload latest state after service updates from its own DB session.
            db.refresh(doc)
            if doc.status != "failed":
                doc.status = "completed"
                doc.error_message = None
                db.commit()

        except Exception as exc:
            db.rollback()
            logger.exception("Sequential processing failed for document %s", doc_id)

            failed_doc = db.query(Document).filter(Document.id == doc_id).first()
            if failed_doc:
                failed_doc.status = "failed"
                failed_doc.error_message = str(exc)
                db.commit()
        finally:
            db.close()
