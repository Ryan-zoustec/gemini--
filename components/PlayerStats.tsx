import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Item, EquipmentSlots, EquipmentSlot } from '../types';

interface EquipmentChangePayload {
    action: 'equip' | 'unequip';
    item: Item;
    sourceSlot?: EquipmentSlot;
}

interface PlayerStatsProps {
  health: number;
  luck: number;
  inventory: Item[];
  equipment: EquipmentSlots;
  actionResult: string;
  onEquipmentChange: (payload: EquipmentChangePayload) => void;
  selectedItem: Item | null;
  onSelectItem: (item: Item | null) => void;
}

// --- Main Stat Icons ---
const HealthIcon: React.FC<{ isLow: boolean }> = ({ isLow }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 mr-2 text-red-500 transition-transform duration-300 ${isLow ? 'animate-pulse-danger' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg> );
const LuckIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-400" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h.5a1.5 1.5 0 010 3H14a1 1 0 00-1 1v.5a1.5 1.5 0 01-3 0V9a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H9a1 1 0 001-1v-.5z" /><path d="M10 16.5a1.5 1.5 0 01-3 0V16a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H6a1 1 0 001-1v-.5a1.5 1.5 0 013 0V11a1 1 0 001 1h.5a1.5 1.5 0 010 3H11a1 1 0 00-1 1v.5z" /></svg> );

// --- Item Specific Icons ---
const iconProps = { className: "h-5 w-5 text-slate-300 shrink-0", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "1.5", fill: "none", strokeLinecap: "round", strokeLinejoin: "round"} as const;
const DaggerIcon = () => <svg {...iconProps}><path d="M14.5 17.5l-5-5 5-5m-5 5h10"/></svg>;
const MapIcon = () => <svg {...iconProps}><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>;
const PotionIcon = () => <svg {...iconProps}><path d="M8 2.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5v1.23c0 .42-.17.83-.46 1.12L12.5 8.5V13h-1V8.5L8.46 4.85A1.5 1.5 0 0 1 8 3.73V2.5zM9 13v1.5A1.5 1.5 0 0 0 10.5 16h3A1.5 1.5 0 0 0 15 14.5V13h-1.5v1h-2v-1H9z" strokeWidth="0" fill="currentColor"/></svg>;
const KeyIcon = () => <svg {...iconProps}><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>;
const ArmorIcon = () => <svg {...iconProps}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
const HelmetIcon = () => <svg {...iconProps}><path d="M12 2a5 5 0 0 0-5 5v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V7a5 5 0 0 0-5-5z"></path><path d="M12 14v6"></path><path d="M9 18h6"></path></svg>;
const BootsIcon = () => <svg {...iconProps}><path d="M20 12V8a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v12h12v-4a2 2 0 0 0-2-2h-2"></path></svg>;
const BackpackIcon = () => <svg {...iconProps}><rect x="4" y="7" width="16" height="14" rx="2" ry="2"></rect><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"></path></svg>;
const BeltIcon = () => <svg {...iconProps}><path d="M10 4H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2"></path><path d="M10 4V2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><rect x="14" y="10" width="4" height="4" rx="1"></rect></svg>;
const GenericItemIcon = () => <svg {...iconProps}><rect x="1" y="7" width="22" height="14" rx="2" ry="2"></rect><path d="M3 7V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2"></path><path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"></path></svg>;
const InventoryIcon = () => <svg {...iconProps}><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M12 3v4"></path><path d="M16 3v4"></path><path d="M8 3v4"></path></svg>;

const getIconForItem = (item: Item | null): React.ReactElement => {
    if (!item) return <GenericItemIcon />;
    const name = item.name.toLowerCase();
    const type = item.type;
    const slot = item.slot;

    if (slot === 'head' || name.includes('頭盔') || name.includes('帽')) return <HelmetIcon />;
    if (slot === 'body' || name.includes('甲') || name.includes('袍')) return <ArmorIcon />;
    if (slot === 'hands' || name.includes('匕首') || name.includes('劍') || name.includes('刀')) return <DaggerIcon />;
    if (slot === 'feet' || name.includes('靴')) return <BootsIcon />;
    if (slot === 'back' || name.includes('背包') || name.includes('披風')) return <BackpackIcon />;
    if (slot === 'waist' || name.includes('腰帶')) return <BeltIcon />;

    if (name.includes('地圖')) return <MapIcon />;
    if (name.includes('藥水') || name.includes('藥劑') || name.includes('瓶')) return <PotionIcon />;
    if (name.includes('鑰匙')) return <KeyIcon />;
    
    return <GenericItemIcon />;
};

