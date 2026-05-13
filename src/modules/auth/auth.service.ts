import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { SignJWT, jwtVerify } from 'jose';
import User, { IUser } from './auth.schema';
import dbConnect from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const ENCODED_SECRET = new TextEncoder().encode(JWT_SECRET);

export class AuthService {
  /**
   * Verify user credentials
   */
  static async verifyCredentials(email: string, password: string): Promise<IUser | null> {
    await dbConnect();
    const user = await User.findOne({ email });
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return null;

    return user;
  }

  /**
   * Encrypt session using jose (Next.js 16 recommended)
   */
  static async encryptSession(payload: any) {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(ENCODED_SECRET);
  }

  /**
   * Decrypt session using jose
   */
  static async decryptSession(token: string) {
    try {
      const { payload } = await jwtVerify(token, ENCODED_SECRET, {
        algorithms: ['HS256'],
      });
      return payload;
    } catch (error) {
      return null;
    }
  }

  static async generateOtp(email: string) {
    await dbConnect();
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = await User.findOneAndUpdate(
      { email },
      { resetToken: otp, resetTokenExpiry: expiry },
      { new: true }
    );
    return user ? otp : null;
  }

  static async verifyOtp(email: string, otp: string) {
    await dbConnect();
    const user = await User.findOne({
      email,
      resetToken: otp,
      resetTokenExpiry: { $gt: new Date() },
    });
    return !!user;
  }

  static async resetPassword(email: string, otp: string, newPassword: string) {
    await dbConnect();
    const user = await User.findOne({
      email,
      resetToken: otp,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!user) return false;

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(user._id, {
      passwordHash,
      $unset: { resetToken: 1, resetTokenExpiry: 1 },
    });
    return true;
  }
}
