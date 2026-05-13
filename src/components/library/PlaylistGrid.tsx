'use client';

import { useState } from 'react';
import { Plus, Play, Music, Trash2 } from 'lucide-react';
import { CreatePlaylistModal } from './CreatePlaylistModal';
import Link from 'next/link';
import { deletePlaylistAction } from '@/modules/playlist/playlist.controller';

interface PlaylistGridProps {
  playlists: any[];
}

export function PlaylistGrid({ playlists }: PlaylistGridProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full">
      {/* Create New Card */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="group relative aspect-square flex flex-col items-center justify-center gap-4 bg-[#1e1e1e] border-2 border-dashed border-white/5 hover:border-red-600/50 rounded-3xl transition-all hover:bg-[#252525]"
      >
        <div className="p-4 bg-white/5 rounded-full group-hover:bg-red-600/10 transition-colors">
          <Plus className="w-8 h-8 text-gray-500 group-hover:text-red-600" />
        </div>
        <span className="text-sm font-bold text-gray-500 group-hover:text-white transition-colors">Create Playlist</span>
      </button>

      {/* Existing Playlists */}
      {playlists.map((playlist) => (
        <div key={playlist._id} className="relative group">
          <Link 
            href={`/dashboard/library/${playlist._id}`}
            className="flex flex-col gap-3 p-4 bg-[#1e1e1e] border border-white/5 hover:bg-[#252525] rounded-3xl transition-all h-full"
          >
            {/* Cover Art Collage / Placeholder */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-[#252525] to-[#0f0f0f] flex items-center justify-center border border-white/5 shadow-xl">
               {playlist.songs.length > 0 ? (
                  <div className="grid grid-cols-2 w-full h-full">
                     {playlist.songs.slice(0, 4).map((s: any, i: number) => (
                        <img key={i} src={s.thumbnail} className="w-full h-full object-cover" alt="" />
                     ))}
                     {playlist.songs.length < 4 && Array(4 - playlist.songs.length).fill(0).map((_, i) => (
                        <div key={i} className="bg-white/5 w-full h-full" />
                     ))}
                  </div>
               ) : (
                  <Music className="w-12 h-12 text-white/10" />
               )}
               
               {/* Play Button Overlay */}
               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                     <Play className="w-6 h-6 text-white fill-current" />
                  </div>
               </div>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-white truncate">{playlist.name}</h4>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">
                {playlist.songs.length} Songs
              </p>
            </div>
          </Link>

          {/* Delete Button */}
          <button 
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              if (confirm(`Delete playlist "${playlist.name}"?`)) {
                await deletePlaylistAction(playlist._id);
              }
            }}
            className="absolute top-2 right-2 p-2 bg-black/60 text-white/50 hover:text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all z-10"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}

      <CreatePlaylistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
