from sqlalchemy.orm import Session
from models.chat_history import ChatHistory
from models.mood import MoodEntry
from models.coaching import Goal
from models.user import User
from models.prediction import Prediction
from schemas.chatbot import ChatMessage
from chatbot.engine import BurnAwareChatbot
from typing import List, Optional, Dict

class ChatbotService:
    def __init__(self, db: Session):
        self.db = db
        self.bot = BurnAwareChatbot()
    
    def _get_user_context(self, user_id: int) -> Dict:
        """Gather user context for personalized responses"""
        context = {
            'name': 'friend',
            'mood': 'okay',
            'stress': 5,
            'intent': '',
            'goals': [],
            'recent_history': []
        }
        
        # Get user's name
        user = self.db.query(User).filter(User.id == user_id).first()
        if user:
            context['name'] = user.full_name or user.username or "friend"
        
        # Get most recent mood
        recent_mood = self.db.query(MoodEntry).filter(
            MoodEntry.user_id == user_id
        ).order_by(MoodEntry.created_at.desc()).first()
        
        if recent_mood:
            context['mood'] = recent_mood.mood_category
        
        # Get stress level from most recent prediction
        recent_prediction = self.db.query(Prediction).filter(
            Prediction.user_id == user_id
        ).order_by(Prediction.created_at.desc()).first()
        
        if recent_prediction:
            input_features = recent_prediction.input_features
            if input_features and 'stress_level' in input_features:
                context['stress'] = input_features['stress_level']
        
        return context
    
    def process_message(self, user_id: int, message: ChatMessage) -> ChatHistory:
        """Process a user message and generate a personalized response"""
        # Get user context for personalization
        user_context = self._get_user_context(user_id)
        
        # Generate personalized response with new engine
        # Engine expects: user_id: str, user_data: dict, message: str
        response_text = self.bot.generate_reply(
            user_id=str(user_id),
            user_data=user_context,
            message=message.message
        )
        
        # Analyze sentiment (Basic fallback or implement in engine if needed)
        # The new engine doesn't have analyze_sentiment, so we'll defaults to neutral 
        # or implement a simple check here if needed.
        # For now, let's keep it simple as "neutral" or a basic keyword check.
        sentiment = "neutral" 
        
        # Save to database (Persistent history)
        chat_record = ChatHistory(
            user_id=user_id,
            message=message.message,
            response=response_text,
            sentiment=sentiment
        )
        
        self.db.add(chat_record)
        self.db.commit()
        self.db.refresh(chat_record)
        return chat_record
    
    def get_chat_history(self, user_id: int, limit: int = 50) -> List[ChatHistory]:
        """Get chat history for a user"""
        return self.db.query(ChatHistory).filter(
            ChatHistory.user_id == user_id
        ).order_by(ChatHistory.created_at.desc()).limit(limit).all()
    
    def delete_message(self, chat_id: int) -> bool:
        """Delete a chat message"""
        chat_record = self.db.query(ChatHistory).filter(ChatHistory.id == chat_id).first()
        if chat_record:
            self.db.delete(chat_record)
            self.db.commit()
            return True
        return False
