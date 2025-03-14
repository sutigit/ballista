"use server";

// defintions
import { AuthResponse } from '../definitions/Auth';

// Session
import { createSession, } from '../session/create';
import { deleteSession } from '../session/delete';

import dotenv from 'dotenv';
dotenv.config();

export const login = async (username: string, password: string): Promise<AuthResponse> => {
    try {
        // 1. login user
        const response = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        // 2. handle response
        if (!response.ok) {
            return {
                success: false,
                message: 'Invalid username or password',
                id: null,
                username: null,
            }
        }

        // 3. Create session
        const user = await response.json();
        const success = await createSession(user.token);
        if (!success) {
            return {
                success: false,
                message: 'Hmm, unexpected error occurred, please try again.',
                id: null,
                username: null,
            }
        }

        // 4. return response
        return {
            success: true,
            message: 'Login successful',
            id: user.id,
            username: user.username,
        }
    } catch (error) {
        return {
            success: false,
            message: 'Hmm, unexpected error occurred, please try again.',
            id: null,
            username: null,
        }
    }
};

export const logout = async (): Promise<boolean> => {
    try {
        return await deleteSession();
    } catch (error) {
        return false;
    }
}
