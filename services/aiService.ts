

import { GameState, PlayerClass, GameUpdateResponse, Language, Item, AIModel } from '../types';
import { callGeminiApi, generateImage as generateGeminiImage } from './geminiService';

// This service acts as a facade. For this project, all AI models will be powered by the Gemini API.
// This allows for future extension, e.g., adding a real ChatGPT service.

/**
 * Starts a new game by calling the AI with the character's starting prompt.
 */
export const startNewGame = async (
    playerClass: PlayerClass,
    language: Language,
    aiModel: AIModel
): Promise<GameUpdateResponse> => {
    // For the very first turn, we create a pseudo-game state to provide context to the AI.
    const initialGameState: GameState = {
        story: '',
        health: playerClass.initialHealth,
        luck: playerClass.initialLuck,
        inventory: playerClass.initialInventory,
        equipment: playerClass.initialEquipment,
        suggestedActions: [],
        gameOver: false,
        win: false,
        mood: 'mysterious',
        actionResult: 'neutral',
        turnCount: 0, // Turn count will become 1 after this initial generation.
        chapterTitle: '',
        // FIX: Add missing 'illustrations' property to satisfy the GameState type.
        illustrations: {}
    };

    // The starting prompt is defined in the player class constants.
    const prompt = playerClass.startingPrompt;

    // Delegate the API call to the Gemini service.
    return await callGeminiApi(prompt, initialGameState, playerClass, language);
};

/**
 * Processes a player's action by sending the current game state and the action to the AI.
 */
export const processPlayerAction = async (
    gameState: GameState,
    playerClass: PlayerClass,
    action: string,
    selectedItem: Item | null,
    language: Language,
    aiModel: AIModel
): Promise<GameUpdateResponse> => {
    
    // Combine the action with the item context if an item was selected.
    let fullAction = action;
    if (selectedItem) {
        fullAction = `Use ${selectedItem.name}: ${action}`;
    }

    // Delegate the API call to the Gemini service.
    return await callGeminiApi(fullAction, gameState, playerClass, language);
};

/**
 * Generates an illustration for the current scene.
 */
export const generateIllustration = async (prompt: string, language: Language, aiModel: AIModel): Promise<string> => {
    // Delegate the image generation call to the Gemini service.
    return await generateGeminiImage(prompt);
};
