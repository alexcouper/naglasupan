"use client";

import Image from "next/image";
import { StarIcon, TrashIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import type { ProjectImage } from "@/lib/api";

interface ImageGalleryProps {
  images: ProjectImage[];
  editable?: boolean;
  onSetMain?: (imageId: string) => void;
  onDelete?: (imageId: string) => void;
}

export function ImageGallery({
  images,
  editable = false,
  onSetMain,
  onDelete,
}: ImageGalleryProps) {
  if (images.length === 0) {
    return null;
  }

  const mainImage = images.find((img) => img.is_main) || images[0];
  const otherImages = images.filter((img) => img.id !== mainImage?.id);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      {mainImage && (
        <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={mainImage.url}
            alt="Main project image"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {editable && (
            <div className="absolute top-2 right-2 flex gap-1">
              <span className="bg-accent text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                <StarIconSolid className="w-3 h-3" />
                Main
              </span>
              <button
                onClick={() => onDelete?.(mainImage.id)}
                className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                title="Delete image"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Additional Images Grid */}
      {otherImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {otherImages.map((image) => (
            <div
              key={image.id}
              className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group"
            >
              <Image
                src={image.url}
                alt={image.original_filename}
                fill
                className="object-cover"
                sizes="150px"
              />
              {editable && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => onSetMain?.(image.id)}
                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                    title="Set as main image"
                  >
                    <StarIcon className="w-4 h-4 text-gray-700" />
                  </button>
                  <button
                    onClick={() => onDelete?.(image.id)}
                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                    title="Delete image"
                  >
                    <TrashIcon className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
