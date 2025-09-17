export type ItemType = 'equippable' | 'consumable' | 'quest';
export type EquipmentSlot = 'head' | 'body' | 'hands' | 'feet' | 'back' | 'waist' | 'companion';
export type Language = 'zh-TW' | 'en' | 'ja' | 'es' | 'ko';

export interface Item {
  name: string;
  type: ItemType;
  description?: string;
  // The slot this item can be equipped in. Optional, as consumables don't have a slot.
  slot?: EquipmentSlot;
  quantity?: number;
}

export interface EquipmentSlots {
  head: Item | null;
  body: Item | null;
  hands: Item | null;
  feet: Item | null;
  back: Item | null;
  waist: Item | null;
  companion: Item | null;
}

export interface SuggestedAction {
    action: string;
    hint: string;
}

export interface GameState {
  story: string;
  health: number;
  inventory: Item[];
  equipment: EquipmentSlots;
  luck: number;
  suggestedActions: SuggestedAction[];
  gameOver: boolean;
  win: boolean;
  mood: string;
  actionResult: string;
  turnCount: number;
  chapterTitle: string;
}

export interface GameUpdateResponse {
  story: string;
  health: number;
  inventory: Item[];
  equipment: EquipmentSlots;
  luck: number;
  suggested_actions: SuggestedAction[];
  game_over: boolean;
  win: boolean;
  mood:string;
  action_result: string;
  chapter_title: string;
}

export interface PlayerClass {
  id: string;
  name: string;
  description: string;
  initialHealth: number;
  initialLuck: number;
  initialEquipment: EquipmentSlots;
  initialInventory: Item[];
  startingPrompt: string;
}