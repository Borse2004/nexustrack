"use client";

import { useState } from "react";
import api from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth(); // Bring in our global login function

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // FastAPI strictly expects URL-encoded form data for login, NOT JSON!
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      // UPDATED: Added /api prefix to match your live backend routes
      const response = await api.post("/api/auth/login", formData);
      
      // If successful, pass the token to our AuthContext
      login(response.data.access_token);
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 flex items-center justify-center">
      {/* Moved the background styling to a wrapper div so the link sits nicely at the bottom */}
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <form onSubmit={handleLogin}>
          <h1 className="text-3xl font-bold text-white mb-6 text-center">Login</h1>
          
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 mb-4 bg-gray-700 text-white rounded outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-6 bg-gray-700 text-white rounded outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition">
            Enter Nexus
          </button>
        </form>

        {/* ADDED: Link to the new sign-up page */}
        <div className="mt-6 text-center text-gray-400 text-sm">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-400 hover:text-blue-300 font-bold">
            Sign up here
          </a>
        </div>
      </div>
    </main>
  );
}