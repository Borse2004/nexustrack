"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import api from "../../lib/api";

export default function SearchGames() {
  const { token } = useAuth();
  const router = useRouter();
  
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);

  // 1. Ask the backend to search RAWG
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    
    setLoading(true);
    try {
      const response = await api.get(`/games/search?query=${query}`);
      setResults(response.data);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Save the chosen game to the database
  const handleSaveGame = async (game: any) => {
    setSaving(game.rawg_id);
    try {
      await api.post("/games/", {
        title: game.title,
        // If a game has multiple platforms, we'll just grab the first one for simplicity
        platform: game.platforms.length > 0 ? game.platforms[0] : "Unknown", 
        cover_image: game.cover_image,
        status: "playing"
      });
      // Once saved, send the user back to their dashboard to see it!
      router.push("/");
    } catch (error) {
      console.error("Failed to save game:", error);
      setSaving(null);
    }
  };

  if (!token) return <p className="p-8 text-white">Please log in first.</p>;

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header & Search Bar */}
        <div className="mb-8">
          <button onClick={() => router.push("/")} className="text-gray-400 hover:text-white mb-4 block transition">
            &larr; Back to Library
          </button>
          <h1 className="text-3xl font-bold text-blue-500 mb-6">Find a Game</h1>
          
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              placeholder="e.g. Cyberpunk, Halo, Zelda..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 p-4 bg-gray-800 text-white rounded outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
            />
            <button 
              type="submit" 
              className="bg-blue-600 px-8 font-bold rounded hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </form>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {results.map((game: any) => (
            <div key={game.rawg_id} className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden flex">
              
              {/* Cover Art Thumbnail */}
              {game.cover_image ? (
                <img src={game.cover_image} alt={game.title} className="w-32 h-40 object-cover" />
              ) : (
                <div className="w-32 h-40 bg-gray-700 flex flex-col items-center justify-center text-xs text-gray-500">
                  No Image
                </div>
              )}

              {/* Game Info & Save Button */}
              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1 line-clamp-1">{game.title}</h2>
                  <p className="text-sm text-gray-400 line-clamp-1">
                    {game.platforms.join(", ")}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{game.release_date}</p>
                </div>
                
                <button 
                  onClick={() => handleSaveGame(game)}
                  disabled={saving === game.rawg_id}
                  className="mt-4 w-full bg-blue-900/50 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-800 hover:border-blue-500 font-bold py-2 rounded transition"
                >
                  {saving === game.rawg_id ? "Saving..." : "Add to Library"}
                </button>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </main>
  );
}