import { GameState, PlayerClass, Language } from './types';

// =================================================================================
// INITIAL GAME STATE
// =================================================================================

export const INITIAL_GAME_STATE: GameState = {
  story: '',
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
  luck: 50,
  suggestedActions: [],
  gameOver: false,
  win: false,
  mood: 'neutral',
  actionResult: 'neutral',
  turnCount: 0,
  chapterTitle: '',
};


// =================================================================================
// PLAYER CLASSES
// =================================================================================

const baseClasses: Omit<PlayerClass, 'name' | 'description' | 'startingPrompt'> = {
    id: '',
    initialHealth: 0,
    initialLuck: 0,
    initialEquipment: { head: null, body: null, hands: null, feet: null, back: null, waist: null, companion: null },
    initialInventory: [],
};

const KNIGHT_CLASS_DATA: Record<Language, Partial<PlayerClass>> = {
    'en': { name: 'Knight', description: 'A valiant warrior sworn to an ancient oath. High health and sturdy armor, but perhaps lacking in guile.', startingPrompt: 'You are a Knight, awakened in a crypt. Clad in your armor and gripping your longsword, you feel a sense of duty to cleanse this place of evil. Your first instinct is to find a way out, assessing your surroundings with a trained eye.'},
    'zh-TW': { name: '騎士', description: '一位宣誓遵守古老誓言的英勇戰士。生命值高，盔甲堅固，但可能缺乏詭計。', startingPrompt: '你是一名騎士，在地窖中醒來。身穿盔甲，手握長劍，你感到有責任清除此地的邪惡。你的第一直覺是找到出路，並以訓練有素的眼光評估周遭環境。'},
    'ja': { name: 'ナイト', description: '古代の誓いに縛られた勇敢な戦士。高い体力と頑丈な鎧を誇るが、策略には欠けるかもしれない。', startingPrompt: 'あなたはナイトであり、地下聖堂で目覚めた。鎧をまとい、ロングソードを握りしめ、この場所を悪から浄化する義務感を感じている。最初の本能は、訓練された目で周囲を評価し、出口を見つけることだ。'},
    'es': { name: 'Caballero', description: 'Un valiente guerrero bajo un antiguo juramento. Alta salud y armadura robusta, pero quizás carente de astucia.', startingPrompt: 'Eres un Caballero, despertado en una cripta. Vestido con tu armadura y empuñando tu espada larga, sientes el deber de limpiar este lugar del mal. Tu primer instinto es encontrar una salida, evaluando tu entorno con un ojo entrenado.'},
    'ko': { name: '기사', description: '고대의 맹세에 묶인 용맹한 전사. 높은 체력과 튼튼한 갑옷을 가졌지만, 교활함은 부족할 수 있습니다.', startingPrompt: '당신은 기사이며, 지하실에서 깨어났습니다. 갑옷을 입고 장검을 쥔 채, 이곳의 악을 정화해야 한다는 의무감을 느낍니다. 당신의 첫 본능은 훈련된 눈으로 주변을 살피며 출구를 찾는 것입니다.'},
};

