import { structuredOuput } from "./structuredOuput";
import { themeResponseSchema } from "../schemas/responseSchemas/themeResponse";

// instructions
import theme from "../instructions/theme.json";

const generateTheme = async (prompt: string): Promise<string | undefined> => {
    try {
        if (!prompt) {
            throw new Error("Prompt is required");
        }

        const instructions = theme.instructions;

        return await structuredOuput({
            systemPrompt: instructions,
            userPrompt: prompt,
            format: themeResponseSchema,
            formatName: "theme",
        });
    } catch (error: any) {
        console.log("Error: ", error.message);
    }
}

export { generateTheme };