import urllib.request
import urllib.parse
import json
import time
import mimetypes
import sys
import os

BASE_URL = "http://127.0.0.1:8007"
PDF_PATH = os.path.join(os.path.dirname(__file__), "app", "ai", "sample.pdf")

def upload_file(file_path):
    url = f"{BASE_URL}/documents/upload"
    filename = os.path.basename(file_path)
    boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW"
    
    with open(file_path, "rb") as f:
        file_content = f.read()
        
    body = (
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="files"; filename="{filename}"\r\n'
        f"Content-Type: application/pdf\r\n\r\n"
    ).encode("utf-8") + file_content + f"\r\n--{boundary}--\r\n".encode("utf-8")
    
    req = urllib.request.Request(url, data=body, method="POST")
    req.add_header("Content-Type", f"multipart/form-data; boundary={boundary}")
    
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.URLError as e:
        print(f"Upload failed: {e}")
        if hasattr(e, 'read'):
            print(e.read().decode())
        sys.exit(1)

def check_summary(doc_id):
    url = f"{BASE_URL}/documents/{doc_id}/summary"
    try:
        with urllib.request.urlopen(url) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.URLError as e:
        print(f"Check summary failed: {e}")
        sys.exit(1)

def main():
    global PDF_PATH
    if not os.path.exists(PDF_PATH):
        print(f"Error: PDF not found at {PDF_PATH}")
        # Create a dummy pdf if missing? No, relying on existing one.
        # Try to find any pdf in current dir
        found = False
        for root, dirs, files in os.walk("."):
            for f in files:
                if f.endswith(".pdf"):
                    # global PDF_PATH # Removed
                    PDF_PATH = os.path.join(root, f)
                    print(f"Found alternative PDF: {PDF_PATH}")
                    found = True
                    break
            if found: break
        if not found:
            print("No PDF found to test.")
            sys.exit(1)

    print(f"Uploading {PDF_PATH}...")
    upload_res = upload_file(PDF_PATH)
    print(f"Upload response: {upload_res}")
    
    if not upload_res.get("documents"):
        print("No documents returned in upload response.")
        sys.exit(1)
        
    doc_id = upload_res["documents"][0]["id"]
    print(f"Document ID: {doc_id}")
    
    print("Waiting for summary...")
    start_time = time.time()
    while time.time() - start_time < 60: # 60 second timeout
        res = check_summary(doc_id)
        status = res.get("status")
        print(f"Status: {status}")
        
        if status == "completed":
            print("\nSUCCESS: Summary generated!")
            print(f"Summary preview: {res.get('summary')[:100]}...")
            
            # Test Q&A
            print("\nTesting Q&A...")
            ask_question(doc_id)
            return
        elif status == "failed":
            print(f"\nFAILURE: Analysis failed. Message: {res.get('message')}")
            sys.exit(1)
            
        time.sleep(2)
        
    print("\nTIMEOUT: Analysis took longer than 60s.")
    sys.exit(1)

def ask_question(doc_id):
    url = f"{BASE_URL}/documents/{doc_id}/ask"
    data = {"question": "Summarize this document in one sentence."}
    
    req = urllib.request.Request(
        url, 
        data=json.dumps(data).encode('utf-8'), 
        headers={'Content-Type': 'application/json'},
        method="POST"
    )
    
    print(f"Asking question for doc {doc_id}...")
    try:
        with urllib.request.urlopen(req) as response:
            content = response.read().decode('utf-8')
            print(f"QA Response: {content[:200]}...")
            return True
    except urllib.error.URLError as e:
        print(f"QA request failed: {e}")
        if hasattr(e, 'read'):
            print(e.read().decode())
        return False

if __name__ == "__main__":
    main()

