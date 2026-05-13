'use client';

import { Shield, Key, LogOut, Bell, ChevronRight, Palette } from 'lucide-react';
import { logoutAction } from '@/modules/auth/auth.controller';

export function ProfileActions() {
  return (
    <div className="space-y-6">
      <div className="bg-[#1e1e1e] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <form action={logoutAction}>
          <button className="w-full flex items-center gap-4 p-6 text-red-500 hover:bg-red-500/10 transition-all font-bold group">
            <div className="p-3 bg-red-500/10 rounded-xl group-hover:rotate-12 transition-transform">
              <LogOut className="w-6 h-6" />
            </div>
            <span className="text-lg">Sign Out from Youtify</span>
          </button>
        </form>
      </div>

      <div className="pt-10 text-center">
         <p className="text-[10px] text-gray-700 font-bold uppercase tracking-[0.3em]">Youtify v1.0.4 - Premium Engine</p>
      </div>
    </div>
  );
}
