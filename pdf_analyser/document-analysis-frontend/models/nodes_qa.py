# from state_qa import QAState
# from embeddings import query_vector_logic  # Uses E5 + sqlite-vec
# from llm import engine                     # Your local LLMEngine

# def node_retrieve(state: QAState):
#     """Retrieves relevant facts from the local vector DB."""
#     print("--- NODE: RETRIEVING FACTS ---")
#     # Prefix with 'query: ' for E5 accuracy
#     query = f"query: {state['question']}"
#     docs = query_vector_logic.invoke({"query": query, "file_id": state['file_id']})
#     return {"retrieved_context": docs}

# def node_answer(state: QAState):
#     """Generates an answer based ONLY on the retrieved context."""
#     print("--- NODE: GENERATING ANSWER ---")
#     prompt = (
#         f"Context from PDF:\n{state['retrieved_context']}\n\n"
#         f"Question: {state['question']}\n"
#         "Constraint: Answer using only the context. If unknown, say you can't find it."
#     )
#     answer = engine.generate(state['question'], prompt)
#     return {"answer": answer, "reflection_count": state.get("reflection_count", 0) + 1}

# def node_reflect_qa(state: QAState):
#     """Reflector Node: Audits the answer against the source context."""
#     print("--- NODE: REFLECTOR (QA AUDIT) ---")
#     audit_prompt = (
#         f"Context: {state['retrieved_context']}\n"
#         f"AI Answer: {state['answer']}\n"
#         "Does the answer contain info NOT in the context? Reply 'REWRITE' or 'NO_ERRORS'."
#     )
#     critique = engine.generate("Audit Answer", audit_prompt)
#     return {"critique": critique}







# from state_qa import QAState
# from embeddings import query_vector_logic 
# from llm import engine
# engine = LLMEngine(model_path="assets/llama-3.2-3B-Instruct-QA-Q4_K_M.gguf")

# def node_retrieve(state: QAState):
#     """Retrieves relevant facts from the local vector DB."""
#     print("--- NODE: RETRIEVING FACTS ---")
#     # Prefix with 'query: ' is essential for E5 embedding accuracy
#     query_text = f"query: {state['question']}"
#     docs = query_vector_logic.invoke({"query": query_text, "file_id": state['file_id']})
#     return {"retrieved_context": docs}

# def node_answer(state: QAState):
#     """Generates a grounded answer using Llama-3.2 Instruct format."""
#     print("--- NODE: GENERATING ANSWER ---")
    
#     # 1. System Prompt sets the Grounding Rules
#     system_prompt = (
#         "You are a helpful assistant. Answer the user's question using ONLY the provided context.\n"
#         "STRICT RULES:\n"
#         "- Base your response exclusively on the 'Context from PDF' below.\n"
#         "- If the answer is not in the context, state that you cannot find the information.\n"
#         "- DO NOT use your internal knowledge to fill in gaps."
#     )
    
#     # 2. User Query combines Context + Question
#     user_content = (
#         f"Context from PDF:\n{state['retrieved_context']}\n\n"
#         f"Question: {state['question']}"
#     )
    
#     # temperature=0.1 ensures factual, deterministic answers
#     answer = engine.generate(user_content, system_prompt, temperature=0.1)
    
#     return {
#         "answer": answer, 
#         "reflection_count": state.get("reflection_count", 0) + 1
#     }

# def node_reflect_qa(state: QAState):
#     """Audits the answer for Hallucinations or missing info."""
#     print("--- NODE: REFLECTOR (QA AUDIT) ---")
    
#     audit_system_prompt = (
#         "You are a strict technical auditor. Your task is to verify if an AI answer is grounded "
#         "in the provided context.\n"
#         "RULES:\n"
#         "- If the AI answer contains any facts NOT present in the context, output: 'REWRITE'.\n"
#         "- If the AI answer is 100% supported by the context, output: 'NO_ERRORS'.\n"
#         "- Provide ONLY the verdict string."
#     )
    
#     audit_user_content = (
#         f"CONTEXT: {state['retrieved_context']}\n"
#         f"AI ANSWER: {state['answer']}"
#     )
    
#     critique = engine.generate(audit_user_content, audit_system_prompt, temperature=0.1)
    
#     # Clean up output in case model adds extra text
#     clean_critique = "REWRITE" if "REWRITE" in critique.upper() else "NO_ERRORS"
    
#     return {"critique": clean_critique}









# from state_qa import QAState
# from embeddings import query_vector_logic 
# from llm import engine

