import { NextResponse } from 'next/server';
import { verifyApiKey } from '@/lib/auth-api';

export async function POST(req: Request) {
  try {
    // 1. API Key Security
    if (!(await verifyApiKey())) {
      return NextResponse.json({ error: 'Unauthorized: Invalid API Key' }, { status: 401 });
    }

    // Since we use stateless JWT, "logging out" on the server 
    // is just acknowledging the intent. The client must delete the token.
    return NextResponse.json({ 
      success: true, 
      message: 'Logged out successfully. Please remove the accessToken from your local storage.' 
    });

  } catch (error) {
    console.error('API Logout Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
