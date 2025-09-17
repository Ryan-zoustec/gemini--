import React, { useState } from 'react';

interface StartScreenProps {
  onStart: (voiceEnabled: boolean) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  return (
    <div className="text-center bg-black/30 backdrop-blur-sm p-8 rounded-lg shadow-2xl shadow-cyan-500/10 border border-slate-700">
      <h1 className="text-5xl font-bold text-cyan-400 mb-4 tracking-wider">Gemini 冒險</h1>
      <h2 className="text-3xl text-slate-300 mb-6">低語地穴</h2>
      <p className="text-slate-400 max-w-2xl mx-auto mb-8">
        一股古老的邪惡正在被遺忘的深處甦醒。一個關於陰影與鋼鐵的故事等待著你，由 Gemini 動態生成。你做出的每一個選擇都將開闢一條新的道路。你有足夠的勇氣進入低語地穴嗎？
      </p>
       <div className="flex justify-center items-center gap-4 mb-8">
        <input
          type="checkbox"
          id="voice-toggle"
          checked={voiceEnabled}
          onChange={(e) => setVoiceEnabled(e.target.checked)}
          className="form-checkbox h-5 w-5 text-cyan-500 bg-slate-700 border-slate-600 rounded focus:ring-cyan-500 cursor-pointer"
          aria-labelledby="voice-toggle-label"
        />
        <label id="voice-toggle-label" htmlFor="voice-toggle" className="text-slate-300 cursor-pointer select-none">
          啟用劇情語音
        </label>
      </div>
      <button
        onClick={() => onStart(voiceEnabled)}
        className="bg-cyan-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-cyan-500 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/20 text-xl"
      >
        開始冒險
      </button>
    </div>
  );
};

export default StartScreen;