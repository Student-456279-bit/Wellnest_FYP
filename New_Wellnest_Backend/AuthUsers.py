import sqlite3
from datetime import datetime
from flask import Blueprint, request, jsonify

auth_bp = Blueprint('auth_bp', __name__)
import os

# Get the directory of the current file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_NAME = os.path.join(BASE_DIR, "Wellnest_Database.db")

# -------------------- SIGN UP --------------------
@auth_bp.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()

        fullname = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if not fullname or not email or not password:
            return jsonify({"message": "All fields are required."}), 400

        conn = sqlite3.connect(DB_NAME)
        cur = conn.cursor()

        # Create table if it doesn’t exist
        #cur.execute("""
            #CREATE TABLE IF NOT EXISTS Users_Auth (
               # Users_ID INTEGER PRIMARY KEY AUTOINCREMENT,
              #  Users_Name TEXT NOT NULL,
              #  Users_Email TEXT NOT NULL UNIQUE,
               # Users_Password TEXT NOT NULL
          #  )
      #  """)

        # Check if user exists
        cur.execute("SELECT * FROM Users_Auth WHERE Users_Email = ?", (email,))
        if cur.fetchone():
            conn.close()
            return jsonify({"message": "User already exists. Please log in instead."}), 400

        # Insert user
        today_date = datetime.now().strftime("%Y-%m-%d")
        cur.execute(
            "INSERT INTO Users_Auth (Users_Name, Users_Email, Users_Password, created_at) VALUES (?, ?, ?, ?)",
            (fullname, email, password, today_date)
        )
        conn.commit()
        conn.close()

        print(f"New user added: {fullname} ({email})")
        return jsonify({"message": "User registered successfully!"}), 200

    except Exception as e:
        print(f"Error in signup: {e}")
        return jsonify({"error": str(e)}), 500


# -------------------- SIGN IN --------------------
@auth_bp.route('/signin', methods=['POST'])
def signin():
    try:
        data = request.get_json()

        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"message": "Email and password are required."}), 400

        conn = sqlite3.connect(DB_NAME)
        cur = conn.cursor()
        cur.execute(
            "SELECT Users_Name, Users_Email, Users_Password, created_at FROM Users_Auth WHERE Users_Email = ?",
            (email,)
        )
        user = cur.fetchone()
        conn.close()

        if not user:
            return jsonify({"message": "User not found. Please sign up first."}), 404

        name, user_email, stored_password, created_at = user

        if stored_password != password:
            return jsonify({"message": "Incorrect password. Please try again."}), 401
        # Fetch created_at (it might be the 4th column now, but better to be safe)
        # We selected 3 columns explicitly above: Users_Name, Users_Email, Users_Password
        # Let's re-query or fetch it properly?
        # Actually easier to just modify the SELECT above.

        # But wait, I can't modify the SELECT easily in a replace block if I don't see it.
        # Let's see the previous SELECT:
        # "SELECT Users_Name, Users_Email, Users_Password FROM Users_Auth ..."

        # I will do a new select for created_at or assume I need to change the fetch.
        # Let's change the fetch query.
        try:
            from GoalTracking import init_daily_goal
            init_daily_goal(user_email)
        except Exception as ex:
            print(f"Tracking init warning: {ex}")

        print(f"{email} signed in successfully.")
        return jsonify({
            "message": "Login successful!",
            "user": {
                "name": name,
                "email": user_email,
                "created_at": created_at
            }
        }), 200

    except Exception as e:
        print(f"Error in signin: {e}")
        return jsonify({"error": str(e)}), 500
