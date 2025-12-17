"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/auth";
import { apiClient, Project } from "@/lib/api";

function StatusBadge({ status }: { status: string }) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    approved: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
  };

  const labels = {
    pending: "Pending Review",
    approved: "Approved",
    rejected: "Rejected",
  };

  return (
    <span
      className={`inline-block px-3 py-1 text-sm font-medium rounded-full border ${
        styles[status as keyof typeof styles] || styles.pending
      }`}
    >
      {labels[status as keyof typeof labels] || status}
    </span>
  );
}

export default function MyProjectPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isAuthenticated && params.id) {
      loadProject();
    }
  }, [authLoading, isAuthenticated, params.id]);

  const loadProject = async () => {
    try {
      const data = await apiClient.getMyProject(params.id as string);
      setProject(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load project");
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <main className="min-h-screen bg-grid-paper pt-16">
        <div className="content-wrapper flex items-center justify-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-grid-paper pt-16">
        <div className="content-wrapper flex flex-col items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Link href="/" className="text-accent hover:underline">
              &larr; Back to home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="min-h-screen bg-grid-paper pt-16">
        <div className="content-wrapper flex flex-col items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Project not found</p>
            <Link href="/" className="text-accent hover:underline">
              &larr; Back to home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-grid-paper pt-16">
      <div className="content-wrapper">
        <div className="max-w-2xl mx-auto">

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex items-start justify-between mb-6">
            <h1 className="font-sketch text-3xl">{project.title || "Untitled Project"}</h1>
            <StatusBadge status={project.status} />
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-medium text-gray-500 mb-1">URL</h2>
              <a
                href={project.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline break-all"
              >
                {project.website_url}
              </a>
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-500 mb-1">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{project.description}</p>
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-500 mb-1">Submitted</h2>
              <p className="text-gray-700">
                {new Date(project.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            {project.status === "pending" && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                  Your project is currently under review. We&apos;ll notify you once it&apos;s been reviewed.
                </p>
              </div>
            )}

            {project.status === "approved" && project.approved_at && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 text-sm">
                  Your project was approved on{" "}
                  {new Date(project.approved_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/submit" className="text-accent hover:underline">
            Submit another project
          </Link>
        </div>
        </div>
      </div>
    </main>
  );
}
