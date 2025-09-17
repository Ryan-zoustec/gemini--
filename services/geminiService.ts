import { GoogleGenAI, Type } from "@google/genai";
import { GameState, PlayerClass, Language, GameUpdateResponse, Item, EquipmentSlots } from '../types';

// FIX: Initialize the GoogleGenAI client. Ensure the API_KEY environment variable is set.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const itemProperties = {
    name: { type: Type.STRING, description: "Name of the item." },
    type: { type: Type.STRING, description: "Type of item.", enum: ['equippable', 'consumable', 'quest'] },
    description: { type: Type.STRING, description: "A brief description of the item." },
    slot: { type: Type.STRING, description: "If equippable, the slot it goes into.", enum: ['head', 'body', 'hands', 'feet', 'back', 'waist', 'companion'] },
    quantity: { type: Type.INTEGER, description: "How many of the item. Only for consumable or quest items." },
};

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        story: { type: Type.STRING, description: "The next part of the story. Write in a compelling, descriptive, and dark fantasy style. This is a new paragraph that continues from the previous state." },
        health: { type: Type.INTEGER, description: "The player's new health value (0-100)." },
        inventory: {
            type: Type.ARRAY,
            description: "The player's updated inventory. Include all previous items unless they were used or lost.",
            items: {
                type: Type.OBJECT,
                properties: itemProperties,
                required: ["name", "type", "description"]
            },
        },
        equipment: {
            type: Type.OBJECT,
            description: "The player's equipped items. Return a valid Item object for an equipped slot, and `null` for an empty slot.",
            properties: {
                head: { type: Type.OBJECT, properties: itemProperties, description: "The item in the 'head' slot, or null if empty." },
                body: { type: Type.OBJECT, properties: itemProperties, description: "The item in the 'body' slot, or null if empty." },
                hands: { type: Type.OBJECT, properties: itemProperties, description: "The item in the 'hands' slot, or null if empty." },
                feet: { type: Type.OBJECT, properties: itemProperties, description: "The item in the 'feet' slot, or null if empty." },
                back: { type: Type.OBJECT, properties: itemProperties, description: "The item in the 'back' slot, or null if empty." },
                waist: { type: Type.OBJECT, properties: itemProperties, description: "The item in the 'waist' slot, or null if empty." },
                companion: { type: Type.OBJECT, properties: itemProperties, description: "The companion, or null if empty." },
            }
        },
        luck: { type: Type.INTEGER, description: "The player's new luck value (0-100)." },
        suggested_actions: {
            type: Type.ARRAY,
            description: "Three diverse and interesting suggested actions for the player to take next.",
            items: {
                type: Type.OBJECT,
                properties: {
                    action: { type: Type.STRING, description: "A short, actionable phrase (e.g., 'Inspect the altar')." },
                    hint: { type: Type.STRING, description: "A brief hint about the potential outcome or requirement for this action." },
                },
                required: ["action", "hint"]
            }
        },
        game_over: { type: Type.BOOLEAN, description: "Set to true if the player has died or the story has reached a definitive end." },
        win: { type: Type.BOOLEAN, description: "Set to true if the player has successfully won the game." },
        mood: { type: Type.STRING, description: "The current mood of the story (e.g., 'tense', 'mysterious', 'combat')." },
        action_result: { type: Type.STRING, description: "Result of the player's last action.", enum: ['success', 'failure', 'neutral', 'item_use'] },
        chapter_title: { type: Type.STRING, description: "A cool, thematic title for the current chapter or area." },
    },
    required: ["story", "health", "inventory", "equipment", "luck", "suggested_actions", "game_over", "win", "mood", "action_result", "chapter_title"]
};


const createSystemInstruction = (language: Language): string => `
You are the Game Master for a dark fantasy text-based RPG called "Whispering Crypt".
Your goal is to create an immersive, challenging, and engaging experience by describing the world, its inhabitants, and the consequences of the player's actions.
You must respond *only* with a valid JSON object that adheres to the provided schema.

GAME RULES:
1.  **Story:** Continue the story based on the player's action. Be descriptive and engaging. Maintain a dark, mysterious tone.
2.  **Health:** Adjust the player's health based on their actions. Combat, traps, or certain events can lower health. Resting or using items can restore it. If health reaches 0, set 'game_over' to true.
3.  **Luck:** Luck influences the outcome of actions. A high luck stat might lead to fortunate discoveries or avoiding disasters. A low luck stat might lead to misfortune. Your responses should reflect this.
4.  **Inventory & Equipment:** Update the inventory and equipment based on what the player finds, uses, or loses. Be consistent.
5.  **Suggested Actions:** Provide three *distinct* and *creative* actions the player can take. These should guide the player but also offer real choices. Examples: "Examine the strange runes," "Try to pry open the sarcophagus," "Listen at the heavy oak door."
6.  **Game State:** You must manage the entire game state. When the player wins or loses, set 'win' or 'game_over' accordingly.
7.  **Language:** All player-facing text (story, item descriptions, action hints, titles) MUST be in the specified language: ${language}.
`;

const createGamePrompt = (action: string, gameState: GameState, playerClass: PlayerClass): string => `
Here is the current state of the game. Generate the next state based on the player's action.

PLAYER CLASS:
- Name: ${playerClass.name}
- Description: ${playerClass.description}

CURRENT GAME STATE:
- Previous Story: "${gameState.story.slice(-500)}" (Last 500 chars)
- Health: ${gameState.health}/100
- Luck: ${gameState.luck}/100
- Inventory: ${JSON.stringify(gameState.inventory)}
- Equipment: ${JSON.stringify(gameState.equipment)}
- Turn Count: ${gameState.turnCount}

PLAYER'S ACTION: "${action}"
`;


export const callGeminiApi = async (
    action: string,
    gameState: GameState,
    playerClass: PlayerClass,
    language: Language
): Promise<GameUpdateResponse> => {
    try {
        const response = await ai.models.generateContent({
            // FIX: Use the correct model name as per guidelines
            model: "gemini-2.5-flash",
            contents: createGamePrompt(action, gameState, playerClass),
            config: {
                systemInstruction: createSystemInstruction(language),
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.9,
                topP: 1,
            },
        });
        
        // FIX: Extract text from response correctly
        const jsonText = response.text.trim();
        const parsedResponse = JSON.parse(jsonText);
        
        // Validate and clean up equipment nulls which might be returned as empty objects
        const equipment = parsedResponse.equipment;
        for (const slot in equipment) {
            const item = equipment[slot as keyof EquipmentSlots];
            if (item && Object.keys(item).length === 0) {
                equipment[slot as keyof EquipmentSlots] = null;
            }
        }
        
        return parsedResponse as GameUpdateResponse;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("The AI is contemplating its next move... and failed. Please try again.");
    }
};

export const generateImage = async (prompt: string): Promise<string> => {
     try {
        const response = await ai.models.generateImages({
            // FIX: Use correct image generation model
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
              numberOfImages: 1,
              // FIX: Use a supported output MIME type
              outputMimeType: 'image/jpeg',
              aspectRatio: '16:9',
            },
        });

        // FIX: Extract image data and format as a data URL
        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
        return imageUrl;
    } catch (error) {
        console.error("Error generating image with Gemini:", error);
        throw new Error("Failed to generate illustration.");
    }
};
