# from typing import TypedDict, List, Optional
# from pydantic import BaseModel

# class GraphState(TypedDict):
#     file_path: str
#     persona: str
#     raw_text: str
#     layout_type: str  # 'digital' or 'scanned'
#     summary: str
#     vector_status: str
#     error: Optional[str]




from typing import TypedDict, List, Optional, Annotated
import operator

class GraphState(TypedDict):
    # --- Your Original PDF Metadata ---
    file_path: str
    persona: str
    raw_text: str
    layout_type: str  # 'digital' or 'scanned'
    vector_status: str
    
    # --- Reflector & Feedback Loop Fields ---
    query: str                       # The user's question about the PDF
    draft: str                       # The current generated answer
    critique: str                    # Feedback from the Reflector node
    reflection_count: int            # Counter to prevent infinite loops
    
    # --- Accuracy & Error Handling ---
    # Using Annotated with operator.add allows nodes to append to this list
    # instead of overwriting it, perfect for "Automatic Feedback Logs"
    errors: Annotated[List[str], operator.add] 
    
    # --- Final Output ---
    summary: str                     # The polished, verified final response