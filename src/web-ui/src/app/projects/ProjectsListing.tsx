"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

type SortBy = "created_at" | "title";
type ViewMode = "list" | "competition";

interface ProjectImage {
  id: string;
  url: string;
  is_main: boolean;
}

interface Project {
  id: string;
  title: string;
  images?: ProjectImage[];
}

interface CompetitionProject {
  id: string;
  title: string;
  main_image_url: string | null;
}

interface Competition {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  projects: CompetitionProject[];
}

export function ProjectsListing() {
  const searchParams = useSearchParams();
  const isPreview = searchParams.get("preview") === "True";

  const [projects, setProjects] = useState<Project[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [sortBy, setSortBy] = useState<SortBy>("created_at");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isPreview) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError("");
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        if (viewMode === "competition") {
          const res = await fetch(`${apiUrl}/api/competitions`);
          if (!res.ok) throw new Error("Failed to fetch competitions");
          const data = await res.json();
          setCompetitions(data.competitions);
        } else {
          const sortOrder = sortBy === "title" ? "asc" : "desc";
          const res = await fetch(
            `${apiUrl}/api/projects?sort_by=${sortBy}&sort_order=${sortOrder}`
          );
          if (!res.ok) throw new Error("Failed to fetch projects");
          const data = await res.json();
          setProjects(data.projects);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      }
      setIsLoading(false);
    };

    fetchData();
  }, [isPreview, viewMode, sortBy]);

  if (!isPreview) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">This feature is not yet available.</p>
      </div>
    );
  }

  if (isLoading) {
    return <p className="text-gray-600">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 py-1 rounded transition-colors ${
              viewMode === "list"
                ? "bg-gray-900 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            List
          </button>
          <button
            onClick={() => setViewMode("competition")}
            className={`px-3 py-1 rounded transition-colors ${
              viewMode === "competition"
                ? "bg-gray-900 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            By Competition
          </button>
        </div>

        {viewMode === "list" && (
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="border rounded px-2 py-1 bg-white"
          >
            <option value="created_at">Date Added</option>
            <option value="title">Name</option>
          </select>
        )}
      </div>

      {/* Project Cards */}
      {viewMode === "list" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
          {projects.length === 0 && (
            <p className="col-span-full text-gray-500 text-center py-8">
              No projects found.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {competitions.map((competition) => (
            <div key={competition.id}>
              <h2 className="text-xl font-medium mb-4">{competition.name}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {competition.projects.map((project) => (
                  <CompetitionProjectCard key={project.id} project={project} />
                ))}
                {competition.projects.length === 0 && (
                  <p className="col-span-full text-gray-500 text-center py-4">
                    No projects in this competition.
                  </p>
                )}
              </div>
            </div>
          ))}
          {competitions.length === 0 && (
            <p className="text-gray-500 text-center py-8">
              No competitions found.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const mainImage =
    project.images?.find((img) => img.is_main) || project.images?.[0];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="relative aspect-video bg-gray-100">
        {mainImage ? (
          <Image
            src={mainImage.url}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No image
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium truncate">{project.title || "Untitled"}</h3>
      </div>
    </div>
  );
}

function CompetitionProjectCard({ project }: { project: CompetitionProject }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="relative aspect-video bg-gray-100">
        {project.main_image_url ? (
          <Image
            src={project.main_image_url}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No image
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium truncate">{project.title || "Untitled"}</h3>
      </div>
    </div>
  );
}
