from flask import Flask
from flask_cors import CORS
from AuthUsers import auth_bp
from Forgor import forgor_bp
from Forms import health_bp  # This is your updated health backend
from Nutrition import nutrition_bp
from Chatbot import chatbot_bp

app = Flask(__name__)

# Configure file uploads
app.config['UPLOAD_FOLDER'] = './uploads/medical_reports'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Enable CORS so frontend at port 8080 can access backend at port 5000
CORS(app, resources={r"/*": {"origins": ["http://localhost:8080", "http://localhost:8081"]}}, supports_credentials=True)

# Register your blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(forgor_bp, url_prefix='/api/forgor')
app.register_blueprint(health_bp, url_prefix='/api/profile')
app.register_blueprint(nutrition_bp, url_prefix='/api/nutrition')
app.register_blueprint(chatbot_bp, url_prefix='/api/chatbot')

from WellnessPlan import wellness_bp
app.register_blueprint(wellness_bp, url_prefix='/api/wellness')

@app.route('/')
def home():
    return "Flask backend is running."

if __name__ == '__main__':
    app.run(debug=True, port=5000)
