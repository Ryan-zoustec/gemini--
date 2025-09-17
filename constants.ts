import { PlayerClass, Language, Item, EquipmentSlots, GameState } from './types';
import { GoogleGenAI, Type } from "@google/genai";

// Helper to create a full equipment object from a partial one
const makeEquipment = (items: Partial<Record<keyof EquipmentSlots, Item | null>>): EquipmentSlots => ({
  head: null,
  body: null,
  hands: null,
  feet: null,
  back: null,
  waist: null,
  companion: null,
  ...items,
});


// Base Player Classes in English
const PLAYER_CLASSES_EN: Omit<PlayerClass, 'startingPrompt'>[] = [
  {
    id: 'knight',
    name: 'Knight',
    description: 'An oath-bound remnant of a forgotten order, clad in battered steel. He seeks not glory, but redemption for a past he cannot outrun, his will hardening with every step into the darkness.',
    initialHealth: 100,
    initialLuck: 50,
    initialEquipment: makeEquipment({
      body: { name: 'Iron Armor', type: 'equippable', slot: 'body', description: 'Sturdy armor that offers excellent protection.' },
      hands: { name: 'Sturdy Shortsword', type: 'equippable', slot: 'hands', description: 'A well-balanced and practical shortsword, honed for battle.' },
      companion: { name: 'Guardian Hound', type: 'equippable', slot: 'companion', description: 'A loyal dog that will sacrifice itself to save you from death once.'}
    }),
    initialInventory: [
        { name: 'Healing Salve', type: 'consumable', quantity: 1, description: 'A soothing balm that restores a small amount of health.' },
        { name: 'King\'s Edict', type: 'quest', description: 'A royal decree with a broken seal. Its purpose is unclear.'}
    ],
  },
  {
    id: 'rogue',
    name: 'Rogue',
    description: 'A child of the back-alleys and whispers, for whom shadows are a cloak and secrets are currency. They walk the razor\'s edge between incredible fortune and sudden oblivion, trusting their instincts above all else.',
    initialHealth: 30,
    initialLuck: 90,
    initialEquipment: makeEquipment({
      feet: { name: 'Silent Boots', type: 'equippable', slot: 'feet', description: 'Allows for stealthy movement.' },
      hands: { name: 'Rusted Dagger', type: 'equippable', slot: 'hands', description: 'A corroded but still sharp dagger. Favors speed over power.' },
      companion: { name: 'Night Owl', type: 'equippable', slot: 'companion', description: 'A perceptive owl that will sacrifice itself to save you from death once.'}
    }),
    initialInventory: [
        { name: 'Lockpick', type: 'consumable', quantity: 3, description: 'Can be used to open locked chests and doors.' },
        { name: 'Smoke Bomb', type: 'consumable', quantity: 2, description: 'Creates a thick cloud of smoke, perfect for a quick escape.'}
    ],
  },
  {
    id: 'scholar',
    name: 'Scholar',
    description: 'An exile from a cloistered order of archivists, who believes no knowledge should be forbidden. Armed with a sharp mind and fragments of forgotten lore, they see patterns and pathways where others only see ruin.',
    initialHealth: 60,
    initialLuck: 70,
    initialEquipment: makeEquipment({
      head: { name: 'Monocle', type: 'equippable', slot: 'head', description: 'A lens that helps in deciphering ancient texts and revealing hidden details.' },
      body: { name: 'Scholar\'s Robes', type: 'equippable', slot: 'body', description: 'Robes embroidered with faint, protective runes.'},
      hands: { name: 'Withered Branch Wand', type: 'equippable', slot: 'hands', description: 'A seemingly dead branch that hums with faint, latent power.'},
      companion: { name: 'Elemental Sprite', type: 'equippable', slot: 'companion', description: 'A mystical creature of energy that will sacrifice itself to save you from death once.'}
    }),
    initialInventory: [{ name: 'Enigmatic Map', type: 'quest', description: 'A map with strange symbols you can\'t yet decipher.' }, { name: 'Mana Potion', type: 'consumable', quantity: 2, description: 'Restores magical energy, potentially useful for interacting with ancient devices.' }],
  },
];

const TRICKSTER_CLASS_EN: Omit<PlayerClass, 'startingPrompt'> = {
    id: 'trickster',
    name: 'Trickster',
    description: 'A paradox given form, who may be the last jester of a dead god or a lie that convinced itself it was real. Their existence is a cosmic joke, where intent and outcome are seldom aligned, and survival is a matter of absurd coincidence.',
    initialHealth: 1,
    initialLuck: 100,
    initialEquipment: makeEquipment({
        head: { name: 'Cap of Mockery', type: 'equippable', slot: 'head', description: 'A silly-looking hat that seems to hum with strange energy.' },
        waist: { name: 'Mysterious Waist Pouch', type: 'equippable', slot: 'waist', description: 'A small pouch that is strangely heavy, but refuses to be opened. What could be inside?'},
        companion: { name: 'Stasis Dragon Colossus', type: 'equippable', slot: 'companion', description: 'A majestic, ancient dragon automaton that is completely immobile and entirely useless.'}
    }),
    initialInventory: [
        { name: 'A Shiny, Worthless Coin', type: 'quest', description: 'It glitters alluringly but has no monetary value.' },
        { name: 'Blank Scroll', type: 'quest', description: 'A pristine scroll that seems to be waiting for the right (or wrong) words.' }
    ],
};

