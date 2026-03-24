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







from app.ai.state_qa import QAState
from app.ai.embeddings import query_vector_logic 
from app.ai.llm import engine
# engine = LLMEngine(...) # Removed local instantiation

def node_retrieve(state: QAState):
    """Retrieves relevant facts from the local vector DB."""
    print("--- NODE: RETRIEVING FACTS ---")
    # Prefix with 'query: ' is essential for E5 embedding accuracy
    query_text = f"query: {state['question']}"
    docs = query_vector_logic.invoke({"query": query_text, "file_id": state['file_id']})
    return {"retrieved_context": docs}

def node_answer(state: QAState):
    """Generates a grounded answer using Llama-3.2 Instruct format."""
    print("--- NODE: GENERATING ANSWER ---")
    
    # 1. System Prompt sets the Grounding Rules
    system_prompt = (
        "You are a helpful assistant. Answer the user's question using ONLY the provided context.\n"
        "STRICT RULES:\n"
        "- Base your response exclusively on the 'Context from PDF' below.\n"
        "- If the answer is not in the context, state that you cannot find the information.\n"
        "- DO NOT use your internal knowledge to fill in gaps."
    )
    
    # 2. User Query combines Context + Question
    user_content = (
        f"Context from PDF:\n{state['retrieved_context']}\n\n"
        f"Question: {state['question']}"
    )
    
    # temperature=0.1 ensures factual, deterministic answers
    answer = engine.generate(user_content, system_prompt, temperature=0.1)
    
    return {
        "answer": answer, 
        "reflection_count": state.get("reflection_count", 0) + 1
    }

def node_reflect_qa(state: QAState):
    """Audits the answer for Hallucinations or missing info."""
    print("--- NODE: REFLECTOR (QA AUDIT) ---")
    
    audit_system_prompt = (
        "You are a strict technical auditor. Your task is to verify if an AI answer is grounded "
        "in the provided context.\n"
        "RULES:\n"
        "- If the AI answer contains any facts NOT present in the context, output: 'REWRITE'.\n"
        "- If the AI answer is 100% supported by the context, output: 'NO_ERRORS'.\n"
        "- Provide ONLY the verdict string."
    )
    
    audit_user_content = (
        f"CONTEXT: {state['retrieved_context']}\n"
        f"AI ANSWER: {state['answer']}"
    )
    
    # Updated call signature for Ollama wrapper
    critique = engine.generate(audit_user_content, audit_system_prompt, temperature=0.1)
    
    # Clean up output
    clean_critique = "REWRITE" if "REWRITE" in critique.upper() else "NO_ERRORS"
    
    return {"critique": clean_critique}