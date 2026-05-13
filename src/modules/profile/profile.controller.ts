'use server';

import { cookies } from 'next/headers';
import { AuthService } from '../auth/auth.service';
import User from '../auth/auth.schema';
import Playlist from '../playlist/playlist.schema';
import dbConnect from '@/lib/db';
import { revalidatePath } from 'next/cache';

async function getUserId() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;
  if (!sessionToken) return null;
  const session = await AuthService.decryptSession(sessionToken);
  return (session?.userId as string) || null;
}

export async function getProfileDataAction() {
  const userId = await getUserId();
  if (!userId) throw new Error('Unauthorized');

  await dbConnect();
  const user = await User.findById(userId).select('email name createdAt');
  const playlistCount = await Playlist.countDocuments({ userId });
  
  // Sum of all songs in all playlists for "Liked/Saved Songs" count
  const playlists = await Playlist.find({ userId }).select('songs');
  const totalSongs = playlists.reduce((acc, p) => acc + p.songs.length, 0);

  return {
    email: user.email,
    name: user.name || user.email.split('@')[0],
    joinedAt: user.createdAt ? user.createdAt.toISOString() : new Date().toISOString(),
    playlistCount,
    totalSongs,
  };
}

export async function updateProfileAction(name: string) {
  const userId = await getUserId();
  if (!userId) throw new Error('Unauthorized');

  await dbConnect();
  await User.findByIdAndUpdate(userId, { name });
  revalidatePath('/dashboard/profile');
}
