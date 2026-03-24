# from app.ai.pdf_parser import extract_pdf_logic
# from app.ai.embeddings import index_vector_logic
# from app.ai.llm import engine
# from app.ai.persona import PERSONAS
# import fitz
# import re


# ALLOWED_CATEGORIES = {"RESUME", "RESEARCH_PAPER", "DATASHEET", "LEGAL", "OTHER"}


# def _clean_text_snippet(text: str, limit: int = 500) -> str:
#     compact = " ".join((text or "").split())
#     return compact[:limit]


# def _extract_resume_name(raw_text: str) -> str:
#     match = re.search(r"(?im)^\s*(?:name\s*[:\-]\s*)([a-z][a-z\s\.'-]{2,60})$", raw_text or "")
#     if match:
#         return " ".join(match.group(1).split())

#     for line in (raw_text or "").splitlines()[:8]:
#         candidate = " ".join(line.split())
#         if not candidate:
#             continue
#         if any(token in candidate.lower() for token in ["email", "phone", "linkedin", "github", "address"]):
#             continue
#         if 2 <= len(candidate.split()) <= 4 and all(part.replace(".", "").isalpha() for part in candidate.split()):
#             return candidate
#     return ""


# def _normalize_category(raw_category: str) -> str:
#     token = re.sub(r"[^A-Z_]", "", (raw_category or "").strip().upper())
#     return token if token in ALLOWED_CATEGORIES else "OTHER"

# def node_extract_layout(state):
#     print("--- NODE: EXTRACTING TEXT & LAYOUT ---")
#     tool_result = extract_pdf_logic.invoke({"file_path": state['file_path']})
#     return {
#         "raw_text": tool_result["content"], 
#         "layout_type": "scanned" if tool_result["is_scanned"] else "digital"
#     }


# async def node_classify(state):
#     """
#     DNA Classifier Node: Uses 4-Point Sampling to identify document intent.
#     Accuracy Target: 93%+
#     """
#     file_path = state.get("file_path")
#     doc = fitz.open(file_path)
#     total_pages = len(doc)
    
#     # 1. 4-Point DNA Sampling (Start, 33%, 66%, End)
#     # Extract 500 characters from each quadrant to minimize RAM usage
#     sample_pages = [0, total_pages // 3, (2 * total_pages) // 3, total_pages - 1]
#     dna_samples = []
    
#     for pg_idx in sample_pages:
#         if 0 <= pg_idx < total_pages:
#             text = doc[pg_idx].get_text()[:500]
#             dna_samples.append(f"--- QUADRANT {pg_idx} ---\n{text}")
    
#     combined_dna = "\n".join(dna_samples)

#     # 2. Comprehensive Taxonomy Prompt
#     system_prompt = """
#     You are a Document DNA Expert. Categorize this file based on these structural markers:
#     - RESUME: Name, Contact, 'Education', 'Skills', CGPA. (Look at Start/33%)
#     - COMPETITION_BRIEF: 'Submission Date', 'Scoring Criteria', 'Round'. (Look at all quadrants)
#     - RESEARCH_PAPER: 'Abstract', 'Introduction', 'Methodology', 'References'. (References at End)
#     - DATASHEET: 'Electrical Characteristics', 'Pin Configuration', 'Voltage'. (Look at 33%/66%)
#     - LEGAL: 'Agreement', 'Jurisdiction', 'Liability', 'Signatures'. (Look at Start/End)
    
#     Return your answer in EXACTLY this JSON format:
#     {"category": "CATEGORY_NAME", "confidence": 0.95}
#     """

#     # 3. Call the Local Model (Qwen2.5-1.5B)
#     response = engine.generate(user_query=combined_dna, system_prompt=system_prompt)
    
#     # Simple parser to handle LLM output
#     try:
#         import json
#         result = json.loads(response)
#         category = result.get("category", "GENERAL_DOCUMENT")
#         confidence = result.get("confidence", 0.0)
#     except:
#         category = "GENERAL_DOCUMENT"
#         confidence = 0.5

#     print(f"--- 🧬 CLASSIFIED AS: {category} ({confidence*100}%) ---")
    
#     return {
#         "doc_category": category,
#         "doc_confidence": confidence
#     }

