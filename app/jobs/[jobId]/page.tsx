'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import { useSessionStore } from '@/store/session.store';
import { useTranslationStore } from '@/store/translation.store';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Info, ImageIcon, MessageSquare } from 'lucide-react';
import { getJobById } from '@/lib/api';
import { JobInfo } from '@/components/jobs/JobInfo';
import { JobImages } from '@/components/jobs/JobImages';
import { JobFeedback } from '@/components/jobs/JobFeedback';
import { JobInfoSkeleton } from '@/components/jobs/JobInfoSkeleton';
import { JobImagesSkeleton } from '@/components/jobs/JobImagesSkeleton';
import { JobFeedbackSkeleton } from '@/components/jobs/JobFeedbackSkeleton';
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
  const [activeTab, setActiveTab] = useState<'info' | 'images' | 'feedback'>('info');
  
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
    <div className="min-h-screen flex flex-col pb-24">
      {/* Floating Back Button - Pushed down to avoid logo */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => router.push('/jobs')}
        className="fixed top-14 left-4 z-50 rounded-full shadow-lg bg-background/80 backdrop-blur border-2 hover:scale-110 transition-transform"
        aria-label="Navigate back to jobs list"
      >
        <ArrowLeft className="w-5 h-5" />
      </Button>

      {/* Content */}
      <main className="flex-1 flex justify-center pt-4">
        <div className="w-full max-w-2xl px-4">
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

          {/* Job Details - Tab Content */}
          {!error && (
            <>
              {activeTab === 'info' && (
                isLoading ? (
                  <JobInfoSkeleton />
                ) : (
                  job && (
                    <JobInfo
                      job={job}
                      translatedDescription={translatedDescription || undefined}
                      translatedInstruction={translatedInstruction || undefined}
                      isTranslating={isTranslating}
                      currentLanguage={currentLanguage}
                      onLanguageChange={handleLanguageChange}
                    />
                  )
                )
              )}

              {activeTab === 'images' && (
                isLoading ? <JobImagesSkeleton /> : job && 
                  <JobImages 
                    job={job} 
                    selectedImages={feedbackImages}
                    setSelectedImages={setFeedbackImages}
                    previewUrls={feedbackPreviewUrls}
                    setPreviewUrls={setFeedbackPreviewUrls}
                  />
              )}

              {activeTab === 'feedback' && (
                isLoading ? <JobFeedbackSkeleton /> : job && 
                  <JobFeedback 
                    job={job} 
                    selectedImages={feedbackImages}
                    setSelectedImages={setFeedbackImages}
                    setPreviewUrls={setFeedbackPreviewUrls}
                  />
              )}
            </>
          )}
        </div>
      </main>

      {/* Floating Bottom Dock - Compact and matched radius */}
      {!error && (
        <div className="fixed bottom-4 left-4 right-4 z-50 flex justify-center">
          <div className="bg-background/95 backdrop-blur-lg border rounded-xl shadow-2xl p-1 flex gap-1 max-w-md w-full">
            <button
              onClick={() => setActiveTab('info')}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 px-4 rounded-lg transition-all ${
                activeTab === 'info'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              }`}
              aria-label="View job information"
            >
              <Info className="w-5 h-5" />
              <span className="text-[10px] font-medium">Info</span>
            </button>

            <button
              onClick={() => setActiveTab('images')}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 px-4 rounded-lg transition-all ${
                activeTab === 'images'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              }`}
              aria-label="View job images"
            >
              <ImageIcon className="w-5 h-5" />
              <span className="text-[10px] font-medium">Images</span>
            </button>

            <button
              onClick={() => setActiveTab('feedback')}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 px-4 rounded-lg transition-all ${
                activeTab === 'feedback'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              }`}
              aria-label="Submit job feedback"
            >
              <MessageSquare className="w-5 h-5" />
              <span className="text-[10px] font-medium">Feedback</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
