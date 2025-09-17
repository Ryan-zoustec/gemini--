import React from 'react';
import { Language } from '../types';
import { t } from '../constants';

interface GameOverScreenProps {
  win: boolean;
  onRestart: () => void;
  finalStory: string;
  language: Language;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ win, onRestart, finalStory, language }) => {
  const lastParagraphs = finalStory.split('\n\n').slice(-2).join('\n\n');
    
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center p-8 bg-slate-900/70 backdrop-blur-sm rounded-lg shadow-2xl border border-slate-700 text-white h-[85vh] max-h-[700px]">
        <h1 className={`text-5xl font-bold mb-4 tracking-wider ${win ? 'text-amber-400' : 'text-red-500'}`}>
            {win ? t(language, 'victoryTitle') : t(language, 'defeatTitle')}
        </h1>
        <div className="text-left bg-slate-800/50 p-4 rounded-md my-4 max-h-48 w-full overflow-y-auto border border-slate-600 text-base">
            <p className="text-slate-300 italic whitespace-pre-wrap leading-relaxed">
            {lastParagraphs}
            </p>
        </div>
        <p className="text-slate-400 max-w-2xl mx-auto mb-6 text-lg">
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