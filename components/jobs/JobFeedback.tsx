'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Clock, Loader2, Image as ImageIcon } from 'lucide-react';
import type { Job } from '@/lib/mock-jobs';
import { apiClient } from '@/lib/api';

interface JobFeedbackProps {
  job: Job;
  selectedImages: File[];
  setSelectedImages: (images: File[]) => void;
  setPreviewUrls: (urls: string[]) => void;
}

export function JobFeedback({ job, selectedImages, setSelectedImages, setPreviewUrls }: JobFeedbackProps) {
  const [feedbackText, setFeedbackText] = useState(job.feedbackText || '');
  const [hoursWorked, setHoursWorked] = useState(job.hoursWorked?.toString() || '0');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
        const formData = new FormData();
        formData.append('jobId', job.id);
        formData.append('content', feedbackText);
        formData.append('hoursWorked', hoursWorked);
        formData.append('equipmentId', job.equipment.id);
        
        selectedImages.forEach(file => {
            formData.append('images', file);
        });

        await apiClient.postFormData('/feedback', formData);

        toast({
            title: 'Success',
            description: 'Feedback and images submitted successfully',
            className: "text-white",
        });
        
        // Optional: Clear form or redirect
        setSelectedImages([]);
        setPreviewUrls([]);
    } catch (error: any) {
        console.error('Feedback submit error:', error);
        toast({
            title: 'Submission Failed',
            description: error.message || 'Failed to submit feedback',
            variant: 'destructive'
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" aria-label="Job feedback form">
      <Card className="p-4">
        <Label htmlFor="feedback" className="text-sm font-semibold">
          Work Completed / Feedback
        </Label>
        <Textarea
          id="feedback"
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
          placeholder="Describe the work completed, any issues found, and recommendations..."
          className="mt-2 min-h-[120px]"
          disabled={isSubmitting}
          aria-label="Enter work completed and feedback details"
          required
        />
      </Card>

      <Card className="p-4 bg-muted/30">
        <Label className="text-sm font-semibold flex items-center gap-2 mb-3">
            <ImageIcon className="w-4 h-4" />
            Images Attached ({selectedImages.length})
        </Label>
        
        {selectedImages.length === 0 ? (
            <p className="text-sm text-muted-foreground">No new images attached. Go to the Images tab to add photos.</p>
        ) : (
             <div className="grid grid-cols-4 gap-2">
                 {selectedImages.map((file, i) => (
                     <div key={i} className="text-xs text-muted-foreground truncate border p-1 rounded bg-background">
                         {file.name}
                     </div>
                 ))}
             </div>
        )}
      </Card>

      <Card className="p-4">
        <Label htmlFor="hours" className="text-sm font-semibold flex items-center gap-2">
          <Clock className="w-4 h-4" aria-hidden="true" />
          Hours Worked
        </Label>
        <Input
          id="hours"
          type="number"
          min="0"
          max="24"
          step="0.5"
          value={hoursWorked}
          onChange={(e) => setHoursWorked(e.target.value)}
          placeholder="Enter hours worked"
          className="mt-2"
          disabled={isSubmitting}
          aria-label="Enter hours worked on this job"
          required
        />
      </Card>

      <Button 
        type="submit" 
        className="w-full" 
        size="lg" 
        disabled={isSubmitting}
        aria-label={isSubmitting ? 'Submitting feedback' : 'Submit feedback for this job'}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
            Submitting...
          </>
        ) : (
          'Submit Feedback'
        )}
      </Button>
    </form>
  );
}
