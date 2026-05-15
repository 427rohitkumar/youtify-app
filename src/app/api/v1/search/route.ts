import { NextResponse } from 'next/server';
import { SearchService } from '@/modules/search/search.service';
import { getApiSession, UNAUTHORIZED_RESPONSE } from '@/lib/auth-api';

export async function GET(req: Request) {
  try {
    const session = await getApiSession();
    if (!session) {
      return NextResponse.json({ error: UNAUTHORIZED_RESPONSE.error }, { status: UNAUTHORIZED_RESPONSE.status });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type') || 'search'; // 'search' or 'suggest'

    if (!query) {
      return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
    }

    if (type === 'suggest') {
      const suggestions = await SearchService.getSuggestions(query);
      return NextResponse.json({ success: true, suggestions });
    }

    const results = await SearchService.searchVideos(query);
    return NextResponse.json({ success: true, results });

  } catch (error) {
    console.error('API Search Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
