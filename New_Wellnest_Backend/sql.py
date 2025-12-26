import sqlite3

# === CONFIGURE DATABASE PATH ===
DB_PATH = "./Wellnest_Database.db"  # <-- change this to your database filename

# Connect to database
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# Drop old Health_Profiles tables
cursor.execute("DROP TABLE IF EXISTS Health_Profiles;")
cursor.execute("DROP TABLE IF EXISTS Health_Profiles_New;")
print("Dropped old Health_Profiles and Health_Profiles_New tables (if existed).")

# Create new Health_Profiles table (only new fields)
cursor.execute("""CREATE TABLE IF NOT EXISTS Health_Profiles (
    Users_Email TEXT PRIMARY KEY NOT NULL,
    height REAL,
    weight REAL,
    bodyFat REAL,
    bmi REAL,
    activityLevel TEXT,
    injuries TEXT,
    medical TEXT,
    allergies TEXT,
    sleep REAL,
    workHours REAL,
    stress INTEGER,
    mainGoal TEXT,
    secondaryGoals TEXT,
    workoutMinutes INTEGER,
    workoutDays INTEGER,
    dietaryPreference TEXT,
    cuisinePreference TEXT,
    dislikedFoods TEXT,

    mealsPerDay INTEGER,
    FOREIGN KEY (Users_Email) REFERENCES Users_Auth(Users_Email) ON DELETE CASCADE)""");

# Create GeneratedPlans table
cursor.execute("""CREATE TABLE IF NOT EXISTS GeneratedPlans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_email TEXT UNIQUE NOT NULL,
    plan_data TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_email) REFERENCES Users_Auth(Users_Email) ON DELETE CASCADE
)""");

# Create User_Personalization table
cursor.execute("""CREATE TABLE IF NOT EXISTS User_Personalization (
    Users_Email TEXT PRIMARY KEY NOT NULL,
    medical_report_path TEXT,
    current_medications TEXT,
    mood_tracking_enabled INTEGER DEFAULT 0,
    notification_language TEXT DEFAULT 'English',
    sync_fitbit INTEGER DEFAULT 0,
    sync_google_fit INTEGER DEFAULT 0,
    sync_apple_health INTEGER DEFAULT 0,
    interaction_preference TEXT DEFAULT 'Both',
    ai_consent INTEGER DEFAULT 0,
    data_sharing_consent INTEGER DEFAULT 0,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Users_Email) REFERENCES Users_Auth(Users_Email) ON DELETE CASCADE
)""");

conn.commit()
conn.close()
print("Database tables created successfully: Health_Profiles, GeneratedPlans, and User_Personalization.")
