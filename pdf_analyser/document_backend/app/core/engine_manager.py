# import os
# import subprocess
# import socket
# import time
# import logging

# logger = logging.getLogger("uvicorn")

# def is_port_in_use(port: int) -> bool:
#     with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
#         return s.connect_ex(("localhost", port)) == 0

# def start_ollama_engine():
#     """
#     Locates the local Ollama binary in /engine and starts it in the background
#     if port 11434 is not already taken.
#     """
#     # 1. Check if Ollama is already running
#     if is_port_in_use(11434):
#         logger.info("✅ Ollama is already running on port 11434.")
#         return

#     # 2. Locate the binary
#     # Assumes 'engine' folder is in the project root (one level up from app/core if run from root)
#     # Adjust path logic based on CWD being 'document_backend'
#     base_dir = os.getcwd() # Should be document_backend
#     engine_dir = os.path.join(base_dir, "engine")
#     ollama_exe = os.path.join(engine_dir, "ollama.exe")
#     models_dir = os.path.join(engine_dir, "models")

#     if not os.path.exists(ollama_exe):
#         logger.warning(f"⚠️  Ollama binary not found at {ollama_exe}. Assuming global install or manual start.")
#         return

#     # 3. Configure Environment
#     # Ensure absolute paths
#     models_dir = os.path.abspath(models_dir)
#     env = os.environ.copy()
#     env["OLLAMA_MODELS"] = models_dir
#     # env["OLLAMA_HOST"] = "127.0.0.1:11434"

#     logger.info(f"🚀 Starting Silent Ollama Engine from {ollama_exe}...")
#     logger.info(f"📂 Model Path: {models_dir}")

#     # 4. Start Process (Silent Mode)
#     try:
#         subprocess.Popen(
#             [ollama_exe, "serve"],
#             cwd=engine_dir,
#             env=env,
#             creationflags=0x08000000,
#             stdout=subprocess.DEVNULL,
#             stderr=subprocess.DEVNULL
#         )
#         # Give it a moment to bind the port
#         time.sleep(5) # Increased wait time for safety
        
#         if is_port_in_use(11434):
#              logger.info("✅ Silent Ollama started successfully.")
             
#              # 5. Verify Model Availability
#              logger.info("🔍 Verifying 'llama3.2' model availability...")
#              try:
#                  # List models
#                  result = subprocess.run(
#                      [ollama_exe, "list"],
#                      env=env,
#                      capture_output=True,
#                      text=True,
#                      creationflags=0x08000000
#                  )
                 
#                  if "llama3.2" in result.stdout:
#                      logger.info("✅ Model 'llama3.2' found in local registry.")
#                  else:
#                      logger.warning("⚠️  Model 'llama3.2' not found. Attempting to pull from local/remote...")
#                      # Attempt pull (will use local models dir if correctly populated or fetch if online)
#                      pull_process = subprocess.Popen(
#                          [ollama_exe, "pull", "llama3.2"],
#                          env=env,
#                          creationflags=0x08000000,
#                          stdout=subprocess.DEVNULL,
#                          stderr=subprocess.DEVNULL
#                      )
#                      pull_process.wait()
#                      logger.info("✅ Model 'llama3.2' pull command completed.")
                     
#              except Exception as e:
#                  logger.error(f"❌ Model verification failed: {e}")

#         else:
#              logger.warning("⚠️  Ollama process started but port 11434 is not yet active.")
             
#     except Exception as e:
#         logger.error(f"❌ Failed to start Ollama silent engine: {e}")






import os
import subprocess
import socket
import time
import logging

logger = logging.getLogger("uvicorn")

def is_port_in_use(port: int) -> bool:
    """Checks if the port is already being used (i.e., Ollama is already running)."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        # We check localhost to see if the port is bound
        return s.connect_ex(("127.0.0.1", port)) == 0

def start_ollama_engine():
    """
    Locates the local Ollama binary in /engine and starts it in the background
    if port 11434 is not already taken.
    """
    # 1. Check if Ollama is already running
    if is_port_in_use(11434):
        logger.info("✅ Ollama is already running on port 11434.")
        return

    # 2. Locate the binary and models
    # We use __file__ to find the folder regardless of where you start the script
    # app/core/engine_manager.py -> app/core -> app -> document_backend
    current_file_path = os.path.abspath(__file__)
    backend_root = os.path.dirname(os.path.dirname(os.path.dirname(current_file_path)))
    
    engine_dir = os.path.join(backend_root, "engine")
    ollama_exe = os.path.join(engine_dir, "ollama.exe")
    models_dir = os.path.join(engine_dir, "models")

    if not os.path.exists(ollama_exe):
        logger.warning(f"⚠️  Ollama binary not found at {ollama_exe}. Ensure it is in the /engine folder.")
        return

    # 3. Configure Environment
    models_dir = os.path.abspath(models_dir)
    env = os.environ.copy()
    env["OLLAMA_MODELS"] = models_dir
    # Force host to local for security
    env["OLLAMA_HOST"] = "127.0.0.1:11434"

    logger.info(f"🚀 Starting Silent Ollama Engine from {ollama_exe}...")
    logger.info(f"📂 Model Path: {models_dir}")

    # 4. Start Process (Silent Mode)
    try:
        # CREATE_NO_WINDOW = 0x08000000 hides the console window on Windows
        subprocess.Popen(
            [ollama_exe, "serve"],
            cwd=engine_dir,
            env=env,
            creationflags=0x08000000, 
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            close_fds=True # Good practice for background processes
        )
        
        # Give it a moment to bind the port
        time.sleep(4) 
        
        if is_port_in_use(11434):
            logger.info("✅ Silent Ollama started successfully.")
            
            # 5. Verify Model Availability (Using the model we found in your list)
            model_to_verify = "qwen2.5:1.5b" 
            logger.info(f"🔍 Verifying '{model_to_verify}' availability...")
            
            try:
                # Capture output to see if the model exists in the local registry
                result = subprocess.run(
                    [ollama_exe, "list"],
                    env=env,
                    capture_output=True,
                    text=True,
                    creationflags=0x08000000
                )
                
                if model_to_verify in result.stdout:
                    logger.info(f"✅ Model '{model_to_verify}' found in local registry.")
                else:
                    logger.warning(f"⚠️  Model '{model_to_verify}' not found in {models_dir}.")
                    logger.info(f"📥 Attempting to pull '{model_to_verify}'... (This may take time)")
                    
                    # Background pull to avoid blocking server startup indefinitely
                    subprocess.Popen(
                        [ollama_exe, "pull", model_to_verify],
                        env=env,
                        creationflags=0x08000000,
                        stdout=subprocess.DEVNULL,
                        stderr=subprocess.DEVNULL
                    )
            except Exception as e:
                logger.error(f"❌ Model verification failed: {e}")
        else:
            logger.warning("⚠️  Ollama process started but port 11434 is not responding.")
             
    except Exception as e:
        logger.error(f"❌ Failed to start Ollama silent engine: {e}")


