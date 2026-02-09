import random
from typing import List, Dict, Optional

class MentalHealthBot:
    """Mental health support chatbot for burnout prevention - warm, empathetic companion"""
    
    def __init__(self):
        # Empathy bank - warm, supportive phrases
        self.empathy_bank = {
            "stressed": ["I hear you.", "That sounds exhausting.", "That's a lot to carry.", "I can feel the weight of that."],
            "overwhelmed": ["I hear you.", "That's overwhelming.", "That sounds like a lot.", "I'm here with you."],
            "tired": ["That sounds draining.", "Rest is so important.", "Your body is telling you something.", "I hear you."],
            "anxious": ["I'm here with you.", "That must feel heavy.", "You're not alone in this.", "I hear you."],
            "sad": ["I'm so sorry you're feeling this way.", "That's really hard.", "I'm here with you.", "Sending care your way. 💙"],
            "positive": ["That's wonderful!", "I love hearing that!", "That's amazing!", "So glad to hear it!"],
            "general": ["I hear you.", "Thank you for sharing.", "I'm listening.", "I'm here for you."]
        }
        
        # Humor bank - gentle, relatable jokes for appropriate moments
        self.humor_bank = {
            "greeting": [
                "Coffee first, then we talk? ☕",
                "Ready to tackle today... or at least survive it! 😅",
                "Another day of being a responsible adult—we've got this! 🌟"
            ],
            "stress_light": [
                "Adulting is hard—nobody warned us properly! 😅",
                "Deep breaths... and maybe some chocolate? 🍫",
                "Remember: you're doing better than you think you are!"
            ],
            "positive": [
                "Look at you go! 🎉",
                "Winning at life today! ✨",
                "Keep this energy—bottle it if you can! 😄"
            ],
            "jokes_request": [
                "Why did the burnout prevention app cross the road? To get to the self-care side! 😄",
                "You know what's funny? We spend our whole lives saying 'I'll rest when I'm dead'... and then wonder why we're exhausted! 😅",
                "My therapist says I have trouble delegating tasks. So I told them to tell someone else about it. 😂",
                "Fun fact: Coffee doesn't actually give you energy—it just lets you borrow it from tomorrow. (And tomorrow's getting annoyed! ☕)",
                "Why don't scientists trust atoms? Because they make up everything! (Just like our stress sometimes 😉)"
            ],
            "coffee": [
                "Coffee is basically a food group at this point, right? ☕",
                "Ah yes, the elixir of productivity! ☕✨",
                "Coffee: because adulting is hard! ☕"
            ]
        }
        
        # Simple suggestions by intent
        self.suggestions = {
            "stress": [
                "Try taking 5 deep breaths—in for 4, out for 6.",
                "How about a quick 5-minute walk to clear your head?",
                "Maybe write down the top 3 priorities and let the rest wait.",
                "Can you step away for just 10 minutes? Even a short break helps."
            ],
            "overwhelmed": [
                "What's one small thing you could take off your plate today?",
                "Let's focus on just the next hour—what's most important right now?",
                "Could you delegate or postpone one task?",
                "Try the 2-minute rule: if it takes less than 2 minutes, do it now."
            ],
            "tired": [
                "Could you steal a 15-minute power nap?",
                "Try putting your phone away 30 minutes before bed tonight.",
                "How about a gentle stretch to wake up your body?",
                "Hydrate! Sometimes tiredness is just thirst in disguise. 💧"
            ],
            "anxious": [
                "Try the 5-4-3-2-1 technique: name 5 things you see, 4 you hear, 3 you can touch.",
                "Box breathing: in for 4, hold for 4, out for 4, hold for 4.",
                "Put your hand on your heart and take 3 slow breaths.",
                "Write down what's worrying you—sometimes seeing it helps."
            ],
            "sad": [
                "Be extra gentle with yourself today—maybe do something small you enjoy.",
                "Reach out to someone you trust, even just to say hi.",
                "Let yourself feel it—emotions are visitors, not permanent residents.",
                "Try moving your body a little—even a short walk can shift things."
            ],
            "positive": [
                "Keep the momentum going with something fun today!",
                "Celebrate this—you deserve it! 🌿",
                "Lock in this feeling—what's working well for you?",
                "Share this good energy with someone you care about!"
            ]
        }
        
        # Gentle follow-ups
        self.followups = {
            "question": [
                "How does that sound?",
                "Want to try it together?",
                "What do you think?",
                "Does that feel doable?",
                "How's that sitting with you?"
            ],
            "encouragement": [
                "I'm here with you. 🌿",
                "One small step is enough today. 🌿",
                "You've got this. 💙",
                "I believe in you.",
                "You're doing better than you think."
            ],
            "exploration": [
                "What's on your mind?",
                "Tell me more about that?",
                "What's one thing that might help?",
                "How are you really feeling?",
                "What would help most right now?"
            ]
        }
        
        # Keywords for intent detection
        self.keywords = {
            "greeting": ["hello", "hi", "hey", "good morning", "good afternoon", "sup", "what's up"],
            "stress": ["stress", "stressed", "pressure", "tension", "overwhelm"],
            "anxious": ["anxious", "anxiety", "panic", "worried", "nervous", "scared"],
            "overwhelmed": ["overwhelmed", "too much", "can't handle", "drowning", "buried", "swamped"],
            "tired": ["tired", "exhausted", "fatigue", "drained", "sleepy", "no energy", "can't sleep", "insomnia"],
            "sad": ["sad", "unhappy", "cry", "crying", "depressed", "down", "blue", "lonely", "alone"],
            "burnout": ["burnout", "burned out", "hate work", "quit", "give up"],
            "positive": ["good", "great", "happy", "better", "well", "fine", "awesome", "amazing", "excited"],
            "joke_request": ["joke", "funny", "laugh", "humor", "fun", "crack", "entertain", "cheer me up"],
            "coffee": ["coffee", "caffeine", "espresso", "latte"]
        }
    
    def generate_response(self, user_message: str, user_context: Optional[Dict] = None, history: List[Dict] = None) -> str:
        """
        Generate a warm, personalized response
        user_context: {name, mood, stress, intent, goals, recent_history}
        history: [{'role': 'user'/'bot', 'message': '...'}]
        """
        message_lower = user_message.lower()
        
        # Detect intent
        intent = self._detect_intent(message_lower)
        
        # Initialize context with defaults
        context = user_context or {}
        name = context.get('name', '')
        mood = context.get('mood', 'neutral')
        stress = context.get('stress', 5)
        goals = context.get('goals', [])
        
        # Check if user explicitly requested a joke
        if intent == "joke_request":
            return self._handle_joke_request(name, mood, stress)
        
        # Build personalized response
        return self._create_personalized_response(intent, name, mood, stress, goals, message_lower)
    
    def _handle_joke_request(self, name: str, mood: str, stress: int) -> str:
        """Handle explicit joke requests with safety check"""
        # Safety check: don't joke if user is in distress
        if stress > 7 or mood in ["sad", "anxious", "overwhelmed"]:
            empathy = "I appreciate that you're trying to lighten the mood"
            name_part = f", {name}" if name else ""
            return f"{empathy}{name_part}. 💙 I'd love to make you laugh, but I also want to check in—are you doing okay? Sometimes we joke when things feel heavy. I'm here if you need to talk."
        
        # Deliver a joke!
        joke = random.choice(self.humor_bank["jokes_request"])
        name_part = f", {name}" if name else ""
        opener = f"Love the energy{name_part}! 🎉 " if stress < 4 else f"Alright{name_part}! 😅 "
        followup = random.choice([
            "What's got you in such a great mood?",
            "Keep that vibe going! What fun thing are you up to?",
            "Laughter is amazing medicine. What's making you feel good today?"
        ])
        
        return f"{opener}{joke} But seriously, I'm glad you're feeling light today. {followup}"
    
    def _create_personalized_response(self, intent: str, name: str, mood: str, stress: int, goals: List[str], message: str) -> str:
        """Build structured response: empathy → personalization → suggestion → follow-up"""
        
        # 1. Empathy opener
        empathy = self._get_empathy_opener(intent, mood)
        name_part = f", {name}" if name else ""
        
        # 2. Personalization based on context
        personalization = self._get_personalization(mood, stress, goals)
        
        # 3. One simple suggestion
        suggestion = self._get_simple_suggestion(intent, stress)
        
        # 4. Gentle follow-up (with occasional humor)
        followup = self._get_gentle_followup(intent, mood, stress, message)
        
        # Combine parts naturally
        parts = [f"{empathy}{name_part}."]
        if personalization:
            parts.append(personalization)
        if suggestion:
            parts.append(suggestion)
        if followup:
            parts.append(followup)
        
        return " ".join(parts)
    
    def _get_empathy_opener(self, intent: str, mood: str) -> str:
        """Select appropriate empathy phrase"""
        # Map intent to empathy category
        if intent in self.empathy_bank:
            category = intent
        elif intent == "positive":
            category = "positive"
        else:
            category = "general"
        
        return random.choice(self.empathy_bank.get(category, self.empathy_bank["general"]))
    
    def _get_personalization(self, mood: str, stress: int, goals: List[str]) -> str:
        """Reference user's actual situation"""
        parts = []
        
        # Mention mood if relevant
        if mood and mood != "neutral" and mood != "okay":
            mood_map = {
                "anxious": "feeling anxious",
                "sad": "going through a tough time",
                "tired": "exhausted",
                "stressed": "under a lot of stress"
            }
            if mood in mood_map:
                parts.append(f"I can see you're {mood_map[mood]}")
        
        # Mention stress level
        if stress >= 8:
            parts.append("and your stress is really high right now")
        elif stress >= 6:
            parts.append("and you're pretty stressed")
        elif stress <= 3:
            parts.append("It's good to see your stress is lower")
        
        # Mention goals if any
        if goals and len(goals) > 0:
            goal = goals[0]  # Reference first active goal
            if stress < 5:
                parts.append(f"How's '{goal}' going?")
        
        return " ".join(parts) + "." if parts else ""
    
    def _get_simple_suggestion(self, intent: str, stress: int) -> str:
        """Provide ONE actionable tip"""
        if intent in self.suggestions:
            return random.choice(self.suggestions[intent])
        
        # Default suggestions by stress level
        if stress >= 7:
            return "How about taking just 5 minutes to step away and breathe?"
        elif stress >= 5:
            return "Try a quick break—even 2 minutes can help reset."
        else:
            return ""
    
    def _get_gentle_followup(self, intent: str, mood: str, stress: int, message: str) -> str:
        """Add gentle question or encouragement (with occasional humor)"""
        
        # Add humor for positive moods / low stress
        if stress < 4 and mood in ["okay", "positive", "happy"]:
            if "coffee" in message or "caffeine" in message:
                return random.choice(self.humor_bank["coffee"])
            if random.random() < 0.3:  # 30% chance of humor
                return random.choice(self.humor_bank["positive"])
        
        # Gentle humor for moderate stress
        if 4 <= stress < 6 and random.random() < 0.2:  # 20% chance
            return random.choice(self.humor_bank["stress_light"])
        
        # Otherwise use standard follow-ups
        if intent in ["stress", "overwhelmed", "anxious", "sad"]:
            return random.choice(self.followups["question"])
        elif intent == "positive":
            return random.choice(self.followups["encouragement"])
        else:
            return random.choice(self.followups["exploration"])
    
    def _detect_intent(self, message: str) -> str:
        """Detect user intent from message"""
        import re
        for intent, keywords in self.keywords.items():
            for keyword in keywords:
                pattern = r'\b' + re.escape(keyword) + r'\b'
                if re.search(pattern, message):
                    return intent
        return "general"
    
    def analyze_sentiment(self, message: str) -> str:
        """Analyze sentiment of user message"""
        message_lower = message.lower()
        
        positive_words = ["good", "great", "happy", "better", "well", "fine", "excellent", "wonderful", "amazing"]
        negative_words = ["bad", "sad", "stressed", "anxious", "overwhelmed", "tired", "exhausted", "depressed", "awful"]
        
        positive_count = sum(1 for word in positive_words if word in message_lower)
        negative_count = sum(1 for word in negative_words if word in message_lower)
        
        if positive_count > negative_count:
            return "positive"
        elif negative_count > positive_count:
            return "negative"
        else:
            return "neutral"
