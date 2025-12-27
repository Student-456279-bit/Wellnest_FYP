# Forgor.py
from flask import Blueprint, request, jsonify
from flask_cors import CORS
import sqlite3, random, datetime
from sib_api_v3_sdk import Configuration, ApiClient, TransactionalEmailsApi, SendSmtpEmail

forgor_bp = Blueprint("forgor_bp", __name__)
CORS(forgor_bp)

DATABASE_PATH = "./New_Wellnest_Backend/Wellnest_Database.db"

# --- Configure Brevo API ---
configuration = Configuration()
configuration.api_key["api-key"] = "Key maang lena"  # Replace with your key

def send_reset_email(email, code):
    """Send reset code email via Brevo API"""
    api_instance = TransactionalEmailsApi(ApiClient(configuration))
    subject = "Wellnest Password Reset Code"
    html_content = f"""
    <html>
    <body>
        <h2>Wellnest Password Reset</h2>
        <p>Your password reset code is: <b>{code}</b></p>
        <p>This code will expire in 5 minutes.</p>
    </body>
    </html>
    """
    sender = {"name": "Wellnest", "email": "isoitadori@gmail.com"}
    to = [{"email": email}]

    send_smtp_email = SendSmtpEmail(
        to=to,
        html_content=html_content,
        sender=sender,
        subject=subject
    )

    try:
        api_instance.send_transac_email(send_smtp_email)
        print(f"Email sent successfully to {email}")
        return True
    except Exception as e:
        print(f"Error sending email via Brevo API: {e}")
        return False


# -------------------- REQUEST RESET CODE --------------------
@forgor_bp.route("/request_reset_code", methods=["POST"])
def request_reset_code():
    data = request.get_json()
    email = data.get("email")
    if not email:
        return jsonify({"error": "Email is required"}), 400

    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()

    # Check if user exists
    cursor.execute("SELECT Users_Email FROM Users_Auth WHERE Users_Email = ?", (email,))
    if not cursor.fetchone():
        conn.close()
        return jsonify({
            "error": "The email you entered is not associated with any account.",
            "signup_suggestion": True
        }), 404

    # Generate reset code & expiry
    code = str(random.randint(100000, 999999))
    expiry = datetime.datetime.now() + datetime.timedelta(minutes=5)

    # Create table if not exists
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS reset_codes (
            email TEXT PRIMARY KEY,
            code TEXT,
            expiry TEXT
        )
    """)
    cursor.execute(
        "REPLACE INTO reset_codes (email, code, expiry) VALUES (?, ?, ?)",
        (email, code, expiry.strftime("%Y-%m-%d %H:%M:%S"))
    )
    conn.commit()
    conn.close()

    # Send email
    if send_reset_email(email, code):
        return jsonify({"message": "Reset code sent successfully"}), 200
    else:
        return jsonify({"error": "Failed to send reset email"}), 500


# -------------------- VERIFY RESET CODE --------------------
@forgor_bp.route("/verify_reset_code", methods=["POST"])
def verify_reset_code():
    data = request.get_json()
    email = data.get("email")
    code = data.get("code")
    if not all([email, code]):
        return jsonify({"error": "Email and code are required"}), 400

    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT code, expiry FROM reset_codes WHERE email = ?", (email,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return jsonify({"error": "No reset request found"}), 400

    stored_code, expiry = row
    expiry_time = datetime.datetime.strptime(expiry, "%Y-%m-%d %H:%M:%S")

    if datetime.datetime.now() > expiry_time:
        return jsonify({"error": "Code expired"}), 400

    if code != stored_code:
        return jsonify({"error": "Invalid code"}), 400

    return jsonify({"message": "Code verified successfully"}), 200


# -------------------- RESET PASSWORD --------------------
@forgor_bp.route("/reset_password", methods=["POST"])
def reset_password():
    data = request.get_json()
    email = data.get("email")
    new_password = data.get("new_password")
    if not all([email, new_password]):
        return jsonify({"error": "Email and new password are required"}), 400

    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    cursor.execute("UPDATE Users_Auth SET Users_Password = ? WHERE Users_Email = ?", (new_password, email))
    conn.commit()
    conn.close()

    return jsonify({"message": "Password reset successful"}), 200
