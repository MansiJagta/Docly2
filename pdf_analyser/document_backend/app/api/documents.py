# import os
# import shutil
# import hashlib
# from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Body, BackgroundTasks
# from sqlalchemy.orm import Session
# from sqlalchemy import desc
# from datetime import datetime
# from pydantic import BaseModel
# from typing import List, Annotated

# from app.db.session import get_db
# from app.models.document_model import Document
# from app.models.qa_model import QA
# from app.utils.local_user import get_or_create_local_user
# from app.services.document_processor import process_document
# from app.ai.llm import engine
# from fastapi.responses import StreamingResponse

# router = APIRouter(prefix="/documents", tags=["Documents"])

# # Storage directory
# STORAGE_DIR = os.path.join("app", "storage", "documents")
# os.makedirs(STORAGE_DIR, exist_ok=True)

# ALLOWED_EXTENSIONS = {"pdf", "png", "jpg", "jpeg"}

# class QuestionRequest(BaseModel):
#     question: str

# # ==============================
# # Upload Multiple Documents
# # ==============================
# @router.post("/upload")
# async def upload_documents(
#     background_tasks: BackgroundTasks,
#     files: Annotated[
#         List[UploadFile],
#         File(description="Upload one or more files (pdf, png, jpg, jpeg)")
#     ],
#     db: Session = Depends(get_db)
# ):
#     local_user = get_or_create_local_user(db)
#     uploaded = []

#     for file in files:
#         ext = file.filename.split(".")[-1].lower()
#         if ext not in ALLOWED_EXTENSIONS:
#             continue

#         file_bytes = await file.read()
#         file_hash = hashlib.sha256(file_bytes).hexdigest()
        
#         existing = db.query(Document).filter(Document.hash == file_hash).first()
#         if existing:
#             # FIX: If the document exists but failed or is stuck in 'uploaded', restart it!
#             if existing.status in ["uploaded", "failed", "processing"] and not existing.content_summary:
#                 print(f"--- ♻️ RE-ROUTING DUPLICATE FILE {existing.id} FOR PROCESSING ---")
#                 existing.status = "processing"
#                 db.commit()
#                 background_tasks.add_task(process_document, existing.id)
            
#             uploaded.append({
#                 "id": existing.id, 
#                 "filename": existing.filename, 
#                 "status": existing.status, 
#                 "duplicate": True,
#                 "message": "File already exists. Re-processing triggered if incomplete."
#             })
#             continue

#         safe_name = f"{file_hash[:10]}_{file.filename}"
#         file_path = os.path.join(STORAGE_DIR, safe_name)

#         with open(file_path, "wb") as buffer:
#             buffer.write(file_bytes)

#         doc = Document(
#             filename=file.filename,
#             path=file_path,
#             file_type=ext,
#             size_kb=len(file_bytes) // 1024,
#             hash=file_hash,
#             status="processing",
#             profile_id=local_user.id
#         )
#         db.add(doc)
#         db.commit()
#         db.refresh(doc)

#         # TRIGGER AI IN BACKGROUND
#         background_tasks.add_task(process_document, doc.id)

#         uploaded.append({
#             "id": doc.id, 
#             "filename": doc.filename, 
#             "status": "processing"
#         })

#     return {
#         "message": "Upload completed",
#         "user": local_user.username,
#         "count": len(uploaded),
#         "documents": uploaded
#     }

# # ==============================
# # List Documents
# # ==============================
# @router.get("/")
# def list_documents(db: Session = Depends(get_db)):
#     docs = db.query(Document).order_by(desc(Document.upload_time)).all()

#     return {
#         "count": len(docs),
#         "documents": [
#             {
#                 "id": d.id,
#                 "filename": d.filename,
#                 "status": d.status,
#                 "file_type": d.file_type,
#                 "size_kb": d.size_kb,
#                 "upload_time": str(d.upload_time)
#             }
#             for d in docs
#         ]
#     }

# # ==============================
# # Get Single Document
# # ==============================
# @router.get("/{doc_id}")
# def get_document(doc_id: int, db: Session = Depends(get_db)):
#     doc = db.query(Document).filter(Document.id == doc_id).first()
#     if not doc:
#         raise HTTPException(status_code=404, detail="Document not found")

