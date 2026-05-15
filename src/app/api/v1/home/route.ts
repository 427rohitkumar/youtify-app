import { NextResponse } from 'next/server';
import { HomeService } from '@/modules/home/home.service';
import { getApiSession, UNAUTHORIZED_RESPONSE } from '@/lib/auth-api';

export async function GET() {
  try {
    const session = await getApiSession();
    
    if (!session) {
      return NextResponse.json({ error: UNAUTHORIZED_RESPONSE.error }, { status: UNAUTHORIZED_RESPONSE.status });
    }

    const data = await HomeService.getDashboardData(session);
    
    return NextResponse.json({
      success: true,
      data: JSON.parse(JSON.stringify(data))
    });

  } catch (error) {
    console.error('API Home Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
