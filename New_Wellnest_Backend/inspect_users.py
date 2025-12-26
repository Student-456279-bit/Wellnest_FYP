import sqlite3
import os

DB_PATH = "./Wellnest_Database.db"

if not os.path.exists(DB_PATH):
    print(f"Error: Database file not found at {DB_PATH}")
    exit(1)

try:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM Users_Auth")
    rows = cursor.fetchall()
    
    if not rows:
        print("No users found in Users_Auth table.")
    else:
        # Assuming 3 columns based on previous run: Email, Name, Password (or similar)
        print(f"{'Column 1':<30} | {'Column 2':<20} | {'Column 3'}")
        print("-" * 80)
        for row in rows:
            # Convert all to string to avoid format errors
            r = [str(x) for x in row]
            print(" | ".join(r))

    conn.close()

except Exception as e:
    print(f"An error occurred: {e}")
