# import os
# import logging
# from app.models.document_model import Document
# from app.ai.manager import app as ai_app
# from app.db.session import SessionLocal
# from langchain_text_splitters import RecursiveCharacterTextSplitter
# logger = logging.getLogger(__name__)

# async def process_document(document_id: int): 
#     """
#     Main background task. Creates its own DB session to stay alive 
#     after the API response is sent.
#     """
#     print(f"--- 🚀 BACKGROUND TASK INITIATED FOR ID: {document_id} ---")
    
#     # 1. Create a fresh session for THIS background thread
#     db = SessionLocal()
    
#     import asyncio
    
#     try:
#         # 2. Fetch document with RETRY logic
#         # Sometimes background tasks start before the DB commit is fully visible in a new session
#         doc = None
#         for attempt in range(3):
#             doc = db.query(Document).filter(Document.id == document_id).first()
#             if doc:
#                 break
#             print(f"⚠️ Attempt {attempt+1}: Document {document_id} not found... retrying in 1s")
#             await asyncio.sleep(1)
            
#         if not doc:
#             logger.error(f"❌ Document {document_id} not found after retries.")
#             # Debug: what DOES exist?
#             all_ids = [d.id for d in db.query(Document).all()]
#             print(f"DEBUG: Visible Document IDs: {all_ids}")
#             print(f"DEBUG: CWD: {os.getcwd()}")
#             return
        
#         print(f"--- 🔄 UPDATING STATUS TO PROCESSING FOR: {doc.filename}---")

#         # 3. Update status to 'processing'
#         # doc.status = "processing" # Already set in endpoint, but good to double check
#         # db.commit()
#         logger.info(f"--- 🔄 Starting AI Pipeline for: {doc.filename} ---")
#         text_splitter = RecursiveCharacterTextSplitter(
#             chunk_size=500,     # Max characters per chunk
#             chunk_overlap=50,   # Preserve context between boundaries
#             separators=["\n\n", "\n", " ", ""] # Hierarchical splitting
#         )

#         # 4. Prepare initial state
#         # Ensure correct keys for GraphState in app/ai/state.py
#         initial_state = {
#             "file_path": doc.path, 
#             "persona": "executive", # Default persona
#             "raw_text": "",
#             "layout_type": "",
#             "vector_status": "pending",
#             "query": "Summarize this document",
#             "draft": "",
#             "critique": "",
#             "reflection_count": 0,
#             "errors": [],
#             "summary": ""
#         }

#         # 5. Execute the Graph
#         # Using .ainvoke for async execution
#         result = await ai_app.ainvoke(
#             initial_state, 
#             config={"configurable": {"thread_id": str(doc.id)}}
#         )

#         # 6. Save results
#         doc.content_summary = result.get("summary", "No summary generated.")
#         doc.status = "processed"
#         db.commit()
#         logger.info(f"✅ Successfully processed: {doc.filename}")

#     except Exception as e:
#         import traceback
#         logger.error(f"❌ Processing failed: {str(e)}")
#         traceback.print_exc() 
        
#         doc = db.query(Document).filter(Document.id == document_id).first()
#         if doc:
#             doc.status = "failed"
#             doc.error_message = str(e)
#             db.commit()
            
#     finally:
#         # 7. CRITICAL: Always close the session
#         db.close()












# import os
# import logging
# import asyncio
# import traceback
# from app.models.document_model import Document
# from app.ai.manager import app as ai_app
# from app.db.session import SessionLocal

# # Import the necessary splitter from LangChain
# from langchain_text_splitters import RecursiveCharacterTextSplitter

# logger = logging.getLogger(__name__)

# async def process_document(document_id: int): 
#     """
#     Main background task. Creates its own DB session to stay alive 
#     after the API response is sent.
#     """
#     print(f"--- 🚀 BACKGROUND TASK INITIATED FOR ID: {document_id} ---")
    
#     db = SessionLocal()
    
#     try:
#         # 1. Fetch document with RETRY logic
#         doc = None
#         for attempt in range(3):
#             doc = db.query(Document).filter(Document.id == document_id).first()
#             if doc:
#                 break
#             print(f"⚠️ Attempt {attempt+1}: Document {document_id} not found... retrying in 1s")
#             await asyncio.sleep(1)
            
#         if not doc:
#             logger.error(f"❌ Document {document_id} not found after retries.")
#             return
        
#         logger.info(f"--- 🔄 Starting AI Pipeline for: {doc.filename} ---")

#         # 2. OPTIMIZATION: Initialize the Text Splitter
#         # Smaller chunks (500) are faster for local models to process on 8GB RAM
#         text_splitter = RecursiveCharacterTextSplitter(
#             chunk_size=500,     # Max characters per chunk
#             chunk_overlap=50,   # Preserve context between boundaries
#             separators=["\n\n", "\n", " ", ""] # Hierarchical splitting
#         )

