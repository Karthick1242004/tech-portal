'use client';

import React from "react"

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Camera, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Job } from '@/lib/mock-jobs';
import Image from 'next/image';

interface JobImagesProps {
  job: Job;
  selectedImages: File[];
  setSelectedImages: (images: File[]) => void;
  previewUrls: string[];
  setPreviewUrls: (urls: string[]) => void;
}

export function JobImages({ job, selectedImages, setSelectedImages, previewUrls, setPreviewUrls }: JobImagesProps) {
  const maxImages = 4;
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Calculate total including existing job images
    // Note: If backend supports only 4 images TOTAL, we should count job.images too.
    // Assuming job.images are READ ONLY and we can add up to 4 NEW images? 
    // Or 4 TOTAL? The prompt says "Max 4". Let's assume 4 Total slots available.
    const totalCurrent = job.images.length + selectedImages.length;
    const remainingSlots = maxImages - totalCurrent;
    
    if (remainingSlots <= 0) {
        toast({
            title: 'Maximum images reached',
            description: `You can only have a total of ${maxImages} images.`,
            variant: 'destructive',
        });
        return;
    }

    const availableFiles = files.slice(0, remainingSlots);

    const newPreviewUrls = availableFiles.map(file => URL.createObjectURL(file));
    
    setSelectedImages([...selectedImages, ...availableFiles]);
    setPreviewUrls([...previewUrls, ...newPreviewUrls]);
  };

  const handleRemoveImage = (index: number) => {
    const urlToRemove = previewUrls[index];
    URL.revokeObjectURL(urlToRemove);

    const newSelected = selectedImages.filter((_, i) => i !== index);
    const newPreviews = previewUrls.filter((_, i) => i !== index);

    setSelectedImages(newSelected);
    setPreviewUrls(newPreviews);
  };

  const totalDisplayed = job.images.length + selectedImages.length;
  const emptySlots = maxImages - totalDisplayed;

  // Show empty state if no images exist
  if (job.images.length === 0 && selectedImages.length === 0) {
    return (
      <div className="space-y-4">
        <Card className="flex flex-col items-center justify-center py-12 px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Camera className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No images uploaded</h3>
          <p className="text-sm text-muted-foreground mb-6">
            No images have been uploaded for this job yet.
          </p>
          <label htmlFor="image-upload-empty">
            <Button type="button" variant="default" asChild>
              <span>
                <Camera className="w-4 h-4 mr-2" />
                Upload First Photo
              </span>
            </Button>
            <input
              id="image-upload-empty"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              aria-label="Upload images for this job"
            />
          </label>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Existing Images */}
        {job.images.map((imageUrl, index) => (
          <Card key={`existing-${index}`} className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={`Job image ${index + 1}`}
              fill
              className="object-cover"
            />
          </Card>
        ))}

        {/* Selected Images with Remove Button */}
        {previewUrls.map((url, index) => (
          <Card key={`selected-${index}`} className="relative aspect-[4/3] overflow-hidden group">
            <Image
              src={url || "/placeholder.svg"}
              alt={`Selected image ${index + 1}`}
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="absolute top-2 right-2 w-8 h-8 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </Card>
        ))}

        {/* Empty Slots */}
        {Array.from({ length: emptySlots }).map((_, index) => (
          <Card
            key={`empty-${index}`}
            className="aspect-[4/3] flex items-center justify-center bg-muted/50 border-dashed"
          >
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-2">
                <Plus className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">Add Photo</p>
            </div>
          </Card>
        ))}
      </div>

      <label htmlFor="image-upload">
        <Button type="button" className="w-full bg-transparent" variant="outline" asChild>
          <span>
            <Camera className="w-4 h-4 mr-2" />
            Add Photo
          </span>
        </Button>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          aria-label="Upload additional images for this job"
        />
      </label>

      <p className="text-xs text-center text-muted-foreground">
        Maximum {maxImages} photos allowed
      </p>
    </div>
  );
}
