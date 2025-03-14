import prisma from "@/api/prisma/client";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface UserModelType {
    id: string;
    username: string;
    createdAt?: Date;
    updatedAt?: Date;
};

interface UserModelPasswordType extends UserModelType {
    password: string;
};

class User {
    async findAll(): Promise<UserModelType[]> {
        return await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                createdAt: true,
                updatedAt: true,
            }, // Only return non-sensitive fields
        });
    }

    async findById(id: string): Promise<UserModelType | null> {
        return await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                username: true,
                createdAt: true,
                updatedAt: true,
            }, // Only return non-sensitive fields
        });
    }

    async findByUsername(username: string): Promise<UserModelType | null> {
        return await prisma.user.findUnique({
            where: { username },
            select: {
                id: true,
                username: true,
                createdAt: true,
                updatedAt: true,
            }, // Only return non-sensitive fields
        });
    }

    async findByUsernameWithPassword(username: string): Promise<UserModelPasswordType | null> {
        return await prisma.user.findUnique({
            where: { username },
            select: {
                id: true,
                username: true,
                password: true,
                createdAt: true,
                updatedAt: true,
            }, // Return all fields
        });
    };

    async create(username: string, password: string): Promise<UserModelType> {
        // Hash the password
        const SALT_ROUNDS = 10;
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Create new user in the database
        return await prisma.user.create({
            data: {
                username: username,
                password: hashedPassword,
            },
        });
    }

    async createToken(id: string, username: string): Promise<string> {
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            throw new Error('JWT_SECRET not found in environment variables.');
        }

        // Generate JWT
        const token = jwt.sign(
            { id, username }, // Only include necessary data
            JWT_SECRET,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        return token;
    }

    async validatePassword(inputPassword: string, storedPassword: string): Promise<boolean> {
        return await bcrypt.compare(inputPassword, storedPassword);
    }

    async delete(id: string): Promise<UserModelType> {
        return await prisma.user.delete({
            where: { id },
        });
    }
}
const userModel = new User();

export default userModel;
export type { UserModelType, UserModelPasswordType };