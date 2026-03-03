import os
import logging

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass  # On Render, env vars are set via dashboard

from google import genai
from .memory import save_message

logger = logging.getLogger(__name__)

_api_key = os.getenv("GEMINI_API_KEY")
if not _api_key:
    logger.error("GEMINI_API_KEY is not set! Chatbot will use fallback responses.")

_client = genai.Client(api_key=_api_key)


class BurnAwareChatbot:

    def generate_reply(self, user_id: str, user_data: dict, message: str) -> str:
        name = user_data.get("name", "friend")
        mood = user_data.get("mood", "okay")
        stress = user_data.get("stress", 5)

        system_prompt = f"""You are Ember, a warm and empathetic wellness assistant inside an app called BurnAware.
You are talking to {name}.
Their current mood is: {mood}.
Their stress level is: {stress} out of 10.

Your job is to:
- Respond with empathy and warmth, not clinical advice.
- Keep responses short: 2-3 sentences max.
- Offer ONE gentle, practical suggestion when appropriate.
- Match the energy — if they're venting, validate first. If they're doing well, celebrate with them.
- Never use bullet points or headers. Sound like a caring friend, not a therapist.
- If stress is above 7, prioritize emotional support over tips.
- Do not repeat the user's name too often."""

        try:
            response = _client.models.generate_content(
                model="gemini-2.0-flash",
                contents=f"{system_prompt}\n\nUser: {message}\nEmber:"
            )
            reply = response.text.strip()
        except Exception as e:
            logger.error(f"Gemini API call failed: {type(e).__name__}: {e}")
            reply = "I'm here with you. It sounds like a lot is going on — take a breath, one thing at a time."

        # Save to memory
        save_message(user_id, message, reply)
        return reply
