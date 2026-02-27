'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Phone, User, AlertTriangle, Loader2, Hash, Settings, Calendar, X, ImageIcon, Languages, PlusCircle, Upload } from 'lucide-react';
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

import { getEmployeeById, attachImageToJob } from '@/lib/api';

export function JobInfo({ job, translatedDescription, translatedInstruction, isTranslating, currentLanguage, onLanguageChange }: JobInfoProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [employeeName, setEmployeeName] = useState<string | null>(null);
  const [isLoadingEmployee, setIsLoadingEmployee] = useState(false);

  // Image attachment state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingImages, setPendingImages] = useState<File[]>([]);
  const [pendingPreviews, setPendingPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [localImages, setLocalImages] = useState<string[]>(job.images || []);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);

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

  // Handle file selection — build local preview URLs
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const newPreviews = files.map(f => URL.createObjectURL(f));
    setPendingImages(prev => [...prev, ...files]);
    setPendingPreviews(prev => [...prev, ...newPreviews]);
    // Reset file input so same file can be re-selected if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Remove a pending (not yet uploaded) image
  const removePending = (index: number) => {
    URL.revokeObjectURL(pendingPreviews[index]); // cleanup memory
    setPendingImages(prev => prev.filter((_, i) => i !== index));
    setPendingPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Upload all pending images to Cloudinary + EAM
  const handleUpload = async () => {
    if (!pendingImages.length || isUploading) return;
    setIsUploading(true);
    setUploadErrors([]);
    const errors: string[] = [];
    const uploaded: string[] = [];
    for (const file of pendingImages) {
      try {
        const result = await attachImageToJob(job.id, file);
        uploaded.push(result.cloudinaryUrl);
      } catch (err: any) {
        errors.push(`Failed to upload "${file.name}": ${err.message || 'Unknown error'}`);
      }
    }
    // Revoke object URLs
    pendingPreviews.forEach(url => URL.revokeObjectURL(url));
    setPendingImages([]);
    setPendingPreviews([]);
    if (uploaded.length) setLocalImages(prev => [...prev, ...uploaded]);
    if (errors.length) setUploadErrors(errors);
    setIsUploading(false);
  };

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
            <div className={`${job.processFunction.description === "Unknown" ? 'hidden' : ''} flex items-start gap-2`}>
              <Settings className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Process Function</p>
                <p className="text-sm font-medium line-clamp-1">{job.processFunction.description}</p>
              </div>
            </div>
           
            <div className={`${job.equipment.name === "Unknown" ? 'hidden' : ''} flex items-start gap-2`}>
              <Settings className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Equipment</p>
                <p className="text-sm font-medium line-clamp-1">{job.equipment.name}</p>
              </div>
            </div>

            {/* Vendor */}
            <div className={`${job.vendor === "Unknown" ? 'hidden' : ''} flex items-start gap-2`}>
              <User className="w-4 h-4 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Vendor</p>
                <p className="text-sm font-medium line-clamp-1">{job.vendor || 'N/A'}</p>
              </div>
            </div>

            {/* Order Type */}
            <div className={`${job.workOrderType === "Unknown" ? 'hidden' : ''} flex items-start gap-2`}>
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
                    <SelectItem value="ro">Romanian (Română)</SelectItem>
                    <SelectItem value="ur">Urdu (اردو)</SelectItem>
                    <SelectItem value="ar">Arabic (العربية)</SelectItem>
                    <SelectItem value="fr">French (Français)</SelectItem>
                    <SelectItem value="es">Spanish (Español)</SelectItem>
                    <SelectItem value="pt">Portuguese (Português)</SelectItem>
                    <SelectItem value="it">Italian (Italiano)</SelectItem>
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
            ) : translatedDescription ? (
              <p className="text-sm text-foreground/90 leading-relaxed font-medium">
                {translatedDescription}
              </p>
            ) : (
              <div 
                className="text-sm text-foreground/90 leading-relaxed font-medium"
                dangerouslySetInnerHTML={{ __html: job.description }} 
              />
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
                dangerouslySetInnerHTML={{ __html: translatedInstruction || job.reportText || '' }}
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

        {/* Container 4: Job Images — view existing + add new */}
        <Card className="p-4">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileSelect}
            aria-label="Select images to attach to job"
          />

          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide flex items-center gap-2 text-muted-foreground">
              <ImageIcon className="w-4 h-4" />
              Job Images
              {localImages.length > 0 && (
                <span className="text-muted-foreground font-normal">({localImages.length})</span>
              )}
            </h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="h-7 text-xs gap-1.5"
              aria-label="Add images to job"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Add Images
            </Button>
          </div>

          {/* Existing / uploaded images */}
          {localImages.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {localImages.map((image, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedImage(image)}
                  className="group relative aspect-square rounded-lg border border-border overflow-hidden hover:ring-2 hover:ring-primary hover:scale-[1.02] transition-all duration-200 cursor-pointer shadow-sm bg-muted/20"
                >
                  <img
                    src={image}
                    alt={`Job image ${i + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
              ))}
            </div>
          ) : pendingImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 bg-muted/30 rounded-lg border border-dashed border-border px-4 text-center">
              <ImageIcon className="w-8 h-8 text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">No images available</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Click "Add Images" to attach a photo to this job</p>
            </div>
          ) : null}

          {/* Pending (not yet uploaded) images preview */}
          {pendingImages.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-amber-500 font-medium mb-2">{pendingImages.length} image(s) ready to upload</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {pendingPreviews.map((preview, i) => (
                  <div
                    key={`pending-${i}`}
                    className="group relative aspect-square rounded-lg border-2 border-amber-400/60 overflow-hidden shadow-sm bg-muted/20"
                  >
                    <img
                      src={preview}
                      alt={`Pending image ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removePending(i)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                      aria-label={`Remove pending image ${i + 1}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                    {/* Pending badge */}
                    <div className="absolute bottom-1 left-1 text-[9px] bg-amber-500 text-white px-1.5 py-0.5 rounded font-semibold">
                      PENDING
                    </div>
                  </div>
                ))}
              </div>

              {/* Upload button */}
              <Button
                type="button"
                onClick={handleUpload}
                disabled={isUploading}
                className="mt-3 w-full gap-2"
                size="sm"
                aria-label="Upload pending images to job and EAM"
              >
                {isUploading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Uploading to EAM...</>
                ) : (
                  <><Upload className="w-4 h-4" /> Upload to EAM ({pendingImages.length})</>
                )}
              </Button>
            </div>
          )}

          {/* Upload errors */}
          {uploadErrors.length > 0 && (
            <div className="mt-2 space-y-1">
              {uploadErrors.map((err, i) => (
                <p key={i} className="text-xs text-destructive">{err}</p>
              ))}
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
