'use client';

import { useEffect, useRef, useState } from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, 
  Volume2, VolumeX, Maximize2, ListMusic, Heart, Plus, Loader2, Bookmark, MoreVertical,
  ChevronUp
} from 'lucide-react';
import { autoSaveSongAction, toggleLikeSongAction, toggleSaveSongAction } from '@/modules/song/song.controller';
import { usePlayerStore } from '@/store/usePlayerStore';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { BigPlayer } from './BigPlayer';
import { PlaylistSelector } from './PlaylistSelector';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function PlayerBar() {
  const playerRef = useRef<any>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [hasAutoSaved, setHasAutoSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPlaylistSelector, setShowPlaylistSelector] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [localTime, setLocalTime] = useState(0);

  const { 
    currentTrack, isPlaying, isLooping, isShuffled, volume, 
    currentTime, duration, setIsPlaying, setTime, 
    setVolume, setIsLooping, setIsShuffled, playNext, playPrevious,
    isExtracting, setIsExtracting, likedSongs, setLikedSongs,
    savedSongs, setSavedSongs
  } = usePlayerStore();

  // 1. Load YouTube IFrame API
  useEffect(() => {
    if (!(window as any).YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }
  }, []);

  // 2. Initialize/Update Player
  useEffect(() => {
    if (!currentTrack) return;

    const initPlayer = () => {
      if (!playerRef.current) {
        playerRef.current = new (window as any).YT.Player('youtube-player', {
          height: '0',
          width: '0',
          videoId: currentTrack.id,
          playerVars: {
            autoplay: isPlaying ? 1 : 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            rel: 0,
            modestbranding: 1,
            origin: window.location.origin
          },
          events: {
            onReady: (event: any) => {
              setIsPlayerReady(true);
              event.target.setVolume(volume * 100);
              if (isPlaying) event.target.playVideo();
            },
            onStateChange: (event: any) => {
              if (event.data === (window as any).YT.PlayerState.ENDED) {
                if (isLooping) {
                  event.target.playVideo();
                } else {
                  playNext();
                }
              }
              if (event.data === (window as any).YT.PlayerState.PLAYING) setIsPlaying(true);
              if (event.data === (window as any).YT.PlayerState.PAUSED) setIsPlaying(false);
            },
            onError: (e: any) => {
              console.error('YouTube Player Error:', e.data);
              playNext();
            }
          }
        });
      } else {
        if (isPlaying) {
          playerRef.current.loadVideoById(currentTrack.id);
        } else {
          playerRef.current.cueVideoById(currentTrack.id);
        }
      }
    };

    if ((window as any).YT && (window as any).YT.Player) {
      initPlayer();
    } else {
      const originalCallback = (window as any).onYouTubeIframeAPIReady;
      (window as any).onYouTubeIframeAPIReady = () => {
        if (originalCallback) originalCallback();
        initPlayer();
      };
    }
  }, [currentTrack?.id]);

  // 3. Sync Play/Pause
  useEffect(() => {
    if (!playerRef.current || !isPlayerReady) return;
    if (isPlaying) {
      playerRef.current.playVideo();
    } else {
      playerRef.current.pauseVideo();
    }
  }, [isPlaying, isPlayerReady]);

  // 4. Sync Volume
  useEffect(() => {
    if (playerRef.current && isPlayerReady) {
      playerRef.current.setVolume(volume * 100);
    }
  }, [volume, isPlayerReady]);

  // 5. Handle time updates (YouTube doesn't have onTimeUpdate event)
  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current && isPlayerReady && isPlaying && !isDragging) {
        const current = playerRef.current.getCurrentTime();
        const dur = playerRef.current.getDuration();
        setTime(current, dur);
        setLocalTime(current);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isPlayerReady, isPlaying, isDragging]);

  const onSeek = (val: number) => {
    setLocalTime(val);
    if (!isDragging && playerRef.current && isPlayerReady) {
      playerRef.current.seekTo(val, true);
      setTime(val, playerRef.current.getDuration() || 0);
    }
  };

  const handleToggleLike = async () => {
    if (!currentTrack) return;
    try {
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
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  const handleToggleSave = async () => {
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

  // Reset auto-save state for new track
  useEffect(() => {
    setHasAutoSaved(false);
  }, [currentTrack?.id]);

  // 60% Auto-Save Hook
  useEffect(() => {
    if (!currentTrack || hasAutoSaved || duration === 0 || isSaving) return;

    const progress = currentTime / duration;
    if (progress >= 0.6) {
      const performAutoSave = async () => {
        setHasAutoSaved(true);
        setIsSaving(true);
        try {
          await autoSaveSongAction({
            youtubeId: currentTrack.id,
            title: currentTrack.title,
            artist: currentTrack.artist,
            thumbnail: currentTrack.thumbnail,
            duration,
          });
        } catch (err) {
          console.error('AutoSave failed:', err);
          setHasAutoSaved(false); // Retry later if failed
        } finally {
          setIsSaving(false);
        }
      };
      performAutoSave();
    }
  }, [currentTime, duration, currentTrack, hasAutoSaved, isSaving]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!currentTrack) return null;

  return (
    <>
    <div className="fixed bottom-16 md:bottom-0 left-0 right-0 bg-[#121212]/95 backdrop-blur-2xl border-t border-white/5 px-4 pt-5 pb-2 md:py-3 z-[50] flex items-center justify-between shadow-2xl transition-all">
      {/* Hidden YouTube Player */}
      <div id="youtube-player" className="hidden" />

      {/* Mobile Timeline (Full Width at Top) */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/5 md:hidden group/mobile-progress">
        <div 
          className="absolute top-0 left-0 h-full bg-red-600 transition-all duration-100 ease-linear"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        />
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={(e) => onSeek(parseFloat(e.target.value))}
          className="absolute -top-1 left-0 w-full h-3 opacity-0 cursor-pointer z-10"
        />
      </div>

      {/* Track Info */}
      <div 
        onClick={() => setIsExpanded(true)}
        className="flex items-center gap-4 w-1/4 min-w-[200px] cursor-pointer group/track"
      >
        <div className="relative group w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden shadow-lg border border-white/10 group-hover/track:scale-105 transition-transform">
          <img 
            src={currentTrack.thumbnail} 
            alt={currentTrack.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20 group-hover/track:bg-transparent transition-colors" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/track:opacity-100 transition-opacity">
            <ChevronUp className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-4">
            <h4 className="text-sm font-bold text-white truncate group-hover/track:text-red-500 transition-colors" dangerouslySetInnerHTML={{ __html: currentTrack.title }} />
            
            {/* Actions Container - Stop Propagation so menu doesn't expand player */}
            <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
              {/* Desktop Only Actions */}
              <div className="hidden md:flex items-center gap-3">
                <button 
                  onClick={handleToggleLike}
                  className={cn(
                    "transition-all active:scale-90",
                    likedSongs.includes(currentTrack.id) ? "text-red-600" : "text-gray-500 hover:text-white"
                  )}
                  title={likedSongs.includes(currentTrack.id) ? "Unlike" : "Like"}
                >
                  <Heart className={cn("w-4 h-4", likedSongs.includes(currentTrack.id) && "fill-current")} />
                </button>

                <button 
                  onClick={handleToggleSave}
                  className={cn(
                    "transition-all active:scale-90",
                    savedSongs.includes(currentTrack.id) ? "text-red-600" : "text-gray-500 hover:text-white"
                  )}
                  title={savedSongs.includes(currentTrack.id) ? "Remove from Library" : "Save to Library"}
                >
                  <Bookmark className={cn("w-4 h-4", savedSongs.includes(currentTrack.id) && "fill-current")} />
                </button>
              </div>

              {/* Mobile More Options (3-dot) */}
              <div className="md:hidden relative" ref={mobileMenuRef}>
                <button 
                  onClick={(e) => { e.stopPropagation(); setMobileMenuOpen(!mobileMenuOpen); }}
                  className="p-2 text-gray-500 hover:text-white transition-all active:scale-75"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
                {mobileMenuOpen && (
                  <div className="absolute bottom-full right-0 mb-4 w-52 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200 z-[100]">
                    <button onClick={() => { handleToggleLike(); setMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 transition-colors">
                      <Heart className={cn("w-4 h-4", likedSongs.includes(currentTrack.id) ? "text-red-600 fill-current" : "")} />
                      {likedSongs.includes(currentTrack.id) ? 'Liked' : 'Like'}
                    </button>
                    <button onClick={() => { handleToggleSave(); setMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 transition-colors">
                      <Bookmark className={cn("w-4 h-4", savedSongs.includes(currentTrack.id) ? "text-red-600 fill-current" : "")} />
                      {savedSongs.includes(currentTrack.id) ? 'Saved' : 'Save'}
                    </button>
                    <button onClick={() => { setIsShuffled(!isShuffled); setMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 transition-colors">
                      <Shuffle className={cn("w-4 h-4", isShuffled ? "text-red-600" : "")} />
                      Shuffle {isShuffled ? 'On' : 'Off'}
                    </button>
                    <button onClick={() => { setIsLooping(!isLooping); setMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 transition-colors">
                      <Repeat className={cn("w-4 h-4", isLooping ? "text-red-600" : "")} />
                      Loop {isLooping ? 'On' : 'Off'}
                    </button>
                    
                    {/* Volume Slider in Mobile Menu */}
                    <div className="px-4 py-3 border-t border-white/5 space-y-3">
                      <div className="flex items-center justify-between text-xs text-gray-500 font-bold uppercase tracking-widest">
                        <span>Volume</span>
                        <span>{Math.round(volume * 100)}%</span>
                      </div>
                      <div className="relative h-1.5 bg-white/10 rounded-full flex items-center">
                        <input 
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={volume}
                          onChange={(e) => setVolume(parseFloat(e.target.value))}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="absolute inset-0 bg-white/10 rounded-full" />
                        <div className="absolute inset-0 bg-red-600 rounded-full" style={{ width: `${volume * 100}%` }} />
                      </div>
                    </div>

                    <button onClick={() => { setShowPlaylistSelector(true); setMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 transition-colors border-t border-white/5">
                      <ListMusic className="w-4 h-4" />
                      Add to Playlist
                    </button>
                  </div>
                )}
              </div>
            </div>

            {isSaving && (
               <div className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-pulse" />
            )}
          </div>
          <p className="text-xs text-gray-400 truncate mt-0.5">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Main Controls & Progress */}
      <div className="flex flex-col items-center gap-2 flex-1 max-w-2xl px-8">
        <div className="flex items-center gap-4 md:gap-6">
          <button 
            onClick={() => setIsShuffled(!isShuffled)}
            className={cn("hidden md:block transition-colors", isShuffled ? "text-red-600" : "text-gray-500 hover:text-white")}
          >
            <Shuffle className="w-4 h-4" />
          </button>
          
          <button 
            onClick={playPrevious}
            className="text-gray-400 hover:text-white transition-colors active:scale-90"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>

          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 md:w-12 md:h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl"
          >
            {isPlaying ? <Pause className="w-5 h-5 md:w-6 md:h-6 fill-current" /> : <Play className="w-5 h-5 md:w-6 md:h-6 fill-current translate-x-0.5" />}
          </button>

          <button 
            onClick={playNext}
            className="text-gray-400 hover:text-white transition-all active:scale-90"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>

          <button 
            onClick={() => setIsLooping(!isLooping)}
            className={cn("hidden md:block transition-colors", isLooping ? "text-red-600" : "text-gray-500 hover:text-white")}
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-3 w-full">
          <span className="text-[10px] font-medium text-gray-500 w-8 text-right tabular-nums">
            {formatTime(isDragging ? localTime : currentTime)}
          </span>
          <div className="flex-1 relative group h-1.5 flex items-center">
            <input 
              type="range"
              min={0}
              max={duration || 100}
              value={isDragging ? localTime : currentTime}
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => {
                setIsDragging(false);
                if (audioRef.current) audioRef.current.currentTime = localTime;
              }}
              onChange={(e) => onSeek(parseFloat(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="absolute inset-0 bg-white/10 rounded-full" />
            <div 
              className="absolute inset-0 bg-red-600 rounded-full group-hover:bg-red-500 transition-colors" 
              style={{ width: `${((isDragging ? localTime : currentTime) / (duration || 1)) * 100}%` }}
            />
            <div 
              className="absolute h-3 w-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `calc(${((isDragging ? localTime : currentTime) / (duration || 1)) * 100}% - 6px)` }}
            />
          </div>
          <span className="text-[10px] font-medium text-gray-500 w-8 tabular-nums">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Utilities */}
      <div className="hidden md:flex items-center justify-end gap-4 w-1/4 min-w-[200px]">
        <div className="flex items-center gap-2 group w-32">
          <button onClick={() => setVolume(volume === 0 ? 0.7 : 0)}>
            {volume === 0 ? <VolumeX className="w-5 h-5 text-red-500" /> : <Volume2 className="w-5 h-5 text-gray-400 group-hover:text-white" />}
          </button>
          <div className="flex-1 relative h-1.5 flex items-center">
            <input 
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="absolute inset-0 bg-white/10 rounded-full" />
            <div className="absolute inset-0 bg-gray-400 group-hover:bg-red-600 rounded-full transition-colors" style={{ width: `${volume * 100}%` }} />
          </div>
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowPlaylistSelector(!showPlaylistSelector)}
            className={cn(
              "p-2 rounded-lg transition-colors",
              showPlaylistSelector ? "bg-red-600 text-white shadow-[0_0_15px_rgba(255,0,0,0.5)]" : "hover:bg-white/5 text-gray-400 hover:text-white"
            )}
            title="Add to playlist"
          >
            <ListMusic className="w-5 h-5" />
          </button>
        </div>
        <button 
          onClick={() => setIsExpanded(true)}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white"
        >
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>

      {/* Global Playlist Selector */}
      {showPlaylistSelector && (
        <div className="absolute bottom-full right-4 mb-4 z-[100]">
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
      )}
    </div>

    {isExpanded && (
      <BigPlayer 
        onClose={() => setIsExpanded(false)} 
        onSeek={onSeek}
      />
    )}
    </>
  );
}
