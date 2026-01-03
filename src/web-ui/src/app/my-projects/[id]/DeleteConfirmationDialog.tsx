"use client";

import { useState, useEffect } from "react";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  projectTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export function DeleteConfirmationDialog({
  isOpen,
  projectTitle,
  onConfirm,
  onCancel,
  isDeleting = false,
}: DeleteConfirmationDialogProps) {
  const [confirmText, setConfirmText] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setConfirmText("");
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const canDelete = confirmText.toLowerCase() === "delete";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onCancel}
        aria-hidden="true"
      />

      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <h2 className="text-xl font-semibold text-red-600 mb-4">
          Delete Project
        </h2>

        <p className="text-gray-700 mb-4">
          Are you sure you want to delete{" "}
          <strong>&quot;{projectTitle}&quot;</strong>? This action cannot be
          undone.
        </p>

        <p className="text-sm text-gray-600 mb-4">
          Type <strong className="text-red-600">delete</strong> to confirm:
        </p>

        <input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          className="input mb-6"
          placeholder="Type 'delete' to confirm"
          autoFocus
          disabled={isDeleting}
        />

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!canDelete || isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? "Deleting..." : "Delete Project"}
          </button>
        </div>
      </div>
    </div>
  );
}
