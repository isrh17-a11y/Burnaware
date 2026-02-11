from .intents import detect_intent
from .templates import pick_template, pick_closer
from .knowledge import get_tip
from .memory import save_message, get_history


class BurnAwareChatbot:

    def generate_reply(self, user_id: str, user_data: dict, message: str):

        name = user_data.get("name", "friend")
        mood = user_data.get("mood", "okay")
        stress = user_data.get("stress", 5)

        # 1. intent
        intent = detect_intent(message)

        # 2. memory (unused in logic but good for context if needed later)
        # history = get_history(user_id)

        # 3. template + tip
        empathy_line = pick_template(intent)
        tip = get_tip(intent)
        closer = pick_closer()

        # 4. personalize
        # Safely format empathy line
        try:
             # Only format if placeholders exist, or use safe formatting
            formatted_empathy = empathy_line.format(name=name, stress=stress)
        except KeyError:
            formatted_empathy = empathy_line
            
        reply = f"""
{formatted_empathy}

Since you're feeling {mood}, here's something small you could try:
👉 {tip}

{closer}
"""

        # 5. save memory
        save_message(user_id, message, reply.strip())

        return reply.strip()
