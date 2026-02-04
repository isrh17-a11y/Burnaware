import random
from typing import List, Dict, Optional

class MentalHealthBot:
    """Mental health support chatbot for burnout prevention"""
    
    def __init__(self):
        self.responses = {
            "greeting": [
                "Hello! I'm here to support you. How are you feeling today?",
                "Hi there! I'm your mental health companion. What's on your mind?",
                "Welcome! I'm here to listen and help. How can I support you today?"
            ],
            "stress": [
                "I understand you're feeling stressed. Have you tried taking short breaks throughout your day?",
                "Stress can be overwhelming. Would you like to try a quick breathing exercise?",
                "It's important to acknowledge stress. What specific situations are causing you stress?"
            ],
            "overwhelmed": [
                "Feeling overwhelmed is completely valid. Let's break things down into smaller, manageable steps.",
                "When we're overwhelmed, it helps to prioritize. What's the most important thing right now?",
                "I hear you. Sometimes we need to step back and reassess. What can you delegate or postpone?"
            ],
            "tired": [
                "Fatigue can be a sign of burnout. Are you getting enough quality sleep?",
                "Feeling tired often? It might help to review your sleep schedule and daily energy levels.",
                "Rest is crucial. Have you considered taking a proper break or vacation?"
            ],
            "anxious": [
                "Anxiety can handle tough to handle. Try the 5-4-3-2-1 grounding technique: Name 5 things you see, 4 you feel...",
                "Take a slow deep breath. Inhale for 4 seconds, hold for 7, exhale for 8.",
                "It's okay to feel anxious. Focus on the present moment. You are safe right now."
            ],
            "sad": [
                "I'm sorry you're feeling down. Be gentle with yourself today.",
                "It's okay to feel sad. Sometimes a good cry or talking to a friend helps release the emotion.",
                "Sending you virtual support. Remember that emotions are temporary waves."
            ],
            "lonely": [
                "Loneliness is a heavy feeling. Is there anyone you can reach out to, even just for a quick text?",
                "Connection is important. Maybe join a community group or call a loved one?",
                "You are not alone in this feeling. I'm here to listen."
            ],
            "burnout": [
                "Burnout is serious. It's vital to disconnect from work. Can you take time off?",
                "Your well-being matters more than productivity. What is one work boundary you can set today?",
                "Recovery takes time. Please prioritize rest and seek professional support if needed."
            ],
            "positive": [
                "That's wonderful to hear! What's contributing to your positive feelings?",
                "I'm glad you're feeling good! Keep up those healthy habits.",
                "Great! Maintaining this positive state is important. What's working well for you?"
            ],
            "default": [
                "I'm here to listen. Can you tell me more about what you're experiencing?",
                "Thank you for sharing. How long have you been feeling this way?",
                "I understand. What do you think might help you feel better?",
                "I'm listening. Please go on."
            ],
            "breathing_guide": [
                "Great! Let's start. Inhale deeply for 4 seconds... (1, 2, 3, 4)\nHold for 7 seconds... (1...7)\nExhale slowly for 8 seconds. How do you feel now?",
                "Okay, find a comfortable seat. Close your eyes. Take a deep breath in... and let it out slowly. Repeat this 3 times.",
            ],
            "offer_help_generic": [
                "No problem at all. Is there something else you'd like to talk about?",
                "That's okay. We can try something else whenever you're ready. How else can I support you?",
            ]
        }
        
        self.keywords = {
            "greeting": ["hello", "hi", "hey", "good morning", "good afternoon"],
            "stress": ["stress", "stressed", "pressure", "tension"],
            "anxious": ["anxious", "anxiety", "panic", "worried", "nervous"],
            "overwhelmed": ["overwhelmed", "too much", "can't handle", "drowning", "buried"],
            "tired": ["tired", "exhausted", "fatigue", "drained", "sleepy", "no energy"],
            "sad": ["sad", "unhappy", "cry", "crying", "depressed", "down", "blue"],
            "lonely": ["lonely", "alone", "isolation", "isolated"],
            "burnout": ["burnout", "burned out", "hate work", "quit"],
            "positive": ["good", "great", "happy", "better", "well", "fine", "awesome"]
        }
    
    def generate_response(self, user_message: str, history: List[Dict] = None) -> str:
        """
        Generate a response based on user message and conversation history
        history format: [{'role': 'user'/'bot', 'message': '...'}]
        """
        message_lower = user_message.lower()
        
        # 1. Check for context (e.g., answering a previous question)
        if history and len(history) > 0:
            last_bot_message = history[-1]['message'] if history[-1]['role'] == 'bot' else ""
            context_intent = self._detect_context_intent(message_lower, last_bot_message)
            if context_intent:
                return self._get_response_for_intent(context_intent)
        
        # 2. Detect intent based on keywords (default behavior)
        intent = self._detect_intent(message_lower)
        return self._get_response_for_intent(intent)

    def _get_response_for_intent(self, intent: str) -> str:
        """Helper to get random response for an intent"""
        response_list = self.responses.get(intent, self.responses["default"])
        return random.choice(response_list)
    
    def _detect_context_intent(self, message: str, last_bot_message: str) -> Optional[str]:
        """Detect intent based on what the bot last said"""
        # Example: Bot suggested an exercise -> User says "yes"
        if "breathing exercise" in last_bot_message.lower():
            if any(word in message for word in ["yes", "sure", "okay", "cancel", "try"]):
                return "breathing_guide"
            if any(word in message for word in ["no", "nah", "pass"]):
                return "offer_help_generic"
                
        return None
    
    def _detect_intent(self, message: str) -> str:
        """Detect user intent from message"""
        import re
        for intent, keywords in self.keywords.items():
            for keyword in keywords:
                # Use regex to match whole words/phrases only
                pattern = r'\b' + re.escape(keyword) + r'\b'
                if re.search(pattern, message):
                    return intent
        return "default"
    
    def analyze_sentiment(self, message: str) -> str:
        """
        Analyze sentiment of user message
        Returns: 'positive', 'negative', or 'neutral'
        """
        message_lower = message.lower()
        
        positive_words = ["good", "great", "happy", "better", "well", "fine", "excellent", "wonderful"]
        negative_words = ["bad", "sad", "stressed", "anxious", "overwhelmed", "tired", "exhausted", "depressed"]
        
        positive_count = sum(1 for word in positive_words if word in message_lower)
        negative_count = sum(1 for word in negative_words if word in message_lower)
        
        if positive_count > negative_count:
            return "positive"
        elif negative_count > positive_count:
            return "negative"
        else:
            return "neutral"
    
    def get_coping_strategies(self) -> List[str]:
        """Get list of coping strategies"""
        return [
            "Practice deep breathing exercises for 5 minutes",
            "Take a 10-minute walk outside",
            "Write down three things you're grateful for",
            "Reach out to a friend or family member",
            "Listen to calming music",
            "Try progressive muscle relaxation",
            "Set boundaries and learn to say no",
            "Engage in a hobby you enjoy"
        ]