const ROGUE_CLASS_DATA: Record<Language, Partial<PlayerClass>> = {
    'en': { name: 'Rogue', description: 'A master of shadows and subtlety. High luck and a penchant for finding hidden things, but frail in direct combat.', startingPrompt: 'You are a Rogue, awakened in a crypt. Your light leather armor makes no sound as you rise. You feel more comfortable in the shadows, and your first thought is to scout the area for traps and secret passages.'},
    'zh-TW': { name: '盜賊', description: '一位陰影與詭詐的大師。運氣高，善於發現隱藏的事物，但在正面戰鬥中很脆弱。', startingPrompt: '你是一名盜賊，在地窖中醒來。你起身時，身上的輕皮甲沒有發出任何聲音。你覺得在陰影中更自在，你的第一個念頭是偵察該區域是否有陷阱和秘密通道。'},
    'ja': { name: '盗賊', description: '影と狡猾さの達人。高い幸運と隠されたものを見つける才能を持つが、直接戦闘では脆い。', startingPrompt: 'あなたは盗賊であり、地下聖堂で目覚めた。立ち上がっても、軽い革の鎧は音を立てない。あなたは影の中にいる方が心地よく、最初の考えは罠や秘密の通路がないか、その地域を偵察することだ。'},
    'es': { name: 'Pícaro', description: 'Un maestro de las sombras y la sutileza. Alta suerte y una inclinación por encontrar cosas ocultas, pero frágil en combate directo.', startingPrompt: 'Eres un Pícaro, despertado en una cripta. Tu ligera armadura de cuero no hace ruido mientras te levantas. Te sientes más cómodo en las sombras, y tu primer pensamiento es explorar el área en busca de trampas y pasadizos secretos.'},
    'ko': { name: '도적', description: '그림자와 재치의 대가. 높은 행운과 숨겨진 것을 찾는 재능이 있지만, 정면 전투에서는 약합니다.', startingPrompt: '당신은 도적이며, 지하실에서 깨어났습니다. 가벼운 가죽 갑옷은 당신이 일어설 때 소리를 내지 않습니다. 당신은 그림자 속에서 더 편안함을 느끼며, 첫 생각은 함정이나 비밀 통로를 찾기 위해 지역을 정찰하는 것입니다.'},
};

const SCHOLAR_CLASS_DATA: Record<Language, Partial<PlayerClass>> = {
    'en': { name: 'Scholar', description: 'A seeker of forgotten lore and ancient secrets. Can decipher cryptic texts and identify magical artifacts, but physically weak.', startingPrompt: 'You are a Scholar, awakened in a crypt. Your robes are dusty, and your spectacles are perched on your nose. The strange runes on the walls immediately catch your attention, and you are driven by a thirst for knowledge to understand this place.'},
    'zh-TW': { name: '學者', description: '一位尋求被遺忘的知識和古老秘密的人。能夠破譯神秘的文本和識別魔法物品，但身體虛弱。', startingPrompt: '你是一名學者，在地窖中醒來。你的長袍滿是灰塵，眼鏡架在鼻子上。牆上奇怪的符文立刻吸引了你的注意，你被求知欲驅使，渴望了解這個地方。'},
    'ja': { name: '学者', description: '忘れられた伝承と古代の秘密の探求者。不可解なテキストを解読し、魔法のアーティファクトを識別できるが、物理的には弱い。', startingPrompt: 'あなたは学者であり、地下聖堂で目覚めた。ローブは埃っぽく、眼鏡は鼻にかかっている。壁の奇妙なルーン文字がすぐにあなたの注意を引き、あなたはこの場所を理解するための知識への渇望に駆られている。'},
    'es': { name: 'Erudito', description: 'Un buscador de conocimiento olvidado y secretos antiguos. Puede descifrar textos crípticos e identificar artefactos mágicos, pero es físicamente débil.', startingPrompt: 'Eres un Erudito, despertado en una cripta. Tus túnicas están polvorientas y tus gafas están sobre tu nariz. Las extrañas runas en las paredes captan inmediatamente tu atención, y te impulsa una sed de conocimiento por entender este lugar.'},
    'ko': { name: '학자', description: '잊혀진 지식과 고대의 비밀을 찾는 사람. 비밀스러운 글을 해독하고 마법 유물을 식별할 수 있지만, 신체적으로는 약합니다.', startingPrompt: '당신은 학자이며, 지하실에서 깨어났습니다. 당신의 로브는 먼지투성이이고, 안경은 코에 걸쳐 있습니다. 벽에 있는 이상한 룬 문자가 즉시 당신의 주의를 끌었고, 당신은 이곳을 이해하려는 지식에 대한 갈증에 이끌립니다.'},
};

