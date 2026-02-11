import random

TEMPLATES = {

    "stress_high": [
        "Hey {name}, that sounds really heavy. I can see your stress is around {stress}/10.",
        "It feels like today’s been overwhelming for you, {name}.",
        "That’s a lot to carry right now. I’m glad you told me."
    ],

    "study_help": [
        "Exams can pile up fast. Let’s make this manageable.",
        "Deadlines can feel scary, but we’ll tackle them one step at a time.",
        "Study stress is real — but you don’t have to do everything at once."
    ],

    "sleep_problem": [
        "Sleep troubles can really mess with your mood.",
        "Your mind probably hasn’t slowed down yet.",
    ],

    "motivation": [
        "It happens to the best of us. Let's find a small spark.",
        "Sometimes starting is the hardest part.",
    ],

    "venting": [
        "I hear you. It's okay to let it out.",
        "That sounds incredibly frustrating.",
    ],
    
    "gratitude": [
        "You're welcome, {name}! 🌿",
        "Happy to help!",
    ],

    "general": [
        "I’m here with you.",
        "Tell me what’s on your mind.",
    ]
}


CLOSERS = [
    "Want to try this together?",
    "How are you feeling now?",
    "One small step is enough today 🌿",
    "I’m here if you want to talk more."
]


def pick_template(intent):
    options = TEMPLATES.get(intent, TEMPLATES["general"])
    return random.choice(options)


def pick_closer():
    return random.choice(CLOSERS)
