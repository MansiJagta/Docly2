# from llama_cpp import Llama
# import os

# class LLMEngine:
#     def __init__(self, model_path="models/assets/smollm2-360m-instruct-q8_0.gguf"):
#         if not os.path.exists(model_path):
#             raise FileNotFoundError(f"Model file not found at {model_path}")
#         self.llm = Llama(model_path=model_path, n_ctx=2048, verbose=False)

#     def generate_response(self, prompt, system_message):
#         full_prompt = f"<|im_start|>system\n{system_message}<|im_end|>\n<|im_start|>user\n{prompt}<|im_end|>\n<|im_start|>assistant\n"
#         output = self.llm(full_prompt, max_tokens=512, stop=["<|im_end|>"])
#         return output["choices"][0]["text"]








# from llama_cpp import Llama

# class LLMEngine:
#     def __init__(self, model_path: str):
#         # Optimized for CPU usage
#         self.llm = Llama(
#             model_path=model_path,
#             n_ctx=8192,
#             n_threads=4,
#             verbose=False
#         )

#     def generate(self, context: str, persona_prompt: str):
#         """Generates a summary based on the document and the selected persona."""
#         prompt = f"System: {persona_prompt}\nContext: {context}\nAI:"
#         response = self.llm(
#             prompt,
#             max_tokens=512,
#             stop=["User:", "\n"],
#             echo=False
#         )
#         return response["choices"][0]["text"]








# from llama_cpp import Llama

# class LLMEngine:
#     def __init__(self, model_path: str):
#         # Optimized for CPU usage
#         self.llm = Llama(
#             model_path=model_path,
#             n_ctx=8192,
#             n_threads=4,
#             verbose=False
#         )

#     def generate(self, context: str, persona_prompt: str):
#         """Generates a summary based on the document and the selected persona."""
        
#         # 1. Use the ChatML format which SmolLM2 understands best
#         # This prevents the model from getting confused by the 12k characters of text
#         prompt = (
#             f"<|im_start|>system\n{persona_prompt}<|im_end|>\n"
#             f"<|im_start|>user\nDocument Content: {context[:6000]}\n\n"
#             f"Please provide a summary based on your persona.<|im_end|>\n"
#             f"<|im_start|>assistant\n"
#         )

#         response = self.llm(
#             prompt,
#             max_tokens=512,
#             # 2. REMOVED "\n" from stop. 
#             # We only want it to stop when it's actually finished (im_end).
#             stop=["<|im_end|>", "User:"], 
#             echo=False,
#             temperature=0.7 # Added a bit of 'creativity' for better summaries
#         )
        
#         output = response["choices"][0]["text"].strip()
        
#         # Debugging print to confirm it's working
#         print(f"DEBUG: AI Response length: {len(output)} characters")
        
#         return output







# from llama_cpp import Llama

# class LLMEngine:
#     def __init__(self, model_path: str):
#         # Optimized for CPU usage and larger document segments
#         self.llm = Llama(
#             model_path=model_path,
#             n_ctx=8192,     # Large context for PDF chunks
#             n_threads=4,    # Parallel threads for faster CPU inference
#             verbose=False
#         )

#     def generate(self, query_or_task: str, context: str, persona_prompt: str = "You are a helpful assistant."):
#         """
#         Unified generation method for both Summary and Q&A.
#         Uses ChatML format optimized for SmolLM2.
#         """
#         clean_context = context[:4000]
#         # 1. Structure the prompt clearly for the local LLM
#         prompt = (
#             f"<|im_start|>system\n{persona_prompt}. Answer only based on context.<|im_end|>\n"
#             f"<|im_start|>user\nContext: {clean_context}\nQuestion: {query_or_task}<|im_end|>\n"
#             f"<|im_start|>assistant\n"
#         )

#         response = self.llm(
#            prompt,
#            max_tokens=512,        # Reduced from 512 for speed and to stop rambling
#            stop=["<|im_end|>", "|im_end|>", "<|im_start|>", "User:", "Assistant:"], 
#            echo=False,
#            temperature=0.08,      # Lower temperature = less repetition
#            repeat_penalty=1.5,    # NEW: Directly prevents repeating phrases
#            top_p=0.9,
#            presence_penalty=0.5

#        )
        
        
#         output = response["choices"][0]["text"].strip()
        
#         # Debugging print
#         print(f"DEBUG: AI Response length: {len(output)} characters")
        
#         return output

# # --- GLOBAL INSTANCE EXPORT ---
# # This line fixes the ImportError: cannot import name 'engine'
# # It creates a singleton instance used by all your LangGraph managers
# engine = LLMEngine(model_path="assets/smollm2.gguf")







# from llama_cpp import Llama

