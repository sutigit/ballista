import { structuredOuput } from "./structuredOuput";
import { layoutResponseSchema } from "../schemas/responseSchemas/layoutResponse";

// Instructions
import layout from "../instructions/layout.json";

const generateLayout = async (prompt: string): Promise<string | undefined> => {
    try {
        if (!prompt) {
            throw new Error("Prompt is required");
        }

        const instructions = layout.instructions;

        return await structuredOuput({
            systemPrompt: instructions,
            userPrompt: prompt,
            format: layoutResponseSchema,
            formatName: "layout",
        });

    } catch (error: any) {
        console.log("Error: ", error.message);
    }
}

export { generateLayout };