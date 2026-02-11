import random

TIPS = {
    "stress_high": [
        "Take 5 slow breaths — inhale 4s, exhale 6s.",
        "Step away for 2 minutes and stretch your shoulders.",
        "Write down just ONE thing to finish next."
    ],

    "study_help": [
        "Try a 25-minute Pomodoro session.",
        "Start with the easiest task to build momentum.",
        "Make a tiny checklist for today only."
    ],

    "sleep_problem": [
        "Dim lights and avoid screens 30 minutes before bed.",
        "Try deep breathing or soft music.",
    ],

    "motivation": [
        "Start for just 5 minutes — no pressure to continue.",
        "Change your study spot for fresh energy.",
    ],
    
    "venting": [
        "Take a deep breath and let the tension go.",
        "Maybe write down exactly what's bothering you to get it out of your head.",
    ],
    
    "gratitude": [
        "Keep that positive energy going!",
        "Remember this feeling."
    ]
}


def get_tip(intent):
    tips = TIPS.get(intent, ["Take things slowly."])
    return random.choice(tips)
