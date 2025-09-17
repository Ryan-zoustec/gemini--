import { GameState, PlayerClass, Language } from './types';

// Translation dictionary
const translations: Record<Language, Record<string, string>> = {
  'en': {
    adventureTitle: 'Whispering Crypt',
    adventureSubtitle: 'An AI-Powered Text Adventure',
    introText: 'You awaken in a cold, dark crypt with no memory of how you arrived. Your fate is unwritten, your choices matter. Can you survive the secrets of the Whispering Crypt?',
    loadError: 'Failed to load save file. It may be corrupted or in an invalid format.',
    enableNarration: 'Enable Voice Narration',
    voiceSpeed: 'Voice Speed',
    startAdventure: 'Start Your Adventure',
    loadGame: 'Load Saved Game',
    illustrationPromptStyle: 'Dark fantasy digital painting, atmospheric, cinematic lighting, high detail.',
    illustrationError: 'The artist spirits are busy. Could not generate an illustration.',
    generatingIllustration: 'Generating Illustration...',
    generateIllustration: 'Generate Illustration',
    buildingWorld: 'The spirits are building your world...',
    waitingForFate: 'Awaiting fate\'s decision...',
    whatToDo: 'What do you do next?',
    submit: 'Submit',
    saveGame: 'Save Game',
    victoryTitle: 'Victory!',
    defeatTitle: 'You Have Perished',
    victoryText: 'You have conquered the Whispering Crypt, its secrets are now yours. Your legend will be told for ages to come.',
    defeatText: 'Your journey ends here. The Whispering Crypt claims another soul. The darkness consumes you.',
    playAgain: 'Play Again',
    slot_head: 'Head',
    slot_body: 'Body',
    slot_hands: 'Hands',
    slot_feet: 'Feet',
    slot_back: 'Back',
    slot_waist: 'Waist',
    slot_companion: 'Companion',
    health: 'Health',
    luck: 'Luck',
    inventory: 'Inventory',
    yourPocketsAreEmpty: 'Your pockets are empty.',
    itemDescription: 'Item Description',
    chooseOrigin: 'Choose Your Origin',
    originDescription: 'Before the crypt, you were someone. This choice will shape your abilities and your starting path.',
    startingEquipment: 'Starting Equipment',
    embarkJourney: 'Embark on Your Journey',
  },
  'zh-TW': {
    adventureTitle: '低語地窖',
    adventureSubtitle: 'AI驅動的文字冒險',
    introText: '你在一個冰冷、黑暗的地窖中醒來，不記得自己是如何到達的。你的命運尚未書寫，你的選擇至關重要。你能在這低語地窖的秘密中倖存下來嗎？',
    loadError: '載入存檔失敗。檔案可能已損壞或格式無效。',
    enableNarration: '啟用語音旁白',
    voiceSpeed: '語音速度',
    startAdventure: '開始你的冒險',
    loadGame: '載入遊戲存檔',
    illustrationPromptStyle: '黑暗奇幻數位繪畫，氛圍感，電影級光影，高細節。',
    illustrationError: '藝術之魂正忙。無法生成插圖。',
    generatingIllustration: '正在生成插圖...',
    generateIllustration: '生成插圖',
    buildingWorld: '靈魂正在構築你的世界...',
    waitingForFate: '等待命運的決定...',
    whatToDo: '你接下來要做什麼？',
    submit: '提交',
    saveGame: '儲存遊戲',
    victoryTitle: '勝利！',
    defeatTitle: '你已殞命',
    victoryText: '你征服了低語地窖，它的秘密現在屬於你了。你的傳奇將被傳頌千古。',
    defeatText: '你的旅程到此為止。低語地窖又奪走了一個靈魂。黑暗吞噬了你。',
    playAgain: '再次遊玩',
    slot_head: '頭部',
    slot_body: '身體',
    slot_hands: '手部',
    slot_feet: '腳部',
    slot_back: '背部',
    slot_waist: '腰部',
    slot_companion: '夥伴',
    health: '生命值',
    luck: '幸運值',
    inventory: '物品欄',
    yourPocketsAreEmpty: '你的口袋空空如也。',
    itemDescription: '物品描述',
    chooseOrigin: '選擇你的出身',
    originDescription: '在地窖之前，你曾是某個人。這個選擇將塑造你的能力和起始道路。',
    startingEquipment: '初始裝備',
    embarkJourney: '踏上旅程',
  },
  'ja': {
    adventureTitle: '囁きの地下聖堂',
    adventureSubtitle: 'AI駆動のテキストアドベンチャー',
    introText: '冷たく暗い地下聖堂で目覚めたが、どうやってここに来たのか記憶がない。あなたの運命はまだ書かれていない、あなたの選択が重要だ。囁きの地下聖堂の秘密を生き抜くことができるか？',
    loadError: 'セーブファイルの読み込みに失敗しました。ファイルが破損しているか、形式が無効です。',
    enableNarration: '音声ナレーションを有効にする',
    voiceSpeed: '音声速度',
    startAdventure: '冒険を始める',
    loadGame: 'セーブデータをロード',
    illustrationPromptStyle: 'ダークファンタジーのデジタルペインティング、雰囲気のある、映画的な照明、高精細。',
    illustrationError: '画家の魂は多忙です。イラストを生成できませんでした。',
    generatingIllustration: 'イラストを生成中...',
    generateIllustration: 'イラストを生成',
    buildingWorld: '精霊があなたの世界を構築しています...',
    waitingForFate: '運命の決断を待っています...',
    whatToDo: '次は何をしますか？',
    submit: '決定',
    saveGame: 'ゲームを保存',
    victoryTitle: '勝利！',
    defeatTitle: 'あなたは滅びました',
    victoryText: 'あなたは囁きの地下聖堂を征服し、その秘密は今やあなたのものです。あなたの伝説は末永く語り継がれるでしょう。',
    defeatText: 'あなたの旅はここで終わります。囁きの地下聖堂はまた一つの魂を奪いました。闇があなたを飲み込みます。',
    playAgain: 'もう一度プレイ',
    slot_head: '頭',
    slot_body: '体',
    slot_hands: '手',
    slot_feet: '足',
    slot_back: '背中',
    slot_waist: '腰',
    slot_companion: '仲間',
    health: '体力',
    luck: '運',
    inventory: '持ち物',
    yourPocketsAreEmpty: 'ポケットは空です。',
    itemDescription: 'アイテム説明',
    chooseOrigin: 'あなたの出自を選ぶ',
    originDescription: '地下聖堂に来る前、あなたは誰かだった。この選択があなたの能力と始まりの道を形作る。',
    startingEquipment: '初期装備',
    embarkJourney: '旅に出る',
  },
  'es': {
    adventureTitle: 'Cripta Susurrante',
    adventureSubtitle: 'Una Aventura de Texto Impulsada por IA',
    introText: 'Despiertas en una cripta fría y oscura sin recordar cómo llegaste. Tu destino no está escrito, tus elecciones importan. ¿Podrás sobrevivir a los secretos de la Cripta Susurrante?',
    loadError: 'Error al cargar el archivo guardado. Puede estar corrupto o en un formato no válido.',
    enableNarration: 'Activar Narración por Voz',
    voiceSpeed: 'Velocidad de Voz',
    startAdventure: 'Comienza Tu Aventura',
    loadGame: 'Cargar Partida Guardada',
    illustrationPromptStyle: 'Pintura digital de fantasía oscura, atmosférica, iluminación cinematográfica, alto detalle.',
    illustrationError: 'Los espíritus artistas están ocupados. No se pudo generar una ilustración.',
    generatingIllustration: 'Generando Ilustración...',
    generateIllustration: 'Generar Ilustración',
    buildingWorld: 'Los espíritus están construyendo tu mundo...',
    waitingForFate: 'Esperando la decisión del destino...',
    whatToDo: '¿Qué haces ahora?',
    submit: 'Enviar',
    saveGame: 'Guardar Partida',
    victoryTitle: '¡Victoria!',
    defeatTitle: 'Has Perecido',
    victoryText: 'Has conquistado la Cripta Susurrante, sus secretos ahora son tuyos. Tu leyenda se contará por los siglos de los siglos.',
    defeatText: 'Tu viaje termina aquí. La Cripta Susurrante reclama otra alma. La oscuridad te consume.',
    playAgain: 'Jugar de Nuevo',
    slot_head: 'Cabeza',
    slot_body: 'Cuerpo',
    slot_hands: 'Manos',
    slot_feet: 'Pies',
    slot_back: 'Espalda',
    slot_waist: 'Cintura',
    slot_companion: 'Compañero',
    health: 'Salud',
    luck: 'Suerte',
    inventory: 'Inventario',
    yourPocketsAreEmpty: 'Tus bolsillos están vacíos.',
    itemDescription: 'Descripción del Objeto',
    chooseOrigin: 'Elige Tu Origen',
    originDescription: 'Antes de la cripta, eras alguien. Esta elección moldeará tus habilidades y tu camino inicial.',
    startingEquipment: 'Equipo Inicial',
    embarkJourney: 'Emprender el Viaje',
  },
  'ko': {
    adventureTitle: '속삭이는 지하실',
    adventureSubtitle: 'AI 기반 텍스트 어드벤처',
    introText: '당신은 어떻게 왔는지 기억나지 않는 차갑고 어두운 지하실에서 깨어납니다. 당신의 운명은 정해지지 않았고, 당신의 선택이 중요합니다. 속삭이는 지하실의 비밀에서 살아남을 수 있을까요?',
    loadError: '저장 파일을 불러오는 데 실패했습니다. 파일이 손상되었거나 형식이 잘못되었을 수 있습니다.',
    enableNarration: '음성 내레이션 활성화',
    voiceSpeed: '음성 속도',
    startAdventure: '모험 시작하기',
    loadGame: '저장된 게임 불러오기',
    illustrationPromptStyle: '다크 판타지 디지털 페인팅, 분위기 있는, 영화적 조명, 고화질.',
    illustrationError: '화가 영혼들이 바쁩니다. 삽화를 생성할 수 없었습니다.',
    generatingIllustration: '삽화 생성 중...',
    generateIllustration: '삽화 생성',
    buildingWorld: '영혼들이 당신의 세계를 만들고 있습니다...',
    waitingForFate: '운명의 결정을 기다리는 중...',
    whatToDo: '다음에 무엇을 하시겠습니까?',
    submit: '제출',
    saveGame: '게임 저장',
    victoryTitle: '승리!',
    defeatTitle: '당신은 죽었습니다',
    victoryText: '당신은 속삭이는 지하실을 정복했고, 그 비밀은 이제 당신의 것입니다. 당신의 전설은 오랫동안語り継がれるでしょう.',
    defeatText: '당신의 여정은 여기서 끝납니다. 속삭이는 지하실이 또 다른 영혼을 거두어 갑니다. 어둠이 당신을 삼킵니다.',
    playAgain: '다시 플레이',
    slot_head: '머리',
    slot_body: '몸통',
    slot_hands: '손',
    slot_feet: '발',
    slot_back: '등',
    slot_waist: '허리',
    slot_companion: '동료',
    health: '체력',
    luck: '행운',
    inventory: '인벤토리',
    yourPocketsAreEmpty: '주머니가 비어 있습니다.',
    itemDescription: '아이템 설명',
    chooseOrigin: '당신의 기원을 선택하세요',
    originDescription: '지하실에 오기 전, 당신은 누군가였습니다. 이 선택이 당신의 능력과 시작 경로를 결정할 것입니다.',
    startingEquipment: '시작 장비',
    embarkJourney: '여정 시작',
  },
};

