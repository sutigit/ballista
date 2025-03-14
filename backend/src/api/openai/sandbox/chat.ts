import OpenAIAssistant from "../classes/Assistant";
import OpenAIThread from "../classes/Thread";

import readline from 'readline';

// utils
import { handleRunProcess, type RunProcessResponse } from "../utils/handleRunProcess";
import { Message, Run } from "openai/resources/beta/threads";

// defaults
import defaultLayout from "../defaults/defaultLayout.json";
import defaultTheme from "../defaults/defaultTheme.json";
import defaultStoryContent from "../defaults/defaultStoryContent.json";

const assistantApi = new OpenAIAssistant();
const threadApi = new OpenAIThread();



const main = () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    let threadId = '';

    console.log("Do you want to start a new conversation?");

    rl.question('y/n: ', async (input) => {
        const userInput = input.trim().toLowerCase();

        if (userInput === 'y') {
            console.log("Starting a new conversation...");
            await newConversation();

        } else if (userInput === 'n') {
            await lastConversation();
        } else {
            console.log("Invalid input. Please try again.");
            main();
        }
    });

    const newConversation = async () => {

        // Create a new thread
        const newThread = await threadApi.create();
        if (!newThread) {
            console.log("Error creating thread.");
            return;
        }

        threadId = newThread.id;
        console.log("Thread created.", threadId);

        // Continue to chat
        chat();
    }

    const lastConversation = async () => {
        rl.question('Thread ID: ', async (input) => {

            // Retrieve the thread
            const retrievedThread = await threadApi.retrieve(input);
            if (!retrievedThread) {
                console.log("Thread not found.");
                return;
            }

            threadId = retrievedThread.id;
            console.log("Thread retrieved.", threadId);

            // showing the last conversation and continuing to chat
            const messages: Message[] | undefined = await threadApi.listMessages(threadId, 'asc');
            if (!messages) {
                console.log("No previous messages.");

                // Continue to chat
                chat();
            } else {

                for (const message of messages) {
                    const contentBlock = message.content[0];
                    const role = message.role === 'user' ? 'You' : 'Assistant';

                    if ('text' in contentBlock) {
                        console.log(role + ":", contentBlock.text.value);
                    } else {
                        console.log("System:", "Content block does not contain text.");
                    }
                }

                // Continue to chat
                chat();
            }
        });
    }

    interface Project {
        layout: string | null;
        theme: string | null;
        storyContent: string | null;
    }

    let project: Project = {
        layout: JSON.stringify(defaultLayout),
        theme: JSON.stringify(defaultTheme),
        storyContent: JSON.stringify(defaultStoryContent)
    };

    // THE CHAT SIMULATES THE FRONTEND SENDING POMPTS TO THE BACKEND
    const chat = () => {
        rl.question('You: ', async (input) => {
            const userInput = input.trim();

            if (userInput === 'exit') {

                console.log('Exiting thread:', threadId);
                rl.close();

            } else {

                try {

                    // FROM THIS PART ON, A PROMPT HAS BEEN RECEIVED
                    // Below are the steps to process the incoming prompt as in the architecture diagram

                    // 1. Fetch current project object
                    const currentLayout = "This is the current layout of the fictional user interface: " + project.layout;
                    const currentTheme = "This is the current theme of the fictional user interface: " + project.theme;
                    const currentStoryContent = "This is the current story content of the ficitonal user interface: " + project.storyContent;
                    const assistantInput = currentLayout + currentTheme + currentStoryContent;

                    // 2. Add current layout, theme and storyContent to the Thread as system message
                    await threadApi.addMessage("system", assistantInput, threadId);

                    // 3. Add the prompt to the thread as user message
                    await threadApi.addMessage("user", userInput, threadId);

                    // 4. Create a Run and run the Thread with assistant and poll for status
                    const run: Run | undefined = await threadApi.run(threadId, assistantApi.id);
                    if (!run) throw new Error("Error in running the thread.");

                    // 5. Handle different Run statuses and return the response
                    const response: RunProcessResponse | undefined = await handleRunProcess(run, threadId);
                    if (!response) throw new Error("Error in handling run status.");

                    // 6. Update the project object with the latest changes to database
                    // Mock adding updated project in database
                    project = response.project;

                    // 7. Communicate back to frontend
                    // Mock sending back the latest message to the frontend
                    const message: Message = response.assistantResponse;
                    const contentBlock = message.content[0];
                    if ('text' in contentBlock) {
                        console.log("Assistant:", contentBlock.text.value);
                    } else {
                        console.log("Assistant:", "Content block does not contain text.");
                    }

                    // log response results for debugging
                    console.log("Project layout:", project.layout);
                    console.log("Project theme:", project.theme);
                    console.log("Project story content:", project.storyContent);

                } catch (error) {
                    console.log("Error in chat.", error);
                }

                chat(); // Continue the conversation
            }
        });
    }

    chat(); // Start the conversation
}

main();

