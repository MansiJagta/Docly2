# import sqlite3
# from langgraph.graph import StateGraph, START, END
# from langgraph.checkpoint.sqlite import SqliteSaver
# from state_qa import QAState
# from nodes_qa import node_retrieve, node_answer, node_reflect_qa
# #engine = LLMEngine(model_path="assets/llama-3.2-3B-Instruct-QA-Q4_K_M.gguf")

# # 1. Setup Local Persistence (Memory)
# conn = sqlite3.connect("qa_checkpoints.db", check_same_thread=False)
# memory = SqliteSaver(conn)

# # 2. Conditional Routing (If-Else)
# # def decide_to_finish(state: QAState):
# #     if "no_errors" in state["critique"].lower() or state["reflection_count"] >= 1:
# #         return "end"
# #     return "refine"


# def should_continue(state: QAState):
#     print(f"--- ROUTER: CHECKING ITERATION {state.get('reflection_count', 0)} ---")
    
#     # FAST-TRACK: If the answer is already long and detailed, finish immediately to save time
#     if len(state.get("answer", "")) > 200:
#         print("⚡ Fast-tracking: Detailed answer received.")
#         return "end"
    
#     # SAFETY: Stop after 1 loop (Iteration 1) to prevent long wait times
#     if state.get("reflection_count", 0) >= 1:
#         print("⏹️ Stopping: Maximum iterations reached.")
#         return "end"

#     # CRITIQUE CHECK: Only refine if the critic explicitly asked for a rewrite
#     critique = state.get("critique", "").lower()
#     if "rewrite" in critique:
#         print("🔄 Refinement required by Auditor.")
#         return "refine"
        
#     return "end"

# # 3. Build Graph
# workflow = StateGraph(QAState)

# workflow.add_node("retrieve", node_retrieve)
# workflow.add_node("answer", node_answer)
# workflow.add_node("reflect", node_reflect_qa)

# workflow.set_entry_point("retrieve")
# workflow.add_edge("retrieve", "answer")
# workflow.add_edge("answer", "reflect")
# workflow.add_edge("reflect", END)


# # # Feedback Loop with If-Else logic
# # workflow.add_conditional_edges(
# #     "reflect",
# #     decide_to_finish,
# #     {"end": END, "refine": "answer"}
# # )

# app_qa = workflow.compile(checkpointer=memory)







import sqlite3
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.sqlite import SqliteSaver
from state_qa import QAState
from nodes_qa import node_retrieve, node_answer, node_reflect_qa

# 1. Setup Local Persistence (Memory)
conn = sqlite3.connect("qa_checkpoints.db", check_same_thread=False)
memory = SqliteSaver(conn)

# 2. Optimized Conditional Routing (Fast-Track Logic)
def should_continue(state: QAState):
    print(f"--- ROUTER: CHECKING ITERATION {state.get('reflection_count', 0)} ---")
    
    # FAST-TRACK: If the answer is already long and detailed, finish immediately to save time
    if len(state.get("answer", "")) > 200:
        print("⚡ Fast-tracking: Detailed answer received.")
        return "end"
    
    # SAFETY: Stop after 1 loop (Iteration 1) to prevent long wait times
    if state.get("reflection_count", 0) >= 1:
        print("⏹️ Stopping: Maximum iterations reached.")
        return "end"

    # CRITIQUE CHECK: Only refine if the critic explicitly asked for a rewrite
    critique = state.get("critique", "").lower()
    if "rewrite" in critique:
        print("🔄 Refinement required by Auditor.")
        return "refine"
        
    return "end"

# 3. Build Graph
workflow = StateGraph(QAState)

# Add Nodes
workflow.add_node("retrieve", node_retrieve)
workflow.add_node("answer", node_answer)
workflow.add_node("reflect", node_reflect_qa)

# Set Entry Point
workflow.set_entry_point("retrieve")

# Standard Transitions
workflow.add_edge("retrieve", "answer")
workflow.add_edge("answer", "reflect")

# 4. FIXED: Feedback Loop with the new optimized logic
workflow.add_conditional_edges(
    "reflect",           # After the reflection node
    should_continue,     # Use the fast-track function
    {
        "end": END,      # If it returns "end", stop
        "refine": "answer" # If it returns "refine", go back to the answer node
    }
)

app_qa = workflow.compile(checkpointer=memory)