import { NextResponse } from 'next/server';
import { getApiSession, UNAUTHORIZED_RESPONSE } from '@/lib/auth-api';
import { SongRepository } from '@/modules/song/song.repository';
import User from '@/modules/auth/auth.schema';
import dbConnect from '@/lib/db';

export async function POST(req: Request) {
  try {
    const session = await getApiSession();
    if (!session) {
      return NextResponse.json({ error: UNAUTHORIZED_RESPONSE.error }, { status: UNAUTHORIZED_RESPONSE.status });
    }

    const songData = await req.json();
    if (!songData || !songData.youtubeId) {
      return NextResponse.json({ error: 'Song data with youtubeId is required' }, { status: 400 });
    }

    await dbConnect();

    // 1. Ensure song exists in DB
    const song = await SongRepository.saveOrUpdate(songData);
    if (!song) {
      return NextResponse.json({ error: 'Failed to process song' }, { status: 500 });
    }

    // 2. Toggle in User.likedSongs
    const user = await User.findById(session.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const songId = song._id;
    const isLiked = user.likedSongs.some((id: any) => id.toString() === songId.toString());

    if (isLiked) {
      user.likedSongs = user.likedSongs.filter((id: any) => id.toString() !== songId.toString());
    } else {
      user.likedSongs.push(songId);
    }

    await user.save();

    return NextResponse.json({
      success: true,
      isLiked: !isLiked,
      message: isLiked ? 'Removed from liked songs' : 'Added to liked songs'
    });

  } catch (error) {
    console.error('API Toggle Like Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
