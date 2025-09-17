import React, { useState, useRef } from 'react';
import { Language, SaveData, AIModel } from '../types';
import { t } from '../constants';

interface StartScreenProps {
  onStart: (voiceEnabled: boolean, lang: Language, rate: number, aiModel: AIModel) => void;
  onLoad: (saveData: SaveData) => void;
}

const languages: { code: Language; name: string }[] = [
    { code: 'zh-TW', name: '繁體中文' },
    { code: 'en', name: 'English' },
    { code: 'ja', name: '日本語' },
    { code: 'es', name: 'Español' },
    { code: 'ko', name: '한국어' },
];

const aiModels: { code: AIModel; name: string }[] = [
    { code: 'gemini', name: 'Gemini' },
    { code: 'chatgpt', name: 'ChatGPT (Simulated)' },
];

const StartScreen: React.FC<StartScreenProps> = ({ onStart, onLoad }) => {
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [language, setLanguage] = useState<Language>('zh-TW');
  const [aiModel, setAiModel] = useState<AIModel>('gemini');
  const [rate, setRate] = useState(1);
  const [loadError, setLoadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLoadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const text = e.target?.result as string;
            if (!text) throw new Error("File is empty");
            const saveData = JSON.parse(text) as SaveData;
            // Basic validation
            if (saveData.gameState && saveData.playerClass && saveData.language) {
                onLoad(saveData);
            } else {
                throw new Error("Invalid save file format");
            }
        } catch (error) {
            console.error("Failed to load save file:", error);
            setLoadError(t(language, 'loadError'));
        }
    };
    reader.onerror = () => {
        setLoadError(t(language, 'loadError'));
    };
    reader.readAsText(file);
    
    event.target.value = '';
  };


  return (
    <div className="text-center bg-black/30 backdrop-blur-sm p-8 rounded-lg shadow-2xl shadow-cyan-500/10 border border-slate-700 max-w-4xl mx-auto">
      <h1 className="text-5xl font-bold text-cyan-400 mb-4 tracking-wider">{t(language, 'adventureTitle')}</h1>
      <h2 className="text-3xl text-slate-300 mb-6">{t(language, 'adventureSubtitle')}</h2>
      <p className="text-slate-400 max-w-3xl mx-auto mb-8">
        {t(language, 'introText')}
      </p>

      <div className="max-w-xs mx-auto mb-4 grid grid-cols-1 gap-4">
        <div>
            <label htmlFor="language-select" className="block text-slate-300 mb-1 text-left">Language</label>
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
        <div>
            <label htmlFor="ai-model-select" className="block text-slate-300 mb-1 text-left">AI Engine</label>
            <select
                id="ai-model-select"
                value={aiModel}
                onChange={(e) => setAiModel(e.target.value as AIModel)}
                className="w-full bg-slate-700 border border-slate-600 rounded-md px-4 py-2 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
                aria-label="Select AI Model"
            >
                {aiModels.map(model => (
                    <option key={model.code} value={model.code}>{model.name}</option>
                ))}
            </select>
        </div>
      </div>

       <div className="flex justify-center items-center gap-4 my-6">
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

      {loadError && <p className="text-red-400 mb-4">{loadError}</p>}

      <div className="flex flex-col items-center gap-4">
        <button
            onClick={() => onStart(voiceEnabled, language, rate, aiModel)}
            className="bg-cyan-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-cyan-500 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/20 text-xl"
        >
            {t(language, 'startAdventure')}
        </button>
         <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".txt"
            style={{ display: 'none' }}
        />
         <button
            onClick={handleLoadClick}
            className="text-slate-400 hover:text-cyan-400 transition-colors text-sm underline"
        >
            {t(language, 'loadGame')}
        </button>
      </div>
    </div>
  );
};

export default StartScreen;