import { create } from 'zustand';

interface TranslationCache {
  [key: string]: string;
}

interface TranslationState {
  cache: TranslationCache;
  currentLanguage: string;
  setTranslation: (key: string, value: string) => void;
  getTranslation: (key: string) => string | null;
  setLanguage: (lang: string) => void;
  clearCache: () => void;
}

export const useTranslationStore = create<TranslationState>((set, get) => ({
  cache: {},
  currentLanguage: 'en',
  setTranslation: (key, value) =>
    set((state) => ({
      cache: { ...state.cache, [key]: value },
    })),
  getTranslation: (key) => get().cache[key] || null,
  setLanguage: (lang) => set({ currentLanguage: lang }),
  clearCache: () => set({ cache: {}, currentLanguage: 'en' }),
}));