const TRICKSTER_CLASS_DATA: Record<Language, Partial<PlayerClass>> = {
    'en': { name: 'Trickster', description: 'A wild card, a master of chaos. Bends reality with unpredictable luck. (Unlocked by winning the game once).', startingPrompt: 'You are a Trickster, awakened in a crypt. The universe seems to laugh with you. You don\'t know how you got here, but you know it\'s going to be fun. Your first instinct is to poke something you probably shouldn\'t.'},
    'zh-TW': { name: '詐欺師', description: '一張王牌，一位混亂的大師。以不可預測的運氣扭曲現實。（贏得一次遊戲後解鎖）。', startingPrompt: '你是一名詐欺師，在地窖中醒來。宇宙似乎與你一同歡笑。你不知道自己是怎麼來到這裡的，但你知道這將會很有趣。你的第一直覺是去戳一個你可能不該戳的東西。'},
    'ja': { name: 'トリックスター', description: '予測不可能な運で現実を曲げる、混沌の達人。（一度ゲームに勝利するとアンロックされます）。', startingPrompt: 'あなたはトリックスターであり、地下聖堂で目覚めた。宇宙があなたと共に笑っているようだ。どうやってここに来たのかはわからないが、楽しくなることはわかっている。あなたの最初の本能は、おそらく触れるべきではない何かをつつくことだ。'},
    'es': { name: 'Embaucador', description: 'Un comodín, un maestro del caos. Doblega la realidad con una suerte impredecible. (Se desbloquea al ganar el juego una vez).', startingPrompt: 'Eres un Embaucador, despertado en una cripta. El universo parece reír contigo. No sabes cómo llegaste aquí, pero sabes que va a ser divertido. Tu primer instinto es tocar algo que probablemente no deberías.'},
    'ko': { name: '사기꾼', description: '혼돈의 대가, 와일드카드. 예측할 수 없는 행운으로 현실을 왜곡합니다. (게임에서 한 번 승리하면 잠금 해제됩니다).', startingPrompt: '당신은 사기꾼이며, 지하실에서 깨어났습니다. 우주가 당신과 함께 웃는 것 같습니다. 어떻게 여기에 왔는지는 모르지만, 재미있을 것이라는 건 압니다. 당신의 첫 본능은 아마 건드리면 안 될 무언가를 찔러보는 것입니다.'},
};


const createClass = (id: string, baseData: Record<Language, Partial<PlayerClass>>, overrides: Partial<PlayerClass>): Record<Language, PlayerClass> => {
    const classes: Record<string, PlayerClass> = {};
    for (const lang in baseData) {
        classes[lang] = {
            ...baseClasses,
            ...overrides,
            ...baseData[lang as Language],
            id,
        } as PlayerClass;
    }
    return classes as Record<Language, PlayerClass>;
};

const ALL_PLAYER_CLASSES_BY_LANG = {
    knight: createClass('knight', KNIGHT_CLASS_DATA, {
        initialHealth: 100,
        initialLuck: 30,
        initialEquipment: { head: { name: 'Iron Helm', type: 'equippable', slot: 'head', description: 'A sturdy helmet that has seen many battles.' }, body: { name: 'Chainmail Armor', type: 'equippable', slot: 'body', description: 'Standard issue chainmail. Reliable protection.' }, hands: { name: 'Longsword', type: 'equippable', slot: 'hands', description: 'A well-balanced and sharp longsword.' }, feet: null, back: null, waist: null, companion: null },
        initialInventory: [{ name: 'Healing Salve', type: 'consumable', quantity: 1, description: 'A soothing balm that restores a small amount of health.' }]
    }),
    rogue: createClass('rogue', ROGUE_CLASS_DATA, {
        initialHealth: 70,
        initialLuck: 80,
        initialEquipment: { head: null, body: { name: 'Leather Jerkin', type: 'equippable', slot: 'body', description: 'Light armor that favors agility over defense.' }, hands: { name: 'Twin Daggers', type: 'equippable', slot: 'hands', description: 'A pair of sharp, easily concealed daggers.' }, feet: { name: 'Soft Boots', type: 'equippable', slot: 'feet', description: 'Allows for silent movement.'}, back: null, waist: null, companion: null },
        initialInventory: [{ name: 'Lockpick', type: 'quest', quantity: 1, description: 'A simple tool for bypassing simple locks.' }]
    }),
    scholar: createClass('scholar', SCHOLAR_CLASS_DATA, {
        initialHealth: 60,
        initialLuck: 60,
        initialEquipment: { head: null, body: { name: 'Dusty Robes', type: 'equippable', slot: 'body', description: 'Simple robes worn by students of the arcane.' }, hands: null, feet: null, back: null, waist: null, companion: null },
        initialInventory: [{ name: 'Ancient Tome', type: 'quest', description: 'A heavy book filled with cryptic writings. It seems to hum with a faint energy.' }, { name: 'Mana Potion', type: 'consumable', quantity: 1, description: 'A swirling blue liquid that restores focus and magical energy.' }]
    }),
};