const EquipmentSlotComponent: React.FC<{
    slot: EquipmentSlot;
    item: Item | null;
    onDrop: (e: React.DragEvent<HTMLDivElement>, targetSlot: EquipmentSlot) => void;
    onMouseEnter: (e: React.MouseEvent<HTMLDivElement>, item: Item | null) => void;
    onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => void;
    onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
}> = ({ slot, item, onDrop, onMouseEnter, onMouseLeave, onMouseMove }) => {
    const [isOver, setIsOver] = useState(false);
    
    const icons: Record<EquipmentSlot, React.ReactElement> = {
        head: <HelmetIcon />,
        body: <ArmorIcon />,
        hands: <DaggerIcon />,
        feet: <BootsIcon />,
        back: <BackpackIcon />,
        waist: <BeltIcon />,
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(false);
    };
    
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(false);
        onDrop(e, slot);
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        if (!item) return;
        const payload = { item, source: slot };
        e.dataTransfer.setData("application/json", JSON.stringify(payload));
    };

    const baseClasses = "h-16 w-16 bg-slate-700/50 rounded-lg flex items-center justify-center border-2 border-dashed transition-colors";
    const stateClasses = isOver ? "border-cyan-400 bg-slate-600" : item ? "border-slate-500" : "border-slate-600";
    const content = item ? (
      <div className="flex flex-col items-center text-center text-xs p-1">
        {getIconForItem(item)}
        <span className="truncate text-slate-300 w-full">{item.name}</span>
      </div>
    ) : (
      <div className="text-slate-500">{icons[slot]}</div>
    );

    return (
        <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            draggable={!!item}
            onDragStart={handleDragStart}
            onMouseEnter={(e) => onMouseEnter(e, item)}
            onMouseLeave={onMouseLeave}
            onMouseMove={onMouseMove}
            className={`${baseClasses} ${stateClasses} ${item ? 'cursor-grab' : ''}`}
        >
            {content}
        </div>
    );
};


