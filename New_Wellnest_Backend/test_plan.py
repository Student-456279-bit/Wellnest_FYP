import sqlite3
import json
import random
from main import app

DB_NAME = "./Wellnest_Database.db"
TEST_EMAIL = f"test_user_{random.randint(1000, 9999)}@example.com"

def setup_test_user():
    conn = sqlite3.connect(DB_NAME)
    cur = conn.cursor()
    
    # 1. Create Auth User
    cur.execute("INSERT INTO Users_Auth (Users_Name, Users_Email, Users_Password) VALUES (?, ?, ?)",
                ("Test User", TEST_EMAIL, "password"))
    
    # 2. Create Health Profile
    # Columns from sql.py: Users_Email, height, weight, activityLevel, injuries, stress, mainGoal, dietaryPreference, cuisinePreference
    cur.execute("""
        INSERT INTO Health_Profiles 
        (Users_Email, height, weight, activityLevel, injuries, stress, mainGoal, dietaryPreference, cuisinePreference, age)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (TEST_EMAIL, 180, 75, "active", "knee", 8, "weight_loss", "non-veg", "pakistani", 30))
    # Note: I added 'age' to insert query but assumed it exists or I am inserting into a table that HAS it.
    # Wait, my previous analysis said 'age' might be missing in schema.
    # Logic in WellnessPlan.py defaults age to 25 if not found. 
    # BUT if the column doesn't exist, this INSERT will fail.
    # I should check if 'age' exists. If not, I won't insert it.
    
    # Let's check schema again safely by trying to insert without age first? 
    # Or strict adherence to sql.py from Step 93 check.
    # Step 93 output for Health_Profiles creation: 
    # ... height, weight, ... mealsPerDay. NO AGE.
    # So I CANNOT insert 'age'.
    # I will remove 'age' from this insert. Logic handles the default.
    
    conn.commit()
    conn.close()
    print(f"Created test user: {TEST_EMAIL}")

def setup_test_user_safe():
    conn = sqlite3.connect(DB_NAME)
    cur = conn.cursor()
    cur.execute("INSERT INTO Users_Auth (Users_Name, Users_Email, Users_Password) VALUES (?, ?, ?)",
                ("Test User", TEST_EMAIL, "password"))
    
    # Insert without age
    cur.execute("""
        INSERT INTO Health_Profiles 
        (Users_Email, height, weight, activityLevel, injuries, stress, mainGoal, dietaryPreference, cuisinePreference)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (TEST_EMAIL, 180, 75, "active", "knee", 8, "weight_loss", "non-veg", "pakistani"))
    
    conn.commit()
    conn.close()
    print(f"Created test user: {TEST_EMAIL}")

def run_test():
    setup_test_user_safe()
    
    client = app.test_client()
    
    print("\n--- TEST 1: Generate Plan (First Time) ---")
    resp = client.post('/api/wellness/generate', json={'email': TEST_EMAIL})
    print(f"Status: {resp.status_code}")
    print(f"Response: {resp.get_json()}")
    
    if resp.status_code == 200:
        print("✅ SUCCESS: Plan generated.")
    else:
        print("❌ FAILED: Could not generate plan.")

    print("\n--- TEST 2: Duplicate Check ---")
    resp2 = client.post('/api/wellness/generate', json={'email': TEST_EMAIL})
    print(f"Status: {resp2.status_code}")
    if resp2.status_code == 409:
        print("✅ SUCCESS: Correctly identified duplicate.")
    else:
        print(f"❌ FAILED: Expected 409, got {resp2.status_code}")

if __name__ == "__main__":
    run_test()
