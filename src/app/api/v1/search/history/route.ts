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
    const user = await User.findById(session.userId as string).select('recentSearches');

    return NextResponse.json({
      success: true,
      history: user?.recentSearches || []
    });

  } catch (error) {
    console.error('API Search History GET Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getApiSession();
    if (!session) {
      return NextResponse.json({ error: UNAUTHORIZED_RESPONSE.error }, { status: UNAUTHORIZED_RESPONSE.status });
    }

    const { query } = await req.json();
    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    await dbConnect();
    
    // Add to recentSearches, remove duplicates, limit to 10
    await User.findByIdAndUpdate(session.userId as string, {
      $pull: { recentSearches: query } // Remove if exists
    });
    
    await User.findByIdAndUpdate(session.userId as string, {
      $push: { 
        recentSearches: { 
          $each: [query], 
          $position: 0, 
          $slice: 10 
        } 
      }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('API Search History POST Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getApiSession();
    if (!session) {
      return NextResponse.json({ error: UNAUTHORIZED_RESPONSE.error }, { status: UNAUTHORIZED_RESPONSE.status });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    await dbConnect();

    if (query) {
      // Delete specific query
      await User.findByIdAndUpdate(session.userId as string, {
        $pull: { recentSearches: query }
      });
    } else {
      // Clear all
      await User.findByIdAndUpdate(session.userId as string, {
        $set: { recentSearches: [] }
      });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('API Search History DELETE Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
