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
      const project = await apiClient.createProject({ url, description });
      router.push(`/my-projects/${project.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit project");
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || !isAuthenticated) {
    return (
      <main className="min-h-screen bg-grid-paper pt-16">
        <div className="content-wrapper flex items-center justify-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-grid-paper pt-16">
      <div className="content-wrapper flex flex-col items-center justify-center">
        <div className="w-full max-w-lg">
          <h1 className="text-3xl text-center mb-8">Submit Your Project</h1>

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
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Description
              </label>
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
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Submitting..." : "Submit Project"}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-600">
            <Link href="/" className="text-accent hover:underline">
              &larr; Back to home
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