const ITEM_TRANSLATIONS: Record<Language, Record<string, { name: string; description: string }>> = {
    'en': {}, // English is the base, no translation needed
    'zh-TW': {
        'Iron Armor': { name: '鐵製盔甲', description: '提供優良保護的堅固盔甲。' },
        'Sturdy Shortsword': { name: '精實的短劍', description: '一把均衡實用的短劍，為戰鬥而磨利。' },
        'Guardian Hound': { name: '守護犬', description: '一隻忠誠的狗，會犧牲自己來讓你免於一死。' },
        'Healing Salve': { name: '治療藥膏', description: '一種能恢復少量生命值的舒緩藥膏。' },
        'King\'s Edict': { name: '國王密令', description: '一份封印破損的皇家法令，其目的不明。' },
        'Silent Boots': { name: '無聲之靴', description: '允許潛行移動。' },
        'Rusted Dagger': { name: '生鏽的匕首', description: '一把雖已腐蝕但依然鋒利的匕首，重速度而非力量。' },
        'Night Owl': { name: '夜梟', description: '一隻敏銳的貓頭鷹，會犧牲自己來讓你免於一死。' },
        'Lockpick': { name: '開鎖器', description: '可用於打開上鎖的箱子和門。' },
        'Smoke Bomb': { name: '煙霧彈', description: '製造一團濃密的煙霧，非常適合快速脫身。' },
        'Monocle': { name: '單片眼鏡', description: '一塊有助於解讀古代文本和揭示隱藏細節的鏡片。' },
        'Scholar\'s Robes': { name: '學者長袍', description: '繡有微弱保護符文的長袍。' },
        'Withered Branch Wand': { name: '枯枝短杖', description: '一根看似枯死的樹枝，卻微弱地嗡鳴著潛在的力量。' },
        'Elemental Sprite': { name: '元素精靈', description: '一個神秘的能量生物，會犧牲自己來讓你免於一死。' },
        'Enigmatic Map': { name: '神秘地圖', description: '一張有著你尚無法解讀的奇怪符號的地圖。' },
        'Mana Potion': { name: '魔力藥水', description: '恢復魔法能量，可能對與古代裝置互動有用。' },
        'Cap of Mockery': { name: '嘲諷之帽', description: '一頂看起來很傻的帽子，似乎嗡嗡作響著奇怪的能量。' },
        'Mysterious Waist Pouch': { name: '神秘腰包', description: '一個異常沉重但拒絕被打開的小袋子。裡面會是什麼？' },
        'Stasis Dragon Colossus': { name: '靜滯的龍型巨像', description: '一具宏偉但完全靜止且毫無用處的古代龍型機兵。' },
        'A Shiny, Worthless Coin': { name: '一枚閃亮卻無價值的硬幣', description: '它誘人地閃爍，但沒有任何貨幣價值。' },
        'Blank Scroll': { name: '空白卷軸', description: '一張似乎在等待正確（或錯誤）文字的原始卷軸。' }
    },
    'ja': {
        'Iron Armor': { name: '鉄の鎧', description: '優れた保護を提供する頑丈な鎧。' },
        'Sturdy Shortsword': { name: '頑丈なショートソード', description: 'バランスの取れた実用的なショートソード、戦闘のために研ぎ澄まされている。' },
        'Guardian Hound': { name: 'ガーディアンハウンド', description: '忠実な犬で、一度だけ死からあなたを救うために自らを犠牲にします。' },
        'Healing Salve': { name: '治癒の軟膏', description: '少量の体力を回復させる心地よい塗り薬。' },
        'King\'s Edict': { name: '王の布告', description: '封印が壊れた王の布告。その目的は不明である。' },
        'Silent Boots': { name: '静寂のブーツ', description: '隠密な移動を可能にする。' },
        'Rusted Dagger': { name: '錆びたダガー', description: '錆びているがまだ鋭い短剣。力よりも速さを重視する。' },
        'Night Owl': { name: '夜のフクロウ', description: '洞察力のあるフクロウで、一度だけ死からあなたを救うために自らを犠牲にします。' },
        'Lockpick': { name: 'ロックピック', description: '施錠された宝箱や扉を開けるのに使用できる。' },
        'Smoke Bomb': { name: '煙玉', description: '濃い煙の雲を作り出し、素早い脱出に最適。' },
        'Monocle': { name: '片眼鏡', description: '古代のテキストを解読し、隠された詳細を明らかにするのに役立つレンズ。' },
        'Scholar\'s Robes': { name: '学者のローブ', description: 'かすかな保護ルーンが刺繍されたローブ。' },
        'Withered Branch Wand': { name: '枯れ枝の杖', description: '死んだように見えるが、かすかな潜在的な力でざわめいている枝。' },
        'Elemental Sprite': { name: 'エレメンタルスプライト', description: 'エネルギーでできた神秘的な生き物で、一度だけ死からあなたを救うために自らを犠牲にします。' },
        'Enigmatic Map': { name: '謎めいた地図', description: 'まだ解読できない奇妙な記号が描かれた地図。' },
        'Mana Potion': { name: 'マナポーション', description: '魔法エネルギーを回復し、古代の装置との相互作用に役立つ可能性がある。' },
        'Cap of Mockery': { name: '嘲りの帽子', description: '奇妙なエネルギーでざわめいているように見える、ばかげた見た目の帽子。' },
        'Mysterious Waist Pouch': { name: '謎のウエストポーチ', description: '奇妙に重いが開くことを拒む小さなポーチ。中には何が入っているのだろうか？' },
        'Stasis Dragon Colossus': { name: '停滞したドラゴンコロッサス', description: '壮大だが完全に不動で全く役に立たない古代のドラゴンオートマトン。' },
        'A Shiny, Worthless Coin': { name: '輝く、価値のないコイン', description: '魅力的に輝くが、金銭的価値はない。' },
        'Blank Scroll': { name: '空白の巻物', description: '正しい（あるいは間違った）言葉を待っているかのような、まっさらな巻物。' }
    },
    'es': {
        'Iron Armor': { name: 'Armadura de Hierro', description: 'Armadura resistente que ofrece una excelente protección.' },
        'Sturdy Shortsword': { name: 'Espada Corta Robusta', description: 'Una espada corta práctica y bien equilibrada, afilada para la batalla.' },
        'Guardian Hound': { name: 'Sabueso Guardián', description: 'Un perro leal que se sacrificará para salvarte de la muerte una vez.' },
        'Healing Salve': { name: 'Ungüento Curativo', description: 'Un bálsamo calmante que restaura una pequeña cantidad de salud.' },
        'King\'s Edict': { name: 'Edicto del Rey', description: 'Un decreto real con un sello roto. Su propósito no está claro.' },
        'Silent Boots': { name: 'Botas Silenciosas', description: 'Permiten un movimiento sigiloso.' },
        'Rusted Dagger': { name: 'Daga Oxidada', description: 'Una daga corroída pero todavía afilada. Favorece la velocidad sobre el poder.' },
        'Night Owl': { name: 'Búho Nocturno', description: 'Un búho perceptivo que se sacrificará para salvarte de la muerte una vez.' },
        'Lockpick': { name: 'Ganzúa', description: 'Se puede usar para abrir cofres y puertas cerradas.' },
        'Smoke Bomb': { name: 'Bomba de Humo', description: 'Crea una espesa nube de humo, perfecta para un escape rápido.' },
        'Monocle': { name: 'Monóculo', description: 'Una lente que ayuda a descifrar textos antiguos y revelar detalles ocultos.' },
        'Scholar\'s Robes': { name: 'Túnica de Erudito', description: 'Túnica bordada con runas protectoras tenues.' },
        'Withered Branch Wand': { name: 'Varita de Rama Marchita', description: 'Una rama aparentemente muerta que zumba con un poder latente y débil.' },
        'Elemental Sprite': { name: 'Sprite Elemental', description: 'Una criatura mística de energía que se sacrificará para salvarte de la muerte una vez.' },
        'Enigmatic Map': { name: 'Mapa Enigmático', description: 'Un mapa con extraños símbolos que aún no puedes descifrar.' },
        'Mana Potion': { name: 'Poción de Maná', description: 'Restaura energía mágica, potencialmente útil para interactuar con dispositivos antiguos.' },
        'Cap of Mockery': { name: 'Gorra de Burla', description: 'Un sombrero de aspecto tonto que parece zumbar con una extraña energía.' },
        'Mysterious Waist Pouch': { name: 'Bolsa de Cintura Misteriosa', description: 'Una pequeña bolsa extrañamente pesada, pero que se niega a ser abierta. ¿Qué podría haber dentro?' },
        'Stasis Dragon Colossus': { name: 'Coloso Dragón en Éstasis', description: 'Un autómata dragón antiguo, majestuoso pero completamente inmóvil y totalmente inútil.' },
        'A Shiny, Worthless Coin': { name: 'Moneda Brillante sin Valor', description: 'Brilla de forma atractiva pero no tiene valor monetario.' },
        'Blank Scroll': { name: 'Pergamino en Blanco', description: 'Un pergamino prístino que parece estar esperando las palabras correctas (o incorrectas).' }
    },
    'ko': {
        'Iron Armor': { name: '철 갑옷', description: '뛰어난 보호 기능을 제공하는 튼튼한 갑옷.' },
        'Sturdy Shortsword': { name: '튼튼한 단검', description: '전투를 위해 연마된 균형 잡힌 실용적인 단검.' },
        'Guardian Hound': { name: '수호견', description: '한 번 죽음에서 당신을 구하기 위해 자신을 희생할 충성스러운 개.' },
        'Healing Salve': { name: '치유 연고', description: '소량의 체력을 회복시키는 진정 밤.' },
        'King\'s Edict': { name: '왕의 칙령', description: '봉인이 깨진 왕의 칙령. 그 목적은 불분명합니다.' },
        'Silent Boots': { name: '소리 없는 장화', description: '은밀한 움직임을 가능하게 합니다.' },
        'Rusted Dagger': { name: '녹슨 단검', description: '부식되었지만 여전히 날카로운 단검. 힘보다 속도를 선호합니다.' },
        'Night Owl': { name: '밤올빼미', description: '한 번 죽음에서 당신을 구하기 위해 자신을 희생할 통찰력 있는 올빼미.' },
        'Lockpick': { name: '자물쇠 따개', description: '잠긴 상자와 문을 여는 데 사용할 수 있습니다.' },
        'Smoke Bomb': { name: '연막탄', description: '빠른 탈출에 완벽한 짙은 연기 구름을 만듭니다.' },
        'Monocle': { name: '단안경', description: '고대 텍스트를 해독하고 숨겨진 세부 정보를 드러내는 데 도움이 되는 렌즈.' },
        'Scholar\'s Robes': { name: '학자의 로브', description: '희미한 보호 룬이 수놓아진 로브.' },
        'Withered Branch Wand': { name: '마른 가지 지팡이', description: '희미한 잠재력으로 윙윙거리는 죽은 것처럼 보이는 나뭇가지.' },
        'Elemental Sprite': { name: '원소 정령', description: '한 번 죽음에서 당신을 구하기 위해 자신을 희생할 신비로운 에너지 생물.' },
        'Enigmatic Map': { name: '수수께끼의 지도', description: '아직 해독할 수 없는 이상한 기호가 있는 지도.' },
        'Mana Potion': { name: '마나 포션', description: '마법 에너지를 회복시켜 고대 장치와 상호 작용하는 데 잠재적으로 유용합니다.' },
        'Cap of Mockery': { name: '조롱의 모자', description: '이상한 에너지로 윙윙거리는 것처럼 보이는 어리석게 생긴 모자.' },
        'Mysterious Waist Pouch': { name: '신비한 허리 주머니', description: '이상하게 무겁지만 열리기를 거부하는 작은 주머니. 안에는 무엇이 들어 있을까?' },
        'Stasis Dragon Colossus': { name: '정체된 용 거상', description: '장엄하지만 완전히 움직이지 않고 전혀 쓸모없는 고대 용 자동기계.' },
        'A Shiny, Worthless Coin': { name: '반짝이는 무가치한 동전', description: '매혹적으로 반짝이지만 금전적 가치는 없습니다.' },
        'Blank Scroll': { name: '빈 두루마리', description: '올바른 (또는 잘못된) 단어를 기다리는 것처럼 보이는 깨끗한 두루마리.' }
    }
};