# def node_index_vectors(state):
#     print("--- NODE: INDEXING TO SQLITE-VEC ---")
#     index_vector_logic.invoke({"text": state['raw_text']})
#     return {"vector_status": "completed"}

# async def node_summarize(state):
#     """Generates category-aware draft summaries with a switch-style persona map."""
#     category = (state.get("doc_category") or "OTHER").upper()
#     persona_key = (state.get("persona") or "executive").lower()
#     print(f"--- NODE: GENERATING DRAFT ({category}) ---")

#     base_persona = PERSONAS.get(persona_key, "Summarize this document clearly and accurately.")
#     category_prompt_map = {
#         "RESUME": (
#             "Focus on the candidate profile. Explicitly capture: Full Name, CGPA (if present), "
#             "Education, and Skillset. Avoid speculative claims."
#         ),
#         "RESEARCH_PAPER": (
#             "Focus on scientific structure. Explicitly capture: objective, methodology, experimental setup, "
#             "and key results/conclusions."
#         ),
#         "DATASHEET": (
#             "Focus on device-level technical facts: component identity, pinout/interfaces, voltage/current limits, "
#             "timing or operating constraints, and compliance notes."
#         ),
#         "LEGAL": (
#             "Focus on legal structure: parties, major clauses, obligations, liabilities, deadlines, and exceptions."
#         ),
#         "OTHER": "Summarize major themes, key entities, factual highlights, and actionable points.",
#     }

#     source_text = state.get("raw_text", "")[:5000]
#     system_instructions = (
#         f"{base_persona}\n\n"
#         f"DOCUMENT CATEGORY: {category}\n"
#         f"CATEGORY INSTRUCTIONS: {category_prompt_map.get(category, category_prompt_map['OTHER'])}\n\n"
#         "STRICT RULES:\n"
#         "- Keep statements grounded in source content.\n"
#         "- Do not invent facts.\n"
#         "- Return only the summary body.\n"
#     )
#     user_query = f"Create an accurate summary for this {category} document.\n\nSOURCE:\n{source_text}"

#     draft = await engine.agenerate(user_query, system_instructions, temperature=0.1)
#     return {"draft": (draft or "").strip()}


# async def node_audit(state):
#     """Validator node for reflection loop; decides if regeneration is needed."""
#     print("--- NODE: AUDIT (REFLECTION VALIDATOR) ---")

#     raw_text = state.get("raw_text", "")
#     draft = state.get("draft", "")
#     category = (state.get("doc_category") or "OTHER").upper()
#     is_combined = bool(state.get("is_combined", False))
#     next_count = int(state.get("reflection_count", 0)) + 1
#     audit_notes = []
#     deterministic_fail = False

#     if category == "RESUME":
#         extracted_name = _extract_resume_name(raw_text)
#         has_cgpa_source = bool(re.search(r"\bcgpa\b|\bgpa\b", raw_text or "", re.IGNORECASE))
#         has_cgpa_summary = bool(re.search(r"\bcgpa\b|\bgpa\b", draft or "", re.IGNORECASE))

#         if extracted_name and extracted_name.lower() not in (draft or "").lower():
#             deterministic_fail = True
#             audit_notes.append("Resume summary is missing the candidate name.")

#         if has_cgpa_source and not has_cgpa_summary:
#             deterministic_fail = True
#             audit_notes.append("Resume summary is missing CGPA/GPA even though it appears in source text.")

#     validator_system = (
#         "You are a strict factual validator. Compare summary against source text. "
#         "If the summary misses required core facts for its document type, mixes unrelated content, or fabricates claims, "
#         "set is_accurate to false. Respond in JSON only: "
#         '{"is_accurate": true|false, "reason": "short reason"}. '
#     )
#     if is_combined:
#         validator_system += (
#             "In combined mode, treat <doc name='...'> boundaries as hard separators. "
#             "If claims appear attributed to the wrong tagged document, set is_accurate to false. "
#         )

#     validator_input = (
#         f"CATEGORY: {category}\n"
#         f"SOURCE:\n{raw_text[:6000]}\n\n"
#         f"SUMMARY:\n{draft[:3500]}"
#     )
#     llm_verdict = await engine.agenerate(validator_input, validator_system, temperature=0.1)

