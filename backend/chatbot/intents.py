
def detect_intent(text: str) -> str:
    text = text.lower()

    rules = {
        "greeting": ["hi", "hello", "hey", "greetings", "good morning", "good evening"],
        "stress_high": ["stressed", "overwhelmed", "tired", "burnout", "exhausted", "pressure", "heavy"],
        "study_help": ["exam", "study", "assignment", "deadline", "test", "homework", "project"],
        "sleep_problem": ["sleep", "insomnia", "awake", "late night", "tired", "can't sleep"],
        "motivation": ["lazy", "unmotivated", "can't focus", "procrastinating", "stuck"],
        "venting": ["hate", "frustrated", "angry", "annoyed", "upset", "mad"],
        "gratitude": ["thanks", "thank you", "appreciate"]
    }

    import re
    # Sort by priority if needed, but dict order is preserved in modern python.
    # Current detected issue: "hi" matches "everything". We need word boundaries.

    for intent, keywords in rules.items():
        for k in keywords:
            # Escape keyword to safely use in regex
            pattern = r'\b' + re.escape(k) + r'\b'
            if re.search(pattern, text):
                return intent

    return "general"
