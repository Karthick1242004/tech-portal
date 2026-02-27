'use client';

import { useCallback, useRef } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ImageFile {
  id: string;
  file: File;
  preview: string;
  dataUrl: string;
}

interface ImageUploaderProps {
  images: ImageFile[];
  onImagesChange: (images: ImageFile[]) => void;
  maxImages?: number;
  maxSizeMB?: number;
}

export function ImageUploader({
  images,
  onImagesChange,
  maxImages = 4,
  maxSizeMB = 5,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files) return;

      const fileArray = Array.from(files);
      const remainingSlots = maxImages - images.length;

      if (remainingSlots <= 0) {
        return;
      }

      const filesToAdd = fileArray.slice(0, remainingSlots);
      const validFiles: ImageFile[] = [];

      for (const file of filesToAdd) {
        if (!file.type.startsWith('image/')) {
          continue;
        }
        if (file.size > maxSizeBytes) {
          continue;
        }

        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });

        validFiles.push({
          id: `${Date.now()}-${Math.random()}`,
          file,
          preview: dataUrl,
          dataUrl,
        });
      }

      onImagesChange([...images, ...validFiles]);
    },
    [images, maxImages, maxSizeBytes, onImagesChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const removeImage = useCallback(
    (id: string) => {
      onImagesChange(images.filter((img) => img.id !== id));
    },
    [images, onImagesChange]
  );

  const glassCard = "bg-white/80 dark:bg-slate-950/50 backdrop-blur-md border border-white/20 dark:border-slate-800/50 rounded-xl p-5 shadow-lg shadow-black/5 transition-all duration-300 hover:shadow-xl hover:bg-white/90 dark:hover:bg-slate-950/60";

  return (
    <div className={glassCard}>
      <label className="block text-sm font-semibold mb-3 text-foreground/80">
        Images <span className="text-xs text-muted-foreground font-normal">(Optional, max {maxImages})</span>
      </label>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 group"
            >
              <img
                src={image.preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(image.id)}
                className="absolute top-2 right-2 p-1.5 bg-destructive/90 hover:bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                aria-label="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-2">
                <p className="text-xs text-white truncate">{image.file.name}</p>
                <p className="text-xs text-white/70">
                  {(image.file.size / 1024).toFixed(0)} KB
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Zone */}
      {images.length < maxImages && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all",
            "border-slate-300/50 dark:border-slate-700/50",
            "hover:border-primary/50 hover:bg-slate-50/50 dark:hover:bg-slate-900/50",
            "bg-slate-50/30 dark:bg-slate-900/30"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
          
          <div className="flex flex-col items-center gap-3">
            <div className="p-4 bg-primary/10 rounded-full">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground/80 mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, GIF up to {maxSizeMB}MB ({maxImages - images.length} remaining)
              </p>
            </div>
          </div>
        </div>
      )}

      {images.length >= maxImages && (
        <div className="flex items-center gap-2 p-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/50 rounded-lg">
          <ImageIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <p className="text-sm text-blue-600 dark:text-blue-400">
            Maximum {maxImages} images reached
          </p>
        </div>
      )}
    </div>
  );
}
