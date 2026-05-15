import { NextResponse } from 'next/server';
import { getApiSession, UNAUTHORIZED_RESPONSE } from '@/lib/auth-api';
import { PlaylistRepository } from '@/modules/playlist/playlist.repository';

export async function GET() {
  try {
    const session = await getApiSession();
    if (!session) {
      return NextResponse.json({ error: UNAUTHORIZED_RESPONSE.error }, { status: UNAUTHORIZED_RESPONSE.status });
    }

    const playlists = await PlaylistRepository.findAllByUser(session.userId as string);

    return NextResponse.json({
      success: true,
      playlists: JSON.parse(JSON.stringify(playlists))
    });

  } catch (error) {
    console.error('API Get Playlists Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getApiSession();
    if (!session) {
      return NextResponse.json({ error: UNAUTHORIZED_RESPONSE.error }, { status: UNAUTHORIZED_RESPONSE.status });
    }

    const { name, description } = await req.json();
    if (!name) {
      return NextResponse.json({ error: 'Playlist name is required' }, { status: 400 });
    }

    const playlist = await PlaylistRepository.create(session.userId as string, name);

    return NextResponse.json({
      success: true,
      message: 'Playlist created',
      playlist: JSON.parse(JSON.stringify(playlist))
    });

  } catch (error) {
    console.error('API Create Playlist Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
