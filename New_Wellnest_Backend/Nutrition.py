import csv
import os
from flask import Blueprint, jsonify

nutrition_bp = Blueprint('nutrition', __name__)

# Path to the CSV file
CSV_FILE_PATH = os.path.join(os.path.dirname(__file__), 'Nutrition_DS.csv')

def load_food_items():
    food_items = []
    try:
        with open(CSV_FILE_PATH, mode='r', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                # Convert numeric values to appropriate types
                try:
                    item = {
                        'dish': row['dish'],
                        'calories_kcal': int(row['calories_kcal']),
                        'protein_g': float(row['protein_g']),
                        'carbs_g': float(row['carbs_g']),
                        'fat_g': float(row['fat_g']),
                        'pakistani_cuisine': row['pakistani_cuisine'].lower() == 'true',
                        'is_vegetarian': row['is_vegetarian'].lower() == 'true',
                        'macro_quality': row['macro_quality']
                    }
                    food_items.append(item)
                except ValueError:
                    continue # Skip rows with invalid data
    except FileNotFoundError:
        print(f"Error: {CSV_FILE_PATH} not found.")
        return []
    return food_items

@nutrition_bp.route('/food-items', methods=['GET'])
def get_food_items():
    items = load_food_items()
    return jsonify(items)
