'use client';

import { Home, Search, Library, User } from 'lucide-react';
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
  { icon: Library, label: 'Library', href: '/dashboard/library' },
  { icon: User, label: 'Profile', href: '/dashboard/profile' },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0f0f0f]/90 backdrop-blur-xl border-t border-white/5 flex justify-around items-center px-4 z-50">
      {navItems.map((item) => {
        const isActive = item.href === '/dashboard' 
          ? pathname === '/dashboard' 
          : pathname.startsWith(item.href);
        return (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 transition-all duration-300",
              isActive ? "text-red-500 scale-110" : "text-gray-400"
            )}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
