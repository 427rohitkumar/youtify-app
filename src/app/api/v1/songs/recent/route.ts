import { NextResponse } from 'next/server';
import { getApiSession, UNAUTHORIZED_RESPONSE } from '@/lib/auth-api';
import { SongRepository } from '@/modules/song/song.repository';

export async function GET() {
  try {
    const session = await getApiSession();
    if (!session) {
      return NextResponse.json({ error: UNAUTHORIZED_RESPONSE.error }, { status: UNAUTHORIZED_RESPONSE.status });
    }

    const recentSongs = await SongRepository.findRecent(20);
    
    return NextResponse.json({
      success: true,
      songs: recentSongs.map(s => ({
        id: s.youtubeId,
        title: s.title,
        artist: s.artist,
        thumbnail: s.thumbnail,
        duration: s.duration,
        listenedAt: s.updatedAt
      }))
    });

  } catch (error) {
    console.error('API Recent Songs Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
