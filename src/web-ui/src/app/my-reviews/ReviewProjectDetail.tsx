"use client";

import { useState, useEffect } from "react";
import type { Project } from "@/lib/api";
import { ReadOnlyProjectDetail } from "@/app/my-projects/[id]/ReadOnlyProjectDetail";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface ReviewProjectDetailProps {
  projectId: string;
}

export function ReviewProjectDetail({ projectId }: ReviewProjectDetailProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/projects/${projectId}`);
        if (!res.ok) throw new Error("Failed to fetch project");
        const data = await res.json();
        setProject(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load project");
      }
      setIsLoading(false);
    };

    fetchProject();
  }, [projectId]);

  if (isLoading) return <p className="text-gray-600">Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!project) return <p className="text-gray-600">Project not found</p>;

  return <ReadOnlyProjectDetail project={project} showStatus={false} />;
}
