import { GoogleGenAI } from "@google/genai";
import { GameState, GameUpdateResponse, Item, EquipmentSlots } from '../types';
import { SYSTEM_INSTRUCTION, RESPONSE_SCHEMA } from '../constants';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function formatEquipment(equipment: EquipmentSlots): string {
    return Object.entries(equipment)
        .map(([slot, item]) => `  - ${slot}: ${item ? item.name : '空'}`)
        .join('\n');
}

function buildPrompt(gameState: GameState, playerAction: string, selectedItem: Item | null) {
    const itemContext = selectedItem ? `\n玩家同時使用了物品：「${selectedItem.name}」。請根據此物品的特性來影響行動的結果。` : '';
    
    const plotTwistInstruction = gameState.turnCount >= 5
        ? `\n\n**系統提示：** 遊戲節奏需要變化。請立即觸發一個重大的「情節轉折」事件。`
        : '';

    const context = `
        這是目前的情況：
        - 故事進展： "${gameState.story}"
        - 玩家生命值： ${gameState.health}/100
        - 玩家幸運值： ${gameState.luck}/100
        - 玩家裝備：
${formatEquipment(gameState.equipment)}
        - 玩家物品欄： [${gameState.inventory.map(item => item.name).join(', ')}]

        玩家的行動是： "${playerAction}"${itemContext}${plotTwistInstruction}

        產生冒險的下一步。
    `;
    return context;
}

export async function getGameUpdate(gameState: GameState, playerAction:string, selectedItem: Item | null): Promise<GameUpdateResponse> {
    const prompt = buildPrompt(gameState, playerAction, selectedItem);
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: "application/json",
            responseSchema: RESPONSE_SCHEMA,
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