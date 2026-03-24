from typing import Annotated, List, TypedDict, Optional
import operator

class QAState(TypedDict):
    question: str
    file_id: str                  # To find vectors in sqlite-vec
    retrieved_context: str        # Chunks from the PDF
    answer: str                   # The current generated answer
    critique: str                 # Feedback from Reflector
    reflection_count: int         # Loop counter
    # Annotated list to store the chat history in the checkpoint
    history: Annotated[List[dict], operator.add]