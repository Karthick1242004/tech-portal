'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionStore } from '@/store/session.store';
import { useTranslationStore } from '@/store/translation.store';
import { getEquipment, getProcessFunctions, getWorkOrderTypes, reportJob } from '@/lib/api';
import type { Equipment, ProcessFunction, WorkOrderType, ReportJobPayload } from '@/types/report-job';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2, Check, ChevronsUpDown, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { ImageUploader, ImageFile } from '@/components/jobs/ImageUploader';

// --- Default English labels for all form UI text ---
const DEFAULT_LABELS = {
  title: 'Report New Job',
  back: 'Back',
  loadingData: 'Loading form data...',
  descriptionLabel: 'Description',
  descriptionPlaceholder: 'Describe the issue or job request...',
  reporterLabel: 'Reporter Name/ID',
  reporterPlaceholder: 'Enter your name or ID',
  jobDetails: 'Job Details',
  equipmentLabel: 'Equipment',
  equipmentSearchPlaceholder: 'Search equipment...',
  equipmentEmpty: 'No equipment found.',
  processFunctionLabel: 'Process Function',
  processFunctionSearchPlaceholder: 'Search process function...',
  processFunctionEmpty: 'No process function found.',
  workOrderTypeLabel: 'Work Order Type',
  workOrderTypeSearchPlaceholder: 'Search work order type...',
  workOrderTypeEmpty: 'No work order type found.',
  reportDateLabel: 'Report Date & Time',
  contextLabel: 'Additional Context',
  contextPlaceholder: 'Add any additional context, notes, or observations...',
  cancelButton: 'Cancel',
  submitButton: 'Submit Job Report',
  submittingButton: 'Submitting...',
};