#     return {
#         "id": doc.id,
#         "filename": doc.filename,
#         "file_type": doc.file_type,
#         "size_kb": doc.size_kb,
#         "status": doc.status,
#         "upload_time": str(doc.upload_time)
#     }

# # ==============================
# # Get Document Summary
# # ==============================
# @router.get("/{doc_id}/summary")
# async def get_document_summary(doc_id: int, db: Session = Depends(get_db)):
#     doc = db.query(Document).filter(Document.id == doc_id).first()
    
#     if not doc:
#         raise HTTPException(status_code=404, detail="Document not found")
    
#     if not doc.content_summary:
#         if doc.status == "processing":
#             return {
#                 "document_id": doc_id,
#                 "status": "processing",
#                 "message": "AI is still analyzing the PDF. Please try again in a moment."
#             }
        
#         if doc.status == "failed":
#             return {
#                 "document_id": doc_id,
#                 "status": "failed",
#                 "message": f"Analysis failed. Error: {doc.error_message or 'Unknown error'}. Please ignore this ID and re-upload the file.",
#                 "suggestion": "Use the POST /documents/{id}/process endpoint to retry manually."
#             }

#         return {
#             "document_id": doc_id,
#             "status": doc.status,
#             "message": "No summary available. Truncated or empty response."
#         }

#     return {
#         "document_id": doc_id,
#         "filename": doc.filename,
#         "summary": doc.content_summary,
#         "status": doc.status
#     }

# # ==============================
# # Ask Question
# # ==============================
# from fastapi.responses import StreamingResponse
# from datetime import datetime
# import json

# @router.post("/{doc_id}/ask")
# async def ask_question(
#     doc_id: int, 
#     payload: QuestionRequest, 
#     db: Session = Depends(get_db)
# ):
#     # 1. Fetch the document
#     doc = db.query(Document).filter(Document.id == doc_id).first()
#     if not doc:
#         raise HTTPException(status_code=404, detail="Document not found")

#     # 2. Check status for readiness
#     if doc.status in ["uploaded", "processing"]:
#         return {
#             "status": doc.status,
#             "answer": "I am still reading your PDF. Please wait...",
#             "is_ready": False
#         }
    
#     if doc.status == "failed":
#         raise HTTPException(status_code=400, detail="Document processing failed. Re-upload.")

#     # 3. Setup AI Context (Optimized for 8GB RAM)
#     # Truncate summary to 700 chars to ensure it fits in the 1024 token window
#     context = doc.content_summary[:700] if doc.content_summary else "Context not available."
    
#     system_prompt = (
#         f"You are a helpful assistant. Use this context to answer: {context}"
#     )

#     # 4. Define the Streaming Generator
#     # Fixed: Removed parameters to avoid 'TypeError' when calling event_generator()
#     async def event_generator():
#         full_answer = ""
#         try:
#             # Accessible via closure: payload.question and system_prompt
#             model = os.getenv("AI_MODEL_NAME", "qwen2.5:1.5b")
#             for token in engine.stream(user_query=payload.question, system_prompt=system_prompt,model_name=model):
#                 full_answer += token
#                 yield token 

#             # 5. Save to History AFTER the stream completes
#             from app.db.session import SessionLocal
#             with SessionLocal() as history_db:
#                 qa = QA(
#                     document_id=doc.id,
#                     question=payload.question,
#                     answer=full_answer,
#                     asked_at=datetime.utcnow()
#                 )
#                 history_db.add(qa)
#                 history_db.commit()
#         except Exception as e:
#             # Log the actual error for debugging
#             print(f"❌ Ask Route Error: {str(e)}")
#             yield f"\n[Error: {str(e)}]"

#     # 6. Return StreamingResponse
#     # Changed media_type to 'text/event-stream' for better browser/Swagger support
#     return StreamingResponse(event_generator(), media_type="text/event-stream")


# # ==============================
# # Process Document (Manual Trigger)
# # ==============================
# @router.post("/{doc_id}/process")
# async def process_doc(
#     doc_id: int, 
#     background_tasks: BackgroundTasks,
#     db: Session = Depends(get_db)
# ):
#     # Verify doc exists
#     doc = db.query(Document).filter(Document.id == doc_id).first()
#     if not doc:
#         raise HTTPException(status_code=404, detail="Document not found")
        
