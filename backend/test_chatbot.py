from chatbot.bot import MentalHealthBot

bot = MentalHealthBot()

def test_chat(user_msg, history):
    print(f"User: {user_msg}")
    response = bot.generate_response(user_msg, history)
    print(f"Bot:  {response}")
    return response

print("--- Test 1: Simple Breathing Context ---")
history = []
# 1. User expresses stress
msg1 = "I am feeling very stressed"
resp1 = test_chat(msg1, history)
history.append({'role': 'user', 'message': msg1})
history.append({'role': 'bot', 'message': resp1})

# 2. User says 'yes' (should trigger breathing exercise if bot suggested it)
if "breathing exercise" in resp1.lower():
    msg2 = "yes please"
    resp2 = test_chat(msg2, history)
else:
    print("(Bot didn't suggest breathing exercise, retrying logic manually)")
    # Force context for testing
    history[-1]['message'] = "Would you like to try a quick breathing exercise?"
    msg2 = "yes"
    resp2 = test_chat(msg2, history)

# Check if response contains "Inhale"
if "Inhale" in resp2 or "breath" in resp2.lower():
    print("✅ SUCCESS: Context awareness worked!")
else:
    print("❌ FAILED: Bot did not provide breathing guide.")
