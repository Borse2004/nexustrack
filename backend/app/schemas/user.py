from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional

# 1. What we expect the frontend to send when creating a user
class UserCreate(BaseModel):
    username: str
    email: str
    password: str

# 2. What we send back to the frontend (notice we NEVER send the password back)
class UserResponse(BaseModel):
    id: UUID
    username: str
    email: str
    avatar: Optional[str] = None
    bio: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True # Tells Pydantic to read data from our SQLAlchemy model