#     llm_false = "false" in (llm_verdict or "").lower()
#     reason_match = re.search(r'"reason"\s*:\s*"([^"]+)"', llm_verdict or "", re.IGNORECASE)
#     llm_reason = reason_match.group(1).strip() if reason_match else "Validator requested revision."

#     is_accurate = not deterministic_fail and not llm_false
#     if not is_accurate:
#         audit_notes.append(llm_reason)

#     return {
#         "is_accurate": is_accurate,
#         "critique": " ".join(audit_notes).strip() or "NO_ERRORS_FOUND",
#         "reflection_count": next_count,
#     }


# async def node_generate_draft(state):
#     """Backward-compatible alias for older imports."""
#     return await node_summarize(state)

# def node_reflect_critic(state):
#     """The Reflector Node: Binary check using the Instruct template."""
#     print("--- NODE: REFLECTOR (CRITIC) ---")
    
#     critic_prompt = (
#         "You are a technical editor. Review the following summary for accuracy and repetition. "
#         "If it repeats lines, lacks technical detail, or mentions persona names (like 'CTO'), "
#         "output ONLY the word 'REWRITE'. "
#         "If it is high-quality and correct, output ONLY 'NO_ERRORS_FOUND'."
#     )
    
#     critique = engine.generate(f"TEXT TO CHECK: {state['draft']}", critic_prompt, temperature=0.1)
#     return {"critique": critique}

# def node_refine_answer(state):
#     """Refines the answer using Llama-3.2's stronger reasoning capabilities."""
#     print(f"--- NODE: REFINER - ITERATION {state.get('reflection_count')} ---")
#     current_count = state.get('reflection_count', 1)

#     persona_key = state.get('persona', 'executive').lower()
#     persona_instruction = PERSONAS.get(persona_key)

#     system_instructions = (
#         f"Role: {persona_instruction}\n"
#         "Task: Technical refinement. Remove any conversational filler or instruction leakage.\n"
#         "Do NOT remove any technical names, version numbers, or specific module names from the original draft unless they are explicitly identified as errors.\n"
#         "Output only the improved facts."
#     )

#     context_data = f"DRAFT: {state['draft']}\nCRITIQUE: {state['critique']}"
#     refined_draft = engine.generate(context_data, system_instructions, temperature=0.1)

#     return {
#         "draft": refined_draft.strip(),
#         "reflection_count": current_count + 1
#     }

# def node_finalize(state):
#     """Final cleaning for professional formatting."""
#     print("--- NODE: FINALIZING & CLEANING ---")
    
#     raw_text = state.get("draft", "")
#     if not raw_text:
#         return {"summary": "Error: Finalization failed."}

#     # Remove instruction noise that might leak from Llama-3.2
#     forbidden = ["Task:", "Constraint:", "Role:", "Rewrite", "OPTIONS:", "Acting Director"]

#     lines = raw_text.split('\n')
#     unique_lines = []
#     seen = set()

#     for line in lines:
#         stripped = line.strip()
#         if not stripped or len(stripped) < 15: # Filter out short noise
#             continue
            
#         if any(word.lower() in stripped.lower() for word in forbidden):
#             continue

#         if stripped.lower() not in seen:
#             unique_lines.append(stripped)
#             seen.add(stripped.lower())

#     final_summary = "\n\n".join(unique_lines)
#     return {"summary": final_summary}










# import fitz  # PyMuPDF
# import re
# import json
# from app.ai.pdf_parser import extract_pdf_logic
# from app.ai.embeddings import index_vector_logic
# from app.ai.llm import engine
# from app.ai.persona import PERSONAS

# # 1. Classification & Layout Nodes
# # ----------------------------------------------------------------

# def node_extract_layout(state):
#     print("--- NODE: EXTRACTING TEXT & LAYOUT ---")
#     tool_result = extract_pdf_logic.invoke({"file_path": state['file_path']})
#     return {
#         "raw_text": tool_result["content"], 
#         "layout_type": "scanned" if tool_result["is_scanned"] else "digital"
#     }

