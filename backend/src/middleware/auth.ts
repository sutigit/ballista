import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// types
import { type Request, type Response, type NextFunction } from 'express';

// models
import userModel, { type UserModelType } from '@/controllers/User';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error('JWT_SECRET not found in environment variables.');
    process.exit(1);
}

export interface AuthRequest extends Request {
    user?: UserModelType
    token?: string
}

interface DecodedToken {
    id: string
}

const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '')

        if (!token) {
            throw new Error('Authentication failed. Token missing.')
        }

        const decoded = jwt.verify(token, JWT_SECRET as string) as DecodedToken

        const user = await userModel.findById(decoded.id)

        if (!user) {
            throw new Error('Authentication failed. User not found.')
        }

        req.user = user
        req.token = token
        next()
    } catch (error) {
        res.status(401).send({ error: 'Authentication failed.' })
    }
}

export default auth;