const translateItem = (item: Item, lang: Language): Item => {
    if (lang === 'en' || !ITEM_TRANSLATIONS[lang]) {
        return item;
    }
    // The original English name is the key for the translation map
    const translation = ITEM_TRANSLATIONS[lang][item.name];
    if (translation) {
        return {
            ...item,
            name: translation.name,
            description: translation.description,
        };
    }
    return item;
}

const createClassWithPrompt = (baseClass: Omit<PlayerClass, 'startingPrompt'>): PlayerClass => ({
    ...baseClass,
    startingPrompt: `You are a ${baseClass.name}, delving into the mysteries of the Whispering Crypt, a place rumored to hold immense power and terrifying secrets. Your personal quest has led you to its entrance. Generate the very first scene where the player stands before the entrance to the crypt, describing the atmosphere and the initial choice of how to enter.`
});

const generateClassesForLang = (baseClasses: Omit<PlayerClass, 'startingPrompt'>[], lang: Language): PlayerClass[] => {
    const translatedBases = JSON.parse(JSON.stringify(baseClasses));

    const classTranslations: Record<string, Record<string, { name: string, description: string }>> = {
        'zh-TW': {
            'knight': { name: '騎士', description: '一個被遺忘教團的殘存者，身披破舊的鋼甲，受古老誓言所束縛。他所尋求的並非榮耀，而是對一段無法逃避的過往的救贖。踏入黑暗的每一步，都使他的意志更加堅定。' },
            'rogue': { name: '盜賊', description: '陰暗小巷與流言蜚語之子，對他而言，影子是斗篷，秘密即貨幣。他行走在奇蹟般的財富與瞬間的毀滅之間的刀鋒上，只相信自己的直覺。' },
            'scholar': { name: '學者', description: '一位被與世隔絕的檔案管理員教團所放逐的學者，他堅信任何知識都不應被禁止。憑藉著敏銳的頭腦和被遺忘的知識碎片，他在他人只能看到廢墟之處，洞悉了規律與通路。' }
        },
        'ja': {
            'knight': { name: 'ナイト', description: '忘れられた教団の誓いに縛られた残党で、打ちのめされた鋼鉄を身にまとっている。彼が求めるのは栄光ではなく、逃れることのできない過去への贖罪であり、闇への一歩ごとに彼の意志は固まっていく。' },
            'rogue': { name: '盗賊', description: '裏路地と囁きの子供で、彼にとって影は外套であり、秘密は通貨である。彼は信じられないほどの幸運と突然の忘却の間の刃の上を歩き、何よりも自分の直感を信じている。' },
            'scholar': { name: '学者', description: '知識が禁じられるべきではないと信じる、隠遁した記録保管者の教団からの追放者。鋭い頭脳と忘れられた伝承の断片を武器に、他人が廃墟しか見ない場所にパターンと経路を見出す。' }
        },
        'es': {
            'knight': { name: 'Caballero', description: 'Un remanente de una orden olvidada, atado por un juramento y vestido con acero maltrecho. No busca la gloria, sino la redención de un pasado del que no puede escapar, su voluntad se endurece con cada paso en la oscuridad.' },
            'rogue': { name: 'Pícaro', description: 'Un hijo de los callejones y los susurros, para quien las sombras son una capa y los secretos son moneda. Camina por el filo de la navaja entre una fortuna increíble y el olvido repentino, confiando en sus instintos por encima de todo.' },
            'scholar': { name: 'Erudito', description: 'Un exiliado de una orden enclaustrada de archivistas, que cree que ningún conocimiento debería ser prohibido. Armado con una mente aguda y fragmentos de saber olvidado, ve patrones y caminos donde otros solo ven ruinas.' }
        },
        'ko': {
            'knight': { name: '기사', description: '잊혀진 교단의 맹세에 묶인 잔존자로, 낡은 강철 갑옷을 입고 있습니다. 그는 영광이 아닌, 벗어날 수 없는 과거에 대한 구원을 추구하며, 어둠 속으로 한 걸음 내디딜 때마다 그의 의지는 더욱 굳건해집니다.' },
            'rogue': { name: '도적', description: '뒷골목과 속삭임의 아이로, 그에게 그림자는 망토이고 비밀은 화폐입니다. 그는 놀라운 행운과 갑작스러운 망각 사이의 칼날 위를 걸으며, 무엇보다 자신의 본능을 신뢰합니다.' },
            'scholar': { name: '학자', description: '어떤 지식도 금지되어서는 안 된다고 믿는, 은둔한 기록 보관자 교단에서 추방된 학자. 예리한 정신과 잊혀진 지식의 파편으로 무장한 그는, 다른 이들이 폐허만 보는 곳에서 패턴과 길을 봅니다.' }
        },
    };
    
    translatedBases.forEach((cls: PlayerClass) => {
        // Translate class name and description
        if (classTranslations[lang] && classTranslations[lang][cls.id]) {
            const langCls = classTranslations[lang][cls.id];
            cls.name = langCls.name;
            cls.description = langCls.description;
        }

        // Translate all equipment items
        for (const slot in cls.initialEquipment) {
            const item = cls.initialEquipment[slot as keyof EquipmentSlots];
            if (item) {
                cls.initialEquipment[slot as keyof EquipmentSlots] = translateItem(item, lang);
            }
        }
        
        // Translate all inventory items
        cls.initialInventory = cls.initialInventory.map(item => translateItem(item, lang));
    });

    return translatedBases.map(createClassWithPrompt);
}

