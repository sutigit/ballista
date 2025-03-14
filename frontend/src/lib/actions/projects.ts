"use server";

// defintions
import { type ProjectModel } from '../definitions/Project';

import dotenv from 'dotenv';
import { verifySession } from '../session/verifySession';
import { revalidatePath } from 'next/cache';
dotenv.config();

export const getProjects = async (): Promise<ProjectModel[]> => {
    try {
        const session = await verifySession();
        if (!session.isAuth) {
            return [];
        }

        const userId = session.userId;
        const token = session.token;

        const response = await fetch(`${process.env.BACKEND_URL}/api/users/${userId}/projects`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            return [];
        }

        const { data } = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const getProject = async (projectId: string): Promise<ProjectModel | null> => {
    try {
        const session = await verifySession();
        if (!session.isAuth) {
            return null;
        }

        const userId = session.userId;
        const token = session.token;

        const response = await fetch(`${process.env.BACKEND_URL}/api/users/${userId}/projects/${projectId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            return null;
        }

        const { data } = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const createProject = async (): Promise<ProjectModel | null> => {
    try {
        const session = await verifySession();
        if (!session.isAuth) {
            return null;
        }

        const userId = session.userId;
        const token = session.token;
        
        const response = await fetch(`${process.env.BACKEND_URL}/api/users/${userId}/projects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name: 'New Project' }),
        });

        if (!response.ok) {
            return null;
        }

        const { data } = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const updateProject = async (projectId: string, prompt: string): Promise<ProjectModel | null> => {
    try {
        const session = await verifySession();
        if (!session.isAuth) {
            return null;
        }

        const userId = session.userId;
        const token = session.token;
        
        const response = await fetch(`${process.env.BACKEND_URL}/api/users/${userId}/projects/${projectId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
            return null;
        }

        const { data } = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const deleteProject = async (projectId: string): Promise<ProjectModel | null> => {
    try {
        const session = await verifySession();
        if (!session.isAuth) {
            return null;
        }

        const userId = session.userId;
        const token = session.token;
        
        const response = await fetch(`${process.env.BACKEND_URL}/api/users/${userId}/projects/${projectId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            return null;
        }

        revalidatePath(`/${session.username}/dashboard`);

        const { data } = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
};
