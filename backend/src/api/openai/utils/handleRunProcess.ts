import OpenAI from "openai";
import dotenv from "dotenv";

import { generateLayout } from "../functions/generateLayout";
import { generateTheme } from "../functions/generateTheme";
import { generateStoryContent } from "../functions/generateStoryContent";

interface ToolCall {
    id: string;
    function: {
        name: string;
        arguments: any;
    };
}

interface ToolOutput {
    tool_call_id: string;
    output: string;
}

// utils
// import { handleToolCalls } from "./handleToolCalls";

// OpenAI resources
import { Message, MessagesPage, Run } from "openai/resources/beta/threads";

dotenv.config();

const API_KEY = process.env.OPENAI_API_KEY;

if (!API_KEY) {
    throw new Error("API key is not provided.");
}

const openai = new OpenAI({
    apiKey: API_KEY,
});


// THIS IS A HELPER FUNCTION THAT CHECKS THE STATUS OF A RUN
// AND HANDLES THE RUN ACCORDINGLY

// Currently handled statuses:
// - completed: The run has completed successfully.
// - requires_action: The run requires an action to be taken.


// Docs: https://platform.openai.com/docs/assistants/tools/function-calling?context=without-streaming#step-3-initiate-a-run

interface ToolCall {
    id: string;
    function: {
        name: string;
        arguments: any;
    };
}

interface ToolOutput {
    tool_call_id: string;
    output: string;
}

interface FunctionOutput {
    tool_call_id: string;
    type: string;
    success: boolean;
    content: string | null;
}

// functionOutputs to send back to project router
let functionOutputs: FunctionOutput[] = [];

const handleRequiresAction = async (run: Run, threadId: string): Promise<any> => {

    console.log("Run requires actions")

    // Check if there are tools that require outputs    
    if (run.required_action?.submit_tool_outputs?.tool_calls) {

        console.log("Collecting tool calls");

        let toolCalls: ToolCall[] = [];

        // Collect tool call information from OpenAI Assistant that require outputs
        for (let tool of run.required_action.submit_tool_outputs.tool_calls) {
            toolCalls.push({
                id: tool.id,
                function: {
                    name: tool.function.name,
                    arguments: tool.function.arguments,
                }
            });
        }

        console.log("Generating tool outputs for:");
        for (let toolCall of toolCalls) {
            console.log("- " + toolCall.function.name);
        }

        // Generate function outputs for each tool call and 
        // resolve promises to array and prepare to submit for database
        functionOutputs = await Promise.all(toolCalls.map(async (toolCall) => {
            switch (toolCall.function.name) {
                case "update_layout":
                    const layoutArgs = JSON.parse(toolCall.function.arguments);
                    const layout = await generateLayout(layoutArgs.prompt);
                    console.log("Layout generated");
                    return {
                        type: "layout",
                        tool_call_id: toolCall.id,
                        success: layout ? true : false,
                        content: layout || null,
                    }

                case "update_theme":
                    const themeArgs = JSON.parse(toolCall.function.arguments);
                    const theme = await generateTheme(themeArgs.prompt);
                    console.log("Theme generated");
                    return {
                        type: "theme",
                        tool_call_id: toolCall.id,
                        success: theme ? true : false,
                        content: theme || null,
                    }

                case "update_story_content":
                    const storyArgs = JSON.parse(toolCall.function.arguments);
                    const storyContent = await generateStoryContent(storyArgs.prompt);
                    console.log("Story content generated");
                    return {
                        type: "story_content",
                        tool_call_id: toolCall.id,
                        success: storyContent ? true : false,
                        content: storyContent || null,
                    }
                default:
                    console.log("Unhandled function name.");
                    return {
                        type: "error",
                        tool_call_id: toolCall.id,
                        success: false,
                        content: "Unhandled function name.",
                    }
            }
        }));

        // Collect tool outputs to submit to OpenAI Assistant
        let toolOutputs: ToolOutput[] = [];
        if (functionOutputs && functionOutputs.length > 0) {
            functionOutputs.forEach((functionOutput) => {
                toolOutputs.push({
                    tool_call_id: functionOutput.tool_call_id,
                    output: JSON.stringify({ success: functionOutput.success }),
                });
            });
        }


        // Submit all tool function outputs to OpenAI Assistant
        if (toolOutputs && toolOutputs.length > 0) {
            run = await openai.beta.threads.runs.submitToolOutputsAndPoll(
                threadId,
                run.id,
                { tool_outputs: toolOutputs },
            );
            console.log("Tool outputs submitted successfully.");
        } else {
            console.log("No tool outputs to submit.");
        }

        // Check status after submitting tool outputs
        return handleRunProcess(run, threadId);
    }
};

export interface RunProcessResponse {
    assistantResponse: Message;
    project: {
        layout: string | null;
        theme: string | null;
        storyContent: string | null;
    }
}

export const handleRunProcess = async (run: Run, threadId: string): Promise<RunProcessResponse | undefined> => {
    switch (run.status) {
        case "completed":

            console.log("Run completed");

            const messages: MessagesPage = await openai.beta.threads.messages.list(threadId, { order: "desc", limit: 1 });
            const lastMessage: Message = messages.data[0];

            console.log("Sending results");

            return {
                assistantResponse: lastMessage,
                project: {
                    layout: functionOutputs.find((output) => output.type === "layout")?.content || null,
                    theme: functionOutputs.find((output) => output.type === "theme")?.content || null,
                    storyContent: functionOutputs.find((output) => output.type === "story_content")?.content || null,
                }
            };

        case "requires_action":
            return await handleRequiresAction(run, threadId);
    }
};