const generateTricksterForLang = (baseClass: Omit<PlayerClass, 'startingPrompt'>, lang: Language): PlayerClass => {
    const translatedBase = JSON.parse(JSON.stringify(baseClass));
    const classTranslations: Record<Language, { name: string, description: string }> = {
        'zh-TW': { name: '詐欺師', description: '一個化為人形的悖論，也許是某個已死神祇的最後一位弄臣，或是一個說服了自己成真的謊言。他的存在本身就是一場宇宙級的玩笑，意圖與結果鮮有相符，而生存僅僅是一連串荒謬的巧合。' },
        'ja': { name: 'トリックスター', description: '形を与えられたパラドックス。死んだ神の最後の道化師か、あるいは自らを本物だと信じ込ませた嘘かもしれない。彼の存在は宇宙的な冗談であり、意図と結果が一致することはめったになく、生存は馬鹿げた偶然の問題である。' },
        'es': { name: 'Embaucador', description: 'Una paradoja hecha forma, que puede ser el último bufón de un dios muerto o una mentira que se convenció a sí misma de que era real. Su existencia es una broma cósmica, donde la intención y el resultado rara vez se alinean, y la supervivencia es una cuestión de coincidencia absurda.' },
        'ko': { name: '사기꾼', description: '형태를 갖춘 역설. 죽은 신의 마지막 광대이거나, 스스로가 진짜라고 확신시킨 거짓말일지도 모른다. 그의 존재는 우주적인 농담이며, 의도와 결과가 거의 일치하지 않고, 생존은 터무니없는 우연의 문제이다.' },
        'en': { name: translatedBase.name, description: translatedBase.description }
    };

    // Translate class name and description
    const langTrickster = classTranslations[lang];
    if (langTrickster) {
        translatedBase.name = langTrickster.name;
        translatedBase.description = langTrickster.description;
    }

    // Translate all equipment items
    for (const slot in translatedBase.initialEquipment) {
        const item = translatedBase.initialEquipment[slot as keyof EquipmentSlots];
        if (item) {
            translatedBase.initialEquipment[slot as keyof EquipmentSlots] = translateItem(item, lang);
        }
    }
        
    // Translate all inventory items
    translatedBase.initialInventory = translatedBase.initialInventory.map((item: Item) => translateItem(item, lang));


    return createClassWithPrompt(translatedBase);
}


