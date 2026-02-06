'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Hash, ImageIcon, X } from 'lucide-react';
import type { Feedback } from '@/lib/mock-feedback';

interface FeedbackCardProps {
  feedback: Feedback;
  index?: number;
}

export function FeedbackCard({ feedback, index = 0 }: FeedbackCardProps) {
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

  // Priority logic based on hours worked
    const getPriorityStyles = (hours: number) => {
    if (hours >= 8) {
      return {
        card: 'border-rose-200/60 bg-gradient-to-br from-white via-rose-50 to-rose-50/30',
        badge: 'bg-rose-100 text-rose-700 border-rose-300',
        icon: 'text-rose-500'
      };
    } else if (hours >= 4) {
      return {
        card: 'border-blue-200/60 bg-gradient-to-br from-white via-blue-50 to-blue-50/30',
        badge: 'bg-blue-100 text-blue-700 border-blue-300',
        icon: 'text-blue-500'
      };
    } else {
      return {
        card: 'border-emerald-200/60 bg-gradient-to-br from-white via-emerald-50 to-emerald-50/30',
        badge: 'bg-emerald-100 text-emerald-700 border-emerald-300',
        icon: 'text-emerald-500'
      };
    }
  };

  const priorityStyles = getPriorityStyles(feedback.hoursWorked);

  return (
    <>
      <Card 
        className={`p-4 border-2 ${priorityStyles.card} hover:shadow-lg hover:scale-[1.01] transition-all duration-300 ease-out animate-slideUp group`}
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3 className="font-semibold text-base group-hover:text-foreground transition-colors">
                {feedback.equipmentName}
              </h3>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <Hash className="w-3 h-3" />
                <span>{feedback.jobId}</span>
              </div>
            </div>
            <Badge variant="outline" className={`text-xs font-medium ${priorityStyles.badge} border transition-all duration-200`}>
              <Clock className={`w-3 h-3 mr-1 ${priorityStyles.icon}`} />
              {feedback.hoursWorked}h
            </Badge>
          </div>

          {/* Technician */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="w-4 h-4" />
            <span>{feedback.technicianName}</span>
          </div>

          {/* Feedback Text */}
          <p className="text-sm text-foreground/80 line-clamp-3 leading-relaxed">
            {feedback.feedbackText}
          </p>

          {/* Images */}
          {feedback.images.length > 0 && (
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-muted-foreground" />
              <div className="flex gap-2 flex-wrap">
                {feedback.images.slice(0, 3).map((image, imgIndex) => (
                  <button
                    key={imgIndex}
                    onClick={() => setSelectedImage(image)}
                    className="relative w-20 h-20 rounded-lg border-2 border-border/50 overflow-hidden hover:ring-2 hover:ring-primary hover:scale-105 hover:shadow-md transition-all duration-200 shadow-sm hover:border-primary/50"
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Feedback image ${imgIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
                {feedback.images.length > 3 && (
                  <div className="w-20 h-20 rounded-lg border-2 border-dashed border-border/50 flex items-center justify-center bg-muted/50 text-sm font-medium text-muted-foreground">
                    +{feedback.images.length - 3}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Timestamp */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border/50">
            <Clock className="w-3 h-3" />
            <span>{formatDate(feedback.createdAt)}</span>
          </div>
        </div>
      </Card>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all duration-200 hover:scale-110 hover:rotate-90"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative w-full max-w-5xl h-[85vh] flex items-center justify-center animate-scaleIn">
            <img
              src={selectedImage || "/placeholder.svg"}
              alt="Preview"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
}
