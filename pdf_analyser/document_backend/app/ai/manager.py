# from langgraph.graph import StateGraph, START, END
# from langgraph.checkpoint.memory import MemorySaver
# from sqlalchemy import asc
# import asyncio

# from app.ai.state import GraphState
# from app.ai.nodes import (
#     node_extract_layout, 
#     node_classify,
#     node_index_vectors, 
#     node_summarize,
#     node_audit,
#     node_finalize
# )
# from app.ai.llm import engine
# from app.db.session import SessionLocal
# from app.models.document_model import Document

# checkpointer = MemorySaver()


# def route_from_start(state: GraphState) -> str:
#     """Choose the graph entrypoint based on request mode."""
#     return "aggregate_documents" if state.get("is_combined", False) else "parser"


# def route_from_auditor(state: GraphState) -> str:
#     """Reflection loop: retry generation if audit fails and retry budget remains."""
#     is_accurate = bool(state.get("is_accurate", False))
#     reflection_count = int(state.get("reflection_count", 0))
#     if (not is_accurate) and reflection_count < 2:
#         return "generator"
#     return "finalize"


# async def node_aggregate_documents(state: GraphState):
#     """Build a super-summary from existing per-document summaries in one workspace."""
#     document_ids = state.get("document_ids", [])
#     persona = (state.get("persona") or "executive").lower()
#     if not document_ids:
#         return {
#             "summary": "No documents were provided for combined summarization.",
#             "errors": ["document_ids is empty"],
#         }

#     db = SessionLocal()
#     try:
#         docs = (
#             db.query(Document)
#             .filter(Document.id.in_(document_ids))
#             .order_by(asc(Document.id))
#             .all()
#         )

#         summary_blocks = []
#         for doc in docs:
#             if doc.content_summary:
#                 summary_blocks.append(
#                     f"<doc name='{doc.filename}'>\n{doc.content_summary.strip()}\n</doc>"
#                 )

#         if not summary_blocks:
#             return {
#                 "summary": "No completed document summaries were found for aggregation.",
#                 "errors": ["No content_summary data available"],
#             }

#         combined_text = "\n\n---\n\n".join(summary_blocks)

#         # Force the lightweight model for combined mode on constrained hardware.
#         engine.initialize(model_name="qwen2.5:1.5b")

#         persona_system_map = {
            

#     # --- 🏢 EXECUTIVE & BUSINESS (Focus: Strategy & ROI) ---
#     "ceo": (
#         "Role: CEO. Task: High-level Strategic Summary.\n"
#         "Focus: Business impact, ROI, and long-term vision.\n"
#         "Format: 3 professional bullet points. No technical jargon.\n"
#         "Constraint: Avoid repetition. If ROI isn't explicitly stated, estimate value based on efficiency."
#     ),
#     "product_manager": (
#         "Role: Product Manager. Task: Feature & Roadmap Analysis.\n"
#         "Focus: User benefits, specific features, and 'Key Value Propositions'.\n"
#         "Format: List features followed by their specific user impact. Avoid meta-talk."
#     ),
#     "marketing_director": (
#         "Role: Marketing Director. Task: Brand & USP Extraction.\n"
#         "Focus: Unique Selling Points (USPs) and Target Audience demographics.\n"
#         "Output: 1. A 2-sentence 'Elevator Pitch'. 2. A list of 3 marketing hooks."
#     ),
#     "financial_analyst": (
#         "Role: Financial Analyst. Task: Fiscal Metric Extraction.\n"
#         "Focus: Cost structures, revenue projections, and market growth numbers.\n"
#         "Format: A structured summary table. Constraint: No repetitions. Use hard numbers from text."
#     ),
#     "operations_manager": (
#         "Role: Operations Manager. Task: Process & Efficiency Audit.\n"
#         "Focus: Workflow bottlenecks, resource allocation, and process improvements.\n"
#         "Format: Step-by-step efficiency breakdown."
#     ),

