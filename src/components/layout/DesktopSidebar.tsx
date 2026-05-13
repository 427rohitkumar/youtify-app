'use client';

import { Home, Search, Library, User, Music } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { icon: Home, label: 'Home', href: '/dashboard' },
  { icon: Search, label: 'Search', href: '/dashboard/search' },
  { icon: Library, label: 'Your Library', href: '/dashboard/library' },
  { icon: User, label: 'Profile', href: '/dashboard/profile' },
];

export function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#0f0f0f] p-6 gap-8 h-screen border-r border-white/5">
      <div className="flex items-center gap-3 px-2">
        <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/20">
          <Music className="w-6 h-6 text-white fill-white" />
        </div>
        <span className="text-2xl font-bold tracking-tight">Youtify</span>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = item.href === '/dashboard' 
            ? pathname === '/dashboard' 
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group",
                isActive 
                  ? "bg-red-600/10 text-red-500 font-bold" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn(
                "w-6 h-6 transition-transform group-hover:scale-110",
                isActive ? "text-red-500" : "text-gray-400"
              )} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5">
        <div className="bg-[#1e1e1e] p-4 rounded-2xl">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-gray-300">System Online</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
