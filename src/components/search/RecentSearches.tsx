'use client';

import { useEffect } from 'react';
import { useSearchStore } from '@/store/useSearchStore';
import { getHistoryAction, removeHistoryAction, searchAction } from '@/modules/search/search.controller';
import { X, History, Search } from 'lucide-react';

export function RecentSearches() {
  const { history, setHistory, setResults, setQuery, results, query, setIsLoading } = useSearchStore();

  useEffect(() => {
    const fetchHistory = async () => {
      const data = await getHistoryAction();
      setHistory(data);
    };
    fetchHistory();
  }, [setHistory]);

  const handleRemove = async (e: React.MouseEvent, q: string) => {
    e.stopPropagation();
    await removeHistoryAction(q);
    setHistory(history.filter(h => h !== q));
  };

  const handleSearch = async (q: string) => {
    setQuery(q);
    setIsLoading(true);
    const data = await searchAction(q);
    setResults(data);
    setIsLoading(false);
  };

  if (results.length > 0 || query) return null;
  if (history.length === 0) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex items-center gap-2 text-gray-400">
        <History className="w-4 h-4" />
        <h3 className="text-sm font-bold uppercase tracking-widest">Recent Searches</h3>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {history.map((item, i) => (
          <button
            key={i}
            onClick={() => handleSearch(item)}
            className="group flex items-center gap-3 px-5 py-2.5 bg-[#181818] hover:bg-red-600/10 border border-white/5 rounded-full text-sm font-medium text-gray-300 hover:text-red-500 transition-all active:scale-95"
          >
            <Search className="w-3.5 h-3.5 opacity-50" />
            {item}
            <div 
              onClick={(e) => handleRemove(e, item)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
