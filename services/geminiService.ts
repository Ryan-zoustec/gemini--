// FIX: Use GoogleGenAI instead of the deprecated GoogleGenerativeAI.
import { GoogleGenAI } from "@google/genai";
import { GameState, GameUpdateResponse, Item, EquipmentSlots, Language } from '../types';
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

function buildPrompt(gameState: GameState, playerAction: string, selectedItem: Item | null) {
    const itemContext = selectedItem ? `\nThe player also used the item: "${selectedItem.name}". Please factor in the properties of this item on the action's outcome.` : '';
    
    const plotTwistInstruction = gameState.turnCount >= 5
        ? `\n\n**SYSTEM PROMPT:** The game's pacing needs a shift. Trigger a major "plot twist" event now.`
        : '';

    const context = `
        This is the current situation:
        - Story Progress: "${gameState.story}"
        - Player Health: ${gameState.health}/100
        - Player Luck: ${gameState.luck}/100
        - Player Equipment:
${formatEquipment(gameState.equipment)}
        - Player Inventory: [${gameState.inventory.map(item => item.name).join(', ')}]

        The player's action is: "${playerAction}"${itemContext}${plotTwistInstruction}

        Generate the next step of the adventure.
    `;
    return context;
}

export async function getGameUpdate(gameState: GameState, playerAction:string, selectedItem: Item | null, language: Language): Promise<GameUpdateResponse> {
    const prompt = buildPrompt(gameState, playerAction, selectedItem);
    
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