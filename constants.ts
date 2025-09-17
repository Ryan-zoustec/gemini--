import { GameState, PlayerClass } from './types';
import { Type } from '@google/genai';

export const PLAYER_CLASSES: PlayerClass[] = [
    {
        id: 'knight',
        name: '騎士',
        description: '一名忠誠的戰士，擅長近身戰鬥。你的榮譽就是你的生命，你的劍盾是你唯一的夥伴。',
        initialHealth: 120,
        initialLuck: 60,
        initialEquipment: {
            head: null,
            body: { name: "一件磨損的鏈甲", type: 'equippable', slot: 'body', description: "無數次戰鬥的痕跡刻印其上，提供了不錯的保護。" },
            hands: { name: "一把可靠的短劍", type: 'equippable', slot: 'hands', description: "雖然不華麗，但劍刃鋒利，值得信賴。" },
            feet: null,
            back: null,
            waist: null,
            companion: { name: "守護犬", type: 'equippable', slot: 'companion', description: "忠誠的夥伴，會在危險時提供幫助，並能為你抵擋一次致命的攻擊。" },
        },
        initialInventory: [
            { name: "一張來自國王的密令", type: 'quest', description: "一封用火漆封口的信件，催促你深入地穴調查異常。" }
        ],
        startingPrompt: "我是一名身披鏈甲的騎士，緊握著我的短劍，我的守護犬跟在我身邊，一同踏入了地穴。描述我眼前所見的景象。"
    },
    {
        id: 'rogue',
        name: '盜賊',
        description: '陰影中的潛行者，身手敏捷。你依靠智慧與速度生存，而非蠻力。',
        initialHealth: 90,
        initialLuck: 85,
        initialEquipment: {
            head: null,
            body: null,
            hands: { name: "一把淬毒的匕首", type: 'equippable', slot: 'hands', description: "刀刃上閃爍著詭異的綠光，輕微的劃傷都可能致命。" },
            feet: null,
            back: { name: "一個輕便的背包", type: 'equippable', slot: 'back', description: "內有許多小口袋，適合存放各種工具與戰利品。" },
            waist: null,
            companion: { name: "夜梟", type: 'equippable', slot: 'companion', description: "敏銳的偵察兵，能在黑暗中發現秘密，並能為你抵擋一次致命的攻擊。" },
        },
        initialInventory: [
            { name: "一套開鎖工具", type: 'quest', description: "幾根金屬絲和一個張力扳手，能打開大部分世俗的鎖。" },
            { name: "煙霧彈", type: 'consumable', quantity: 1, description: "製造混亂，掩護你的逃脫。" }
        ],
        startingPrompt: "我是一名潛伏在陰影中的盜賊，我的夜梟無聲地停在我的肩上，我們一同溜進了地穴的入口。描述我眼前所見的景象。"
    },
    {
        id: 'scholar',
        name: '學者',
        description: '知識的追尋者，痴迷於奧秘與禁忌。你用智慧解決問題，而非刀劍。',
        initialHealth: 80,
        initialLuck: 70,
        initialEquipment: {
            head: { name: "一副單片眼鏡", type: 'equippable', slot: 'head', description: "鏡片經過特殊處理，能讓你看到常人無法察覺的細節。" },
            body: null,
            hands: null,
            feet: null,
            back: null,
            waist: null,
            companion: { name: "元素精靈", type: 'equippable', slot: 'companion', description: "一個神秘的能量體，能感知魔法的流動，並能為你抵擋一次致命的攻擊。" },
        },
        initialInventory: [
            { name: "一本神秘的古籍", type: 'quest', description: "書頁上記載著難以辨認的符文與圖案，似乎蘊含著強大的力量。" },
            { name: "治療藥膏", type: 'consumable', quantity: 2, description: "塗抹在傷口上可以緩解疼痛，加速癒合。" }
        ],
        startingPrompt: "我是一名追尋禁忌知識的學者，藉著油燈微弱的光芒，一個元素精靈在我身旁漂浮，我們走進了地穴。描述我眼前所見的景象。"
    }
];


export const INITIAL_GAME_STATE: GameState = {
  story: "",
  health: 100,
  inventory: [],
  equipment: {
    head: null,
    body: null,
    hands: null,
    feet: null,
    back: null,
    waist: null,
    companion: null,
  },
  luck: 75,
  suggestedActions: [],
  gameOver: false,
  win: false,
  mood: 'ambient',
  actionResult: 'neutral',
  turnCount: 0,
};

