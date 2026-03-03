'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Languages } from 'lucide-react';

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function LanguageSelector({ value, onChange, disabled }: LanguageSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <Languages className="w-4 h-4 text-muted-foreground" />
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="nl">Dutch (Nederlands)</SelectItem>
          <SelectItem value="de">German (Deutsch)</SelectItem>
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
  );
}
