"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import type { ImageRecord, ImageCategory } from "@/types";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: ImageRecord[];
  className?: string;
}

export function ImageGallery({ images, className }: ImageGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const visibleImages = images.slice(0, 5);
  const remaining = images.length - visibleImages.length;

  if (images.length === 0) {
    return (
      <div className={cn("h-64 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200", className)}>
        <p className="text-sm text-slate-400">No images added yet</p>
      </div>
    );
  }

  return (
    <>
      {/* Gallery grid */}
      <div className={cn("grid grid-cols-4 grid-rows-2 gap-1.5 h-72 rounded-xl overflow-hidden", className)}>
        {/* Main hero image */}
        <div
          className="col-span-2 row-span-2 relative cursor-pointer overflow-hidden group"
          onClick={() => setLightboxIndex(0)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={visibleImages[0].url}
            alt={visibleImages[0].altText ?? visibleImages[0].caption}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <ZoomIn className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Smaller images */}
        {visibleImages.slice(1, 5).map((img, i) => (
          <div
            key={img.id}
            className="relative cursor-pointer overflow-hidden group bg-slate-100"
            onClick={() => setLightboxIndex(i + 1)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.url}
              alt={img.altText ?? img.caption}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* "See all" overlay on last tile */}
            {i === 3 && remaining > 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white text-sm font-semibold">+{remaining + 1} more</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-slate-300 transition-colors"
            onClick={() => setLightboxIndex(null)}
          >
            <X className="w-7 h-7" />
          </button>

          {lightboxIndex > 0 && (
            <button
              className="absolute left-4 text-white hover:text-slate-300 transition-colors"
              onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => (i! - 1 + images.length) % images.length); }}
            >
              <ChevronLeft className="w-9 h-9" />
            </button>
          )}

          <div
            className="max-w-4xl max-h-[80vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[lightboxIndex].url}
              alt={images[lightboxIndex].altText ?? images[lightboxIndex].caption}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            {images[lightboxIndex].caption && (
              <p className="text-white/80 text-sm text-center mt-3">
                {images[lightboxIndex].caption}
              </p>
            )}
            <p className="text-white/50 text-xs text-center mt-1">
              {lightboxIndex + 1} / {images.length}
            </p>
          </div>

          {lightboxIndex < images.length - 1 && (
            <button
              className="absolute right-4 text-white hover:text-slate-300 transition-colors"
              onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => (i! + 1) % images.length); }}
            >
              <ChevronRight className="w-9 h-9" />
            </button>
          )}
        </div>
      )}
    </>
  );
}

// ─── Floor Plan Gallery ───────────────────────────────────────────────────────

interface FloorPlanGalleryProps {
  images: ImageRecord[];
}

export function FloorPlanGallery({ images }: FloorPlanGalleryProps) {
  const floorPlans = images.filter((i) => i.category === "floor-plan");
  const bhkTypes = [...new Set(floorPlans.map((i) => i.unitType ?? "General"))];
  const [activeType, setActiveType] = useState(bhkTypes[0] ?? "");
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  if (floorPlans.length === 0) {
    return (
      <div className="h-40 bg-slate-50 rounded-xl border border-dashed border-slate-300 flex items-center justify-center">
        <p className="text-sm text-slate-400">Floor plans not yet available</p>
      </div>
    );
  }

  const visible = floorPlans.filter((i) => (i.unitType ?? "General") === activeType);

  return (
    <>
      {/* Type tabs */}
      <div className="flex gap-2 mb-3 flex-wrap">
        {bhkTypes.map((t) => (
          <button
            key={t}
            onClick={() => setActiveType(t)}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium border transition-colors",
              activeType === t
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-slate-600 border-slate-300 hover:border-blue-400"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {visible.map((img) => (
          <div
            key={img.id}
            className="cursor-pointer group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 aspect-square"
            onClick={() => setLightboxUrl(img.url)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.url}
              alt={img.caption ?? img.unitType ?? "Floor plan"}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {img.towerName && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1">
                <p className="text-white text-[11px] text-center">{img.towerName}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightboxUrl(null)}
        >
          <button className="absolute top-4 right-4 text-white" onClick={() => setLightboxUrl(null)}>
            <X className="w-7 h-7" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightboxUrl} alt="Floor plan" className="max-w-full max-h-[85vh] object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </>
  );
}
