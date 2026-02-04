from sqlalchemy.orm import Session
from models.chat_history import ChatHistory
from schemas.chatbot import ChatMessage
from chatbot.bot import MentalHealthBot
from typing import List, Optional

class ChatbotService:
    def __init__(self, db: Session):
        self.db = db
        self.bot = MentalHealthBot()
    
    def process_message(self, user_id: int, message: ChatMessage) -> ChatHistory:
        """Process a user message and generate a response"""
        # Get recent history for context
        history_records = self.get_chat_history(user_id, limit=3)
        # Convert to format expected by bot [{'role': 'user'/'bot', 'message': '...'}]
        # History is returned in descending order (newest first), so we need to reverse it for context
        history = []
        for record in reversed(history_records):
            history.append({'role': 'user', 'message': record.message})
            history.append({'role': 'bot', 'message': record.response})

        # Get bot response with context
        response_text = self.bot.generate_response(message.message, history=history)
        
        # Analyze sentiment
        sentiment = self.bot.analyze_sentiment(message.message)
        
        # Save to database
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
