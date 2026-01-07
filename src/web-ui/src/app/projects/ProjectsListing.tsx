"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Squares2X2Icon,
  TrophyIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/outline";

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
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target as Node)
      ) {
        setSortDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-1">
          <button
            onClick={() => setViewMode("list")}
            title="All projects"
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "list"
                ? "bg-gray-200 text-gray-900"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            }`}
          >
            <Squares2X2Icon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("competition")}
            title="By competition"
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "competition"
                ? "bg-gray-200 text-gray-900"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            }`}
          >
            <TrophyIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="relative" ref={sortDropdownRef}>
          <button
            onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
            title="Sort order"
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <ArrowsUpDownIcon className="w-5 h-5" />
          </button>
          {sortDropdownOpen && (
            <div className="absolute right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[140px]">
              <button
                onClick={() => {
                  setSortBy("created_at");
                  setSortDropdownOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                  sortBy === "created_at" ? "text-gray-900 font-medium" : "text-gray-700"
                }`}
              >
                Date added
              </button>
              <button
                onClick={() => {
                  setSortBy("title");
                  setSortDropdownOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                  sortBy === "title" ? "text-gray-900 font-medium" : "text-gray-700"
                }`}
              >
                Name
              </button>
            </div>
          )}
        </div>
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
    <Link
      href={`/projects/${project.id}`}
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:border-gray-300 transition-all"
    >
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
    </Link>
  );
}

function CompetitionProjectCard({ project }: { project: CompetitionProject }) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:border-gray-300 transition-all"
    >
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
    </Link>
  );
}