# async def node_classify(state: dict):
#     """DNA Classifier: identifies document type to ground the summary."""
#     print("--- NODE: DNA CLASSIFICATION ---")
#     file_path = state.get("file_path")
#     doc = fitz.open(file_path)
#     total_pages = len(doc)
    
#     # 4-Point Sampling (0%, 33%, 66%, 100%) for 8GB RAM safety
#     sample_indices = [0, total_pages // 3, (2 * total_pages) // 3, total_pages - 1]
#     unique_indices = sorted(list(set(sample_indices)))
    
#     samples = []
#     for idx in unique_indices:
#         if 0 <= idx < total_pages:
#             page_text = doc[idx].get_text().strip()[:500]
#             samples.append(f"--- QUADRANT {idx+1} ---\n{page_text}")
    
#     dna_text = "\n\n".join(samples)
#     doc.close() # Free RAM immediately

#     system_prompt = """
#     Identify document type: 
#     - RESUME: Name, CGPA, Education. 
#     - TECHNICAL_LAB: Cipher, Experiment, Security Status.
#     - COMPETITION_BRIEF: Deadlines, Prizes, Constraints.
#     - RESEARCH_PAPER: Abstract, DOI, Methodology.
#     Return JSON ONLY: {"category": "TYPE", "confidence": 0.9}
#     """
#     response = await engine.agenerate(dna_text, system_prompt, temperature=0.1)
    
#     try:
#         data = json.loads(response)
#         category = data.get("category", "OTHER").upper()
#     except:
#         category = "OTHER"

#     print(f"🧬 Result: {category}")
#     return {"doc_category": category}

# # 2. Dynamic Agentic Summarization
# # ----------------------------------------------------------------

# async def node_summarize(state: dict):
#     """Generates a summary by injecting the chosen PERSONA into the Category DNA."""
#     category = (state.get("doc_category") or "OTHER").upper()
    
#     # DYNAMIC PERSONA INJECTION [cite: 58]
#     persona_key = (state.get("persona") or "general_audience").lower()
#     persona_instruction = PERSONAS.get(persona_key, PERSONAS["general_audience"])
    
#     print(f"--- NODE: SUMMARIZING AS {persona_key.upper()} ({category}) ---")

#     # Category-Specific Anchors to prevent 10% accuracy failures
#     anchors = {
#         "RESUME": "MANDATORY: Candidate Name, PICT University, CGPA (e.g. 9.49).",
#         "TECHNICAL_LAB": "MANDATORY: Cipher Type (e.g. Vernam), Lab Scenarios, Vulnerabilities.",
#         "COMPETITION_BRIEF": "MANDATORY: Deadlines, Technical Constraints (RAM/CPU), Prize Pool.",
#     }

#     system_instructions = (
#         f"{persona_instruction}\n\n"
#         f"DOCUMENT TYPE: {category}\n"
#         f"CORE ANCHORS: {anchors.get(category, 'Extract key factual highlights.')}\n\n"
#         "STRICT FIDELITY: Use source text only. Do not invent facts."
#     )

#     source_text = state.get("raw_text", "")[:7000] # Safe 8GB RAM context
#     user_query = f"Provide a high-accuracy summary of this {category} for a {persona_key} role."

#     draft = await engine.agenerate(user_query, system_instructions, temperature=0.1)
#     return {"draft": (draft or "").strip()}

# # 3. Reflection & Self-Healing Nodes
# # ----------------------------------------------------------------

# async def node_audit(state: dict):
#     """Validator: decides if regeneration is needed based on persona-fidelity[cite: 76]."""
#     print("--- NODE: AUDIT (SELF-HEALING CHECK) ---")
    
#     persona_key = state.get("persona", "general_audience")
#     category = state.get("doc_category", "OTHER")
#     draft = state.get("draft", "")
#     raw = state.get("raw_text", "")[:5000]

#     # Auditor uses the PERSONA definition to verify the AI's "character"
#     audit_prompt = (
#         f"You are a Quality Lead. The user requested a {persona_key} summary.\n"
#         f"Persona Rules: {PERSONAS.get(persona_key)}\n"
#         "Check for: JNV/PICT confusion, correct Cipher results, and accuracy.\n"
#         "Return JSON: {'is_accurate': true|false, 'reason': '...'}"
#     )

