"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/auth";
import { apiClient, Project } from "@/lib/api";
import { Navigation } from "@/components/Navigation";

function StatusBadge({ status }: { status: string }) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    approved: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
  };

  const labels = {
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
  };

  return (
    <span
      className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full border ${
        styles[status as keyof typeof styles] || styles.pending
      }`}
    >
      {labels[status as keyof typeof labels] || status}
    </span>
  );
}

export default function MyProjectsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isAuthenticated) {
      loadProjects();
    }
  }, [authLoading, isAuthenticated, router]);

  const loadProjects = async () => {
    try {
      const data = await apiClient.getMyProjects();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load projects");
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <main className="min-h-screen bg-grid-paper flex items-center justify-center pt-16">
        <Navigation />
        <p className="text-gray-600">Loading...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-grid-paper flex flex-col items-center justify-center px-4 pt-16">
        <Navigation />
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/" className="text-accent hover:underline">
            &larr; Back to home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-grid-paper py-12 px-4 pt-20">
      <Navigation />
      <div className="max-w-2xl mx-auto">
        <h1 className="font-sketch text-4xl mb-8">My Projects</h1>

        {projects.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-600 mb-4">You haven&apos;t submitted any projects yet.</p>
            <Link href="/submit" className="btn-primary inline-block">
              Submit Your First Project
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/my-projects/${project.id}`}
                className="block bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h2 className="font-medium text-lg truncate">
                      {project.title || "Untitled Project"}
                    </h2>
                    <p className="text-gray-500 text-sm truncate mt-1">
                      {project.website_url}
                    </p>
                  </div>
                  <StatusBadge status={project.status} />
                </div>
                {project.description && (
                  <p className="text-gray-600 text-sm mt-3 line-clamp-2">
                    {project.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/submit" className="text-accent hover:underline">
            Submit another project
          </Link>
        </div>
      </div>
    </main>
  );
}