export const t = (lang: Language, key: string): string => {
  return translations[lang][key] || translations['en'][key];
};


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
  mood: 'curious',
  actionResult: 'neutral',
  turnCount: 0,
  chapterTitle: '',
};

const KNIGHT_CLASS: Record<Language, PlayerClass> = {
  'en': { id: 'knight', name: 'Knight', description: 'A lone bulwark against the encroaching darkness, your past is etched in the scars of your steel. Duty is your guide, your blade its instrument. You face the abyss head-on, for subtlety is a luxury the forgotten cannot afford.', initialHealth: 100, initialLuck: 30, 
    initialEquipment: { 
      head: { name: 'Old Helmet', type: 'equippable', slot: 'head', description: 'A steel helmet that has protected its wearer from more than one glancing blow. Visibility is somewhat limited.' }, 
      body: { name: 'Old Knight\'s Armor', type: 'equippable', slot: 'body', description: 'Heavy plate armor, dented and scarred from past battles. It offers significant protection at the cost of mobility.'}, 
      hands: { name: 'Battle-Worn Shortsword', type: 'equippable', slot: 'hands', description: 'A sturdy, reliable blade that has seen countless skirmishes. Its edge is chipped, but its spirit is unbroken.'}, 
      feet: null, back: null, waist: null, 
      companion: { name: 'Royal Guardian Hound', type: 'equippable', slot: 'companion', description: 'A loyal and fearless canine companion, trained for battle and unwavering in its duty to protect its master.'} 
    }, 
    initialInventory: [
      { name: 'King\'s Secret Order', type: 'quest', description: 'A sealed parchment bearing the royal crest. The orders within are for your eyes only, its purpose in this crypt a mystery.' },
      { name: 'Healing Herbs', type: 'consumable', quantity: 1, description: 'A bundle of common herbs known for their restorative properties. Can be used to mend minor wounds.'}
    ], 
    startingPrompt: 'You are a Knight. The last thing you remember is the roar of battle, the clash of steel, and a blinding light. Now, you awaken on a cold, stone slab. Dust motes dance in a single moonbeam piercing the oppressive darkness of a vast crypt. Your armor feels heavy, your sword a familiar weight in your hand, and a low growl from your loyal hound reminds you that you are not alone. The air is thick with the smell of dust and decay. A grand, sealed door looms before you, and echoing corridors branch off into the gloom.' 
  },
  'zh-TW': { id: 'knight', name: '騎士', description: '對抗蠶食黑暗的孤獨堡壘，你的過去被刻畫在鋼鐵的傷疤上。職責是你的嚮導，你的劍是它的工具。你正面迎向深淵，因為詭詐是已被遺忘者所無法承擔的奢侈。', initialHealth: 100, initialLuck: 30, 
    initialEquipment: { 
      head: { name: '老舊的頭盔', type: 'equippable', slot: 'head', description: '一頂鋼製頭盔，曾多次保護佩戴者免受掠過的打擊。視野有些受限。'}, 
      body: { name: '老舊的騎士鎧甲', type: 'equippable', slot: 'body', description: '沉重的板甲，上面佈滿了過去戰鬥的凹痕和傷疤。以犧牲機動性為代價提供顯著的保護。'}, 
      hands: { name: '戰損短劍', type: 'equippable', slot: 'hands', description: '一把堅固可靠的刀刃，歷經無數戰鬥。劍刃雖有缺口，但鬥志未減。'}, 
      feet: null, back: null, waist: null, 
      companion: { name: '王國守護犬', type: 'equippable', slot: 'companion', description: '一隻忠誠無畏的犬類夥伴，受過戰鬥訓練，堅定不移地保護其主人。'} 
    }, 
    initialInventory: [
      { name: '國王的密令', type: 'quest', description: '一份蓋有皇家紋章的密封羊皮紙。裡面的命令只有你能看，它為何會出現在這地窖中是個謎。' },
      { name: '治療藥草', type: 'consumable', quantity: 1, description: '一捆以其恢復特性而聞名的普通藥草。可用於治療輕微傷口。'}
    ], 
    startingPrompt: '你是一位騎士。你最後的記憶是戰場的咆哮、鋼鐵的碰撞和一道致盲的白光。現在，你在一個冰冷的石板上醒來。塵埃在穿透這巨大地窖壓抑黑暗的單一月光中飛舞。你的盔甲感覺沉重，手中的劍是熟悉的重量，而你忠誠的獵犬發出的低吼提醒你，你並非孤單一人。空氣中瀰漫著灰塵和腐朽的氣味。一扇宏偉、密封的大門聳立在你面前，迴盪的走廊分岔伸向幽暗之中。' 
  },
  'ja': { id: 'knight', name: 'ナイト', description: '忍び寄る闇に対する孤独な砦、あなたの過去は鋼の傷跡に刻まれている。義務があなたの導きであり、刃はその道具である。あなたは深淵に正面から立ち向かう。なぜなら、巧妙さは忘れ去られし者には許されない贅沢だからだ。', initialHealth: 100, initialLuck: 30,
    initialEquipment: { 
      head: { name: '古い兜', type: 'equippable', slot: 'head', description: '何度も glancing blow から着用者を守ってきた鋼の兜。視界はやや制限される。'}, 
      body: { name: '古い騎士の鎧', type: 'equippable', slot: 'body', description: '過去の戦いでへこみ、傷ついた重いプレートアーマー。機動性を犠牲にして、かなりの防御力を提供する。'}, 
      hands: { name: '戦い慣れたショートソード', type: 'equippable', slot: 'hands', description: '数え切れないほどの小競り合いを経験した、頑丈で信頼できる刃。刃は欠けているが、その魂は折れていない。'}, 
      feet: null, back: null, waist: null, 
      companion: { name: '王国の守護犬', type: 'equippable', slot: 'companion', description: '戦闘のために訓練され、主人を守るという義務に揺るぎない、忠実で恐れ知らずの犬の仲間。'} 
    }, 
    initialInventory: [
      { name: '王の密令', type: 'quest', description: '王家の紋章が入った封印された羊皮紙。中の命令はあなただけのものであり、この地下聖堂での目的は謎である。' },
      { name: '治癒の薬草', type: 'consumable', quantity: 1, description: '回復効果で知られる一般的な薬草の束。軽傷の治療に使用できる。'}
    ],
    startingPrompt: 'あなたはナイトです。最後の記憶は、戦いの雄叫び、鋼鉄の衝突、そして目をくらますような光です。今、あなたは冷たい石の板の上で目覚めます。広大な地下聖堂の圧迫するような暗闇を突き抜ける一本の月光の中で、塵の粒子が舞っています。鎧は重く感じられ、手の剣はおなじみの重さであり、忠実な猟犬からの低い唸り声は、あなたが一人ではないことを思い出させます。空気はほこりと腐敗の匂いで満ちています。壮大で封印された扉があなたの前にそびえ立ち、反響する廊下が暗闇の中に分岐しています。'
  },
  'es': { id: 'knight', name: 'Caballero', description: 'Un baluarte solitario contra la oscuridad invasora, tu pasado está grabado en las cicatrices de tu acero. El deber es tu guía, tu espada su instrumento. Te enfrentas al abismo de frente, pues la sutileza es un lujo que los olvidados no pueden permitirse.', initialHealth: 100, initialLuck: 30,
    initialEquipment: { 
      head: { name: 'Casco Viejo', type: 'equippable', slot: 'head', description: 'Un casco de acero que ha protegido a su portador de más de un golpe de refilón. La visibilidad es algo limitada.' }, 
      body: { name: 'Armadura de Caballero Vieja', type: 'equippable', slot: 'body', description: 'Una pesada armadura de placas, abollada y marcada por batallas pasadas. Ofrece una protección significativa a costa de la movilidad.'}, 
      hands: { name: 'Espada Corta Ajada por la Batalla', type: 'equippable', slot: 'hands', description: 'Una hoja robusta y fiable que ha visto innumerables escaramuzas. Su filo está mellado, pero su espíritu está intacto.'}, 
      feet: null, back: null, waist: null, 
      companion: { name: 'Sabueso Guardián Real', type: 'equippable', slot: 'companion', description: 'Un compañero canino leal e intrépido, entrenado para la batalla e inquebrantable en su deber de proteger a su amo.'} 
    }, 
    initialInventory: [
      { name: 'Orden Secreta del Rey', type: 'quest', description: 'Un pergamino sellado con el escudo real. Las órdenes en su interior son solo para tus ojos, su propósito en esta cripta es un misterio.' },
      { name: 'Hierbas Curativas', type: 'consumable', quantity: 1, description: 'Un manojo de hierbas comunes conocidas por sus propiedades reconstituyentes. Se pueden usar para curar heridas menores.'}
    ],
    startingPrompt: 'Eres un Caballero. Lo último que recuerdas es el rugido de la batalla, el choque del acero y una luz cegadora. Ahora, despiertas sobre una losa de piedra fría. Motas de polvo danzan en un único rayo de luna que atraviesa la opresiva oscuridad de una vasta cripta. Tu armadura se siente pesada, tu espada es un peso familiar en tu mano, y un gruñido bajo de tu leal sabueso te recuerda que no estás solo. El aire está cargado del olor a polvo y descomposición. Una gran puerta sellada se alza ante ti, y pasillos resonantes se bifurcan hacia la penumbra.'
  },
  'ko': { id: 'knight', name: '기사', description: '잠식하는 어둠에 맞서는 외로운 보루, 당신의 과거는 강철의 흉터에 새겨져 있습니다. 의무는 당신의 길잡이이며, 검은 그 도구입니다. 당신은 심연에 정면으로 맞섭니다. 교활함은 잊혀진 자들에게는 사치이기 때문입니다.', initialHealth: 100, initialLuck: 30,
    initialEquipment: { 
      head: { name: '오래된 투구', type: 'equippable', slot: 'head', description: '착용자를 스치는 타격으로부터 여러 번 보호해 준 강철 투구. 시야가 다소 제한됩니다.' }, 
      body: { name: '오래된 기사의 갑옷', type: 'equippable', slot: 'body', description: '지난 전투로 찌그러지고 긁힌 무거운 판금 갑옷. 기동성을 희생하는 대신 상당한 보호를 제공합니다.'}, 
      hands: { name: '전투로 닳은 단검', type: 'equippable', slot: 'hands', description: '수많은 전투를 겪은 튼튼하고 신뢰할 수 있는 검. 날은 이가 빠졌지만 그 정신은 꺾이지 않았습니다.'}, 
      feet: null, back: null, waist: null, 
      companion: { name: '왕국 수호견', type: 'equippable', slot: 'companion', description: '전투 훈련을 받고 주인을 보호하는 의무에 흔들림이 없는 충성스럽고 두려움 없는 개 동반자.'} 
    }, 
    initialInventory: [
      { name: '왕의 비밀 명령서', type: 'quest', description: '왕실 문장이 찍힌 봉인된 양피지. 안의 명령은 당신만 볼 수 있으며, 이 지하실에 있는 목적은 미스터리입니다.' },
      { name: '치유 약초', type: 'consumable', quantity: 1, description: '회복 효과로 알려진 흔한 약초 묶음. 가벼운 상처를 치료하는 데 사용할 수 있습니다.'}
    ],
    startingPrompt: '당신은 기사입니다. 마지막으로 기억나는 것은 전투의 함성, 강철이 부딪히는 소리, 그리고 눈을 멀게 하는 빛입니다. 이제, 당신은 차가운 돌판 위에서 깨어납니다. 광대한 지하실의 숨 막히는 어둠을 꿰뚫는 한 줄기 달빛 속에서 먼지 입자가 춤을 춥니다. 갑옷은 무겁게 느껴지고, 손에 쥔 검은 익숙한 무게이며, 충성스러운 사냥개의 낮은 으르렁거림은 당신이 혼자가 아님을 상기시킵니다. 공기는 먼지와 부패의 냄새로 가득 차 있습니다. 거대하고 봉인된 문이 당신 앞에 서 있고, 울려 퍼지는 복도들이 어둠 속으로 갈라져 나갑니다.'
  },
};

