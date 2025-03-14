import express, { type Request, type Response } from 'express';
import xss from 'xss';
import dotenv from 'dotenv';
import { z } from 'zod';

// middleware
import auth, { type AuthRequest } from '@/middleware/auth';

// models
import userModel from '@/controllers/User';

dotenv.config();
const authRouter = express.Router();

// Validation Schema
const UserSchema = z.object({
    username: z.string().min(3).max(25),
    password: z.string().min(6).max(255),
});

interface AuthResponse {
    success: boolean;
    message: string;
    token: string | null;
    id: string | null;
    username: string | null;
    createdAt: Date | undefined;
}

interface VerificationResponse {
    success: boolean;
    message: string;
    id: string | null;
    username: string | null;
}

// Signup Route
authRouter.post('/signup', async (req: Request, res: Response<AuthResponse>) => {
    try {
        // Sanitize and validate input
        const sanitizedUsername = xss(req.body.username);
        const sanitizedPassword = xss(req.body.password);

        const validatedUser = UserSchema.parse({
            username: sanitizedUsername,
            password: sanitizedPassword,
        });

        // Check if user already exists
        const existingUser = await userModel.findByUsername(validatedUser.username);
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Username is already taken.',
                token: null,
                id: null,
                username: null,
                createdAt: undefined,
            });
        }

        // Save user to the database
        const newUser = await userModel.create(validatedUser.username, validatedUser.password);

        // Generate JWT
        const token = await userModel.createToken(newUser.id, newUser.username);

        res.status(201).json({
            success: true,
            message: 'Signup successful',
            token,
            id: newUser.id,
            username: newUser.username,
            createdAt: newUser.createdAt,
        });
    } catch (error) {
        console.error('Error during signup:', error);

        res.status(500).json({
            success: false,
            message: 'An error occurred during signup.',
            token: null,
            id: null,
            username: null,
            createdAt: undefined,
        });
    }
});

// Login Route
authRouter.post('/login', async (req: Request, res: Response<AuthResponse>) => {
    try {
        // Sanitize and validate input
        const sanitizedUsername = xss(req.body.username);
        const sanitizedPassword = xss(req.body.password);

        const validatedUser = UserSchema.parse({
            username: sanitizedUsername,
            password: sanitizedPassword,
        });

        // Find user in the database
        const user = await userModel.findByUsernameWithPassword(validatedUser.username);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password.',
                token: null,
                id: null,
                username: null,
                createdAt: undefined,
            });
        }

        // Compare passwords
        const isPasswordValid = await userModel.validatePassword(validatedUser.password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password.',
                token: null,
                id: null,
                username: null,
                createdAt: undefined,
            });
        }

        // Generate JWT
        const token = await userModel.createToken(user.id, user.username);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            id: user.id,
            username: user.username,
            createdAt: user.createdAt,
        });
    } catch (error) {
        console.error('Error during login:', error);

        res.status(500).json({
            success: false,
            message: 'An error occurred during login.',
            token: null,
            id: null,
            username: null,
            createdAt: undefined,
        });
    }
});

// Verify logged in user
authRouter.get('/me', auth, async (req: AuthRequest, res: Response<VerificationResponse>) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.',
                id: null,
                username: null,
            });
        }

        const token = req.token;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
                id: null,
                username: null,
            });
        }

        // Success
        res.status(200).json({
            success: true,
            message: 'Authenticated',
            id: user.id,
            username: user.username,
        });

    } catch (error) {
        console.error('Error during fetching user:', error);

        res.status(500).json({
            success: false,
            message: 'An error occurred during fetching user.',
            id: null,
            username: null,
        });
    }
});

//  TODO
// authRouter.post('/refresh', auth, async (req: AuthRequest, res: Response<AuthResponse>) => {

// });



export default authRouter;
