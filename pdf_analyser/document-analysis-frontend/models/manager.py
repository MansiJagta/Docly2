# import sqlite3
# from langgraph.graph import StateGraph, START, END
# from langgraph.checkpoint.sqlite import SqliteSaver
# from state import GraphState
# from nodes import node_extract_layout, node_summarize, node_index_vectors

# # 1. Setup Persistence (Checkpoints)
# # This saves your progress in a local file called 'checkpoints.db'
# conn = sqlite3.connect("checkpoints.db", check_same_thread=False)
# checkpointer = SqliteSaver(conn)

# # 2. Build the Workflow
# workflow = StateGraph(GraphState)

# # 3. Add Nodes
# workflow.add_node("parser", node_extract_layout)
# workflow.add_node("indexer", node_index_vectors)
# workflow.add_node("summarizer", node_summarize)

# # 4. Define Edges (The Flow)
# workflow.add_edge(START, "parser")
# workflow.add_edge("parser", "indexer")
# workflow.add_edge("indexer", "summarizer")
# workflow.add_edge("summarizer", END)

# # 5. Compile the Graph
# app = workflow.compile(checkpointer=checkpointer)

# def run_analysis(pdf_path: str, persona: str = "executive"):
#     config = {"configurable": {"thread_id": "session_1"}}
#     inputs = {"file_path": pdf_path, "persona": persona}
#     return app.invoke(inputs, config)


# try:
#     # Generates a PNG of your workflow logic
#     app.get_graph().draw_mermaid_png(output_file_path="workflow_map.png")
#     print("🎨 Workflow map saved as workflow_map.png")
# except Exception:
#     # Fallback if dependencies aren't installed
#     print(app.get_graph().draw_ascii())








# import sqlite3
# from langgraph.graph import StateGraph, START, END
# from langgraph.checkpoint.sqlite import SqliteSaver

# # Import your updated state and nodes
# from state import GraphState
# from nodes import (
#     node_extract_layout, 
#     node_index_vectors, 
#     node_generate_draft, 
#     node_reflect_critic, 
#     node_refine_answer, 
#     node_finalize
# )

# # 1. Setup Persistence (Checkpoints)
# # This allows the "Automatic Feedback Loop" to resume if interrupted
# conn = sqlite3.connect("checkpoints.db", check_same_thread=False)
# checkpointer = SqliteSaver(conn)

# # 2. Define the Routing Logic (If-Else)
# # def should_continue(state: GraphState):
# #     """
# #     The decision engine: Checks if the Reflector is satisfied 
# #     or if we've reached the maximum retry limit.
# #     """
# #     print(f"--- ROUTER: CHECKING ITERATION {state.get('reflection_count', 0)} ---")
    
# #     # Condition 1: If the Critic says "NO_ERRORS_FOUND", we finish.
# #     if "no_errors_found" in state.get("critique", "").lower():
# #         print("--- ROUTER: ACCURACY VERIFIED (EXITING LOOP) ---")
# #         return "finalize"
    
# #     # Condition 2: Safety break to prevent infinite loops (Set to 3 attempts)
# #     if state.get("reflection_count", 0) >= 3:
# #         print("--- ROUTER: MAX RETRIES REACHED (EXITING LOOP) ---")
# #         return "finalize"
    
# #     # Otherwise: Re-enter the loop to fix errors
# #     print("--- ROUTER: ERRORS DETECTED (RE-REFINING) ---")
# #     return "refine"

# def should_continue(state: GraphState):
#     """
#     The decision engine: Checks if the Reflector is satisfied 
#     or if we've reached the maximum retry limit.
#     """
#     # Get values with fallbacks to avoid KeyErrors
#     count = state.get("reflection_count", 0)
#     critique = state.get("critique", "").lower()
    
#     print(f"--- ROUTER: CHECKING ITERATION {count} ---")

#     # 1. More flexible exit keywords (Small models often add extra words)
#     exit_phrases = ["no_errors_found", "no errors", "is correct", "accurate", "perfect"]
    
#     if any(phrase in critique for phrase in exit_phrases):
#         print("--- ROUTER: ACCURACY VERIFIED (EXITING LOOP) ---")
#         return "finalize"
    
#     # 2. Safety break: If we have looped 3 times, we MUST stop to save CPU/RAM
#     if count >= 3:
#         print("--- ROUTER: MAX RETRIES REACHED (EXITING LOOP) ---")
#         return "finalize"
    
#     # 3. Otherwise: Re-enter the loop
#     print(f"--- ROUTER: ERRORS DETECTED IN ITERATION {count} (RE-REFINING) ---")
#     return "refine"


# # 3. Build the Workflow
# workflow = StateGraph(GraphState)

# # 4. Add Nodes
# workflow.add_node("parser", node_extract_layout)
# workflow.add_node("indexer", node_index_vectors)
# workflow.add_node("generator", node_generate_draft)
# workflow.add_node("reflector", node_reflect_critic)
# workflow.add_node("refiner", node_refine_answer)
# workflow.add_node("finalize", node_finalize)

