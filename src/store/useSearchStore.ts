import { create } from 'zustand';
import { SearchResult } from '@/modules/search/search.service';

interface SearchState {
  query: string;
  results: SearchResult[];
  suggestions: string[];
  history: string[];
  isLoading: boolean;
  setQuery: (q: string) => void;
  setResults: (results: SearchResult[]) => void;
  setSuggestions: (suggestions: string[]) => void;
  setHistory: (history: string[]) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  results: [],
  suggestions: [],
  history: [],
  isLoading: false,
  setQuery: (q) => set({ query: q }),
  setResults: (results) => set({ results }),
  setSuggestions: (suggestions) => set({ suggestions }),
  setHistory: (history) => set({ history }),
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