#     # --- 💻 TECHNICAL & ENGINEERING (Focus: Architecture & Implementation) ---
#     "cto": (
#         "Role: CTO. Task: Technical Strategy & Risk Assessment.\n"
#         "Focus: System architecture, scalability, and technical debt.\n"
#         "Requirement: List top 3 architectural decisions and their scaling implications (e.g., Docker/K8s usage)."
#     ),
#     "software_architect": (
#         "Role: Software Architect. Task: Technical Specification Sheet.\n"
#         "Extract: 1. Frontend 2. Backend 3. AI Pipeline 4. Storage/Vector DB (e.g., FAISS).\n"
#         "Constraint: Use 1 bullet point per category. No full sentences. Mention deployment logic."
#     ),
#     "devops_engineer": (
#         "Role: DevOps Engineer. Task: Infrastructure & Security Blueprint.\n"
#         "Focus: CI/CD, Containerization (Docker), Security Protocols, and Cloud/Local requirements.\n"
#         "Format: Infrastructure-as-code style summary."
#     ),
#     "data_scientist": (
#         "Role: Data Scientist. Task: Model & Data Methodology.\n"
#         "Focus: Data requirements, model performance (BERT/Llama), and NLP/ML pipelines.\n"
#         "Format: Technical methodology summary with metric highlights."
#     ),
#     "qa_lead": (
#         "Role: QA Lead. Task: Risk & Edge-Case Identification.\n"
#         "Focus: Potential bugs, testing requirements, and 'Bug-Fixing' metrics.\n"
#         "Output: A prioritized list of 3 high-risk testing areas."
#     ),

#     # --- ⚖️ LEGAL & COMPLIANCE (Focus: Risk & Rules) ---
#     "legal_counsel": (
#         "Role: Senior Legal Counsel. Task: Liability & Obligation Review.\n"
#         "Focus: Legal obligations, liability risks, and 'shall/must' clauses.\n"
#         "Output: 3 critical warnings regarding compliance and risk."
#     ),
#     "compliance_officer": (
#         "Role: Compliance Officer. Task: Regulatory Gap Analysis.\n"
#         "Focus: GDPR, ISO, and safety violations. Format: A 'Compliance Checklist' (Pass/Fail/Action)."
#     ),
#     "security_auditor": (
#         "Role: Security Auditor. Task: Vulnerability & Encryption Audit.\n"
#         "Focus: Data privacy, encryption standards, and access patterns. Flag any unusual risks."
#     ),

#     # --- 🎓 ACADEMIC & RESEARCH (Focus: Methodology & Facts) ---
#     "academic_researcher": (
#         "Role: Academic Researcher. Task: Abstract & Methodology Extraction.\n"
#         "Focus: Hypothesis, methodology, key findings, and citations. Tone: Formal and objective."
#     ),
#     "technical_writer": (
#         "Role: Technical Writer. Task: Documentation Outlining.\n"
#         "Format: Structured 'How-To' guide with Clear Headings and Markdown formatting."
#     ),
#     "student_tutor": (
#         "Role: Tutor. Task: Simplified Conceptual Breakdown.\n"
#         "Rule: Explain as if to a 10-year-old. Use 1 vivid analogy. Zero jargon."
#     ),

#     # --- 📰 COMMUNICATION & SPECIALIZED ---
#     "investigative_journalist": (
#         "Role: Investigative Journalist. Task: Critical Expose Summary.\n"
#         "Focus: Contradictions, hidden risks, or unspoken downsides. Write a catchy headline and 3 points."
#     ),
#     "hr_specialist": (
#         "Role: HR Director. Task: Talent & Culture Analysis.\n"
#         "Focus: Team roles, culture fit, and workload insights. Identify task ownership."
#     ),
#     "customer_success": (
#         "Role: Customer Success Lead. Task: Pain-Point & Solution Mapping.\n"
#         "Focus: Customer problems and specific solutions. List 3 'Frequently Asked Questions'."
#     ),
#     "general_audience": (
#         "Role: Generalist. Task: Clear Narrative Summary.\n"
#         "Format: 1 cohesive paragraph. Tone: Accessible and engaging. Retain the core message."
#     ),
#     "website_developer": (
#         "Role: Website Developer. Task: Full-Stack Tech Stack Extraction.\n"
#         "Extract: Frontend (React/Tailwind), Backend (FastAPI/Node), Database (SQL/NoSQL/Vector), and AI/ML tools.\n"
#         "Constraint: No repetitions. Focus on integration feasibility."
#     ),

