import { NextResponse } from 'next/server';
import { AuthService } from '@/modules/auth/auth.service';
import { verifyApiKey } from '@/lib/auth-api';
import { sendOtpEmail } from '@/lib/mail';

export async function POST(req: Request) {
  try {
    // 1. API Key Security
    if (!(await verifyApiKey())) {
      return NextResponse.json({ error: 'Unauthorized: Invalid API Key' }, { status: 401 });
    }

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const otp = await AuthService.generateOtp(email);
    if (!otp) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Send OTP via email
    await sendOtpEmail(email, otp);

    return NextResponse.json({ 
      success: true, 
      message: 'OTP sent to email',
      // In development, we might return it for easier testing, but better to keep it secure
      otp: process.env.NODE_ENV === 'development' ? otp : undefined 
    });

  } catch (error) {
    console.error('API Send OTP Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