const PlayerStats: React.FC<PlayerStatsProps> = ({ health, luck, inventory, equipment, actionResult, onEquipmentChange, selectedItem, onSelectItem }) => {
  const healthColor = health > 60 ? 'bg-green-500' : health > 30 ? 'bg-yellow-500' : 'bg-red-500';
  const isHealthLow = health <= 30;

  const [luckAnim, setLuckAnim] = useState('');
  const [inventoryAnim, setInventoryAnim] = useState('');
  const [tooltip, setTooltip] = useState<{ content: string; x: number; y: number } | null>(null);


  useEffect(() => {
    if (actionResult === 'success') {
      setLuckAnim('animate-flash-green');
      const timer = setTimeout(() => setLuckAnim(''), 800);
      return () => clearTimeout(timer);
    }
    if (actionResult === 'item_use') {
        setInventoryAnim('animate-flash-cyan');
        const timer = setTimeout(() => setInventoryAnim(''), 800);
        return () => clearTimeout(timer);
    }
  }, [actionResult]);

  // FIX: Updated handleMouseEnter to accept an Item object to resolve type errors
  // with EquipmentSlotComponent's onMouseEnter prop.
  const handleMouseEnter = (e: React.MouseEvent, item: Item | null) => {
    if (item?.description) {
      setTooltip({
        content: item.description,
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (tooltip) {
      setTooltip(t => t ? { ...t, x: e.clientX, y: e.clientY } : null);
    }
  };

  const handleEquipmentDrop = (e: React.DragEvent<HTMLDivElement>, targetSlot: EquipmentSlot) => {
    const payload = JSON.parse(e.dataTransfer.getData("application/json"));
    const { item, source } = payload;
    if (source === 'inventory' && item.type === 'equippable' && item.slot === targetSlot) {
        onEquipmentChange({ action: 'equip', item });
    }
  };

  const handleInventoryDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const payload = JSON.parse(e.dataTransfer.getData("application/json"));
    const { item, source } = payload;
    if (source !== 'inventory') {
        onEquipmentChange({ action: 'unequip', item, sourceSlot: source });
    }
  }

  const handleItemDragStart = (e: React.DragEvent<HTMLDivElement>, item: Item) => {
    const payload = { item, source: 'inventory' };
    e.dataTransfer.setData("application/json", JSON.stringify(payload));
  };
  
  const commonMouseEventHandlers = {
    onMouseLeave: handleMouseLeave,
    onMouseMove: handleMouseMove,
  };

  return (
    <div className="space-y-3 text-sm">
      <div className="grid grid-cols-2 gap-3">
        {/* Health and Luck bars */}
        <div className="bg-slate-900/50 p-2 rounded-md">
          <div className="flex items-center mb-1">
              <HealthIcon isLow={isHealthLow} />
              <span className="font-bold text-slate-300">生命值</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3.5"><div className={`h-3.5 rounded-full transition-all duration-500 ${healthColor}`} style={{ width: `${health}%` }}></div></div>
        </div>
        <div className={`bg-slate-900/50 p-2 rounded-md ${luckAnim}`}>
          <div className="flex items-center mb-1">
              <LuckIcon />
              <span className="font-bold text-slate-300">幸運值</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3.5"><div className="h-3.5 rounded-full transition-all duration-500 bg-green-400" style={{ width: `${luck}%` }}></div></div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {/* Equipment */}
        <div className="col-span-1 bg-slate-900/50 p-2 rounded-md flex flex-col items-center space-y-2">
            <EquipmentSlotComponent slot="head" item={equipment.head} onDrop={(e) => handleEquipmentDrop(e, 'head')} onMouseEnter={handleMouseEnter} {...commonMouseEventHandlers}/>
            <div className="flex gap-2">
                <EquipmentSlotComponent slot="hands" item={equipment.hands} onDrop={(e) => handleEquipmentDrop(e, 'hands')} onMouseEnter={handleMouseEnter} {...commonMouseEventHandlers}/>
                <EquipmentSlotComponent slot="body" item={equipment.body} onDrop={(e) => handleEquipmentDrop(e, 'body')} onMouseEnter={handleMouseEnter} {...commonMouseEventHandlers}/>
                <EquipmentSlotComponent slot="back" item={equipment.back} onDrop={(e) => handleEquipmentDrop(e, 'back')} onMouseEnter={handleMouseEnter} {...commonMouseEventHandlers}/>
            </div>
            <div className="flex gap-2">
                <EquipmentSlotComponent slot="waist" item={equipment.waist} onDrop={(e) => handleEquipmentDrop(e, 'waist')} onMouseEnter={handleMouseEnter} {...commonMouseEventHandlers}/>
                <EquipmentSlotComponent slot="feet" item={equipment.feet} onDrop={(e) => handleEquipmentDrop(e, 'feet')} onMouseEnter={handleMouseEnter} {...commonMouseEventHandlers}/>
            </div>
        </div>

        {/* Inventory */}
        <div 
          className={`col-span-2 bg-slate-900/50 p-3 rounded-md ${inventoryAnim}`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleInventoryDrop}
        >
          <div className="flex items-center mb-2">
              <InventoryIcon />
              <span className="font-bold text-slate-300 ml-2">物品欄</span>
          </div>
          <div className="flex flex-wrap gap-2 min-h-[10rem]">
            {inventory.length > 0 ? (
              inventory.map((item, index) => (
                <div
                  key={`${item.name}-${index}`}
                  draggable={item.type === 'equippable'}
                  onDragStart={(e) => handleItemDragStart(e, item)}
                  onClick={() => onSelectItem(selectedItem === item ? null : item)}
                  // FIX: Pass the full item object to handleMouseEnter instead of just the description.
                  onMouseEnter={(e) => handleMouseEnter(e, item)}
                  {...commonMouseEventHandlers}
                  className={`bg-slate-700 text-slate-300 h-fit pl-2 pr-3 py-1.5 rounded-full text-xs capitalize flex items-center transition-colors ${item.type === 'equippable' ? 'cursor-grab hover:bg-slate-600' : 'cursor-pointer hover:bg-slate-600'} ${selectedItem === item ? 'ring-2 ring-cyan-400' : ''}`}
                >
                  <div className="mr-1.5">{getIconForItem(item)}</div>
                  {item.name} {item.quantity && item.quantity > 1 ? `(x${item.quantity})` : ''}
                </div>
              ))
            ) : (
              <span className="text-slate-500 italic text-center w-full self-center">你的口袋空空如也。</span>
            )}
          </div>
        </div>
      </div>
       {tooltip && createPortal(
          <div
            className="fixed z-50 p-3 text-sm bg-slate-800/90 backdrop-blur-sm text-slate-200 border border-slate-600 rounded-lg shadow-lg max-w-xs transition-opacity duration-200"
            style={{
              left: tooltip.x + 15,
              top: tooltip.y + 15,
              pointerEvents: 'none',
            }}
          >
            <h4 className="font-bold text-cyan-400 mb-1 border-b border-slate-700 pb-1">物品描述</h4>
            <p className="mt-2 text-slate-300">{tooltip.content}</p>
          </div>,
          document.body
      )}
    </div>
  );
};

export default PlayerStats;