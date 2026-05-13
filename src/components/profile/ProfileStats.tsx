'use client';

import { ListMusic, Heart, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface ProfileStatsProps {
  stats: {
    playlistCount: number;
    totalSongs: number;
    joinedAt: Date;
  };
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  const items = [
    {
      label: 'Playlists',
      value: stats.playlistCount,
      icon: ListMusic,
      color: 'text-red-500',
      bg: 'bg-red-500/10',
    },
    {
      label: 'Saved Songs',
      value: stats.totalSongs,
      icon: Heart,
      color: 'text-red-500',
      bg: 'bg-red-500/10',
    },
    {
      label: 'Member Since',
      value: stats.joinedAt && !isNaN(new Date(stats.joinedAt).getTime()) 
        ? format(new Date(stats.joinedAt), 'yyyy') 
        : new Date().getFullYear().toString(),
      icon: Calendar,
      color: 'text-red-500',
      bg: 'bg-red-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {items.map((item, i) => (
        <div 
          key={i}
          className="p-6 bg-[#1e1e1e] border border-white/5 rounded-3xl space-y-4 hover:bg-[#252525] transition-all group"
        >
          <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
            <item.icon className={`w-6 h-6 ${item.color}`} />
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-black text-white tabular-nums">{item.value}</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">{item.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
