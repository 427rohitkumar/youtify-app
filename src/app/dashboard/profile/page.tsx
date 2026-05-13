import { getProfileDataAction } from '@/modules/profile/profile.controller';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileStats } from '@/components/profile/ProfileStats';
import { ProfileActions } from '@/components/profile/ProfileActions';

export const metadata = {
  title: 'Profile | Youtify',
  description: 'Manage your Youtify account and view your listening stats.',
};

export default async function ProfilePage() {
  const profile = await getProfileDataAction();

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-32">
      {/* Identity Section */}
      <section className="pt-8">
        <ProfileHeader user={{ email: profile.email, name: profile.name }} />
      </section>

      {/* Stats Section */}
      <section className="space-y-6">
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-500 pl-2">Overview</h3>
        <ProfileStats stats={{ 
          playlistCount: profile.playlistCount, 
          totalSongs: profile.totalSongs, 
          joinedAt: profile.joinedAt 
        }} />
      </section>

      {/* Actions & Settings */}
      <section>
        <ProfileActions />
      </section>
    </div>
  );
}