export default function ReportJobPage() {
  const router = useRouter();
  const { isAuthenticated, isTestMode } = useSessionStore();
  const { toast } = useToast();
  const { getTranslation, setTranslation } = useTranslationStore();

  // Translation state
  const [labels, setLabels] = useState(DEFAULT_LABELS);
  const [currentLang, setCurrentLang] = useState('en');
  const [isTranslatingLabels, setIsTranslatingLabels] = useState(false);

  const handleLanguageChange = async (lang: string) => {
    setCurrentLang(lang);
    if (lang === 'en') {
      setLabels(DEFAULT_LABELS);
      return;
    }
    // Check Zustand cache
    const cacheKey = `report-labels-${lang}`;
    const cached = getTranslation(cacheKey);
    if (cached) {
      setLabels(JSON.parse(cached));
      return;
    }
    // Batch-translate all labels in a single API call
    setIsTranslatingLabels(true);
    try {
      const keys = Object.keys(DEFAULT_LABELS) as (keyof typeof DEFAULT_LABELS)[];
      const values = keys.map(k => DEFAULT_LABELS[k]);
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: values, source: 'en', target: lang }),
      });
      const data = await res.json();
      if (data.translatedTexts && data.translatedTexts.length === keys.length) {
        const translated: typeof DEFAULT_LABELS = {} as typeof DEFAULT_LABELS;
        keys.forEach((k, i) => { translated[k] = data.translatedTexts[i]; });
        setLabels(translated);
        setTranslation(cacheKey, JSON.stringify(translated));
      }
    } catch (err) {
      console.error('[ReportJob] Label translation failed:', err);
    } finally {
      setIsTranslatingLabels(false);
    }
  };

  // Reference Data State
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [processFunctions, setProcessFunctions] = useState<ProcessFunction[]>([]);
  const [workOrderTypes, setWorkOrderTypes] = useState<WorkOrderType[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    description: '',
    reporterText: '',
    context: '',
    equipmentId: '',
    processFunctionId: '',
    workOrderTypeId: '',
    siteId: '',
    specId: '',
    reportDate: new Date().toISOString().slice(0, 16), // YYYY-MM-DDTHH:mm format for datetime-local
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Combobox open states
  const [equipmentOpen, setEquipmentOpen] = useState(false);
  const [processFunctionOpen, setProcessFunctionOpen] = useState(false);
  const [workOrderTypeOpen, setWorkOrderTypeOpen] = useState(false);

  // Image upload state
  const [images, setImages] = useState<ImageFile[]>([]);


  // Load reference data on mount
  useEffect(() => {
    const loadReferenceData = async () => {
      try {
        setIsLoadingData(true);
        const [equipmentData, processFuncData, workOrderTypeData] = await Promise.all([
          getEquipment(),
          getProcessFunctions(),
          getWorkOrderTypes(),
        ]);
        setEquipment(equipmentData);
        setProcessFunctions(processFuncData);
        setWorkOrderTypes(workOrderTypeData);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Failed to load form data',
          description: 'Please try refreshing the page',
          className: "text-white",
        });
      } finally {
        setIsLoadingData(false);
      }
    };

    if (isAuthenticated || isTestMode) {
      loadReferenceData();
    }
  }, [isAuthenticated, isTestMode, toast]);

  // Save images to localStorage when they change
  useEffect(() => {
    if (images.length > 0) {
      const imagesToStore = images.map(img => ({
        id: img.id,
        dataUrl: img.dataUrl,
        fileName: img.file.name,
        fileType: img.file.type,
        fileSize: img.file.size,
      }));
      localStorage.setItem('reportJobImages', JSON.stringify(imagesToStore));
    } else {
      localStorage.removeItem('reportJobImages');
    }
  }, [images]);

  // Load images from localStorage on mount
  useEffect(() => {
    const loadStoredImages = async () => {
      const stored = localStorage.getItem('reportJobImages');
      if (stored) {
        try {
          const parsedImages = JSON.parse(stored);
          const reconstructedImages = await Promise.all(
            parsedImages.map(async (img: any) => {
              const response = await fetch(img.dataUrl);
              const blob = await response.blob();
              const file = new File([blob], img.fileName, { type: img.fileType });
              return {
                id: img.id,
                file,
                preview: img.dataUrl,
                dataUrl: img.dataUrl,
              };
            })
          );
          setImages(reconstructedImages);
        } catch (error) {
          console.error('Failed to load stored images:', error);
          localStorage.removeItem('reportJobImages');
        }
      }
    };
    
    loadStoredImages();
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.description || !formData.reporterText || !formData.equipmentId || !formData.processFunctionId || !formData.workOrderTypeId) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        className: "text-white",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const payload: ReportJobPayload = {
        description: formData.workOrderTypeId ? `[Type: ${formData.workOrderTypeId}] ${formData.description}` : formData.description,
        reporterText: formData.reporterText,
        context: formData.context,
        equipmentId: formData.equipmentId,
        processFunctionId: formData.processFunctionId,
        workOrderTypeId: "APP", 
        siteId: "",
        specId: "",
        reportDate: new Date(formData.reportDate).toISOString(),
      };

      // Extract File objects from ImageFile array
      const imageFiles = images.map(img => img.file);

      const result = await reportJob(payload, imageFiles);

      // Clear localStorage on successful submission
      localStorage.removeItem('reportJobImages');

      toast({
        title: 'Job Reported Successfully',
        className: 'bg-emerald-600 text-white border-emerald-700',
      });

      // Redirect to jobs list
      router.push('/jobs');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Failed to report job',
        description: error.message || 'An error occurred',
        className: "text-white",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated && !isTestMode) {
    return null;
  }

  if (isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>{labels.loadingData}</span>
        </div>
      </div>
    );
  }

  // Common glass styles for consistent look
  const glassCard = "bg-white/80 dark:bg-slate-950/50 backdrop-blur-md border border-white/20 dark:border-slate-800/50 rounded-xl p-5 shadow-lg shadow-black/5 transition-all duration-300 hover:shadow-xl hover:bg-white/90 dark:hover:bg-slate-950/60";
  const glassInput = "w-full px-4 py-3 border border-slate-200/50 dark:border-slate-800/50 rounded-lg bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all placeholder:text-muted-foreground/50";
  const labelStyle = "block text-sm font-semibold mb-2 text-foreground/80";

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm">
        <div className="flex justify-center">
          <div className="w-full max-w-2xl px-4 py-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push('/jobs')}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-200 hover:-translate-x-1"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>{labels.back}</span>
                </button>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                  {labels.title}
                </h1>
              </div>
              {/* Language Selector */}
              <div className="flex items-center gap-2">
                {isTranslatingLabels && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                <Select value={currentLang} onValueChange={handleLanguageChange} disabled={isTranslatingLabels}>
                  <SelectTrigger className="h-8 text-xs px-2 border rounded bg-background min-w-[90px] gap-1">
                    <Languages className="w-3.5 h-3.5 shrink-0" />
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="du">Dutch</SelectItem>
                    <SelectItem value="ge">German</SelectItem>
                    <SelectItem value="fr">French (Français)</SelectItem>
                    <SelectItem value="pl">Polish (Polski)</SelectItem>
                    <SelectItem value="ro">Romanian (Română)</SelectItem>
                    <SelectItem value="ur">Urdu (اردو)</SelectItem>
                    <SelectItem value="ar">Arabic (العربية)</SelectItem>
                    <SelectItem value="es">Spanish (Español)</SelectItem>
                    <SelectItem value="pt">Portuguese (Português)</SelectItem>
                    <SelectItem value="it">Italian (Italiano)</SelectItem>
                    <SelectItem value="cy">Welsh (Cymraeg)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                {labels.descriptionLabel} <span className="text-destructive">*</span>
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={`${glassInput} min-h-[100px]`}
                placeholder={labels.descriptionPlaceholder}
                required
              />
            </div>

            {/* Reporter Text */}
            <div className={glassCard}>
              <label htmlFor="reporterText" className={labelStyle}>
                {labels.reporterLabel} <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                id="reporterText"
                value={formData.reporterText}
                onChange={(e) => setFormData({ ...formData, reporterText: e.target.value })}
                className={glassInput}
                placeholder={labels.reporterPlaceholder}
                required
              />
            </div>

            {/* Core Details Group - Equipment, Process Function, Work Order Type */}
            <div className={`${glassCard} space-y-5`}>
              <h3 className="text-sm font-medium text-muted-foreground/70 uppercase tracking-wider mb-2">{labels.jobDetails}</h3>
              
              {/* Equipment Dropdown */}
              <div>
                <label className={labelStyle}>
                  {labels.equipmentLabel} <span className="text-destructive">*</span>
                </label>
                <Popover open={equipmentOpen} onOpenChange={setEquipmentOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={equipmentOpen}
                      className={cn(glassInput, "justify-between font-normal")}
                    >
                      {formData.equipmentId
                        ? equipment.find((item) => item.id === formData.equipmentId)?.description + ` (${formData.equipmentId})`
                        : `${labels.equipmentSearchPlaceholder.replace('...', '')}...`}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder={labels.equipmentSearchPlaceholder} />
                      <CommandList>
                        <CommandEmpty>{labels.equipmentEmpty}</CommandEmpty>
                        <CommandGroup>
                          {equipment.map((item) => (
                            <CommandItem
                              key={item.id}
                              value={`${item.description} ${item.id}`}
                              onSelect={() => {
                                setFormData({ ...formData, equipmentId: item.id });
                                setEquipmentOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.equipmentId === item.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {item.description} ({item.id})
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Process Function Dropdown */}
              <div>
                <label className={labelStyle}>
                  {labels.processFunctionLabel} <span className="text-destructive">*</span>
                </label>
                <Popover open={processFunctionOpen} onOpenChange={setProcessFunctionOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={processFunctionOpen}
                      className={cn(glassInput, "justify-between font-normal")}
                    >
                      {formData.processFunctionId
                        ? processFunctions.find((item) => item.id === formData.processFunctionId)?.description + ` (${formData.processFunctionId})`
                        : `${labels.processFunctionSearchPlaceholder.replace('...', '')}...`}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder={labels.processFunctionSearchPlaceholder} />
                      <CommandList>
                        <CommandEmpty>{labels.processFunctionEmpty}</CommandEmpty>
                        <CommandGroup>
                          {processFunctions.map((item) => (
                            <CommandItem
                              key={item.id}
                              value={`${item.description} ${item.id}`}
                              onSelect={() => {
                                setFormData({ ...formData, processFunctionId: item.id });
                                setProcessFunctionOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.processFunctionId === item.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {item.description} ({item.id})
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Work Order Type Dropdown */}
              <div>
                <label className={labelStyle}>
                  {labels.workOrderTypeLabel} <span className="text-destructive">*</span>
                </label>
                <Popover open={workOrderTypeOpen} onOpenChange={setWorkOrderTypeOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={workOrderTypeOpen}
                      className={cn(glassInput, "justify-between font-normal")}
                    >
                      {formData.workOrderTypeId
                        ? workOrderTypes.find((item) => item.id === formData.workOrderTypeId)?.description + ` (${formData.workOrderTypeId})`
                        : `${labels.workOrderTypeSearchPlaceholder.replace('...', '')}...`}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder={labels.workOrderTypeSearchPlaceholder} />
                      <CommandList>
                        <CommandEmpty>{labels.workOrderTypeEmpty}</CommandEmpty>
                        <CommandGroup>
                          {workOrderTypes.map((item) => (
                            <CommandItem
                              key={item.id}
                              value={`${item.description} ${item.id}`}
                              onSelect={() => {
                                setFormData({ ...formData, workOrderTypeId: item.id });
                                setWorkOrderTypeOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.workOrderTypeId === item.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {item.description} ({item.id})
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Report Date */}
            <div className={glassCard}>
              <label htmlFor="reportDate" className={labelStyle}>
                {labels.reportDateLabel} <span className="text-destructive">*</span>
              </label>
              <input
                type="datetime-local"
                id="reportDate"
                value={formData.reportDate}
                onChange={(e) => setFormData({ ...formData, reportDate: e.target.value })}
                className={glassInput}
                required
              />
            </div>

            {/* Optional Fields - Site ID and Space ID */}
            {/* <div className={glassCard}>
              <h3 className="text-sm font-medium text-muted-foreground/70 uppercase tracking-wider mb-4">Location Details (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="siteId" className={labelStyle}>
                    Site ID
                  </label>
                  <input
                    type="text"
                    id="siteId"
                    value={formData.siteId}
                    onChange={(e) => setFormData({ ...formData, siteId: e.target.value })}
                    className={glassInput}
                    placeholder="Leave empty if unknown"
                  />
                </div>

                <div>
                  <label htmlFor="specId" className={labelStyle}>
                    Space ID
                  </label>
                  <input
                    type="text"
                    id="specId"
                    value={formData.specId}
                    onChange={(e) => setFormData({ ...formData, specId: e.target.value })}
                    className={glassInput}
                    placeholder="Leave empty if unknown"
                  />
                </div>
              </div>
            </div> */}

            {/* Context */}
            <div className={glassCard}>
              <label htmlFor="context" className={labelStyle}>
                {labels.contextLabel}
              </label>
              <textarea
                id="context"
                value={formData.context}
                onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                className={`${glassInput} min-h-[80px]`}
                placeholder={labels.contextPlaceholder}
              />
            </div>

            {/* Image Upload */}
            <ImageUploader
              images={images}
              onImagesChange={setImages}
              maxImages={4}
              maxSizeMB={5}
            />


            {/* Submit Button */}
            <div className="flex gap-4 pt-2 pb-8">
              <button
                type="button"
                onClick={() => router.push('/jobs')}
                className="flex-1 px-6 py-3 border border-slate-200/50 dark:border-slate-800/50 rounded-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-md hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all duration-300 font-medium text-foreground/80 hover:text-foreground shadow-sm hover:shadow"
              >
                {labels.cancelButton}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-foreground text-background dark:bg-primary dark:text-primary-foreground rounded-xl hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold shadow-lg shadow-black/5 hover:shadow-xl hover:-translate-y-0.5"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting ? labels.submittingButton : labels.submitButton}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
