from flask import Blueprint, request, jsonify
import requests
import json

chatbot_bp = Blueprint('chatbot', __name__)

# -----------------------------
# CONFIGURATION
# -----------------------------
OLLAMA_API_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "gpt-oss:20b-cloud"
DOMAIN = "Holistic Wellness and Medical"
APP_KNOWLEDGE_MAP = """
WELLNEST APP STRUCTURE & FEATURES:
1. **Dashboard** (`/dashboard`): The central hub.
   - Features: "Check in with yourself" (Mood tracker -> Redirects to Journal), Interactive Cards for quick navigation (Wellness Goals, Nutrition, Analytics, Journal, Meditation).
2. **Nutrition** (`/nutrition`):
   - Features: Meal tracking, Food Search (simulated database), Recommended Meals (Breakfast, Lunch, Dinner, Snack).
   - Metrics: Tracks Calories, Protein, Carbs, Fats.
3. **Journal** (`/journal`):
   - Features: "Write a New Entry", View past entries grid, mood-based filtering.
   - Flow: Daily Prompts help users start writing.
4. **Meditation** (`/meditation`):
   - Core Feature: 4 Theistic Sessions based on spiritual practices.
     - 1. **The Prayer of Stillness** (5 min): Focus on "Muraqaba" (Observation).
     - 2. **The Body of Gratitude** (10 min): Focus on "Shukr" (Thanksgiving scan).
     - 3. **Intercessory Prayer** (15 min): Focus on "Dua" (Prayer for others).
     - 4. **Remembrance & Contemplation** (30 min): Focus on "Dhikr" (Deep focus).
   - "Recommended Session": Daily 15-minute goal.
5. **Goals** (`/goals`):
   - Features: View active wellness goals, "Regenerate Plan" button to refresh targets, Priority labeling (High/Medium).
6. **Chatbot** (`/wellnest-ai-chatbot` & Global Widget):
   - YOU are located here. There is also a floating widget on every page for quick help.
"""

DOMAIN_PROMPT = f"""You are 'WellNest AI', the intelligent assistant for the Wellnest Web App. \
Your domain is {DOMAIN} AND expert knowledge of this specific application. \

{APP_KNOWLEDGE_MAP} \

STRICT DOMAIN ENFORCEMENT RULES: \
1. You provide assistance ONLY related to Holistic Wellness, Mental Health, Physical Fitness, Nutrition, and the features of the Wellnest App. \
2. If a user asks you to write code (e.g., Python, JavaScript), solve math problems, or discuss general topics unrelated to health/wellness, you MUST REFUSE. \
   - Example Refusal: "I apologize, but I can only assist with topics related to health, wellness, and using the Wellnest app." \
3. EXCEPTION: You may calculate health metrics (like BMI, calories) if asked. \

IMPORTANT FORMATTING RULES: \
1. **Always** use Markdown for structure. \
2. Use **Bold** for important concepts and keywords. \
3. Use ## Headings to break up topics. \
4. Use - Bullet points for lists (do not use numbered lists unless for steps). \
5. KEEP IT CONCISE. Use short paragraphs. \
6. Avoid walls of text. \

LANGUAGE SUPPORT: \
- You support **English** and **Roman Urdu** (Urdu written in English script). \
- **STRICT RULE**: NEVER output Urdu script (Arabic characters). ALWAYS use Roman Urdu if speaking Urdu. \
- If the user speaks in English, reply in English. \
- If the user speaks in Roman Urdu (e.g., 'kaise ho'), reply in **Roman Urdu**. \
- If the user speaks in Urdu Script (e.g., 'آپ کیسے ہیں'), TRANSLATE your thought to **Roman Urdu** and reply in Roman Urdu. \
- If the user mixes both, you can mix them naturally (English + Roman Urdu). \
"""
def get_ollama_response(prompt, chat_history_str):
    """Send prompt + chat history to Ollama API and get response."""
    # Construct the full prompt context
    full_prompt = f"{DOMAIN_PROMPT}\n\nChat History:\n{chat_history_str}\n\nUser: {prompt}\nAI:"
    
    data = {
        "model": MODEL_NAME,
        "prompt": full_prompt,
        "stream": False
    }
    
    try:
        response = requests.post(OLLAMA_API_URL, json=data)
        if response.status_code == 200:
            raw_text = response.text.strip()
            try:
                result = json.loads(raw_text)
                return result.get("response", "").strip()
            except json.JSONDecodeError:
                # Handle potentially malformed JSON from Ollama
                lines = raw_text.splitlines()
                for line in reversed(lines):
                    try:
                        result = json.loads(line)
                        if "response" in result:
                            return result["response"].strip()
                    except json.JSONDecodeError:
                        continue
                return "Error decoding AI response."
        else:
            return f"[Error] Status: {response.status_code}"
    except Exception as e:
        return f"[Error connecting to Ollama] {str(e)}"

@chatbot_bp.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_input = data.get('prompt', '').strip()
    history = data.get('history', []) 

    if not user_input:
        return jsonify({"error": "No input provided"}), 400

    # Format history for the prompt
    # history is expected to be a list of dicts: [{'role': 'user', 'text': '...'}, {'role': 'bot', 'text': '...'}]
    formatted_history = ""
    for msg in history:
        role_label = "You" if msg['role'] == 'user' else "AI"
        formatted_history += f"{role_label}: {msg['text']}\n"

    ai_response = get_ollama_response(user_input, formatted_history)
    
    # Simple formatting cleanup if needed (removing weird markers usually not needed but kept from user's script idea)
    # formatted_response = ai_response.replace("*", "").replace("#", "").replace("_", "")
    # REMOVED STRIPPING to preserve Markdown

    return jsonify({"response": ai_response})
