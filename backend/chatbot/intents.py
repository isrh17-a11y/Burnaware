
def detect_intent(text: str) -> str:
    text = text.lower()

    rules = {
        "greeting": ["hi", "hello", "hey", "greetings", "good morning", "good evening", "yo", "hiya"],
        "farewell": ["bye", "goodbye", "see you", "cya", "night", "good night"],
        "agreement": ["yes", "yeah", "yep", "sure", "okay", "ok", "please", "do it"],
        "disagreement": ["no", "nope", "nah", "not really", "don't"],
        "stress_high": ["stressed", "overwhelmed", "tired", "burnout", "exhausted", "pressure", "heavy", "anxious", "panic"],
        "study_help": ["exam", "study", "assignment", "deadline", "test", "homework", "project"],
        "sleep_problem": ["sleep", "insomnia", "awake", "late night", "tired", "can't sleep"],
        "motivation": ["lazy", "unmotivated", "can't focus", "procrastinating", "stuck", "bored"],
        "venting": ["hate", "frustrated", "angry", "annoyed", "upset", "mad", "sad", "cry"],
        "gratitude": ["thanks", "thank you", "appreciate", "cool", "nice"]
    }

    import re
    
    # Check for exact matches first for short words
    if text in ["no", "nah", "nope"]:
        return "disagreement"
    if text in ["yes", "yeah", "yep", "ok", "okay"]:
        return "agreement"

    for intent, keywords in rules.items():
        for k in keywords:
            # Escape keyword to safely use in regex
            # Word boundary check to avoid partial matches (e.g. "hell" in "hello")
            pattern = r'\b' + re.escape(k) + r'\b'
            if re.search(pattern, text):
                return intent

    return "general"
