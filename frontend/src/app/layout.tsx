import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// 1. We import the AuthProvider we made in Step A
import { AuthProvider } from "../context/AuthContext"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NexusTrack",
  description: "Track your gaming journey",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* 2. We wrap our entire app (children) inside the AuthProvider */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}