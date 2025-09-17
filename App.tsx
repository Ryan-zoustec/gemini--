
import React, { useState, useEffect, useCallback } from 'react';
import StartScreen from './components/StartScreen';
import CharacterCreationScreen from './components/CharacterCreationScreen';
import GameScreen from './components/GameScreen';
import GameOverScreen from './components/GameOverScreen';
import { GameState, PlayerClass, SaveData, Language, Item, AIModel } from './types';
import { startNewGame, processPlayerAction, generateIllustration as generateIllustrationApi } from './services/aiService';
import { ALL_PLAYER_CLASSES, TRICKSTER_CLASS, INITIAL_GAME_STATE, t } from './constants';

type Screen = 'start' | 'character' | 'game' | 'gameover';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('start');
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [playerClass, setPlayerClass] = useState<PlayerClass | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('zh-TW');
  const [isVoiceoverEnabled, setIsVoiceoverEnabled] = useState(false);
  const [speechRate, setSpeechRate] = useState(1);
  const [aiModel, setAiModel] = useState<AIModel>('gemini');
  
  // Use localStorage to track wins for unlocking Trickster
  const hasWonGame = () => localStorage.getItem('hasWonGame') === 'true';
  const setHasWonGame = () => localStorage.setItem('hasWonGame', 'true');

  const getInitialClasses = (lang: Language): PlayerClass[] => {
      const baseClasses = ALL_PLAYER_CLASSES[lang];
      if (hasWonGame()) {
          return [...baseClasses, TRICKSTER_CLASS[lang]];
      }
      return baseClasses;
  }
  
  const [classes, setClasses] = useState<PlayerClass[]>(() => getInitialClasses(language));
  
  useEffect(() => {
    setClasses(getInitialClasses(language));
  }, [language]);

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window && isVoiceoverEnabled) {
      // Wait for voices to be loaded
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) {
          window.speechSynthesis.onvoiceschanged = () => speak(text);
          return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voice = voices.find(v => v.lang.startsWith(language)) || voices.find(v => v.lang.startsWith(language.split('-')[0])) || null;
      if (voice) {
        utterance.voice = voice;
      }
      utterance.rate = speechRate;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  }, [isVoiceoverEnabled, language, speechRate]);

  useEffect(() => {
    if (gameState.story) {
      const storyTurns = gameState.story.split('\n\n>');
      const latestTurnContent = storyTurns[storyTurns.length - 1];

      if (storyTurns.length === 1) {
        // This is the initial story load, which has no player action prefix. Read the whole thing.
        speak(latestTurnContent);
      } else {
        // This is a subsequent turn. The content will be "Player Action\n\nStory from AI...".
        // We want to read everything after the first paragraph (the action).
        const contentParts = latestTurnContent.split('\n\n');
        const storyToRead = contentParts.slice(1).join('\n\n');
        if (storyToRead) {
          speak(storyToRead);
        }
      }
    }
  }, [gameState.story, speak]);

  /**
   * Primes the speech synthesis engine on iOS by speaking a silent utterance.
   * This must be called from within a user-initiated event handler (e.g., a click).
   */
  const primeSpeechSynthesis = (voiceEnabled: boolean) => {
    if ('speechSynthesis' in window && voiceEnabled) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(' '); // A space is more reliable than an empty string
      utterance.volume = 0; // Make it silent
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStart = (voiceEnabled: boolean, lang: Language, rate: number, model: AIModel) => {
    setLanguage(lang);
    setIsVoiceoverEnabled(voiceEnabled);
    setSpeechRate(rate);
    setAiModel(model);
    setCurrentScreen('character');
    setError(null);
  };

  const handleClassSelect = async (selectedClass: PlayerClass) => {
    // Prime the speech engine on user click to enable autoplay on iOS
    primeSpeechSynthesis(isVoiceoverEnabled);

    setIsLoading(true);
    setPlayerClass(selectedClass);
    setCurrentScreen('game');
    try {
      const newGameState = await startNewGame(selectedClass, language, aiModel);
      setGameState({
        ...INITIAL_GAME_STATE, // Start fresh, this includes illustrations: {}
        ...newGameState,
        suggestedActions: newGameState.suggested_actions,
        gameOver: newGameState.game_over,
        actionResult: newGameState.action_result,
        chapterTitle: newGameState.chapter_title,
        turnCount: 1, // Start the count
      });
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const processAction = async (action: string, selectedItem: Item | null) => {
    if (!playerClass || isLoading) return;
    setIsLoading(true);
    setError(null);

    // Create a temporary state for the API call, so UI doesn't show item used before confirmation
    const tempGameState = { ...gameState };
    if (selectedItem?.type === 'consumable') {
        const newInventory = tempGameState.inventory.map(item =>
            item.name === selectedItem.name ? { ...item, quantity: (item.quantity || 1) - 1 } : item
        ).filter(item => (item.quantity || 1) > 0);
        tempGameState.inventory = newInventory;
    }

    try {
      const response = await processPlayerAction(tempGameState, playerClass, action, selectedItem, language, aiModel);
      
      const actionLog = `\n\n> ${action}${selectedItem ? ` (${selectedItem.name})` : ''}\n\n`;
      const newStory = `${gameState.story}${actionLog}${response.story}`;

      // Continuously increment turn count
      const newTurnCount = gameState.turnCount + 1;

      const newGameState: GameState = {
        ...response,
        story: newStory,
        suggestedActions: response.suggested_actions,
        gameOver: response.game_over,
        actionResult: response.action_result,
        chapterTitle: response.chapter_title,
        turnCount: newTurnCount,
        illustrations: gameState.illustrations, // Carry over existing illustrations
      };
      setGameState(newGameState);

      if (response.win) {
        setHasWonGame();
      }

      if (response.game_over || response.win) {
        setCurrentScreen('gameover');
      }
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGenerateIllustration = async () => {
    if (isGeneratingImage || isLoading) return;
    setIsGeneratingImage(true);
    setError(null);
    
    try {
        const latestStoryChunk = gameState.story.split('>').pop() || gameState.story;
        const prompt = `${t(language, 'illustrationPromptStyle')} A ${playerClass?.name || 'adventurer'} in a dark crypt. ${latestStoryChunk}`;
        const imageUrl = await generateIllustrationApi(prompt, language, aiModel);
        
        setGameState(prevState => ({
          ...prevState,
          illustrations: {
            ...prevState.illustrations,
            [prevState.turnCount]: imageUrl, // Associate with current turn
          }
        }));
    } catch (e: any) {
        setError(e.message || t(language, 'illustrationError'));
    } finally {
        setIsGeneratingImage(false);
    }
  };

  const handleSave = () => {
    if (!playerClass) return;
    const saveData: SaveData = {
      gameState,
      playerClass,
      language,
      isVoiceoverEnabled,
      speechRate,
      aiModel,
    };
    const blob = new Blob([JSON.stringify(saveData, null, 2)], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `whispering-crypt-save-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoad = (saveData: SaveData) => {
    // Prime the speech engine on user click to enable autoplay on iOS
    primeSpeechSynthesis(saveData.isVoiceoverEnabled);

    setGameState({
        ...saveData.gameState,
        illustrations: saveData.gameState.illustrations || {}, // Ensure illustrations object exists
    });
    setPlayerClass(saveData.playerClass);
    setLanguage(saveData.language);
    setIsVoiceoverEnabled(saveData.isVoiceoverEnabled);
    setSpeechRate(saveData.speechRate);
    setAiModel(saveData.aiModel || 'gemini');
    setClasses(getInitialClasses(saveData.language)); // Make sure to update classes on load
    setCurrentScreen('game');
    setError(null);
  };

  const handleRestart = () => {
    setGameState(INITIAL_GAME_STATE);
    setPlayerClass(null);
    setCurrentScreen('start');
    setError(null);
    setIsLoading(false);
  };
  
  const handleUnlockTrickster = () => {
    setClasses(prevClasses => {
        const hasTrickster = prevClasses.some(c => c.id === 'trickster');
        if (!hasTrickster) {
            return [...prevClasses, TRICKSTER_CLASS[language]];
        }
        return prevClasses;
    });
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'character':
        return <CharacterCreationScreen classes={classes} onSelectClass={handleClassSelect} language={language} onUnlockTrickster={handleUnlockTrickster} />;
      case 'game':
        if (!playerClass) {
          handleRestart();
          return null;
        }
        return (
          <GameScreen
            gameState={gameState}
            isLoading={isLoading}
            error={error}
            onSubmitAction={processAction}
            onSave={handleSave}
            language={language}
            playerClassName={playerClass.name}
            chapterTitle={gameState.chapterTitle}
            isGeneratingImage={isGeneratingImage}
            onGenerateIllustration={handleGenerateIllustration}
          />
        );
      case 'gameover':
        return <GameOverScreen win={gameState.win} onRestart={handleRestart} language={language} story={gameState.story} />;
      case 'start':
      default:
        return <StartScreen onStart={handleStart} onLoad={handleLoad} />;
    }
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen flex items-center justify-center font-sans p-4">
      <div className="absolute inset-0 bg-grid-slate-800 [mask-image:linear-gradient(to_bottom,white_20%,transparent_100%)]"></div>
      <main className="z-10 w-full max-w-7xl mx-auto">
        {renderScreen()}
      </main>
    </div>
  );
};

export default App;