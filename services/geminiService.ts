import { GoogleGenAI, Type } from "@google/genai";
import { GameState, PlayerClass, GameUpdateResponse, Language } from '../types';

// The API key MUST be obtained exclusively from the environment variable `process.env.API_KEY`.
// It is assumed to be pre-configured in the execution environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const itemSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "Name of the item." },
        type: { type: Type.STRING, description: "Type of item: 'equippable', 'consumable', 'non-consumable', or 'summon_companion'." },
        description: { type: Type.STRING, description: "A brief, flavorful description of the item's appearance and purpose. This is mandatory." },
        slot: { type: Type.STRING, description: "If equippable or a companion, the slot it belongs to: 'head', 'body', 'hands', 'feet', 'back', 'waist', 'companion'." },
        quantity: { type: Type.INTEGER, description: "The number of items in the stack. Only for consumables." },
    },
    required: ['name', 'type', 'description']
};

// A schema for an item that can also be null. This is crucial for equipment slots.
// The `nullable: true` property is standard in OpenAPI v3 schemas and is respected by the model.
const nullableItemSchema = {
    ...itemSchema,
    nullable: true,
};

const equipmentSlotsSchema = {
    type: Type.OBJECT,
    properties: {
        head: { ...nullableItemSchema, description: "The item in the head slot, or null if empty." },
        body: { ...nullableItemSchema, description: "The item in the body slot, or null if empty." },
        hands: { ...nullableItemSchema, description: "The item in the hands slot, or null if empty." },
        feet: { ...nullableItemSchema, description: "The item in the feet slot, or null if empty." },
        back: { ...nullableItemSchema, description: "The item in the back slot, or null if empty." },
        waist: { ...nullableItemSchema, description: "The item in the waist slot, or null if empty." },
        companion: { ...nullableItemSchema, description: "The companion, or null if empty." },
    },
    required: ['head', 'body', 'hands', 'feet', 'back', 'waist', 'companion']
};

const suggestedActionSchema = {
    type: Type.OBJECT,
    properties: {
        action: { type: Type.STRING, description: "A short, actionable phrase (e.g., 'Inspect the altar')." },
        hint: { type: Type.STRING, description: "A brief hint about the possible outcome or purpose of the action." }
    },
    required: ['action', 'hint']
};

const gameUpdateResponseSchema = {
    type: Type.OBJECT,
    properties: {
        story: { type: Type.STRING, description: "Narrate the outcome of the action and the current situation in 1-3 paragraphs. Be descriptive and engaging." },
        health: { type: Type.INTEGER, description: "Player's new health points (0-100)." },
        inventory: { type: Type.ARRAY, items: itemSchema, description: "The player's full inventory after the action." },
        equipment: equipmentSlotsSchema,
        luck: { type: Type.INTEGER, description: "Player's new luck points (0-100)." },
        suggested_actions: { type: Type.ARRAY, items: suggestedActionSchema, description: "Three creative and relevant actions the player can take next." },
        game_over: { type: Type.BOOLEAN, description: "Set to true if the player has died." },
        win: { type: Type.BOOLEAN, description: "Set to true if the player has won the game." },
        mood: { type: Type.STRING, description: 'A single word describing the current atmosphere (e.g., tense, mysterious, combat, triumphant).' },
        action_result: { type: Type.STRING, description: "Result of the action for UI feedback: 'success', 'failure', 'neutral', or 'item_use'."},
        chapter_title: { type: Type.STRING, description: 'A short, evocative title for the current chapter or scene.' }
    },
    required: ['story', 'health', 'inventory', 'equipment', 'luck', 'suggested_actions', 'game_over', 'win', 'mood', 'action_result', 'chapter_title']
};

/**
 * Calls the Gemini API to get the next game state.
 */