#     verdict = await engine.agenerate(f"SUMMARY: {draft}\nSOURCE: {raw}", audit_prompt)
    
#     is_accurate = "true" in verdict.lower()
#     next_count = int(state.get("reflection_count", 0)) + 1
    
#     return {
#         "is_accurate": is_accurate, 
#         "reflection_count": next_count,
#         "critique": verdict if not is_accurate else "PASSED"
#     }

# def node_finalize(state):
#     """Final cleaning for demo-ready formatting."""
#     print("--- NODE: FINALIZING ---")
#     raw_text = state.get("draft", "")
#     # Remove metadata noise (Role:, Task:, etc.)
#     cleaned = re.sub(r"^(Role|Task|Constraint|Requirement):.*$", "", raw_text, flags=re.MULTILINE)
#     return {"summary": cleaned.strip()}





# import fitz  # PyMuPDF
# import re
# import json
# from app.ai.pdf_parser import extract_pdf_logic
# from app.ai.embeddings import index_vector_logic
# from app.ai.llm import engine
# from app.ai.persona import PERSONAS

# # 1. Classification & Layout Nodes
# # ----------------------------------------------------------------

# def node_extract_layout(state):
#     print("--- NODE: EXTRACTING TEXT & LAYOUT ---")
#     tool_result = extract_pdf_logic.invoke({"file_path": state['file_path']})
#     return {
#         "raw_text": tool_result["content"], 
#         "layout_type": "scanned" if tool_result["is_scanned"] else "digital"
#     }

# async def node_classify(state: dict):
#     """
#     🧬 DNA Classifier Node: Performs 4-point sampling to identify document type.
#     Uses 0% (Start), 33% (Intro), 66% (Technical), and 100% (End) marks.
#     """
#     print("--- NODE: DNA CLASSIFICATION (4-POINT SAMPLING) ---")
#     file_path = state.get("file_path")
#     doc = fitz.open(file_path)
#     total_pages = len(doc)
    
#     # 1. 4-Point Logic: Jump to 0%, 33%, 66%, and 100% of the document
#     sample_indices = [
#         0,                      # Header/Identity
#         total_pages // 3,       # Early Context (where Education/Intro lives)
#         (2 * total_pages) // 3, # Deep Technical (where Lab Scenarios live) [cite: 212]
#         total_pages - 1         # References/Constraints
#     ]
    
#     unique_indices = sorted(list(set(sample_indices)))
    
#     samples = []
#     for idx in unique_indices:
#         if 0 <= idx < total_pages:
#             # Extract only 500 chars to save 8GB RAM for the model later
#             page_text = doc[idx].get_text().strip()[:500]
#             samples.append(f"--- QUADRANT {idx+1} DNA ---\n{page_text}")
    
#     dna_text = "\n\n".join(samples)
#     doc.close() # CRITICAL: Free RAM immediately

#     # 2. Strong Reasoning Prompt for Qwen-1.5B
#     system_prompt = """
#     You are a Document DNA Expert. Analyze these 4-point samples to identify the file type:
#     - RESUME: Look for name, 'PICT', 'Education', 'CGPA' in the first 33%.
#     - TECHNICAL_LAB: Look for 'Scenario', 'Cipher', 'Binary Key', 'Encryption' in middle quadrants. [cite: 212, 219]
#     - COMPETITION_BRIEF: Look for 'Submission Date', 'Prize', 'RAM/CPU' limits. [cite: 48, 501]
#     - RESEARCH_PAPER: Look for 'Abstract', 'Methodology', 'References' at the end.
    
#     STRICT: If binary code (0110...) or 'Scenario' is found, classify as TECHNICAL_LAB.
#     Return JSON ONLY: {"category": "TYPE", "confidence": 0.95}
#     """

#     response = await engine.agenerate(dna_text, system_prompt, temperature=0.1)
    
#     try:
#         data = json.loads(response)
#         category = data.get("category", "OTHER").upper()
#     except:
#         category = "OTHER"

#     print(f"🧬 Result: {category}")
#     return {"doc_category": category}


# def node_index_vectors(state):
#     """Indexes extracted text into sqlite-vec for retrieval and QA."""
#     print("--- NODE: INDEXING TO SQLITE-VEC ---")
#     index_vector_logic.invoke({"text": state.get("raw_text", "")})
#     return {"vector_status": "completed"}

