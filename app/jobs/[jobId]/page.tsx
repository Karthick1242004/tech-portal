'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import { useSessionStore } from '@/store/session.store';
import { useSessionValidator } from '@/hooks/useSessionValidator';
import { useTranslationStore } from '@/store/translation.store';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';
import { getJobById } from '@/lib/api';
import { JobInfo } from '@/components/jobs/JobInfo';
import { JobImages } from '@/components/jobs/JobImages';
import { JobFeedback } from '@/components/jobs/JobFeedback';
import { JobSkeleton } from '@/components/jobs/JobSkeleton';
import { JobInfoSkeleton } from '@/components/jobs/JobInfoSkeleton';
import { SessionEndedCard } from '@/components/system/SessionEndedCard';
import { JobImagesSkeleton } from '@/components/jobs/JobImagesSkeleton';
import { JobFeedbackSkeleton } from '@/components/jobs/JobFeedbackSkeleton';
import { LanguageSelector } from '@/components/jobs/LanguageSelector';
import type { Job } from '@/lib/mock-jobs';

export default function JobDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, isTestMode, isInvalidated } = useSessionStore();
  const { currentLanguage, setLanguage, getTranslation, setTranslation } = useTranslationStore();
  const jobId = params.jobId as string;
  
  // Poll session validity
  useSessionValidator();

  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedDescription, setTranslatedDescription] = useState<string | null>(null);
  const [translatedInstruction, setTranslatedInstruction] = useState<string | null>(null);
  
  // Shared state for Feedback and Images
  const [feedbackImages, setFeedbackImages] = useState<File[]>([]);
  const [feedbackPreviewUrls, setFeedbackPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    // Auth check - commented out for testing
    // if (!isAuthenticated && !isTestMode) {
    //   router.push('/login');
    // }
  }, [isAuthenticated, isTestMode, router]);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const jobData = await getJobById(jobId);
        
        if (!jobData) {
          setError('Job not found');
        } else {
          setJob(jobData);
        }
      } catch (err) {
        console.error('[v0] Failed to load job:', err);
        setError('Failed to load job details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  // If session was invalidated, show SessionEndedCard
  if (isInvalidated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <SessionEndedCard />
      </div>
    );
  }

  if (error) {
    // If there's an error and it's not loading, we can show a specific error message or redirect
    // For now, we'll let the main render block handle the error display.
    // This `if (error)` block is here to match the instruction's structure,
    // but its content is adjusted to maintain syntactic correctness.
  }

  const handleLanguageChange = async (language: string) => {
    if (!job) return;

    setLanguage(language);
    
    if (language === 'en') {
      setTranslatedDescription(null);
      setTranslatedInstruction(null);
      return;
    }

    // Check cache first
    const cachedDesc = getTranslation(`${jobId}-description-${language}`);
    const cachedInstr = getTranslation(`${jobId}-instruction-${language}`);

    if (cachedDesc && cachedInstr) {
      setTranslatedDescription(cachedDesc);
      setTranslatedInstruction(cachedInstr);
      return;
    }

    setIsTranslating(true);

    try {
      console.log('[v0] Starting translation to:', language);
      
      // Translate description
      const descResponse = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: job.description,
          source: 'en',
          target: language,
          format: 'text',
        }),
      });

      const descData = await descResponse.json();
      console.log('[v0] Description translation response:', descData);

      // Translate instruction
      const instrResponse = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: job.jobInstruction,
          source: 'en',
          target: language,
          format: 'text',
        }),
      });

      const instrData = await instrResponse.json();
      console.log('[v0] Instruction translation response:', instrData);

      // Update state and cache
      const descTranslation = descData.translatedText || descData.result || job.description;
      const instrTranslation = instrData.translatedText || instrData.result || job.jobInstruction;
      
      console.log('[v0] Setting translations:', { descTranslation, instrTranslation });
      
      setTranslatedDescription(descTranslation);
      setTranslatedInstruction(instrTranslation);
      setTranslation(`${jobId}-description-${language}`, descTranslation);
      setTranslation(`${jobId}-instruction-${language}`, instrTranslation);
    } catch (err) {
      console.error('[v0] Translation failed:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  if (!isAuthenticated && !isTestMode) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
        <div className="flex justify-center">
          <div className="w-full max-w-2xl px-4 py-4">
            <Button
              variant="ghost"
              onClick={() => router.push('/jobs')}
              className="gap-2 mb-4"
              aria-label="Navigate back to jobs list"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Jobs
            </Button>

              {job && (
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h1 className="text-2xl font-bold tracking-tight">{job.equipment.id} - {job.equipment.name}</h1>
                      <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        job.priority === 'HIGH' ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800' :
                        job.priority === 'MEDIUM' ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800' :
                        'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-800'
                      }`}>
                        {job.priority}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {job.processFunction.id} - {job.processFunction.description}
                    </p>
                  </div>
                  <LanguageSelector
                    value={currentLanguage}
                    onChange={handleLanguageChange}
                    disabled={isTranslating}
                  />
                </div>
              )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex justify-center">
        <div className="w-full max-w-2xl px-4 py-6">
          {/* Error State */}
          {error && !isLoading && (
            <div className="text-center py-12">
              <p className="text-destructive font-medium">{error}</p>
              <Button
                onClick={() => router.push('/jobs')}
                variant="outline"
                className="mt-4"
              >
                Return to Jobs
              </Button>
            </div>
          )}

          {/* Job Details */}
          {!error && (
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-3" role="tablist" aria-label="Job details sections">
                <TabsTrigger value="info" aria-label="View job information">Info</TabsTrigger>
                <TabsTrigger value="images" aria-label="View job images">Images</TabsTrigger>
                <TabsTrigger value="feedback" aria-label="Submit job feedback">Feedback</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="mt-6">
                {isLoading ? (
                  <JobInfoSkeleton />
                ) : (
                  job && (
                    <JobInfo
                      job={job}
                      translatedDescription={translatedDescription || undefined}
                      translatedInstruction={translatedInstruction || undefined}
                      isTranslating={isTranslating}
                    />
                  )
                )}
              </TabsContent>

              <TabsContent value="images" className="mt-6">
                {isLoading ? <JobImagesSkeleton /> : job && 
                  <JobImages 
                    job={job} 
                    selectedImages={feedbackImages}
                    setSelectedImages={setFeedbackImages}
                    previewUrls={feedbackPreviewUrls}
                    setPreviewUrls={setFeedbackPreviewUrls}
                  />
                }
              </TabsContent>

              <TabsContent value="feedback" className="mt-6">
                {isLoading ? <JobFeedbackSkeleton /> : job && 
                  <JobFeedback 
                    job={job} 
                    selectedImages={feedbackImages}
                    setSelectedImages={setFeedbackImages}
                    setPreviewUrls={setFeedbackPreviewUrls}
                  />
                }
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
    </div>
  );
}
