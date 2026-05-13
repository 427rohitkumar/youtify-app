'use server';

import { SongRepository } from './song.repository';
import { getSession } from '../auth/auth.controller';

export async function autoSaveSongAction(songData: any) {
  try {
    const session = await getSession();
    if (!session) return { error: 'Unauthorized' };

    const song = await SongRepository.saveOrUpdate({
      ...songData,
      isAutoSaved: true
    });

    return { success: true, song: JSON.parse(JSON.stringify(song)) };
  } catch (error) {
    console.error('Auto Save Error:', error);
    return { error: 'Failed to auto-save history' };
  }
}

export async function getCachedSongAction(youtubeId: string) {
  try {
    const song = await SongRepository.findByYoutubeId(youtubeId);
    return song ? JSON.parse(JSON.stringify(song)) : null;
  } catch (error) {
    return null;
  }
}
export async function toggleLikeSongAction(songData: any) {
  try {
    const session = await getSession();
    if (!session) return { error: 'Unauthorized' };

    // 1. Ensure song exists in DB
    const song = await SongRepository.saveOrUpdate(songData);
    if (!song) return { error: 'Failed to process song' };

    // 2. Toggle in User.likedSongs
    const { default: User } = await import('../auth/auth.schema');
    const user = await User.findById(session.userId);
    if (!user) return { error: 'User not found' };

    const songId = song._id;
    const isLiked = user.likedSongs.some((id: any) => id.toString() === songId.toString());

    if (isLiked) {
      user.likedSongs = user.likedSongs.filter((id: any) => id.toString() !== songId.toString());
    } else {
      user.likedSongs.push(songId);
    }

    await user.save();
    
    // Return all liked youtubeIds for the store
    const updatedUser = await User.findById(session.userId).populate('likedSongs');
    const likedYoutubeIds = updatedUser.likedSongs?.map((s: any) => s.youtubeId) || [];

    const { revalidatePath } = await import('next/cache');
    revalidatePath('/dashboard');
    revalidatePath('/');

    return { 
      success: true, 
      isLiked: !isLiked,
      likedSongs: likedYoutubeIds
    };
  } catch (error) {
    console.error('Toggle Like Error:', error);
    return { error: 'Failed to toggle like' };
  }
}

export async function getLikedSongsAction() {
  try {
    const session = await getSession();
    if (!session) return [];

    const { default: User } = await import('../auth/auth.schema');
    const user = await User.findById(session.userId).populate('likedSongs');
    if (!user) return [];

    return JSON.parse(JSON.stringify(user.likedSongs));
  } catch (error) {
    console.error('Get Liked Songs Error:', error);
    return [];
  }
}
export async function toggleSaveSongAction(songData: any) {
  try {
    const session = await getSession();
    if (!session) return { error: 'Unauthorized' };

    // 1. Ensure song exists in DB
    const song = await SongRepository.saveOrUpdate(songData);
    if (!song) return { error: 'Failed to process song' };

    // 2. Toggle in User.savedSongs
    const { default: User } = await import('../auth/auth.schema');
    const user = await User.findById(session.userId);
    if (!user) return { error: 'User not found' };

    const songId = song._id;
    const isSaved = user.savedSongs.some((id: any) => id.toString() === songId.toString());

    if (isSaved) {
      user.savedSongs = user.savedSongs.filter((id: any) => id.toString() !== songId.toString());
    } else {
      user.savedSongs.push(songId);
    }

    await user.save();
    
    // Return all saved youtubeIds for the store
    const updatedUser = await User.findById(session.userId).populate('savedSongs');
    const savedYoutubeIds = updatedUser.savedSongs?.map((s: any) => s.youtubeId) || [];

    const { revalidatePath } = await import('next/cache');
    revalidatePath('/dashboard');
    revalidatePath('/');

    return { 
      success: true, 
      isSaved: !isSaved,
      savedSongs: savedYoutubeIds
    };
  } catch (error) {
    console.error('Toggle Save Error:', error);
    return { error: 'Failed to toggle save' };
  }
}

export async function getSavedSongsAction() {
  try {
    const session = await getSession();
    if (!session) return [];

    const { default: User } = await import('../auth/auth.schema');
    const user = await User.findById(session.userId).populate('savedSongs');
    if (!user) return [];

    return JSON.parse(JSON.stringify(user.savedSongs));
  } catch (error) {
    console.error('Get Saved Songs Error:', error);
    return [];
  }
}
