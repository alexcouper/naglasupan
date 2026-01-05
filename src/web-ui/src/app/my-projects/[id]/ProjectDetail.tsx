"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PencilIcon, EyeIcon, CloudArrowUpIcon, TrashIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/auth";
import { fetchMyProject } from "@/app/actions";
import { apiClient } from "@/lib/api";
import type { Project, ProjectImage } from "@/lib/api";
import { ReadOnlyProjectDetail } from "./ReadOnlyProjectDetail";
import { EditProjectDetail, type ProjectFormData } from "./EditProjectDetail";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { useImageUpload } from "@/hooks/useImageUpload";

type ViewMode = "edit" | "preview";

interface ProjectDetailProps {
  projectId: string;
}

export function ProjectDetail({ projectId }: ProjectDetailProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, getToken } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("edit");
  const [formData, setFormData] = useState<ProjectFormData | null>(null);
  const [formInitialized, setFormInitialized] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [images, setImages] = useState<ProjectImage[]>([]);

  // Image upload hook
  const { uploads, uploadFiles, isUploading } = useImageUpload({
    projectId,
    onUploadComplete: (image) => {
      setImages((prev) => [...prev, image]);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isAuthenticated && projectId) {
      loadProject();
    }
  }, [authLoading, isAuthenticated, projectId, router]);

  const loadProject = async () => {
    const token = getToken();
    if (!token) {
      setError("Not authenticated");
      setIsLoading(false);
      return;
    }

    const result = await fetchMyProject(projectId, token);
    if (result.error) {
      setError(result.error);
    } else if (result.project) {
      setProject(result.project);
      setImages(result.project.images || []);
      if (!formInitialized) {
        setFormData({
          title: result.project.title,
          website_url: result.project.website_url,
          description: result.project.description,
        });
        setFormInitialized(true);
      }
    }
    setIsLoading(false);
  };

  const handleFormChange = useCallback((data: ProjectFormData) => {
    setFormData(data);
  }, []);

  const handleSave = async () => {
    if (!formData || !project) return;

    setIsSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      const updatedProject = await apiClient.updateProject(project.id, {
        title: formData.title,
        description: formData.description,
        website_url: formData.website_url,
      });
      setProject(updatedProject);
      setSuccessMessage("Project saved successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save project");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!project) return;

    setIsDeleting(true);
    setError("");

    try {
      await apiClient.deleteProject(project.id);
      router.push("/my-projects");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete project");
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleSetMainImage = async (imageId: string) => {
    try {
      const updatedImage = await apiClient.setMainImage(projectId, imageId);
      setImages((prev) =>
        prev.map((img) => ({
          ...img,
          is_main: img.id === updatedImage.id,
        }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to set main image");
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      await apiClient.deleteImage(projectId, imageId);
      setImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete image");
    }
  };

  const handleFilesSelected = (files: FileList) => {
    uploadFiles(files);
  };

  const previewProject: Project | null =
    project && formData
      ? {
          ...project,
          title: formData.title,
          website_url: formData.website_url,
          description: formData.description,
          images: images,
        }
      : project;

  if (authLoading || isLoading) {
    return <p className="text-gray-600">Loading...</p>;
  }

  if (error && !project) {
    return (
      <div className="text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Link href="/my-projects" className="text-accent hover:underline">
          &larr; Back to my projects
        </Link>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center">
        <p className="text-gray-600 mb-4">Project not found</p>
        <Link href="/my-projects" className="text-accent hover:underline">
          &larr; Back to my projects
        </Link>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          {successMessage}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-1">
          <button
            onClick={() => setViewMode("edit")}
            title="Edit"
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "edit"
                ? "bg-gray-200 text-gray-900"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            }`}
          >
            <PencilIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("preview")}
            title="Preview"
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "preview"
                ? "bg-gray-200 text-gray-900"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            }`}
          >
            <EyeIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-1">
          <button
            onClick={handleSave}
            disabled={isSaving}
            title="Save"
            className="px-3 py-2 rounded-lg text-gray-500 border border-gray-200 hover:bg-gray-100 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <ArrowPathIcon className="w-5 h-5 animate-spin" />
            ) : (
              <span className="flex items-center gap-1">Save <CloudArrowUpIcon className="w-5 h-5" /></span>
            )}
          </button>
          <button
            onClick={() => setShowDeleteDialog(true)}
            title="Delete"
            className="p-2 rounded-lg text-gray-500 border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {viewMode === "edit" && formData ? (
        <EditProjectDetail
          project={project}
          formData={formData}
          onChange={handleFormChange}
          images={images}
          uploads={uploads}
          isUploading={isUploading}
          onFilesSelected={handleFilesSelected}
          onSetMainImage={handleSetMainImage}
          onDeleteImage={handleDeleteImage}
        />
      ) : (
        previewProject && <ReadOnlyProjectDetail project={previewProject} />
      )}

      <div className="mt-8 text-center">
        <Link href="/my-projects" className="text-accent hover:underline">
          &larr; Back to my projects
        </Link>
      </div>

      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        projectTitle={project.title || "Untitled Project"}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
        isDeleting={isDeleting}
      />
    </>
  );
}
