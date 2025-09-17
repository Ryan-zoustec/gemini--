
import React from 'react';
import { Language } from '../types';
import { t } from '../constants';

interface GameOverScreenProps {
  win: boolean;
  onRestart: () => void;
  language: Language;
  story: string;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ win, onRestart, language, story }) => {
    
  const getFinalStoryText = (fullStory: string): string => {
    if (!fullStory) return '';
    // The story is a log of turns separated by '>'. We want the narrative part of the last turn.
    const storyTurns = fullStory.split('\n\n>');
    const latestTurnContent = storyTurns[storyTurns.length - 1] || '';

    // If it's the very first turn (no '>'), it's just the initial story.
    if (storyTurns.length === 1) {
        return latestTurnContent.trim();
    }

    // For subsequent turns, the format is "Action\n\nNarrative..."
    // We want to skip the action part.
    const contentParts = latestTurnContent.split('\n\n');
    return contentParts.slice(1).join('\n\n').trim();
  };
  
  const finalStory = getFinalStoryText(story);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center p-8 bg-slate-900/70 backdrop-blur-sm rounded-lg shadow-2xl border border-slate-700 text-white h-[85vh] max-h-[700px]">
        <h1 className={`text-6xl font-bold mb-4 tracking-wider ${win ? 'text-amber-400' : 'text-red-500'}`}>
            {win ? t(language, 'victoryTitle') : t(language, 'defeatTitle')}
        </h1>

        {!win && finalStory && (
            <div className="w-full max-w-2xl mx-auto mb-6 p-4 bg-black/30 rounded-lg border border-red-900/50 max-h-48 overflow-y-auto animate-fade-in">
                <p className="text-red-200 italic text-left whitespace-pre-wrap">
                    {finalStory}
                </p>
            </div>
        )}

        <p className="text-slate-400 max-w-2xl mx-auto mb-8 text-xl">
            {win
            ? t(language, 'victoryText')
            : t(language, 'defeatText')}
        </p>
        <button
            onClick={onRestart}
            className="bg-cyan-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-cyan-500 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/20 text-xl"
        >
            {t(language, 'playAgain')}
        </button>
    </div>
  );
};

export default GameOverScreen;
