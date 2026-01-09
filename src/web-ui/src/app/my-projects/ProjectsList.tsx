"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/auth";
import { fetchMyProjects } from "@/app/actions";
import type { Project } from "@/lib/api";

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

export function ProjectsList() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, getToken } = useAuth();
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
    const token = getToken();
    if (!token) {
      setError("Not authenticated");
      setIsLoading(false);
      return;
    }

    const result = await fetchMyProjects(token);
    if (result.error) {
      setError(result.error);
    } else if (result.projects) {
      setProjects(result.projects);
    }
    setIsLoading(false);
  };

  if (authLoading || isLoading) {
    return <p className="text-gray-600">Loading...</p>;
  }

  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Link href="/" className="text-accent hover:underline">
          &larr; Back to home
        </Link>
      </div>
    );
  }

  return (
    <>
      {projects.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-600 mb-4">You haven&apos;t submitted any projects yet.</p>
          <Link href="/submit" className="btn-sketchy inline-block">
            Submit Your First Project
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => {
            const mainImage = project.images?.find((img) => img.is_main) || project.images?.[0];
            return (
              <Link
                key={project.id}
                href={`/my-projects/${project.id}`}
                className="block bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:border-gray-300 transition-colors"
              >
                <div className="flex gap-4">
                  {mainImage && (
                    <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={mainImage.url}
                        alt={project.title || "Project image"}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
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
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
