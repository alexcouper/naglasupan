"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/auth";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [kennitala, setKennitala] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (!/^\d{10}$/.test(kennitala)) {
      setError("Kennitala must be exactly 10 digits");
      return;
    }

    setIsLoading(true);

    try {
      await register(email, password, kennitala);
      router.push("/submit");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-grid-paper flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="font-sketch text-4xl text-center mb-8">Create Account</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="At least 8 characters"
            />
          </div>

          <div>
            <label htmlFor="kennitala" className="block text-sm font-medium mb-2">
              Kennitala
            </label>
            <input
              id="kennitala"
              type="text"
              required
              maxLength={10}
              value={kennitala}
              onChange={(e) => setKennitala(e.target.value.replace(/\D/g, ""))}
              className="input"
              placeholder="10 digits"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-accent hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
