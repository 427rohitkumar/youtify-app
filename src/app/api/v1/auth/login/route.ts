import { NextResponse } from 'next/server';
import { AuthService } from '@/modules/auth/auth.service';
import { verifyApiKey } from '@/lib/auth-api';
import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    // 1. API Key Security
    if (!(await verifyApiKey())) {
      return NextResponse.json({ error: 'Unauthorized: Invalid API Key' }, { status: 401 });
    }

    const body = await req.json();
    
    // Validate request body
    const validated = LoginSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ error: validated.error.issues[0].message }, { status: 400 });
    }

    const { email, password } = validated.data;
    const user = await AuthService.verifyCredentials(email, password);

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Create session token
    const token = await AuthService.encryptSession({ 
      userId: user._id.toString(),
      email: user.email 
    });

    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      accessToken: token
    });

  } catch (error) {
    console.error('API Login Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
