'use client';

import React from "react"

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Clock, Loader2 } from 'lucide-react';
import type { Job } from '@/lib/mock-jobs';

interface JobFeedbackProps {
  job: Job;
}

export function JobFeedback({ job }: JobFeedbackProps) {
  const [feedbackText, setFeedbackText] = useState(job.feedbackText);
  const [hoursWorked, setHoursWorked] = useState(job.hoursWorked.toString());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: 'Success',
      description: 'Feedback submitted successfully',
    });

    setIsSubmitting(false);
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