#     background_tasks.add_task(process_document, doc_id)
#     return {"message": "Processing started"}

# # ==============================
# # QA History
# # ==============================
# @router.get("/{doc_id}/history")
# async def get_qa_history(doc_id: int, db: Session = Depends(get_db)):
#     history = db.query(QA).filter(QA.document_id == doc_id).order_by(QA.asked_at).all()
#     return {
#         "document_id": doc_id,
#         "history": [
#             {
#                 "id": q.id, 
#                 "question": q.question, 
#                 "answer": q.answer, 
#                 "at": str(q.asked_at)
#             } for q in history
#         ]
#     }

# # ==============================
# # Delete Document
# # ==============================
# @router.delete("/{doc_id}")
# def delete_document(doc_id: int, db: Session = Depends(get_db)):
#     doc = db.query(Document).filter(Document.id == doc_id).first()
#     if not doc:
#         raise HTTPException(status_code=404, detail="Document not found")

#     # Delete file
#     if os.path.exists(doc.path):
#         try:
#             os.remove(doc.path)
#         except OSError:
#             pass # File might be in use or already gone

#     # Delete DB record
#     db.delete(doc)
#     db.commit()

#     return {
#         "message": "Document deleted",
#         "document_id": doc_id
#     }







import os
import shutil
import hashlib
import uuid
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Body, BackgroundTasks, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from datetime import datetime
from pydantic import BaseModel
from typing import List, Annotated, Optional

from app.db.session import get_db, SessionLocal
from app.models.document_model import Document
from app.models.qa_model import QA
from app.utils.local_user import get_or_create_local_user
from app.utils.processor import process_sequential, AI_LOCK
from app.ai.llm import engine
from app.ai.manager import app as ai_app
from fastapi.responses import StreamingResponse

router = APIRouter(prefix="/documents", tags=["Documents"])

# Storage directory
STORAGE_DIR = os.path.join("app", "storage", "documents")
os.makedirs(STORAGE_DIR, exist_ok=True)

ALLOWED_EXTENSIONS = {"pdf", "png", "jpg", "jpeg"}

class QuestionRequest(BaseModel):
    question: str


def _persona_instructions(persona: str) -> str:
    p = (persona or "executive").lower()
    if p == "technical":
        return "Use a technical persona. Focus on architecture, implementation details, constraints, and trade-offs."
    if p == "academic":
        return "Use an academic persona. Be formal, precise, and structured with objective analytical language."
    if p == "creative":
        return "Use a creative persona. Keep it insightful, engaging, and idea-oriented while preserving factual correctness."
    return "Use an executive persona. Focus on business impact, priorities, and decisions in concise language."


def _is_summary_ready(status: str) -> bool:
    """Backward-compatible readiness check for old rows using 'processed'."""
    return status in ["completed", "processed"]