# def node_retrieve(state: QAState):
#     print("--- NODE: RETRIEVING FACTS ---")
#     query_text = f"query: {state['question']}"
#     # FIX: Limit top_k to 5 chunks (approx 2500-3000 tokens)
#     # This ensures we never hit the 8192 limit
#     docs = query_vector_logic.invoke({
#         "query": query_text, 
#         "file_id": state['file_id'],
#         "top_k": 5 
#     })
#     return {"retrieved_context": str(docs)}

# def node_answer(state: QAState):
#     print("--- NODE: GENERATING ANSWER ---")
    
#     system_prompt = (
#         "You are a helpful assistant. Answer the user's question using ONLY the provided context. "
#         "If the answer is not in the context, say you cannot find the information."
#     )
    
#     # We slice the retrieved context just in case it's still too huge
#     context = state['retrieved_context'][:15000] # Safe character limit
    
#     user_content = f"Context from PDF:\n{context}\n\nQuestion: {state['question']}"
    
#     answer = engine.generate(user_content, system_prompt, temperature=0.1)
    
#     return {
#         "answer": answer, 
#         "reflection_count": state.get("reflection_count", 0) + 1
#     }

# def node_reflect_qa(state: QAState):
#     """Audits the answer for Hallucinations or missing info."""
#     print("--- NODE: REFLECTOR (QA AUDIT) ---")
    
#     audit_system_prompt = (
#         "You are a strict technical auditor. Your task is to verify if an AI answer is grounded "
#         "in the provided context.\n"
#         "RULES:\n"
#         "- If the AI answer contains any facts NOT present in the context, output: 'REWRITE'.\n"
#         "- If the AI answer is 100% supported by the context, output: 'NO_ERRORS'.\n"
#         "- Provide ONLY the verdict string."
#     )
    
#     audit_user_content = (
#         f"CONTEXT: {state['retrieved_context']}\n"
#         f"AI ANSWER: {state['answer']}"
#     )
    
#     critique = engine.generate(audit_user_content, audit_system_prompt, temperature=0.1)
    
#     # Clean up output
#     clean_critique = "REWRITE" if "REWRITE" in critique.upper() else "NO_ERRORS"
    
#     return {"critique": clean_critique}








from state_qa import QAState
from embeddings import query_vector_logic 
from llm import engine

def node_retrieve(state: QAState):
    """Retrieves relevant facts from the local vector DB."""
    print("--- NODE: RETRIEVING FACTS ---")
    query_text = f"query: {state['question']}"
    
    # 1. FIXED: top_k=5 keeps the total data small enough to handle.
    docs = query_vector_logic.invoke({
        "query": query_text, 
        "file_id": state['file_id'],
        "top_k": 3 
    })
    
    # Ensure it's a string for easier slicing later
    return {"retrieved_context": str(docs)}

def node_answer(state: QAState):
    """Generates an answer using a safe subset of the retrieved context."""
    print("--- NODE: GENERATING ANSWER ---")
    
    system_prompt = (
        "You are a helpful assistant. Answer the user's question using ONLY the provided context. "
        "If the answer is not in the context, say you cannot find the information."
    )
    
    # 2. FIXED: Slice context to ~3000-4000 tokens (approx 12,000 chars)
    # This leaves enough room in the 8,192 token window for the model to think.
    safe_context = state.get('retrieved_context', '')[:12000]
    
    user_content = f"Context from PDF:\n{safe_context}\n\nQuestion: {state['question']}"
    
    answer = engine.generate(user_content, system_prompt, temperature=0.1)
    
    return {
        "answer": answer, 
        "reflection_count": state.get("reflection_count", 0) + 1
    }

def node_reflect_qa(state: QAState):
    """Audits the answer using the SAME safe context window to avoid crashes."""
    print("--- NODE: REFLECTOR (QA AUDIT) ---")
    
    audit_system_prompt = (
        "You are a strict technical auditor. Verify if the AI answer is grounded in the context. "
        "If the answer has facts NOT in the context, output: 'REWRITE'. "
        "Otherwise, output: 'NO_ERRORS'. Provide ONLY the verdict string."
    )
    
    # 3. FIXED: We MUST slice the context here too. 
    # This was the cause of your most recent crash!
    safe_audit_context = state.get('retrieved_context', '')[:12000]
    
    audit_user_content = (
        f"CONTEXT: {safe_audit_context}\n"
        f"AI ANSWER: {state['answer']}"
    )
    
    critique = engine.generate(audit_user_content, audit_system_prompt, temperature=0.1)
    
    # Clean up output
    clean_critique = "REWRITE" if "REWRITE" in critique.upper() else "NO_ERRORS"
    
    return {"critique": clean_critique}