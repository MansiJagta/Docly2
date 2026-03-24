
print("Importing modules...")
try:
    import sqlite3
    import struct
    import sqlite_vec
    from sentence_transformers import SentenceTransformer
    print("Imports successful.")
except ImportError as e:
    print(f"Import failed: {e}")
    exit(1)

print("Loading SentenceTransformer...")
model = SentenceTransformer('all-MiniLM-L6-v2')
print("Model loaded.")

def serialize_f32(vector):
    return struct.pack(f"{len(vector)}f", *vector)

def get_db_connection(db_path="test_vectors.db"):
    print(f"Connecting to {db_path}...")
    conn = sqlite3.connect(db_path)
    conn.enable_load_extension(True)
    try:
        sqlite_vec.load(conn)
        print("sqlite_vec loaded successfully.")
    except Exception as e:
        print(f"Failed to load sqlite_vec: {e}")
        conn.close()
        raise
    conn.enable_load_extension(False)
    return conn

print("Testing vector operations...")
try:
    text = "Hello world"
    vector = model.encode([text])[0]
    print(f"Encoded '{text}' into vector of size {len(vector)}")
    
    serialized = serialize_f32(vector)
    
    conn = get_db_connection()
    conn.execute("CREATE VIRTUAL TABLE IF NOT EXISTS vec_test USING vec0(embedding float[384])")
    print("Table created.")
    
    cur = conn.cursor()
    cur.execute("INSERT INTO vec_test (rowid, embedding) VALUES (?, ?)", [1, serialized])
    conn.commit()
    print("Vector inserted.")
    
    print("Querying vector...")
    rows = conn.execute("SELECT rowid, distance(embedding, ?) FROM vec_test", [serialized]).fetchall()
    print(f"Query result: {rows}")
    
    conn.close()
    print("SUCCESS: Embeddings and Vector DB working.")
    
except Exception as e:
    print(f"FAILURE: {e}")
    import traceback
    traceback.print_exc()
