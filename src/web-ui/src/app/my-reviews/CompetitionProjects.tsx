"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Bars3Icon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { apiClient, ReviewProject } from "@/lib/api";

interface CompetitionProjectsProps {
  competitionId: string;
  projects: ReviewProject[];
  isCompleted: boolean;
  onProjectSelect: (project: ReviewProject) => void;
  onProjectsReorder: (projects: ReviewProject[]) => void;
  onFinishReview: () => void;
}

export function CompetitionProjects({
  competitionId,
  projects,
  isCompleted,
  onProjectSelect,
  onProjectsReorder,
  onFinishReview,
}: CompetitionProjectsProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      if (isCompleted) return;

      const { active, over } = event;

      if (over && active.id !== over.id) {
        const oldIndex = projects.findIndex((p) => p.id === active.id);
        const newIndex = projects.findIndex((p) => p.id === over.id);

        const newProjects = arrayMove(projects, oldIndex, newIndex);
        onProjectsReorder(newProjects);

        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }

        saveTimeoutRef.current = setTimeout(async () => {
          setIsSaving(true);
          setSaveError(null);
          try {
            await apiClient.updateRankings(
              competitionId,
              newProjects.map((p) => p.id)
            );
          } catch {
            setSaveError("Failed to save rankings");
          }
          setIsSaving(false);
        }, 500);
      }
    },
    [projects, competitionId, onProjectsReorder, isCompleted]
  );

  const handleFinishReview = async () => {
    setIsFinishing(true);
    try {
      await apiClient.updateReviewStatus(competitionId, "completed");
      onFinishReview();
    } catch {
      setSaveError("Failed to finish review");
    }
    setIsFinishing(false);
  };

  if (projects.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-600">No projects in this competition.</p>
      </div>
    );
  }

  const content = (
    <div className="space-y-3">
      {projects.map((project, index) => (
        <ProjectCard
          key={project.id}
          project={project}
          rank={index + 1}
          isCompleted={isCompleted}
          onSelect={() => onProjectSelect(project)}
        />
      ))}
    </div>
  );

  return (
    <div>
      <div className="h-6 mb-4 text-sm text-gray-500">
        {isCompleted ? (
          <span className="text-green-600 flex items-center gap-1">
            <CheckCircleIcon className="w-4 h-4" />
            Review completed
          </span>
        ) : (
          <>
            {isSaving && "Saving..."}
            {saveError && <span className="text-red-500">{saveError}</span>}
            {!isSaving && !saveError && (
              <span className="text-gray-400">Drag to reorder</span>
            )}
          </>
        )}
      </div>

      {isCompleted ? (
        content
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={projects.map((p) => p.id)}
            strategy={verticalListSortingStrategy}
          >
            {content}
          </SortableContext>
        </DndContext>
      )}

      {!isCompleted && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handleFinishReview}
            disabled={isFinishing}
            className="w-full btn-sketchy disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isFinishing ? "Finishing..." : "Finish Review"}
          </button>
        </div>
      )}
    </div>
  );
}

function ProjectCard({
  project,
  rank,
  isCompleted,
  onSelect,
}: {
  project: ReviewProject;
  rank: number;
  isCompleted: boolean;
  onSelect: () => void;
}) {
  if (isCompleted) {
    return (
      <div className="flex items-center gap-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-500">
          {rank}
        </div>

        {project.main_image_url && (
          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            <Image
              src={project.main_image_url}
              alt={project.title}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
        )}

        <button onClick={onSelect} className="flex-1 text-left min-w-0">
          <h3 className="font-medium truncate text-gray-600">
            {project.title || "Untitled"}
          </h3>
          <p className="text-gray-400 text-sm truncate">{project.website_url}</p>
        </button>
      </div>
    );
  }

  return <SortableProjectCard project={project} rank={rank} onSelect={onSelect} />;
}

function SortableProjectCard({
  project,
  rank,
  onSelect,
}: {
  project: ReviewProject;
  rank: number;
  onSelect: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-4 bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:border-gray-300 transition-colors"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600"
      >
        <Bars3Icon className="w-5 h-5" />
      </button>

      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
        {rank}
      </div>

      {project.main_image_url && (
        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
          <Image
            src={project.main_image_url}
            alt={project.title}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>
      )}

      <button onClick={onSelect} className="flex-1 text-left min-w-0">
        <h3 className="font-medium truncate">{project.title || "Untitled"}</h3>
        <p className="text-gray-500 text-sm truncate">{project.website_url}</p>
      </button>
    </div>
  );
}
