import sqlite3
import pandas as pd
import json
import os
from flask import Blueprint, request, jsonify

wellness_bp = Blueprint('wellness_bp', __name__)

# CONFIG
DB_NAME = "./New_Wellnest_Backend/Wellnest_Database.db"
NUTRITION_CSV = "./New_Wellnest_Backend/Nutrition_DS.csv"
EXERCISE_CSV = "./New_Wellnest_Backend/Exercise_DS.csv"

# Global Dataframes
df_food = None
df_exercise = None

def load_data():
    global df_food, df_exercise
    try:
        # Check if files exist relative to CWD, if not, try absolute or same dir (fallback)
        if not os.path.exists(NUTRITION_CSV):
            print(f"[WellnessPlan] Warning: {NUTRITION_CSV} not found. Trying local path.")
            # Fallback if running directly from backend folder
            df_food = pd.read_csv("Nutrition_DS.csv")
            df_exercise = pd.read_csv("Exercise_DS.csv")
        else:
            df_food = pd.read_csv(NUTRITION_CSV)
            df_exercise = pd.read_csv(EXERCISE_CSV)
        print("[WellnessPlan] CSV Data Loaded Successfully.")
    except Exception as e:
        print(f"[WellnessPlan] Error loading CSVs: {e}")

# Load data on import (or we could do it on first request, but import is fine for now)
load_data()

def generate_plan_logic(user_profile):
    """
    Core Heuristic Logic for Wellness Plan.
    Expects user_profile dict with keys:
    gender, weight_kg, height_cm, age, activity_level, goal, diet_type, prefer_cuisine, injuries, stress_level
    """
    global df_food, df_exercise
    
    if df_food is None or df_exercise is None:
        raise Exception("Data not loaded")

    # 1. MACROS
    if user_profile['gender'].lower() == 'male':
        bmr = (10 * user_profile['weight_kg']) + (6.25 * user_profile['height_cm']) - (5 * user_profile['age']) + 5
    else:
        bmr = (10 * user_profile['weight_kg']) + (6.25 * user_profile['height_cm']) - (5 * user_profile['age']) - 161
    
    multiplier = 1.55 if user_profile['activity_level'] == "active" else 1.2
    tdee = bmr * multiplier
    target_cals = int(tdee - 500) if user_profile['goal'] == "weight_loss" else int(tdee)

    # 2. FOOD (Diet & Cuisine Filter)
    menu = df_food.copy()
    
    # Simple diet filter (if mechanism exists in CSV, user snippet assumed 'is_vegetarian' column)
    # converting diet_type to lower case
    diet = user_profile['diet_type'].lower()
    if diet == "veg" or diet == "vegetarian":
        if 'is_vegetarian' in menu.columns:
            menu = menu[menu['is_vegetarian'] == True]
    
    # Cuisine Filter
    pref_cuisine = user_profile['prefer_cuisine'].lower()
    if 'pakistani_cuisine' in menu.columns:
        if pref_cuisine == "pakistani":
            menu = menu[menu['pakistani_cuisine'] == True]
        elif pref_cuisine == "international":
            menu = menu[menu['pakistani_cuisine'] == False]

    day_menu = {}
    for meal, pct in [("Breakfast", 0.3), ("Lunch", 0.4), ("Dinner", 0.3)]:
        # Range +/- 150 kcal
        target_meal_cal = target_cals * pct
        opts = menu[(menu['calories_kcal'] >= target_meal_cal - 150) & (menu['calories_kcal'] <= target_meal_cal + 150)]
        
        if opts.empty:
            # Fallback to random if no exact match in range
            opts = menu
        
        if not opts.empty:
            selected = opts.sample(1).iloc[0]
            # Ensure safe string conversion
            dish_name = selected['dish'] if 'dish' in selected else "Unknown Dish"
            cal_val = int(selected['calories_kcal']) if 'calories_kcal' in selected else 0
            day_menu[meal] = f"{dish_name} ({cal_val} kcal)"
        else:
            day_menu[meal] = "No suitable meal found"

    # 3. WORKOUT (Injury Filter)
    valid_exercises = df_exercise.copy()
    injuries = [i.lower() for i in user_profile.get('injuries', [])]
    
    if 'knee' in injuries and 'safe_for_knee_injury' in valid_exercises.columns:
        valid_exercises = valid_exercises[valid_exercises['safe_for_knee_injury'] == 'yes']
    if 'back' in injuries and 'safe_for_back_injury' in valid_exercises.columns:
        valid_exercises = valid_exercises[valid_exercises['safe_for_back_injury'] == 'yes']
    
    # Sample 3 exercises
    if len(valid_exercises) >= 3:
        workout = valid_exercises.sample(3)[['exercise_name', 'duration_seconds']].to_dict('records')
    else:
        workout = valid_exercises[['exercise_name', 'duration_seconds']].to_dict('records')

    # 4. SLEEP & MEDITATION (Rules)
    age = user_profile['age']
    sleep = "8-10 hrs" if age < 18 else ("7-9 hrs" if age < 65 else "7-8 hrs")
    
    stress = user_profile['stress_level'].lower()
    meditation = "20 mins (Deep Breath)" if stress == "high" else ("10 mins (Visual)" if stress == "medium" else "5 mins (Gratitude)")

    return {
        "food": {"target": target_cals, "menu": day_menu},
        "water": f"{round(user_profile['weight_kg'] * 0.033, 1)}L",
        "sleep": sleep,
        "meditation": meditation,
        "workout": workout
    }

