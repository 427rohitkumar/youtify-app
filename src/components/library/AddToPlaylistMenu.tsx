'use client';

import { useState, useEffect } from 'react';
import { ListMusic, Plus, Loader2, Check } from 'lucide-react';
import { getPlaylistsAction, addSongToPlaylistAction } from '@/modules/playlist/playlist.controller';

interface AddToPlaylistMenuProps {
  song: {
    id: string;
    title: string;
    artist: string;
    thumbnail: string;
  };
}

export function AddToPlaylistMenu({ song }: AddToPlaylistMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [addingTo, setAddingTo] = useState<string | null>(null);

  const fetchPlaylists = async () => {
    setIsLoading(true);
    const data = await getPlaylistsAction();
    setPlaylists(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchPlaylists();
    }
  }, [isOpen]);

  const handleAdd = async (playlistId: string) => {
    try {
      setAddingTo(playlistId);
      await addSongToPlaylistAction(playlistId, song);
      // Optional: Show toast or success state
      setTimeout(() => {
        setAddingTo(null);
        setIsOpen(false);
      }, 1000);
    } catch (err) {
      console.error('Failed to add song:', err);
      setAddingTo(null);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
        className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-all"
      >
        <ListMusic className="w-5 h-5" />
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 top-full mt-2 w-56 bg-[#181818] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[60] glass animate-in fade-in slide-in-from-top-2 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-3 border-b border-white/5 bg-white/5">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Add to Playlist</h4>
          </div>
          
          <div className="max-h-60 overflow-y-auto py-1">
            {isLoading ? (
              <div className="p-4 flex justify-center">
                <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
              </div>
            ) : playlists.length === 0 ? (
              <p className="p-4 text-xs text-gray-500 text-center font-medium">No playlists found</p>
            ) : (
              playlists.map((playlist) => (
                <button
                  key={playlist._id}
                  onClick={() => handleAdd(playlist._id)}
                  disabled={addingTo !== null}
                  className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-[#007ACC] hover:text-white flex items-center justify-between transition-colors group"
                >
                  <span className="truncate">{playlist.name}</span>
                  {addingTo === playlist._id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : playlist.songs.some((s: any) => s.id === song.id) ? (
                    <Check className="w-4 h-4 text-[#007ACC] group-hover:text-white" />
                  ) : null}
                </button>
              ))
            )}
          </div>
          
          <button 
             onClick={() => window.location.href = '/dashboard/library'}
             className="w-full p-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 border-t border-white/5 flex items-center justify-center gap-2 transition-all"
          >
             <Plus className="w-3 h-3" />
             Create New
          </button>
        </div>
      )}
    </div>
  );
}
