"use client";

import { CheckCircleIcon } from "@heroicons/react/24/solid";
import type { ReviewCompetition, ReviewStatus } from "@/lib/api";

function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  return `${start.toLocaleDateString("en-US", options)} - ${end.toLocaleDateString("en-US", options)}`;
}

interface CompetitionsListProps {
  competitions: ReviewCompetition[];
  onSelect: (id: string, name: string, status: ReviewStatus) => void;
}

export function CompetitionsList({
  competitions,
  onSelect,
}: CompetitionsListProps) {
  if (competitions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-600">
          No competitions assigned to you for review.
        </p>
      </div>
    );
  }

  const inProgress = competitions.filter(
    (c) => c.my_review_status === "in_progress"
  );
  const completed = competitions.filter(
    (c) => c.my_review_status === "completed"
  );

  return (
    <div className="space-y-6">
      {inProgress.length > 0 && (
        <div className="space-y-4">
          {inProgress.map((competition) => (
            <button
              key={competition.id}
              onClick={() =>
                onSelect(
                  competition.id,
                  competition.name,
                  competition.my_review_status
                )
              }
              className="w-full text-left bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:border-gray-300 transition-colors"
            >
              <h2 className="font-medium text-lg">{competition.name}</h2>
              <p className="text-gray-500 text-sm mt-1">
                {formatDateRange(competition.start_date, competition.end_date)}
              </p>
              <p className="text-gray-600 text-sm mt-2">
                {competition.project_count} project
                {competition.project_count !== 1 ? "s" : ""} to review
              </p>
            </button>
          ))}
        </div>
      )}

      {completed.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Completed
          </h3>
          {completed.map((competition) => (
            <button
              key={competition.id}
              onClick={() =>
                onSelect(
                  competition.id,
                  competition.name,
                  competition.my_review_status
                )
              }
              className="w-full text-left bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-6 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-medium text-lg text-gray-600">
                  {competition.name}
                </h2>
                <CheckCircleIcon className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-gray-400 text-sm mt-1">
                {formatDateRange(competition.start_date, competition.end_date)}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                {competition.project_count} project
                {competition.project_count !== 1 ? "s" : ""} reviewed
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
