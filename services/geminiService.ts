import { GoogleGenAI } from "@google/genai";
import { GameState, PlayerClass, GameUpdateResponse, Item, Language } from '../types';
import { SYSTEM_INSTRUCTION, RESPONSE_SCHEMAS } from '../constants';

const ai = new GoogleGenAI({apiKey: process.env.API_KEY as string});
const model = 'gemini-2.5-flash';

const getKnightLuckInstruction = (turnCount: number): string => {
    if (turnCount > 1) {
        return `As a Knight, your luck has increased by 1 this turn due to your perseverance. The new luck value MUST be exactly 1 higher than the previous value, unless it's already 100.`;
    }
    return '';
}

const getRogueLuckInstruction = (turnCount: number): string => {
    if (turnCount > 1) {
        return `As a Rogue, your luck has decreased by 1 this turn as your initial good fortune wanes. The new luck value MUST be exactly 1 lower than the previous value, unless it's already 0.`;
    }
    return '';
}

const getTricksterRules = (): string => {
    return `
    - The player is a Trickster, an agent of chaos. This class has VERY SPECIAL rules.
    - Rule 1: Inverse Reality. The Trickster's actions often have inverse, ironic, or unexpected results. If they try to "attack the goblin," the goblin might slip on a banana peel and knock itself out. If they "try to open a door," the door might turn into a giant talking fish. Be creative and unpredictable.
    - Rule 2: Absolute Luck. The Trickster's luck MUST ALWAYS remain at 100. It cannot be decreased for any reason.
    - Rule 3: Fragile Body, Fickle Fate. The Trickster's health MUST ALWAYS remain at 1. They cannot be healed in any way (potions, magic, etc., must fail in a comedic or ironic way). However, if they receive a fatal blow, there is an 80% chance they will survive through a ridiculously improbable event (e.g., a meteor strikes the attacker, the attacker laughs so hard they forget to attack). You must decide if this 80% chance succeeds. If it succeeds, their health remains 1. If it fails, set game_over to true.
    - Rule 4: Useless Companion. The Trickster's companion, the 'Stasis Dragon Colossus', is a magnificent but completely immobile and useless statue. It CANNOT save the player from death and provides no help whatsoever. Incorporate its majestic uselessness into the story.
    `;
}

const buildPrompt = (
    gameState: GameState,
    playerClass: PlayerClass,
    playerAction: string,
    selectedItem: Item | null,
    language: Language
) => {
    let classSpecificInstructions = '';
    if (playerClass.id === 'knight') {
        classSpecificInstructions = getKnightLuckInstruction(gameState.turnCount);
    } else if (playerClass.id === 'rogue') {
        classSpecificInstructions = getRogueLuckInstruction(gameState.turnCount);
    } else if (playerClass.id === 'trickster') {
        classSpecificInstructions = getTricksterRules();
    }
    
    // Three-Act Structure Context
    let narrativeContext = '';
    if (gameState.turnCount <= 10) {
        narrativeContext = `**Narrative Context: Act I (The Beginning)** You are in the early stages of the story. Focus on exploration, atmosphere, and initial challenges.`
    } else if (gameState.turnCount <= 25) {
        narrativeContext = `**Narrative Context: Act II (The Rising Action)** The story is escalating. Introduce more significant threats and deeper mysteries.`
    } else {
        narrativeContext = `**Narrative Context: Act III (The Climax)** The story is building to its conclusion. Guide the player towards the final confrontation or resolution.`
    }


    const prompt = `Continue the game based on the player's action.
    
    ${narrativeContext}
    
    Current Player Class:
    - Class: ${playerClass.name}
    
    Current Game State:
    ${JSON.stringify(gameState, null, 2)}
    
    Player's Action:
    - Action: "${playerAction}"
    - Item Used: ${selectedItem ? `"${selectedItem.name}"` : "None"}
    
    Game Master's Instructions:
    1. Generate the next part of the story based on the player's action and the current narrative act.
    2. Update all fields of the game state (health, inventory, luck, etc.) according to the story's events.
    3. ${classSpecificInstructions}
    4. Ensure the response is a valid JSON object matching the schema.
    `;
    return prompt;
}

const callGeminiAPI = async (prompt: string, language: Language): Promise<GameUpdateResponse> => {
    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: RESPONSE_SCHEMAS[language],
                systemInstruction: SYSTEM_INSTRUCTION(language),
                temperature: 0.75, // Slightly lower for more coherence
                topP: 0.9,
            }
        });
        
        const jsonText = response.text.trim();
        const parsed = JSON.parse(jsonText);

        // Basic validation
        if (!parsed.story || !parsed.suggested_actions) {
            console.error("Invalid response structure from API:", parsed);
            throw new Error("Invalid response structure from API");
        }
        
        // Ensure equipment slots are not undefined
        const validEquipment = parsed.equipment || {};
        const slots = ['head', 'body', 'hands', 'feet', 'back', 'waist', 'companion'];
        slots.forEach(slot => {
            if (validEquipment[slot] === undefined) {
                validEquipment[slot] = null;
            }
        });
        parsed.equipment = validEquipment;
        
        return parsed as GameUpdateResponse;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("The spirits of fate are silent for now. Please try again.");
    }
}

export const startNewGame = async (playerClass: PlayerClass, language: Language): Promise<GameUpdateResponse> => {
    const prompt = `Start a new game for a player with the following class:
    - Class: ${playerClass.name}
    - Description: ${playerClass.description}
    - Starting Health: ${playerClass.initialHealth}
    - Starting Luck: ${playerClass.initialLuck}
    - Starting Equipment: ${JSON.stringify(playerClass.initialEquipment)}
    - Starting Inventory: ${JSON.stringify(playerClass.initialInventory)}
    
    Use this starting prompt to begin the adventure: "${playerClass.startingPrompt}"
    
    Generate the very first game state based on this information. The story should introduce the scene and the immediate choice. Set turnCount to 1.
    `;
    return callGeminiAPI(prompt, language);
};

export const processPlayerAction = async (
    gameState: GameState,
    playerClass: PlayerClass,
    playerAction: string,
    selectedItem: Item | null,
    language: Language
): Promise<GameUpdateResponse> => {
    const prompt = buildPrompt(gameState, playerClass, playerAction, selectedItem, language);
    return callGeminiAPI(prompt, language);
}
