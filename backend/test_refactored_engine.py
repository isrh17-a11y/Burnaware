from chatbot.engine import BurnAwareChatbot
from chatbot.intents import detect_intent
import json

def test_engine():
    bot = BurnAwareChatbot()
    
    # Test cases
    scenarios = [
        {
            "id": "1",
            "message": "I'm so stressed and overwhelmed with exams",
            "user": {"name": "Israah", "mood": "anxious", "stress": 8}
        },
        {
            "id": "2",
            "message": "I can't sleep at all",
            "user": {"name": "Israah", "mood": "tired", "stress": 6}
        },
        {
            "id": "3",
            "message": "Thanks for your help",
            "user": {"name": "Israah", "mood": "happy", "stress": 3}
        },
        {
            "id": "4",
            "message": "I hate everything right now",
            "user": {"name": "Israah", "mood": "angry", "stress": 7}
        }
    ]
    
    print("="*60)
    print("TESTING NEW CHATBOT ENGINE")
    print("="*60)
    
    for sc in scenarios:
        print(f"\nUser Message: {sc['message']}")
        print(f"Context: {json.dumps(sc['user'])}")
        
        # Debug intent
        intent = detect_intent(sc['message'])
        print(f"DEBUG INTENT: {intent}")
        
        reply = bot.generate_reply(
            user_id=sc["id"],
            user_data=sc["user"],
            message=sc["message"]
        )
        
        print("-" * 20)
        print("Bot Reply:")
        print(reply)
        print("="*60)

if __name__ == "__main__":
    test_engine()