export const TRICKSTER_CLASS = createClass('trickster', TRICKSTER_CLASS_DATA, {
    initialHealth: 88,
    initialLuck: 88,
    initialEquipment: { head: null, body: null, hands: null, feet: null, back: null, waist: null, companion: null },
    initialInventory: [{ name: 'Deck of Illusions', type: 'consumable', quantity: 5, description: 'A card that creates a random, dazzling illusion when thrown.' }]
});

export const ALL_PLAYER_CLASSES: Record<Language, PlayerClass[]> = {
    'en': [ALL_PLAYER_CLASSES_BY_LANG.knight.en, ALL_PLAYER_CLASSES_BY_LANG.rogue.en, ALL_PLAYER_CLASSES_BY_LANG.scholar.en],
    'zh-TW': [ALL_PLAYER_CLASSES_BY_LANG.knight['zh-TW'], ALL_PLAYER_CLASSES_BY_LANG.rogue['zh-TW'], ALL_PLAYER_CLASSES_BY_LANG.scholar['zh-TW']],
    'ja': [ALL_PLAYER_CLASSES_BY_LANG.knight.ja, ALL_PLAYER_CLASSES_BY_LANG.rogue.ja, ALL_PLAYER_CLASSES_BY_LANG.scholar.ja],
    'es': [ALL_PLAYER_CLASSES_BY_LANG.knight.es, ALL_PLAYER_CLASSES_BY_LANG.rogue.es, ALL_PLAYER_CLASSES_BY_LANG.scholar.es],
    'ko': [ALL_PLAYER_CLASSES_BY_LANG.knight.ko, ALL_PLAYER_CLASSES_BY_LANG.rogue.ko, ALL_PLAYER_CLASSES_BY_LANG.scholar.ko],
};


// =================================================================================
// GEMINI API CONFIGURATION
// =================================================================================

