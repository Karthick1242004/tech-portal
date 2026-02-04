'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Phone, User, AlertTriangle, Loader2 } from 'lucide-react';
import type { Job } from '@/lib/mock-jobs';

interface JobInfoProps {
  job: Job;
  translatedDescription?: string;
  translatedInstruction?: string;
  isTranslating?: boolean;
}

export function JobInfo({ job, translatedDescription, translatedInstruction, isTranslating }: JobInfoProps) {
  const getPriorityColor = (priority: Job['priority']) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-destructive text-destructive-foreground';
      case 'MEDIUM':
        return 'bg-yellow-500 text-white';
      case 'LOW':
        return 'bg-green-600 text-white';
    }
  };

  return (
    <div className="space-y-4">
      {/* Job ID */}
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
            <svg
              className="w-5 h-5 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Job ID</p>
            <p className="font-semibold">{job.id}</p>
          </div>
        </div>
      </Card>

      {/* Process / Function */}
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
            <svg
              className="w-5 h-5 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Process / Function</p>
            <p className="font-semibold">{job.processFunction.description}</p>
          </div>
        </div>
      </Card>

      {/* Job Description */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold mb-2">Job Description</h3>
        {isTranslating ? (
          <div className="flex items-center gap-2 py-2">
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Translating...</span>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {translatedDescription || job.description}
          </p>
        )}
      </Card>

      {/* Job Instruction */}
      <Card className="p-4">
        <div className="flex items-start gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
          <h3 className="text-sm font-semibold">Job Instruction</h3>
        </div>
        {isTranslating ? (
          <div className="flex items-center gap-2 py-2">
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Translating...</span>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {translatedInstruction || job.jobInstruction}
          </p>
        )}
      </Card>

      {/* Priority */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Priority</p>
          <Badge className={getPriorityColor(job.priority)}>
            {job.priority} PRIORITY
          </Badge>
        </div>
      </Card>

      {/* Planned Start */}
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
            <Clock className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Planned Start</p>
            <p className="font-semibold">{job.plannedStart}</p>
          </div>
        </div>
      </Card>

      {/* Target Completion */}
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
            <Clock className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Target Completion</p>
            <p className="font-semibold">{job.targetEnd}</p>
          </div>
        </div>
      </Card>

      {/* Contact Person */}
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
            <User className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Contact Person</p>
            <p className="font-semibold">{job.contact.name}</p>
            <div className="flex items-center gap-1 mt-1">
              <Phone className="w-3 h-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{job.contact.phone}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
