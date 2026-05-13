import { getSavedSongsAction } from '@/modules/song/song.controller';
import { SavedSongsView } from '@/components/library/SavedSongsView';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Saved Tracks | Youtify',
  description: 'Your individually bookmarked songs.',
};

export default async function SavedSongsPage() {
  const songs = await getSavedSongsAction();

  return (
    <div className="max-w-7xl mx-auto">
      <SavedSongsView songs={songs} />
    </div>
  );
}
