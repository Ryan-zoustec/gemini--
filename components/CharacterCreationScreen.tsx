import React, { useState } from 'react';
import { PlayerClass } from '../types';

const iconProps = { className: "h-16 w-16 mb-4 text-cyan-400", strokeWidth: "1.5", fill: "none", strokeLinecap: "round", strokeLinejoin: "round"} as const;
const KnightIcon = () => <svg {...iconProps} viewBox="0 0 24 24" stroke="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
const RogueIcon = () => <svg {...iconProps} viewBox="0 0 24 24" stroke="currentColor"><path d="M14.5 17.5l-5-5 5-5m-5 5h10"></path><path d="M3 3l7 7-7 7 7-7-7-7z"></path><path d="M21 21l-7-7 7-7-7 7 7 7z"></path></svg>;
const ScholarIcon = () => <svg {...iconProps} viewBox="0 0 24 24" stroke="currentColor"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v15H6.5A2.5 2.5 0 0 1 4 14.5v-10A2.5 2.5 0 0 1 6.5 2z"></path></svg>;

const classIcons: { [key: string]: React.ReactElement } = {
  '騎士': <KnightIcon />,
  '盜賊': <RogueIcon />,
  '學者': <ScholarIcon />,
};

interface CharacterCreationScreenProps {
  classes: PlayerClass[];
  onSelectClass: (playerClass: PlayerClass) => void;
}

const CharacterCreationScreen: React.FC<CharacterCreationScreenProps> = ({ classes, onSelectClass }) => {
  const [selectedClass, setSelectedClass] = useState<PlayerClass | null>(null);

  const handleSelect = (playerClass: PlayerClass) => {
    setSelectedClass(playerClass);
  };

  const handleConfirm = () => {
    if (selectedClass) {
      onSelectClass(selectedClass);
    }
  };
  
  const getStartingItems = (playerClass: PlayerClass) => {
    const equipmentItems = Object.values(playerClass.initialEquipment).filter(Boolean).map(item => item!.name);
    const inventoryItems = playerClass.initialInventory.map(item => item.name);
    return [...equipmentItems, ...inventoryItems].join('、');
  };

  return (
    <div className="text-center bg-black/30 backdrop-blur-sm p-8 rounded-lg shadow-2xl shadow-cyan-500/10 border border-slate-700 w-full max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold text-cyan-400 mb-2 tracking-wider">選擇你的出身</h1>
      <p className="text-slate-400 max-w-3xl mx-auto mb-8">
        你的過去塑造了現在的你。選擇一個職業，它將決定你的初始能力和裝備。
      </p>
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {classes.map((playerClass) => (
          <div
            key={playerClass.id}
            onClick={() => handleSelect(playerClass)}
            className={`p-6 bg-slate-800/50 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:bg-slate-700/70 hover:shadow-cyan-500/20 ${selectedClass?.id === playerClass.id ? 'border-cyan-500 shadow-lg' : 'border-slate-700'}`}
          >
            <div className="flex flex-col items-center">
                {classIcons[playerClass.name]}
                <h2 className="text-2xl font-bold text-slate-200 mb-2">{playerClass.name}</h2>
            </div>
            <p className="text-slate-400 text-sm mb-4 h-24">{playerClass.description}</p>
            <div className="text-left text-xs text-slate-300 bg-slate-900/60 p-3 rounded-md">
                <h4 className="font-bold text-cyan-400 mb-1">初始裝備:</h4>
                <p>{getStartingItems(playerClass)}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handleConfirm}
        disabled={!selectedClass}
        className="bg-cyan-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/20 text-xl disabled:bg-slate-600 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
      >
        踏上旅程
      </button>
    </div>
  );
};

export default CharacterCreationScreen;