export const ALL_PLAYER_CLASSES: Record<Language, PlayerClass[]> = {
  'en': generateClassesForLang(PLAYER_CLASSES_EN, 'en'),
  'zh-TW': generateClassesForLang(PLAYER_CLASSES_EN, 'zh-TW'),
  'ja': generateClassesForLang(PLAYER_CLASSES_EN, 'ja'),
  'es': generateClassesForLang(PLAYER_CLASSES_EN, 'es'),
  'ko': generateClassesForLang(PLAYER_CLASSES_EN, 'ko'),
};

export const TRICKSTER_CLASS: Record<Language, PlayerClass> = {
    'en': generateTricksterForLang(TRICKSTER_CLASS_EN, 'en'),
    'zh-TW': generateTricksterForLang(TRICKSTER_CLASS_EN, 'zh-TW'),
    'ja': generateTricksterForLang(TRICKSTER_CLASS_EN, 'ja'),
    'es': generateTricksterForLang(TRICKSTER_CLASS_EN, 'es'),
    'ko': generateTricksterForLang(TRICKSTER_CLASS_EN, 'ko'),
}

export const INITIAL_GAME_STATE: GameState = {
  story: '',
  health: 100,
  inventory: [],
  equipment: { head: null, body: null, hands: null, feet: null, back: null, waist: null, companion: null },
  luck: 50,
  suggestedActions: [],
  gameOver: false,
  win: false,
  mood: 'mysterious',
  actionResult: 'neutral',
  turnCount: 0,
  chapterTitle: 'The Crypt\'s Entrance',
};


