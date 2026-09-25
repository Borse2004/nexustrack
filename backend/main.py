from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import users, auth, game # Cleaned up and consolidated imports

app = FastAPI(
    title="NexusTrack API",
    description="Backend for the Game Achievement & Completion Tracker",
    version="1.0.0"
)

# Update the origins list with your frontend URLs
origins = [
    "http://localhost:3000",
    "https://nexustrack-api-1hm2.onrender.com" # <-- Replace with your exact Vercel URL (no trailing slash)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "online", "message": "NexusTrack API is running."}

# Attach all routes (duplicates and trailing dots removed)
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(game.router, prefix="/api/games", tags=["Games"])