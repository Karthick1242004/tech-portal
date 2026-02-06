'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import { useSessionStore } from '@/store/session.store';
import { useTranslationStore } from '@/store/translation.store';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';
import { getJobById } from '@/lib/api';
import { JobInfo } from '@/components/jobs/JobInfo';
import { JobImages } from '@/components/jobs/JobImages';
import { JobFeedback } from '@/components/jobs/JobFeedback';
import { JobInfoSkeleton } from '@/components/jobs/JobInfoSkeleton';
import { JobImagesSkeleton } from '@/components/jobs/JobImagesSkeleton';
import { JobFeedbackSkeleton } from '@/components/jobs/JobFeedbackSkeleton';
import { LanguageSelector } from '@/components/jobs/LanguageSelector';
import type { Job } from '@/lib/mock-jobs';

export default function JobDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, isTestMode } = useSessionStore();
  const { currentLanguage, setLanguage, getTranslation, setTranslation } = useTranslationStore();
  const jobId = params.jobId as string;

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
    <div className="min-h-screen bg-background flex flex-col">
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
                  <h1 className="text-2xl font-bold tracking-tight">Job Details</h1>
                  <p className="text-sm text-muted-foreground">
                    {job.equipment.id} - {job.equipment.name}
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
