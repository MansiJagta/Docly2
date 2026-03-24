# # from sentence_transformers import SentenceTransformer

# # class VectorEngine:
# #     def __init__(self):
# #         # This will download ~45MB on first run, then work offline
# #         self.model = SentenceTransformer('all-MiniLM-L6-v2')

# #     def create_embeddings(self, text_chunks):
# #         return self.model.encode(text_chunks)






# import sqlite3
# from sentence_transformers import SentenceTransformer
# from langchain.tools import tool

# class VectorEngine:
#     def __init__(self):
#         # Using a tiny 80MB model for CPU efficiency
#         self.model = SentenceTransformer('all-MiniLM-L6-v2')

#     @tool("vector_indexer")
#     def index_text(self, text: str):
#         """Converts text to embeddings and stores them in local SQLite database."""
#         embeddings = self.model.encode([text])[0]
        
#         # Connect to local SQLite file
#         conn = sqlite3.connect("document_vectors.db")
#         # Logic to save blob to sqlite-vec goes here
#         conn.close()
#         return "Successfully indexed in local vector store."








# import sqlite3
# from sentence_transformers import SentenceTransformer
# from langchain.tools import tool

# # Initialize model globally to avoid reloading in every tool call
# model = SentenceTransformer('all-MiniLM-L6-v2')

# @tool("vector_indexer")
# def index_vector_logic(text: str):
#     """Converts text to embeddings and stores them in local SQLite database."""
#     embeddings = model.encode([text])[0]
    
#     # Connect to your local SQLite-vec database
#     conn = sqlite3.connect("document_vectors.db")
#     # (Your existing SQL logic to insert vectors goes here)
#     conn.close()
#     return "Successfully indexed in local vector store."







import sqlite3
import struct
import numpy as np
import pickle
from sentence_transformers import SentenceTransformer
from langchain.tools import tool

# Initialize model globally
model = SentenceTransformer('all-MiniLM-L6-v2')

def get_db_connection(db_path="document_vectors.db"):
    """Creates a standard SQLite connection."""
    conn = sqlite3.connect(db_path)
    return conn

@tool("vector_indexer")
def index_vector_logic(text: str):
    """Converts text to embeddings and stores them in local SQLite database (standard table)."""
    # Generate embedding
    embedding = model.encode([text])[0]
    # Serialize as numpy bytes
    embedding_blob = embedding.tobytes()
    
    conn = get_db_connection()
    try:
        # Standard table: id, content, embedding_blob
        conn.execute('''
            CREATE TABLE IF NOT EXISTS document_chunks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                content TEXT,
                embedding BLOB
            )
        ''')
        
        cur = conn.cursor()
        cur.execute("INSERT INTO document_chunks (content, embedding) VALUES (?, ?)", [text, embedding_blob])
        conn.commit()
        return f"Successfully indexed chunk in local store."
    finally:
        conn.close()

@tool("vector_retriever")
def query_vector_logic(query: str):
    """
    Finds top 5 relevant chunks using numpy cosine similarity.
    """
    # 1. Generate query embedding
    query_vec = model.encode([query])[0]
    
    conn = get_db_connection()
    try:
        # 2. Fetch all chunks (naive but fast for single PDF)
        cur = conn.execute("SELECT content, embedding FROM document_chunks")
        rows = cur.fetchall()
        
        if not rows:
            return "No content indexed."
            
        # 3. Compute similarities in memory
        scores = []
        for content, emb_blob in rows:
            # Load vector
            doc_vec = np.frombuffer(emb_blob, dtype=np.float32)
            
            # Cosine similarity
            norm_q = np.linalg.norm(query_vec)
            norm_d = np.linalg.norm(doc_vec)
            if norm_q == 0 or norm_d == 0:
                score = 0
            else:
                score = np.dot(query_vec, doc_vec) / (norm_q * norm_d)
            
            scores.append((score, content))
            
        # 4. Sort and return top 5
        scores.sort(key=lambda x: x[0], reverse=True)
        top_k = scores[:5]
        
        # Combine results
        context = "\n---\n".join([item[1] for item in top_k])
        return context if context else "No relevant context found."
    finally:
        conn.close()