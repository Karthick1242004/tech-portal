'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Hash, ImageIcon, X } from 'lucide-react';
import type { Feedback } from '@/lib/mock-feedback';

interface FeedbackCardProps {
  feedback: Feedback;
}

export function FeedbackCard({ feedback }: FeedbackCardProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <>
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3 className="font-semibold text-base">{feedback.equipmentName}</h3>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <Hash className="w-3 h-3" />
                <span>{feedback.jobId}</span>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              {feedback.hoursWorked}h
            </Badge>
          </div>

          {/* Technician */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="w-4 h-4" />
            <span>{feedback.technicianName}</span>
          </div>

          {/* Feedback Text */}
          <p className="text-sm text-foreground/80 line-clamp-3">
            {feedback.feedbackText}
          </p>

          {/* Images */}
          {feedback.images.length > 0 && (
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-muted-foreground" />
              <div className="flex gap-2">
                {feedback.images.slice(0, 3).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className="relative w-24 h-24 rounded border overflow-hidden hover:ring-2 hover:ring-primary transition-all shadow-sm"
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Feedback image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
                {feedback.images.length > 3 && (
                  <div className="w-24 h-24 rounded border flex items-center justify-center bg-muted text-lg font-medium">
                    +{feedback.images.length - 3}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Timestamp */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
            <Clock className="w-3 h-3" />
            <span>{formatDate(feedback.createdAt)}</span>
          </div>
        </div>
      </Card>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative w-full max-w-5xl h-[85vh] flex items-center justify-center">
            <img
              src={selectedImage || "/placeholder.svg"}
              alt="Preview"
              className="max-w-full max-h-full object-contain rounded-md shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
}