export const SYSTEM_INSTRUCTION = `你是一位專業的文字冒險遊戲大師。你的目標是創造一個動態、引人入勝且富有挑戰性的黑暗奇幻冒險。使用者將提供他們目前的狀態和一個動作，你必須用結果來回應。你必須只回應一個符合所提供 schema 的有效 JSON 物件。不要在 JSON 物件之前或之後添加任何文字、markdown 或任何其他字元。所有輸出的故事和文字都必須是繁體中文。

你的職責:

### 核心故事職責

1.  **宏大敘事與神秘感:** 你的任務是編織一個史詩般的故事，充滿未知與神秘。
    *   **隱藏的核心情節:** 故事背後有一個宏大的核心情節和一個最終的巨大威脅。**不要直接告訴玩家這是什麼**。你必須透過環境、零碎的線索、神秘的遭遇和 NPC 的對話，讓玩家逐步拼湊出真相。
    *   **重要的角色:** 在冒險過程中，適時地引入一些重要的角色。他們可能是盟友，也可能是敵人，或者有著自己的秘密議程。這些角色是推動核心情節的關鍵。
    *   **情節推進:** 不要只被動地描述環境。要主動創造事件、道德困境和角色互動，引導玩家深入這個世界的秘密，推動一個連貫的故事情節向前發展。

2.  **故事推進:** 編寫一段引人入勝的敘述（2-4句話），描述玩家行動的結果。保持黑暗、神秘和沉浸式的基調。

### 遊戲機制管理

3.  **狀態管理:**
    *   **生命值:** 追蹤玩家的生命值。生命值會因危險而減少，因藥劑或休息而增加。玩家開始時有100點生命值。
    *   **物品系統:** 你必須管理一個複雜的物品系統。
        *   **物品類型:** 分為 'equippable', 'consumable', 'quest'。
        *   **消耗品與數量:** 'consumable' 物品可以有一個 'quantity' 屬性。當玩家使用一個消耗品時（例如「喝下治療藥水」），你必須將其 'quantity' 減 1。如果數量變為 0，則將該物品從 'inventory' 中移除。如果沒有 'quantity' 屬性，則預設為 1。
        *   **非消耗品:** 'quest' 或其他非消耗品在使用後不應從物品欄中移除，除非故事明確要求。
        *   **裝備管理:** 玩家的裝備狀態由客戶端即時管理，裝備或卸下物品**不消耗遊戲回合**。你的任務是根據玩家**目前**的裝備狀態來生成故事結果，而不是處理「裝備」或「卸下」指令。
    *   **行動與選定物品:** 玩家可以在執行動作前從物品欄中「選取」一個物品。提示中會明確指出「玩家同時使用了物品：[物品名稱]」。你**必須**考慮這個被選取物品的潛在用途或效果來決定玩家行動的結果。例如，在鎖著的門前使用鑰匙，或在探索時查閱地圖。
    *   **夥伴系統:** 玩家可能在一個特殊的 'companion' 裝備槽中擁有一個夥伴。
        *   **敘事整合:** 你應該偶爾將夥伴的存在和行動融入故事中。例如，「你的夜梟輕聲鳴叫，提醒你地板上有一塊鬆動的石頭。」
        *   **死亡規避:** 如果玩家的行動會導致其生命值降至 0 或以下，並且他們裝備了夥伴，你**必須**觸發夥伴的犧牲。
            *   不要將 \`health\` 設置為 0 和 \`game_over\` 設置為 true，而是必須將玩家的 \`health\` 設置為一個較低的值（例如 10）。
            *   你必須從 \`equipment.companion\` 槽中移除夥伴（將其設置為 null）。
            *   你生成的 'story' **必須**描述夥伴犧牲自己以拯救玩家的情景。
            *   這會消耗掉夥伴。遊戲不會結束。

4.  **幸運值機制:** 管理玩家的「幸運值」（0-100）。
    *   **影響:** 高幸運值帶來意想不到的好運（找到稀有物品、避開陷阱），低幸運值則可能導致災難性的失敗、裝備損壞或觸發不幸的事件。
    *   **動態事件:** 根據幸運值，不僅是微調數字，還要創造實質的「幸運」或「不幸」事件，例如一次幸運的暴擊，或是一次不幸的失足。
    *   **動態平衡:** 幸運值會動態變化：每次發生「幸運」事件時，玩家的幸運值**必須減少 1 點**，以表示好運用盡；每次發生「不幸」事件時，幸運值**必須增加 1 點**，以表示厄運後的補償。

5.  **處理脫序行為:** 如果玩家的行動完全脫離故事脈絡、不合邏輯或破壞奇幻設定（例如「打電話給朋友」），你**必須**嚴厲地處理。將此行動解釋為角色的一時糊塗或瘋狂，使其華麗地失敗，並**大幅降低玩家的幸運值**，同時故事沒有任何實質進展。

### 獎勵機制

6.  **豐富的獎勵:** 當玩家成功克服重大挑戰時（例如擊敗強大的敵人、解決複雜的謎題、或採取大膽且積極的行動），你**必須**提供豐厚的獎勵。
    *   獎勵形式可以是：
        *   **獨特的物品:** 一件強大或具有特殊描述的裝備/消耗品。為這些物品添加引人入勝的 'description'。
        *   **故事進展:** 一條關鍵線索、一個新的任務物品，或解鎖新的故事路徑。
        *   **能力提升:** 顯著提升玩家的 'health' 或 'luck'。
    *   你必須在故事敘述中生動地描述玩家獲得獎勵的過程。

### 遊戲節奏與情節轉折

7.  **主動的情節轉折:** 為了避免遊戲變得單調，你必須主動控制遊戲的節奏。當收到特殊的系統提示要求「情節轉折」時，你**必須**創造一個重大的事件。這可能包括：一個強大敵人的伏擊、一個意想不到的盟友出現、發現一個改變遊戲規則的秘密、一個環境的劇烈變化（例如洞穴坍塌），或是一個嚴峻的道德抉擇。這個事件應該顯著地改變當前的情勢。

### 輸出格式

8.  **氛圍判斷:** 根據場景氣氛選擇背景音樂。必須是 'ambient', 'action', 'tension', 'victory', 'defeat' 之一。
9.  **建議行動:** 提供三個建議行動。每個行動都必須是一個包含 'action'（1-5個字的行動描述）和 'hint'（對此行動潛在結果的簡短提示，例如「可能找到物品」、「可能遭遇危險」、「幸運事件機率高」等）的物件。
10. **行動結果分類:** 將玩家行動的結果分類為 'success', 'failure', 'item_use', 'neutral'。
11. **遊戲結束條件:** 玩家生命值降至 0 或達成特定故事條件時，設置 'game_over' 為 true。如果玩家有夥伴，則優先觸發夥伴犧牲，遊戲不會結束。
12. **勝利條件:** 當玩家達成最終目標時，將 'game_over' 和 'win' 都設置為 true。
`;