#         # 3. Prepare initial state for LangGraph
#         # We pass the path to the AI app, which will now use the text_splitter logic internally
#         initial_state = {
#             "file_path": doc.path, 
#             "persona": "executive",
#             "raw_text": "",
#             "layout_type": "",
#             "vector_status": "pending",
#             "query": "Summarize this document",
#             "draft": "",
#             "critique": "",
#             "reflection_count": 0,
#             "errors": [],
#             "summary": "",
#             # Passing the splitter configuration if your AI manager is designed to receive it
#             "chunk_config": {
#                 "size": 500,
#                 "overlap": 50
#             }
#         }

#         # 4. Execute the Graph
#         result = await ai_app.ainvoke(
#             initial_state, 
#             config={"configurable": {"thread_id": str(doc.id)}}
#         )

#         # 5. Save results
#         doc.content_summary = result.get("summary", "No summary generated.")
#         doc.status = "processed"
#         db.commit()
#         logger.info(f"✅ Successfully processed: {doc.filename}")

#     except Exception as e:
#         logger.error(f"❌ Processing failed: {str(e)}")
#         traceback.print_exc() 
        
#         # Refresh doc in case of session issues
#         doc = db.query(Document).filter(Document.id == document_id).first()
#         if doc:
#             doc.status = "failed"
#             doc.error_message = str(e)
#             db.commit()
            
#     finally:
#         db.close()








# import os
# import logging
# import asyncio
# import traceback
# from app.models.document_model import Document
# from app.ai.manager import app as ai_app
# from app.db.session import SessionLocal

# # Import the necessary splitter and document loader from LangChain
# from langchain_text_splitters import RecursiveCharacterTextSplitter
# from langchain_community.document_loaders import PyPDFLoader

# logger = logging.getLogger(__name__)

# async def process_document(document_id: int): 
#     """
#     Main background task. Creates its own DB session to stay alive 
#     after the API response is sent.
#     """
#     print(f"--- 🚀 BACKGROUND TASK INITIATED FOR ID: {document_id} ---")
    

    
#     db = SessionLocal()
    
    
#     try:
#         from app.ai.llm import engine
        
#         if not hasattr(engine, 'llm') or engine.llm is None:
#             logger.error(f"❌ AI Engine not initialized for ID: {document_id}")
#             raise Exception("AI Engine is not initialized. Likely out of RAM or model path error.")
#         # --------------------------------------

#         # 1. Fetch document with RETRY logic
#         doc = None
#         # 1. Fetch document with RETRY logic
#         doc = None
#         for attempt in range(3):
#             doc = db.query(Document).filter(Document.id == document_id).first()
#             if doc:
#                 break
#             print(f"⚠️ Attempt {attempt+1}: Document {document_id} not found... retrying in 1s")
#             await asyncio.sleep(1)
            
#         if not doc:
#             logger.error(f"❌ Document {document_id} not found after retries.")
#             return
        
#         logger.info(f"--- 🔄 Starting AI Pipeline for: {doc.filename} ---")

#         # 2. OPTIMIZATION: Initialize the Text Splitter
#         # Smaller chunks (500) are faster for local models to process on 8GB RAM
#         text_splitter = RecursiveCharacterTextSplitter(
#             chunk_size=500,     # Max characters per chunk
#             chunk_overlap=50,   # Preserve context between boundaries
#             separators=["\n\n", "\n", " ", ""] # Hierarchical splitting
#         )

#         # 3. Retrieval Optimization
#         # In your retrieval logic within LangGraph/LangChain, ensure you set k=2.
#         # This reduces the computational load on the 3B model.
#         # Example if using a vector_store directly:
#         # docs = vector_store.similarity_search(query, k=2)

#         # 4. Prepare initial state for LangGraph
#         initial_state = {
#             "file_path": doc.path, 
#             "persona": "executive",
#             "raw_text": "",
#             "layout_type": "",
#             "vector_status": "pending",
#             "query": "Summarize this document",
#             "draft": "",
#             "critique": "",
#             "reflection_count": 0,
#             "errors": [],
#             "summary": "",
#             # Passing optimized configurations to the AI manager
#             "chunk_config": {
#                 "size": 500,
#                 "overlap": 50,
#                 "k": 2  # 📉 Lower k for faster processing
#             }
#         }

#         # 5. Execute the Graph
#         raw_text = text_extracted[:2000] # Only send the first 2000 chars for the summary
#         initial_state["raw_text"] = raw_text
#         result = await ai_app.ainvoke(
#             initial_state, 
#             config={"configurable": {"thread_id": str(doc.id)}}
#         )

#         # 6. Save results
#         doc.content_summary = result.get("summary", "No summary generated.")
#         doc.status = "processed"
#         db.commit()
#         logger.info(f"✅ Successfully processed: {doc.filename}")

