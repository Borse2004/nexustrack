from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.user import User
from app.api.security import verify_password, create_access_token

router = APIRouter()

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # 1. Find the user in the database
    user = db.query(User).filter(User.username == form_data.username).first()
    
    # 2. Verify user exists AND password matches the hash
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    # 3. Generate the JWT token containing the user's ID
    access_token = create_access_token(data={"sub": str(user.id)})
    
    # 4. Return the token to the frontend
    return {"access_token": access_token, "token_type": "bearer"}