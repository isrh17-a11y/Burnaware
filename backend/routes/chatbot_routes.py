from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from schemas.chatbot import ChatMessage, ChatResponse
from services.chatbot_service import ChatbotService
from services.database import get_db

router = APIRouter()

@router.post("/chat", response_model=ChatResponse, status_code=status.HTTP_201_CREATED)
async def send_message(
    chat_message: ChatMessage,
    user_id: int,  # TODO: Get from JWT token
    db: Session = Depends(get_db)
):
    """Send a message to the chatbot and get a response"""
    chatbot_service = ChatbotService(db)
    return chatbot_service.process_message(user_id, chat_message)

@router.get("/history/{user_id}", response_model=List[ChatResponse])
async def get_chat_history(user_id: int, db: Session = Depends(get_db)):
    """Get chat history for a specific user"""
    chatbot_service = ChatbotService(db)
    return chatbot_service.get_chat_history(user_id)

@router.delete("/history/{chat_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_chat_message(chat_id: int, db: Session = Depends(get_db)):
    """Delete a specific chat message"""
    chatbot_service = ChatbotService(db)
    success = chatbot_service.delete_message(chat_id)
    if not success:
        raise HTTPException(status_code=404, detail="Chat message not found")
    return None
