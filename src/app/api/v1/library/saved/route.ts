import { NextResponse } from 'next/server';
import { getApiSession, UNAUTHORIZED_RESPONSE } from '@/lib/auth-api';
import User from '@/modules/auth/auth.schema';
import dbConnect from '@/lib/db';

export async function GET() {
  try {
    const session = await getApiSession();
    if (!session) {
      return NextResponse.json({ error: UNAUTHORIZED_RESPONSE.error }, { status: UNAUTHORIZED_RESPONSE.status });
    }

    await dbConnect();
    const user = await User.findById(session.userId).populate('savedSongs');
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      savedSongs: JSON.parse(JSON.stringify(user.savedSongs))
    });

  } catch (error) {
    console.error('API Get Saved Songs Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
