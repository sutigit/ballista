import OpenAI from "openai";
import dotenv from "dotenv";

// types
import type { Thread, ThreadDeleted } from "openai/resources/beta/threads";
import { type Message, type MessageDeleted, type MessagesPage } from "openai/resources/beta/threads/messages";
import type { Run } from "openai/resources/beta/threads/runs";

dotenv.config();

const API_KEY = process.env.OPENAI_API_KEY;

if (!API_KEY) {
    throw new Error("API key is not provided.");
}

const openai = new OpenAI({
    apiKey: API_KEY,
});


export default class OpenAIThread {

    // https://platform.openai.com/docs/api-reference/threads/createThread
    async create(): Promise<Thread | undefined> {
        try {
            return await openai.beta.threads.create();
        } catch (error) {
            console.error("Error creating thread", error);
        }
    }

    // https://platform.openai.com/docs/api-reference/threads/getThread
    async retrieve(threadId: string): Promise<Thread | undefined> {
        try {
            return await openai.beta.threads.retrieve(threadId);
        } catch (error) {
            console.error("Error retrieving thread", error);
        }
    }

    // https://platform.openai.com/docs/api-reference/threads/deleteThread
    async delete(threadId: string): Promise<ThreadDeleted | undefined> {
        try {
            return await openai.beta.threads.del(threadId);
        } catch (error) {
            console.error("Error deleting thread", error);
        }
    }

    // https://platform.openai.com/docs/api-reference/messages/createMessage
    async addMessage(role: "user" | "assistant" | "system", content: string, threadId: string): Promise<Message | undefined> {
        try {
            return await openai.beta.threads.messages.create(threadId, { 
                role: role === "system" ? "assistant" : role,
                content,
                metadata: {
                    type: role
                } 
            });
        } catch (error) {
            console.error("Error adding message to thread", error);
        }
    }

    // https://platform.openai.com/docs/api-reference/messages/listMessages
    async listMessages(threadId: string, order: "desc" | "asc", limit?: number): Promise<Message[] | undefined> {
        try {
            const messages: MessagesPage = await openai.beta.threads.messages.list(threadId, { order, limit });
            const filteredMessages: Message[] = messages.data.filter((message: Message) => {
                return (message.metadata as { type: string }).type !== "system";
            });
            return filteredMessages;
        } catch (error) {
            console.error("Error listing messages in thread", error);
        }
    }

    // https://platform.openai.com/docs/api-reference/messages/getMessage
    async retrieveMessage(threadId: string, messageId: string): Promise<Message | undefined> {
        try {
            return await openai.beta.threads.messages.retrieve(threadId, messageId);
        } catch (error) {
            console.error("Error retrieving message", error);
        }
    }

    // https://platform.openai.com/docs/api-reference/messages/deleteMessage
    async deleteMessage(threadId: string, messageId: string): Promise<MessageDeleted | undefined> {
        try {
            return await openai.beta.threads.messages.del(threadId, messageId);
        } catch (error) {
            console.error("Error deleting message", error);
        }
    }

    // https://platform.openai.com/docs/api-reference/runs/createRun
    // https://platform.openai.com/docs/api-reference/runs/getRun
    // https://github.com/openai/openai-node?tab=readme-ov-file#polling-helpers
    async run(threadId: string, assistantId: string): Promise<Run | undefined> {
        try {
            return await openai.beta.threads.runs.createAndPoll(
                threadId,
                { assistant_id: assistantId }
            );
        } catch (error) {
            console.error("Error creating run", error);
        }
    }
}