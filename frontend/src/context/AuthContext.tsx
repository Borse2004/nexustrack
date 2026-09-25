"use client"; // This tells Next.js this code runs in the browser, not the server

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // On page load, check if we already have a token saved
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) setToken(savedToken);
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken); // Save token to browser
    setToken(newToken); // Update state
    router.push('/'); // Send user to home page
  };

  const logout = () => {
    localStorage.removeItem('token'); // Delete token
    setToken(null);
    router.push('/login'); // Kick back to login page
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// A handy hook to grab auth data anywhere in our app
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};