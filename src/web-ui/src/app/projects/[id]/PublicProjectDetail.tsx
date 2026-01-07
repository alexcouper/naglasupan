"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ReadOnlyProjectDetail } from "@/app/my-projects/[id]/ReadOnlyProjectDetail";
import type { Project } from "@/lib/api";

interface PublicProjectDetailProps {
  projectId: string;
}

export function PublicProjectDetail({ projectId }: PublicProjectDetailProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      setIsLoading(true);
      setError("");
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(`${apiUrl}/api/projects/${projectId}`);
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Project not found");
          }
          throw new Error("Failed to fetch project");
        }
        const data = await res.json();
        setProject(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch project");
      }
      setIsLoading(false);
    };

    fetchProject();
  }, [projectId]);

  if (isLoading) {
    return <p className="text-gray-600">Loading...</p>;
  }

  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Link href="/projects" className="text-accent hover:underline">
          &larr; Back to projects
        </Link>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center">
        <p className="text-gray-600 mb-4">Project not found</p>
        <Link href="/projects" className="text-accent hover:underline">
          &larr; Back to projects
        </Link>
      </div>
    );
  }

  return (
    <>
      <ReadOnlyProjectDetail project={project} showStatus={false} />
      <div className="mt-8 text-center">
        <Link href="/projects" className="text-accent hover:underline">
          &larr; Back to projects
        </Link>
      </div>
    </>
  );
}
