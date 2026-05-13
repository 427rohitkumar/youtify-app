'use client';

import { useState, useEffect } from 'react';
import { ListMusic, Plus, Check, Loader2 } from 'lucide-react';
import { getPlaylistsAction, addSongToPlaylistAction } from '@/modules/playlist/playlist.controller';
import { autoSaveSongAction } from '@/modules/song/song.controller';
import { cn } from '@/lib/utils';

export function PlaylistSelector({ song, onClose }: { song: any, onClose: () => void }) {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const data = await getPlaylistsAction();
        setPlaylists(data);
      } catch (err) {
        console.error('Failed to fetch playlists:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlaylists();
  }, []);

  const handleAddToPlaylist = async (playlistId: string) => {
    setIsAdding(playlistId);
    try {
      // 1. Add to Playlist
      await addSongToPlaylistAction(playlistId, song);
      
      // 2. Auto-Persistence (from player-fixing.md requirement)
      await autoSaveSongAction({
        youtubeId: song.id,
        title: song.title,
        artist: song.artist,
        thumbnail: song.thumbnail,
        duration: song.duration || 0,
      });

      onClose();
    } catch (err) {
      console.error('Failed to add to playlist:', err);
    } finally {
      setIsAdding(null);
    }
  };

  return (
    <div className="absolute bottom-full right-0 mb-4 w-64 bg-[#1e1e1e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300 z-[100]">
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#1e1e1e]">
        <h3 className="text-sm font-bold text-white">Add to Playlist</h3>
        <ListMusic className="w-4 h-4 text-gray-500" />
      </div>
      
      <div className="max-h-60 overflow-y-auto p-2 space-y-1 custom-scrollbar">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-red-600 animate-spin" />
          </div>
        ) : playlists.length === 0 ? (
          <div className="py-8 px-4 text-center">
             <p className="text-xs text-gray-500 font-medium">No playlists found.</p>
          </div>
        ) : (
          playlists.map((playlist) => (
            <button
              key={playlist._id}
              onClick={() => handleAddToPlaylist(playlist._id)}
              disabled={!!isAdding}
              className="w-full flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-all group text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-[#252525] border border-white/5 overflow-hidden flex-shrink-0">
                {playlist.songs[0]?.thumbnail ? (
                  <img src={playlist.songs[0].thumbnail} className="w-full h-full object-cover" alt="" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ListMusic className="w-4 h-4 text-gray-700" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{playlist.name}</p>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{playlist.songs.length} Songs</p>
              </div>
              {isAdding === playlist._id ? (
                <Loader2 className="w-4 h-4 text-red-600 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 text-gray-600 group-hover:text-red-500 transition-colors" />
              )}
            </button>
          ))
        )}
      </div>

      <div className="p-2 border-t border-white/5 bg-[#1e1e1e]/50">
         <button className="w-full flex items-center justify-center gap-2 p-3 text-xs font-black text-white uppercase tracking-widest hover:bg-red-600 transition-colors rounded-xl group">
            <Plus className="w-4 h-4" />
            New Playlist
         </button>
      </div>
    </div>
  );
}
