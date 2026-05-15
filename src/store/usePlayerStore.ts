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
  savedTracks: Track[]; // Store actual track data for autoplay fallback

  setCurrentTrack: (track: Track | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setIsLooping: (isLooping: boolean) => void;
  setIsShuffled: (isShuffled: boolean) => void;
  setVolume: (volume: number) => void;
  setTime: (currentTime: number, duration: number) => void;
  setIsExtracting: (isExtracting: string | null) => void;
  setLikedSongs: (likedSongs: string[]) => void;
  setSavedSongs: (savedSongs: string[]) => void;
  setSavedTracks: (tracks: Track[]) => void;
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
  savedTracks: [],

  setCurrentTrack: (track) => set({ currentTrack: track, isPlaying: !!track }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setIsLooping: (isLooping) => set({ isLooping }),
  setIsShuffled: (isShuffled) => set({ isShuffled }),
  setVolume: (volume) => set({ volume }),
  setTime: (currentTime, duration) => set({ currentTime, duration }),
  setIsExtracting: (isExtracting) => set({ isExtracting }),
  setLikedSongs: (likedSongs) => set({ likedSongs }),
  setSavedSongs: (savedSongs) => set({ savedSongs }),
  setSavedTracks: (tracks) => set({ savedTracks: tracks }),
  
  setQueue: (tracks) => set({ queue: tracks }),
  addToQueue: (track) => set((state) => ({ queue: [...state.queue, track] })),
  
  removeFromQueue: (trackId) => set((state) => ({
    queue: state.queue.filter(t => t.id !== trackId)
  })),

  playNext: () => {
    const { queue, currentTrack, isShuffled, isLooping, savedTracks } = get();
    
    // Use savedTracks as fallback if queue is empty
    const activeQueue = queue.length > 0 ? queue : savedTracks;
    if (activeQueue.length === 0) return;
 
    // Find current index in the active queue
    const currentIndex = currentTrack ? activeQueue.findIndex(t => t.id === currentTrack.id) : -1;
    let nextIndex: number;
 
    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * activeQueue.length);
      if (nextIndex === currentIndex && activeQueue.length > 1) {
        nextIndex = (nextIndex + 1) % activeQueue.length;
      }
    } else {
      nextIndex = (currentIndex + 1) % activeQueue.length;
      
      // If we're at the end
      if (nextIndex === 0 && currentIndex !== -1) {
        // If we are playing from a temporary queue (like search) and reach the end,
        // and we have saved tracks, switch to playing saved tracks
        if (queue.length > 0 && savedTracks.length > 0 && !isLooping) {
           set({ queue: [], currentTrack: savedTracks[0], isPlaying: true });
           return;
        }

        if (!isLooping) {
          set({ isPlaying: false });
          return;
        }
      }
    }
 
    set({ currentTrack: activeQueue[nextIndex], isPlaying: true });
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
