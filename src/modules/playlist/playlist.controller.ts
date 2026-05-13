'use server';

import { cookies } from 'next/headers';
import { PlaylistRepository } from './playlist.repository';
import { AuthService } from '../auth/auth.service';
import { CreatePlaylistSchema, AddSongSchema } from './playlist.dto';
import { revalidatePath } from 'next/cache';

async function getUserId() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;
  if (!sessionToken) return null;
  const session = await AuthService.decryptSession(sessionToken);
  return (session?.userId as string) || null;
}

export async function createPlaylistAction(name: string) {
  const userId = await getUserId();
  if (!userId) throw new Error('Unauthorized');

  const validated = CreatePlaylistSchema.safeParse({ name });
  if (!validated.success) throw new Error(validated.error.issues[0].message);

  await PlaylistRepository.create(userId, validated.data.name);
  revalidatePath('/dashboard/library');
}

export async function getPlaylistsAction() {
  const userId = await getUserId();
  if (!userId) return [];
  const playlists = await PlaylistRepository.findAllByUser(userId);
  return JSON.parse(JSON.stringify(playlists)); // Fix for Next.js POJO serialization
}

export async function getPlaylistDetailAction(id: string) {
  const playlist = await PlaylistRepository.findById(id);
  return JSON.parse(JSON.stringify(playlist));
}

export async function addSongToPlaylistAction(playlistId: string, song: any) {
  const validated = AddSongSchema.safeParse(song);
  if (!validated.success) throw new Error('Invalid song data');

  await PlaylistRepository.addSong(playlistId, validated.data);
  revalidatePath(`/dashboard/library/${playlistId}`);
}

export async function removeSongFromPlaylistAction(playlistId: string, songId: string) {
  await PlaylistRepository.removeSong(playlistId, songId);
  revalidatePath(`/dashboard/library/${playlistId}`);
}

export async function deletePlaylistAction(id: string) {
  await PlaylistRepository.delete(id);
  revalidatePath('/dashboard/library');
}
