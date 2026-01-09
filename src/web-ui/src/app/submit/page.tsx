"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/auth";
import { apiClient } from "@/lib/api";

export default function SubmitPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      setError("Please enter a valid URL");
      return;
    }

    if (!description.trim()) {
      setError("Please provide a description");
      return;
    }

    setIsLoading(true);

    try {
      await apiClient.createProject({ website_url: url, description, });
      router.push("/my-projects");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit project");
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || !isAuthenticated) {
    return (
      <main className="min-h-screen bg-white">
        <section className="pt-24 pb-8 px-4 bg-gradient-to-b from-blue-50 to-white">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gray-600">Loading...</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-24 pb-8 px-4 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl text-foreground mb-4 font-semibold">
            Submit Your Project
          </h1>
          <p className="font-sketch text-2xl text-gray-600">
            Share what you&apos;ve been building
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 px-4">
        <div className="max-w-lg mx-auto">
          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="url" className="block text-sm font-medium mb-2">
                  Project URL
                </label>
                <input
                  id="url"
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="input"
                  placeholder="https://your-project.com"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description
                  </label>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    Markdown supported
                  </span>
                </div>
                <textarea
                  id="description"
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input resize-none"
                  placeholder="Tell us about your project..."
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-sketchy disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Submitting..." : "Submit Project"}
              </button>
            </form>

            <p className="mt-8 text-center text-gray-600">
              <Link href="/" className="text-accent hover:underline font-medium">
                &larr; Back to home
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
