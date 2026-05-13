'use client';

import { Play, Heart, Music, ListMusic, ChevronRight, Loader2, Bookmark } from 'lucide-react';
import Link from 'next/link';
import { HomeData } from '@/modules/home/home.types';
import { usePlayerStore } from '@/store/usePlayerStore';
import { cn } from '@/lib/utils';

import { useState, useEffect } from 'react';

export function HomeDashboard({ data }: { data: HomeData }) {
  const { setCurrentTrack, isExtracting, setLikedSongs, setSavedSongs } = usePlayerStore();

  useEffect(() => {
    if (data.likedSongs) {
      setLikedSongs(data.likedSongs);
    }
    if (data.savedSongs) {
      setSavedSongs(data.savedSongs);
    }
  }, [data.likedSongs, data.savedSongs, setLikedSongs, setSavedSongs]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header & Greeting */}
      <header className="space-y-1">
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter">
          {data.greeting}, <span className="text-red-600">{data.userName}</span>
        </h1>
        <p className="text-gray-500 font-medium">Ready for some music?</p>
      </header>

      {/* Jump Back In Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-white uppercase tracking-wider">Jump Back In</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Liked Songs Card */}
          <Link
            href="/dashboard/library/liked"
            className="group flex items-center gap-4 bg-[#1e1e1e] hover:bg-[#252525] border border-white/5 rounded-2xl p-4 transition-all hover:scale-[1.02] shadow-xl"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-red-600 to-red-900 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-3 transition-transform">
              <Heart className="w-8 h-8 text-white fill-current" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-black text-white">Liked Songs</h3>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">
                {data.jumpBackIn.likedSongs.count} Songs
              </p>
            </div>
            <div className="p-3 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
              <Play className="w-5 h-5 text-white fill-current" />
            </div>
          </Link>

          {/* Saved Songs Card (Individual Saves) */}
          <Link
            href="/dashboard/library/saved"
            className="group flex items-center gap-4 bg-[#1e1e1e] hover:bg-[#252525] border border-white/5 rounded-2xl p-4 transition-all hover:scale-[1.02] shadow-xl"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-600 to-blue-900 rounded-xl flex items-center justify-center shadow-lg group-hover:-rotate-3 transition-transform">
              <Bookmark className="w-8 h-8 text-white fill-current" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-black text-white">Saved Tracks</h3>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">
                {data.savedSongs.length} Songs
              </p>
            </div>
            <div className="p-3 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
              <Play className="w-5 h-5 text-white fill-current" />
            </div>
          </Link>

          {/* Recent Playlist Card */}
          {data.jumpBackIn.recentPlaylist ? (
            <Link
              href={`/dashboard/library/${data.jumpBackIn.recentPlaylist.id}`}
              className="group flex items-center gap-4 bg-[#1e1e1e] hover:bg-[#252525] border border-white/5 rounded-2xl p-4 transition-all hover:scale-[1.02] shadow-xl"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden shadow-lg border border-white/5 group-hover:-rotate-3 transition-transform">
                <img src={data.jumpBackIn.recentPlaylist.thumbnail} className="w-full h-full object-cover" alt="" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-black text-white truncate max-w-[150px] md:max-w-none">
                  {data.jumpBackIn.recentPlaylist.name}
                </h3>
                <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Recent Collection</p>
              </div>
              <div className="p-3 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                <Play className="w-5 h-5 text-white fill-current" />
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-4 bg-[#1e1e1e]/50 border border-dashed border-white/10 rounded-2xl p-4 opacity-50">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/5 rounded-xl flex items-center justify-center">
                <ListMusic className="w-8 h-8 text-gray-700" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-600">No Recent Playlists</h3>
                <p className="text-xs text-gray-700 font-bold uppercase tracking-widest">Create one to get started</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Recently Played Section */}
      {data.recentlyPlayed.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-white uppercase tracking-wider">Recently Played</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {data.recentlyPlayed.map((song) => (
              <div
                key={`recent-${song.id}`}
                className="group space-y-4 cursor-pointer"
                onClick={() => setCurrentTrack({
                  id: song.id,
                  title: song.title,
                  artist: song.artist,
                  thumbnail: song.thumbnail,
                  streamUrl: '',
                })}
              >
                <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl border border-white/5">
                  <img
                    src={song.thumbnail}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    alt={song.title}
                  />
                  <div className={cn(
                    "absolute inset-0 bg-black/40 transition-opacity flex items-center justify-center",
                    isExtracting === song.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  )}>
                    <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                      {isExtracting === song.id ? (
                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                      ) : (
                        <Play className="w-6 h-6 text-white fill-current" />
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-1 px-1">
                  <h3 className="text-sm font-bold text-white truncate" dangerouslySetInnerHTML={{ __html: song.title }} />
                  <p className="text-xs text-gray-500 font-medium truncate">{song.artist}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recommendations Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-white uppercase tracking-wider">Made For You</h2>
          <button className="text-xs font-black text-red-500 uppercase tracking-widest hover:underline flex items-center gap-1">
            Discover More <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {data.recommendations.map((song) => (
            <div
              key={song.id}
              className="group space-y-4 cursor-pointer"
              onClick={() => setCurrentTrack({
                id: song.id,
                title: song.title,
                artist: song.artist,
                thumbnail: song.thumbnail,
                streamUrl: '', // Will be extracted on play
              })}
            >
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl border border-white/5">
                <img
                  src={song.thumbnail}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  alt={song.title}
                />
                <div className={cn(
                  "absolute inset-0 bg-black/40 transition-opacity flex items-center justify-center",
                  isExtracting === song.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                )}>
                  <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                    {isExtracting === song.id ? (
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    ) : (
                      <Play className="w-6 h-6 text-white fill-current" />
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-1 px-1">
                <h3 className="text-sm font-bold text-white truncate" dangerouslySetInnerHTML={{ __html: song.title }} />
                <p className="text-xs text-gray-400 truncate">{song.artist}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