const ROGUE_CLASS: Record<Language, PlayerClass> = {
  'en': { id: 'rogue', name: 'Rogue', description: 'A whisper in the shadows, a ghost that treads where others fall. You see the world as a web of secrets and opportunities, and believe the greatest treasures are guarded not by muscle, but by ignorance. The crypt is a lock, and you are the key.', initialHealth: 70, initialLuck: 80, 
    initialEquipment: { 
      head: { name: 'Thief\'s Hood', type: 'equippable', slot: 'head', description: 'A deep hood that conceals the face in shadow, perfect for staying unseen.'}, 
      body: { name: 'Cloth Armor', type: 'equippable', slot: 'body', description: 'Simple, dark-colored cloth wrappings that allow for silent movement. Offers minimal protection.'}, 
      hands: { name: 'Rusted Dagger', type: 'equippable', slot: 'hands', description: 'A small, corroded blade. While not impressive, its sharp point is still deadly in the right hands.'}, 
      feet: { name: 'Soft-soled Shoes', type: 'equippable', slot: 'feet', description: 'Worn leather shoes that make almost no sound, ideal for stealth.'}, 
      back: null, waist: null, 
      companion: { name: 'Darkmoon Owl', type: 'equippable', slot: 'companion', description: 'A nocturnal predator with feathers as dark as the new moon. Its silent flight and keen sight make it an invaluable scout in the shadows.'} 
    }, 
    initialInventory: [
      { name: 'Smoke Bomb', type: 'consumable', quantity: 1, description: 'A small, clay sphere. When shattered, it releases a thick cloud of smoke, perfect for a quick escape or creating a diversion.'},
      { name: 'Lockpick', type: 'consumable', quantity: 1, description: 'A single, well-used pick for bypassing simple locks and mechanisms. It looks fragile.'}
    ], 
    startingPrompt: 'You are a Rogue. Darkness is your ally. One moment you were liberating a weighty purse in a crowded market, the next you\'re awakening to a chilling silence on a damp floor. Your head aches. The familiar feel of your worn leather gear is a small comfort. Shadows cling to the corners of this crypt like a second skin, a canvas for your trade. Your owl companion shifts silently on your shoulder, its wide eyes piercing the gloom better than your own. You sense opportunities in the darkness, but also a deep, ancient danger that your skills of stealth and subterfuge will be tested against.' 
  },
  'zh-TW': { id: 'rogue', name: '盜賊', description: '陰影中的低語，一個在他人殞落之處行走的幽魂。你將世界視為一個由秘密與機遇交織的網絡，並相信最偉大的寶藏並非由肌肉守護，而是由無知所掩蓋。地窖是一把鎖，而你就是鑰匙。', initialHealth: 70, initialLuck: 80, 
    initialEquipment: { 
      head: { name: '盜賊頭巾', type: 'equippable', slot: 'head', description: '一頂能將臉部隱藏在陰影中的深色頭巾，非常適合保持隱蔽。'}, 
      body: { name: '布甲', type: 'equippable', slot: 'body', description: '簡單的深色布製裹身，便於無聲移動。提供最低限度的保護。'}, 
      hands: { name: '生鏽匕首', type: 'equippable', slot: 'hands', description: '一把小巧、被腐蝕的刀刃。雖然不起眼，但在合適的人手中，其鋒利的尖端仍然是致命的。'}, 
      feet: { name: '軟底鞋', type: 'equippable', slot: 'feet', description: '磨損的皮鞋，幾乎不會發出聲音，是潛行者的理想選擇。'}, 
      back: null, waist: null, 
      companion: { name: '暗月夜梟', type: 'equippable', slot: 'companion', description: '一隻羽毛像新月一樣漆黑的夜行掠食者。它無聲的飛行和敏銳的視力使其成為陰影中寶貴的偵察兵。'} 
    }, 
    initialInventory: [
      { name: '煙霧彈', type: 'consumable', quantity: 1, description: '一個小陶球。打破時會釋放出濃密的煙霧，非常適合快速逃脫或製造混亂。'},
      { name: '開鎖器', type: 'consumable', quantity: 1, description: '一根使用已久的單一撬鎖工具，用於繞過簡單的鎖和機關。它看起來很脆弱。'}
    ], 
    startingPrompt: '你是一名盜賊。黑暗是你的盟友。前一刻你還在擁擠的市場裡解放一個沉重的錢包，下一刻就在潮濕的地板上被令人心寒的寂靜喚醒。你頭痛欲裂。身上熟悉的舊皮甲帶來一絲小小的安慰。陰影像第二層皮膚一樣緊貼著這個地窖的角落，是你施展技藝的畫布。你的貓頭鷹夥伴在你肩上無聲地移動，它寬大的眼睛比你自己的更能穿透黑暗。你在黑暗中感覺到機會，但也感覺到一種深沉、古老的危險，你的潛行和詭計技巧將受到考驗。' 
  },
  'ja': { id: 'rogue', name: '盗賊', description: '影の中の囁き、他者が倒れる場所を歩む幽霊。あなたは世界を秘密と機会の網と見なし、最も偉大な宝は筋力ではなく無知によって守られていると信じている。地下聖堂は錠であり、あなたは鍵だ。', initialHealth: 70, initialLuck: 80,
    initialEquipment: { 
      head: { name: '盗賊の頭巾', type: 'equippable', slot: 'head', description: '顔を影に隠し、見られないようにするのに最適な深いフード。'}, 
      body: { name: '布の鎧', type: 'equippable', slot: 'body', description: '静かな動きを可能にする、シンプルな暗色の布製の巻き物。最小限の保護しか提供しない。'}, 
      hands: { name: '錆びた短剣', type: 'equippable', slot: 'hands', description: '小さく腐食した刃。印象的ではないが、その鋭い先端は適切な手にかかればまだ致命的である。'}, 
      feet: { name: '柔らかい底の靴', type: 'equippable', slot: 'feet', description: 'ステルスに理想的な、ほとんど音を立てない履き古された革靴。'}, 
      back: null, waist: null, 
      companion: { name: '闇月のフクロウ', type: 'equippable', slot: 'companion', description: '新月のように暗い羽を持つ夜行性の捕食者。その静かな飛行と鋭い視力は、影の中での貴重な斥候となる。'} 
    }, 
    initialInventory: [
      { name: '煙玉', type: 'consumable', quantity: 1, description: '小さな粘土の球。割れると濃い煙の雲を放ち、素早い脱出や陽動に最適である。'},
      { name: 'ロックピック', type: 'consumable', quantity: 1, description: '簡単な錠や仕掛けを迂回するための、使い古された1本のピック。壊れやすそうだ。'}
    ],
    startingPrompt: 'あなたは盗賊です。闇はあなたの味方です。ある瞬間、あなたは混雑した市場で重い財布を解放していましたが、次の瞬間には湿った床の上で凍えるような静寂の中で目覚めます。頭が痛みます。使い古された革の装備の馴染みのある感触は、ささやかな慰めです。影はこの地下聖堂の隅々に第二の皮膚のようにまとわりつき、あなたの商売のためのキャンバスとなっています。あなたのフクロウの仲間は肩の上で静かに動き、その大きな目はあなた自身の目よりも暗闇をよく見通します。あなたは暗闇の中に機会を感じますが、同時にあなたのステルスと策略のスキルが試される、深く古代の危険も感じます。'
  },
  'es': { id: 'rogue', name: 'Pícaro', description: 'Un susurro en las sombras, un fantasma que pisa donde otros caen. Ves el mundo como una red de secretos y oportunidades, y crees que los mayores tesoros no están guardados por músculo, sino por ignorancia. La cripta es una cerradura, y tú eres la llave.', initialHealth: 70, initialLuck: 80,
    initialEquipment: { 
      head: { name: 'Capucha de Ladrón', type: 'equippable', slot: 'head', description: 'Una capucha profunda que oculta el rostro en la sombra, perfecta para pasar desapercibido.'}, 
      body: { name: 'Armadura de Tela', type: 'equippable', slot: 'body', description: 'Sencillas envolturas de tela de color oscuro que permiten un movimiento silencioso. Ofrece una protección mínima.'}, 
      hands: { name: 'Daga Oxidada', type: 'equippable', slot: 'hands', description: 'Una pequeña hoja corroída. Aunque no es impresionante, su punta afilada sigue siendo mortal en las manos adecuadas.'}, 
      feet: { name: 'Zapatos de Suela Blanda', type: 'equippable', slot: 'feet', description: 'Zapatos de cuero gastados que casi no hacen ruido, ideales para el sigilo.'}, 
      back: null, waist: null, 
      companion: { name: 'Búho de la Luna Oscura', type: 'equippable', slot: 'companion', description: 'Un depredador nocturno con plumas tan oscuras como la luna nueva. Su vuelo silencioso y su aguda vista lo convierten en un explorador invaluable en las sombras.'} 
    }, 
    initialInventory: [
      { name: 'Bomba de Humo', type: 'consumable', quantity: 1, description: 'Una pequeña esfera de arcilla. Al romperse, libera una espesa nube de humo, perfecta para un escape rápido o para crear una distracción.'},
      { name: 'Ganzúa', type: 'consumable', quantity: 1, description: 'Una única ganzúa muy usada para eludir cerraduras y mecanismos sencillos. Parece frágil.'}
    ],
    startingPrompt: 'Eres un Pícaro. La oscuridad es tu aliada. En un momento estabas liberando una bolsa pesada en un mercado abarrotado, y al siguiente despiertas con un silencio escalofriante en un suelo húmedo. Te duele la cabeza. La sensación familiar de tu gastado equipo de cuero es un pequeño consuelo. Las sombras se aferran a las esquinas de esta cripta como una segunda piel, un lienzo para tu oficio. Tu compañero búho se mueve silenciosamente en tu hombro, sus grandes ojos atraviesan la penumbra mejor que los tuyos. Sientes oportunidades en la oscuridad, pero también un peligro profundo y antiguo contra el que se pondrán a prueba tus habilidades de sigilo y subterfugio.'
  },
  'ko': { id: 'rogue', name: '도적', description: '그림자 속의 속삭임, 다른 이들이 쓰러지는 곳을 밟는 유령. 당신은 세상을 비밀과 기회의 그물로 보며, 가장 위대한 보물은 근육이 아닌 무지에 의해 지켜진다고 믿습니다. 지하실은 자물쇠이고, 당신은 열쇠입니다.', initialHealth: 70, initialLuck: 80,
    initialEquipment: { 
      head: { name: '도적의 두건', type: 'equippable', slot: 'head', description: '얼굴을 그림자 속에 숨겨 보이지 않게 하기에 완벽한 깊은 두건.'}, 
      body: { name: '천 갑옷', type: 'equippable', slot: 'body', description: '조용한 움직임을 가능하게 하는 단순하고 어두운 색의 천 갑옷. 최소한의 보호만 제공합니다.'}, 
      hands: { name: '녹슨 단검', type: 'equippable', slot: 'hands', description: '작고 부식된 칼날. 인상적이지는 않지만 그 날카로운 끝은 올바른 손에 쥐어지면 여전히 치명적입니다.'}, 
      feet: { name: '부드러운 밑창의 신발', type: 'equippable', slot: 'feet', description: '거의 소리를 내지 않는 낡은 가죽 신발로, 은신에 이상적입니다.'}, 
      back: null, waist: null, 
      companion: { name: '암월의 올빼미', type: 'equippable', slot: 'companion', description: '초승달처럼 어두운 깃털을 가진 야행성 포식자. 조용한 비행과 예리한 시력은 그림자 속에서 귀중한 정찰병이 됩니다.'} 
    }, 
    initialInventory: [
      { name: '연막탄', type: 'consumable', quantity: 1, description: '작은 점토 구슬. 깨뜨리면 짙은 연기 구름을 방출하여 빠른 탈출이나 교란에 적합합니다.'},
      { name: '자물쇠 따개', type: 'consumable', quantity: 1, description: '간단한 자물쇠와 장치를 우회하기 위한 낡은 단일 픽. 부서지기 쉬워 보입니다.'}
    ],
    startingPrompt: '당신은 도적입니다. 어둠은 당신의 동맹입니다. 한순간 당신은 붐비는 시장에서 무거운 지갑을 해방시키고 있었고, 다음 순간에는 축축한 바닥에서 오싹한 침묵 속에서 깨어납니다. 머리가 아픕니다. 낡은 가죽 장비의 익숙한 느낌은 작은 위안입니다. 그림자는 이 지하실의 구석구석에 두 번째 피부처럼 달라붙어 당신의 기술을 펼칠 캔버스가 됩니다. 당신의 올빼미 동료는 어깨 위에서 조용히 움직이며, 그 큰 눈은 당신의 눈보다 어둠을 더 잘 꿰뚫어 봅니다. 당신은 어둠 속에서 기회를 느끼지만, 또한 당신의 은신과 속임수 기술이 시험받을 깊고 고대의 위험도 느낍니다.'
  },
};

