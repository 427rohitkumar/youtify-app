import { getLikedSongsAction } from '@/modules/song/song.controller';
import { LikedSongsView } from '@/components/library/LikedSongsView';

export const metadata = {
  title: 'Liked Songs | Youtify',
  description: 'Your personal collection of favorite tracks.',
};

export default async function LikedSongsPage() {
  const songs = await getLikedSongsAction();

  return (
    <div className="max-w-7xl mx-auto">
      <LikedSongsView songs={songs} />
    </div>
  );
}
