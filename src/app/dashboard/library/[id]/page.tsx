import { getPlaylistDetailAction, deletePlaylistAction } from '@/modules/playlist/playlist.controller';
import { redirect } from 'next/navigation';
import { PlaylistClientView } from '@/components/library/PlaylistClientView';
import { Trash2 } from 'lucide-react';

export default async function PlaylistDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const playlist = await getPlaylistDetailAction(id);

  if (!playlist) {
    redirect('/dashboard/library');
  }

  const handleDelete = async () => {
    'use server';
    await deletePlaylistAction(id);
    redirect('/dashboard/library');
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Server-side only delete action container if needed, or just let client handle it */}
      <div className="flex justify-end pt-4 pr-6">
         <form action={handleDelete}>
            <button 
              title="Delete Playlist"
              className="p-3 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all active:scale-75"
            >
               <Trash2 className="w-5 h-5" />
            </button>
         </form>
      </div>
      <PlaylistClientView playlist={playlist} />
    </div>
  );
}
