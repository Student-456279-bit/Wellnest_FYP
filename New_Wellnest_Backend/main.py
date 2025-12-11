from flask import Flask
from flask_cors import CORS
from AuthUsers import auth_bp
from Forgor import forgor_bp
from Forms import health_bp  # This is your updated health backend

app = Flask(__name__)

# Enable CORS so frontend at port 8080 can access backend at port 5000
CORS(app, resources={r"/*": {"origins": "http://localhost:8080"}}, supports_credentials=True)

# Register your blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(forgor_bp, url_prefix='/api/forgor')
app.register_blueprint(health_bp, url_prefix='/api/profile')

@app.route('/')
def home():
    return "Flask backend is running."

if __name__ == '__main__':
    app.run(debug=True, port=5000)
