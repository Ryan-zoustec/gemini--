import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GameState, Item, EquipmentSlot, PlayerClass } from './types';
import { INITIAL_GAME_STATE, PLAYER_CLASSES } from './constants';
import { getGameUpdate } from './services/geminiService';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import GameOverScreen from './components/GameOverScreen';
import CharacterCreationScreen from './components/CharacterCreationScreen';

const FADE_DURATION = 2000; // 2 seconds for crossfade

interface EquipmentChangePayload {
    action: 'equip' | 'unequip';
    item: Item;
    sourceSlot?: EquipmentSlot;
}


function App() {
  const [currentScreen, setCurrentScreen] = useState<'start' | 'creation' | 'game'>('start');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [error, setError] = useState<string | null>(null);
  const [isTakingDamage, setIsTakingDamage] = useState<boolean>(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(false);
  const [isVoiceoverEnabled, setIsVoiceoverEnabled] = useState<boolean>(false);

  const audioRef = useRef<{
    audioMap: { [key: string]: HTMLAudioElement };
    sfxMap: { [key: string]: HTMLAudioElement };
  } | null>(null);

  const currentTrackRef = useRef<HTMLAudioElement | null>(null);
  const prevHealthRef = useRef<number>(gameState.health);
  const ttsVoiceRef = useRef<SpeechSynthesisVoice | null>(null);

  // Effect to load speech synthesis voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        // Prefer Google voices for zh-TW, they often sound more natural
        const twGoogleVoice = voices.find(voice => voice.lang === 'zh-TW' && voice.name.includes('Google'));
        ttsVoiceRef.current = twGoogleVoice || voices.find(voice => voice.lang === 'zh-TW') || null;
      }
    };

    // Voices are loaded asynchronously
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices(); // Initial attempt in case they are already loaded

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      window.speechSynthesis.cancel(); // Cleanup on unmount
    };
  }, []);

  useEffect(() => {
    // Pre-create all audio elements for reliability
    const audioMap: { [key: string]: HTMLAudioElement } = {
      ambient: new Audio('https://storage.googleapis.com/gemini-adventure-assets/ambient_dungeon.mp3'),
      action: new Audio('https://storage.googleapis.com/gemini-adventure-assets/action_combat.mp3'),
      tension: new Audio('https://storage.googleapis.com/gemini-adventure-assets/tension_suspense.mp3'),
      victory: new Audio('https://storage.googleapis.com/gemini-adventure-assets/victory_fanfare.mp3'),
      defeat: new Audio('https://storage.googleapis.com/gemini-adventure-assets/defeat_sting.mp3'),
    };
    
    const sfxMap: { [key: string]: HTMLAudioElement } = {
        success: new Audio('https://storage.googleapis.com/gemini-adventure-assets/sfx_success.mp3'),
        failure: new Audio('https://storage.googleapis.com/gemini-adventure-assets/sfx_failure.mp3'),
        item_use: new Audio('https://storage.googleapis.com/gemini-adventure-assets/sfx_item_use.mp3'),
    };

    // Configure background music
    Object.values(audioMap).forEach(audio => {
      audio.loop = true;
      audio.preload = 'auto';
    });
    audioMap.victory.loop = false;
    audioMap.defeat.loop = false;

    // Configure SFX
    Object.values(sfxMap).forEach(sfx => {
        sfx.preload = 'auto';
    });
    sfxMap.success.volume = 0.6;
    sfxMap.failure.volume = 0.6;
    sfxMap.item_use.volume = 0.6;

    audioRef.current = { audioMap, sfxMap };
  }, []);

  const fadeAudio = useCallback((audio: HTMLAudioElement, targetVolume: number) => {
    const startVolume = audio.volume;
    const startTime = Date.now();
    
    const fade = () => {
      const elapsedTime = Date.now() - startTime;
      const progress = Math.min(elapsedTime / FADE_DURATION, 1);
      audio.volume = startVolume + (targetVolume - startVolume) * progress;

      if (progress < 1) {
        requestAnimationFrame(fade);
      } else {
        if (targetVolume === 0) {
          audio.pause();
        }
      }
    };
    fade();
  }, []);

  const playSfx = useCallback((key: string) => {
    if (!isAudioEnabled || !audioRef.current) return;
    const sfx = audioRef.current.sfxMap[key];
    if (sfx) {
      sfx.currentTime = 0; // Rewind to start
      sfx.play().catch(e => console.error("SFX play failed:", e));
    }
  }, [isAudioEnabled]);

  useEffect(() => {
    // Handle health change visual/audio feedback
    if (gameState.health < prevHealthRef.current) {
      setIsTakingDamage(true);
      playSfx('failure');
      const timer = setTimeout(() => setIsTakingDamage(false), 500); // Duration of the flash animation
      
      // Cleanup timer
      return () => clearTimeout(timer);
    }
    prevHealthRef.current = gameState.health;
  }, [gameState.health, playSfx]);

  useEffect(() => {
    // Handle action result SFX
    switch(gameState.actionResult) {
      case 'success':
        playSfx('success');
        break;
      case 'item_use':
        playSfx('item_use');
        break;
      // 'failure' is handled by health check to be more reliable
      case 'neutral':
      default:
        break;
    }
  }, [gameState.actionResult, playSfx]);


  useEffect(() => {
    if (!isAudioEnabled || !audioRef.current) return;

    // Handle background music
    const newTrackKey = gameState.gameOver ? (gameState.win ? 'victory' : 'defeat') : gameState.mood;
    const newTrack = audioRef.current.audioMap[newTrackKey] || audioRef.current.audioMap['ambient'];

    if (currentTrackRef.current !== newTrack) {
      if (currentTrackRef.current) {
        fadeAudio(currentTrackRef.current, 0);
      }
      
      newTrack.currentTime = 0;
      newTrack.volume = 0;
      newTrack.play().catch(e => console.error("Audio play failed:", e));
      fadeAudio(newTrack, 0.5);

      currentTrackRef.current = newTrack;
    }

  }, [gameState.mood, gameState.gameOver, gameState.win, fadeAudio, isAudioEnabled]);

  const speakStory = useCallback((text: string) => {
    if (!isVoiceoverEnabled || !text.trim()) return;

    window.speechSynthesis.cancel(); // Stop any previous speech immediately

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-TW';
    if (ttsVoiceRef.current) {
      utterance.voice = ttsVoiceRef.current;
    }
    utterance.rate = 0.95; // Slightly slower for a more dramatic storytelling feel
    utterance.pitch = 1.0; 

    window.speechSynthesis.speak(utterance);
  }, [isVoiceoverEnabled]);


  const processAction = useCallback(async (action: string, currentState: GameState, selectedItem: Item | null) => {
    setIsLoading(true);
    setError(null);
    try {
      const gameUpdate = await getGameUpdate(currentState, action, selectedItem);
      
      speakStory(gameUpdate.story);

      const nextTurnCount = currentState.turnCount >= 5 ? 0 : currentState.turnCount + 1;
      
      setGameState({
        story: currentState.story ? `${currentState.story}\n\n${gameUpdate.story}` : gameUpdate.story,
        health: gameUpdate.health,
        inventory: gameUpdate.inventory,
        equipment: gameUpdate.equipment,
        luck: gameUpdate.luck,
        suggestedActions: gameUpdate.suggested_actions,
        gameOver: gameUpdate.game_over,
        win: gameUpdate.win,
        mood: gameUpdate.mood,
        actionResult: gameUpdate.action_result,
        turnCount: nextTurnCount,
      });

    } catch (err) {
      console.error(err);
      setError("一股遠古的邪惡力量阻礙了我們的連接。請再試一次。");
    } finally {
      setIsLoading(false);
    }
  }, [speakStory]);
  
  const handleEquipmentChange = useCallback(({ action, item, sourceSlot }: EquipmentChangePayload) => {
    setGameState(prevState => {
        const inventory = [...prevState.inventory];
        const equipment = { ...prevState.equipment };

        if (action === 'equip') {
            if (!item.slot) return prevState;

            const itemIndex = inventory.findIndex(i => i.name === item.name);
            if (itemIndex === -1) return prevState;

            const [itemToEquip] = inventory.splice(itemIndex, 1);
            const targetSlot = item.slot;

            if (equipment[targetSlot]) {
                inventory.push(equipment[targetSlot]!);
            }
            equipment[targetSlot] = itemToEquip;

        } else if (action === 'unequip' && sourceSlot) {
            if (!equipment[sourceSlot] || equipment[sourceSlot]?.name !== item.name) return prevState;

            const [itemToUnequip] = [equipment[sourceSlot]];
            equipment[sourceSlot] = null;
            inventory.push(itemToUnequip!);
        }

        return { ...prevState, inventory, equipment };
    });
  }, []);

  const handleStartGame = useCallback((voiceEnabled: boolean) => {
    setIsVoiceoverEnabled(voiceEnabled);
    setCurrentScreen('creation');
  }, []);

  const handleClassSelect = useCallback(async (selectedClass: PlayerClass) => {
    const initialState: GameState = {
        ...INITIAL_GAME_STATE,
        health: selectedClass.initialHealth,
        luck: selectedClass.initialLuck,
        inventory: selectedClass.initialInventory,
        equipment: selectedClass.initialEquipment,
    };
    
    setIsAudioEnabled(true);
    setCurrentScreen('game');

    await processAction(selectedClass.startingPrompt, initialState, null);
  }, [processAction]);

  const handleSubmitAction = useCallback((action: string, selectedItem: Item | null) => {
    if (!action.trim()) return;
    processAction(action, gameState, selectedItem);
  }, [gameState, processAction]);

  const handleRestart = () => {
    if (currentTrackRef.current) {
      fadeAudio(currentTrackRef.current, 0);
      currentTrackRef.current = null;
    }
    window.speechSynthesis.cancel();
    setGameState(INITIAL_GAME_STATE);
    setCurrentScreen('start');
    setError(null);
    setIsAudioEnabled(false);
    setIsVoiceoverEnabled(false);
  };
  
  const renderContent = () => {
    switch (currentScreen) {
      case 'start':
        return <StartScreen onStart={handleStartGame} />;
      
      case 'creation':
        // FIX: Corrected function name from handleSelectClass to handleClassSelect
        return <CharacterCreationScreen classes={PLAYER_CLASSES} onSelectClass={handleClassSelect} />;

      case 'game':
        if (gameState.gameOver) {
          return <GameOverScreen 
            win={gameState.win} 
            onRestart={handleRestart} 
            finalStory={gameState.story}
          />;
        }
        return (
          <GameScreen 
            gameState={gameState} 
            isLoading={isLoading} 
            error={error} 
            onSubmitAction={handleSubmitAction}
            onEquipmentChange={handleEquipmentChange}
            actionResult={gameState.actionResult}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-900">
      {isTakingDamage && <div className="fixed inset-0 z-50 pointer-events-none animate-damage-flash"></div>}
      <div className="w-full max-w-6xl mx-auto">
        {renderContent()}
      </div>
    </main>
  );
}

export default App;
