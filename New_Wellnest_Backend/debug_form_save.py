import requests
import json
import sqlite3

# Use the test user email we know exists, or we might need to create one if it doesn't
TEST_EMAIL = "test_user_3499@example.com"
URL = "http://localhost:5000/api/profile/save"

payload = {
    "Users_Email": TEST_EMAIL,
    "height": "175",
    "weight": "80",
    "bodyFat": "20",
    "activityLevel": "Moderate",
    "injuries": "None",
    "medical": "None",
    "allergies": "Peanuts",
    "sleep": "7",
    "workHours": "9 AM - 5 PM", # This is the potential trouble maker if DB expects REAL
    "stress": "3",
    "mainGoal": "Improve Wellness",
    "secondaryGoals": "Sleep better",
    "workoutMinutes": "45",
    "workoutDays": "4",
    "dietaryPreference": "Mix",
    "cuisinePreference": "Mix",
    "dislikedFoods": "None",
    "mealsPerDay": "3"
}

def run_debug():
    print(f"Sending payload to {URL}...")
    try:
        res = requests.post(URL, json=payload)
        print(f"Status Code: {res.status_code}")
        try:
            print("Response JSON:", res.json())
        except:
            print("Response Text (Not JSON):", res.text)
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    run_debug()
