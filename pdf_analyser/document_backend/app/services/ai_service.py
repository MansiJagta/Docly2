# app/services/ai_service.py

import os
import uuid
from app.ai.manager import app as ai_app
from app.ai.manager_qa import app_qa

def run_document_ai(file_path: str, persona: str):
    """
    Runs the AI pipeline on a document and returns the final AI state.
    """

    config = {
        "configurable": {
            "thread_id": f"doc_{uuid.uuid4().hex[:8]}"
        }
    }

    inputs = {
        "file_path": file_path,
        "persona": persona,
        "query": "Analyze this document and provide a summary based on the persona.",
        "raw_text": "",
        "layout_type": "",
        "summary": "",
        "vector_status": "",
        "reflection_count": 0,
        "draft": "",
        "critique": ""
    }

    final_state = {}

    for state in ai_app.stream(inputs, config=config, stream_mode="values"):
        final_state = state

    return final_state


def run_qa_ai(question: str, file_id: str, persona: str = "general_audience"):
    """
    NEW: Runs the Q&A pipeline for a specific question.
    Connects the FastAPI backend to the LangGraph app_qa engine.
    """
    # 1. Setup session persistence
    config = {"configurable": {"thread_id": f"qa_{uuid.uuid4().hex[:8]}"}}

    # 2. Prepare the initial state matching your QAState
    inputs = {
        "question": question,
        "file_id": file_id,
        "persona": persona,
        "retrieved_context": "",
        "answer": "",
        "critique": "",
        "reflection_count": 0
    }

    final_state = {}

    # 3. Stream the Q&A graph (this ensures nodes like retrieve and answer execute)
    print(f"--- STARTING Q&A FOR: {question} ---")
    for state in app_qa.stream(inputs, config=config, stream_mode="values"):
        final_state = state

    return final_state
