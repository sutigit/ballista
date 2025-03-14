import OpenAI from "openai";
import dotenv from "dotenv";
import { zodResponseFormat } from 'openai/helpers/zod';

dotenv.config();

const API_KEY = process.env.OPENAI_API_KEY;

if (!API_KEY) {
    throw new Error("API key is not provided.");
}

const openai = new OpenAI({
    apiKey: API_KEY,
});

export const structuredOuput = async ({
    systemPrompt,
    userPrompt,
    format,
    formatName, 
}: {
    systemPrompt: string;
    userPrompt: string;
    format: any;
    formatName: string;
}): Promise<string> => {
    const completion = await openai.beta.chat.completions.parse({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
        ],
        response_format: zodResponseFormat(format, formatName),
    });

    return completion.choices[0].message.parsed;
};