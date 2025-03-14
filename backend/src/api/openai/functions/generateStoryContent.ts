import { structuredOuput } from "./structuredOuput";
import { storyContentResponseSchema } from "../schemas/responseSchemas/contentResponse";

// instructions
import storyContent from "../instructions/storyContent.json";

const generateStoryContent = async (prompt: string): Promise<string | undefined> => {
    try {
        if (!prompt) {
            throw new Error("Prompt is required");
        }

        const instructions = storyContent.instructions;

        return await structuredOuput({
            systemPrompt: instructions,
            userPrompt: prompt,
            format: storyContentResponseSchema,
            formatName: "storyContent",
        });
    } catch (error: any) {
        console.log("Error: ", error.message);
    }
}

export { generateStoryContent };