#     except Exception as e:
#         logger.error(f"❌ Processing failed: {str(e)}")
#         traceback.print_exc() 
        
#         # Refresh doc in case of session issues
#         doc = db.query(Document).filter(Document.id == document_id).first()
#         if doc:
#             doc.status = "failed"
#             doc.error_message = str(e)
#             db.commit()
            
#     finally:
#         db.close()






import os
import logging
import asyncio
import traceback
import time
from app.models.document_model import Document
from app.ai.manager import app as ai_app
from app.db.session import SessionLocal
from app.ai.llm import engine, DEFAULT_MODEL_NAME  # Import the singleton instance

# Import the necessary splitter and document loader from LangChain
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
import re

def clean_pdf_text(text: str) -> str:
    """
    Removes unnecessary characters to save tokens and speed up AI processing.
    """
    # 1. Replace multiple newlines/tabs with a single space
    text = re.sub(r'\s+', ' ', text)
    
    # 2. Remove non-ASCII characters (optional, but saves space)
    text = re.sub(r'[^\x00-\x7F]+', ' ', text)
    
    # 3. Trim leading/trailing whitespace
    return text.strip()

logger = logging.getLogger(__name__)

async def process_document(document_id: int): 
    """
    Main background task. Creates its own DB session to stay alive 
    after the API response is sent.
    """
    print(f"--- 🚀 BACKGROUND TASK INITIATED FOR ID: {document_id} ---")
    
    db = SessionLocal()
    
    try:
        # 1. AI ENGINE HEALTH CHECK (Sequential logic for 8GB RAM)
        # Ensure model is initialized for background tasks even if no prior AI request happened
        if not hasattr(engine, 'llm') or engine.llm is None:
            model_name = os.getenv("AI_MODEL_NAME", DEFAULT_MODEL_NAME)
            logger.info(f"🔄 Initializing AI engine for background processing with model: {model_name}")
            engine.initialize(model_name=model_name)

        # Wait up to 10 seconds for the model to finish loading if the server just started
        max_warmup_retries = 5
        for attempt in range(max_warmup_retries):
            if hasattr(engine, 'llm') and engine.llm is not None:
                break
            print(f"⏳ Waiting for AI Engine to load... (Attempt {attempt+1}/{max_warmup_retries})")
            await asyncio.sleep(2)

        if not hasattr(engine, 'llm') or engine.llm is None:
            logger.error(f"❌ AI Engine not initialized for ID: {document_id}")
            raise Exception("AI Engine is not initialized. Likely out of RAM or model path error.")

        # 2. Fetch document with RETRY logic
        doc = None
        for attempt in range(3):
            doc = db.query(Document).filter(Document.id == document_id).first()
            if doc:
                break
            print(f"⚠️ Attempt {attempt+1}: Document {document_id} not found... retrying in 1s")
            await asyncio.sleep(1)
            
        if not doc:
            logger.error(f"❌ Document {document_id} not found after retries.")
            return
        
        logger.info(f"--- 🔄 Starting AI Pipeline for: {doc.filename} ---")

        # 3. TEXT EXTRACTION
        # Load the PDF and extract text so we can truncate it for the summary
        loader = PyPDFLoader(doc.path)
        pages = loader.load()
        full_text = " ".join([page.page_content for page in pages])

        # 4. OPTIMIZATION: Initialize the Text Splitter
        # text_splitter = RecursiveCharacterTextSplitter(
        #     chunk_size=500,
        #     chunk_overlap=50,
        #     separators=["\n\n", "\n", " ", ""]
        # )
        cleaned_text = clean_pdf_text(full_text)



        # 5. Prepare initial state for LangGraph
        initial_state = {
            "file_path": doc.path, 
            "persona": "executive",
            "raw_text":cleaned_text[:800] , # 📉 HARD TRUNCATION: 800 chars (~200 tokens)
            "layout_type": "",
            "vector_status": "pending",
            "query": "Summarize this document",
            "draft": "",
            "critique": "",
            "reflection_count": 3,
            "errors": [],
            "summary": "",
            "chunk_config": {
                "size": 500,
                "overlap": 50,
                "k": 2  # 📉 Lower k for faster processing
            }
        }

        # 6. Execute the Graph
        result = await ai_app.ainvoke(
            initial_state, 
            config={"configurable": {"thread_id": str(doc.id)}}
        )

        # 7. Save results
        doc.content_summary = result.get("summary", "No summary generated.")
        doc.status = "completed"
        db.commit()
        logger.info(f"✅ Successfully processed: {doc.filename}")

    except Exception as e:
        logger.error(f"❌ Processing failed: {str(e)}")
        traceback.print_exc() 
        
        # Refresh doc in case of session issues
        doc = db.query(Document).filter(Document.id == document_id).first()
        if doc:
            doc.status = "failed"
            doc.error_message = str(e)
            db.commit()
            
    finally:
        db.close()