from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import users # Import our new routes
from app.api import users, auth, game

app = FastAPI(
    title="NexusTrack API",
    description="Backend for the Game Achievement & Completion Tracker",
    version="1.0.0"
)
origins = [
    "http://localhost:3000",
    "https://nexustrack-api-1hm2.onrender.com", # Replace this with YOUR actual Vercel URL
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000",], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Attach the user routes to the main app
app.include_router(users.router, prefix="/api/users", tags=["Users"])

@app.get("/")
def read_root():
    return {"status": "online", "message": "NexusTrack API is running."}

# ... other imports ...
from app.api import users, auth # Update this line to include auth

# ... middleware code ...

# Attach routes
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"]) # Add this line
app.include_router(game.router, prefix="/api/games", tags=["Games"])