# # 5. Define Edges (The Logic Flow)
# workflow.add_edge(START, "parser")
# workflow.add_edge("parser", "indexer")
# workflow.add_edge("indexer", "generator")
# workflow.add_edge("generator", "reflector")

# # --- THE FEEDBACK LOOP (Automatic Logic) ---
# workflow.add_conditional_edges(
#     "reflector",         # Start point for the decision
#     should_continue,     # The function that decides where to go
#     {
#         "refine": "refiner",   # If should_continue returns "refine"
#         "finalize": "finalize" # If should_continue returns "finalize"
#     }
# )

# # After refining, go back to the reflector to check if the fix worked
# workflow.add_edge("refiner", "reflector")

# # Final destination
# workflow.add_edge("finalize", END)

# # 6. Compile the Graph
# app = workflow.compile(checkpointer=checkpointer)

# # 7. Helper Function to Execute
# def run_analysis(pdf_path: str, persona: str = "executive", query: str = "Summarize this PDF"):
#     # Thread ID allows the checkpointer to save state for this specific file
#     config = {"configurable": {"thread_id": "pdf_session_1"}}
    
#     inputs = {
#         "file_path": pdf_path, 
#         "persona": persona,
#         "query": query,
#         "reflection_count": 0
#     }
    
#     return app.invoke(inputs, config)

# # --- Visualization ---
# try:
#     app.get_graph().draw_mermaid_png(output_file_path="workflow_map.png")
#     print("🎨 High-Accuracy Workflow map saved as workflow_map.png")
# except Exception:
#     print(app.get_graph().draw_ascii())








# import sqlite3
# from langgraph.graph import StateGraph, START, END
# from langgraph.checkpoint.sqlite import SqliteSaver

# # Import your state definition and specialized nodes
# from state import GraphState
# from nodes import (
#     node_extract_layout, 
#     node_index_vectors, 
#     node_generate_draft, 
#     node_reflect_critic, 
#     node_refine_answer, 
#     node_finalize
# )

# # 1. Setup Persistence (Checkpoints)
# # This allows the "Automatic Feedback Loop" to resume or be audited later
# conn = sqlite3.connect("checkpoints.db", check_same_thread=False)
# checkpointer = SqliteSaver(conn)

# # 2. Define the Routing Logic (If-Else)
# def should_continue(state: GraphState):
#     """
#     The decision engine: Determines if the draft is accurate enough
#     or if the system should attempt a refinement.
#     """
#     count = state.get("reflection_count", 0)
#     critique = state.get("critique", "").lower()
    
#     print(f"\n--- ROUTER: EVALUATING ITERATION {count} ---")

#     # 1. Flexible exit keywords for the Reflector's verdict
#     # This helps catch the "Finalize" intent even if the LLM is wordy
#     exit_phrases = ["no_errors_found", "no errors", "is correct", "accurate", "verified"]
    
#     if any(phrase in critique for phrase in exit_phrases):
#         print("--- ROUTER: VERDICT [ACCURATE] -> PROCEEDING TO FINALIZE ---")
#         return "finalize"
    
#     # 2. Safety break: Max 3 loops to prevent infinite CPU usage
#     if count >= 3:
#         print("--- ROUTER: VERDICT [MAX_LIMIT] -> FORCING FINALIZE ---")
#         return "finalize"
    
#     # 3. Otherwise: Re-enter the loop to fix errors
#     print(f"--- ROUTER: VERDICT [RE-REFINE] -> ATTEMPTING FIX {count + 1} ---")
#     return "refine"

# # 3. Build the Workflow Structure
# workflow = StateGraph(GraphState)

# # 4. Register Nodes
# # Each node corresponds to a specific member of your 5-person AI team logic
# workflow.add_node("parser", node_extract_layout)      # Text/Layout extraction
# workflow.add_node("indexer", node_index_vectors)      # Member 4: Vector Storage
# workflow.add_node("generator", node_generate_draft)   # Draft Creation
# workflow.add_node("reflector", node_reflect_critic)   # The "Critic" auditor
# workflow.add_node("refiner", node_refine_answer)      # The "Editor" refiner
# workflow.add_node("finalize", node_finalize)          # Finalizes 'summary' key

# # 5. Define Edges (The Flow of Data)
# workflow.add_edge(START, "parser")
# workflow.add_edge("parser", "indexer")
# workflow.add_edge("indexer", "generator")
# #workflow.add_edge("generator", "reflector")
# workflow.add_edge("generator","finalize")


# # 6. The Feedback Loop (The "Sub-graph" Pattern)
# # This is where the if-else looping happens
# # workflow.add_conditional_edges(
# #     "reflector", 
# #     should_continue, 
# #     {
# #         "refine": "refiner",   
# #         "finalize": "finalize" 
# #     }
# # )

