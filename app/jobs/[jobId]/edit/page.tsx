'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSessionStore } from '@/store/session.store';
import { getJobById, updateJob } from '@/lib/api';
import type { Job } from '@/lib/mock-jobs';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2, Save } from 'lucide-react';

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.jobId as string;
  const { isAuthenticated, isTestMode } = useSessionStore();
  const { toast } = useToast();

  const [job, setJob] = useState<Job | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Only the 5 editable fields
  const [formData, setFormData] = useState({
    description: '',
    scheduledStartDate: '',
    targetDate: '',
    reportText: '',
    text: '',
  });

  // Load current job data to pre-populate the form
  useEffect(() => {
    const fetchJob = async () => {
      try {
        setIsLoadingData(true);
        const jobData = await getJobById(jobId);
        if (!jobData) {
          toast({ variant: 'destructive', title: 'Job not found', className: 'text-white' });
          router.push('/jobs');
          return;
        }
        setJob(jobData);

        // Pre-populate form with current values
        const toDatetimeLocal = (iso?: string | null) => {
          if (!iso) return '';
          // datetime-local requires YYYY-MM-DDTHH:mm format
          return new Date(iso).toISOString().slice(0, 16);
        };

        setFormData({
          description: jobData.description || '',
          scheduledStartDate: toDatetimeLocal(jobData.plannedStart),
          targetDate: toDatetimeLocal(jobData.targetEnd),
          reportText: jobData.reportText || '',
          text: jobData.jobInstruction || '',
        });
      } catch (err: any) {
        toast({ variant: 'destructive', title: 'Failed to load job data', className: 'text-white' });
        router.push('/jobs');
      } finally {
        setIsLoadingData(false);
      }
    };

    if (isAuthenticated || isTestMode) {
      fetchJob();
    }
  }, [jobId, isAuthenticated, isTestMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.description.trim() || !formData.reportText.trim()) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Description and Report Text are required.',
        className: 'text-white',
      });
      return;
    }

    try {
      setIsSubmitting(true);

      await updateJob(jobId, {
        description: formData.description,
        scheduledStartDate: formData.scheduledStartDate
          ? new Date(formData.scheduledStartDate).toISOString()
          : undefined,
        targetDate: formData.targetDate
          ? new Date(formData.targetDate).toISOString()
          : undefined,
        reportText: formData.reportText,
        text: formData.text,
      });

      toast({
        title: 'Job Updated Successfully',
        className: 'bg-emerald-600 text-white border-emerald-700',
      });

      router.push(`/jobs/${jobId}`);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Failed to update job',
        description: error.message || 'An error occurred',
        className: 'text-white',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated && !isTestMode) return null;

  // Consistent glass-card styling with report/page.tsx
  const glassCard =
    'bg-white/80 dark:bg-slate-950/50 backdrop-blur-md border border-white/20 dark:border-slate-800/50 rounded-xl p-5 shadow-lg shadow-black/5 transition-all duration-300 hover:shadow-xl hover:bg-white/90 dark:hover:bg-slate-950/60';
  const glassInput =
    'w-full px-4 py-3 border border-slate-200/50 dark:border-slate-800/50 rounded-lg bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all placeholder:text-muted-foreground/50';
  const labelStyle = 'block text-sm font-semibold mb-2 text-foreground/80';

  if (isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading job data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm">
        <div className="flex justify-center">
          <div className="w-full max-w-2xl px-4 py-4">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => router.push(`/jobs/${jobId}`)}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-200 hover:-translate-x-1"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                Edit Job {jobId}
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="flex justify-center py-8 px-4">
        <div className="w-full max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Description */}
            <div className={glassCard}>
              <label htmlFor="description" className={labelStyle}>
                Description <span className="text-destructive">*</span>
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={`${glassInput} min-h-[100px]`}
                placeholder="Describe the issue or job request..."
                required
              />
            </div>

            {/* Date Range */}
            <div className={`${glassCard} space-y-5`}>
              <h3 className="text-sm font-medium text-muted-foreground/70 uppercase tracking-wider mb-2">
                Schedule
              </h3>

              {/* Scheduled Start Date */}
              <div>
                <label htmlFor="scheduledStartDate" className={labelStyle}>
                  Scheduled Start Date
                </label>
                <input
                  type="datetime-local"
                  id="scheduledStartDate"
                  value={formData.scheduledStartDate}
                  onChange={(e) => setFormData({ ...formData, scheduledStartDate: e.target.value })}
                  className={glassInput}
                />
              </div>

              {/* Target Date */}
              <div>
                <label htmlFor="targetDate" className={labelStyle}>
                  Target Date
                </label>
                <input
                  type="datetime-local"
                  id="targetDate"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                  className={glassInput}
                />
              </div>
            </div>

            {/* Report Text */}
            <div className={glassCard}>
              <label htmlFor="reportText" className={labelStyle}>
                Report Text <span className="text-destructive">*</span>
              </label>
              <textarea
                id="reportText"
                value={formData.reportText}
                onChange={(e) => setFormData({ ...formData, reportText: e.target.value })}
                className={`${glassInput} min-h-[100px]`}
                placeholder="Describe the reported issue..."
                required
              />
            </div>

            {/* Text (Work Instruction / Notes) */}
            <div className={glassCard}>
              <label htmlFor="text" className={labelStyle}>
                Text
              </label>
              <textarea
                id="text"
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                className={`${glassInput} min-h-[80px]`}
                placeholder="Add work instructions or additional notes..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-2 pb-8">
              <button
                type="button"
                onClick={() => router.push(`/jobs/${jobId}`)}
                className="flex-1 px-6 py-3 border border-slate-200/50 dark:border-slate-800/50 rounded-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-md hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all duration-300 font-medium text-foreground/80 hover:text-foreground shadow-sm hover:shadow"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-foreground text-background dark:bg-primary dark:text-primary-foreground rounded-xl hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold shadow-lg shadow-black/5 hover:shadow-xl hover:-translate-y-0.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
