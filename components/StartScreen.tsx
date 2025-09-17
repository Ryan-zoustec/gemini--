import React, { useState } from 'react';
import { Language } from '../types';
import { t } from '../constants';

interface StartScreenProps {
  onStart: (voiceEnabled: boolean, lang: Language, rate: number) => void;
}

const languages: { code: Language; name: string }[] = [
    { code: 'zh-TW', name: '繁體中文' },
    { code: 'en', name: 'English' },
    { code: 'ja', name: '日本語' },
    { code: 'es', name: 'Español' },
    { code: 'ko', name: '한국어' },
];

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [language, setLanguage] = useState<Language>('zh-TW');
  const [rate, setRate] = useState(1);

  return (
    <div className="text-center bg-black/30 backdrop-blur-sm p-8 rounded-lg shadow-2xl shadow-cyan-500/10 border border-slate-700">
      <h1 className="text-5xl font-bold text-cyan-400 mb-4 tracking-wider">{t(language, 'adventureTitle')}</h1>
      <h2 className="text-3xl text-slate-300 mb-6">{t(language, 'adventureSubtitle')}</h2>
      <p className="text-slate-400 max-w-2xl mx-auto mb-8">
        {t(language, 'introText')}
      </p>

      <div className="max-w-xs mx-auto mb-6">
        <select
            id="language-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="w-full bg-slate-700 border border-slate-600 rounded-md px-4 py-2 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
            aria-label="Select language"
        >
            {languages.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
        </select>
      </div>

       <div className="flex justify-center items-center gap-4 mb-4">
        <input
          type="checkbox"
          id="voice-toggle"
          checked={voiceEnabled}
          onChange={(e) => setVoiceEnabled(e.target.checked)}
          className="form-checkbox h-5 w-5 text-cyan-500 bg-slate-700 border-slate-600 rounded focus:ring-cyan-500 cursor-pointer"
          aria-labelledby="voice-toggle-label"
        />
        <label id="voice-toggle-label" htmlFor="voice-toggle" className="text-slate-300 cursor-pointer select-none">
          {t(language, 'enableNarration')}
        </label>
      </div>

      {voiceEnabled && (
        <div className="max-w-xs mx-auto mb-8 transition-all duration-300">
            <label htmlFor="voice-speed" className="block text-slate-300 mb-2">{t(language, 'voiceSpeed')}: <span className="font-semibold text-cyan-400">{rate.toFixed(1)}x</span></label>
            <input 
                type="range" 
                id="voice-speed"
                min="0.5"
                max="2"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
        </div>
      )}

      <button
        onClick={() => onStart(voiceEnabled, language, rate)}
        className="bg-cyan-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-cyan-500 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/20 text-xl"
      >
        {t(language, 'startAdventure')}
      </button>
    </div>
  );
};

export default StartScreen;