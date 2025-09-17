
import React, { useState, useRef, useEffect } from 'react';
import { GameState, Item, Language } from '../types';
import PlayerStats from './PlayerStats';
import LoadingIcon from './LoadingIcon';
import { generateIllustration } from '../services/aiService';
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

const GameScreen: React.FC<GameScreenProps> = ({
  gameState,
  isLoading,
  error,
  onSubmitAction,
  onSave,
  language,
  playerClassName,
  chapterTitle
}) => {
  const [customAction, setCustomAction] = useState('');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const storyContainerRef = useRef<HTMLDivElement>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [illustrationUrl, setIllustrationUrl] = useState<string | null>(null);
  const [illustrationError, setIllustrationError] = useState<string | null>(null);

  useEffect(() => {
    if (storyContainerRef.current) {
      storyContainerRef.current.scrollTop = storyContainerRef.current.scrollHeight;
    }
  }, [gameState.story]);

  // Reset illustration when story changes
  useEffect(() => {
    setIllustrationUrl(null);
    setIllustrationError(null);
  }, [gameState.story]);


  const handleSubmit = (action: string) => {
    if (isLoading || !action.trim()) return;
    onSubmitAction(action, selectedItem);
    setCustomAction('');
    setSelectedItem(null);
  };

  const handleCustomActionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(customAction);
  };
  
  const handleGenerateIllustration = async () => {
    if (isGeneratingImage) return;
    setIsGeneratingImage(true);
    setIllustrationUrl(null);
    setIllustrationError(null);
    
    try {
        // We take the latest story part for the prompt.
        const latestStoryChunk = gameState.story.split('>').pop() || gameState.story;
        const prompt = `${t(language, 'illustrationPromptStyle')} A ${playerClassName} in a dark crypt. ${latestStoryChunk}`;
        const imageUrl = await generateIllustration(prompt, language, 'gemini');
        setIllustrationUrl(imageUrl);
    } catch (err: any) {
        setIllustrationError(t(language, 'illustrationError'));
    } finally {
        setIsGeneratingImage(false);
    }
  };


  return (
    <div className="flex flex-col md:flex-row gap-4 h-[90vh] max-h-[900px] w-full">
      {/* Left Panel: Game Info & Player Stats */}
      <div className="md:w-1/3 lg:w-1/4 flex flex-col gap-4">
        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 text-center">
            <h2 className="text-2xl font-bold text-cyan-400">{chapterTitle}</h2>
            <p className="text-slate-400">Turn: {gameState.turnCount}</p>
        </div>
        <div className="flex-grow">
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
      </div>

      {/* Right Panel: Story and Actions */}
      <div className="md:w-2/3 lg:w-3/4 flex flex-col bg-black/30 backdrop-blur-sm rounded-lg shadow-2xl shadow-cyan-500/10 border border-slate-700 overflow-hidden">
        {/* Story Display */}
        <div ref={storyContainerRef} className="flex-grow p-6 overflow-y-auto story-content relative">
            {illustrationUrl && (
              <div className="mb-4 border border-cyan-700/50 rounded-lg overflow-hidden shadow-lg shadow-cyan-900/50">
                <img src={illustrationUrl} alt="Generated illustration of the scene" className="w-full h-auto object-cover"/>
              </div>
            )}
            {isGeneratingImage && (
              <div className="mb-4 h-64 flex flex-col items-center justify-center bg-slate-800/50 border border-slate-700 rounded-lg">
                <LoadingIcon />
                <p className="mt-2 text-slate-400">{t(language, 'generatingIllustration')}</p>
              </div>
            )}
            {illustrationError && (
                 <div className="mb-4 p-3 text-center bg-red-900/50 border border-red-700 rounded-lg">
                    <p className="text-red-300">{illustrationError}</p>
                </div>
            )}
          {gameState.story.split('\n\n').map((paragraph, index) => (
            <p key={index} className={`mb-4 text-slate-300 text-lg leading-relaxed ${paragraph.startsWith('>') ? 'text-cyan-300 italic pl-4 border-l-2 border-cyan-700' : ''}`}>
              {paragraph.replace(/^>\s*/, '')}
            </p>
          ))}
          {isLoading && !gameState.story && (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80">
                <LoadingIcon />
                <p className="mt-4 text-xl text-slate-300">{t(language, 'buildingWorld')}</p>
            </div>
          )}
        </div>

        {/* Action Panel */}
        <div className="p-4 border-t border-slate-700 bg-slate-900/50">
           {error && <p className="text-red-400 mb-2 text-center">{error}</p>}
           {isLoading && (
              <div className="flex items-center justify-center p-4">
                  <LoadingIcon />
                  <p className="ml-4 text-slate-400">{t(language, 'waitingForFate')}</p>
              </div>
           )}

          {!isLoading && (
            <>
              <h3 className="text-lg font-bold text-slate-300 mb-3 text-center">{t(language, 'whatToDo')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                {gameState.suggestedActions.map(({ action, hint }) => (
                  <button
                    key={action}
                    onClick={() => handleSubmit(action)}
                    className="bg-slate-700 text-slate-200 p-3 rounded-lg text-left transition-colors hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                    title={hint}
                  >
                    <span className="font-semibold">{action}</span>
                    <span className="block text-xs text-slate-400 mt-1">{hint}</span>
                  </button>
                ))}
              </div>
              <form onSubmit={handleCustomActionSubmit} className="flex gap-3">
                <input
                  type="text"
                  value={customAction}
                  onChange={(e) => setCustomAction(e.target.value)}
                  placeholder={selectedItem ? `Use ${selectedItem.name}...` : 'Or type your own action...'}
                  className="flex-grow bg-slate-800 border border-slate-600 rounded-md px-4 py-2 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition disabled:opacity-50"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className="bg-cyan-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-cyan-500 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
                  disabled={isLoading || !customAction.trim()}
                >
                  {t(language, 'submit')}
                </button>
              </form>
            </>
          )}
           <div className="mt-4 flex justify-center gap-4">
               <button onClick={handleGenerateIllustration} disabled={isGeneratingImage || isLoading} className="text-slate-400 hover:text-cyan-400 transition-colors text-sm underline disabled:opacity-50 disabled:cursor-not-allowed">
                   {isGeneratingImage ? t(language, 'generatingIllustration') : t(language, 'generateIllustration')}
               </button>
                <button onClick={onSave} disabled={isLoading} className="text-slate-400 hover:text-cyan-400 transition-colors text-sm underline disabled:opacity-50">
                    {t(language, 'saveGame')}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default GameScreen;