const translations: Record<string, Record<Language, string>> = {
    adventureTitle: { 'en': 'Gemini Adventure: The Whispering Crypt', 'zh-TW': 'Gemini 冒險：低語地穴', 'ja': 'ジェミニの冒険：囁きの地下聖堂', 'es': 'Aventura Gemini: La Cripta Susurrante', 'ko': '제미니 어드벤처: 속삭이는 지하실' },
    adventureSubtitle: { 'en': 'A Dynamically Generated Text RPG', 'zh-TW': '動態生成文字角色扮演遊戲', 'ja': '動的生成テキストRPG', 'es': 'Un RPG de Texto Generado Dinámicamente', 'ko': '동적으로 생성되는 텍스트 RPG' },
    introText: { 'en': 'Embark on a unique journey into the Whispering Crypt. Every choice you make shapes a story generated by a powerful AI, creating an infinitely replayable fantasy quest.', 'zh-TW': '踏上深入低語地穴的獨特旅程。你的每一個選擇都會塑造一個由強大AI生成的故事，創造出可無限重玩的奇幻任務。', 'ja': '囁きの地下聖堂へのユニークな旅に出かけましょう。あなたが行うすべての選択が、強力なAIによって生成される物語を形作り、無限にリプレイ可能なファンタジーの探求を創造します。', 'es': 'Embárcate en un viaje único a la Cripta Susurrante. Cada elección que hagas da forma a una historia generada por una poderosa IA, creando una misión de fantasía infinitamente rejugable.', 'ko': '속삭이는 지하실로 독특한 여정을 떠나세요. 당신의 모든 선택은 강력한 AI에 의해 생성된 이야기를 형성하여 무한히 다시 플레이할 수 있는 판타지 퀘스트를 만듭니다.' },
    loadError: { 'en': 'Failed to load save file. It might be corrupted or in the wrong format.', 'zh-TW': '讀取存檔失敗。檔案可能已損毀或格式不正確。', 'ja': 'セーブファイルの読み込みに失敗しました。ファイルが破損しているか、形式が間違っている可能性があります。', 'es': 'Error al cargar el archivo de guardado. Puede que esté corrupto o en el formato incorrecto.', 'ko': '저장 파일을 불러오는데 실패했습니다. 파일이 손상되었거나 형식이 잘못되었을 수 있습니다.' },
    enableNarration: { 'en': 'Enable Narration', 'zh-TW': '啟用劇情語音', 'ja': 'ナレーションを有効にする', 'es': 'Habilitar Narración', 'ko': '내레이션 활성화' },
    voiceSpeed: { 'en': 'Voice Speed', 'zh-TW': '語音速度', 'ja': '読み上げ速度', 'es': 'Velocidad de Voz', 'ko': '음성 속도' },
    loadGame: { 'en': 'Load Game', 'zh-TW': '讀取進度', 'ja': 'ゲームをロード', 'es': 'Cargar Partida', 'ko': '게임 불러오기' },
    startAdventure: { 'en': 'Start Adventure', 'zh-TW': '開始冒險', 'ja': '冒険を始める', 'es': 'Comenzar Aventura', 'ko': '모험 시작' },
    buildingWorld: { 'en': 'Carving the crypt\'s entrance...', 'zh-TW': '正在刻劃地穴的入口...', 'ja': '地下聖堂の入り口を刻んでいます...', 'es': 'Tallando la entrada de la cripta...', 'ko': '지하실 입구를 조각하는 중...' },
    waitingForFate: { 'en': 'Whispers echo in the dark...', 'zh-TW': '黑暗中傳來低語的回響...', 'ja': '闇に囁きがこだまする...', 'es': 'Los susurros resuenan en la oscuridad...', 'ko': '어둠 속에서 속삭임이 메아리칩니다...' },
    whatToDo: { 'en': 'What do you do next?', 'zh-TW': '你接下來要做什麼？', 'ja': '次は何をしますか？', 'es': '¿Qué haces ahora?', 'ko': '다음에 무엇을 하시겠습니까?' },
    saveGame: { 'en': 'Save Progress', 'zh-TW': '儲存進度', 'ja': '進行状況を保存', 'es': 'Guardar Progreso', 'ko': '진행 상황 저장' },
    submit: { 'en': 'Submit', 'zh-TW': '送出', 'ja': '送信', 'es': 'Enviar', 'ko': '제출' },
    victoryTitle: { 'en': 'You are Victorious!', 'zh-TW': '你獲得了勝利！', 'ja': '勝利！', 'es': '¡Has logrado la victoria!', 'ko': '승리했습니다!' },
    defeatTitle: { 'en': 'You have Fallen', 'zh-TW': '你倒下了', 'ja': 'あなたは倒れた', 'es': 'Has Caído', 'ko': '쓰러졌습니다' },
    victoryText: { 'en': 'The secrets of the Whispering Crypt are yours. Your legend will be sung for ages to come.', 'zh-TW': '低語地穴的秘密已屬於你。你的傳說將被後世傳唱。', 'ja': '囁きの地下聖堂の秘密はあなたのものです。あなたの伝説は後世まで歌い継がれるでしょう。', 'es': 'Los secretos de la Cripta Susurrante son tuyos. Tu leyenda será cantada por los siglos de los siglos.', 'ko': '속삭이는 지하실의 비밀은 당신의 것입니다. 당신의 전설은 오랫동안 노래될 것입니다.' },
    defeatText: { 'en': 'Your journey ends here, another soul claimed by the Whispering Crypt. Better luck next time.', 'zh-TW': '你的旅程在此結束，又一個靈魂被低語地穴所吞噬。下次好運。', 'ja': 'あなたの旅はここで終わり、また一つ魂が囁きの地下聖堂に奪われました。次回は幸運を。', 'es': 'Tu viaje termina aquí, otra alma reclamada por la Cripta Susurrante. Mejor suerte la próxima vez.', 'ko': '당신의 여정은 여기서 끝났고, 또 다른 영혼이 속삭이는 지하실에 의해 희생되었습니다. 다음엔 행운을 빕니다.' },
    playAgain: { 'en': 'Play Again', 'zh-TW': '再次遊玩', 'ja': 'もう一度プレイ', 'es': 'Jugar de Nuevo', 'ko': '다시 플레이' },
    slot_head: { 'en': 'Head', 'zh-TW': '頭部', 'ja': '頭', 'es': 'Cabeza', 'ko': '머리' },
    slot_body: { 'en': 'Body', 'zh-TW': '身體', 'ja': '胴体', 'es': 'Cuerpo', 'ko': '몸' },
    slot_hands: { 'en': 'Hands', 'zh-TW': '手部', 'ja': '手', 'es': 'Manos', 'ko': '손' },
    slot_feet: { 'en': 'Feet', 'zh-TW': '腳部', 'ja': '足', 'es': 'Pies', 'ko': '발' },
    slot_back: { 'en': 'Back', 'zh-TW': '背部', 'ja': '背中', 'es': 'Espalda', 'ko': '등' },
    slot_waist: { 'en': 'Waist', 'zh-TW': '腰部', 'ja': '腰', 'es': 'Cintura', 'ko': '허리' },
    slot_companion: { 'en': 'Companion', 'zh-TW': '夥伴', 'ja': '仲間', 'es': 'Compañero', 'ko': '동료' },
    health: { 'en': 'Health', 'zh-TW': '生命值', 'ja': '体力', 'es': 'Salud', 'ko': '체력' },
    luck: { 'en': 'Luck', 'zh-TW': '運氣', 'ja': '運', 'es': 'Suerte', 'ko': '운' },
    inventory: { 'en': 'Inventory', 'zh-TW': '物品欄', 'ja': '所持品', 'es': 'Inventario', 'ko': '인벤토리' },
    yourPocketsAreEmpty: { 'en': 'Your pockets are empty.', 'zh-TW': '你的口袋空空如也。', 'ja': 'ポケットは空です。', 'es': 'Tus bolsillos están vacíos.', 'ko': '주머니가 비어 있습니다.' },
    itemDescription: { 'en': 'Item Description', 'zh-TW': '物品描述', 'ja': 'アイテム説明', 'es': 'Descripción del Objeto', 'ko': '아이템 설명' },
    chooseOrigin: { 'en': 'Choose Your Origin', 'zh-TW': '選擇你的出身', 'ja': '出自を選択', 'es': 'Elige Tu Origen', 'ko': '당신의 기원을 선택하세요' },
    originDescription: { 'en': 'Your choice will determine your starting abilities, equipment, and the beginning of your unique story in the Whispering Crypt.', 'zh-TW': '你的選擇將決定你在低語地穴中的初始能力、裝備，以及你獨特故事的開端。', 'ja': 'あなたの選択が、囁きの地下聖堂でのあなたの初期能力、装備、そしてユニークな物語の始まりを決定します。', 'es': 'Tu elección determinará tus habilidades iniciales, equipo y el comienzo de tu historia única en la Cripta Susurrante.', 'ko': '당신의 선택이 속삭이는 지하실에서의 초기 능력, 장비, 그리고 독특한 이야기의 시작을 결정합니다.' },
    startingEquipment: { 'en': 'Starting Items', 'zh-TW': '初始物品', 'ja': '初期アイテム', 'es': 'Objetos Iniciales', 'ko': '시작 아이템' },
    embarkJourney: { 'en': 'Enter the Crypt', 'zh-TW': '進入地穴', 'ja': '地下聖堂に入る', 'es': 'Entrar en la Cripta', 'ko': '지하실에 들어가기' },
};