# class LLMEngine:
#     def __init__(self, model_path="assets/Llama-3.2-3B-Instruct-Q4_K_M.gguf"):
#         # Llama-3.2 3B requires a larger context window (n_ctx) for PDFs
#         # We point directly to the new Llama-3.2 file path
#         engine = LLMEngine(model_path="assets/Llama-3.2-3B-Instruct-Q4_K_M.gguf")
#         self.llm = Llama(
#             model_path=model_path,
#             n_ctx=8192,         # Supports up to 128k, but 8k is safe for 8GB RAM
#             n_gpu_layers=-1,    # Set to -1 to offload to GPU if available
#             verbose=False
#         )

#     # def generate(self, user_query, system_prompt):
#     #     # Llama-3.2 uses special header IDs for roles (ChatML-like format)
#     #     prompt = (
#     #         f"<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n"
#     #         f"{system_prompt}<|eot_id|>"
#     #         f"<|start_header_id|>user<|end_header_id|>\n\n"
#     #         f"{user_query}<|eot_id|>"
#     #         f"<|start_header_id|>assistant<|end_header_id|>\n\n"
#     #     )
        
#     #     response = self.llm(
#     #         prompt,
#     #         max_tokens=512,
#     #         # CRITICAL: These prevent the "20 times a day" repetition loops
#     #         repeat_penalty=1.2,
#     #         temperature=0.1,    # Keep it factual for a CTO
#     #         # Stop tokens specific to Llama-3.2 family
#     #         stop=["<|eot_id|>", "<|end_of_text|>", "Task:", "Constraint:"]
#     #     )
#     #     return response["choices"][0]["text"].strip()
    
#     def generate(self, user_query, system_prompt, temperature=0.1):

#      prompt = (
#         # f"<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n"
#         f"{system_prompt}<|eot_id|>"
#         f"<|start_header_id|>user<|end_header_id|>\n\n"
#         f"{user_query}<|eot_id|>"
#         f"<|start_header_id|>assistant<|end_header_id|>\n\n"
#      )
    
#      response = self.llm(
#         prompt,
#         max_tokens=512,
#         repeat_penalty=1.2,
#         temperature=temperature, # Now dynamic based on the persona
#         stop=["<|eot_id|>", "<|end_of_text|>", "Task:", "Constraint:"]
#      )
     
#      return response["choices"][0]["text"].strip()
    

# MODEL_PATH = "assets/Llama-3.2-3B-Instruct-Q4_K_M.gguf"
# engine = LLMEngine(model_path=MODEL_PATH)








from llama_cpp import Llama

class LLMEngine:
    def __init__(self, model_path="assets/Llama-3.2-3B-Instruct-Q4_K_M.gguf"):
        # ✅ FIXED: Removed the line that called LLMEngine() inside here.
        # Now it only initializes the actual Llama model once.
        self.llm = Llama(
            model_path=model_path,
            n_threads=6,
            n_ctx=8192,         # 8k context is stable for 8GB RAM
            n_gpu_layers=-1,    # Offload to GPU if available
            verbose=False,
            cache=True,
            n_batch=512
        )

    # def generate(self, user_query, system_prompt, temperature=0.1):
    #     # Llama-3.2 uses special header IDs for roles
    #     prompt = (
    #         f"<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n"
    #         f"{system_prompt}<|eot_id|>"
    #         f"<|start_header_id|>user<|end_header_id|>\n\n"
    #         f"{user_query}<|eot_id|>"
    #         f"<|start_header_id|>assistant<|end_header_id|>\n\n"
    #     )
        
    #     response = self.llm(
    #         prompt,
    #         max_tokens=512,
    #         repeat_penalty=1.2,
    #         temperature=temperature,
    #         stop=["<|eot_id|>", "<|end_of_text|>", "Task:", "Constraint:"]
    #     )
        
    #     return response["choices"][0]["text"].strip()

    def generate(self, user_query, system_prompt, temperature=0.1):
        # REMOVED <|begin_of_text|> to fix the RuntimeWarning
        prompt = (
            f"<|start_header_id|>system<|end_header_id|>\n\n"
            f"{system_prompt}<|eot_id|>"
            f"<|start_header_id|>user<|end_header_id|>\n\n"
            f"{user_query}<|eot_id|>"
            f"<|start_header_id|>assistant<|end_header_id|>\n\n"
        )
        
        # We also need to truncate context if it's too long to prevent the ValueError
        # 6000 tokens is a safe limit for an 8k context window
        response = self.llm(
            prompt,
            max_tokens=1024,
            repeat_penalty=1.2,
            temperature=temperature,
            stop=["<|eot_id|>", "<|end_of_text|>"]
        )
        
        return response["choices"][0]["text"].strip()

# --- THE FIX: GLOBAL INITIALIZATION ---
# This must be outside the class, at the very bottom, with ZERO indentation.
MODEL_PATH = "assets/Llama-3.2-3B-Instruct-Q4_K_M.gguf"
engine = LLMEngine(model_path=MODEL_PATH)