import 'server-only';
import { cookies } from 'next/headers';

export async function updateSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;

  if (!session) {
    return null;
  }

  try {
    // Verify and refresh the session token with the backend
    const response = await fetch(`${process.env.BACKEND_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to refresh session token');
    }

    const { newToken } = await response.json();

    // Set the new session cookie
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    cookieStore.set('session', newToken, {
      httpOnly: true,
      secure: true,
      expires: expires,
      sameSite: 'lax', // Use 'strict' if your app allows it
      path: '/',
    });

    return newToken;
  } catch (error) {
    console.error('Failed to update session:', error);
    return null;
  }
}