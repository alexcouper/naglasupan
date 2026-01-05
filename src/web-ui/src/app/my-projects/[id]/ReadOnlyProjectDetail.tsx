"use client";

import ReactMarkdown from "react-markdown";
import type { Project } from "@/lib/api";
import { ImageGallery } from "@/components/ImageUpload";

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

interface ReadOnlyProjectDetailProps {
  project: Project;
}

export function ReadOnlyProjectDetail({ project }: ReadOnlyProjectDetailProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="flex items-start justify-between mb-6">
        <h1 className="text-3xl">{project.title || "Untitled Project"}</h1>
        <StatusBadge status={project.status} />
      </div>

      {project.images && project.images.length > 0 && (
        <div className="mb-6">
          <ImageGallery images={project.images} />
        </div>
      )}

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
          <article className="article text-gray-700">
            <ReactMarkdown>{project.description}</ReactMarkdown>
          </article>
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
  );
}
