
// FIX: Use GoogleGenAI instead of the deprecated GoogleGenerativeAI.
import { GoogleGenAI } from "@google/genai";
import { GameState, GameUpdateResponse, Item, EquipmentSlots, Language, PlayerClass } from '../types';
import { SYSTEM_INSTRUCTIONS, RESPONSE_SCHEMAS } from '../constants';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function formatEquipment(equipment: EquipmentSlots): string {
    return Object.entries(equipment)
        .map(([slot, item]) => `  - ${slot}: ${item ? item.name : 'Empty'}`)
        .join('\n');
}

function buildPrompt(gameState: GameState, playerAction: string, selectedItem: Item | null, playerClassId: string | undefined) {
    const itemContext = selectedItem ? `\nThe player also used the item: "${selectedItem.name}". Please factor in the properties of this item on the action's outcome.` : '';
    
    const plotTwistInstruction = gameState.turnCount >= 5
        ? `\n\n**SYSTEM PROMPT:** The game's pacing needs a shift. Trigger a major "plot twist" event now.`
        : '';

    let specialRules = '';
    if (playerClassId === 'trickster') {
        specialRules = `\n\n**SYSTEM PROMPT: SPECIAL RULES FOR TRICKSTER CLASS**
        - The Trickster's luck is fixed at 100. You MUST NOT decrease it for any reason. The 'luck' value in your JSON response must always be 100.
        - The Trickster has a unique ability: their spoken intentions often manifest in an ironic or opposite manner. When the player states an action, you have a high probability of twisting the outcome into its literal, unforeseen, or opposite consequence. For example, if the player says "I want to light up the room", the room might fill with blinding, useless light, or a creature made of light might appear. Be creative and unpredictable with this curse/blessing.
        - The Trickster's 'Stasis Dragon Colossus' companion is an immobile ancient machine and completely useless. It provides NO mechanical benefits, cannot attack, and **CANNOT** save the player from death. You must describe its majestic but inert nature, perhaps how it gets in the way or is mistaken for a real threat before its uselessness is revealed. Do not trigger the standard companion sacrifice mechanic for this specific companion.`;
    }

    const context = `
        This is the current situation:
        - Story Progress: "${gameState.story}"
        - Player Health: ${gameState.health}/100
        - Player Luck: ${gameState.luck}/100
        - Player Equipment:
${formatEquipment(gameState.equipment)}
        - Player Inventory: [${gameState.inventory.map(item => item.name).join(', ')}]

        The player's action is: "${playerAction}"${itemContext}${plotTwistInstruction}${specialRules}

        Generate the next step of the adventure.
    `;
    return context;
}

export async function getGameUpdate(gameState: GameState, playerAction:string, selectedItem: Item | null, language: Language, playerClassId: string | undefined): Promise<GameUpdateResponse> {
    const prompt = buildPrompt(gameState, playerAction, selectedItem, playerClassId);
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            systemInstruction: SYSTEM_INSTRUCTIONS[language],
            responseMimeType: "application/json",
            responseSchema: RESPONSE_SCHEMAS[language],
        },
    });

    const jsonString = response.text.trim();
    // A quick fix to handle cases where the model might return a non-JSON string
    // in case of an error or unexpected output format.
    if (!jsonString.startsWith('{') && !jsonString.startsWith('[')) {
        console.error("Received non-JSON response:", jsonString);
        throw new Error("The model returned an invalid response format.");
    }
    return JSON.parse(jsonString) as GameUpdateResponse;
}