import { NextResponse } from 'next/server';
import { verifyApiKey } from '@/lib/auth-api';
import { AuthService } from '@/modules/auth/auth.service';
import User from '@/modules/auth/auth.schema';
import dbConnect from '@/lib/db';

export async function POST(req: Request) {
  try {
    // 1. API Key Security
    if (!(await verifyApiKey())) {
      return NextResponse.json({ error: 'Unauthorized: Invalid API Key' }, { status: 401 });
    }

    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
    }

    const isValid = await AuthService.verifyOtp(email, otp);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 401 });
    }

    // Get user to generate token
    await dbConnect();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const token = await AuthService.encryptSession({ 
      userId: user._id.toString(),
      email: user.email 
    });

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      accessToken: token
    });

  } catch (error) {
    console.error('API Verify OTP Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