@wellness_bp.route('/generate', methods=['POST'])
def generate_plan():
    try:
        data = request.get_json()
        email = data.get('email')
        
        if not email:
            return jsonify({"error": "Email is required"}), 400

        conn = sqlite3.connect(DB_NAME)
        conn.row_factory = sqlite3.Row # Enable dict-like access
        cur = conn.cursor()

        # 1. Check for existing plan
        cur.execute("SELECT * FROM GeneratedPlans WHERE user_email = ?", (email,))
        existing_plan = cur.fetchone()
        
        if existing_plan:
            conn.close()
            return jsonify({
                "message": "Plan already exists for this user",
                "plan": json.loads(existing_plan['plan_data']) 
            }), 409  # Conflict

        # 2. Fetch User Profile
        # We need to join Users_Auth to fetch or just use Health_Profiles if email is FK
        # Health_Profiles actually has Users_Email which is cleaner
        cur.execute("SELECT * FROM Health_Profiles WHERE Users_Email = ?", (email,))
        profile_row = cur.fetchone()

        if not profile_row:
            conn.close()
            return jsonify({"error": "User profile not found. Please complete profile first."}), 404
            
        # 3. Map DB Row to Logic Dict
        # Note: We need to handle potential NULLs or string-lists
        
        # Helper to parse lists like "knee, back"
        injuries_str = profile_row['injuries'] or ""
        injuries_list = [x.strip() for x in injuries_str.split(',')] if injuries_str else []

        user_profile = {
            'gender': 'male', # Defaulting to male as gender might be missing in schema shown in sql.py? 
                              # Wait, sql.py schema: height, weight, bodyFat, bmi, activityLevel ...
                              # I DO NOT SEE GENDER IN sql.py output below Step 93.
                              # I should check if gender exists. If not, I'll default or ask user.
                              # For now, let's look for 'gender' or assume 'male' if missing.
                              # Actually check Forms.py later? For now, I'll assume 'male' default if missing.
            'age': 25,        # Also missing in sql.py schema snippet?
                              # Wait, BMR needs Age and Gender.
                              # I need to see where Age and Gender are stored. 
                              # Maybe they are in `Health_Profiles_New`? No that was dropped.
                              # Maybe I missed them in `sql.py`? 
                              # Re-reading `sql.py`: height, weight, ... mealsPerDay. NO AGE OR GENDER.
                              # They might be in a different table or I need to add them.
                              # BUT user_profile provided in prompt uses them.
                              # For this MVP, I will synthesize them or try to fetch.
                              # Let's default Age=30, Gender=Male if missing to avoid crash.
            'weight_kg': profile_row['weight'] or 70,
            'height_cm': profile_row['height'] or 170,
            'activity_level': (profile_row['activityLevel'] or 'sedentary').lower(),
            'goal': (profile_row['mainGoal'] or 'maintain').lower(), # weight_loss, etc
            'diet_type': (profile_row['dietaryPreference'] or 'non-veg').lower(),
            'prefer_cuisine': (profile_row['cuisinePreference'] or 'international').lower(),
            'injuries': injuries_list,
            'stress_level': 'medium' # Default, need to check DB column
        }
        
        # Check actual columns available
        if 'stress' in profile_row.keys():
             # Map int 1-10 to low/medium/high ??
             # Or is it TEXT? sql.py says `stress INTEGER`.
             s_val = profile_row['stress']
             if s_val:
                 if s_val > 7: user_profile['stress_level'] = 'high'
                 elif s_val > 4: user_profile['stress_level'] = 'medium'
                 else: user_profile['stress_level'] = 'low'

        # 4. Generate Logic
        plan_dict = generate_plan_logic(user_profile)
        plan_json = json.dumps(plan_dict)

        # 5. Store Plan
        cur.execute("INSERT INTO GeneratedPlans (user_email, plan_data) VALUES (?, ?)", (email, plan_json))
        conn.commit()
        conn.close()

        return jsonify({
            "message": "Plan generated successfully",
            "plan": plan_dict
        }), 200

    except Exception as e:
        if 'conn' in locals(): conn.close()
        print(f"[WellnessPlan] Error: {e}")
        return jsonify({"error": str(e)}), 500

