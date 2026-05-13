'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { useSearchStore } from '@/store/useSearchStore';
import { searchAction, getSuggestionsAction } from '@/modules/search/search.controller';

export function SearchBar() {
  const { query, setQuery, setResults, setSuggestions, suggestions, setIsLoading, isLoading } = useSearchStore();
  const [inputValue, setInputValue] = useState(query);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click Outside logic
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced Suggestions
  useEffect(() => {
    if (!inputValue.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      setSelectedIndex(-1);
      return;
    }

    const timer = setTimeout(async () => {
      const sugs = await getSuggestionsAction(inputValue);
      setSuggestions(sugs);
      if (sugs.length > 0 && document.activeElement?.tagName === 'INPUT') {
        setShowDropdown(true);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, setSuggestions]);

  const handleSearch = async (q: string) => {
    if (!q.trim()) return;
    setQuery(q);
    setInputValue(q);
    setShowDropdown(false);
    setSelectedIndex(-1);
    setIsLoading(true);
    const results = await searchAction(q);
    setResults(results);
    setIsLoading(false);
    (document.activeElement as HTMLElement)?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
      if (suggestions[selectedIndex + 1]) setInputValue(suggestions[selectedIndex + 1]);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
      if (selectedIndex > 0) setInputValue(suggestions[selectedIndex - 1]);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const finalQuery = selectedIndex >= 0 ? suggestions[selectedIndex] : inputValue;
      handleSearch(finalQuery);
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  return (
    <div className="relative max-w-2xl mx-auto w-full z-50" ref={dropdownRef}>
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-red-500 transition-colors" />
        <input
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setSelectedIndex(-1);
          }}
          onFocus={() => { if (suggestions.length > 0) setShowDropdown(true); }}
          onKeyDown={handleKeyDown}
          type="text"
          placeholder="Search for songs, artists..."
          className="w-full pl-12 pr-12 py-3.5 bg-[#1a1a1a] border border-white/[0.08] rounded-2xl focus:outline-none focus:border-red-600/40 focus:bg-[#222] transition-all text-white text-base placeholder-gray-500 shadow-2xl"
        />
        {inputValue && (
          <button 
            onClick={() => { setInputValue(''); setResults([]); setSuggestions([]); setSelectedIndex(-1); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full text-gray-400"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div 
          className="absolute top-full left-0 right-0 mt-2 bg-[#0f0f0f] border border-white/5 rounded-2xl shadow-2xl overflow-hidden glass animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSearch(s)}
              onMouseEnter={() => setSelectedIndex(i)}
              className={`w-full text-left px-6 py-3 text-sm flex items-center gap-3 transition-colors ${
                selectedIndex === i 
                ? 'bg-red-600/10 text-red-500 font-bold' 
                : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              <Search className={`w-4 h-4 ${selectedIndex === i ? 'text-red-500' : 'opacity-50'}`} />
              {s}
            </button>
          ))}
        </div>
      )}

      {isLoading && (
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-widest animate-pulse">
          <Loader2 className="w-4 h-4 animate-spin" />
          Searching YouTube...
        </div>
      )}
    </div>
  );
}