# # 2. Dynamic Agentic Summarization
# # ----------------------------------------------------------------

# async def node_summarize(state: dict):
#     """Generates a summary by injecting the chosen PERSONA into the Category DNA."""
#     category = (state.get("doc_category") or "OTHER").upper()
#     persona_key = (state.get("persona") or "general_audience").lower()
    
#     print(f"--- NODE: SUMMARIZING AS {persona_key.upper()} for {category} ---")

#     # Category-Specific Anchors force the model to look for high-accuracy data
#     anchors = {
#         "RESUME": "MANDATORY: Candidate Name, University (PICT), and CGPA (9.49).",
#         "TECHNICAL_LAB": "MANDATORY: Cipher logic (Vernam), Lab Scenarios, and Security Status.",
#         "COMPETITION_BRIEF": "MANDATORY: Deadline (July 28), Prize Pool, and Technical Constraints.",
#     }

#     # Retrieve the specific Persona logic you provided in PERSONAS [cite: 58]
#     persona_instruction = PERSONAS.get(persona_key, PERSONAS["general_audience"])

#     system_instructions = (
#         f"{persona_instruction}\n\n"
#         f"DOC DNA: {category}\n"
#         f"ANCHOR GOALS: {anchors.get(category, 'General highlights.')}\n\n"
#         "STRICT: No conversational filler. Ground everything in source text."
#     )

#     # Context window management for 8GB RAM safety
#     source_text = state.get("raw_text", "")[:7000]
#     user_query = f"Execute {persona_key} summary for this {category} file."

#     draft = await engine.agenerate(user_query, system_instructions, temperature=0.1)
#     return {"draft": (draft or "").strip(), "reflection_count": state.get("reflection_count", 0) + 1}

# # 3. Reflection & Self-Healing Node
# # ----------------------------------------------------------------

# async def node_audit(state: dict):
#     """Fidelity Check: decides if a rewrite is needed."""
#     print("--- NODE: AUDIT (ACCURACY CHECK) ---")
    
#     draft = state.get("draft", "")
#     raw = state.get("raw_text", "")[:5000]
#     category = state.get("doc_category", "OTHER")

#     # The Auditor detects the JNV vs PICT error or "Missing CGPA"
#     audit_prompt = (
#         f"You are a Quality Lead. The category is {category}.\n"
#         "Compare the summary to the source. Check for:\n"
#         "1. Wrong University (PICT vs JNV)\n"
#         "2. Missing binary cipher logic or lab results.\n"
#         "If accurate, return 'PASSED'. Otherwise, return JSON: {'is_accurate': false, 'reason': '...'}"
#     )

#     verdict = await engine.agenerate(f"SUMMARY: {draft}\nSOURCE: {raw}", audit_prompt)
#     is_accurate = "PASSED" in verdict.upper()
    
#     return {"is_accurate": is_accurate, "critique": verdict if not is_accurate else "PASSED"}

# def node_finalize(state):
#     """Cleans up any AI-generated metadata for the final UI view."""
#     raw_text = state.get("draft", "")
#     cleaned = re.sub(r"^(Role|Task|Constraint|Requirement):.*$", "", raw_text, flags=re.MULTILINE)
#     return {"summary": cleaned.strip()}









import fitz  # PyMuPDF
import re
import json
from app.ai.pdf_parser import extract_pdf_logic
from app.ai.embeddings import index_vector_logic
from app.ai.llm import engine
from app.ai.persona import PERSONAS

CATEGORY_TYPES = {
    "RESUME",
    "TECHNICAL_LAB",
    "COMPETITION_BRIEF",
    "RESEARCH_PAPER",
    "API_GUIDE",
    "CERTIFICATE",
}

BIOLOGY_TERMS = {"genetics", "cancer"}

# 1. Classification & Layout Nodes
# ----------------------------------------------------------------

def node_extract_layout(state):
    print("--- NODE: EXTRACTING TEXT & LAYOUT ---")
    tool_result = extract_pdf_logic.invoke({"file_path": state['file_path']})
    return {
        "raw_text": tool_result["content"], 
        "layout_type": "scanned" if tool_result["is_scanned"] else "digital"
    }

