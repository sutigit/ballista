import 'server-only';
import { cache } from 'react';
import { cookies } from 'next/headers';
import dotenv from 'dotenv';
dotenv.config();

// AuthResponse type
import { AuthResponse } from '../definitions/Auth';

interface SessionResponse {
  isAuth: boolean;
  userId: string | null;
  username: string | null;
  token: string | null;
}

export const verifySession = cache(async (): Promise<SessionResponse> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;

    if (!token) {
      return {
        isAuth: false,
        userId: null,
        username: null,
        token: null
      };
    }

    // Call backend to verify token
    const response = await fetch(`${process.env.BACKEND_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Invalid or expired session token');
    }

    const user: AuthResponse = await response.json();

    return {
      isAuth: user.success,
      userId: user.id,
      username: user.username,
      token,
    }
  } catch (error) {
    console.error('Failed to verify session:', error);
    return {
      isAuth: false,
      userId: null,
      username: null,
      token: null
    };
  }
});
