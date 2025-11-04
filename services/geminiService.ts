import { GoogleGenAI, Type } from "@google/genai";
import { type GeminiResponse } from '../types';
import { dailyItems, DEFAULT_ITEM, itemDetails } from '../items';

function getApiKey(): string {
    const userKey = localStorage.getItem('gemini_api_key');
    if (userKey) {
        return userKey;
    }
    
    return process.env.API_KEY as string || '';
}

function getAI(): GoogleGenAI {
    const apiKey = getApiKey();
    if (!apiKey) {
        throw new Error('API key not configured. Please add your Gemini API key in Settings.');
    }
    return new GoogleGenAI({ apiKey });
}

export function startNewGame(): Promise<string> {
    const today = new Date().toISOString().split('T')[0];

    const secretItem = dailyItems[today] || DEFAULT_ITEM;

    return Promise.resolve(secretItem);
}

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        type: {
            type: Type.STRING,
            enum: ['guess_correct', 'guess_incorrect', 'question_answer'],
        },
        response: {
            type: Type.STRING,
        },
    },
    required: ['type', 'response'],
};

export async function processPlayerInput(secretItem: string, playerInput: string): Promise<GeminiResponse> {
    const ai = getAI();
    
    const prompt = `You are the AI for a 20 Questions game.
The secret word you are thinking of is: "${secretItem}".
The player's input is: "${playerInput}".

Analyze the player's input.
1. Determine if it is a direct guess of the secret word or if it is a question about the secret word's properties.
2. If it is a guess:
    - If the guess is correct, respond with type "guess_correct" and a celebratory message like "Yes! You got it!". The response should NOT include the secret word itself.
    - If the guess is incorrect, respond with type "guess_incorrect" and a "No, that's not it" type of message.
3. If it is a question:
    - Answer the question about "${secretItem}" with only "Yes", "No", or "Maybe".
    - Respond with type "question_answer" and your "Yes/No/Maybe" answer.

Provide your response as a single, valid JSON object matching the required schema and nothing else.
`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        },
    });

    try {
        const jsonResponse = JSON.parse(response.text);
        return jsonResponse as GeminiResponse;
    } catch (e) {
        console.error("Failed to parse Gemini response:", response.text);
        // Fallback in case of parsing error
        return {
            type: 'question_answer',
            response: "I'm sorry, I'm having a little trouble thinking. Could you ask that differently?"
        };
    }
}

export function getHint(secretItem: string): Promise<string> {
    const details = itemDetails[secretItem];

    if (details && details.hints.length > 0) {
        const randomIndex = Math.floor(Math.random() * details.hints.length);
        const hint = details.hints[randomIndex];
        return Promise.resolve(hint);
    }

    return Promise.resolve("Sorry, I can't think of a hint for this one.");
}
