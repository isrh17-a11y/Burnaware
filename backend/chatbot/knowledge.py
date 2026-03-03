import random

TIPS = {
    "stress_high": [
        "Take 5 slow breaths — inhale 4s, exhale 6s.",
        "Step away for 2 minutes and stretch your shoulders.",
        "Write down just ONE thing to finish next.",
        "Drink a glass of water slowly.",
        "Close your eyes and count to 10."
    ],

    "study_help": [
        "Try a 25-minute Pomodoro session.",
        "Start with the easiest task to build momentum.",
        "Make a tiny checklist for today only.",
        "Clear your desk of everything except what you need right now."
    ],

    "sleep_problem": [
        "Dim lights and avoid screens 30 minutes before bed.",
        "Try deep breathing or soft music.",
        "Read a physical book for 10 minutes.",
        "Visualize a peaceful place."
    ],

    "motivation": [
        "Start for just 5 minutes — no pressure to continue.",
        "Change your study spot for fresh energy.",
        "Put on your favorite focus playlist.",
        "Reward yourself with a small treat after 10 minutes of work."
    ],
    
    "venting": [
        "Take a deep breath and let the tension go.",
        "Maybe write down exactly what's bothering you to get it out of your head.",
        "Go for a short walk if you can.",
        "Scream into a pillow if you need to!"
    ],
    
    "gratitude": [
        "Keep that positive energy going!",
        "Remember this feeling."
    ]
    # No tips for greeting, farewell, agreement, disagreement, low_stress by default
}


def get_tip(intent):
    # Default to None if no tips available for intent
    tips = TIPS.get(intent)
    if tips:
        return random.choice(tips)
    return None
