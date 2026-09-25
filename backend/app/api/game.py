from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.game import Game
from app.models.user import User
from app.schemas.game import GameCreate, GameResponse, GameUpdate
from app.api.deps import get_current_user
from uuid import UUID
import httpx
import os

router = APIRouter()

@router.post("/", response_model=GameResponse)
def add_game(game: GameCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Create the game and automatically attach it to the logged-in user
    new_game = Game(
        **game.model_dump(),
        user_id=current_user.id
    )
    db.add(new_game)
    db.commit()
    db.refresh(new_game)
    return new_game

@router.get("/", response_model=List[GameResponse])
def get_my_games(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Only fetch games belonging to this specific user ID
    games = db.query(Game).filter(Game.user_id == current_user.id).all()
    return games


@router.get("/search")
async def search_rawg_games(query: str, current_user: User = Depends(get_current_user)):
    api_key = os.getenv("RAWG_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="RAWG API key is missing")

    # Ask RAWG for the top 5 closest matches to the search query
    url = f"https://api.rawg.io/api/games?key={api_key}&search={query}&page_size=5"
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        
    if response.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to fetch data from RAWG")
        
    data = response.json()
    
    # Clean up the massive RAWG response into a neat package for our frontend
    clean_results = []
    for game in data.get("results", []):
        platforms = []
        if game.get("platforms"):
            platforms = [p["platform"]["name"] for p in game.get("platforms")]
            
        clean_results.append({
            "rawg_id": game.get("id"),
            "title": game.get("name"),
            "cover_image": game.get("background_image"),
            "release_date": game.get("released"),
            "platforms": platforms
        })
        
    return clean_results

@router.delete("/{game_id}")
def delete_game(game_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # 1. Find the specific game, ensuring it belongs to the current user
    game = db.query(Game).filter(Game.id == game_id, Game.user_id == current_user.id).first()
    
    # 2. If it doesn't exist or isn't theirs, throw an error
    if not game:
        raise HTTPException(status_code=404, detail="Game not found or access denied")
    
    # 3. Delete it from the database permanently
    db.delete(game)
    db.commit()
    
    return {"message": "Game removed from library"}

@router.put("/{game_id}", response_model=GameResponse)
def update_game(
    game_id: UUID, 
    game_update: GameUpdate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    # Find the game
    game = db.query(Game).filter(Game.id == game_id, Game.user_id == current_user.id).first()
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    
    # Update the status if a new one was provided
    if game_update.status is not None:
        game.status = game_update.status
        
    db.commit()
    db.refresh(game)
    return game