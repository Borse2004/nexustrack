from pydantic import BaseModel
from uuid import UUID
from typing import Optional
from datetime import datetime

class GameBase(BaseModel):
    title: str
    platform: str
    cover_image: Optional[str] = None # <-- NEW FIELD
    status: str = "playing" 
    rating: Optional[int] = None

class GameCreate(GameBase):
    pass

class GameUpdate(BaseModel):
    status: Optional[str] = None
    rating: Optional[int] = None

class GameResponse(GameBase):
    id: UUID
    user_id: UUID
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True