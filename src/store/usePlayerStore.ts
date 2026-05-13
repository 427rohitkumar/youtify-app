import { create } from 'zustand';

export interface Track {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  streamUrl?: string;
}

interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  isLooping: boolean;
  isShuffled: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  queue: Track[];
  history: Track[];
  isExtracting: string | null;
  likedSongs: string[];
  savedSongs: string[];

  setCurrentTrack: (track: Track | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setIsLooping: (isLooping: boolean) => void;
  setIsShuffled: (isShuffled: boolean) => void;
  setVolume: (volume: number) => void;
  setTime: (currentTime: number, duration: number) => void;
  setIsExtracting: (isExtracting: string | null) => void;
  setLikedSongs: (likedSongs: string[]) => void;
  setSavedSongs: (savedSongs: string[]) => void;
  setQueue: (tracks: Track[]) => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (trackId: string) => void;
  playNext: () => void;
  playPrevious: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  isLooping: false,
  isShuffled: false,
  volume: 0.7,
  currentTime: 0,
  duration: 0,
  queue: [],
  history: [],
  isExtracting: null,
  likedSongs: [],
  savedSongs: [],

  setCurrentTrack: (track) => set({ currentTrack: track, isPlaying: !!track }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setIsLooping: (isLooping) => set({ isLooping }),
  setIsShuffled: (isShuffled) => set({ isShuffled }),
  setVolume: (volume) => set({ volume }),
  setTime: (currentTime, duration) => set({ currentTime, duration }),
  setIsExtracting: (isExtracting) => set({ isExtracting }),
  setLikedSongs: (likedSongs) => set({ likedSongs }),
  setSavedSongs: (savedSongs) => set({ savedSongs }),
  
  setQueue: (tracks) => set({ queue: tracks }),
  addToQueue: (track) => set((state) => ({ queue: [...state.queue, track] })),
  
  removeFromQueue: (trackId) => set((state) => ({
    queue: state.queue.filter(t => t.id !== trackId)
  })),

  playNext: () => {
    const { queue, currentTrack, isShuffled, isLooping } = get();
    if (queue.length === 0) return;

    // Find current index
    const currentIndex = currentTrack ? queue.findIndex(t => t.id === currentTrack.id) : -1;
    let nextIndex: number;

    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * queue.length);
      // Ensure we don't play the same song if queue > 1
      if (nextIndex === currentIndex && queue.length > 1) {
        nextIndex = (nextIndex + 1) % queue.length;
      }
    } else {
      nextIndex = (currentIndex + 1) % queue.length;
      // If we're at the end and not looping, stop or go back to start
      if (nextIndex === 0 && !isLooping && currentIndex !== -1) {
        set({ isPlaying: false });
        return;
      }
    }

    set({ currentTrack: queue[nextIndex], isPlaying: true });
  },

  playPrevious: () => {
    const { queue, currentTrack } = get();
    if (queue.length === 0) return;

    const currentIndex = currentTrack ? queue.findIndex(t => t.id === currentTrack.id) : -1;
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) prevIndex = queue.length - 1;

    set({ currentTrack: queue[prevIndex], isPlaying: true });
  },
}));
