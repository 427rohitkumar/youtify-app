'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { AuthService } from './auth.service';
import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Validate
  const validated = LoginSchema.safeParse({ email, password });
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  try {
    const user = await AuthService.verifyCredentials(email, password);

    if (!user) {
      return { error: 'Invalid credentials' };
    }

    // Create session
    const sessionToken = await AuthService.encryptSession({ 
      userId: user._id.toString(),
      email: user.email 
    });

    // Set cookie (Async in Next.js 16)
    const cookieStore = await cookies();
    cookieStore.set('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    revalidatePath('/');
  } catch (err) {
    return { error: 'Something went wrong' };
  }

  // Redirect after success
  redirect('/dashboard');
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
  redirect('/');
}

export async function getSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;
  if (!sessionToken) return null;
  return await AuthService.decryptSession(sessionToken);
}
import { sendOtpEmail } from '@/lib/mail';

export async function forgotPasswordAction(email: string) {
  try {
    const otp = await AuthService.generateOtp(email);
    if (!otp) throw new Error('User not found');

    await sendOtpEmail(email, otp);
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function verifyOtpAction(email: string, otp: string) {
  const isValid = await AuthService.verifyOtp(email, otp);
  return { success: isValid };
}

export async function resetPasswordAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const otp = formData.get('otp') as string;
  const password = formData.get('password') as string;

  const success = await AuthService.resetPassword(email, otp, password);
  if (success) {
    return { success: true };
  }
  return { error: 'Failed to reset password. OTP may be invalid or expired.' };
}
