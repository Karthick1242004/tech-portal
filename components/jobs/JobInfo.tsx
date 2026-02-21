'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Phone, User, AlertTriangle, Loader2, Hash, Settings, Calendar, X, ImageIcon, Languages } from 'lucide-react';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Job } from '@/lib/mock-jobs';

interface JobInfoProps {
  job: Job;
  translatedDescription?: string;
  translatedInstruction?: string;
  isTranslating?: boolean;
  currentLanguage?: string;
  onLanguageChange?: (language: string) => void;
}

import { getEmployeeById } from '@/lib/api';

export function JobInfo({ job, translatedDescription, translatedInstruction, isTranslating, currentLanguage, onLanguageChange }: JobInfoProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [employeeName, setEmployeeName] = useState<string | null>(null);
  const [isLoadingEmployee, setIsLoadingEmployee] = useState(false);

  useEffect(() => {
    async function fetchEmployeeName() {
      if (job?.contact?.name) {
        // Assume contact.name contains the ID passed from backend
        const idToCheck = job.contact.name;
        // Check if it looks like an ID (e.g., numbers / short string instead of full name)
        // If the ID is the same as the fallback name on backend, it might be purely numeric
        if (/^\d+$/.test(idToCheck) || idToCheck.length < 10) {
          setIsLoadingEmployee(true);
          const emp = await getEmployeeById(idToCheck);
          if (emp?.Description) {
            setEmployeeName(emp.Description);
          }
          setIsLoadingEmployee(false);
        }
      }
    }
    fetchEmployeeName();
  }, [job?.contact?.name]);

  // Helper to format dates safely
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy - HH:mm');
    } catch {
      return dateString;
    }
  };

  // Priority Theme Configuration
  const priorityTheme = {
    HIGH: {
      badge: 'bg-red-500 text-white border-red-600 shadow-sm',
      card: 'border-red-500/50 bg-red-500/10 dark:bg-red-950/40 shadow-sm shadow-red-500/10 backdrop-blur-xs',
      icon: 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400'
    },
    MEDIUM: {
      badge: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800',
      card: 'border-blue-500/50 bg-blue-500/10 dark:bg-blue-950/40 shadow-sm shadow-blue-500/10 backdrop-blur-xs',
      icon: 'bg-primary/10 text-primary'
    },
    LOW: {
      badge: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-800',
      card: 'border-emerald-500/50 bg-emerald-500/10 dark:bg-emerald-950/40 shadow-sm shadow-emerald-500/10 backdrop-blur-xs',
      icon: 'bg-primary/10 text-primary'
    }
  };

  const theme = priorityTheme[job.priority];

  return (
    <>
      <div className="space-y-3">
        {/* Container 1: Job Metadata */}
        <Card className={`p-4 ${theme.card}`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${theme.icon}`}>
                <Hash className="w-5 h-5" />
              </div>
              <div>
                {/* <p className="text-xs text-muted-foreground uppercase tracking-wide">Job ID</p> */}
                <p className="text-base font-bold">{job.id}</p>
                <p className="text-base font-bold">{job.description}</p>
              </div>
            </div>
            <Badge variant="outline" className={`${theme.badge} border px-3 py-1 text-xs`}>
              {job.priority}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-4 border-t">
             {/* Process */}
            <div className="flex items-start gap-2">
              <Settings className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Process Function</p>
                <p className="text-sm font-medium line-clamp-1">{job.processFunction.description}</p>
              </div>
            </div>
           
            <div className="flex items-start gap-2">
              <Settings className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Equipment</p>
                <p className="text-sm font-medium line-clamp-1">{job.equipment.name}</p>
              </div>
            </div>

            {/* Vendor */}
            <div className="flex items-start gap-2">
              <User className="w-4 h-4 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Vendor</p>
                <p className="text-sm font-medium line-clamp-1">{job.vendor || 'N/A'}</p>
              </div>
            </div>

            {/* Order Type */}
            <div className="flex items-start gap-2">
              <Settings className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Job Type</p>
                <p className="text-sm font-medium line-clamp-1">{job.workOrderType || 'N/A'}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Container 2: Description & Instructions */}
        <Card className="p-4 space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Reported Problem</h3>
              {currentLanguage && onLanguageChange && (
                <Select
                  value={currentLanguage}
                  onValueChange={onLanguageChange}
                  disabled={isTranslating}
                >
                  <SelectTrigger className="h-6 text-xs px-2 border rounded bg-background min-w-[90px]">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="pl">Polish (Polski)</SelectItem>
                    <SelectItem value="pa">Punjabi (ਪੰਜਾਬੀ)</SelectItem>
                    <SelectItem value="ur">Urdu (اردو)</SelectItem>
                    <SelectItem value="bn">Bengali (বাংলা)</SelectItem>
                    <SelectItem value="gu">Gujarati (ગુજરાતી)</SelectItem>
                    <SelectItem value="ar">Arabic (العربية)</SelectItem>
                    <SelectItem value="fr">French (Français)</SelectItem>
                    <SelectItem value="es">Spanish (Español)</SelectItem>
                    <SelectItem value="pt">Portuguese (Português)</SelectItem>
                    <SelectItem value="cy">Welsh (Cymraeg)</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
            {isTranslating ? (
              <div className="flex items-center gap-2 py-2">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Translating...</span>
              </div>
            ) : (
              <p className="text-sm text-foreground/90 leading-relaxed font-medium">
                {translatedDescription || job.description}
              </p>
            )}
          </div>
          
          {/* No Divider - Continuous Flow */}
          
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-500" />
              <h3 className="text-xs font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-500">Work Instruction</h3>
            </div>
            {isTranslating ? (
              <div className="flex items-center gap-2 py-2">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Translating...</span>
              </div>
            ) : (
               <div 
                className="bg-amber-50/50 dark:bg-amber-950/10 p-3 rounded-md text-sm text-foreground/90 leading-relaxed border border-amber-100 dark:border-amber-900/20"
                dangerouslySetInnerHTML={{ __html: translatedInstruction || job.jobInstruction }}
              />
            )}
          </div>
        </Card>

        {/* Container 3: Timeline & Contact */}
        <Card className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Timeline Column */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center flex-shrink-0">
                   <Calendar className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground font-medium">Planned Start</p>
                  <p className="text-sm font-semibold">{formatDate(job.plannedStart)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center flex-shrink-0">
                   <Clock className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground font-medium">Target End</p>
                  <p className="text-sm font-semibold">{formatDate(job.targetEnd)}</p>
                </div>
              </div>
            </div>
            
            {/* Contact Column - Separator on mobile if needed, but grid handles it */}
            <div className="flex items-center gap-3 pt-3 sm:pt-0 sm:border-l sm:pl-6 border-t sm:border-t-0 border-border/50">
               <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border flex-shrink-0">
                  <User className="w-5 h-5 text-muted-foreground" />
               </div>
               <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold truncate">
                      {employeeName || job.contact.name}
                    </p>
                    {isLoadingEmployee && <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />}
                  </div>
                  {/* <p className="text-xs text-muted-foreground"></p> */}
               </div>
               <a 
                 href={`tel:${job.contact.phone}`} 
                 className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                 aria-label={`Call ${job.contact.name}`}
               >
                 <Phone className="w-4 h-4" />
               </a>
            </div>
          </div>
        </Card>

        {/* Container 4: Equipment Images */}
        <Card className="p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide mb-3 flex items-center gap-2 text-muted-foreground">
            <ImageIcon className="w-4 h-4" />
            Job Images
          </h3>
          
          {job.images && job.images.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {job.images.slice(0, 4).map((image, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedImage(image)}
                  className="group relative aspect-square rounded-lg border border-border overflow-hidden hover:ring-2 hover:ring-primary hover:scale-[1.02] transition-all duration-200 cursor-pointer shadow-sm bg-muted/20"
                >
                  <img
                    src={image}
                    alt={`Equipment image ${i + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 bg-muted/30 rounded-lg border border-dashed border-border px-4 text-center">
              <ImageIcon className="w-8 h-8 text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">No images available</p>
            </div>
          )}
        </Card>
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all duration-200 hover:scale-110 hover:rotate-90 z-[60]"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            <X className="w-6 h-6" />
          </button>
          <div 
            className="relative w-full max-w-5xl h-[85vh] flex items-center justify-center animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="Equipment Preview"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl border border-white/10"
            />
          </div>
        </div>
      )}
    </>
  );
}
