'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Phone, User, AlertTriangle, Loader2, Hash, Settings, Calendar, AlertCircle } from 'lucide-react';
import type { Job } from '@/lib/mock-jobs';

interface JobInfoProps {
  job: Job;
  translatedDescription?: string;
  translatedInstruction?: string;
  isTranslating?: boolean;
}

export function JobInfo({ job, translatedDescription, translatedInstruction, isTranslating }: JobInfoProps) {
  // Priority Theme Configuration
  const priorityTheme = {
    HIGH: {
      color: 'text-red-600',
      gradient: 'bg-gradient-to-br from-red-50 to-transparent border-red-100',
      iconBg: 'bg-red-100',
      badge: 'bg-red-100 text-red-700 hover:bg-red-200 border-red-200',
      separator: 'bg-red-200'
    },
    MEDIUM: {
      color: 'text-blue-600',
      gradient: 'bg-gradient-to-br from-blue-50 to-transparent border-blue-100',
      iconBg: 'bg-blue-100',
      badge: 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200',
      separator: 'bg-blue-200'
    },
    LOW: {
      color: 'text-emerald-600',
      gradient: 'bg-gradient-to-br from-emerald-50 to-transparent border-emerald-100',
      iconBg: 'bg-emerald-100',
      badge: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200',
      separator: 'bg-emerald-200'
    }
  };

  const theme = priorityTheme[job.priority];

  // Helper for staggered animation
  const getAnimationDelay = (index: number) => ({
    animationDelay: `${index * 50}ms`
  });

  return (
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
          <p className="text-sm text-foreground/80 leading-relaxed">
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
            className="text-sm text-foreground/80 leading-relaxed bg-amber-50/50 dark:bg-amber-950/10 p-3 rounded-md border border-amber-100 dark:border-amber-900/20 prose prose-sm max-w-none"
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
    </div>
  );
}
