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
import sqlite_vec
from sentence_transformers import SentenceTransformer
from langchain.tools import tool

# Initialize model globally to avoid reloading in every tool call
# all-MiniLM-L6-v2 produces 384-dimensional vectors
model = SentenceTransformer('all-MiniLM-L6-v2')

def serialize_f32(vector):
    """Serializes a list of floats into a compact raw bytes format for sqlite-vec."""
    return struct.pack(f"{len(vector)}f", *vector)

def get_db_connection(db_path="document_vectors.db"):
    """Creates a connection and loads the sqlite-vec extension."""
    conn = sqlite3.connect(db_path)
    conn.enable_load_extension(True)
    sqlite_vec.load(conn)
    conn.enable_load_extension(False)
    return conn

@tool("vector_indexer")
def index_vector_logic(text: str):
    """Converts text to embeddings and stores them in local SQLite-vec virtual table."""
    # Generate embedding
    embeddings = model.encode([text])[0]
    serialized_vector = serialize_f32(embeddings)
    
    conn = get_db_connection()
    try:
        # Create virtual table if it doesn't exist (384 dimensions for all-MiniLM-L6-v2)
        conn.execute("CREATE VIRTUAL TABLE IF NOT EXISTS vec_index USING vec0(embedding float[384])")
        conn.execute("CREATE TABLE IF NOT EXISTS metadata (id INTEGER PRIMARY KEY, content TEXT)")
        
        # Insert metadata and vector
        cur = conn.cursor()
        cur.execute("INSERT INTO metadata (content) VALUES (?)", [text])
        doc_id = cur.lastrowid
        cur.execute("INSERT INTO vec_index (rowid, embedding) VALUES (?, ?)", [doc_id, serialized_vector])
        
        conn.commit()
        return f"Successfully indexed chunk {doc_id} in local vector store."
    finally:
        conn.close()

@tool("vector_retriever")
def query_vector_logic(query: str):
    """
    Member 4 Tool: Converts a user question into a vector and finds 
    the top 5 most relevant text chunks from the indexed PDF.
    """
    # 1. Generate query embedding
    query_vector = model.encode([query])[0]
    serialized_query = serialize_f32(query_vector)
    
    conn = get_db_connection()
    try:
        # 2. Perform k-Nearest Neighbor (KNN) search
        # We join with metadata to get the actual text content back
        query_sql = """
            SELECT m.content, v.distance 
            FROM vec_index v
            JOIN metadata m ON v.rowid = m.id
            WHERE v.embedding MATCH ? AND k = 5
            ORDER BY v.distance
        """
        results = conn.execute(query_sql, [serialized_query]).fetchall()
        
        # Combine results into a single context string
        context = "\n---\n".join([row[0] for row in results])
        return context if context else "No relevant context found in the document."
    finally:
        conn.close()