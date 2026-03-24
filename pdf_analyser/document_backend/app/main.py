# from fastapi import FastAPI
# from app.api import documents
# from app.db_init import init_db
# from app.db.session import engine
# from app.models.base import Base
# import app.models.document_model 
# import app.models.qa_model
# import app.models.profile_model

# # Create tables
# Base.metadata.create_all(bind=engine)

# from contextlib import asynccontextmanager
# from app.core.engine_manager import start_ollama_engine

# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     # Startup: specific order matters
#     print("--- 🚀 BACKEND STARTING UP ---")
#     start_ollama_engine() # 1. Ensure AI is running or try to start it
#     init_db()             # 2. Ensure DB is ready
#     yield
#     # Shutdown logic (if any)
#     print("--- 🛑 BACKEND SHUTTING DOWN ---")

# app = FastAPI(
#     title="Offline AI PDF Analyser",
#     version="0.1.0",
#     lifespan=lifespan
# )

# app.include_router(
#     documents.router,
#     prefix="/documents",
#     tags=["Documents"]
# )

# @app.get("/")
# def health_check():
#     return {"status": "ok"}





import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import documents
from app.db_init import init_db
from app.db.session import engine
from app.models.base import Base
import app.models.document_model 
import app.models.qa_model
import app.models.profile_model
from contextlib import asynccontextmanager
from app.core.engine_manager import start_ollama_engine
from fastapi.openapi.utils import get_openapi
from app.ai.manager import app as langgraph_app

# Create tables
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- 🚀 STARTUP ---
    print("\n" + "="*30)
    print("🚀 OFFLINE PDF ANALYSER STARTING")
    print("="*30)
    
    # 1. Start the Silent AI Engine
    # This now handles the second terminal for you
    start_ollama_engine() 
    
    # 2. Ensure DB is ready
    init_db() 

    # 3. Eager import/use of LangGraph app to ensure aggregate workflow is wired at startup.
    _ = langgraph_app
    
    print("✅ Backend is ready. Access Swagger at http://127.0.0.1:8001/docs\n")
    yield
    
    # --- 🛑 SHUTDOWN ---
    print("\n--- 🛑 BACKEND SHUTTING DOWN ---")

app = FastAPI(
    title="Offline AI PDF Analyser",
    version="0.1.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def _patch_binary_schema(node):
    if isinstance(node, dict):
        if node.get("type") == "string" and "contentMediaType" in node:
            node.pop("contentMediaType", None)
            node["format"] = "binary"
        for value in node.values():
            _patch_binary_schema(value)
    elif isinstance(node, list):
        for item in node:
            _patch_binary_schema(item)

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        routes=app.routes,
        description=app.description,
    )
    openapi_schema["openapi"] = "3.0.3"
    _patch_binary_schema(openapi_schema)
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

app.include_router(
    documents.router
)

@app.get("/")
def health_check():
    return {"status": "ok", "engine": "running"}