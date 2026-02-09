"""
Test the enhanced chatbot with empathy, humor, and personalization
"""
from chatbot.bot import MentalHealthBot

def test_empathy_and_personalization():
    """Test chatbot with user context"""
    bot = MentalHealthBot()
    
    print("=" * 80)
    print("TEST 1: User feeling overwhelmed (High stress)")
    print("=" * 80)
    
    context = {
        'name': 'Israah',
        'mood': 'anxious',
        'stress': 8,
        'goals': ['Exercise daily', 'Sleep 8 hours']
    }
    
    message = "I'm feeling overwhelmed with work"
    response = bot.generate_response(message, user_context=context)
    print(f"User: {message}")
    print(f"Bot: {response}\n")
    
    print("=" * 80)
    print("TEST 2: User can't sleep (Moderate stress)")
    print("=" * 80)
    
    context = {
        'name': 'Israah',
        'mood': 'tired',
        'stress': 6,
        'goals': []
    }
    
    message = "I can't sleep again"
    response = bot.generate_response(message, user_context=context)
    print(f"User: {message}")
    print(f"Bot: {response}\n")
    
    print("=" * 80)
    print("TEST 3: User feeling better (Low stress, positive mood)")
    print("=" * 80)
    
    context = {
        'name': 'Israah',
        'mood': 'okay',
        'stress': 3,
        'goals': ['Exercise daily']
    }
    
    message = "Feeling better today!"
    response = bot.generate_response(message, user_context=context)
    print(f"User: {message}")
    print(f"Bot: {response}\n")
    
    print("=" * 80)
    print("TEST 4: User greeting the bot (Neutral)")
    print("=" * 80)
    
    context = {
        'name': 'Israah',
        'mood': 'okay',
        'stress': 5,
        'goals': []
    }
    
    message = "Hey"
    response = bot.generate_response(message, user_context=context)
    print(f"User: {message}")
    print(f"Bot: {response}\n")
    
    print("=" * 80)
    print("TEST 5: User mentions coffee (Tired, high stress)")
    print("=" * 80)
    
    context = {
        'name': 'Israah',
        'mood': 'tired',
        'stress': 7,
        'goals': []
    }
    
    message = "I've had 3 coffees already and I'm still exhausted"
    response = bot.generate_response(message, user_context=context)
    print(f"User: {message}")
    print(f"Bot: {response}\n")
    
    print("=" * 80)
    print("TEST 6: User explicitly asks for jokes (Low stress, positive mood)")
    print("=" * 80)
    
    context = {
        'name': 'Israah',
        'mood': 'happy',
        'stress': 2,
        'goals': []
    }
    
    message = "I'm feeling fun, crack some jokes!"
    response = bot.generate_response(message, user_context=context)
    print(f"User: {message}")
    print(f"Bot: {response}\n")
    
    print("=" * 80)
    print("TEST 7: User asks for jokes but is stressed (Safety check)")
    print("=" * 80)
    
    context = {
        'name': 'Israah',
        'mood': 'anxious',
        'stress': 8,
        'goals': []
    }
    
    message = "Tell me a joke to cheer me up"
    response = bot.generate_response(message, user_context=context)
    print(f"User: {message}")
    print(f"Bot: {response}\n")
    
    print("=" * 80)
    print("TEST 8: User without name/context (Graceful degradation)")
    print("=" * 80)
    
    message = "I'm stressed"
    response = bot.generate_response(message)  # No context
    print(f"User: {message}")
    print(f"Bot: {response}\n")

if __name__ == "__main__":
    test_empathy_and_personalization()
