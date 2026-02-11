'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Phone, User, AlertTriangle, Loader2, Hash, Settings, Calendar, AlertCircle, X, ImageIcon } from 'lucide-react';
import type { Job } from '@/lib/mock-jobs';

interface JobInfoProps {
  job: Job;
  translatedDescription?: string;
  translatedInstruction?: string;
  isTranslating?: boolean;
}

export function JobInfo({ job, translatedDescription, translatedInstruction, isTranslating }: JobInfoProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Priority Theme Configuration
  const priorityTheme = {
    HIGH: {
      color: 'text-red-600 dark:text-red-400',
      gradient: 'bg-gradient-to-br from-red-50 to-transparent dark:from-red-950/30 border-red-100 dark:border-red-900/50',
      iconBg: 'bg-red-100 dark:bg-red-900/50',
      badge: 'bg-red-100 text-red-700 hover:bg-red-200 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800',
      separator: 'bg-red-200 dark:bg-red-800'
    },
    MEDIUM: {
      color: 'text-blue-600 dark:text-blue-400',
      gradient: 'bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-950/30 border-blue-100 dark:border-blue-900/50',
      iconBg: 'bg-blue-100 dark:bg-blue-900/50',
      badge: 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800',
      separator: 'bg-blue-200 dark:bg-blue-800'
    },
    LOW: {
      color: 'text-emerald-600 dark:text-emerald-400',
      gradient: 'bg-gradient-to-br from-emerald-50 to-transparent dark:from-emerald-950/30 border-emerald-100 dark:border-emerald-900/50',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/50',
      badge: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-800',
      separator: 'bg-emerald-200 dark:bg-emerald-800'
    }
  };

  const theme = priorityTheme[job.priority];

  // Helper for staggered animation
  const getAnimationDelay = (index: number) => ({
    animationDelay: `${index * 50}ms`
  });

  return (
    <>
      <div className="space-y-4">
        {/* Essential Info Group */}
        <div className="grid grid-cols-2 gap-4 animate-slideUp" style={getAnimationDelay(0)}>
          <Card className={`p-4 flex flex-col justify-between ${theme.gradient} border shadow-sm`}>
            <div className="flex items-start justify-between">
               <div className={`w-8 h-8 rounded-lg ${theme.iconBg} flex items-center justify-center mb-3`}>
                  <Hash className={`w-4 h-4 ${theme.color}`} />
               </div>
               <Badge variant="outline" className={`${theme.badge} border shadow-sm`}>
                 {job.priority}
               </Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Job ID</p>
              <p className="font-bold text-lg">{job.id}</p>
            </div>
          </Card>

          <Card className="p-4 flex flex-col justify-between border shadow-sm hover:bg-muted/50 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center mb-3">
               <Settings className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Process</p>
              <p className="font-semibold text-sm line-clamp-2">{job.processFunction.description}</p>
            </div>
          </Card>
        </div>

        {/* Description Card */}
        <Card className="p-5 shadow-sm animate-slideUp border-l-4 border-l-primary/20" style={getAnimationDelay(1)}>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            Description
          </h3>
          {isTranslating ? (
            <div className="flex items-center gap-2 py-2">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Translating...</span>
            </div>
          ) : (
            <p className="text-md font-bold text-foreground/80 leading-relaxed">
              {translatedDescription || job.description}
            </p>
          )}
        </Card>

        {/* Instructions Card - Highlighted */}
        <Card className={`p-5 shadow-sm animate-slideUp border-l-4 ${theme.separator}`} style={{ ...getAnimationDelay(2), borderColor: 'var(--border)' }}>
           <div className="flex items-center gap-2 mb-3 text-amber-600 dark:text-amber-500">
             <AlertTriangle className="w-4 h-4" />
             <h3 className="text-sm font-semibold">Instructions & Safety</h3>
           </div>
          {isTranslating ? (
            <div className="flex items-center gap-2 py-2">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Translating...</span>
            </div>
          ) : (
            <div 
              className="text-md font-bold text-foreground/80 leading-relaxed bg-amber-50/50 dark:bg-amber-950/10 p-3 rounded-md border border-amber-100 dark:border-amber-900/20 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: translatedInstruction || job.jobInstruction }}
            />
          )}
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slideUp" style={getAnimationDelay(3)}>
          {/* Timeline */}
          <Card className="p-4 shadow-sm">
             <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Timeline</h4>
             <div className="space-y-3">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Calendar className="w-4 h-4" />
                   </div>
                   <div>
                      <p className="text-xs text-muted-foreground">Planned Start</p>
                      <p className="text-sm font-medium">{job.plannedStart}</p>
                   </div>
                </div>
                <div className="w-full h-px bg-border/50"></div>
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                   </div>
                   <div>
                      <p className="text-xs text-muted-foreground">Target End</p>
                      <p className="text-sm font-medium">{job.targetEnd}</p>
                   </div>
                </div>
             </div>
          </Card>

          {/* Contact */}
          <Card className="p-4 shadow-sm">
             <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Contact</h4>
             <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden border">
                  <User className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{job.contact.name}</p>
                  <p className="text-xs text-muted-foreground">Supervisor</p>
                </div>
             </div>
             <a href={`tel:${job.contact.phone}`} className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors text-sm text-primary font-medium">
                <Phone className="w-3.5 h-3.5" />
                {job.contact.phone}
             </a>
          </Card>
        </div>

        {/* Equipment Images */}
        <Card className="p-5 shadow-sm animate-slideUp" style={getAnimationDelay(4)}>
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-primary" />
            Job Images
          </h3>
          
          {job.images && job.images.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {job.images.slice(0, 4).map((image, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedImage(image)}
                  className="group relative aspect-square rounded-lg border-2 border-border/50 overflow-hidden hover:ring-2 hover:ring-primary hover:scale-[1.02] transition-all duration-200 cursor-pointer shadow-sm"
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
            <div className="flex flex-col items-center justify-center py-8 bg-muted/30 rounded-lg border border-dashed border-border group hover:bg-muted/50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                 <ImageIcon className="w-5 h-5 text-muted-foreground/50" />
              </div>
              <p className="text-sm text-muted-foreground font-medium">No image exists</p>
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
