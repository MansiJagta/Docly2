import sqlite3
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.sqlite import SqliteSaver
from app.ai.state_qa import QAState
from app.ai.nodes_qa import node_retrieve, node_answer, node_reflect_qa
from app.ai.llm import engine
# 1. Setup Local Persistence (Memory)
conn = sqlite3.connect("qa_checkpoints.db", check_same_thread=False)
memory = SqliteSaver(conn)

# 2. Conditional Routing (If-Else)
def decide_to_finish(state: QAState):
    if "no_errors" in state["critique"].lower() or state["reflection_count"] >= 3:
        return "end"
    return "refine"

# 3. Build Graph
workflow = StateGraph(QAState)

workflow.add_node("retrieve", node_retrieve)
workflow.add_node("answer", node_answer)
workflow.add_node("reflect", node_reflect_qa)

workflow.set_entry_point("retrieve")
workflow.add_edge("retrieve", "answer")
workflow.add_edge("answer", "reflect")

# Feedback Loop with If-Else logic
workflow.add_conditional_edges(
    "reflect",
    decide_to_finish,
    {"end": END, "refine": "answer"}
)

app_qa = workflow.compile(checkpointer=memory)