export const callGeminiApi = async (
    action: string,
    gameState: GameState,
    playerClass: PlayerClass,
    language: Language
): Promise<GameUpdateResponse> => {

    let luckInstruction = `
    9. LUCK MECHANICS: Luck is a critical stat that significantly influences outcomes, turning potential failures into successes and vice-versa. Adhere strictly to these rules when updating the 'luck' value.
       - GENERAL RULE: Successful actions ('action_result' set to 'success') should slightly decrease luck (by 1-5 points). Unsuccessful actions ('action_result' set to 'failure') should slightly increase luck (by 1-5 points). This represents the player tempting or appeasing fate.
       - CLASS-SPECIFIC RULES: These are applied IN ADDITION to the general rule.`;

    switch (playerClass.id) {
        case 'knight':
            luckInstruction += `
         - KNIGHT: Luck is tied to valor.
           - Passively gains luck over turns (approx. +1 every 2-3 turns).
           - Gains significant luck for defeating an enemy (+10).
           - Loses significant luck for being defeated, fleeing, or taking cowardly actions (-10).`;
            break;
        case 'rogue':
            luckInstruction += `
         - ROGUE: Luck is fickle and tied to opportunism.
           - Passively loses luck over turns (approx. -1 every 2-3 turns).
           - Gains significant luck for successfully avoiding combat, disarming traps, or finding hidden treasure (+10).
           - Loses a large amount of luck when taking damage (-15).`;
            break;
        case 'scholar':
            luckInstruction += `
         - SCHOLAR: Luck comes from intellect and discovery.
           - Gains large luck for discovering mechanisms, solving puzzles, or unlocking new areas (+15).
           - Loses luck for defeating an enemy through brute force combat (-5), as it's an unrefined method.`;
            break;
        case 'trickster':
            luckInstruction += `
         - TRICKSTER: Luck is absolute but paradoxical.
           - The 'luck' stat MUST ALWAYS be 100. Do not change it under any circumstances.
           - IMPORTANT: The Trickster's actions and words have a high probability of having the opposite effect of what was intended, often in a comical or absurd way. For example, trying to be intimidating might make a monster laugh and befriend them.
           - Their constant high luck allows them to narrowly escape what would be fatal disasters for others. Turn deadly situations into strange, non-lethal, and often advantageous outcomes.`;
            break;
    }
    
    const systemInstruction = `You are the Dungeon Master for a text-based RPG called "Whispering Crypt". Your role is to create a dark, mysterious, and engaging narrative. The player's class is ${playerClass.name}. The target language for all text in your response is ${language}.
    RULES:
    1.  The story must evolve based on the player's action and the current game state.
    2.  NARRATIVE COHERENCE: For all classes EXCEPT the Trickster, if the player's action is nonsensical, contradicts the established narrative (e.g., claiming to have an item they don't possess), or attempts to fabricate facts out of thin air, the action MUST fail. This failure should result in a negative consequence for the player and a significant penalty to their 'luck' stat (e.g., -10 to -15 points). The Trickster is immune to this; their chaotic actions are governed by their unique luck mechanic.
    3.  Update game state logically. If the player is hurt, decrease health. If they find an item, add it to inventory.
    4.  ITEM TYPES: Items are one of four types: 'equippable' (can be worn), 'consumable' (used up), 'non-consumable' (reusable or quest items), or 'summon_companion' (an item that represents a companion).
    5.  ITEM DESCRIPTIONS: CRITICAL RULE: Every single item, whether in inventory or equipped, MUST have a non-empty, flavorful 'description' string. Do not ever omit it.
    6.  EQUIPMENT SLOTS: For any equipment slot that is empty, its value in the JSON MUST be null. For example: "head": null. This is mandatory.
    7.  Provide exactly three diverse and creative suggested actions.
    8.  You MUST respond with a valid JSON object that conforms to the provided schema. Do not include any text, markdown, or code block formatting outside of the JSON object itself.
    ${luckInstruction}`;

    const model = 'gemini-2.5-flash';

    const fullPrompt = `
    CURRENT GAME STATE:
    ${JSON.stringify(gameState, null, 2)}

    PLAYER ACTION: "${action}"

    Generate the next game state based on this action.
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: fullPrompt,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: gameUpdateResponseSchema,
                temperature: 0.7,
                topP: 0.95,
            }
        });

        const jsonText = response.text.trim();
        const data = JSON.parse(jsonText);
        return data as GameUpdateResponse;
    } catch (error) {
        console.error("Gemini API call failed:", error);
        throw new Error("Failed to get a response from the AI. The crypt's whispers are silent for now.");
    }
};

/**
 * Generates an illustration for the current scene using the Gemini Image API.
 */
export const generateImage = async (prompt: string): Promise<string> => {
    try {
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
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            throw new Error("No image was generated by the API.");
        }
    } catch (error) {
        console.error("Gemini image generation failed:", error);
        throw new Error("The ethereal mists refuse to form an image.");
    }
};