'use client';

import { Play, Clock, Heart, Music, Loader2, Trash2 } from 'lucide-react';
import { usePlayerStore, Track } from '@/store/usePlayerStore';
import { cn } from '@/lib/utils';
import { toggleLikeSongAction } from '@/modules/song/song.controller';

export function LikedSongsView({ songs }: { songs: any[] }) {
  const { setCurrentTrack, isExtracting, setLikedSongs, likedSongs, setQueue } = usePlayerStore();

  const handlePlaySong = (song: any, index: number) => {
    const tracks: Track[] = songs.map((s: any) => ({
      id: s.youtubeId,
      title: s.title,
      artist: s.artist,
      thumbnail: s.thumbnail,
      streamUrl: ''
    }));
    setQueue(tracks);
    setCurrentTrack(tracks[index]);
  };

  const handlePlayAll = () => {
    if (songs.length > 0) {
      handlePlaySong(songs[0], 0);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-32 animate-in fade-in duration-700">
      {/* Header Banner */}
      <div className="relative flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 pb-6 md:pb-8 border-b border-white/5">
        <div className="w-40 h-40 md:w-60 md:h-60 rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center flex-shrink-0 relative group">
           <Heart className="w-20 h-20 md:w-24 md:h-24 text-white fill-current drop-shadow-2xl transition-transform group-hover:scale-110 duration-500" />
           <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="flex-1 space-y-3 md:space-y-4 text-center md:text-left">
          <h4 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-red-500">Playlist</h4>
          <h1 className="text-3xl md:text-7xl font-black text-white tracking-tighter leading-tight">Liked Songs</h1>
          <div className="flex items-center justify-center md:justify-start gap-4 text-xs md:text-sm text-gray-400 font-bold uppercase tracking-widest">
            <span>{songs.length} Songs</span>
            <span className="w-1 h-1 rounded-full bg-gray-600" />
            <span>Personal Collection</span>
          </div>
          
          <div className="flex items-center justify-center md:justify-start gap-4 pt-2 md:pt-4">
             <button 
               onClick={handlePlayAll}
               disabled={songs.length === 0}
               className="w-full md:w-auto px-10 py-4 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest rounded-full shadow-2xl shadow-red-900/40 transition-all active:scale-95 flex items-center justify-center gap-3 group disabled:opacity-50 disabled:pointer-events-none"
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
                  <th className="py-4 px-2 md:px-4 font-black">Track</th>
                  <th className="py-4 px-4 font-black hidden md:table-cell">Artist</th>
                  <th className="py-4 px-2 md:px-4 font-black w-20 md:w-24 text-right pr-4 md:pr-8"><Clock className="w-4 h-4 ml-auto" /></th>
               </tr>
            </thead>
            <tbody>
               {songs.map((song: any, index: number) => (
                  <tr 
                    key={song.youtubeId} 
                    onClick={() => handlePlaySong(song, index)}
                    className="group hover:bg-white/5 transition-all cursor-pointer border-b border-white/[0.02] last:border-0"
                  >
                     <td className="py-4 px-2 md:px-4 text-[10px] md:text-xs text-gray-500 font-black tabular-nums text-center">
                        {isExtracting === song.youtubeId ? (
                           <Loader2 className="w-3 h-3 md:w-4 md:h-4 text-red-600 animate-spin mx-auto" />
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
                                isExtracting === song.youtubeId ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                              )}>
                                 {isExtracting === song.youtubeId ? (
                                    <Loader2 className="w-4 h-4 md:w-5 md:h-5 text-white animate-spin" />
                                 ) : (
                                    <Play className="w-4 h-4 md:w-5 md:h-5 text-white fill-current" />
                                 )}
                              </div>
                           </div>
                           <div className="min-w-0">
                              <h4 className="text-xs md:text-sm font-bold text-white truncate group-hover:text-red-500 transition-colors" dangerouslySetInnerHTML={{ __html: song.title }} />
                              <p className="text-[10px] md:text-xs text-gray-500 truncate md:hidden">{song.artist}</p>
                           </div>
                        </div>
                     </td>
                     <td className="py-4 px-4 text-sm text-gray-400 font-medium hidden md:table-cell truncate">
                        {song.artist}
                     </td>
                     <td className="py-4 px-2 md:px-4 text-right pr-4 md:pr-8">
                        <div className="flex items-center justify-end gap-2">
                           <button 
                             onClick={async (e) => {
                               e.stopPropagation();
                               const res = await toggleLikeSongAction({
                                 youtubeId: song.youtubeId,
                                 title: song.title,
                                 artist: song.artist,
                                 thumbnail: song.thumbnail,
                                 duration: song.duration
                               });
                               if (res.success && res.likedSongs) {
                                 setLikedSongs(res.likedSongs);
                               }
                             }}
                             className={cn(
                               "md:opacity-0 md:group-hover:opacity-100 p-2 transition-all active:scale-75",
                               likedSongs.includes(song.youtubeId) ? "text-red-600" : "text-gray-500 hover:text-white"
                             )}
                           >
                              <Heart className={cn("w-4 h-4", likedSongs.includes(song.youtubeId) && "fill-current")} />
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
         
         {songs.length === 0 && (
            <div className="py-32 text-center space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
               <div className="mx-auto w-24 h-24 rounded-full bg-white/5 flex items-center justify-center text-gray-700 shadow-inner">
                  <Music className="w-12 h-12" />
               </div>
               <div className="space-y-2">
                  <h3 className="text-xl font-black text-white tracking-tight">Your collection is empty</h3>
                  <p className="text-gray-500 max-w-xs mx-auto font-medium text-sm">
                    Start hearting your favorite tracks to build your personal library.
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
