

import { GoogleGenAI } from "@google/genai";
import { GameState, PlayerClass, GameUpdateResponse, Language, Item, EquipmentSlots } from '../types';
import { RESPONSE_SCHEMAS, SYSTEM_INSTRUCTION } from '../constants';

// Per guidelines, initialize with apiKey from process.env
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const formatInventory = (items: Item[]): string => {
    if (items.length === 0) return "empty";
    return items.map(i => `${i.name}${i.quantity && i.quantity > 1 ? ` (x${i.quantity})` : ''}`).join(', ');
};

const formatEquipment = (equipment: EquipmentSlots): string => {
    const equipped = Object.entries(equipment)
        .filter(([, item]) => item)
        .map(([slot, item]) => `${slot}: ${item!.name}`);
    if (equipped.length === 0) return "nothing equipped";
    return equipped.join(', ');
};

export const callGeminiApi = async (
    prompt: string,
    gameState: GameState,
    playerClass: PlayerClass,
    language: Language
): Promise<GameUpdateResponse> => {
    
    // Per guidelines, use 'gemini-2.5-flash' for general text tasks.
    const model = 'gemini-2.5-flash';

    const systemInstruction = SYSTEM_INSTRUCTION(language, playerClass);
    const schema = RESPONSE_SCHEMAS[language];

    // Build a detailed context string for the model
    const context = `
        ---
        Current Game State:
        - Player Class: ${playerClass.name}
        - Health: ${gameState.health}/100
        - Luck: ${gameState.luck}/100
        - Turn Count: ${gameState.turnCount}
        - Inventory: ${formatInventory(gameState.inventory)}
        - Equipment: ${formatEquipment(gameState.equipment)}
        - Previous Story: ${gameState.story.slice(-500)}
        ---
        Player Action: "${prompt}"
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: context,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: schema,
                temperature: 0.9,
            }
        });
        
        // Per guidelines, use `response.text` to get the output.
        const responseText = response.text;
        if (!responseText) {
            throw new Error('API returned an empty response.');
        }
        
        // The response text is a JSON string, it needs to be parsed.
        let parsedResponse: GameUpdateResponse;
        try {
            // Trim to handle potential leading/trailing whitespace
            parsedResponse = JSON.parse(responseText.trim());
        } catch (e) {
            console.error("Failed to parse JSON response:", responseText);
            throw new Error("The AI returned a response in an invalid format. Please try again.");
        }

        return parsedResponse;

    } catch (error: any) {
        console.error("Error calling Gemini API:", error);
        // Provide a more user-friendly error message.
        if (error.message.includes('API key')) {
             throw new Error("Invalid API Key. Please check your configuration.");
        }
        throw new Error("The AI is currently unable to process your request. Please try again later.");
    }
};

export const generateImage = async (prompt: string): Promise<string> => {
    try {
        // Per guidelines, use 'imagen-4.0-generate-001' for image generation.
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '4:3',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            throw new Error("No image was generated.");
        }
    } catch (error) {
        console.error("Error generating image with Gemini:", error);
        throw new Error("Failed to generate illustration.");
    }
};