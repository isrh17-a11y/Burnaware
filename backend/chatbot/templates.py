import random

TEMPLATES = {

    "greeting": [
        "Hey {name}! How are you feeling right now?",
        "Hi {name}, I'm here. What's on your mind?",
        "Hello! How’s your day going so far?",
        "Hey there. Ready to chat if you are.",
    ],

    "farewell": [
        "Take care, {name}. I'm here whenever you need me.",
        "Bye for now! Remember to be kind to yourself.",
        "See you later! Hope you have a restful time.",
        "Goodnight! Rest well."
    ],
    
    "agreement": [
        "Glad we're on the same page.",
        "Okay, let's do that.",
        "Sounds like a plan.",
        "Great.",
        "Alright."
    ],
    
    "disagreement": [
        "That's okay.",
        "No problem.",
        "I understand.",
        "We can skip that.",
        "Let's try something else then."
    ],

    "stress_high": [
        "Hey {name}, that sounds really heavy. I can see your stress is around {stress}/10.",
        "It feels like today’s been overwhelming for you, {name}.",
        "That’s a lot to carry right now. I’m glad you told me.",
        "I hear you. It sounds like a lot is going on.",
        "Take a moment. You don't have to carry it all alone."
    ],

    "low_stress": [
        "That's great to hear!",
        "I'm glad you're feeling okay.",
        "That's wonderful.",
        "Good to hear you're doing well."
    ],

    "study_help": [
        "Exams can pile up fast. Let’s make this manageable.",
        "Deadlines can feel scary, but we’ll tackle them one step at a time.",
        "Study stress is real — but you don’t have to do everything at once.",
        "Focus is hard when there's so much to do."
    ],

    "sleep_problem": [
        "Sleep troubles can really mess with your mood.",
        "Your mind probably hasn’t slowed down yet.",
        "It's hard when your brain won't switch off.",
        "Rest is elusive sometimes, but we can try to find it."
    ],

    "motivation": [
        "It happens to the best of us. Let's find a small spark.",
        "Sometimes starting is the hardest part.",
        "Motivation comes and goes. Discipline stays.",
        "Small steps are still steps."
    ],

    "venting": [
        "I hear you. It's okay to let it out.",
        "That sounds incredibly frustrating.",
        "It's safe to vent here.",
        "Let it all out. Better out than in."
    ],
    
    "gratitude": [
        "You're welcome, {name}! 🌿",
        "Happy to help!",
        "Anytime.",
        "You got this."
    ],

    "general": [
        "I’m here with you.",
        "Tell me what’s on your mind.",
        "I'm listening.",
        "Go on, I'm here."
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
