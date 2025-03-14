import prisma from "@/api/prisma/client";
import { z } from "zod";

interface ProjectModel {
    id: string;
    name: string;
    ownerId: string;
    threadId: string;
    createdAt: Date;
    updatedAt: Date;
};

const ProjectCreateSchema = z.object({
    name: z.string().min(3).max(100),
    threadId: z.string()
}).strict();

type ProjectCreate = z.infer<typeof ProjectCreateSchema>;


const ProjectUpdateSchema = z.object({
    name: z.string().min(3).max(100).optional(),
}).strict();

type ProjectUpdate = z.infer<typeof ProjectUpdateSchema>;



class Project {

    async findAll(userId: string): Promise<ProjectModel[]> {
        return await prisma.project.findMany({
            where: {
                ownerId: userId,
            },
            select: {
                id: true,
                name: true,
                ownerId: true,
                threadId: true,
                createdAt: true,
                updatedAt: true,
            }
        });
    }

    async findById(userId: string, projectId: string): Promise<ProjectModel | null> {
        return await prisma.project.findFirst({
            where: {
                id: projectId,
                ownerId: userId,
            },
        });
    }

    async create(userId: string, data: ProjectCreate): Promise<ProjectModel> {
        const { name, threadId } = data;

        return await prisma.project.create({
            data: {
                name,
                ownerId: userId,
                threadId,
            },
        });
    }

    async delete(userId: string, projectId: string): Promise<ProjectModel> {
        return await prisma.project.delete({
            where: {
                id: projectId,
                ownerId: userId,
            },
        });
    }

    async update(userId: string, projectId: string, data: ProjectUpdate): Promise<ProjectModel> {
        return await prisma.project.update({
            where: {
                id: projectId,
                ownerId: userId,
            },
            data: {
                name: data.name,
            }
        });
    }
}


const projectModel = new Project();

export default projectModel;
export type {
    ProjectModel,
    ProjectCreate,
    ProjectUpdate,
};
export {
    ProjectCreateSchema,
    ProjectUpdateSchema
};