const ITEM_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING },
        type: { type: Type.STRING, enum: ['equippable', 'consumable', 'quest'] },
        description: { type: Type.STRING, description: "物品的描述或風味文字。" },
        slot: { type: Type.STRING, enum: ['head', 'body', 'hands', 'feet', 'back', 'waist', 'companion'], description: "僅適用於 'equippable' 類型" },
        quantity: { type: Type.INTEGER, description: "僅適用於 'consumable' 類型" }
    },
    required: ["name", "type"]
};

export const RESPONSE_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        story: {
            type: Type.STRING,
            description: "故事的下一部分敘述。保持在 2-4 句話。"
        },
        health: {
            type: Type.INTEGER,
            description: "玩家目前的生命值，從 0 到 100。"
        },
        inventory: {
            type: Type.ARRAY,
            items: ITEM_SCHEMA,
            description: "一個表示玩家目前物品欄的物件陣列。"
        },
        equipment: {
            type: Type.OBJECT,
            properties: {
                head: { oneOf: [ITEM_SCHEMA, { type: Type.NULL }] },
                body: { oneOf: [ITEM_SCHEMA, { type: Type.NULL }] },
                hands: { oneOf: [ITEM_SCHEMA, { type: Type.NULL }] },
                feet: { oneOf: [ITEM_SCHEMA, { type: Type.NULL }] },
                back: { oneOf: [ITEM_SCHEMA, { type: Type.NULL }] },
                waist: { oneOf: [ITEM_SCHEMA, { type: Type.NULL }] },
                companion: { oneOf: [ITEM_SCHEMA, { type: Type.NULL }] },
            },
            description: "一個表示玩家已裝備物品的物件。"
        },
        luck: {
            type: Type.INTEGER,
            description: "玩家目前的幸運值，從 0 到 100。"
        },
        suggested_actions: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    action: { type: Type.STRING, description: "建議的行動文字 (1-5個字)" },
                    hint: { type: Type.STRING, description: "關於此行動潛在結果的簡短提示" }
                },
                required: ["action", "hint"]
            },
            description: "一個包含三個建議玩家行動物件的陣列，每個物件都包含行動和提示。"
        },
        game_over: {
            type: Type.BOOLEAN,
            description: "如果玩家死亡或故事達到明確的結局，則設置為 true。"
        },
        win: {
            type: Type.BOOLEAN,
            description: "如果玩家成功完成冒險，則設置為 true。只有在 game_over 也為 true 時才應為 true。"
        },
        mood: {
            type: Type.STRING,
            description: "描述場景氛圍的標籤，用於選擇背景音樂。必須是 'ambient', 'action', 'tension', 'victory', 或 'defeat' 中的一個。"
        },
        action_result: {
            type: Type.STRING,
            description: "描述玩家行動結果的分類。必須是 'success', 'failure', 'item_use', 或 'neutral' 中的一個。"
        }
    },
    required: ["story", "health", "inventory", "equipment", "luck", "suggested_actions", "game_over", "win", "mood", "action_result"]
};