# ==============================
# Upload Multiple Documents
# ==============================
@router.post("/upload")
async def upload_documents(
    background_tasks: BackgroundTasks,
    files: Annotated[List[UploadFile], File(...)],
    workspace_id: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    local_user = get_or_create_local_user(db)
    uploaded = []
    
    # Generate a workspace_id if none provided (groups this batch)
    current_workspace = workspace_id or f"ws_{datetime.now().strftime('%Y%m%d_%H%M%S')}"

    for file in files:
        ext = file.filename.split(".")[-1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            continue

        file_bytes = await file.read()
        file_hash = hashlib.sha256(file_bytes).hexdigest()
        
        existing = db.query(Document).filter(Document.hash == file_hash).first()
        if existing:
            # Always attach duplicates to the currently uploaded workspace batch.
            if existing.workspace_id != current_workspace:
                existing.workspace_id = current_workspace

            # Re-process if it failed or was stuck
            if existing.status in ["uploaded", "failed"] and not existing.content_summary:
                existing.status = "processing"
                db.commit()
                background_tasks.add_task(process_sequential, existing.id)
            else:
                db.commit()
            
            uploaded.append({
                "id": existing.id, 
                "filename": existing.filename, 
                "status": existing.status, 
                "workspace_id": existing.workspace_id,
                "duplicate": True
            })
            continue

        safe_name = f"{file_hash[:10]}_{file.filename}"
        file_path = os.path.join(STORAGE_DIR, safe_name)

        with open(file_path, "wb") as buffer:
            buffer.write(file_bytes)

        doc = Document(
            filename=file.filename,
            path=file_path,
            file_type=ext,
            size_kb=len(file_bytes) // 1024,
            hash=file_hash,
            status="processing",
            workspace_id=current_workspace,
            profile_id=local_user.id
        )
        db.add(doc)
        db.commit()
        db.refresh(doc)

        # Queue AI processing sequentially
        background_tasks.add_task(process_sequential, doc.id)

        uploaded.append({
            "id": doc.id, 
            "filename": doc.filename, 
            "status": "processing",
            "workspace_id": current_workspace
        })

    return {
        "message": "Upload successful",
        "workspace_id": current_workspace,
        "count": len(uploaded),
        "documents": uploaded
    }

# ==============================
# List Documents
# ==============================
@router.get("/")
def list_documents(db: Session = Depends(get_db)):
    docs = db.query(Document).order_by(desc(Document.upload_time)).all()
    return {
        "count": len(docs),
        "documents": [{"id": d.id, "filename": d.filename, "status": d.status, "upload_time": str(d.upload_time)} for d in docs]
    }

# ==============================
# Get Document Summary
# ==============================
@router.get("/{doc_id}/summary")
async def get_document_summary(
    doc_id: int,
    persona: str = Query("executive"),
    db: Session = Depends(get_db),
):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    base_summary = doc.content_summary or "Processing..."
    if not _is_summary_ready(doc.status) or (persona or "executive").lower() == "executive":
        return {
            "document_id": doc.id,
            "filename": doc.filename,
            "summary": base_summary,
            "status": doc.status,
            "persona": persona,
        }

    # Reframe the stored summary for non-executive personas without re-running full ingestion.
    try:
        async with AI_LOCK:
            model = os.getenv("AI_MODEL_NAME", "qwen2.5:1.5b")
            engine.initialize(model_name=model)
            prompt = _persona_instructions(persona)
            reframed = engine.generate(
                user_query=(
                    "Rewrite the summary below for the requested persona. "
                    "Keep all critical facts and avoid adding new claims.\n\n"
                    f"SUMMARY:\n{base_summary}"
                ),
                system_prompt=prompt,
                temperature=0.1,
            )
            if reframed:
                base_summary = reframed
    except Exception:
        # Fallback to stored summary if persona rewrite fails.
        pass
    
    return {
        "document_id": doc.id,
        "filename": doc.filename,
        "summary": base_summary,
        "status": doc.status,
        "persona": persona,
    }

# ==============================
# Ask Question (Streamed)
# ==============================
@router.post("/{doc_id}/ask")
async def ask_question(doc_id: int, payload: QuestionRequest, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc or not _is_summary_ready(doc.status):
        raise HTTPException(status_code=400, detail="Document not ready or not found")

    context = doc.content_summary[:700] if doc.content_summary else ""
    system_prompt = f"Use this context to answer: {context}"

    async def event_generator():
        full_answer = ""
        try:
            model = os.getenv("AI_MODEL_NAME", "qwen2.5:1.5b")
            # We use a lock here too if RAM is very tight, but streaming is usually okay
            for token in engine.stream(user_query=payload.question, system_prompt=system_prompt, model_name=model):
                full_answer += token
                yield token 

            with SessionLocal() as history_db:
                qa = QA(document_id=doc.id, question=payload.question, answer=full_answer, asked_at=datetime.utcnow())
                history_db.add(qa)
                history_db.commit()
        except Exception as e:
            yield f"[Error: {str(e)}]"

    return StreamingResponse(event_generator(), media_type="text/event-stream")

# ==============================
# Delete Document
# ==============================
@router.delete("/{doc_id}")
def delete_document(doc_id: int, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    if os.path.exists(doc.path):
        os.remove(doc.path)
    db.delete(doc)
    db.commit()
    return {"message": "Document deleted", "id": doc_id}