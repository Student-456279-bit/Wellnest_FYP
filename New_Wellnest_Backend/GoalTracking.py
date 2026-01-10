from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
import sqlite3

import os

goal_tracking_bp = Blueprint('goal_tracking', __name__)
DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "Wellnest_Database.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# Helper: Initialize daily goal row if not exists
def init_daily_goal(user_email):
    today_str = datetime.now().strftime("%Y-%m-%d")
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Check if exists
        cur.execute("SELECT 1 FROM Goal_Tracking WHERE user_email = ? AND date = ?", (user_email, today_str))
        exists = cur.fetchone()
        
        if not exists:
            # Create default row
            cur.execute("""
                INSERT INTO Goal_Tracking (user_email, date)
                VALUES (?, ?)
            """, (user_email, today_str))
            conn.commit()
            print(f"Initialized daily goal for {user_email} on {today_str}")
        
        conn.close()
    except Exception as e:
        print(f"Error initializing daily goal: {e}")

@goal_tracking_bp.route('/update', methods=['POST'])
def update_goal():
    try:
        data = request.get_json()
        user_email = data.get('user_email')
        goal_type = data.get('goal_type') # water, sleep, food, exercise, meditation
        date_str = data.get('date') # YYYY-MM-DD
        status = data.get('status') # boolean

        if not all([user_email, goal_type, date_str, status is not None]):
            return jsonify({"message": "Missing required fields"}), 400

        # Validate Date Window (Today or Yesterday Only)
        target_date = datetime.strptime(date_str, "%Y-%m-%d").date()
        today = datetime.now().date()
        
        # Allow update if target_date is today or yesterday
        # Logic: If today is 28th, allow 28th and 27th.
        # Deadline for 27th is 28th 23:59:59.
        if target_date < (today - timedelta(days=1)) or target_date > today:
             return jsonify({"message": "Goal update window expired."}), 400

        conn = get_db_connection()
        cur = conn.cursor()

        # Check if row exists and get its ID
        cur.execute("SELECT id FROM Goal_Tracking WHERE user_email = ? AND date = ?", (user_email, date_str))
        record = cur.fetchone()
        
        if not record:
            # If no record, create one first (should be rare if init_daily_goal is called on login)
            cur.execute("INSERT INTO Goal_Tracking (user_email, date) VALUES (?, ?)", (user_email, date_str))
            conn.commit()
            cur.execute("SELECT id FROM Goal_Tracking WHERE user_email = ? AND date = ?", (user_email, date_str))
            record = cur.fetchone()
            if not record: # Should not happen
                conn.close()
                return jsonify({"message": "Failed to create goal record"}), 500

        # Map goal_type to column names
        status_col = f"{goal_type}_completed"
        
        # Map goal_type to value columns
        value_col_map = {
            "food": "food_calories",
            "water": "water_ml",
            "sleep": "sleep_hours",
            "exercise": "exercise_minutes",
            "meditation": "meditation_minutes"
        }
        value_col = value_col_map.get(goal_type)

        update_query = f"UPDATE Goal_Tracking SET {status_col} = ?"
        params = [status]
        
        # If value is provided, update it too
        value = data.get('value')
        if value is not None and value_col:
            update_query += f", {value_col} = ?"
            params.append(value)
            
        update_query += " WHERE id = ?"
        params.append(record[0])

        cur.execute(update_query, tuple(params))
        conn.commit()
        conn.close()
        
        return jsonify({"message": "Goal updated successfully"}), 200

    except Exception as e:
        return jsonify({"message": "Error updating goal", "error": str(e)}), 500

@goal_tracking_bp.route('/history/<email>', methods=['GET'])
def get_history(email):
    try:
        # Default: Last 7 days? Or range?
        # User asked for "Weekly" chart starting Monday.
        # Frontend can pass ?start=YYYY-MM-DD&end=YYYY-MM-DD
        
        start_date_str = request.args.get('start')
        end_date_str = request.args.get('end')
        
        if not start_date_str or not end_date_str:
             # Fallback to last 7 days including today
            end_date = datetime.now().date()
            start_date = end_date - timedelta(days=6)
        else:
            start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
            end_date = datetime.strptime(end_date_str, "%Y-%m-%d").date()

        conn = get_db_connection()
        cur = conn.cursor()
        
        # Explicitly select all columns to ensure order and access to new value columns
        cur.execute("""
            SELECT 
                id, user_email, date, 
                water_completed, sleep_completed, food_completed, exercise_completed, meditation_completed,
                food_calories, water_ml, sleep_hours, exercise_minutes, meditation_minutes
            FROM Goal_Tracking 
            WHERE user_email = ? AND date >= ? AND date <= ?
            ORDER BY date ASC
        """, (email, start_date.strftime("%Y-%m-%d"), end_date.strftime("%Y-%m-%d")))
        
        rows = cur.fetchall()
        
        # Fetch targets for consistency
        targets = get_latest_plan_targets(conn, email)
        
        conn.close()
        
        # Convert to dict lookup
        history_map = {row['date']: dict(row) for row in rows}
        
        # Construct result ensuring all days in range are present
        result = []
        current = start_date
        while current <= end_date:
            d_str = current.strftime("%Y-%m-%d")
            if d_str in history_map:
                data = history_map[d_str]
                result.append({
                    "date": d_str,
                    "water_completed": bool(data['water_completed']),
                    "sleep_completed": bool(data['sleep_completed']),
                    "food_completed": bool(data['food_completed']),
                    "exercise_completed": bool(data['exercise_completed']),
                    "meditation_completed": bool(data['meditation_completed']),
                    "food_calories": data.get('food_calories'),
                    "water_ml": data.get('water_ml'),
                    "sleep_hours": data.get('sleep_hours'),
                    "exercise_minutes": data.get('exercise_minutes'),
                    "meditation_minutes": data.get('meditation_minutes'),
                    "recorded": True
                })
            else:
                result.append({
                    "date": d_str,
                    "water_completed": False,
                    "sleep_completed": False,
                    "food_completed": False,
                    "exercise_completed": False,
                    "meditation_completed": False,
                    "food_calories": None,
                    "water_ml": None,
                    "sleep_hours": None,
                    "exercise_minutes": None,
                    "meditation_minutes": None,
                    "recorded": False 
                })
            
            # Inject Targets from Plan
            # We want the targets to be available to the frontend to show "X / Target"
            # Since plans might change, ideally we track target at the time, but for MVP we use current plan.
            result[-1]['water_target_ml'] = targets.get('water_ml', 2000) # Default 2000
            result[-1]['calories_target'] = targets.get('calories', 2000)
            
            current += timedelta(days=1)
            
        return jsonify(result), 200

    except Exception as e:
        return jsonify({"message": "Error fetching history", "error": str(e)}), 500

def get_latest_plan_targets(conn, email):
    """Fetch user's latest plan and extract specific targets"""
    try:
        cur = conn.cursor()
        cur.execute("SELECT plan_data FROM GeneratedPlans WHERE user_email = ?", (email,))
        row = cur.fetchone()
        if not row:
            return {}
            
        import json
        plan = json.loads(row[0])
        
        targets = {}
        
        # Extract Water: "2.3 L" -> 2300
        w_str = plan.get('water', '')
        if 'L' in w_str:
            try:
                val = float(w_str.replace('L', '').strip())
                targets['water_ml'] = int(val * 1000)
            except:
                pass
        
        # Extract Calories
        food = plan.get('food', {})
        if 'target_calories' in food:
             targets['calories'] = food['target_calories']
             
        return targets
    except Exception as e:
        print(f"Error fetching plan targets: {e}")
        return {}
