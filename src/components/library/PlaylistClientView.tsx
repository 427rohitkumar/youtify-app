'use client';

import { Play, Clock, Trash2, Music, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { usePlayerStore, Track } from '@/store/usePlayerStore';
import { cn } from '@/lib/utils';
import { removeSongFromPlaylistAction } from '@/modules/playlist/playlist.controller';
import { useRouter } from 'next/navigation';

export function PlaylistClientView({ playlist }: { playlist: any }) {
  const { setCurrentTrack, isExtracting, setQueue } = usePlayerStore();
  const router = useRouter();

  const handlePlaySong = (song: any, index: number) => {
    // Set the entire playlist as the queue
    const tracks: Track[] = playlist.songs.map((s: any) => ({
      id: s.youtubeId || s.id,
      title: s.title,
      artist: s.artist,
      thumbnail: s.thumbnail,
      streamUrl: ''
    }));
    
    setQueue(tracks);
    setCurrentTrack(tracks[index]);
  };

  const handlePlayAll = () => {
    if (playlist.songs.length > 0) {
      handlePlaySong(playlist.songs[0], 0);
    }
  };

  const handleRemoveSong = async (e: React.MouseEvent, songId: string) => {
    e.stopPropagation();
    if (confirm('Remove this song from playlist?')) {
      await removeSongFromPlaylistAction(playlist._id, songId);
      router.refresh();
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-32 animate-in fade-in duration-700">
      {/* Header Banner */}
      <div className="relative flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 pb-6 md:pb-8 border-b border-white/5">
        <div className="w-40 h-40 md:w-60 md:h-60 rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-br from-[#282828] to-[#121212] flex items-center justify-center flex-shrink-0 relative group">
          {playlist.songs.length > 0 ? (
             <img src={playlist.songs[0].thumbnail} className="w-full h-full object-cover" alt="" />
          ) : (
             <Music className="w-20 h-20 text-white/10" />
          )}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
        </div>

        <div className="flex-1 space-y-3 md:space-y-4 text-center md:text-left">
          <h4 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-[#007ACC]">Playlist</h4>
          <h1 className="text-3xl md:text-6xl font-black text-white tracking-tighter leading-tight">{playlist.name}</h1>
          <div className="flex items-center justify-center md:justify-start gap-4 text-xs md:text-sm text-gray-400 font-medium">
            <span>{playlist.songs.length} Songs</span>
            <span className="w-1 h-1 rounded-full bg-gray-600" />
            <span>Created {format(new Date(playlist.createdAt), 'MMM d, yyyy')}</span>
          </div>
          
          <div className="flex items-center justify-center md:justify-start gap-4 pt-2 md:pt-4">
             <button 
               onClick={handlePlayAll}
               className="w-full md:w-auto px-10 py-4 bg-[#007ACC] hover:bg-[#005FA3] text-white font-black uppercase tracking-widest rounded-full shadow-2xl shadow-blue-900/40 transition-all active:scale-95 flex items-center justify-center gap-3 group"
             >
                <Play className="w-4 h-4 md:w-5 md:h-5 fill-current transition-transform group-hover:scale-110" />
                Play All
             </button>
          </div>
        </div>
      </div>

      {/* Songs Table */}
      <div className="w-full overflow-hidden">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="text-[10px] uppercase tracking-[0.2em] text-gray-500 border-b border-white/5">
                  <th className="py-4 px-2 md:px-4 font-black w-10 md:w-12 text-center">#</th>
                  <th className="py-4 px-2 md:px-4 font-black">Title</th>
                  <th className="py-4 px-4 font-black hidden md:table-cell">Added</th>
                  <th className="py-4 px-2 md:px-4 font-black w-20 md:w-24 text-right pr-4 md:pr-8"><Clock className="w-4 h-4 ml-auto" /></th>
               </tr>
            </thead>
            <tbody>
               {playlist.songs.map((song: any, index: number) => (
                  <tr 
                    key={index} 
                    onClick={() => handlePlaySong(song, index)}
                    className="group hover:bg-white/5 transition-all cursor-pointer border-b border-white/[0.02] last:border-0"
                  >
                     <td className="py-4 px-2 md:px-4 text-[10px] md:text-xs text-gray-500 font-black tabular-nums text-center">
                        {isExtracting === (song.youtubeId || song.id) ? (
                           <Loader2 className="w-3 h-3 md:w-4 md:h-4 text-[#007ACC] animate-spin mx-auto" />
                        ) : (
                           index + 1
                        )}
                     </td>
                     <td className="py-3 px-2 md:px-4">
                        <div className="flex items-center gap-3 md:gap-4">
                           <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden shadow-lg border border-white/5 flex-shrink-0">
                              <img src={song.thumbnail} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="" />
                              <div className={cn(
                                "absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity",
                                isExtracting === (song.youtubeId || song.id) ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                              )}>
                                 {isExtracting === (song.youtubeId || song.id) ? (
                                    <Loader2 className="w-4 h-4 md:w-5 md:h-5 text-white animate-spin" />
                                 ) : (
                                    <Play className="w-4 h-4 md:w-5 md:h-5 text-white fill-current" />
                                 )}
                              </div>
                           </div>
                           <div className="min-w-0">
                              <h4 className="text-xs md:text-sm font-bold text-white truncate group-hover:text-[#007ACC] transition-colors" dangerouslySetInnerHTML={{ __html: song.title }} />
                              <p className="text-[10px] md:text-xs text-gray-500 truncate">{song.artist}</p>
                           </div>
                        </div>
                     </td>
                     <td className="py-4 px-4 text-xs text-gray-500 font-medium hidden md:table-cell">
                        {format(new Date(song.addedAt), 'MMM d, yyyy')}
                     </td>
                     <td className="py-4 px-2 md:px-4 text-right pr-4 md:pr-8">
                        <div className="flex items-center justify-end gap-2">
                           <button 
                             onClick={(e) => handleRemoveSong(e, song.id)}
                             className="md:opacity-0 md:group-hover:opacity-100 p-2 text-gray-500 hover:text-red-500 transition-all active:scale-75"
                           >
                              <Trash2 className="w-4 h-4" />
                           </button>
                           <span className="text-[10px] md:text-xs text-gray-600 font-bold tabular-nums">
                              {song.duration ? `${Math.floor(song.duration / 60)}:${Math.floor(song.duration % 60).toString().padStart(2, '0')}` : '--:--'}
                           </span>
                        </div>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
         
         {playlist.songs.length === 0 && (
            <div className="py-32 text-center space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
               <div className="mx-auto w-24 h-24 rounded-full bg-white/5 flex items-center justify-center text-gray-700 shadow-inner">
                  <Music className="w-12 h-12" />
               </div>
               <div className="space-y-2">
                  <h3 className="text-xl font-black text-white tracking-tight">Your playlist is empty</h3>
                  <p className="text-gray-500 max-w-xs mx-auto font-medium text-sm">
                    Go find some music and add it to this collection to start playing.
                  </p>
               </div>
               <a href="/dashboard/search" className="inline-block px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-full transition-all border border-white/10">
                  Find Music
               </a>
            </div>
         )}
      </div>
    </div>
  );
}
