import { NextResponse } from 'next/server';
import { getApiSession, UNAUTHORIZED_RESPONSE } from '@/lib/auth-api';
import User from '@/modules/auth/auth.schema';
import Playlist from '@/modules/playlist/playlist.schema';
import dbConnect from '@/lib/db';

export async function GET() {
  try {
    const session = await getApiSession();
    if (!session) {
      return NextResponse.json({ error: UNAUTHORIZED_RESPONSE.error }, { status: UNAUTHORIZED_RESPONSE.status });
    }

    await dbConnect();
    const user = await User.findById(session.userId as string).select('email name createdAt likedSongs savedSongs');
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const playlistCount = await Playlist.countDocuments({ userId: session.userId as string });

    return NextResponse.json({
      success: true,
      profile: {
        id: user._id,
        email: user.email,
        name: user.name || user.email.split('@')[0],
        joinedAt: user.createdAt,
        stats: {
          playlists: playlistCount,
          likedSongs: user.likedSongs.length,
          savedSongs: user.savedSongs.length,
        }
      }
    });

  } catch (error) {
    console.error('API Get Profile Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getApiSession();
    if (!session) {
      return NextResponse.json({ error: UNAUTHORIZED_RESPONSE.error }, { status: UNAUTHORIZED_RESPONSE.status });
    }

    const { name } = await req.json();
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findByIdAndUpdate(session.userId as string, { name }, { new: true });

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      }
    });

  } catch (error) {
    console.error('API Update Profile Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