# # # Loop back from refiner to reflector for another audit
# # workflow.add_edge("refiner", "reflector")

# # Ensure finalize actually moves data to END
# workflow.add_edge("finalize", END)

# # 7. Compile the Application
# # The checkpointer is critical for the "Correction History" in your test script
# app = workflow.compile(checkpointer=checkpointer)

# # 8. Execution Wrapper for External Calls (FastAPI)
# def run_analysis(pdf_path: str, persona: str = "technical_architect", query: str = "Summarize"):
#     config = {"configurable": {"thread_id": "current_session"}}
    
#     inputs = {
#         "file_path": pdf_path, 
#         "persona": persona,
#         "query": query,
#         "reflection_count": 0,
#         "summary": "",
#         "draft": ""
#     }
    
#     return app.invoke(inputs, config)

# # Optional: Draw the map to verify structure
# try:
#     app.get_graph().draw_mermaid_png(output_file_path="graph_structure.png")
# except Exception:
#     pass










import sqlite3
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.sqlite import SqliteSaver

# Import your state definition and specialized nodes
from state import GraphState
from nodes import (
    node_extract_layout, 
    node_index_vectors, 
    node_generate_draft, 
    node_reflect_critic, 
    node_refine_answer, 
    node_finalize
)

# 1. Setup Persistence (Checkpoints)
conn = sqlite3.connect("checkpoints.db", check_same_thread=False)
checkpointer = SqliteSaver(conn)

# 2. Define the Routing Logic (If-Else)
def should_continue(state: GraphState):
    """
    The decision engine: Determines if the draft is accurate enough
    or if the system should attempt a refinement.
    """
    count = state.get("reflection_count", 0)
    # Using .get() ensures it doesn't crash if the key is missing
    critique = str(state.get("critique", "")).lower()
    
    print(f"\n--- ROUTER: EVALUATING ITERATION {count} ---")

    # 1. Flexible exit keywords for the Reflector's verdict
    exit_phrases = ["no_errors_found", "no errors", "is correct", "accurate", "verified"]
    
    if any(phrase in critique for phrase in exit_phrases):
        print("--- ROUTER: VERDICT [ACCURATE] -> PROCEEDING TO FINALIZE ---")
        return "finalize"
    
    if len(critique) < 25:
        print(f"--- ROUTER: VERDICT [CRITIQUE TOO VAGUE] -> SKIPPING REFINEMENT TO PROTECT ACCURACY ---")
        return "finalize"
    
    # 2. Safety break: Max 3 loops to prevent infinite CPU usage/loops
    if count >= 3:
        print("--- ROUTER: VERDICT [MAX_LIMIT] -> FORCING FINALIZE ---")
        return "finalize"
    
    # 3. Otherwise: Re-enter the loop to fix errors
    print(f"--- ROUTER: VERDICT [RE-REFINE] -> ATTEMPTING FIX {count} ---")
    return "refine"

# 3. Build the Workflow Structure
workflow = StateGraph(GraphState)

# 4. Register Nodes
workflow.add_node("parser", node_extract_layout)      # Text/Layout extraction
workflow.add_node("indexer", node_index_vectors)      # Member 4: Vector Storage
workflow.add_node("generator", node_generate_draft)   # Draft Creation
workflow.add_node("reflector", node_reflect_critic)   # The "Critic" auditor
workflow.add_node("refiner", node_refine_answer)      # The "Editor" refiner
workflow.add_node("finalize", node_finalize)          # Finalizes 'summary' key

# 5. Define Edges (The Flow of Data)
workflow.add_edge(START, "parser")
workflow.add_edge("parser", "indexer")
workflow.add_edge("indexer", "generator")

# UPDATED: Move from generator to reflector for initial audit
workflow.add_edge("generator", "reflector")

# 6. The Feedback Loop (RESTORED)
workflow.add_conditional_edges(
    "reflector", 
    should_continue, 
    {
        "refine": "refiner",   
        "finalize": "finalize" 
    }
)

# Loop back from refiner to reflector for another audit
workflow.add_edge("refiner", "reflector")

# Ensure finalize leads to END
workflow.add_edge("finalize", END)

# 7. Compile the Application
app = workflow.compile(checkpointer=checkpointer)

# 8. Execution Wrapper
def run_analysis(pdf_path: str, persona: str = "technical_architect", query: str = "Summarize"):
    # Using a unique thread_id per session to maintain history in the DB
    config = {"configurable": {"thread_id": f"session_{pdf_path.split('/')[-1]}"}}
    
    inputs = {
        "file_path": pdf_path, 
        "persona": persona,
        "query": query,
        "reflection_count": 0,
        "summary": "",
        "draft": "",
        "critique": ""
    }
    
    return app.invoke(inputs, config)

# Optional: Draw the map
try:
    app.get_graph().draw_mermaid_png(output_file_path="graph_structure.png")
    print("Graph structure saved as graph_structure.png")
except Exception as e:
    print(f"Could not draw graph: {e}")