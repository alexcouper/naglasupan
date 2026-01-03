"use client";

import type { Project } from "@/lib/api";

export interface ProjectFormData {
  title: string;
  website_url: string;
  description: string;
}

interface EditProjectDetailProps {
  project: Project;
  formData: ProjectFormData;
  onChange: (data: ProjectFormData) => void;
}

export function EditProjectDetail({ project, formData, onChange }: EditProjectDetailProps) {
  const handleChange = (field: keyof ProjectFormData, value: string) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <h2 className="text-2xl mb-6">Edit Project</h2>

      <div className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Project Title
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="input"
            placeholder="My Awesome Project"
          />
        </div>

        <div>
          <label htmlFor="website_url" className="block text-sm font-medium mb-2">
            Project URL
          </label>
          <input
            id="website_url"
            type="url"
            value={formData.website_url}
            onChange={(e) => handleChange("website_url", e.target.value)}
            className="input"
            placeholder="https://your-project.com"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
              Markdown supported
            </span>
          </div>
          <textarea
            id="description"
            rows={6}
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="input resize-none"
            placeholder="Tell us about your project..."
          />
        </div>

        <div className="text-sm text-gray-500">
          <p>
            <strong>Status:</strong>{" "}
            <span className="capitalize">{project.status}</span>
          </p>
          <p>
            <strong>Submitted:</strong>{" "}
            {new Date(project.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