const SCHOLAR_CLASS: Record<Language, PlayerClass> = {
  'en': { id: 'scholar', name: 'Scholar', description: 'Where others see only decay, you see a library of the forgotten. You believe that every shadow holds a secret, every rune a forgotten truth. Your mind is a lantern in the oppressive dark, for true power lies not in steel, but in understanding.', initialHealth: 60, initialLuck: 60, 
    initialEquipment: { 
      head: { name: 'Monocle', type: 'equippable', slot: 'head', description: 'A simple lens in a brass frame. It helps to focus the eye, revealing details that others might miss.'}, 
      body: { name: 'Scholar\'s Robe', type: 'equippable', slot: 'body', description: 'A long, somewhat threadbare robe embroidered with faded arcane symbols. It offers no protection but feels strangely comforting.'}, 
      hands: { name: 'Withered Branch Wand', type: 'equippable', slot: 'hands', description: 'A gnarled piece of wood that feels unnaturally cold to the touch. It seems to hum with a faint, dormant power.'}, 
      feet: null, back: null, waist: null, 
      companion: { name: 'Elemental Sprite', type: 'equippable', slot: 'companion', description: 'A flickering wisp of pure energy that darts and hovers around you. It illuminates its surroundings and seems to react to sources of magic.'} 
    }, 
    initialInventory: [
      { name: 'Ancient Arcane Codex', type: 'quest', description: 'A heavy, leather-bound book filled with forgotten lore and cryptic diagrams. Its pages smell of dust and ozone.'},
      { name: 'Mana Potion', type: 'consumable', quantity: 1, description: 'A swirling, cerulean liquid in a small vial. Imbibing it restores a portion of one\'s magical or mental energy.'}
    ], 
    startingPrompt: 'You are a Scholar. Your mind is your greatest weapon. You were deep in research, translating a forgotten text, when the words on the page began to glow, and the world dissolved. You now find yourself in a crypt, the air thick with the dust of ages. The intricate carvings on the walls are not just decoration; they are a language you ache to understand. Your sprite companion glows softly, casting dancing shadows that seem to hint at hidden runes. This place is a puzzle, a historical treasure trove of immense danger, and you are uniquely equipped to unlock its secrets—or be consumed by them.' 
  },
  'zh-TW': { id: 'scholar', name: '學者', description: '在他人只見腐朽之處，你看到的是一座被遺忘的圖書館。你相信每個陰影都藏著一個秘密，每個符文都蘊含著一段被遺忘的真理。你的心智是在這壓抑黑暗中的一盞提燈，因為真正的力量並非來自鋼鐵，而是源於理解。', initialHealth: 60, initialLuck: 60, 
    initialEquipment: { 
      head: { name: '單片眼鏡', type: 'equippable', slot: 'head', description: '一個鑲在黃銅框裡的簡單鏡片。它有助於集中視力，揭示他人可能忽略的細節。'}, 
      body: { name: '學者長袍', type: 'equippable', slot: 'body', description: '一件長而有些磨損的長袍，上面繡有褪色的神秘符號。它不提供任何保護，但感覺異常舒適。'}, 
      hands: { name: '枯枝短杖', type: 'equippable', slot: 'hands', description: '一根扭曲的木枝，觸感異常冰冷。它似乎在以微弱、潛伏的力量嗡嗡作響。'}, 
      feet: null, back: null, waist: null, 
      companion: { name: '元素精靈', type: 'equippable', slot: 'companion', description: '一縷閃爍的純能量，在你周圍飛舞盤旋。它照亮了周圍的環境，似乎對魔法源有反應。'} 
    }, 
    initialInventory: [
      { name: '古老的神秘法典', type: 'quest', description: '一本厚重的皮面書，裡面充滿了被遺忘的知識和神秘的圖表。書頁散發著灰塵和臭氧的味道。'},
      { name: '法力藥水', type: 'consumable', quantity: 1, description: '一小瓶中旋轉的蔚藍色液體。飲用後可恢復一部分魔法或精神能量。'}
    ], 
    startingPrompt: '你是一名學者。你的頭腦是你最強大的武器。你正深入研究，翻譯一篇被遺忘的文本，這時書頁上的文字開始發光，世界隨之消融。你現在發現自己身處一個地窖中，空氣中瀰漫著歲月的塵埃。牆上複雜的雕刻不僅僅是裝飾；它們是一種你渴望理解的語言。你的精靈夥伴發出柔和的光芒，投下的舞動陰影似乎暗示著隱藏的符文。這個地方是一個謎題，一個充滿巨大危險的歷史寶庫，而你擁有獨一無二的能力來解開它的秘密——或者被它吞噬。' 
  },
  'ja': { id: 'scholar', name: '学者', description: '他者がただの腐敗しか見ない場所で、あなたは忘れられた図書館を見る。あなたはすべての影が秘密を宿し、すべてのルーンが忘れられた真実を秘めていると信じている。あなたの心は抑圧的な闇の中のランタンであり、真の力は鋼ではなく理解にあるのだから。', initialHealth: 60, initialLuck: 60,
    initialEquipment: { 
      head: { name: '片眼鏡', type: 'equippable', slot: 'head', description: '真鍮のフレームにはめられたシンプルなレンズ。視力を集中させ、他の人が見逃すかもしれない詳細を明らかにするのに役立つ。'}, 
      body: { name: '学者のローブ', type: 'equippable', slot: 'body', description: '色褪せた神秘的なシンボルが刺繍された、長くてやや擦り切れたローブ。保護は提供しないが、不思議と心地よい感じがする。'}, 
      hands: { name: '枯れ枝の杖', type: 'equippable', slot: 'hands', description: '触ると不自然に冷たい、節くれだった木片。微かで休眠中の力でうなっているようだ。'}, 
      feet: null, back: null, waist: null, 
      companion: { name: '元素の精霊', type: 'equippable', slot: 'companion', description: 'あなたの周りを飛び交い、ホバリングする純粋なエネルギーのちらつくウィスプ。周囲を照らし、魔法の源に反応するようだ。'} 
    }, 
    initialInventory: [
      { name: '古代の秘術の法典', type: 'quest', description: '忘れられた伝承と不可解な図で満たされた、重い革張りの本。そのページはほこりとオゾンの匂いがする。'},
      { name: 'マナポーション', type: 'consumable', quantity: 1, description: '小さな小瓶の中で渦巻く、空色の液体。飲むと魔法や精神エネルギーの一部を回復する。'}
    ],
    startingPrompt: 'あなたは学者です。あなたの心はあなたの最大の武器です。忘れられたテキストを翻訳する研究に深く没頭していると、ページ上の言葉が輝き始め、世界が溶けてしまいました。あなたは今、時代の塵で空気の濃い地下聖堂にいることに気づきます。壁の複雑な彫刻は単なる装飾ではありません。それはあなたが理解したくてたまらない言語です。あなたのスプライトの仲間は柔らかく輝き、隠されたルーン文字を示唆するような踊る影を投げかけます。この場所はパズルであり、計り知れない危険を伴う歴史的な宝庫であり、あなたはその秘密を解き明かす—あるいはそれに飲み込まれる—ためのユニークな能力を備えています。'
  },
  'es': { id: 'scholar', name: 'Erudito', description: 'Donde otros solo ven decadencia, tú ves una biblioteca de lo olvidado. Crees que cada sombra guarda un secreto, cada runa una verdad olvidada. Tu mente es una linterna en la oscuridad opresiva, pues el verdadero poder no reside en el acero, sino en la comprensión.', initialHealth: 60, initialLuck: 60,
    initialEquipment: { 
      head: { name: 'Monóculo', type: 'equippable', slot: 'head', description: 'Una simple lente en un marco de latón. Ayuda a enfocar la vista, revelando detalles que otros podrían pasar por alto.'}, 
      body: { name: 'Túnica de Erudito', type: 'equippable', slot: 'body', description: 'Una túnica larga y algo raída, bordada con símbolos arcanos desvaídos. No ofrece protección pero se siente extrañamente reconfortante.'}, 
      hands: { name: 'Varita de Rama Marchita', type: 'equippable', slot: 'hands', description: 'un trozo de madera nudoso que se siente anormalmente frío al tacto. Parece zumbar con un poder débil y latente.'}, 
      feet: null, back: null, waist: null, 
      companion: { name: 'Duende Elemental', type: 'equippable', slot: 'companion', description: 'una voluta parpadeante de energía pura que se lanza y revolotea a tu alrededor. Ilumina su entorno y parece reaccionar a las fuentes de magia.'} 
    }, 
    initialInventory: [
      { name: 'Códice Arcano Antiguo', type: 'quest', description: 'Un pesado libro encuadernado en cuero, lleno de conocimientos olvidados y diagramas crípticos. Sus páginas huelen a polvo y ozono.'},
      { name: 'Poción de Maná', type: 'consumable', quantity: 1, description: 'Un líquido cerúleo y arremolinado en un pequeño vial. Beberlo restaura una porción de la energía mágica o mental de uno.'}
    ],
    startingPrompt: 'Eres un Erudito. Tu mente es tu mayor arma. Estabas inmerso en una investigación, traduciendo un texto olvidado, cuando las palabras en la página comenzaron a brillar y el mundo se disolvió. Ahora te encuentras en una cripta, el aire cargado con el polvo de los siglos. Las intrincadas tallas en las paredes no son solo decoración; son un lenguaje que anhelas comprender. Tu compañero duende brilla suavemente, proyectando sombras danzantes que parecen insinuar runas ocultas. Este lugar es un rompecabezas, un tesoro histórico de inmenso peligro, y tú estás excepcionalmente equipado para desvelar sus secretos, o ser consumido por ellos.'
  },
  'ko': { id: 'scholar', name: '학자', description: '다른 이들이 단지 부패만을 보는 곳에서, 당신은 잊혀진 도서관을 봅니다. 당신은 모든 그림자가 비밀을 품고, 모든 룬이 잊혀진 진실을 담고 있다고 믿습니다. 당신의 마음은 억압적인 어둠 속의 등불입니다. 진정한 힘은 강철이 아닌 이해에서 나오기 때문입니다.', initialHealth: 60, initialLuck: 60,
    initialEquipment: { 
      head: { name: '단안경', type: 'equippable', slot: 'head', description: '놋쇠테에 박힌 간단한 렌즈. 시력을 집중시켜 다른 사람들이 놓칠 수 있는 세부 사항을 드러내는 데 도움이 됩니다.'}, 
      body: { name: '학자의 로브', type: 'equippable', slot: 'body', description: '빛바랜 비전 상징이 수놓아진 길고 다소 낡은 로브. 보호 기능은 없지만 이상하게 편안한 느낌을 줍니다.'}, 
      hands: { name: '마른 가지 지팡이', type: 'equippable', slot: 'hands', description: '만지면 부자연스럽게 차가운 울퉁불퉁한 나뭇가지. 희미하고 잠자는 힘으로 윙윙거리는 것 같습니다.'}, 
      feet: null, back: null, waist: null, 
      companion: { name: '원소 정령', type: 'equippable', slot: 'companion', description: '당신 주위를 맴돌며 떠다니는 순수한 에너지의 깜박이는 작은 조각. 주변을 밝히고 마법의 근원에 반응하는 것 같습니다.'} 
    }, 
    initialInventory: [
      { name: '고대 비전의 법전', type: 'quest', description: '잊혀진 지식과 불가사의한 도표로 가득 찬 무거운 가죽 장정의 책. 페이지에서는 먼지와 오존 냄새가 납니다.'},
      { name: '마나 물약', type: 'consumable', quantity: 1, description: '작은 병 안에서 소용돌이치는 청록색 액체. 마시면 마법 또는 정신 에너지의 일부를 회복합니다.'}
    ],
    startingPrompt: '당신은 학자입니다. 당신의 마음은 가장 위대한 무기입니다. 잊혀진 문서를 번역하는 연구에 깊이 빠져 있을 때, 페이지의 단어들이 빛나기 시작했고 세상이 사라졌습니다. 당신은 이제 수세기의 먼지로 공기가 자욱한 지하실에 있습니다. 벽의 복잡한 조각은 단순한 장식이 아닙니다. 그것은 당신이 이해하고 싶어 안달하는 언어입니다. 당신의 정령 동료는 부드럽게 빛나며, 숨겨진 룬을 암시하는 듯한 춤추는 그림자를 던집니다. 이곳은 퍼즐이자 엄청난 위험이 도사리는 역사적인 보물창고이며, 당신은 그 비밀을 풀거나 그것에 삼켜질 독특한 능력을 갖추고 있습니다.'
  },
};

