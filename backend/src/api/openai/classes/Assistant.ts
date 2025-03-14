import OpenAI from "openai";
import dotenv from "dotenv";

// types
import type { Assistant, AssistantsPage, AssistantDeleted } from "openai/resources/beta/assistants";

dotenv.config();

const API_KEY = process.env.OPENAI_API_KEY;
const FUI_ASSISTANT_ID = process.env.OPENAI_FUI_ASSISTANT_ID;

if (!API_KEY) {
    throw new Error("API key is not provided.");
}

if (!FUI_ASSISTANT_ID) {
    throw new Error("Assistant ID is not provided.");
}

const openai = new OpenAI({
    apiKey: API_KEY,
});

// IMPORTANT:
/*
THE ASSISTANT DOES NOT NEED TO BE CREATED EVERY TIME A NEW THREAD IS CREATED.

USE THE SAME ASSISTANT VIA FUI_ASSISTANT_ID IN THE ENV FILE.

IF THE ASSISTANT FOR THE SPECIFIC PURPOSE DOES NOT EXIST, THEN CREATE A NEW ASSISTANT.

EITHER USING THESE FUNCTIONS OR THE OPENAI DASHBOARD. EVERYTHING CAN BE DONE VIA THE DASHBOARD THOUGH.
*/

export default class OpenAIAssistant {
    id: string;

    constructor() {
        this.id = FUI_ASSISTANT_ID!;
    }

    // https://platform.openai.com/docs/api-reference/assistants/createAssistant
    static async create(name: string, instructions: string): Promise<Assistant | undefined> {
        try {
            return await openai.beta.assistants.create({ name, instructions, model: "gpt-4o"});
        } catch (error) {
            console.error("Error creating assistant", error);
        }
    }

    // https://platform.openai.com/docs/api-reference/assistants/listAssistants
    static async list(): Promise<AssistantsPage | undefined> {
        try {
            return await openai.beta.assistants.list();
        } catch (error) {
            console.error("Error listing assistants", error);
        }
    }

    // https://platform.openai.com/docs/api-reference/assistants/getAssistant
    static async retrieve(assistantId: string): Promise<Assistant | undefined> {
        try {
            return await openai.beta.assistants.retrieve(assistantId);
        } catch (error) {
            console.error("Error retrieving assistant", error);
        }
    }

    // https://platform.openai.com/docs/api-reference/assistants/deleteAssistant
    static async delete(assistantId: string): Promise<AssistantDeleted | undefined> {
        try {
            return await openai.beta.assistants.del(assistantId);
        } catch (error) {
            console.error("Error deleting assistant", error);
        }
    }
}