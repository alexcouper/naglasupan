"use client";

import type { ReviewCompetition } from "@/lib/api";

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
  onSelect: (id: string, name: string) => void;
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

  return (
    <div className="space-y-4">
      {competitions.map((competition) => (
        <button
          key={competition.id}
          onClick={() => onSelect(competition.id, competition.name)}
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
  );
}