#         }
#         system_prompt = persona_system_map.get(persona, persona_system_map["executive"]) + " Use clear section headings."
#         user_query = (
#             f"Create one {persona} Super-Summary across all provided documents. "
#             "Include: 1) shared themes, 2) key differences, 3) risks or gaps, "
#             "4) recommended next actions.\n\n"
#             f"DOCUMENT SUMMARIES:\n{combined_text}"
#         )
#         super_summary = await engine.agenerate(user_query, system_prompt, temperature=0.1)
#         return {"summary": super_summary}
#     except Exception as exc:
#         return {
#             "summary": f"Aggregation failed: {exc}",
#             "errors": [str(exc)],
#         }
#     finally:
#         db.close()

# # 3. Build the Workflow Structure
# workflow = StateGraph(GraphState)

# # 4. Register Nodes
# workflow.add_node("aggregate_documents", node_aggregate_documents)
# workflow.add_node("parser", node_extract_layout)      # Text/Layout extraction
# workflow.add_node("classifier", node_classify)        # Multi-point DNA classification
# workflow.add_node("indexer", node_index_vectors)      # Member 4: Vector Storage
# workflow.add_node("generator", node_summarize)        # Category-aware summary generation
# workflow.add_node("auditor", node_audit)              # Reflection validator
# workflow.add_node("finalize", node_finalize)          # Finalizes 'summary' key

# # 5. Define Edges (The Linear Flow + Combined Route)
# workflow.add_conditional_edges(
#     START,
#     route_from_start,
#     {
#         "aggregate_documents": "aggregate_documents",
#         "parser": "parser",
#     },
# )
# workflow.add_edge("aggregate_documents", END)
# workflow.add_edge("parser", "classifier")
# workflow.add_edge("classifier", "indexer")
# workflow.add_edge("indexer", "generator")
# workflow.add_edge("generator", "auditor")
# workflow.add_conditional_edges(
#     "auditor",
#     route_from_auditor,
#     {
#         "generator": "generator",
#         "finalize": "finalize",
#     },
# )

# # Ensure finalize leads to END
# workflow.add_edge("finalize", END)

# # 7. Compile the Application
# app = workflow.compile(checkpointer=checkpointer)


# # 8. Execution Wrapper
# def run_analysis(pdf_path: str, persona: str = "technical_architect", query: str = "Summarize"):
#     # Using a unique thread_id per session to maintain history in the DB
#     config = {"configurable": {"thread_id": f"session_{pdf_path.split('/')[-1]}"}}
    
#     inputs = {
#         "file_path": pdf_path, 
#         "persona": persona,
#         "query": query,
#         "reflection_count": 0,
#         "is_accurate": False,
#         "doc_category": "OTHER",
#         "document_dna": "",
#         "summary": "",
#         "draft": "",
#         "critique": "",
#         "errors": [],
#     }

#     return asyncio.run(app.ainvoke(inputs, config))

# # Optional: Draw the map
# try:
#     app.get_graph().draw_mermaid_png(output_file_path="graph_structure.png")
#     print("Graph structure saved as graph_structure.png")
# except Exception as e:
#     print(f"Could not draw graph: {e}")









# from langgraph.graph import StateGraph, START, END
# from langgraph.checkpoint.memory import MemorySaver
# from sqlalchemy import asc
# import asyncio

