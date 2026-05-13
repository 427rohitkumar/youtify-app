'use client';

import { useState } from 'react';
import {
  Play, Pause, SkipBack, SkipForward, Repeat, Shuffle,
  Volume2, VolumeX, ChevronDown, Heart, Plus, ListMusic, Bookmark
} from 'lucide-react';
import { usePlayerStore } from '@/store/usePlayerStore';
import { cn } from '@/lib/utils';
import { toggleLikeSongAction, toggleSaveSongAction } from '@/modules/song/song.controller';

export function BigPlayer({ onClose, onSeek }: { onClose: () => void, onSeek: (val: number) => void }) {
  const {
    currentTrack, isPlaying, isLooping, isShuffled, volume,
    currentTime, duration, setIsPlaying, setTime,
    setVolume, setIsLooping, setIsShuffled, playNext, playPrevious,
    likedSongs, setLikedSongs, savedSongs, setSavedSongs
  } = usePlayerStore();

  const [isSaving, setIsSaving] = useState(false);

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
        <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white">
          <ListMusic className="w-6 h-6" />
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 md:px-24 gap-12">
        {/* Large Thumbnail */}
        <div className="w-full max-w-md aspect-square rounded-[40px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/10 group relative">
          <img src={currentTrack.thumbnail} className="w-full h-full object-cover" alt={currentTrack.title} />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
        </div>

        {/* Info */}
        <div className="w-full max-w-2xl flex items-center justify-between gap-8">
          <div className="min-w-0">
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-2 truncate" dangerouslySetInnerHTML={{ __html: currentTrack.title }} />
            <p className="text-xl md:text-2xl text-white/60 font-medium truncate">{currentTrack.artist}</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleToggleLike}
              className={cn(
                "p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all active:scale-90",
                likedSongs.includes(currentTrack.id) ? "text-red-600" : "text-white/70 hover:text-white"
              )}
            >
              <Heart className={cn("w-7 h-7", likedSongs.includes(currentTrack.id) && "fill-current")} />
            </button>
            <button
              onClick={handleToggleSave}
              disabled={isSaving}
              className={cn(
                "p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all active:scale-90",
                savedSongs.includes(currentTrack.id) ? "text-red-500" : "text-white/70 hover:text-white",
                isSaving && "opacity-50 cursor-not-allowed"
              )}
            >
              <Bookmark className={cn("w-7 h-7", savedSongs.includes(currentTrack.id) && "fill-current")} />
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="w-full max-w-2xl space-y-8">
          {/* Progress */}
          <div className="space-y-4">
            <div className="relative h-2 w-full bg-white/10 rounded-full group cursor-pointer">
              <div
                className="absolute top-0 left-0 h-full bg-red-600 rounded-full transition-all duration-100 ease-linear"
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
              {/* Knob */}
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `${(currentTime / duration) * 100}%`, transform: 'translate(-50%, -50%)' }}
              />
            </div>
            <div className="flex justify-between text-xs font-black text-white/40 tabular-nums uppercase tracking-widest">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Playback Buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsShuffled(!isShuffled)}
              className={cn("transition-colors", isShuffled ? "text-red-600" : "text-white/40 hover:text-white")}
            >
              <Shuffle className="w-7 h-7" />
            </button>

            <div className="flex items-center gap-12">
              <button onClick={playPrevious} className="text-white/80 hover:text-white transition-colors active:scale-90">
                <SkipBack className="w-10 h-10 fill-current" />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-24 h-24 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-white/10"
              >
                {isPlaying ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current translate-x-1" />}
              </button>
              <button onClick={playNext} className="text-white/80 hover:text-white transition-colors active:scale-90">
                <SkipForward className="w-10 h-10 fill-current" />
              </button>
            </div>

            <button
              onClick={() => setIsLooping(!isLooping)}
              className={cn("transition-colors", isLooping ? "text-red-600" : "text-white/40 hover:text-white")}
            >
              <Repeat className="w-7 h-7" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer / Volume */}
      <div className="relative z-10 p-12 flex items-center justify-center gap-4">
        <Volume2 className="w-5 h-5 text-white/40" />
        <div className="w-48 h-1 bg-white/10 rounded-full relative">
          <div
            className="absolute top-0 left-0 h-full bg-white/60 rounded-full"
            style={{ width: `${volume * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
