import { getPlaylistsAction } from '@/modules/playlist/playlist.controller';
import { PlaylistGrid } from '@/components/library/PlaylistGrid';
import { Music } from 'lucide-react';

export const metadata = {
  title: 'Library | Youtify',
  description: 'Manage your music collection and playlists.',
};

export default async function LibraryPage() {
  const playlists = await getPlaylistsAction();

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-white tracking-tight">Your Library</h1>
        <p className="text-gray-500 font-medium">Create and manage your music collections.</p>
      </header>

      {playlists.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
           <div className="space-y-6">
              <div className="mx-auto w-24 h-24 rounded-full bg-white/5 flex items-center justify-center text-white/10 shadow-inner">
                 <Music className="w-12 h-12" />
              </div>
              <div className="space-y-2">
                 <h2 className="text-2xl font-black text-white tracking-tight">No playlists yet</h2>
                 <p className="text-gray-500 max-w-xs mx-auto font-medium">
                   Start by creating your first playlist to organize your favorite tracks.
                 </p>
              </div>
           </div>
           
           <div className="w-full max-w-5xl mx-auto">
              <PlaylistGrid playlists={[]} />
           </div>
        </div>
      ) : (
        <PlaylistGrid playlists={playlists} />
      )}
    </div>
  );
}
