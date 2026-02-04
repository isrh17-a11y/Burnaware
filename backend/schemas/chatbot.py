from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ChatMessage(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000)
    
    class Config:
        json_schema_extra = {
            "example": {
                "message": "I'm feeling overwhelmed with work lately."
            }
        }

class ChatResponse(BaseModel):
    id: int
    message: str
    response: str
    sentiment: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True