export const SYSTEM_INSTRUCTION = (language: Language, playerClass: PlayerClass): string => `
You are the Dungeon Master for a dark fantasy text-based RPG called "Whispering Crypt".
Your goal is to create a dynamic, engaging, and challenging narrative experience.
The player is a ${playerClass.name}.
The game is turn-based. You will be given the current game state and the player's action.
You must respond with a JSON object that updates the game state.

**RESPONSE GUIDELINES:**
1.  **Language:** The entire response, including all text fields, MUST be in the specified language: ${language}.
2.  **Story:** Write a compelling, descriptive paragraph (3-5 sentences) about what happens next. The story should be a direct consequence of the player's action. Keep the tone dark, mysterious, and atmospheric.
3.  **Health:** Adjust the player's health based on the outcome. Damage should be meaningful but not arbitrary. Reward clever actions.
4.  **Luck:** Luck can be slightly increased for clever or fortunate outcomes, or decreased for clumsy or unfortunate ones. Changes should be small (+/- 5-10).
5.  **Inventory/Equipment:** Add, remove, or update items in the inventory or equipment. Be specific. If the player uses a consumable, decrement its quantity or remove it.
6.  **Suggested Actions:** Provide 3 distinct, creative, and interesting actions the player can take next. Each action must have a short, evocative hint. Actions should be concise (1-3 words).
7.  **Game Over/Win:** Set 'game_over' to true if the player's health reaches 0 or they meet an untimely end. Set 'win' to true only if they complete the final objective of the game (which you will invent).
8.  **Mood:** Set a mood (e.g., 'tense', 'eerie', 'combat', 'discovery') that reflects the current situation. This helps guide potential music or UI changes.
9.  **Action Result:** Categorize the action's outcome. 'success' for good results, 'failure' for bad, 'neutral' for simple progress, 'item_use' when an item is central to the action.
10. **Chapter Title:** Update the chapter title to reflect major story milestones or new areas. Keep it short and evocative.

**TONE & STYLE:**
-   **Dark & Gritty:** The world is dangerous. Describe failures and successes with equal detail.
-   **Show, Don't Tell:** Instead of saying "the room is scary," describe the "skittering sounds in the walls and the smell of decay."
-   **Player Agency:** The player's choices must matter. The story should branch and react. Avoid railroading.
-   **Consistency:** Maintain continuity with the previous story, inventory, and player class abilities. A Knight is strong, a Scholar is knowledgeable, a Rogue is nimble.

The player's fate is in your hands. Make it a memorable journey.
`;

const itemSchema = {
    type: 'OBJECT',
    properties: {
        name: { type: 'STRING' },
        type: { type: 'STRING', enum: ['equippable', 'consumable', 'quest'] },
        description: { type: 'STRING', nullable: true },
        slot: { type: 'STRING', enum: ['head', 'body', 'hands', 'feet', 'back', 'waist', 'companion'], nullable: true },
        quantity: { type: 'INTEGER', nullable: true },
    },
    required: ['name', 'type']
};

const equipmentSlotsSchema = {
    type: 'OBJECT',
    properties: {
        head: { ...itemSchema, nullable: true },
        body: { ...itemSchema, nullable: true },
        hands: { ...itemSchema, nullable: true },
        feet: { ...itemSchema, nullable: true },
        back: { ...itemSchema, nullable: true },
        waist: { ...itemSchema, nullable: true },
        companion: { ...itemSchema, nullable: true },
    }
};

const suggestedActionSchema = {
    type: 'OBJECT',
    properties: {
        action: { type: 'STRING', description: "A short, 1-3 word action the player can take." },
        hint: { type: 'STRING', description: "A brief, evocative hint about the action's potential outcome." },
    },
    required: ['action', 'hint']
};

const responseSchemaBase = {
    type: 'OBJECT',
    properties: {
        story: { type: 'STRING', description: "The next part of the story." },
        health: { type: 'INTEGER', description: "The player's new health value." },
        luck: { type: 'INTEGER', description: "The player's new luck value." },
        inventory: {
            type: 'ARRAY',
            items: itemSchema
        },
        equipment: equipmentSlotsSchema,
        suggested_actions: {
            type: 'ARRAY',
            items: suggestedActionSchema,
            description: "Exactly 3 suggested actions for the player."
        },
        game_over: { type: 'BOOLEAN', description: "Set to true if the player has died." },
        win: { type: 'BOOLEAN', description: "Set to true if the player has won the game." },
        mood: { type: 'STRING', description: "The current mood or atmosphere of the scene (e.g., 'tense', 'eerie', 'combat')." },
        action_result: { type: 'STRING', description: "The result of the player's action ('success', 'failure', 'neutral', 'item_use')." },
        chapter_title: { type: 'STRING', description: "The current chapter or area name." },
    },
    required: [
        'story', 'health', 'luck', 'inventory', 'equipment', 'suggested_actions', 'game_over', 'win', 'mood', 'action_result', 'chapter_title'
    ]
};

export const RESPONSE_SCHEMAS: Record<Language, any> = {
    'en': responseSchemaBase,
    'zh-TW': responseSchemaBase,
    'ja': responseSchemaBase,
    'es': responseSchemaBase,
    'ko': responseSchemaBase,
};


