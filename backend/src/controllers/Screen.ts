import prisma from "@/api/prisma/client";
import { z } from "zod";

// defaults
import s1 from "@/defaults/default-layouts/small-screens/s1.json";
import m1 from "@/defaults/default-layouts/medium-screens/m1.json";
import l1 from "@/defaults/default-layouts/large-screens/l1.json";
import l2 from "@/defaults/default-layouts/large-screens/l2.json";
import xl1 from "@/defaults/default-layouts/xlarge-screens/xl1.json";


type ScreenType = "SMALL" | "MEDIUM" | "LARGE" | "XLARGE";

type defaultScreenType = "s1" | "m1" | "l1" | "l2" | "xl1";
type defaultThemeType = "default";
type defaultContentType = "default";

interface ScreenModel {
    id: string;
    name: string;
    projectId: string;
    live: boolean;
    pin: string;
    type: ScreenType;
    locked: boolean;
    layout: any;
    theme: any;
    content: any;
    createdAt: Date;
    updatedAt: Date;
}

const ScreenCreateSchema = z.object({
    name: z.string().min(3).max(100),
    type: z.enum(["SMALL", "MEDIUM", "LARGE", "XLARGE"]),
    layout: z.string(),
    theme: z.string(),
    content: z.string(),
}).strict();
type ScreenCreate = z.infer<typeof ScreenCreateSchema>;


const ScreenUpdateSchema = z.object({
    name: z.string().min(3).max(100).optional(),
    live: z.boolean().optional(),
    type: z.enum(["SMALL", "MEDIUM", "LARGE", "XLARGE"]).optional(),
    layout: z.string().optional(),
    theme: z.string().optional(),
    content: z.string().optional(),
}).strict();
type ScreenUpdate = z.infer<typeof ScreenUpdateSchema>;



class Screen {

    async findAll(projectId: string): Promise<ScreenModel[]> {
        return await prisma.screen.findMany({
            where: {
                projectId,
            },
        });
    }

    async findById(projectId: string, screenId: string): Promise<ScreenModel | null> {
        return await prisma.screen.findFirst({
            where: {
                id: screenId,
                projectId,
            },
        });
    }

    async create(projectId: string, layoutName: defaultScreenType ): Promise<ScreenModel> {
        
        let layout;
        let type;

        switch (layoutName) {
            case "s1":
                layout = s1;
                type = "SMALL";
                break;
            case "m1":
                layout = m1;
                type = "MEDIUM";
                break;
            case "l1":
                layout = l1;
                type = "LARGE";
                break;
            case "l2":
                layout = l2;
                type = "LARGE";
                break;
            case "xl1":
                layout = xl1;
                type = "XLARGE";
                break;
            default:
                throw new Error("Invalid default screen name");
        }

        const theme = {};
        const content = {};

        return await prisma.screen.create({
            data: {
                name: layoutName,
                projectId,
                type: type as ScreenType,
                layout: layout,
                theme,
                content,
            },
        });
    }

    async delete(projectId: string, screenId: string): Promise<ScreenModel> {
        return await prisma.screen.delete({
            where: {
                id: screenId,
                projectId,
            },
        });
    }

    async update(projectId: string, screenId: string, data: ScreenUpdate): Promise<ScreenModel> {
        return await prisma.screen.update({
            where: {
                id: screenId,
                projectId,
            },
            data,
        });
    }
}


const screenModel = new Screen();

export default screenModel;
export type {
    ScreenModel,
    ScreenCreate,
    ScreenUpdate,
};
export {
    ScreenCreateSchema,
    ScreenUpdateSchema
};