async def node_classify(state: dict):
    """
    🧬 DNA Classifier Node: Performs 4-point sampling to identify document type.
    Uses 0% (Start), 33% (Intro), 66% (Technical), and 100% (End) marks.
    """
    print("--- NODE: DNA CLASSIFICATION (4-POINT SAMPLING) ---")
    file_path = state.get("file_path")
    doc = fitz.open(file_path)
    total_pages = len(doc)
    
    # 4-point sampling at 0%, 33%, 66%, 100%
    sample_indices = [0, int((total_pages - 1) * 0.33), int((total_pages - 1) * 0.66), total_pages - 1]
    unique_indices = sorted(list(set(sample_indices)))
    
    samples = []
    for idx in unique_indices:
        if 0 <= idx < total_pages:
            # Extract 500 chars to save 8GB RAM
            page_text = doc[idx].get_text().strip()[:500]
            samples.append(f"--- POINT {idx+1} DNA ---\n{page_text}")
    
    dna_text = "\n\n".join(samples)
    doc.close() # Free RAM immediately

    dna_lower = dna_text.lower()
    if "udemy" in dna_lower or "completion" in dna_lower:
        return {"doc_category": "CERTIFICATE", "doc_confidence": 0.99, "dna_samples": dna_text}

    system_prompt = """
    Analyze these 4-point samples from a single document and classify into exactly one category:
    - RESUME: name, education, PICT, CGPA, skills.
    - TECHNICAL_LAB: ciphers, experiments, scenarios, security status.
    - COMPETITION_BRIEF: deadlines, submission rules, scoring, prize, constraints.
    - RESEARCH_PAPER: abstract, DOI, methodology, results, references.
    - API_GUIDE: API types/endpoints, request/response, risks (Zombie/Shadow/Orphaned APIs).
    - CERTIFICATE: completion language, issuer/provider (e.g., Udemy), recipient, course title.

    STRICT RULES:
    - If 'Udemy' or 'Completion' appears, classify as CERTIFICATE.
    - Return JSON only: {"category":"TYPE","confidence":0.00}
    """

    response = await engine.agenerate(dna_text, system_prompt, temperature=0.1)
    
    try:
        data = json.loads(response)
        category = data.get("category", "RESEARCH_PAPER").upper()
        confidence = float(data.get("confidence", 0.75))
    except Exception:
        confidence = 0.70
        if any(k in dna_lower for k in ["zombie api", "shadow api", "orphaned api", "endpoint"]):
            category = "API_GUIDE"
        elif any(k in dna_lower for k in ["cipher", "scenario", "experiment", "insecure", "secure"]):
            category = "TECHNICAL_LAB"
        elif any(k in dna_lower for k in ["cgpa", "education", "resume", "skills"]):
            category = "RESUME"
        elif any(k in dna_lower for k in ["submission", "deadline", "prize", "competition"]):
            category = "COMPETITION_BRIEF"
        elif any(k in dna_lower for k in ["abstract", "doi", "methodology", "references"]):
            category = "RESEARCH_PAPER"
        else:
            category = "RESEARCH_PAPER"

    if category not in CATEGORY_TYPES:
        category = "RESEARCH_PAPER"

    print(f"🧬 Result: {category}")
    return {"doc_category": category, "doc_confidence": confidence, "dna_samples": dna_text}

def node_index_vectors(state):
    print("--- NODE: INDEXING TO SQLITE-VEC ---")
    index_vector_logic.invoke({"text": state.get("raw_text", "")})
    return {"vector_status": "completed"}

# 2. Dynamic Agentic Summarization
# ----------------------------------------------------------------

