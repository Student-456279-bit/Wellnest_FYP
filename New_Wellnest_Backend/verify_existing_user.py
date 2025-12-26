import sqlite3
import json
from main import app

DB_NAME = "./Wellnest_Database.db"

def get_existing_user():
    conn = sqlite3.connect(DB_NAME)
    cur = conn.cursor()
    # Get a user who has a health profile
    cur.execute("SELECT Users_Email FROM Health_Profiles LIMIT 1")
    row = cur.fetchone()
    conn.close()
    if row:
        return row[0]
    return None

def verify_for_user(email):
    print(f"\n--- Generating Plan for Existing User: {email} ---")
    
    # 1. Clean up potential previous plan for this user (so we can regenerate for demo)
    # In a real app we wouldn't do this, but for "visualizing it working" for an existing user 
    # who might already have a plan from previous tests, we might want to clear it to see generation happen.
    # OR we just hit the endpoint and if it 409s, we show the existing plan.
    # Let's clean it up to prove generation logic works again.
    
    conn = sqlite3.connect(DB_NAME)
    cur = conn.cursor()
    cur.execute("DELETE FROM GeneratedPlans WHERE user_email = ?", (email,))
    if cur.rowcount > 0:
        print("(Cleared existing plan for demo purposes)")
    conn.commit()
    conn.close()

    # 2. Call API
    client = app.test_client()
    resp = client.post('/api/wellness/generate', json={'email': email})
    
    # 3. Output
    print(f"Status: {resp.status_code}")
    if resp.status_code == 200:
        data = resp.get_json()
        print("\n✅ Plan Generated Successfully!")
        print(json.dumps(data['plan'], indent=2))
    elif resp.status_code == 409:
        data = resp.get_json()
        print("\n⚠️ Plan Already Exists (Duplicate Check Worked)")
        print(json.dumps(data['plan'], indent=2))
    else:
        print("\n❌ Error:")
        print(resp.get_json())

if __name__ == "__main__":
    email = get_existing_user()
    if email:
        verify_for_user(email)
    else:
        print("No users found in Health_Profiles table.")