// =================================================================================
// UI TRANSLATIONS
// =================================================================================

const translations: Record<Language, Record<string, string>> = {
    'en': {
        adventureTitle: "Whispering Crypt",
        adventureSubtitle: "An AI-Powered Text Adventure",
        introText: "You awaken in a cold, damp crypt. Your memory is a blur, but a sense of purpose urges you forward. Carve your own path, make choices that matter, and uncover the secrets that lie within.",
        startAdventure: "Start Your Adventure",
        loadGame: "Load a Saved Game",
        loadError: "Failed to load save file. It may be corrupted or in an invalid format.",
        enableNarration: "Enable Narration",
        voiceSpeed: "Narration Speed",
        chooseOrigin: "Choose Your Origin",
        originDescription: "Your past shapes your present. Who were you before you found yourself in this forsaken place?",
        startingEquipment: "Starting Equipment",
        embarkJourney: "Embark on Your Journey",
        buildingWorld: "The ancient stones whisper your story into existence...",
        whatToDo: "What will you do?",
        submit: "Submit",
        waitingForFate: "Awaiting fate's decree...",
        saveGame: "Save Game",
        generateIllustration: "Generate Illustration",
        generatingIllustration: "Generating Illustration...",
        illustrationPromptStyle: "Fantasy digital art, dark and atmospheric, detailed.",
        illustrationError: "The spirits failed to conjure an image. Please try again.",
        health: "Health",
        luck: "Luck",
        inventory: "Inventory",
        yourPocketsAreEmpty: "Your pockets are empty.",
        itemDescription: "Item Description",
        victoryTitle: "Victory!",
        victoryText: "You have overcome the challenges of the Whispering Crypt and emerged victorious. Your legend will be told for ages to come.",
        defeatTitle: "You Have Fallen",
        defeatText: "Your journey ends here, another soul claimed by the Whispering Crypt. The darkness consumes you, and your story is lost to time.",
        playAgain: "Play Again?",
        slot_head: "Head",
        slot_body: "Body",
        slot_hands: "Hands",
        slot_feet: "Feet",
        slot_back: "Back",
        slot_waist: "Waist",
        slot_companion: "Companion",
    },
    'zh-TW': {
        adventureTitle: "低語地窖",
        adventureSubtitle: "AI驅動的文字冒險",
        introText: "你在一個冰冷、潮濕的地窖中醒來。你的記憶模糊不清，但一股使命感催促你前進。開創自己的道路，做出關鍵的選擇，揭開深藏於此的秘密。",
        startAdventure: "開始你的冒險",
        loadGame: "讀取遊戲存檔",
        loadError: "讀取存檔失敗。檔案可能已損壞或格式無效。",
        enableNarration: "啟用語音旁白",
        voiceSpeed: "旁白語速",
        chooseOrigin: "選擇你的出身",
        originDescription: "你的過去塑造了你的現在。在你發現自己身處這個被遺忘之地前，你是誰？",
        startingEquipment: "初始裝備",
        embarkJourney: "踏上旅程",
        buildingWorld: "古老的石頭正低語著你的故事...",
        whatToDo: "你該怎麼辦？",
        submit: "提交",
        waitingForFate: "等待命運的裁決...",
        saveGame: "儲存遊戲",
        generateIllustration: "生成場景插圖",
        generatingIllustration: "正在生成插圖...",
        illustrationPromptStyle: "奇幻數位藝術，黑暗氛圍，細節豐富。",
        illustrationError: "靈魂無法召喚圖像。請再試一次。",
        health: "生命值",
        luck: "幸運值",
        inventory: "物品欄",
        yourPocketsAreEmpty: "你的口袋空空如也。",
        itemDescription: "物品說明",
        victoryTitle: "勝利！",
        victoryText: "你已克服低語地窖的挑戰並獲得勝利。你的傳奇將被世人傳頌。",
        defeatTitle: "你已倒下",
        defeatText: "你的旅程到此為止，又一個靈魂被低語地窖吞噬。黑暗吞噬了你，你的故事也隨時間消逝。",
        playAgain: "再玩一次？",
        slot_head: "頭部",
        slot_body: "身體",
        slot_hands: "手部",
        slot_feet: "腳部",
        slot_back: "背部",
        slot_waist: "腰部",
        slot_companion: "夥伴",
    },
    'ja': {
        adventureTitle: "囁きの地下聖堂",
        adventureSubtitle: "AI搭載テキストアドベンチャー",
        introText: "冷たく湿った地下聖堂で目が覚める。記憶は曖昧だが、使命感があなたを前へと突き動かす。自らの道を切り開き、重要な選択を下し、内に秘められた謎を解き明かせ。",
        startAdventure: "冒険を始める",
        loadGame: "セーブデータをロード",
        loadError: "セーブデータのロードに失敗しました。ファイルが破損しているか、形式が無効です。",
        enableNarration: "ナレーションを有効にする",
        voiceSpeed: "ナレーション速度",
        chooseOrigin: "出自を選ぶ",
        originDescription: "あなたの過去が現在を形作る。この見捨てられた場所に来る前、あなたは何者だったのか？",
        startingEquipment: "初期装備",
        embarkJourney: "旅に出る",
        buildingWorld: "古代の石があなたの物語を紡ぎ始めている...",
        whatToDo: "どうする？",
        submit: "決定",
        waitingForFate: "運命の裁定を待っている...",
        saveGame: "ゲームを保存",
        generateIllustration: "場面のイラストを生成",
        generatingIllustration: "イラストを生成中...",
        illustrationPromptStyle: "ファンタジーデジタルアート、ダークで雰囲気のある、詳細な。",
        illustrationError: "霊がイメージを呼び出せませんでした。もう一度お試しください。",
        health: "体力",
        luck: "幸運",
        inventory: "持ち物",
        yourPocketsAreEmpty: "ポケットは空だ。",
        itemDescription: "アイテム説明",
        victoryTitle: "勝利！",
        victoryText: "あなたは囁きの地下聖堂の試練を乗り越え、勝利を収めました。あなたの伝説は末永く語り継がれるでしょう。",
        defeatTitle: "あなたは倒れた",
        defeatText: "あなたの旅はここで終わり、また一つ、魂が囁きの地下聖堂に囚われた。闇があなたを飲み込み、あなたの物語は時の彼方へと消え去る。",
        playAgain: "もう一度プレイしますか？",
        slot_head: "頭",
        slot_body: "胴",
        slot_hands: "手",
        slot_feet: "足",
        slot_back: "背中",
        slot_waist: "腰",
        slot_companion: "相棒",
    },
    'es': {
        adventureTitle: "Cripta Susurrante",
        adventureSubtitle: "Una Aventura de Texto Impulsada por IA",
        introText: "Despiertas en una cripta fría y húmeda. Tu memoria es un borrón, pero un sentido de propósito te impulsa hacia adelante. Forja tu propio camino, toma decisiones que importan y descubre los secretos que yacen dentro.",
        startAdventure: "Comienza Tu Aventura",
        loadGame: "Cargar Partida Guardada",
        loadError: "No se pudo cargar el archivo de guardado. Puede estar corrupto o en un formato no válido.",
        enableNarration: "Habilitar Narración",
        voiceSpeed: "Velocidad de Narración",
        chooseOrigin: "Elige Tu Origen",
        originDescription: "Tu pasado moldea tu presente. ¿Quién eras antes de encontrarte en este lugar desolado?",
        startingEquipment: "Equipo Inicial",
        embarkJourney: "Emprender el Viaje",
        buildingWorld: "Las antiguas piedras susurran tu historia a la existencia...",
        whatToDo: "¿Qué harás?",
        submit: "Enviar",
        waitingForFate: "Esperando el decreto del destino...",
        saveGame: "Guardar Partida",
        generateIllustration: "Generar Ilustración",
        generatingIllustration: "Generando ilustración...",
        illustrationPromptStyle: "Arte digital de fantasía, oscuro y atmosférico, detallado.",
        illustrationError: "Los espíritus no lograron conjurar una imagen. Por favor, inténtalo de nuevo.",
        health: "Salud",
        luck: "Suerte",
        inventory: "Inventario",
        yourPocketsAreEmpty: "Tus bolsillos están vacíos.",
        itemDescription: "Descripción del Objeto",
        victoryTitle: "¡Victoria!",
        victoryText: "Has superado los desafíos de la Cripta Susurrante y has salido victorioso. Tu leyenda será contada por los siglos de los siglos.",
        defeatTitle: "Has Caído",
        defeatText: "Tu viaje termina aquí, otra alma reclamada por la Cripta Susurrante. La oscuridad te consume, y tu historia se pierde en el tiempo.",
        playAgain: "¿Jugar de Nuevo?",
        slot_head: "Cabeza",
        slot_body: "Cuerpo",
        slot_hands: "Manos",
        slot_feet: "Pies",
        slot_back: "Espalda",
        slot_waist: "Cintura",
        slot_companion: "Compañero",
    },
    'ko': {
        adventureTitle: "속삭이는 지하실",
        adventureSubtitle: "AI 기반 텍스트 어드벤처",
        introText: "차갑고 축축한 지하실에서 깨어납니다. 기억은 흐릿하지만, 목적 의식이 당신을 앞으로 나아가게 합니다. 자신만의 길을 개척하고, 중요한 선택을 하며, 그 안에 숨겨진 비밀을 밝혀내세요.",
        startAdventure: "모험 시작하기",
        loadGame: "저장된 게임 불러오기",
        loadError: "저장 파일을 불러오는 데 실패했습니다. 파일이 손상되었거나 형식이 잘못되었을 수 있습니다.",
        enableNarration: "내레이션 활성화",
        voiceSpeed: "내레이션 속도",
        chooseOrigin: "당신의 기원을 선택하세요",
        originDescription: "당신의 과거가 현재를 만듭니다. 이 버려진 장소에서 자신을 발견하기 전, 당신은 누구였습니까?",
        startingEquipment: "시작 장비",
        embarkJourney: "여정 시작",
        buildingWorld: "고대의 돌들이 당신의 이야기를 속삭이며 생명을 불어넣고 있습니다...",
        whatToDo: "무엇을 하시겠습니까?",
        submit: "제출",
        waitingForFate: "운명의 판결을 기다리는 중...",
        saveGame: "게임 저장",
        generateIllustration: "장면 삽화 생성",
        generatingIllustration: "삽화 생성 중...",
        illustrationPromptStyle: "판타지 디지털 아트, 어둡고 분위기 있는, 상세한.",
        illustrationError: "영혼들이 이미지를 만들어내지 못했습니다. 다시 시도해 주세요.",
        health: "체력",
        luck: "행운",
        inventory: "인벤토리",
        yourPocketsAreEmpty: "주머니가 비어 있습니다.",
        itemDescription: "아이템 설명",
        victoryTitle: "승리!",
        victoryText: "당신은 속삭이는 지하실의 도전을 극복하고 승리했습니다. 당신의 전설은 오랫동안 전해질 것입니다.",
        defeatTitle: "당신은 쓰러졌습니다",
        defeatText: "당신의 여정은 여기서 끝납니다. 속삭이는 지하실에 또 다른 영혼이 희생되었습니다. 어둠이 당신을 삼키고, 당신의 이야기는 시간 속으로 사라집니다.",
        playAgain: "다시 플레이하시겠습니까?",
        slot_head: "머리",
        slot_body: "몸통",
        slot_hands: "손",
        slot_feet: "발",
        slot_back: "등",
        slot_waist: "허리",
        slot_companion: "동료",
    },
};

export const t = (lang: Language, key: string): string => {
    return translations[lang]?.[key] || translations['en'][key] || key;
};
