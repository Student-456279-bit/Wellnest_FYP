import socket
import subprocess
import os
import sys
import time

def check_port(port):
    """Checks if a port is in use."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('localhost', port)) == 0

def check_file_exists(path, description):
    """Checks if a file or directory exists."""
    if not os.path.exists(path):
        print(f"[ERROR] {description} not found at: {path}")
        return False
    return True

def kill_process_tree(pid):
    """Kills a process and all its children/descendants."""
    try:
        # /F = Forcefully terminate
        # /T = Terminates all child processes
        # /PID = Process ID
        subprocess.run(['taskkill', '/F', '/T', '/PID', str(pid)], 
                       stdout=subprocess.DEVNULL, 
                       stderr=subprocess.DEVNULL)
    except Exception as e:
        print(f"[ERROR] Failed to kill process {pid}: {e}")

def main():
    print("="*50)
    print("      Wellnest FYP - Project Launcher")
    print("="*50)

    # 1. Define Paths
    base_dir = os.getcwd()
    backend_dir = os.path.join(base_dir, "New_Wellnest_Backend")
    frontend_dir = os.path.join(base_dir, "New_Wellnest_Frontend")
    
    # 2. Check Directories
    if not check_file_exists(backend_dir, "Backend Directory"): return
    if not check_file_exists(frontend_dir, "Frontend Directory"): return

    # 3. Check Dependencies (Basic)
    if not check_file_exists(os.path.join(frontend_dir, "node_modules"), "Frontend Dependencies (node_modules)"):
        print("[TIP] Run 'npm install' inside New_Wellnest_Frontend folder.")
        x = input("Do you want to continue anyway? (y/n): ")
        if x.lower() != 'y': return

    # 4. Check Ports
    ports_in_use = []
    if check_port(5000): ports_in_use.append(5000)
    if check_port(8080): ports_in_use.append(8080)

    if ports_in_use:
        print(f"[WARNING] The following ports are already in use: {ports_in_use}")
        print("Starting the servers might fail or conflict with existing instances.")
        print("Recommendation: Close any existing python/node processes or run this script again to clean up.")
        x = input("Do you want to proceed? (y/n): ")
        if x.lower() != 'y': return

    print("\n[INFO] Launching Backend...")
    # Launch Backend
    # creationflags=subprocess.CREATE_NEW_CONSOLE opens a new window
    backend_process = subprocess.Popen(
        ['python', 'main.py'],
        cwd=backend_dir,
        creationflags=subprocess.CREATE_NEW_CONSOLE,
        shell=True 
    )

    print("[INFO] Launching Frontend...")
    # Launch Frontend
    frontend_process = subprocess.Popen(
        ['npm', 'run', 'dev'],
        cwd=frontend_dir,
        creationflags=subprocess.CREATE_NEW_CONSOLE,
        shell=True
    )

    print("\n[SUCCESS] Both processes have been launched.")
    print("Backend: http://localhost:5000")
    print("Frontend: http://localhost:8080")
    print("="*50)
    print(">> KEEP THIS WINDOW OPEN <<")
    print(">> Press ENTER in this window to STOP all servers and exit. <<")
    print("="*50)

    try:
        input() # Wait for user to press Enter
    except KeyboardInterrupt:
        pass # Handle Ctrl+C gracefully
    finally:
        print("\n[INFO] Shutting down servers...")
        if backend_process:
            print(" - Killing Backend...")
            kill_process_tree(backend_process.pid)
        if frontend_process:
            print(" - Killing Frontend...")
            kill_process_tree(frontend_process.pid)
        print("[DONE] Cleanup complete.")
        time.sleep(2) # Give user a chance to see the cleanup message

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"\n[CRITICAL ERROR] {e}")
        input("\nPress Enter to exit...")
