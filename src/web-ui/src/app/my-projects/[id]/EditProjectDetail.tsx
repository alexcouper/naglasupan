"use client";

import type { Project, ProjectImage } from "@/lib/api";
import { ImageDropZone, ImageGallery, UploadProgress } from "@/components/ImageUpload";

export interface ProjectFormData {
  title: string;
  website_url: string;
  description: string;
}

interface UploadProgressItem {
  imageId: string;
  filename: string;
  progress: number;
  status: "pending" | "uploading" | "processing" | "complete" | "error";
  error?: string;
}

interface EditProjectDetailProps {
  project: Project;
  formData: ProjectFormData;
  onChange: (data: ProjectFormData) => void;
  images: ProjectImage[];
  uploads: UploadProgressItem[];
  isUploading: boolean;
  onFilesSelected: (files: FileList) => void;
  onSetMainImage: (imageId: string) => void;
  onDeleteImage: (imageId: string) => void;
}

export function EditProjectDetail({
  project,
  formData,
  onChange,
  images,
  uploads,
  isUploading,
  onFilesSelected,
  onSetMainImage,
  onDeleteImage,
}: EditProjectDetailProps) {
  const handleChange = (field: keyof ProjectFormData, value: string) => {
    onChange({ ...formData, [field]: value });
  };

  const MAX_IMAGES = 10;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">

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

        <div>
          <label className="block text-sm font-medium mb-2">
            Project Images
          </label>
          <ImageGallery
            images={images}
            editable
            onSetMain={onSetMainImage}
            onDelete={onDeleteImage}
          />
          <div className="mt-4">
            <ImageDropZone
              onFilesSelected={onFilesSelected}
              disabled={isUploading || images.length >= MAX_IMAGES}
              maxFiles={MAX_IMAGES}
              currentCount={images.length}
            />
          </div>
          <UploadProgress uploads={uploads} />
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
