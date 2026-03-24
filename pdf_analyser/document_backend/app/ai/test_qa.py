import uuid
from manager_qa import app_qa

def run_qa_test():
    # 1. Configuration: thread_id acts as the 'Session ID'
    # This is what tells the checkpointer to remember this specific conversation.
    config = {"configurable": {"thread_id": f"qa_session_{uuid.uuid4().hex[:6]}"}}
    
    # In a real app, this file_id would come from your database after upload
    target_file_id = "sample.pdf" 
    
    print("🚀 Starting Offline Q&A Debugger...")
    print(f"📂 Target Document: {target_file_id}")
    print("-" * 50)

    while True:
        user_input = input("\n💬 Ask a question about the PDF (or type 'exit'): ")
        
        if user_input.lower() in ['exit', 'quit']:
            break

        # 2. Define the inputs for the Q&A Graph
        inputs = {
            "question": user_input,
            "file_id": target_file_id,
            "reflection_count": 0,  # Initialize for the feedback loop
            "history": []           # This will be managed by the checkpointer
        }

        print("\n--- Processing via LangGraph ---")
        
        # 3. Stream the execution to watch nodes in real-time
        final_state = {}
        for state in app_qa.stream(inputs, config=config, stream_mode="values"):
            final_state = state
            
            # Print the current node progress
            if state.get('retrieved_context'):
                # Just show a snippet of what was found in sqlite-vec
                context_len = len(state['retrieved_context'])
                print(f"🔍 Context Retrieved ({context_len} chars)", flush=True)
            
            if state.get('reflection_count') and state['reflection_count'] > 0:
                print(f"🔄 Reflection Loop: Iteration {state['reflection_count']}", flush=True)

            if state.get('critique'):
                print(f"🧐 Critic Feedback: {state['critique'][:100]}...", flush=True)

        # 4. Display the Final Result
        print("\n" + "="*60)
        print("🤖 AI RESPONSE:")
        print("-" * 60)
        print(final_state.get("answer", "❌ No answer generated."))
        print("="*60)

if __name__ == "__main__":
    try:
        run_qa_test()
    except KeyboardInterrupt:
        print("\nStopping Q&A Session...")