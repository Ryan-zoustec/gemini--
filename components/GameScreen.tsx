import React, { useState, useRef, useEffect } from 'react';
import { GameState, Item, Language } from '../types';
import PlayerStats from './PlayerStats';
import LoadingIcon from './LoadingIcon';
import { t } from '../constants';

interface GameScreenProps {
  gameState: GameState;
  isLoading: boolean;
  error: string | null;
  onSubmitAction: (action: string, selectedItem: Item | null) => void;
  onSave: () => void;
  language: Language;
  playerClassName: string;
  chapterTitle: string;
}

const SaveIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
        <polyline points="17 21 17 13 7 13 7 21"></polyline>
        <polyline points="7 3 7 8 15 8"></polyline>
    </svg>
);


const GameScreen: React.FC<GameScreenProps> = ({ gameState, isLoading, error, onSubmitAction, onSave, language, playerClassName, chapterTitle }) => {
  const [userInput, setUserInput] = useState('');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const storyEndRef = useRef<HTMLDivElement>(null);
  const [actionFlash, setActionFlash] = useState('');


  useEffect(() => {
    if (gameState.actionResult) {
        let flashClass = '';
        switch(gameState.actionResult) {
            case 'success': flashClass = 'animate-flash-green'; break;
            case 'failure': flashClass = 'animate-damage-flash'; break;
            case 'companion_save': flashClass = 'animate-flash-cyan'; break;
        }
        setActionFlash(flashClass);
        const timer = setTimeout(() => setActionFlash(''), 1000);
        return () => clearTimeout(timer);
    }
  }, [gameState.actionResult, gameState.turnCount]);


  const scrollToBottom = () => {
    storyEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [gameState.story]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const action = userInput.trim();    
    if (!action && !selectedItem) return;
    
    // Default to 'examine' if no text but an item is selected
    const finalAction = action || `examine ${selectedItem?.name}`;

    onSubmitAction(finalAction, selectedItem);
    setUserInput('');
    setSelectedItem(null);
  };
  
  const handleSuggestionClick = (action: string) => {
    onSubmitAction(action, null); // Suggestions don't use selected items
    setUserInput('');
    setSelectedItem(null);
  };

  return (
    <div className={`w-full max-w-7xl mx-auto h-[90vh] max-h-[1000px] flex gap-6 bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-2xl border border-slate-700 ${actionFlash}`}>
        
        {/* Left Panel: Player Stats */}
        <div className="w-1/3 flex flex-col">
            <PlayerStats 
                health={gameState.health}
                luck={gameState.luck}
                inventory={gameState.inventory}
                equipment={gameState.equipment}
                actionResult={gameState.actionResult}
                selectedItem={selectedItem}
                onSelectItem={setSelectedItem}
                language={language}
            />
        </div>

        {/* Right Panel: Story and Actions */}
        <div className="w-2/3 flex flex-col">
            <div className="flex justify-between items-center mb-4 border-b-2 border-slate-700 pb-2">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onSave} 
                        disabled={isLoading} 
                        className="text-slate-500 hover:text-cyan-400 transition-colors disabled:text-slate-700 disabled:cursor-not-allowed" 
                        title={t(language, 'saveGame')}
                        aria-label={t(language, 'saveGame')}
                    >
                        <SaveIcon />
                    </button>
                    <h1 className="text-3xl font-bold text-cyan-400 truncate max-w-xs">{playerClassName}</h1>
                </div>
                <h2 className="text-xl text-slate-300 font-light tracking-wider truncate">{chapterTitle}</h2>
            </div>


            <div className="flex-grow my-2 overflow-y-auto pr-2 bg-slate-900/50 rounded-md p-4 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
            {isLoading && !gameState.story ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                    <LoadingIcon />
                    <p className="mt-2 text-lg">{t(language, 'buildingWorld')}</p>
                </div>
            ) : (
                <div className="whitespace-pre-wrap text-slate-300 leading-relaxed prose prose-invert prose-p:text-slate-300">
                {gameState.story.split('\n\n>').map((part, index) => {
                    if (index === 0) {
                        return <p key={index}>{part}</p>;
                    }
                    const [action, ...rest] = part.split('\n\n');
                    return (
                        <React.Fragment key={index}>
                            <p className="text-cyan-400 italic font-semibold">{`> ${action}`}</p>
                            <p>{rest.join('\n\n')}</p>
                        </React.Fragment>
                    );
                })}
                </div>
            )}
            <div ref={storyEndRef} />
            </div>

            {error && <p className="text-red-400 mb-2 font-semibold">{error}</p>}

            <div className="mb-2">
                <div className="grid grid-cols-3 gap-3">
                    {(gameState.suggestedActions || []).map((suggestion, index) => (
                        <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion.action)}
                            disabled={isLoading}
                            className="bg-slate-700/80 text-slate-300 text-center p-3 rounded-md hover:bg-slate-600/80 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex flex-col justify-center items-center h-full min-h-[60px] border border-slate-600 shadow-sm"
                        >
                            <span className="font-bold text-base">{suggestion.action}</span>
                            <span className="text-xs text-cyan-400/80 mt-1">{suggestion.hint}</span>
                        </button>
                    ))}
                </div>
            </div>
            
            <form onSubmit={handleSubmit} className="flex gap-3">
            <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={isLoading ? t(language, 'waitingForFate') : (selectedItem ? `Using ${selectedItem.name}...` : t(language, 'whatToDo'))}
                disabled={isLoading}
                className="flex-grow bg-slate-700 border border-slate-600 rounded-md px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition disabled:opacity-50 text-lg"
            />
            <button
                type="submit"
                disabled={isLoading}
                className="bg-cyan-600 text-white font-bold px-6 py-2 rounded-md hover:bg-cyan-500 transition disabled:bg-cyan-800 disabled:cursor-not-allowed text-lg"
            >
                 {isLoading ? <LoadingIcon /> : t(language, 'submit')}
            </button>
            </form>
        </div>
    </div>
  );
};

export default GameScreen;