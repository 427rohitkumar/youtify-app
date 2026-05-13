import { SearchBar } from '@/components/search/SearchBar';
import { SearchResultList } from '@/components/search/SearchResultList';
import { RecentSearches } from '@/components/search/RecentSearches';

export const metadata = {
  title: 'Search | Youtify',
  description: 'Find your favorite music on YouTube.',
};

export default function SearchPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky Header with SearchBar */}
      <header className="sticky top-0 z-[60] bg-[#121212]/80 backdrop-blur-2xl border-b border-white/5 px-4 pt-4 pb-4">
        <div className="max-w-2xl mx-auto">
          <SearchBar />
        </div>
      </header>

      <main className="flex-1 px-4 md:px-8 space-y-8 pt-6">
        {/* Discovery / History State */}
        <section>
          <RecentSearches />
        </section>

        {/* Results State */}
        <section className="max-w-4xl mx-auto">
          <SearchResultList />
        </section>

        {/* Empty State / Tips */}
        <div className="py-20 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 text-gray-700 shadow-inner">
            <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5">
               <circle cx="11" cy="11" r="8" />
               <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <div className="space-y-2">
            <h3 className="text-white font-bold text-lg tracking-tight">Looking for something?</h3>
            <p className="text-gray-500 text-sm max-w-xs mx-auto font-medium">
              Try searching for your favorite song, artist, or even a mood like "Chill vibes".
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
