from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.api.security import hash_password # 1. Import the hashing function

router = APIRouter()

@router.post("/register", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    # 2. Hash the password before creating the user object
    hashed_pw = hash_password(user.password)
    
    new_user = User(
        username=user.username, 
        email=user.email, 
        password_hash=hashed_pw # 3. Save the hash, NOT the raw password
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user