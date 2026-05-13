'use client';

import { useState } from 'react';
import { Edit2, Check, X } from 'lucide-react';
import { updateProfileAction } from '@/modules/profile/profile.controller';

interface ProfileHeaderProps {
  user: {
    email: string;
    name: string;
  };
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      await updateProfileAction(name);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const initial = (name || user.email)[0].toUpperCase();

  return (
    <div className="flex flex-col md:flex-row items-center gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
      {/* Avatar */}
      <div className="relative group">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-[#FF0000] to-[#990000] flex items-center justify-center text-5xl md:text-6xl font-black text-white shadow-2xl border-4 border-white/5 ring-8 ring-white/5">
          {initial}
        </div>
        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#0f0f0f] border border-white/10 rounded-full flex items-center justify-center shadow-lg">
           <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 text-center md:text-left space-y-4">
        <div className="space-y-1">
          <div className="flex items-center justify-center md:justify-start gap-3 group">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-[#1e1e1e] border border-red-600 rounded-lg px-3 py-1 text-2xl font-black text-white focus:outline-none"
                  autoFocus
                />
                <button onClick={handleUpdate} disabled={isLoading} className="p-2 bg-green-600 rounded-lg text-white hover:bg-green-700">
                   <Check className="w-4 h-4" />
                </button>
                <button onClick={() => setIsEditing(false)} className="p-2 bg-red-600/20 rounded-lg text-red-500 hover:bg-red-600/30">
                   <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter">{name}</h1>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-red-600 transition-all"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
          <p className="text-gray-500 font-medium text-lg">{user.email}</p>
        </div>

        <div className="flex items-center justify-center md:justify-start gap-3">
          <span className="px-4 py-1 bg-red-600/10 border border-red-600/30 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-full">
            Pro User
          </span>
          <span className="px-4 py-1 bg-white/5 border border-white/10 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-full">
            Developer Mode
          </span>
        </div>
      </div>
    </div>
  );
}