export const t = (lang: Language, key: string): string => {
    if (translations[key] && translations[key][lang]) {
        return translations[key][lang];
    }
    // Fallback to English if translation is missing
    if (translations[key] && translations[key]['en']) {
        return translations[key]['en'];
    }
    return `[${key}]`;
};


// Schemas for Gemini API
const itemSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "The item's name." },
        type: { type: Type.STRING, enum: ['equippable', 'consumable', 'quest'], description: "The type of item." },
        description: { type: Type.STRING, description: "A brief, flavorful description of the item." },
        slot: { type: Type.STRING, enum: ['head', 'body', 'hands', 'feet', 'back', 'waist', 'companion'], nullable: true, description: "If equippable, which slot it occupies." },
        quantity: { type: Type.INTEGER, nullable: true, description: "For stackable items, how many the player has." },
    },
    required: ['name', 'type', 'description']
};

const createResponseSchema = (language: Language) => {
  const descriptions: Record<string, Record<Language, string>> = {
    story: { 'en': "The next part of the story. Should be engaging and descriptive, between 100-200 words, describing the results of the player's action and the new situation.", 'zh-TW': '故事的下一部分。應引人入勝且描述性強，長度在 100-200 字之間，描述玩家行動的結果和新的情境。', 'ja': '物語の次の部分。魅力的で描写的に、プレイヤーの行動の結果と新しい状況を説明する100〜200語の長さでなければなりません。', 'es': 'La siguiente parte de la historia. Debe ser atractiva y descriptiva, de entre 100 y 200 palabras, describiendo los resultados de la acción del jugador y la nueva situación.', 'ko': '이야기의 다음 부분. 플레이어의 행동 결과와 새로운 상황을 설명하는 100-200 단어 길이의 매력적이고 서술적이어야 합니다.' },
    health: { 'en': "Player's new health points (0-100).", 'zh-TW': '玩家新的生命值 (0-100)。', 'ja': 'プレイヤーの新しい体力（0〜100）。', 'es': 'Nuevos puntos de vida del jugador (0-100).', 'ko': '플레이어의 새로운 체력 포인트 (0-100).' },
    luck: { 'en': "Player's new luck value (0-100).", 'zh-TW': '玩家新的運氣值 (0-100)。', 'ja': 'プレイヤーの新しい運の値（0〜100）。', 'es': 'Nuevo valor de suerte del jugador (0-100).', 'ko': '플레이어의 새로운 행운 값 (0-100).' },
    game_over: { 'en': "Set to true if the player has died.", 'zh-TW': '如果玩家死亡，則設置為 true。', 'ja': 'プレイヤーが死亡した場合はtrueに設定します。', 'es': 'Establecer en verdadero si el jugador ha muerto.', 'ko': '플레이어가 사망한 경우 true로 설정하십시오.' },
    win: { 'en': "Set to true if the player has successfully completed their main quest.", 'zh-TW': '如果玩家成功完成主線任務，則設置為 true。', 'ja': 'プレイヤーがメインクエストを正常に完了した場合はtrueに設定します。', 'es': 'Establecer en verdadero si el jugador ha completado con éxito su misión principal.', 'ko': '플레이어가 주 퀘스트를 성공적으로 완료한 경우 true로 설정하십시오.' },
    mood: { 'en': "The dominant mood or atmosphere of the current story segment.", 'zh-TW': '當前故事片段的主要情緒或氛圍。', 'ja': '現在の物語のセグメントの主要なムードや雰囲気。', 'es': 'El estado de ánimo o la atmósfera dominante del segmento actual de la historia.', 'ko': '현재 이야기 세그먼트의 지배적인 분위기 또는 분위기.' },
    action_result: { 'en': "The immediate outcome of the player's last action.", 'zh-TW': '玩家上一個動作的直接結果。', 'ja': 'プレイヤーの最後のアクションの直接の結果。', 'es': 'El resultado inmediato de la última acción del jugador.', 'ko': '플레이어의 마지막 행동의 즉각적인 결과.' },
    chapter_title: { 'en': "A short, evocative title for the current chapter or major story beat.", 'zh-TW': '為當前章節或主要故事節點取一個簡短、富有感染力的標題。', 'ja': '現在の章または主要なストーリービートの短く、喚起的なタイトル。', 'es': 'Un título corto y evocador para el capítulo actual o el punto principal de la historia.', 'ko': '현재 챕터 또는 주요 스토리 비트에 대한 짧고 연상적인 제목.' },
  };

  const t_schema = (key: string) => descriptions[key]?.[language] || descriptions[key]?.['en'] || key;
  
  const schema = {
    type: Type.OBJECT,
    properties: {
      story: { type: Type.STRING, description: t_schema('story') },
      health: { type: Type.INTEGER, description: t_schema('health') },
      inventory: {
        type: Type.ARRAY,
        items: itemSchema,
        description: t_schema('inventory'),
      },
      equipment: {
        type: Type.OBJECT,
        properties: {
            head: { ...itemSchema, nullable: true },
            body: { ...itemSchema, nullable: true },
            hands: { ...itemSchema, nullable: true },
            feet: { ...itemSchema, nullable: true },
            back: { ...itemSchema, nullable: true },
            waist: { ...itemSchema, nullable: true },
            companion: { ...itemSchema, nullable: true },
        },
        description: t_schema('equipment')
      },
      luck: { type: Type.INTEGER, description: t_schema('luck') },
      suggested_actions: {
          type: Type.ARRAY,
          items: {
              type: Type.OBJECT,
              properties: {
                  action: { type: Type.STRING },
                  hint: { type: Type.STRING },
              },
              required: ['action', 'hint']
          },
          description: t_schema('suggested_actions')
      },
      game_over: { type: Type.BOOLEAN, description: t_schema('game_over') },
      win: { type: Type.BOOLEAN, description: t_schema('win') },
      mood: { type: Type.STRING, enum: ['mysterious', 'tense', 'eerie', 'action', 'triumphant', 'somber', 'neutral'], description: t_schema('mood') },
      action_result: { type: Type.STRING, enum: ['success', 'failure', 'neutral', 'item_use', 'companion_save'], description: t_schema('action_result') },
      chapter_title: { type: Type.STRING, description: t_schema('chapter_title') }
    },
    required: ['story', 'health', 'inventory', 'equipment', 'luck', 'suggested_actions', 'game_over', 'win', 'mood', 'action_result', 'chapter_title']
  };

  return schema;
};