# from app.ai.state import GraphState
# from app.ai.nodes import (
#     node_extract_layout, 
#     node_classify,      # DNA Classifier
#     node_index_vectors, 
#     node_summarize,     # Renamed from generator for clarity
#     node_audit,         # The 'Brain' validator [cite: 76]
#     node_finalize
# )
# from app.ai.llm import engine
# from app.db.session import SessionLocal
# from app.models.document_model import Document

# checkpointer = MemorySaver()

# # --- 🧠 ROUTING LOGIC (The Brain) ---

# def route_from_start(state: GraphState) -> str:
#     """Choose the graph entrypoint based on request mode."""
#     if state.get("is_combined", False):
#         return "aggregate_documents"
#     return "parser"

# def route_from_auditor(state: GraphState) -> str:
#     """
#     Self-Healing Loop: Retry if audit fails and budget remains.
#     Accuracy Target: 94%+
#     """
#     is_accurate = bool(state.get("is_accurate", False))
#     reflection_count = int(state.get("reflection_count", 0))
    
#     # If inaccurate, loop back to the summarizer (max 2 retries)
#     if (not is_accurate) and reflection_count < 2:
#         print(f"--- ⚠️ AUDIT FAILED: RETRYING ({reflection_count}/2) ---")
#         return "summarizer"
    
#     print("--- ✅ AUDIT PASSED OR LIMIT REACHED ---")
#     return "finalize"

# # --- 📂 AGGREGATION LOGIC ---

# async def node_aggregate_documents(state: GraphState):
#     """Build a super-summary from existing per-doc summaries."""
#     document_ids = state.get("document_ids", [])
#     persona = (state.get("persona") or "executive").lower()
    
#     if not document_ids:
#         return {"summary": "No documents provided.", "errors": ["document_ids empty"]}

#     db = SessionLocal()
#     try:
#         docs = db.query(Document).filter(Document.id.in_(document_ids)).order_by(asc(Document.id)).all()
#         summary_blocks = []
#         for doc in docs:
#             if doc.content_summary:
#                 # Use source tagging to prevent context leakage
#                 summary_blocks.append(f"<doc name='{doc.filename}'>\n{doc.content_summary.strip()}\n</doc>")

#         if not summary_blocks:
#             return {"summary": "No summaries found.", "errors": ["No content_summary data"]}

#         combined_text = "\n\n---\n\n".join(summary_blocks)
#         engine.initialize(model_name="qwen2.5:1.5b") # 8GB RAM Safety

#         # Use the Persona Map provided by the user
#         from app.ai.persona import PERSONAS # Importing from separate persona file
#         system_prompt = PERSONAS.get(persona, PERSONAS["general_audience"]) + " Use clear section headings."
        
#         user_query = (
#             f"Create one {persona} Super-Summary. "
#             "Include: 1) shared themes, 2) key differences, 3) risks or gaps, 4) next actions.\n\n"
#             f"SUMMARIES:\n{combined_text}"
#         )
#         super_summary = await engine.agenerate(user_query, system_prompt, temperature=0.1)
#         return {"summary": super_summary}
#     except Exception as exc:
#         return {"summary": f"Aggregation failed: {exc}", "errors": [str(exc)]}
#     finally:
#         db.close()

# # --- 🚀 GRAPH BUILDING ---

# workflow = StateGraph(GraphState)

# # 1. Register Nodes (The 'Eyes', 'Focus', and 'Brain')
# workflow.add_node("aggregate_documents", node_aggregate_documents)
# workflow.add_node("parser", node_extract_layout)
# workflow.add_node("classifier", node_classify)  # DNA Classifier Node
# workflow.add_node("indexer", node_index_vectors)
# workflow.add_node("summarizer", node_summarize) # Category-aware generation
# workflow.add_node("auditor", node_audit)         # Accuracy Validator [cite: 76]
# workflow.add_node("finalize", node_finalize)

# # 2. Define Edges & Conditional Routing
# workflow.add_conditional_edges(
#     START,
#     route_from_start,
#     {
#         "aggregate_documents": "aggregate_documents",
#         "parser": "parser",
#     },
# )

