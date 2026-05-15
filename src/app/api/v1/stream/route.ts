import { NextResponse } from 'next/server';
import { getApiSession, UNAUTHORIZED_RESPONSE } from '@/lib/auth-api';

// We reuse the logic from the existing extract route but with added auth
export async function GET(req: Request) {
  try {
    const session = await getApiSession();
    if (!session) {
      return NextResponse.json({ error: UNAUTHORIZED_RESPONSE.error }, { status: UNAUTHORIZED_RESPONSE.status });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Song ID (youtubeId) is required' }, { status: 400 });
    }

    // Call the internal extraction logic by redirecting or fetching
    // For simplicity and efficiency, we'll fetch our own internal API
    const origin = new URL(req.url).origin;
    const extractRes = await fetch(`${origin}/api/extract?videoId=${id}`);
    const data = await extractRes.json();

    if (!extractRes.ok) {
      return NextResponse.json(data, { status: extractRes.status });
    }

    return NextResponse.json({
      success: true,
      ...data
    });

  } catch (error) {
    console.error('API Stream Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