async def node_summarize(state: dict):
    """Generates a summary by injecting any PERSONA into the Document Category."""
    category = (state.get("doc_category") or "OTHER").upper()
    persona_key = (state.get("persona") or "general_audience").lower()
    persona_instruction = PERSONAS.get(persona_key, PERSONAS["general_audience"])
    
    print(f"--- NODE: SUMMARIZING AS {persona_key.upper()} for {category} ---")

    # Dynamic Anchors ensure the correct facts are pulled for any doc type
    anchors = {
        "RESUME": "POSITIVE ANCHORS: Extract Name, PICT University, and CGPA.",
        "CERTIFICATE": "POSITIVE ANCHORS: Extract Recipient Name and Course Title.",
        "TECHNICAL_LAB": "POSITIVE ANCHORS: Extract Cipher logic, Scenarios, and Security Status (Secure/Insecure).",
        "API_GUIDE": "POSITIVE ANCHORS: Extract API Types (Zombie, Shadow, Orphaned) and specific risks.",
        "COMPETITION_BRIEF": "POSITIVE ANCHORS: Extract submission deadline, prize details, and constraints.",
        "RESEARCH_PAPER": "POSITIVE ANCHORS: Extract Methodology and Results.",
    }

    # CRITICAL: Metadata Shielding Prompt to prevent 'Biological DNA' hallucinations
    system_instructions = (
        f"{persona_instruction}\n\n"
        f"DOC_CATEGORY: {category}\n"
        f"CORE_REQUIREMENTS: {anchors.get(category, 'Extract factual highlights.')}\n\n"
        "--- METADATA SHIELD ---\n"
        "1. The word 'DNA' is a technical label for classification and NOT a biological subject.\n"
        "2. Do NOT mention biology, genetics, or cancer unless the source text explicitly discusses them.\n"
        "3. Focus ONLY on the content inside the provided text.\n"
        "4. No conversational filler. Provide only the summary body."
    )

    source_text = state.get("raw_text", "")[:7000] # Safe for 8GB RAM
    user_query = (
        f"Provide a high-accuracy {persona_key} summary of this {category} document.\n\n"
        f"SOURCE:\n{source_text}"
    )

    draft = await engine.agenerate(user_query, system_instructions, temperature=0.1)
    return {"draft": (draft or "").strip()}

# 3. Reflection & Self-Healing Node
# ----------------------------------------------------------------

async def node_audit(state: dict):
    """Validator: Rejects placeholders and hallucinations[cite: 76]."""
    print("--- NODE: AUDIT (ACCURACY CHECK) ---")
    
    draft = (state.get("draft", "") or "").strip()
    raw = state.get("raw_text", "")[:5000]
    category = (state.get("doc_category", "RESEARCH_PAPER") or "RESEARCH_PAPER").upper()
    next_count = int(state.get("reflection_count", 0)) + 1
    failures = []

    lower_draft = draft.lower()
    starts_meta = lower_draft.startswith("certainly!") or lower_draft.startswith("this document")
    has_placeholders = "[" in draft or "]" in draft or "describe project" in lower_draft
    non_bio_mentions_bio = category != "RESEARCH_PAPER" and any(term in lower_draft for term in BIOLOGY_TERMS)

    if has_placeholders:
        failures.append("Contains brackets/placeholders.")
    if starts_meta:
        failures.append("Starts with meta-talk.")
    if non_bio_mentions_bio:
        failures.append("Non-biology summary mentions genetics/cancer.")

    # Resume guardrails remain strict.
    if category == "RESUME":
        if "cgpa" in raw.lower() and "cgpa" not in lower_draft:
            failures.append("Missing CGPA in resume summary.")

    if failures:
        return {
            "is_accurate": False,
            "critique": " ".join(failures),
            "reflection_count": next_count,
        }

    # The Auditor checks for the common accuracy killers
    audit_prompt = (
        f"Compare this summary to source text for category {category}.\n"
        "Return PASSED only when fully accurate and grounded.\n"
        "Otherwise return JSON: {'is_accurate': false, 'reason': '...'}"
    )

    verdict = await engine.agenerate(f"SUMMARY: {draft}\nSOURCE: {raw}", audit_prompt, temperature=0)
    is_accurate = "PASSED" in verdict.upper()
    
    return {
        "is_accurate": is_accurate,
        "critique": verdict if not is_accurate else "PASSED",
        "reflection_count": next_count,
    }

def node_finalize(state):
    """Clean final output for the UI."""
    raw_text = state.get("draft", "")
    # Remove any instruction leakage
    cleaned = re.sub(r"^(Role|Task|Constraint|Requirement|Note):.*$", "", raw_text, flags=re.MULTILINE)
    return {"summary": cleaned.strip()}