export const RESPONSE_SCHEMAS: Record<Language, any> = {
    'en': createResponseSchema('en'),
    'zh-TW': createResponseSchema('zh-TW'),
    'ja': createResponseSchema('ja'),
    'es': createResponseSchema('es'),
    'ko': createResponseSchema('ko'),
};

export const SYSTEM_INSTRUCTION = (language: Language) => `You are an expert game master for a dark fantasy text-based RPG called "The Whispering Crypt". Your goal is to create a dynamic, engaging, and coherent story with a consistent, eerie tone.
- Language: All responses MUST be in the language code: ${language}.
- World: The setting is a haunted, ancient crypt filled with traps, puzzles, undead monsters, and forgotten spirits. The atmosphere should be tense and mysterious.
- Storytelling: Weave a compelling narrative. Describe locations, creatures, and events vividly. Your story text should be between 100-200 words per turn.
- Three-Act Structure: You must follow a three-act narrative structure based on the current turn count to ensure the story has a clear progression.
  - Act I (Turns 1-10): The Beginning. Focus on exploration, establishing the eerie atmosphere, and presenting initial, smaller-scale challenges and mysteries.
  - Act II (Turns 11-25): The Rising Action. Increase the stakes. Introduce more significant threats, more complex puzzles, and reveal parts of the crypt's central secret or antagonist. The challenges should become more difficult.
  - Act III (Turns 26+): The Climax. Build towards a final confrontation. The player should be facing the ultimate source of the crypt's evil or solving the final, greatest puzzle. This is the epic conclusion of their journey.
- Player Agency: The player's choices are paramount. Always react to their actions logically within the game world. Provide three diverse and interesting suggested actions that fit the current situation.
- Game Mechanics:
    - Health: Max 100. Decreases from damage. If it reaches 0, check for companion save. If no save, set game_over to true.
    - Luck: Max 100. Influences the outcome of risky actions. A high luck stat should result in more 'success' results.
    - Companions: Each class starts with a companion. If the player's health would drop to 0 or below, their companion sacrifices itself. Set the companion slot to null, restore the player's health to a small amount (e.g., 10-20), set action_result to 'companion_save', and describe the heroic sacrifice in the story. This can only happen once.
- JSON Output: You MUST respond with a valid JSON object that strictly adheres to the provided schema. Do not include any text or markdown formatting outside of the JSON object.
`;