import 'server-only'
import { cookies } from 'next/headers'
 
export async function createSession(token: string): Promise<boolean> {
  const cookieStore = await cookies()
 
  try {
    cookieStore.set('session', token, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60, // 1 hour
      sameSite: 'lax',
      path: '/',
    });

    return true;
  } catch (error) {
    console.error('Failed to set session cookie:', error);
    return false;
  }
}