# workflow.add_edge("aggregate_documents", END)
# workflow.add_edge("parser", "classifier")   # 4-Point DNA Sampling Step
# workflow.add_edge("classifier", "indexer")
# workflow.add_edge("indexer", "summarizer")
# workflow.add_edge("summarizer", "auditor")

# # The Self-Correction Loop edge
# workflow.add_conditional_edges(
#     "auditor",
#     route_from_auditor,
#     {
#         "summarizer": "summarizer", # Loop back for fix
#         "finalize": "finalize",     # Exit to final polish
#     },
# )

# workflow.add_edge("finalize", END)

# app = workflow.compile(checkpointer=checkpointer)

# # 3. Execution Wrapper
# def run_analysis(pdf_path: str, persona: str = "executive", query: str = "Summarize"):
#     config = {"configurable": {"thread_id": f"session_{pdf_path.split('/')[-1]}"}}
#     inputs = {
#         "file_path": pdf_path, 
#         "persona": persona,
#         "query": query,
#         "reflection_count": 0,
#         "is_accurate": False,
#         "doc_category": "OTHER",
#         "dna_samples": "",
#         "summary": "",
#         "draft": "",
#         "critique": "",
#         "errors": [],
#     }
#     return asyncio.run(app.ainvoke(inputs, config))






from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver
import asyncio

from app.ai.state import GraphState
from app.ai.nodes import (
    node_extract_layout, 
    node_classify,      # DNA Classifier
    node_index_vectors, 
    node_summarize,     
    node_audit,         # The 'Brain' validator [cite: 76]
    node_finalize
)
checkpointer = MemorySaver()

# --- 🧠 ROUTING LOGIC (The Brain) ---

def route_from_start(state: GraphState) -> str:
    """Always enter the single-document summary flow."""
    return "parser"

def route_from_auditor(state: GraphState) -> str:
    """
    Self-Healing Loop: Retry if audit fails and budget remains.
    Accuracy Target: 94%+
    """
    is_accurate = bool(state.get("is_accurate", False))
    reflection_count = int(state.get("reflection_count", 0))
    
    # If inaccurate, loop back to the summarizer (max 2 retries after first draft)
    if (not is_accurate) and reflection_count < 3:
        print(f"--- ⚠️ AUDIT FAILED: RETRYING ({reflection_count}/2) ---")
        return "summarizer"
    
    print("--- ✅ AUDIT PASSED OR LIMIT REACHED ---")
    return "finalize"

# --- 🚀 GRAPH BUILDING ---

workflow = StateGraph(GraphState)

workflow.add_node("parser", node_extract_layout)
workflow.add_node("classifier", node_classify)
workflow.add_node("indexer", node_index_vectors)
workflow.add_node("summarizer", node_summarize)
workflow.add_node("auditor", node_audit)
workflow.add_node("finalize", node_finalize)

workflow.add_conditional_edges(
    START,
    route_from_start,
    {"parser": "parser"},
)

workflow.add_edge("parser", "classifier")
workflow.add_edge("classifier", "indexer")
workflow.add_edge("indexer", "summarizer")
workflow.add_edge("summarizer", "auditor")

workflow.add_conditional_edges(
    "auditor",
    route_from_auditor,
    {
        "summarizer": "summarizer", 
        "finalize": "finalize",
    },
)

workflow.add_edge("finalize", END)

app = workflow.compile(checkpointer=checkpointer)

# --- ⚙️ EXECUTION WRAPPER ---
def run_analysis(pdf_path: str, persona: str = "executive", query: str = "Summarize"):
    config = {"configurable": {"thread_id": f"session_{pdf_path.split('/')[-1]}"}}
    inputs = {
        "file_path": pdf_path, 
        "persona": persona,
        "query": query,
        "reflection_count": 0,
        "is_accurate": False,
        "doc_category": "OTHER",
        "dna_samples": "",
        "summary": "",
        "draft": "",
        "critique": "",
        "errors": [],
    }
    return asyncio.run(app.ainvoke(inputs, config))