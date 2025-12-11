# HealthProfile.py
from flask import Blueprint, request, jsonify
from flask_cors import CORS
import sqlite3

health_bp = Blueprint('health', __name__)
CORS(health_bp, resources={r"/*": {"origins": "http://localhost:8080"}}, supports_credentials=True)

DB_PATH = "./Wellnest_Database.db"

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# Calculate BMI
def calculate_bmi(height_cm, weight_kg):
    try:
        height_m = float(height_cm) / 100
        weight = float(weight_kg)
        bmi = weight / (height_m ** 2)
        return round(bmi, 2)
    except:
        return None

# SAVE or UPDATE health profile
@health_bp.route("/save", methods=["POST"])
def save_health_form():
    data = request.get_json()
    user_email = data.get("Users_Email")

    if not user_email:
        return jsonify({"message": "User email is required"}), 400

    bmi = calculate_bmi(data.get("height"), data.get("weight"))

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # Check if record exists
        cur.execute("SELECT * FROM Health_Profiles WHERE Users_Email = ?", (user_email,))
        existing = cur.fetchone()

        # Prepare all values in correct order for both UPDATE and INSERT
        values = (
            float(data.get("height") or 0),
            float(data.get("weight") or 0),
            float(data.get("bodyFat") or 0),
            bmi,
            data.get("activityLevel"),
            data.get("injuries"),
            data.get("medical"),
            data.get("allergies"),
            float(data.get("sleep") or 0),
            float(data.get("workHours") or 0),
            int(data.get("stress") or 0),
            data.get("mainGoal"),
            data.get("secondaryGoals"),
            int(data.get("workoutMinutes") or 0),
            int(data.get("workoutDays") or 0),
            data.get("dietaryPreference"),
            data.get("cuisinePreference"),
            data.get("dislikedFoods"),
            int(data.get("mealsPerDay") or 0),
            user_email  # for WHERE clause in UPDATE
        )

        if existing:
            # UPDATE all fields
            cur.execute("""
                UPDATE Health_Profiles
                SET height=?, weight=?, bodyFat=?, bmi=?, activityLevel=?, injuries=?, medical=?, allergies=?,
                    sleep=?, workHours=?, stress=?, mainGoal=?, secondaryGoals=?,
                    workoutMinutes=?, workoutDays=?, dietaryPreference=?, cuisinePreference=?,
                    dislikedFoods=?, mealsPerDay=?
                WHERE Users_Email=?;
            """, values)
            message = "Health profile updated successfully."
        else:
            # INSERT all fields
            cur.execute("""
                INSERT INTO Health_Profiles (
                    Users_Email, height, weight, bodyFat, bmi, activityLevel, injuries, medical, allergies,
                    sleep, workHours, stress, mainGoal, secondaryGoals,
                    workoutMinutes, workoutDays, dietaryPreference, cuisinePreference,
                    dislikedFoods, mealsPerDay
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            """, (
                user_email,
                float(data.get("height") or 0),
                float(data.get("weight") or 0),
                float(data.get("bodyFat") or 0),
                bmi,
                data.get("activityLevel"),
                data.get("injuries"),
                data.get("medical"),
                data.get("allergies"),
                float(data.get("sleep") or 0),
                float(data.get("workHours") or 0),
                int(data.get("stress") or 0),
                data.get("mainGoal"),
                data.get("secondaryGoals"),
                int(data.get("workoutMinutes") or 0),
                int(data.get("workoutDays") or 0),
                data.get("dietaryPreference"),
                data.get("cuisinePreference"),
                data.get("dislikedFoods"),
                int(data.get("mealsPerDay") or 0)
            ))
            message = "Health profile saved successfully."

        conn.commit()
        conn.close()
        return jsonify({"message": message}), 200

    except Exception as e:
        return jsonify({"message": "Error saving health data", "error": str(e)}), 500

# GET existing health profile for logged-in user
@health_bp.route("/get/<email>", methods=["GET"])
def get_health_form(email):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT * FROM Health_Profiles WHERE Users_Email = ?", (email,))
        row = cur.fetchone()
        conn.close()

        if row:
            return jsonify(dict(row)), 200
        else:
            return jsonify({"message": "No health profile found for this user."}), 404
    except Exception as e:
        return jsonify({"message": "Error fetching health data", "error": str(e)}), 500
