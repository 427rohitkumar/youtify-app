'use client';

import { useState } from 'react';
import {
  Play, Pause, SkipBack, SkipForward, Repeat, Shuffle,
  Volume2, VolumeX, ChevronDown, Heart, Plus, ListMusic, Bookmark
} from 'lucide-react';
import { usePlayerStore } from '@/store/usePlayerStore';
import { cn } from '@/lib/utils';
import { toggleLikeSongAction, toggleSaveSongAction } from '@/modules/song/song.controller';
import { PlaylistSelector } from './PlaylistSelector';

export function BigPlayer({ onClose, onSeek }: { onClose: () => void, onSeek: (val: number) => void }) {
  const {
    currentTrack, isPlaying, isLooping, isShuffled, volume,
    currentTime, duration, setIsPlaying, setTime,
    setVolume, setIsLooping, setIsShuffled, playNext, playPrevious,
    likedSongs, setLikedSongs, savedSongs, setSavedSongs
  } = usePlayerStore();

  const [isSaving, setIsSaving] = useState(false);
  const [showPlaylistSelector, setShowPlaylistSelector] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      playNext();
    }
    if (isRightSwipe) {
      playPrevious();
    }
  };

  if (!currentTrack) return null;

  const handleToggleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentTrack) return;
    const res = await toggleLikeSongAction({
      youtubeId: currentTrack.id,
      title: currentTrack.title,
      artist: currentTrack.artist,
      thumbnail: currentTrack.thumbnail,
      duration
    });
    if (res.success && res.likedSongs) {
      setLikedSongs(res.likedSongs);
    }
  };

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentTrack || isSaving) return;
    setIsSaving(true);
    try {
      const res = await toggleSaveSongAction({
        youtubeId: currentTrack.id,
        title: currentTrack.title,
        artist: currentTrack.artist,
        thumbnail: currentTrack.thumbnail,
        duration
      });
      if (res.success && res.savedSongs) {
        setSavedSongs(res.savedSongs);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#0f0f0f] animate-in slide-in-from-bottom duration-500 overflow-hidden flex flex-col">
      {/* Background Blur */}
      <div className="absolute inset-0 z-0">
        <img
          src={currentTrack.thumbnail}
          className="w-full h-full object-cover blur-[100px] opacity-40 scale-150"
          alt=""
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0f0f0f]/80 to-[#0f0f0f]" />
      </div>

      {/* Header */}
      <div className="relative z-10 p-6 flex items-center justify-between">
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white">
          <ChevronDown className="w-8 h-8" />
        </button>
        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Playing From</p>
          <h3 className="text-sm font-bold text-white">Your Collection</h3>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowPlaylistSelector(true)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
          >
            <ListMusic className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          
          {/* Volume Slider in Header */}
          <div className="hidden md:flex items-center gap-2 group w-24">
            <Volume2 className="w-4 h-4 text-white/40" />
            <div className="flex-1 relative h-1 bg-white/10 rounded-full flex items-center">
              <input 
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="absolute inset-0 bg-white/40 rounded-full group-hover:bg-red-600 transition-colors" style={{ width: `${volume * 100}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="relative z-10 flex-1 flex flex-col px-6 md:px-24 py-4 max-w-5xl mx-auto w-full min-h-0">
        {/* Artwork Area - Guaranteed space */}
        <div className="flex-1 min-h-0 flex items-center justify-center p-4">
          <div 
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="h-full max-h-[300px] md:max-h-[450px] aspect-square rounded-[32px] md:rounded-[40px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/10 relative transition-transform duration-500 hover:scale-[1.02] active:scale-[0.98] cursor-grab active:cursor-grabbing"
          >
            <img src={currentTrack.thumbnail} className="w-full h-full object-cover pointer-events-none select-none" alt={currentTrack.title} />
            <div className="absolute inset-0 bg-black/20 pointer-events-none" />
          </div>
        </div>

        {/* Info Area - Separated with gap */}
        <div className="mt-4 space-y-6 md:space-y-8 flex-shrink-0">
          {/* Info & Like */}
          <div className="flex items-center justify-between gap-6">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl md:text-3xl font-black text-white tracking-tighter mb-0.5 md:mb-1 truncate" dangerouslySetInnerHTML={{ __html: currentTrack.title }} />
              <p className="text-sm md:text-xl text-white/60 font-medium truncate">{currentTrack.artist}</p>
            </div>
            <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
              <button
                onClick={handleToggleLike}
                className={cn(
                  "p-2 md:p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all active:scale-90",
                  likedSongs.includes(currentTrack.id) ? "text-red-600" : "text-white/70 hover:text-white"
                )}
              >
                <Heart className={cn("w-5 h-5 md:w-6 md:h-6", likedSongs.includes(currentTrack.id) && "fill-current")} />
              </button>
            </div>
          </div>

          {/* Progress Section */}
          <div className="space-y-2 md:space-y-3">
            <div className="relative h-1 md:h-1.5 w-full bg-white/10 rounded-full group cursor-pointer">
              <div
                className="absolute top-0 left-0 h-full bg-red-600 rounded-full transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(255,0,0,0.4)]"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={(e) => onSeek(parseFloat(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
            </div>
            <div className="flex justify-between text-[10px] font-bold text-white/30 tabular-nums uppercase tracking-widest">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Playback Buttons */}
          <div className="flex items-center justify-between gap-2 md:gap-4">
            <button
              onClick={() => setIsShuffled(!isShuffled)}
              className={cn("transition-colors p-2", isShuffled ? "text-red-600" : "text-white/30 hover:text-white")}
            >
              <Shuffle className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            
            <div className="flex items-center gap-4 md:gap-10">
              <button onClick={playPrevious} className="text-white/70 hover:text-white transition-colors active:scale-75">
                <SkipBack className="w-6 h-6 md:w-8 md:h-8 fill-current" />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-14 h-14 md:w-18 md:h-18 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-90 transition-all shadow-xl shadow-white/10"
              >
                {isPlaying ? <Pause className="w-6 h-6 md:w-8 md:h-8 fill-current" /> : <Play className="w-6 h-6 md:w-8 md:h-8 fill-current translate-x-0.5" />}
              </button>
              <button onClick={playNext} className="text-white/70 hover:text-white transition-colors active:scale-75">
                <SkipForward className="w-6 h-6 md:w-8 md:h-8 fill-current" />
              </button>
            </div>

            <button
              onClick={() => setIsLooping(!isLooping)}
              className={cn("transition-colors p-2", isLooping ? "text-red-600" : "text-white/30 hover:text-white")}
            >
              <Repeat className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer / Utilities */}
      <div className="relative z-10 p-4 flex items-center justify-between md:justify-center gap-8 max-w-2xl mx-auto w-full">
        <button 
          onClick={handleToggleSave}
          className={cn(
            "p-2 transition-all active:scale-90 md:hidden",
            savedSongs.includes(currentTrack.id) ? "text-red-500" : "text-white/40 hover:text-white"
          )}
        >
          <Bookmark className={cn("w-6 h-6", savedSongs.includes(currentTrack.id) && "fill-current")} />
        </button>

        {/* Mobile Volume Slider in Footer */}
        <div className="md:hidden flex-1 flex items-center gap-4">
          <Volume2 className="w-5 h-5 text-white/40" />
          <div className="flex-1 h-1 bg-white/10 rounded-full relative group cursor-pointer">
            <input 
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div
              className="absolute top-0 left-0 h-full bg-white/60 rounded-full"
              style={{ width: `${volume * 100}%` }}
            />
          </div>
        </div>

        <button className="p-2 text-white/40 hover:text-white transition-colors md:hidden opacity-0 pointer-events-none">
          <ListMusic className="w-6 h-6" />
        </button>
      </div>

      {/* Playlist Selector Overlay */}
      {showPlaylistSelector && (
        <div 
          onClick={() => setShowPlaylistSelector(false)}
          className="absolute inset-0 z-[300] bg-black/40 backdrop-blur-md flex items-center justify-center p-6 cursor-pointer"
        >
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm cursor-default">
            <PlaylistSelector 
              song={{
                id: currentTrack.id,
                title: currentTrack.title,
                artist: currentTrack.artist,
                thumbnail: currentTrack.thumbnail,
                duration
              }}
              onClose={() => setShowPlaylistSelector(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
