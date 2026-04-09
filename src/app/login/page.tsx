"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      
      const response = await fetch(`${apiUrl}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login failed");
      }

      // Store token 
      if (result.data?.token) {
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("user", JSON.stringify({
          user_id: result.data.user_id,
          username: result.data.username,
        }));
        
        // Redirect to home
        router.push("/home");
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 scanline-overlay font-mono-brand">
      <div className="w-full max-w-md brutalist-card bg-[#0a0a0a] p-8 z-10 relative">
        <h1 className="font-display text-4xl mb-8 text-[#F05A28]">SYSTEM_LOGIN</h1>
        
        {error && (
          <div className="mb-6 p-3 border border-red-500 text-red-500 bg-red-500/10 text-sm">
            ERROR: {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm text-gray-400 uppercase tracking-wider">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black border border-gray-800 p-3 text-white focus:outline-none focus:border-[#F05A28] transition-colors"
              placeholder="Enter username"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-gray-400 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-gray-800 p-3 text-white focus:outline-none focus:border-[#F05A28] transition-colors"
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full orange-btn bg-[#F05A28] text-white font-display text-xl py-4 mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="pixel-blink">AUTHENTICATING...</span>
            ) : (
              "ACCESS_SYSTEM"
            )}
          </button>
        </form>
        
        <div className="mt-8 text-center text-xs text-gray-600">
          <p>UNAUTHORIZED ACCESS IS STRICTLY PROHIBITED</p>
        </div>
      </div>
    </div>
  );
}
