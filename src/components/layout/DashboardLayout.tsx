import { DesktopSidebar } from './DesktopSidebar';
import { MobileBottomNav } from './MobileBottomNav';
import { PlayerBar } from './PlayerBar';
import { ReactNode } from 'react';

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-[#0f0f0f] text-white overflow-hidden">
      {/* Sidebar for Desktop */}
      <DesktopSidebar />

      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-40 md:pb-24 bg-gradient-to-b from-[#1e1e1e]/40 to-[#0f0f0f]">
          <div className="max-w-7xl mx-auto p-4 md:p-8">
            {children}
          </div>
        </main>

        {/* Bottom Nav for Mobile */}
        <MobileBottomNav />

        {/* Global Player Bar */}
        <PlayerBar />
      </div>
    </div>
  );
}
