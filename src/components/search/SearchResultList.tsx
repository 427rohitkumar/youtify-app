'use client';

import { useSearchStore } from '@/store/useSearchStore';
import { usePlayerStore, Track } from '@/store/usePlayerStore';
import { Play, MoreVertical, Clock, Loader2, Heart, Bookmark } from 'lucide-react';
import { AddToPlaylistMenu } from '@/components/library/AddToPlaylistMenu';
import { cn } from '@/lib/utils';
import { toggleLikeSongAction, toggleSaveSongAction } from '@/modules/song/song.controller';

export function SearchResultList() {
  const { results, query } = useSearchStore();
  const { 
    setCurrentTrack, isExtracting, 
    likedSongs, setLikedSongs,
    savedSongs, setSavedSongs,
    setQueue 
  } = usePlayerStore();

  const handlePlay = (item: any, index: number) => {
    const tracks: Track[] = results.map((s: any) => ({
      id: s.id,
      title: s.title,
      artist: s.artist,
      thumbnail: s.thumbnail,
      streamUrl: ''
    }));
    setQueue(tracks);
    setCurrentTrack(tracks[index]);
  };

  const handleToggleLike = async (e: React.MouseEvent, item: any) => {
    e.stopPropagation(); // Don't play the song
    const res = await toggleLikeSongAction({
      youtubeId: item.id,
      title: item.title,
      artist: item.artist,
      thumbnail: item.thumbnail,
      duration: 0 // Duration might not be available in search results yet
    });
    if (res.success && res.likedSongs) {
      setLikedSongs(res.likedSongs);
    }
  };

  const handleToggleSave = async (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    const res = await toggleSaveSongAction({
      youtubeId: item.id,
      title: item.title,
      artist: item.artist,
      thumbnail: item.thumbnail,
      duration: 0
    });
    if (res.success && res.savedSongs) {
      setSavedSongs(res.savedSongs);
    }
  };

  if (!results.length && query) return null;

  return (
    <div className="flex flex-col gap-1 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {results.map((item, index) => (
        <div 
          key={item.id}
          onClick={() => handlePlay(item, index)}
          className="group flex items-center gap-4 p-2.5 hover:bg-white/5 active:bg-white/10 rounded-2xl transition-all cursor-pointer relative"
        >
          {/* Thumbnail */}
          <div className="relative w-14 h-14 flex-shrink-0 rounded-xl overflow-hidden shadow-2xl border border-white/5">
            <img 
              src={item.thumbnail} 
              alt={item.title} 
              className="w-full h-full object-cover transition-transform group-hover:scale-110"
            />
            <div className={cn(
              "absolute inset-0 bg-black/40 transition-opacity flex items-center justify-center",
              isExtracting === item.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}>
              {isExtracting === item.id ? (
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              ) : (
                <Play className="w-6 h-6 text-white fill-current" />
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 pr-2">
            <h4 className="text-[15px] font-bold text-white leading-snug line-clamp-1 group-hover:text-red-500 transition-colors" 
                dangerouslySetInnerHTML={{ __html: item.title }} 
            />
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1 font-medium">{item.artist}</p>
          </div>

          {/* Actions - Desktop Hover Only */}
          <div className="hidden md:flex items-center gap-1 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={(e) => handleToggleLike(e, item)}
              className={cn(
                "p-2 transition-all active:scale-75",
                likedSongs.includes(item.id) ? "text-red-600" : "hover:text-white"
              )}
            >
              <Heart className={cn("w-4 h-4", likedSongs.includes(item.id) && "fill-current")} />
            </button>
            <button 
              onClick={(e) => handleToggleSave(e, item)}
              className={cn(
                "p-2 transition-all active:scale-75",
                savedSongs.includes(item.id) ? "text-red-500" : "hover:text-white"
              )}
            >
              <Bookmark className={cn("w-4 h-4", savedSongs.includes(item.id) && "fill-current")} />
            </button>
            <AddToPlaylistMenu song={item} />
          </div>
        </div>
      ))}
    </div>
  );
}
