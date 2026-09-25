"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";

export default function Home() {
  const { token, logout } = useAuth();
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchGames = async () => {
      try {
        // UPDATED: Added /api prefix
        const response = await api.get("/api/games/");
        setGames(response.data);
      } catch (error) {
        console.error("Failed to fetch games");
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [token]);
  
  const handleDelete = async (gameId: string) => {
    if (!window.confirm("Are you sure you want to remove this game?")) return;
    
    try {
      // UPDATED: Added /api prefix
      await api.delete(`/api/games/${gameId}`);
      setGames(games.filter((game: any) => game.id !== gameId));
    } catch (error) {
      console.error("Failed to delete game:", error);
    }
  };

  const handleStatusChange = async (gameId: string, newStatus: string) => {
    try {
      // UPDATED: Added /api prefix
      await api.put(`/api/games/${gameId}`, { status: newStatus });
      
      setGames(games.map((game: any) => 
        game.id === gameId ? { ...game, status: newStatus } : game
      ));
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  if (!token) {
    return (
      <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8">
        <h1 className="text-6xl font-bold text-blue-500 mb-4">NexusTrack</h1>
        <p className="text-xl text-gray-400 mb-8">Your ultimate gaming library.</p>
        <a href="/login" className="bg-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition">
          Login to your account
        </a>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
        <h1 className="text-3xl font-bold text-blue-500">My Library</h1>
        <div className="flex gap-4">
          <a href="/search" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 font-bold transition">
            + Add Game
          </a>
          <button 
            onClick={logout} 
            className="bg-gray-700 px-4 py-2 rounded hover:bg-red-600 font-bold transition"
          >
            Logout
          </button>
        </div>
      </div>
      
      {loading ? (
        <p className="text-gray-400">Loading your library...</p>
      ) : games.length === 0 ? (
        <p className="text-gray-400">Your library is empty. Time to add some games!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game: any) => (
            <div key={game.id} className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden flex flex-col">
              
              {game.cover_image ? (
                <img src={game.cover_image} alt={game.title} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-500 font-bold">No Image</span>
                </div>
              )}

              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <h2 className="text-2xl font-bold mb-2 text-white">{game.title}</h2>
                  <p className="text-gray-400 mb-4">Platform: <span className="text-gray-200">{game.platform}</span></p>
                </div>
                
                <div className="flex justify-between items-center mt-4 border-t border-gray-700 pt-4">
                  <select 
                    value={game.status}
                    onChange={(e) => handleStatusChange(game.id, e.target.value)}
                    className="bg-gray-800 text-blue-400 text-sm font-semibold rounded px-2 py-1 outline-none border border-gray-600 focus:border-blue-500 cursor-pointer"
                  >
                    <option value="playing">Playing</option>
                    <option value="completed">Completed</option>
                    <option value="dropped">Dropped</option>
                    <option value="wishlist">Wishlist</option>
                  </select>
                  
                  <button 
                    onClick={() => handleDelete(game.id)}
                    className="text-red-500 hover:text-red-400 text-sm font-bold transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
              
            </div>
          ))}
        </div>
      )}
    </main>
  );
}