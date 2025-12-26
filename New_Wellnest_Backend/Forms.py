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
            data.get("workHours"),
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
                data.get("workHours"),
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

# ==================== PERSONALIZATION ENDPOINTS ====================
import os
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = './uploads/medical_reports'
ALLOWED_EXTENSIONS = {'pdf', 'jpg', 'jpeg', 'png'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# SAVE personalization data
@health_bp.route("/personalization/save", methods=["POST"])
def save_personalization():
    try:
        user_email = request.form.get("Users_Email")
        
        if not user_email:
            return jsonify({"message": "User email is required"}), 400
        
        # Handle file upload
        medical_report_path = None
        if 'medical_report' in request.files:
            file = request.files['medical_report']
            if file and file.filename != '' and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                # Create user-specific directory
                user_folder = os.path.join(UPLOAD_FOLDER, user_email.replace('@', '_at_'))
                os.makedirs(user_folder, exist_ok=True)
                
                file_path = os.path.join(user_folder, filename)
                file.save(file_path)
                medical_report_path = file_path
        
        # Get form data
        current_medications = request.form.get("current_medications", "")
        mood_tracking_enabled = 1 if request.form.get("mood_tracking_enabled") == "true" else 0
        notification_language = request.form.get("notification_language", "English")
        sync_fitbit = 1 if request.form.get("sync_fitbit") == "true" else 0
        sync_google_fit = 1 if request.form.get("sync_google_fit") == "true" else 0
        sync_apple_health = 1 if request.form.get("sync_apple_health") == "true" else 0
        interaction_preference = request.form.get("interaction_preference", "Both")
        ai_consent = 1 if request.form.get("ai_consent") == "true" else 0
        data_sharing_consent = 1 if request.form.get("data_sharing_consent") == "true" else 0
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Check if record exists
        cur.execute("SELECT * FROM User_Personalization WHERE Users_Email = ?", (user_email,))
        existing = cur.fetchone()
        
        if existing:
            # UPDATE - only update medical_report_path if a new file was uploaded
            if medical_report_path:
                cur.execute("""
                    UPDATE User_Personalization
                    SET medical_report_path=?, current_medications=?, mood_tracking_enabled=?, 
                        notification_language=?, sync_fitbit=?, sync_google_fit=?, sync_apple_health=?,
                        interaction_preference=?, ai_consent=?, data_sharing_consent=?
                    WHERE Users_Email=?
                """, (medical_report_path, current_medications, mood_tracking_enabled, notification_language,
                      sync_fitbit, sync_google_fit, sync_apple_health, interaction_preference,
                      ai_consent, data_sharing_consent, user_email))
            else:
                cur.execute("""
                    UPDATE User_Personalization
                    SET current_medications=?, mood_tracking_enabled=?, 
                        notification_language=?, sync_fitbit=?, sync_google_fit=?, sync_apple_health=?,
                        interaction_preference=?, ai_consent=?, data_sharing_consent=?
                    WHERE Users_Email=?
                """, (current_medications, mood_tracking_enabled, notification_language,
                      sync_fitbit, sync_google_fit, sync_apple_health, interaction_preference,
                      ai_consent, data_sharing_consent, user_email))
            message = "Personalization updated successfully."
        else:
            # INSERT
            cur.execute("""
                INSERT INTO User_Personalization (
                    Users_Email, medical_report_path, current_medications, mood_tracking_enabled,
                    notification_language, sync_fitbit, sync_google_fit, sync_apple_health,
                    interaction_preference, ai_consent, data_sharing_consent
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (user_email, medical_report_path, current_medications, mood_tracking_enabled,
                  notification_language, sync_fitbit, sync_google_fit, sync_apple_health,
                  interaction_preference, ai_consent, data_sharing_consent))
            message = "Personalization saved successfully."
        
        conn.commit()
        conn.close()
        return jsonify({"message": message}), 200
        
    except Exception as e:
        return jsonify({"message": "Error saving personalization data", "error": str(e)}), 500

# GET personalization data
@health_bp.route("/personalization/get/<email>", methods=["GET"])
def get_personalization(email):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT * FROM User_Personalization WHERE Users_Email = ?", (email,))
        row = cur.fetchone()
        conn.close()
        
        if row:
            return jsonify(dict(row)), 200
        else:
            return jsonify({"message": "No personalization data found for this user."}), 404
    except Exception as e:
        return jsonify({"message": "Error fetching personalization data", "error": str(e)}), 500
