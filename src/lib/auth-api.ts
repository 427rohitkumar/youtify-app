import { headers } from 'next/headers';
import { AuthService } from '@/modules/auth/auth.service';

/**
 * Verifies that the request has a valid X-API-Key header.
 * This ensures the request is coming from our authorized Mobile/Web app.
 */
export async function verifyApiKey() {
  const headerList = await headers();
  const apiKey = headerList.get('x-api-key');
  const validApiKey = process.env.APP_API_KEY || 'youtify_internal_key_2026';
  
  return apiKey === validApiKey;
}

/**
 * Helper to get the current session from the Authorization header
 * for REST API calls from mobile apps.
 */
export async function getApiSession() {
  // 1. API Key Security
  if (!(await verifyApiKey())) {
    return null;
  }

  // 2. JWT Security
  const headerList = await headers();
  const authHeader = headerList.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  if (!token) return null;

  return await AuthService.decryptSession(token);
}

/**
 * Standard error response for unauthorized API calls
 */
export const UNAUTHORIZED_RESPONSE = {
  error: 'Unauthorized. Please provide a valid Bearer token in the Authorization header.',
  status: 401
};