export const TRICKSTER_CLASS: Record<Language, PlayerClass> = {
  'en': { id: 'trickster', name: 'Trickster', description: 'An anomaly woven into the tapestry of fate, you dance on the edge of reason and chaos. Reality bends to your whims, and the crypt itself seems to hold its breath, unsure what to make of the cosmic joke that is your existence. (Unlocked by winning the game)', initialHealth: 1, initialLuck: 100, 
    initialEquipment: { 
      head: { name: 'Hat of Taunting', type: 'equippable', slot: 'head', description: 'A ridiculously oversized hat with a garish feather. It seems to draw unwanted attention.'}, 
      body: null, hands: null, feet: null, back: null, 
      waist: { name: 'Pouch of Unknown Contents', type: 'equippable', slot: 'waist', description: 'A small, unassuming leather pouch that is tightly cinched. Shaking it produces no sound, yet it feels like it contains *something*.'}, 
      companion: { name: 'Blustering Phantom', type: 'equippable', slot: 'companion', description: 'A translucent, vaguely humanoid shape that follows you. It constantly makes grand, empty threats at inanimate objects but flees from any real danger.'} 
    }, 
    initialInventory: [
      { name: 'Shiny but Worthless Coin', type: 'quest', description: 'A large, gold-colored coin that gleams invitingly. It\'s made of cheap metal and has no real value.'},
      { name: 'A Yellow Card for Infraction', type: 'quest', description: 'A stiff, bright yellow card. Holding it gives you an inexplicable urge to show it to someone who has broken some unspoken rule.'},
      { name: 'Blank Scroll', type: 'quest', description: 'A pristine roll of parchment. It is completely empty, yet you feel it\'s meant to be read.'},
    ], 
    startingPrompt: 'You are the Trickster. Reality is your playground. Or it was. Maybe you pranked the wrong cosmic entity, or perhaps you just got bored and tripped into this dimension. You awaken not on stone, but on a brightly colored, squeaky rubber chicken. The crypt around you seems to take offense at your very presence; torches flicker nervously and shadows seem to shrink away. Your phantom companion is arguing with a particularly stubborn bit of moss. The rules don\'t seem to apply to you, but the dangers in this place are very, very real. This should be fun.' 
  },
  'zh-TW': { id: 'trickster', name: '詐欺師', description: '一道被織入命運織錦中的異數，你在理性與混沌的邊緣上跳舞。現實因你的奇想而扭曲，連地窖本身似乎都屏住了呼吸，不確定該如何應對你這個宇宙級的玩笑存在。(贏得遊戲解鎖)', initialHealth: 1, initialLuck: 100, 
    initialEquipment: { 
      head: { name: '嘲諷之帽', type: 'equippable', slot: 'head', description: '一頂帶有艷俗羽毛的巨大帽子。它似乎總能吸引不必要的注意。'}, 
      body: null, hands: null, feet: null, back: null, 
      waist: { name: '內容物未知的腰包', type: 'equippable', slot: 'waist', description: '一個緊緊束口的普通小皮袋。搖晃它沒有任何聲音，但感覺裡面確實裝了*什麼*。'}, 
      companion: { name: '虛張聲勢的幻影', type: 'equippable', slot: 'companion', description: '一個跟隨你的半透明、大致呈人形的影子。它不斷對無生命的物體發出宏大而空洞的威脅，但一遇到真正的危險就逃之夭夭。'} 
    }, 
    initialInventory: [
      { name: '閃亮但毫無價值的硬幣', type: 'quest', description: '一枚閃閃發光的大號金色硬幣。它是由廉價金屬製成的，沒有實際價值。'},
      { name: '一張違規警告的黃牌', type: 'quest', description: '一張亮黃色的硬卡。拿著它會讓你有種莫名的衝動，想把它出示給違反了某種潛規則的人。'},
      { name: '空白的卷軸', type: 'quest', description: '一卷潔白無瑕的羊皮紙。上面什麼都沒有，但你覺得它應該是用來閱讀的。'},
    ], 
    startingPrompt: '你是詐欺師。現實是你的遊樂場。或者說曾經是。也許你對錯誤的宇宙實體開了個玩笑，或者只是因為無聊而絆倒進了這個維度。你醒來時不是躺在石頭上，而是在一隻色彩鮮豔、嘎吱作響的橡膠雞上。你周圍的地窖似乎對你的存在感到冒犯；火把緊張地閃爍，陰影似乎在退縮。你的幻影夥伴正在和一塊特別固執的苔蘚爭吵。規則似乎不適用於你，但這裡的危險卻非常、非常真實。這應該會很有趣。' 
  },
  'ja': { id: 'trickster', name: 'トリックスター', description: '運命のタペストリーに織り込まれた異常存在、あなたは理性と混沌の縁で踊る。現実はあなたの気まぐれに屈し、地下聖堂自体が息を殺しているようだ。あなたの存在という宇宙的な冗談をどう扱っていいのか分からないのだ。(ゲームに勝利してアンロック)', initialHealth: 1, initialLuck: 100,
    initialEquipment: { 
      head: { name: '挑発の帽子', type: 'equippable', slot: 'head', description: '派手な羽飾りがついた、ばかばかしいほど大きな帽子。不要な注目を集めるようだ。'}, 
      body: null, hands: null, feet: null, back: null, 
      waist: { name: '中身不明のポーチ', type: 'equippable', slot: 'waist', description: 'きつく締められた、目立たない小さな革のポーチ。振っても音はしないが、*何か*が入っている感じがする。'}, 
      companion: { name: '虚勢を張る幻影', type: 'equippable', slot: 'companion', description: 'あなたについてくる半透明で、ぼんやりと人型の姿。無生物に対して常に大げさで空虚な脅しをかけるが、本当の危険からは逃げ出す。'} 
    }, 
    initialInventory: [
      { name: '輝くが価値のないコイン', type: 'quest', description: '魅力的に輝く大きな金色のコイン。安い金属でできており、実際の価値はない。'},
      { name: '違反警告のイエローカード', type: 'quest', description: '硬い明るい黄色のカード。これを持っていると、何か暗黙のルールを破った人にそれを見せたいという不可解な衝動に駆られる。'},
      { name: '白紙の巻物', type: 'quest', description: '手付かずの羊皮紙の巻物。完全に空だが、読むためのものだと感じる。'},
    ],
    startingPrompt: 'あなたはトリックスターです。現実はあなたの遊び場です。あるいはそうでした。間違った宇宙的存在にいたずらをしたのかもしれないし、あるいはただ退屈してこの次元につまずき込んだだけかもしれません。あなたは石の上ではなく、鮮やかな色でキーキー鳴るゴム製の鶏の上で目覚めます。あなたの周りの地下聖堂は、あなたの存在そのものに腹を立てているようです。松明は神経質にちらつき、影は縮こまっているようです。あなたの幻の仲間は、特に頑固な苔と口論しています。ルールはあなたには適用されないようですが、この場所の危険は非常に、非常に現実的です。これは楽しくなるはずです。'
  },
  'es': { id: 'trickster', name: 'Embaucador', description: 'Una anomalía tejida en el tapiz del destino, danzas al borde de la razón y el caos. La realidad se pliega a tus caprichos, y la propia cripta parece contener el aliento, insegura de qué hacer con la broma cósmica que es tu existencia. (Desbloqueado al ganar el juego)', initialHealth: 1, initialLuck: 100,
    initialEquipment: { 
      head: { name: 'Sombrero de Burla', type: 'equippable', slot: 'head', description: 'Un sombrero ridículamente grande con una pluma llamativa. Parece atraer atención no deseada.'}, 
      body: null, hands: null, feet: null, back: null, 
      waist: { name: 'Bolsa de Contenido Desconocido', type: 'equippable', slot: 'waist', description: 'Una pequeña y discreta bolsa de cuero que está bien cerrada. Agitarla no produce sonido, pero se siente como si contuviera *algo*.'}, 
      companion: { name: 'Fantasma Fanfarrón', type: 'equippable', slot: 'companion', description: 'Una forma translúcida y vagamente humanoide que te sigue. Constantemente hace amenazas grandiosas y vacías a objetos inanimados, pero huye de cualquier peligro real.'} 
    }, 
    initialInventory: [
      { name: 'Moneda Brillante pero sin Valor', type: 'quest', description: 'Una moneda grande de color dorado que brilla de forma atractiva. Está hecha de metal barato y no tiene valor real.'},
      { name: 'Una Tarjeta Amarilla por Infracción', type: 'quest', description: 'Una tarjeta rígida de color amarillo brillante. Sostenerla te da un impulso inexplicable de mostrársela a alguien que ha roto alguna regla tácita.'},
      { name: 'Pergamino en Blanco', type: 'quest', description: 'Un rollo prístino de pergamino. Está completamente vacío, pero sientes que está destinado a ser leído.'},
    ],
    startingPrompt: 'Eres el Embaucador. La realidad es tu patio de recreo. O lo era. Tal vez le gastaste una broma a la entidad cósmica equivocada, o quizás simplemente te aburriste y tropezaste en esta dimensión. Despiertas no sobre piedra, sino sobre un pollo de goma de colores brillantes y chirriante. La cripta a tu alrededor parece ofenderse por tu mera presencia; las antorchas parpadean nerviosamente y las sombras parecen encogerse. Tu compañero fantasma está discutiendo con un trozo de musgo particularmente terco. Las reglas no parecen aplicarse a ti, pero los peligros en este lugar son muy, muy reales. Esto debería ser divertido.'
  },
  'ko': { id: 'trickster', name: '사기꾼', description: '운명의 직물에 짜인 변칙적인 존재, 당신은 이성과 혼돈의 가장자리에서 춤을 춥니다. 현실은 당신의 변덕에 휘어지고, 지하실 자체도 당신이라는 우주적 농담을 어떻게 대해야 할지 몰라 숨을 죽이는 것 같습니다. (게임에서 승리하여 잠금 해제)', initialHealth: 1, initialLuck: 100,
    initialEquipment: { 
      head: { name: '도발의 모자', type: 'equippable', slot: 'head', description: '화려한 깃털이 달린 우스꽝스럽게 큰 모자. 원치 않는 관심을 끄는 것 같습니다.'}, 
      body: null, hands: null, feet: null, back: null, 
      waist: { name: '내용물 불명의 주머니', type: 'equippable', slot: 'waist', description: '단단히 묶인 눈에 띄지 않는 작은 가죽 주머니. 흔들어도 소리가 나지 않지만 *무언가* 들어있는 느낌이 듭니다.'}, 
      companion: { name: '허세 부리는 환영', type: 'equippable', slot: 'companion', description: '당신을 따라다니는 반투명하고 막연히 인간 형태의 모습. 무생물에게 끊임없이 거창하고 공허한 위협을 가하지만 실제 위험에서는 도망칩니다.'} 
    }, 
    initialInventory: [
      { name: '반짝이지만 가치 없는 동전', type: 'quest', description: '매력적으로 빛나는 큰 금색 동전. 값싼 금속으로 만들어져 실제 가치는 없습니다.'},
      { name: '위반 경고용 옐로카드', type: 'quest', description: '뻣뻣하고 밝은 노란색 카드. 이것을 들고 있으면 암묵적인 규칙을 어긴 사람에게 보여주고 싶은 설명할 수 없는 충동을 느낍니다.'},
      { name: '빈 두루마리', type: 'quest', description: '깨끗한 양피지 두루마리. 완전히 비어 있지만 읽기 위한 것이라고 느껴집니다.'},
    ],
    startingPrompt: '당신은 사기꾼입니다. 현실은 당신의 놀이터입니다. 혹은 그랬었죠. 잘못된 우주적 존재에게 장난을 쳤거나, 아니면 그냥 지루해서 이 차원으로 넘어진 것일 수도 있습니다. 당신은 돌 위가 아니라 밝은 색의 삑삑거리는 고무 닭 위에서 깨어납니다. 주위의 지하실은 당신의 존재 자체에 불쾌감을 느끼는 것 같습니다. 횃불은 신경질적으로 깜박이고 그림자는 움츠러드는 것 같습니다. 당신의 환영 동료는 특히 완고한 이끼 조각과 말다툼을 벌이고 있습니다. 규칙은 당신에게 적용되지 않는 것 같지만, 이곳의 위험은 매우, 매우 현실적입니다. 이건 재미있을 겁니다.'
  },
};

export const ALL_PLAYER_CLASSES: Record<Language, PlayerClass[]> = {
    'en': [KNIGHT_CLASS['en'], ROGUE_CLASS['en'], SCHOLAR_CLASS['en']],
    'zh-TW': [KNIGHT_CLASS['zh-TW'], ROGUE_CLASS['zh-TW'], SCHOLAR_CLASS['zh-TW']],
    'ja': [KNIGHT_CLASS['ja'], ROGUE_CLASS['ja'], SCHOLAR_CLASS['ja']],
    'es': [KNIGHT_CLASS['es'], ROGUE_CLASS['es'], SCHOLAR_CLASS['es']],
    'ko': [KNIGHT_CLASS['ko'], ROGUE_CLASS['ko'], SCHOLAR_CLASS['ko']],
}