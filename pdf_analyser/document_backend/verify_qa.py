import urllib.request
import json
import sys
import time

BASE_URL = "http://127.0.0.1:8006" # Port 8006 for this test run

def test_qa(doc_id):
    url = f"{BASE_URL}/documents/{doc_id}/ask"
    data = {"question": "What is the main topic of this document?"}
    
    req = urllib.request.Request(
        url, 
        data=json.dumps(data).encode('utf-8'), 
        headers={'Content-Type': 'application/json'},
        method="POST"
    )
    
    print(f"Asking question for doc {doc_id}...")
    try:
        with urllib.request.urlopen(req) as response:
            # The response might be streaming or json
            # The previous code suggested it might be streaming in some versions, but let's check headers
            print(f"Response Code: {response.getcode()}")
            content = response.read().decode('utf-8')
            print(f"Response Content: {content[:200]}...")
            return True
    except urllib.error.URLError as e:
        print(f"QA request failed: {e}")
        if hasattr(e, 'read'):
            print(e.read().decode())
        return False

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python verify_qa.py <doc_id>")
        sys.exit(1)
    
    doc_id = sys.argv[1]
    test_qa(doc_id)
