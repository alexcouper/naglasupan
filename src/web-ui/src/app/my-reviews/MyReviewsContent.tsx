"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth";
import { apiClient, ReviewCompetition, ReviewProject } from "@/lib/api";
import { CompetitionsList } from "./CompetitionsList";
import { CompetitionProjects } from "./CompetitionProjects";
import { ReviewProjectDetail } from "./ReviewProjectDetail";

type View = "competitions" | "projects" | "detail";

interface SelectedCompetition {
  id: string;
  name: string;
}

function Breadcrumbs({
  view,
  competitionName,
  projectTitle,
  onGoToCompetitions,
  onGoToProjects,
}: {
  view: View;
  competitionName?: string;
  projectTitle?: string;
  onGoToCompetitions: () => void;
  onGoToProjects: () => void;
}) {
  return (
    <nav className="mb-6 text-sm">
      <ol className="flex items-center gap-2 text-gray-500">
        <li>
          {view === "competitions" ? (
            <span className="text-gray-900 font-medium">My Reviews</span>
          ) : (
            <button
              onClick={onGoToCompetitions}
              className="hover:text-gray-900"
            >
              My Reviews
            </button>
          )}
        </li>
        {competitionName && (
          <>
            <li className="text-gray-400">/</li>
            <li>
              {view === "projects" ? (
                <span className="text-gray-900 font-medium">
                  {competitionName}
                </span>
              ) : (
                <button onClick={onGoToProjects} className="hover:text-gray-900">
                  {competitionName}
                </button>
              )}
            </li>
          </>
        )}
        {projectTitle && view === "detail" && (
          <>
            <li className="text-gray-400">/</li>
            <li>
              <span className="text-gray-900 font-medium truncate max-w-[200px] inline-block align-middle">
                {projectTitle}
              </span>
            </li>
          </>
        )}
      </ol>
    </nav>
  );
}

export function MyReviewsContent() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [view, setView] = useState<View>("competitions");
  const [competitions, setCompetitions] = useState<ReviewCompetition[]>([]);
  const [selectedCompetition, setSelectedCompetition] =
    useState<SelectedCompetition | null>(null);
  const [projects, setProjects] = useState<ReviewProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<ReviewProject | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const isReviewer = user?.groups?.includes("REVIEWERS") ?? false;

  const loadCompetitions = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await apiClient.getMyReviewCompetitions();
      setCompetitions(response.competitions);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load competitions"
      );
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && isReviewer) {
      loadCompetitions();
    } else if (isAuthenticated && !authLoading) {
      setIsLoading(false);
    }
  }, [isAuthenticated, isReviewer, authLoading, loadCompetitions]);

  const loadCompetitionProjects = useCallback(async (competitionId: string) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await apiClient.getMyReviewCompetition(competitionId);
      const sortedProjects = [...response.projects].sort((a, b) => {
        const rankA = a.my_ranking ?? null;
        const rankB = b.my_ranking ?? null;
        if (rankA === null && rankB === null) return 0;
        if (rankA === null) return 1;
        if (rankB === null) return -1;
        return rankA - rankB;
      });
      setProjects(sortedProjects);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load competition"
      );
    }
    setIsLoading(false);
  }, []);

  const handleCompetitionSelect = useCallback(
    (id: string, name: string) => {
      setSelectedCompetition({ id, name });
      setView("projects");
      loadCompetitionProjects(id);
    },
    [loadCompetitionProjects]
  );

  const handleProjectSelect = useCallback((project: ReviewProject) => {
    setSelectedProject(project);
    setView("detail");
  }, []);

  const handleProjectsReorder = useCallback((newProjects: ReviewProject[]) => {
    setProjects(newProjects);
  }, []);

  const handleGoToCompetitions = useCallback(() => {
    setView("competitions");
    setSelectedCompetition(null);
    setSelectedProject(null);
    setProjects([]);
  }, []);

  const handleGoToProjects = useCallback(() => {
    setView("projects");
    setSelectedProject(null);
  }, []);

  if (authLoading || isLoading) {
    return <p className="text-gray-600">Loading...</p>;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!isReviewer) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-600">
          Interested in helping rank the next set of projects? Get in touch:{" "}
          <a
            href="mailto:alex@naglasupan.is"
            className="text-accent hover:underline"
          >
            alex@naglasupan.is
          </a>
        </p>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div>
      <Breadcrumbs
        view={view}
        competitionName={selectedCompetition?.name}
        projectTitle={selectedProject?.title}
        onGoToCompetitions={handleGoToCompetitions}
        onGoToProjects={handleGoToProjects}
      />

      {view === "competitions" && (
        <CompetitionsList
          competitions={competitions}
          onSelect={handleCompetitionSelect}
        />
      )}

      {view === "projects" && selectedCompetition && (
        <CompetitionProjects
          competitionId={selectedCompetition.id}
          projects={projects}
          onProjectSelect={handleProjectSelect}
          onProjectsReorder={handleProjectsReorder}
        />
      )}

      {view === "detail" && selectedProject && (
        <ReviewProjectDetail projectId={selectedProject.id} />
      )}
    </div>
  );
}
