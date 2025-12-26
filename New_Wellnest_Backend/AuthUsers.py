# AuthUsers.py
import sqlite3
from flask import Blueprint, request, jsonify

auth_bp = Blueprint('auth_bp', __name__)
DB_NAME = "./Wellnest_Database.db"  # keep it simple; make sure this file exists in backend folder

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
        cur.execute(
            "INSERT INTO Users_Auth (Users_Name, Users_Email, Users_Password) VALUES (?, ?, ?)",
            (fullname, email, password)
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
            "SELECT Users_Name, Users_Email, Users_Password FROM Users_Auth WHERE Users_Email = ?",
            (email,)
        )
        user = cur.fetchone()
        conn.close()

        if not user:
            return jsonify({"message": "User not found. Please sign up first."}), 404

        name, user_email, stored_password = user

        if stored_password != password:
            return jsonify({"message": "Incorrect password. Please try again."}), 401

        print(f"{email} signed in successfully.")
        return jsonify({
            "message": "Login successful!",
            "user": {
                "name": name,
                "email": user_email
            }
        }), 200

    except Exception as e:
        print(f"Error in signin: {e}")
        return jsonify({"error": str(e)}), 500


# -------------------- UPDATE PROFILE --------------------
@auth_bp.route('/update_profile', methods=['PUT'])
def update_profile():
    try:
        data = request.get_json()

        email = data.get('email')
        new_username = data.get('username')
        new_password = data.get('password')

        if not email:
             return jsonify({"message": "Email is required to identify the user."}), 400

        if not new_username and not new_password:
             return jsonify({"message": "No changes provided."}), 400

        conn = sqlite3.connect(DB_NAME)
        cur = conn.cursor()

        # Check if user exists
        cur.execute("SELECT * FROM Users_Auth WHERE Users_Email = ?", (email,))
        if not cur.fetchone():
            conn.close()
            return jsonify({"message": "User not found."}), 404

        # Update fields
        if new_username:
            cur.execute("UPDATE Users_Auth SET Users_Name = ? WHERE Users_Email = ?", (new_username, email))

        if new_password:
            cur.execute("UPDATE Users_Auth SET Users_Password = ? WHERE Users_Email = ?", (new_password, email))

        conn.commit()
        conn.close()

        print(f"User profile updated for: {email}")
        return jsonify({"message": "Profile updated successfully!", "user": {"name": new_username, "email": email}}), 200

    except Exception as e:
        print(f"Error in update_profile: {e}")
        return jsonify({"error": str(e)}), 500
