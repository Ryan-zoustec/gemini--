import React, { useState, useRef, useEffect } from 'react';
import { GameState, Item, EquipmentSlot, Language } from '../types';
import PlayerStats from './PlayerStats';
import LoadingIcon from './LoadingIcon';
import { t } from '../constants';

interface EquipmentChangePayload {
    action: 'equip' | 'unequip';
    item: Item;
    sourceSlot?: EquipmentSlot;
}

interface GameScreenProps {
  gameState: GameState;
  isLoading: boolean;
  error: string | null;
  onSubmitAction: (action: string, selectedItem: Item | null) => void;
  onEquipmentChange: (payload: EquipmentChangePayload) => void;
  actionResult: string;
  language: Language;
  playerClassName: string;
  chapterTitle: string;
}

const GameScreen: React.FC<GameScreenProps> = ({ gameState, isLoading, error, onSubmitAction, onEquipmentChange, actionResult, language, playerClassName, chapterTitle }) => {
  const [userInput, setUserInput] = useState('');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const storyEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    storyEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [gameState.story]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const action = userInput.trim();    
    if (!action) return;

    onSubmitAction(action, selectedItem);
    setUserInput('');
    setSelectedItem(null);
  };
  
  const handleSuggestionClick = (action: string) => {
    onSubmitAction(action, selectedItem);
    setUserInput('');
    setSelectedItem(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto h-[85vh] max-h-[900px] flex flex-col bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-700">
        <h1 className="text-3xl font-bold text-cyan-400 mb-4 border-b-2 border-slate-700 pb-2 flex justify-between items-baseline">
            <span>{playerClassName}</span>
            <span className="text-xl text-slate-300 font-light tracking-wider">{chapterTitle}</span>
        </h1>
        
        <PlayerStats 
          health={gameState.health}
          luck={gameState.luck}
          inventory={gameState.inventory}
          equipment={gameState.equipment}
          actionResult={actionResult}
          onEquipmentChange={onEquipmentChange}
          selectedItem={selectedItem}
          onSelectItem={setSelectedItem}
          language={language}
        />

        <div className="flex-grow my-4 overflow-y-auto pr-2 bg-slate-900/50 rounded-md p-3">
          {isLoading && !gameState.story ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <LoadingIcon />
                <p className="mt-2">{t(language, 'buildingWorld')}</p>
            </div>
          ) : (
            <p className="whitespace-pre-wrap text-slate-300 leading-relaxed">
              {gameState.story}
            </p>
          )}
          <div ref={storyEndRef} />
        </div>

        {error && <p className="text-red-400 mb-2">{error}</p>}

        <div className="mb-2">
            <div className="grid grid-cols-3 gap-2">
                {(gameState.suggestedActions || []).map((suggestion, index) => (
                    <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion.action)}
                        disabled={isLoading}
                        className="bg-slate-700 text-slate-300 text-center p-2 rounded-md hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex flex-col justify-center items-center h-full min-h-[50px]"
                    >
                        <span className="font-bold text-base">{suggestion.action}</span>
                        <span className="text-xs text-cyan-400/80 mt-1">{suggestion.hint}</span>
                    </button>
                ))}
            </div>
        </div>
        
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={isLoading ? t(language, 'waitingForFate') : t(language, 'whatToDo')}
            disabled={isLoading}
            className="flex-grow bg-slate-700 border border-slate-600 rounded-md px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-cyan-600 text-white font-bold px-6 py-2 rounded-md hover:bg-cyan-500 transition disabled:bg-slate-500 disabled:cursor-not-allowed"
          >
            {t(language, 'submit')}
          </button>
        </form>
    </div>
  );
};

export default GameScreen;