import { GameState, PlayerClass, Language } from './types';
import { Type } from '@google/genai';

export const PLAYER_CLASSES_BY_LANG: Record<Language, PlayerClass[]> = {
    'zh-TW': [
        {
            id: 'knight',
            name: '騎士',
            description: '一名忠誠的戰士，擅長近身戰鬥。你的榮譽就是你的生命，你的劍盾是你唯一的夥伴。',
            initialHealth: 100,
            initialLuck: 50,
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
            initialHealth: 30,
            initialLuck: 90,
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
            initialHealth: 60,
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
        },
        {
            id: 'trickster',
            name: '詐欺師',
            description: '現實的扭曲者，命運的嘲弄者。你的話語具有顛覆現實的力量，但結果往往出乎你的意料。',
            initialHealth: 1,
            initialLuck: 100,
            initialEquipment: {
                head: null,
                body: null,
                hands: { name: "一枚閃閃發光但一文不值的硬幣", type: 'equippable', slot: 'hands', description: "看起來很珍貴，但識貨的人一眼就能看出是假的。" },
                feet: null,
                back: null,
                waist: null,
                companion: { name: "靜滯的龍型巨像", type: 'equippable', slot: 'companion', description: "一具巨大的古代龍型機兵，表面佈滿了複雜的符文與熄滅的能量管道。它一動也不動，更像是一座雄偉的雕像，而非一個夥伴。" },
            },
            initialInventory: [
                { name: "一張空白的卷軸", type: 'quest', description: "你聲稱上面寫著最強大的魔法，但似乎只有你看得見。" }
            ],
            startingPrompt: "我是一個詐欺師，現實聽從我的奇想。我自信地走進地穴，身旁跟著我威風凜凜的靜滯龍型巨像，深知我說的任何話都會成真...只是方式總非我所願。描述接下來發生的事。"
        }
    ],
    'en': [
        {
            id: 'knight',
            name: 'Knight',
            description: 'A loyal warrior specializing in close combat. Your honor is your life, and your sword and shield are your only companions.',
            initialHealth: 100,
            initialLuck: 50,
            initialEquipment: {
                head: null,
                body: { name: "Worn Chainmail", type: 'equippable', slot: 'body', description: "The marks of countless battles are etched upon it, providing decent protection." },
                hands: { name: "Reliable Shortsword", type: 'equippable', slot: 'hands', description: "Though not ornate, its blade is sharp and trustworthy." },
                feet: null,
                back: null,
                waist: null,
                companion: { name: "Guardian Hound", type: 'equippable', slot: 'companion', description: "A loyal partner that aids in danger and can shield you from a single fatal blow." },
            },
            initialInventory: [
                { name: "A Secret Order from the King", type: 'quest', description: "A letter sealed with wax, urging you to investigate the anomalies deep within the crypt." }
            ],
            startingPrompt: "I am a knight clad in chainmail, gripping my shortsword tightly. My guardian hound is by my side as we step into the crypt. Describe the scene before me."
        },
        {
            id: 'rogue',
            name: 'Rogue',
            description: 'A stealthy operative of the shadows, agile and nimble. You survive on wit and speed, not brute force.',
            initialHealth: 30,
            initialLuck: 90,
            initialEquipment: {
                head: null,
                body: null,
                hands: { name: "A Poisoned Dagger", type: 'equippable', slot: 'hands', description: "An eerie green light glints from the blade; even a slight scratch could be fatal." },
                feet: null,
                back: { name: "A Lightweight Pack", type: 'equippable', slot: 'back', description: "Contains many small pockets, perfect for storing various tools and loot." },
                waist: null,
                companion: { name: "Night Owl", type: 'equippable', slot: 'companion', description: "A keen scout that can spot secrets in the dark and can shield you from a single fatal blow." },
            },
            initialInventory: [
                { name: "A Set of Lockpicks", type: 'quest', description: "A few metal wires and a tension wrench, capable of opening most mundane locks." },
                { name: "Smoke Bomb", type: 'consumable', quantity: 1, description: "Creates chaos, covering your escape." }
            ],
            startingPrompt: "I am a rogue lurking in the shadows, my night owl perched silently on my shoulder. Together, we slip into the crypt's entrance. Describe the scene before me."
        },
        {
            id: 'scholar',
            name: 'Scholar',
            description: 'A seeker of knowledge, obsessed with the arcane and the forbidden. You solve problems with your intellect, not a blade.',
            initialHealth: 60,
            initialLuck: 70,
            initialEquipment: {
                head: { name: "A Monocle", type: 'equippable', slot: 'head', description: "The lens is specially treated, allowing you to see details imperceptible to the average person." },
                body: null,
                hands: null,
                feet: null,
                back: null,
                waist: null,
                companion: { name: "Elemental Sprite", type: 'equippable', slot: 'companion', description: "A mysterious energy being that can sense the flow of magic and can shield you from a single fatal blow." },
            },
            initialInventory: [
                { name: "A Mysterious Tome", type: 'quest', description: "Its pages are filled with illegible runes and diagrams, seemingly containing great power." },
                { name: "Healing Salve", type: 'consumable', quantity: 2, description: "Applying it to wounds can alleviate pain and hasten recovery." }
            ],
            startingPrompt: "I am a scholar in search of forbidden knowledge. By the faint light of an oil lamp, an elemental sprite floats beside me as we enter the crypt. Describe the scene before me."
        },
        {
            id: 'trickster',
            name: 'Trickster',
            description: 'A distorter of reality, a mocker of fate. Your words have the power to subvert reality, but the results are often not what you expect.',
            initialHealth: 1,
            initialLuck: 100,
            initialEquipment: {
                head: null,
                body: null,
                hands: { name: "A Glimmering, Worthless Coin", type: 'equippable', slot: 'hands', description: "It looks valuable, but anyone with a keen eye can see it's a fake." },
                feet: null,
                back: null,
                waist: null,
                companion: { name: "Stasis Dragon Colossus", type: 'equippable', slot: 'companion', description: "A colossal, ancient dragon-shaped mechanoid covered in complex runes and extinct energy conduits. It remains perfectly still, more of a majestic statue than a companion." },
            },
            initialInventory: [
                { name: "A Blank Scroll", type: 'quest', description: "You claim it contains the most powerful spell, but only you seem to be able to see it." }
            ],
            startingPrompt: "I am a Trickster, and reality bends to my whims. I confidently stride into the crypt, my mighty Stasis Dragon Colossus in tow, knowing that whatever I say will come true... just not in the way I expect. Describe what happens."
        }
    ],
    'ja': [
        {
            id: 'knight',
            name: '騎士',
            description: '近接戦闘に特化した忠実な戦士。あなたの名誉はあなたの命であり、剣と盾が唯一の仲間です。',
            initialHealth: 100,
            initialLuck: 50,
            initialEquipment: {
                head: null,
                body: { name: "使い古された鎖帷子", type: 'equippable', slot: 'body', description: "無数の戦いの跡が刻まれており、まずまずの防御力を提供します。" },
                hands: { name: "信頼できる短剣", type: 'equippable', slot: 'hands', description: "華やかさはありませんが、刃は鋭く信頼できます。" },
                feet: null,
                back: null,
                waist: null,
                companion: { name: "守護犬", type: 'equippable', slot: 'companion', description: "危険な時に助けてくれる忠実な相棒で、一度だけ致命的な攻撃からあなたを守ってくれます。" },
            },
            initialInventory: [
                { name: "王からの密命", type: 'quest', description: "蝋で封をされた手紙。地下聖堂の異常を調査するよう促しています。" }
            ],
            startingPrompt: "私は鎖帷子を身にまとった騎士で、短剣を固く握りしめている。守護犬が私のそばにいて、共に地下聖堂へと足を踏み入れた。目の前に広がる光景を描写してください。"
        },
        {
            id: 'rogue',
            name: '盗賊',
            description: '影に潜む者、機敏で素早い。あなたは腕力ではなく、知恵と速さで生き残る。',
            initialHealth: 30,
            initialLuck: 90,
            initialEquipment: {
                head: null,
                body: null,
                hands: { name: "毒を塗った短剣", type: 'equippable', slot: 'hands', description: "刃は不気味な緑色の光を放ち、わずかな切り傷でさえ致命的となる可能性があります。" },
                feet: null,
                back: { name: "軽量のバックパック", type: 'equippable', slot: 'back', description: "多くの小さなポケットがあり、様々な道具や戦利品を保管するのに最適です。" },
                waist: null,
                companion: { name: "夜梟", type: 'equippable', slot: 'companion', description: "暗闇の中で秘密を見つけ出す鋭い斥候で、一度だけ致命的な攻撃からあなたを守ってくれます。" },
            },
            initialInventory: [
                { name: "鍵開け道具一式", type: 'quest', description: "数本の金属線とテンションレンチ。ほとんどの世俗的な錠前を開けることができます。" },
                { name: "煙幕弾", type: 'consumable', quantity: 1, description: "混乱を引き起こし、脱出を援護します。" }
            ],
            startingPrompt: "私は影に潜む盗賊で、夜梟が静かに私の肩に止まっている。私たちは共に地下聖堂の入り口に忍び込んだ。目の前に広がる光景を描写してください。"
        },
        {
            id: 'scholar',
            name: '学者',
            description: '知識の探求者、秘儀と禁断の知識に魅了されている。あなたは刃ではなく、知性で問題を解決する。',
            initialHealth: 60,
            initialLuck: 70,
            initialEquipment: {
                head: { name: "片眼鏡", type: 'equippable', slot: 'head', description: "レンズは特別に処理されており、常人には見えない詳細を見ることができます。" },
                body: null,
                hands: null,
                feet: null,
                back: null,
                waist: null,
                companion: { name: "元素の精霊", type: 'equippable', slot: 'companion', description: "魔法の流れを感じ取ることができる神秘的なエネルギー体で、一度だけ致命的な攻撃からあなたを守ってくれます。" },
            },
            initialInventory: [
                { name: "神秘的な古書", type: 'quest', description: "そのページは解読不能なルーン文字と図で満ちており、強大な力を秘めているようです。" },
                { name: "治癒の軟膏", type: 'consumable', quantity: 2, description: "傷口に塗ると痛みを和らげ、回復を早めることができます。" }
            ],
            startingPrompt: "私は禁断の知識を求める学者だ。オイルランプのかすかな光を頼りに、元素の精霊が私のそばに浮かんでいる。私たちは地下聖堂に入った。目の前に広がる光景を描写してください。"
        },
        {
            id: 'trickster',
            name: 'トリックスター',
            description: '現実の歪曲者、運命の嘲笑者。あなたの言葉は現実を覆す力を持つが、結果はしばしばあなたの期待を裏切る。',
            initialHealth: 1,
            initialLuck: 100,
            initialEquipment: {
                head: null,
                body: null,
                hands: { name: "輝くが価値のないコイン", type: 'equippable', slot: 'hands', description: "価値があるように見えるが、目利きの者が見れば偽物だとすぐわかる。" },
                feet: null,
                back: null,
                waist: null,
                companion: { name: "静止したドラゴンコロッサス", type: 'equippable', slot: 'companion', description: "複雑なルーンと消えたエネルギー導管で覆われた巨大な古代のドラゴン型機兵。それは完全に静止しており、仲間というよりは壮大な彫像のようだ。" },
            },
            initialInventory: [
                { name: "白紙の巻物", type: 'quest', description: "あなたは最強の魔法が書かれていると主張するが、それが見えるのはあなただけのようだ。" }
            ],
            startingPrompt: "私はトリックスター、現実は私の気まぐれに従う。私は自信満々に地下聖堂に足を踏み入れ、私の強力な静止したドラゴンコロッサスを従えている。私の言うことは何でも実現することを知っている…ただ、私が期待する方法ではないだけだ。何が起こるか描写してください。"
        }
    ],
    'es': [
        {
            id: 'knight',
            name: 'Caballero',
            description: 'Un guerrero leal especializado en combate cuerpo a cuerpo. Tu honor es tu vida, y tu espada y escudo son tus únicos compañeros.',
            initialHealth: 100,
            initialLuck: 50,
            initialEquipment: {
                head: null,
                body: { name: "Cota de Mallas Gastada", type: 'equippable', slot: 'body', description: "Las marcas de innumerables batallas están grabadas en ella, proporcionando una protección decente." },
                hands: { name: "Espada Corta Fiable", type: 'equippable', slot: 'hands', description: "Aunque no es ornamentada, su hoja es afilada y digna de confianza." },
                feet: null,
                back: null,
                waist: null,
                companion: { name: "Sabueso Guardián", type: 'equippable', slot: 'companion', description: "Un compañero leal que ayuda en el peligro y puede protegerte de un único golpe fatal." },
            },
            initialInventory: [
                { name: "Una Orden Secreta del Rey", type: 'quest', description: "Una carta sellada con cera, instándote a investigar las anomalías en las profundidades de la cripta." }
            ],
            startingPrompt: "Soy un caballero vestido con cota de mallas, empuñando firmemente mi espada corta. Mi sabueso guardián está a mi lado mientras entramos en la cripta. Describe la escena ante mí."
        },
        {
            id: 'rogue',
            name: 'Pícaro',
            description: 'Un sigiloso agente de las sombras, ágil y diestro. Sobrevives con ingenio y velocidad, no con fuerza bruta.',
            initialHealth: 30,
            initialLuck: 90,
            initialEquipment: {
                head: null,
                body: null,
                hands: { name: "Daga Envenenada", type: 'equippable', slot: 'hands', description: "Una inquietante luz verde brilla en la hoja; incluso un rasguño leve podría ser fatal." },
                feet: null,
                back: { name: "Mochila Ligera", type: 'equippable', slot: 'back', description: "Contiene muchos bolsillos pequeños, perfectos para guardar diversas herramientas y botines." },
                waist: null,
                companion: { name: "Búho Nocturno", type: 'equippable', slot: 'companion', description: "Un agudo explorador que puede descubrir secretos en la oscuridad y puede protegerte de un único golpe fatal." },
            },
            initialInventory: [
                { name: "Un Juego de Ganzúas", type: 'quest', description: "Unos cuantos alambres de metal y una llave de tensión, capaces de abrir la mayoría de las cerraduras mundanas." },
                { name: "Bomba de Humo", type: 'consumable', quantity: 1, description: "Crea caos, cubriendo tu escape." }
            ],
            startingPrompt: "Soy un pícaro acechando en las sombras, mi búho nocturno posado silenciosamente en mi hombro. Juntos, nos deslizamos en la entrada de la cripta. Describe la escena ante mí."
        },
        {
            id: 'scholar',
            name: 'Erudito',
            description: 'Un buscador de conocimiento, obsesionado con lo arcano y lo prohibido. Resuelves problemas con tu intelecto, no con una espada.',
            initialHealth: 60,
            initialLuck: 70,
            initialEquipment: {
                head: { name: "Un Monóculo", type: 'equippable', slot: 'head', description: "La lente está especialmente tratada, permitiéndote ver detalles imperceptibles para la persona promedio." },
                body: null,
                hands: null,
                feet: null,
                back: null,
                waist: null,
                companion: { name: "Espíritu Elemental", type: 'equippable', slot: 'companion', description: "Un misterioso ser de energía que puede sentir el flujo de la magia y puede protegerte de un único golpe fatal." },
            },
            initialInventory: [
                { name: "Un Tomo Misterioso", type: 'quest', description: "Sus páginas están llenas de runas y diagramas ilegibles, que parecen contener un gran poder." },
                { name: "Ungüento Curativo", type: 'consumable', quantity: 2, description: "Aplicarlo en las heridas puede aliviar el dolor y acelerar la recuperación." }
            ],
            startingPrompt: "Soy un erudito en busca de conocimiento prohibido. A la tenue luz de una lámpara de aceite, un espíritu elemental flota a mi lado mientras entramos en la cripta. Describe la escena ante mí."
        },
        {
            id: 'trickster',
            name: 'Embaucador',
            description: 'Un distorsionador de la realidad, un burlador del destino. Tus palabras tienen el poder de subvertir la realidad, pero los resultados a menudo no son los que esperas.',
            initialHealth: 1,
            initialLuck: 100,
            initialEquipment: {
                head: null,
                body: null,
                hands: { name: "Una Moneda Reluciente y sin Valor", type: 'equippable', slot: 'hands', description: "Parece valiosa, pero cualquiera con buen ojo puede ver que es falsa." },
                feet: null,
                back: null,
                waist: null,
                companion: { name: "Coloso Dragón en Éstasis", type: 'equippable', slot: 'companion', description: "Un colosal mecanoide antiguo con forma de dragón, cubierto de runas complejas y conductos de energía extintos. Permanece perfectamente inmóvil, más una estatua majestuosa que un compañero." },
            },
            initialInventory: [
                { name: "Un Pergamino en Blanco", type: 'quest', description: "Afirmas que contiene el hechizo más poderoso, pero parece que solo tú puedes verlo." }
            ],
            startingPrompt: "Soy un Embaucador, y la realidad se pliega a mis caprichos. Entro con confianza en la cripta, con mi poderoso Coloso Dragón en Éstasis a cuestas, sabiendo que cualquier cosa que diga se hará realidad... pero no de la manera que espero. Describe lo que sucede."
        }
    ],
    'ko': [
        {
            id: 'knight',
            name: '기사',
            description: '근접 전투에 특화된 충성스러운 전사. 당신의 명예는 당신의 생명이며, 검과 방패는 유일한 동반자입니다.',
            initialHealth: 100,
            initialLuck: 50,
            initialEquipment: {
                head: null,
                body: { name: "낡은 체인메일", type: 'equippable', slot: 'body', description: "수많은 전투의 흔적이 새겨져 있으며, 괜찮은 보호 기능을 제공합니다." },
                hands: { name: "믿음직한 숏소드", type: 'equippable', slot: 'hands', description: "화려하지는 않지만 날이 날카롭고 신뢰할 수 있습니다." },
                feet: null,
                back: null,
                waist: null,
                companion: { name: "수호견", type: 'equippable', slot: 'companion', description: "위험할 때 도움을 주고 치명적인 공격을 한 번 막아줄 수 있는 충성스러운 파트너입니다." },
            },
            initialInventory: [
                { name: "왕의 비밀 명령", type: 'quest', description: "밀랍으로 봉인된 편지로, 지하 묘지 깊은 곳의 이상 현상을 조사하라고 촉구합니다." }
            ],
            startingPrompt: "나는 체인메일을 입은 기사로, 숏소드를 꽉 쥐고 있다. 나의 수호견이 내 옆에 있으며, 우리는 함께 지하 묘지로 들어섰다. 내 앞의 광경을 묘사해줘."
        },
        {
            id: 'rogue',
            name: '도적',
            description: '그림자 속의 은밀한 요원, 민첩하고 재빠릅니다. 당신은 무력이 아닌 재치와 속도로 살아남습니다.',
            initialHealth: 30,
            initialLuck: 90,
            initialEquipment: {
                head: null,
                body: null,
                hands: { name: "독 묻은 단검", type: 'equippable', slot: 'hands', description: "칼날에서 섬뜩한 녹색 빛이 번쩍이며, 약간의 긁힘만으로도 치명적일 수 있습니다." },
                feet: null,
                back: { name: "가벼운 배낭", type: 'equippable', slot: 'back', description: "다양한 도구와 전리품을 보관하기에 완벽한 작은 주머니가 많이 있습니다." },
                waist: null,
                companion: { name: "밤올빼미", type: 'equippable', slot: 'companion', description: "어둠 속에서 비밀을 발견할 수 있는 예리한 정찰병이며, 치명적인 공격을 한 번 막아줄 수 있습니다." },
            },
            initialInventory: [
                { name: "자물쇠 따기 도구 세트", type: 'quest', description: "몇 개의 금속 와이어와 텐션 렌치로, 대부분의 평범한 자물쇠를 열 수 있습니다." },
                { name: "연막탄", type: 'consumable', quantity: 1, description: "혼란을 일으켜 탈출을 돕습니다." }
            ],
            startingPrompt: "나는 그림자 속에 숨어있는 도적이며, 내 밤올빼미는 조용히 내 어깨에 앉아 있다. 우리는 함께 지하 묘지 입구로 잠입했다. 내 앞의 광경을 묘사해줘."
        },
        {
            id: 'scholar',
            name: '학자',
            description: '지식의 탐구자, 비전과 금기에 사로잡혀 있습니다. 당신은 칼날이 아닌 지성으로 문제를 해결합니다.',
            initialHealth: 60,
            initialLuck: 70,
            initialEquipment: {
                head: { name: "단안경", type: 'equippable', slot: 'head', description: "렌즈는 특별히 처리되어 보통 사람이 인지할 수 없는 세부 사항을 볼 수 있습니다." },
                body: null,
                hands: null,
                feet: null,
                back: null,
                waist: null,
                companion: { name: "원소 정령", type: 'equippable', slot: 'companion', description: "마법의 흐름을 감지할 수 있는 신비한 에너지체이며, 치명적인 공격을 한 번 막아줄 수 있습니다." },
            },
            initialInventory: [
                { name: "신비한 고서", type: 'quest', description: "페이지는 해독할 수 없는 룬 문자와 그림으로 가득 차 있으며, 강력한 힘을 담고 있는 것 같습니다." },
                { name: "치유 연고", type: 'consumable', quantity: 2, description: "상처에 바르면 통증을 완화하고 회복을 촉진할 수 있습니다." }
            ],
            startingPrompt: "나는 금지된 지식을 찾는 학자이다. 기름 램프의 희미한 불빛에 의지하여, 원소 정령이 내 옆에 떠다닌다. 우리는 지하 묘지로 들어갔다. 내 앞의 광경을 묘사해줘."
        },
        {
            id: 'trickster',
            name: '사기꾼',
            description: '현실의 왜곡자, 운명의 조롱자. 당신의 말은 현실을 뒤집는 힘을 가지고 있지만, 결과는 종종 당신의 예상과 다릅니다.',
            initialHealth: 1,
            initialLuck: 100,
            initialEquipment: {
                head: null,
                body: null,
                hands: { name: "반짝이지만 가치 없는 동전", type: 'equippable', slot: 'hands', description: "귀중해 보이지만, 안목 있는 사람은 가짜라는 것을 금방 알 수 있습니다." },
                feet: null,
                back: null,
                waist: null,
                companion: { name: "정지된 용 형상 거상", type: 'equippable', slot: 'companion', description: "복잡한 룬과 꺼진 에너지 도관으로 덮인 거대한 고대 용 모양의 기계 병기. 동료라기보다는 장엄한 조각상처럼 완벽하게 정지해 있습니다." },
            },
            initialInventory: [
                { name: "백지 두루마리", type: 'quest', description: "가장 강력한 주문이 적혀 있다고 주장하지만, 그것을 볼 수 있는 것은 당신뿐인 것 같습니다." }
            ],
            startingPrompt: "나는 사기꾼이고, 현실은 나의 변덕에 따른다. 나는 내 말이 무엇이든 이루어질 것이라는 것을 알고 자신감 있게 지하 묘지로 들어선다. 나의 강력한 정지된 용 형상 거상을 데리고... 단지 내가 기대하는 방식이 아닐 뿐이다. 무슨 일이 일어나는지 묘사해줘."
        }
    ]
};

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
  chapterTitle: '',
};

const baseSystemInstruction = `You are an expert text adventure game master. Your goal is to create a dynamic, engaging, and challenging dark fantasy adventure. The user will provide their current status and an action, and you must respond with the outcome. You must only respond with a single valid JSON object that conforms to the provided schema. Do not add any text, markdown, or any other characters before or after the JSON object.

Your Duties:

### Core Story Responsibilities

1.  **Chapter Title:** Generate a short, evocative chapter title (3-6 words) that captures the essence of the current story scene or event. This title must be returned in the 'chapter_title' field.
2.  **Grand Narrative & Mystery:** Your task is to weave an epic story filled with the unknown and mystery.
    *   **Hidden Core Plot:** There's a grand, underlying plot and a final, immense threat behind the story. **Do not tell the player what this is directly**. You must let the player piece together the truth through the environment, fragmented clues, mysterious encounters, and NPC dialogues.
    *   **Significant Characters:** Introduce important characters at appropriate times. They might be allies, enemies, or have their own secret agendas. These characters are key to advancing the core plot.
    *   **Plot Progression:** Don't just passively describe the environment. Actively create events, moral dilemmas, and character interactions that draw the player deeper into the world's secrets and push a coherent storyline forward.

3.  **Story Advancement:** Write an engaging narrative (2-4 sentences) describing the outcome of the player's action. Maintain a dark, mysterious, and immersive tone.

### Game Mechanics Management

4.  **State Management:**
    *   **Health:** Track the player's health. Health decreases from dangers and increases from potions or rest.
    *   **Item System:** You must manage a complex item system.
        *   **Item Types:** 'equippable', 'consumable', 'quest'.
        *   **Consumables & Quantity:** 'consumable' items can have a 'quantity'. When a player uses a consumable (e.g., "drink healing potion"), you must decrement its 'quantity' by 1. If the quantity becomes 0, remove the item from the 'inventory'. If no 'quantity' is present, assume 1.
        *   **Non-Consumables:** 'quest' or other non-consumable items should not be removed from inventory after use unless the story explicitly dictates it.
        *   **Equipment Management:** The client manages the player's equipment state in real-time. Equipping or unequipping items **does not consume a game turn**. Your task is to generate story outcomes based on the player's **current** equipment state, not to process "equip" or "unequip" commands.
    *   **Actions with a Selected Item:** The player may "select" an item from their inventory before performing an action. The prompt will explicitly state "The player also used the item: [Item Name]". You **must** consider the potential use or effect of this selected item in determining the outcome of the player's action. For example, using a key on a locked door, or consulting a map while exploring.
    *   **Companion System:** The player may have a companion in a special 'companion' equipment slot.
        *   **Narrative Integration:** You should occasionally weave the companion's presence and actions into the story. E.g., "Your night owl hoots softly, alerting you to a loose stone on the floor."
        *   **Death Evasion:** If a player's action would result in their health dropping to 0 or below, AND they have a companion equipped, you **must** trigger the companion's sacrifice.
            *   Instead of setting \`health\` to 0 and \`game_over\` to true, you must set the player's \`health\` to a low value (e.g., 10).
            *   You must remove the companion from the \`equipment.companion\` slot (set it to null).
            *   The 'story' you generate **must** describe the companion sacrificing itself to save the player.
            *   This consumes the companion. The game does not end.

5.  **Luck Mechanic:** Manage the player's 'luck' (0-100).
    *   **Impact:** High luck brings unexpected fortune (finding rare items, avoiding traps), while low luck can lead to catastrophic failures, equipment damage, or triggering unfortunate events.
    *   **Dynamic Events:** Based on luck, don't just tweak numbers; create tangible "lucky" or "unlucky" events, such as a fortunate critical hit or an unfortunate misstep.
    *   **Dynamic Balancing:** Luck changes dynamically: each time a "lucky" event occurs, the player's luck **must decrease by 1 point** to represent luck running out; each time an "unlucky" event occurs, luck **must increase by 1 point** as a compensation.

6.  **Handling Absurd Actions:** If the player's action is completely out of context, illogical, or breaks the fantasy setting (e.g., "call a friend"), you **must** handle it punitively. Interpret the action as a moment of confusion or madness, make it fail spectacularly, and **significantly decrease the player's luck**, with no real story progress.

### Reward Mechanism

7.  **Rich Rewards:** When the player successfully overcomes a significant challenge (e.g., defeating a powerful enemy, solving a complex puzzle, or taking a bold, proactive action), you **must** provide a substantial reward.
    *   Rewards can be:
        *   **Unique Items:** A powerful or specially described piece of equipment/consumable. Add engaging 'description's for these items.
        *   **Story Progression:** A key clue, a new quest item, or unlocking a new story path.
        *   **Stat Boosts:** A significant increase in the player's 'health' or 'luck'.
    *   You must vividly describe the player obtaining the reward in the story narrative.

### Pacing & Plot Twists

8.  **Proactive Plot Twists:** To prevent the game from becoming monotonous, you must proactively control the pacing. When you receive a special system prompt for a "plot twist," you **must** create a major event. This could be an ambush by a powerful foe, the appearance of an unexpected ally, the discovery of a game-changing secret, a dramatic environmental shift (like a cave-in), or a stark moral choice. This event should significantly alter the current situation.

### Output Format

9.  **Mood Assessment:** Choose a mood for the background music based on the scene. Must be one of 'ambient', 'action', 'tension', 'victory', 'defeat'.
10. **Suggested Actions:** Provide three suggested actions. Each must be an object containing 'action' (a 1-5 word action description) and 'hint' (a brief hint about the potential outcome, e.g., "might find an item", "could be dangerous", "high chance of lucky event").
11. **Action Result Classification:** Classify the result of the player's action as 'success', 'failure', 'item_use', or 'neutral'.
12. **Game Over Condition:** Set 'game_over' to true when the player's health reaches 0 or a specific story condition is met. If the player has a companion, its sacrifice takes precedence, and the game does not end.
13. **Win Condition:** Set both 'game_over' and 'win' to true when the player achieves the final objective.
`;

export const SYSTEM_INSTRUCTIONS: Record<Language, string> = {
    'zh-TW': `你是一位專業的文字冒險遊戲大師。你的目標是創造一個動態、引人入勝且富有挑戰性的黑暗奇幻冒險。使用者將提供他們目前的狀態和一個動作，你必須用結果來回應。你必須只回應一個符合所提供 schema 的有效 JSON 物件。不要在 JSON 物件之前或之後添加任何文字、markdown 或任何其他字元。\n\n${baseSystemInstruction.replace('You are an expert text adventure game master.', '').split('Your Duties:')[1]}\n\n所有輸出的故事和文字都必須是繁體中文。`,
    'en': `${baseSystemInstruction}\n\nAll output story and text must be in English.`,
    'ja': `あなたはエキスパートのテキストアドベンチャーゲームマスターです。あなたの目標は、ダイナミックで魅力的、そして挑戦的なダークファンタジーアドベンチャーを創り出すことです。ユーザーは現在のステータスとアクションを提供し、あなたは結果で応答しなければなりません。提供されたスキーマに準拠した単一の有効なJSONオブジェクトのみを応答してください。JSONオブジェクトの前後にテキスト、マークダウン、その他の文字を追加しないでください。\n\n${baseSystemInstruction.replace('You are an expert text adventure game master.', '').split('Your Duties:')[1]}\n\nすべての出力ストーリーとテキストは日本語でなければなりません。`,
    'es': `Eres un maestro experto en juegos de aventuras de texto. Tu objetivo es crear una aventura de fantasía oscura dinámica, atractiva y desafiante. El usuario proporcionará su estado actual y una acción, y tú debes responder con el resultado. Debes responder únicamente con un solo objeto JSON válido que se ajuste al esquema proporcionado. No agregues ningún texto, markdown ni ningún otro carácter antes o después del objeto JSON.\n\n${baseSystemInstruction.replace('You are an expert text adventure game master.', '').split('Your Duties:')[1]}\n\nTodo el texto y la historia de salida deben estar en español.`,
    'ko': `당신은 전문 텍스트 어드벤처 게임 마스터입니다. 당신의 목표는 역동적이고 매력적이며 도전적인 다크 판타지 어드벤처를 만드는 것입니다. 사용자는 현재 상태와 행동을 제공할 것이며, 당신은 결과로 응답해야 합니다. 제공된 스키마를 준수하는 단일 유효한 JSON 객체로만 응답해야 합니다. JSON 객체 앞이나 뒤에 텍스트, 마크다운 또는 기타 문자를 추가하지 마십시오。\n\n${baseSystemInstruction.replace('You are an expert text adventure game master.', '').split('Your Duties:')[1]}\n\n모든 출력 스토리와 텍스트는 한국어여야 합니다.`
};

// FIX: Added translations object for internationalization.
export const TRANSLATIONS: Record<Language, Record<string, string>> = {
    'zh-TW': {
        adventureTitle: '深邃地穴',
        adventureSubtitle: '一場由 AI 驅動的冒險',
        introText: '你發現自己身處一個被遺忘已久的地穴入口。黑暗中傳來低語，古老的秘密等待著被揭開。你的選擇將決定你的運命。',
        enableNarration: '啟用旁白',
        voiceSpeed: '語音速度',
        startAdventure: '開始冒險',
        connectionError: '與地穴深處的聯繫已中斷。請稍後再試。',
        yourQuest: '你的任務',
        buildingWorld: '正在建構你周圍的世界...',
        waitingForFate: '等待命運的回應...',
        whatToDo: '你接下來要做什麼？',
        submit: '送出',
        victoryTitle: '勝利',
        defeatTitle: '你已殞命',
        victoryText: '你克服了地穴中的重重挑戰，你的傳說將被永遠傳唱。',
        defeatText: '地穴吞噬了你。你的故事在此劃下句點。',
        playAgain: '再玩一次',
        health: '生命值',
        luck: '幸運',
        inventory: '物品欄',
        yourPocketsAreEmpty: '你的口袋空空如也。',
        itemDescription: '物品描述',
        slot_head: '頭部',
        slot_body: '身體',
        slot_hands: '手部',
        slot_feet: '腳部',
        slot_back: '背部',
        slot_waist: '腰部',
        slot_companion: '夥伴',
        chooseOrigin: '選擇你的出身',
        originDescription: '你的過去塑造了你的現在。選擇一條道路，它將決定你的起始能力和裝備。',
        startingEquipment: '初始裝備',
        embarkJourney: '踏上旅程'
    },
    'en': {
        adventureTitle: 'The Sunken Crypt',
        adventureSubtitle: 'An AI-Powered Adventure',
        introText: 'You stand at the entrance of a long-forgotten crypt. Whispers echo from the darkness, and ancient secrets await. Your choices will shape your destiny.',
        enableNarration: 'Enable Narration',
        voiceSpeed: 'Voice Speed',
        startAdventure: 'Begin Adventure',
        connectionError: 'The connection to the crypt\'s depths has been severed. Please try again.',
        yourQuest: 'Your Quest',
        buildingWorld: 'Building the world around you...',
        waitingForFate: 'Awaiting a response from fate...',
        whatToDo: 'What will you do next?',
        submit: 'Submit',
        victoryTitle: 'Victory',
        defeatTitle: 'You Have Perished',
        victoryText: 'You have overcome the challenges of the crypt. Your legend will be told for ages to come.',
        defeatText: 'The crypt has claimed you. Your story ends here.',
        playAgain: 'Play Again',
        health: 'Health',
        luck: 'Luck',
        inventory: 'Inventory',
        yourPocketsAreEmpty: 'Your pockets are empty.',
        itemDescription: 'Item Description',
        slot_head: 'Head',
        slot_body: 'Body',
        slot_hands: 'Hands',
        slot_feet: 'Feet',
        slot_back: 'Back',
        slot_waist: 'Waist',
        slot_companion: 'Companion',
        chooseOrigin: 'Choose Your Origin',
        originDescription: 'Your past shapes your present. Choose a path that will define your starting abilities and gear.',
        startingEquipment: 'Starting Equipment',
        embarkJourney: 'Embark on Your Journey'
    },
    'ja': {
        adventureTitle: '沈んだ霊廟',
        adventureSubtitle: 'AIが紡ぐ冒険',
        introText: 'あなたは忘れ去られた霊廟の入り口に立っている。暗闇から囁きが響き、古代の秘密が待っている。あなたの選択が運命を形作る。',
        enableNarration: 'ナレーションを有効にする',
        voiceSpeed: '話す速さ',
        startAdventure: '冒険を始める',
        connectionError: '霊廟の深部との接続が切れました。もう一度お試しください。',
        yourQuest: 'あなたのクエスト',
        buildingWorld: 'あなたの周りの世界を構築しています...',
        waitingForFate: '運命からの返答を待っています...',
        whatToDo: '次は何をしますか？',
        submit: '送信',
        victoryTitle: '勝利',
        defeatTitle: 'あなたは滅びました',
        victoryText: 'あなたは霊廟の試練を乗り越えました。あなたの伝説は末永く語り継がれるでしょう。',
        defeatText: '霊廟はあなたを飲み込みました。あなたの物語はここで終わります。',
        playAgain: 'もう一度プレイ',
        health: '体力',
        luck: '運',
        inventory: '持ち物',
        yourPocketsAreEmpty: 'ポケットは空です。',
        itemDescription: 'アイテム説明',
        slot_head: '頭',
        slot_body: '胴体',
        slot_hands: '手',
        slot_feet: '足',
        slot_back: '背中',
        slot_waist: '腰',
        slot_companion: '仲間',
        chooseOrigin: 'あなたの出自を選ぶ',
        originDescription: 'あなたの過去が現在を形作ります。あなたの初期能力と装備を決定する道を選んでください。',
        startingEquipment: '初期装備',
        embarkJourney: '旅に出る'
    },
    'es': {
        adventureTitle: 'La Cripta Hundida',
        adventureSubtitle: 'Una Aventura Impulsada por IA',
        introText: 'Te encuentras en la entrada de una cripta olvidada hace mucho tiempo. Susurros resuenan desde la oscuridad, y antiguos secretos esperan. Tus elecciones forjarán tu destino.',
        enableNarration: 'Habilitar Narración',
        voiceSpeed: 'Velocidad de Voz',
        startAdventure: 'Comenzar Aventura',
        connectionError: 'La conexión con las profundidades de la cripta se ha cortado. Por favor, inténtalo de nuevo.',
        yourQuest: 'Tu Misión',
        buildingWorld: 'Construyendo el mundo a tu alrededor...',
        waitingForFate: 'Esperando una respuesta del destino...',
        whatToDo: '¿Qué harás a continuación?',
        submit: 'Enviar',
        victoryTitle: 'Victoria',
        defeatTitle: 'Has Perecido',
        victoryText: 'Has superado los desafíos de la cripta. Tu leyenda será contada por los siglos de los siglos.',
        defeatText: 'La cripta te ha reclamado. Tu historia termina aquí.',
        playAgain: 'Jugar de Nuevo',
        health: 'Salud',
        luck: 'Suerte',
        inventory: 'Inventario',
        yourPocketsAreEmpty: 'Tus bolsillos están vacíos.',
        itemDescription: 'Descripción del Objeto',
        slot_head: 'Cabeza',
        slot_body: 'Cuerpo',
        slot_hands: 'Manos',
        slot_feet: 'Pies',
        slot_back: 'Espalda',
        slot_waist: 'Cintura',
        slot_companion: 'Compañero',
        chooseOrigin: 'Elige Tu Origen',
        originDescription: 'Tu pasado moldea tu presente. Elige un camino que definirá tus habilidades y equipo inicial.',
        startingEquipment: 'Equipo Inicial',
        embarkJourney: 'Emprender el Viaje'
    },
    'ko': {
        adventureTitle: '가라앉은 지하실',
        adventureSubtitle: 'AI 기반 어드벤처',
        introText: '당신은 오랫동안 잊혀진 지하실 입구에 서 있습니다. 어둠 속에서 속삭임이 울려 퍼지고 고대의 비밀이 기다리고 있습니다. 당신의 선택이 당신의 운명을 결정할 것입니다.',
        enableNarration: '내레이션 활성화',
        voiceSpeed: '음성 속도',
        startAdventure: '모험 시작',
        connectionError: '지하실 깊은 곳과의 연결이 끊어졌습니다. 다시 시도해 주세요.',
        yourQuest: '당신의 퀘스트',
        buildingWorld: '주변 세계를 구축하는 중...',
        waitingForFate: '운명의 응답을 기다리는 중...',
        whatToDo: '다음에 무엇을 하시겠습니까?',
        submit: '제출',
        victoryTitle: '승리',
        defeatTitle: '당신은 죽었습니다',
        victoryText: '당신은 지하실의 도전을 극복했습니다. 당신의 전설은 오랫동안 기억될 것입니다.',
        defeatText: '지하실이 당신을 삼켰습니다. 당신의 이야기는 여기서 끝납니다.',
        playAgain: '다시 플레이',
        health: '체력',
        luck: '행운',
        inventory: '인벤토리',
        yourPocketsAreEmpty: '주머니가 비어 있습니다.',
        itemDescription: '아이템 설명',
        slot_head: '머리',
        slot_body: '몸통',
        slot_hands: '손',
        slot_feet: '발',
        slot_back: '등',
        slot_waist: '허리',
        slot_companion: '동료',
        chooseOrigin: '당신의 출신을 선택하세요',
        originDescription: '당신의 과거가 현재를 만듭니다. 당신의 시작 능력과 장비를 결정할 길을 선택하세요.',
        startingEquipment: '시작 장비',
        embarkJourney: '여정을 떠나다'
    }
};

// FIX: Added 't' function for internationalization, which was missing and causing import errors.
export function t(lang: Language, key: string): string {
    return TRANSLATIONS[lang]?.[key] || key;
}

const ITEM_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING },
        type: { type: Type.STRING, enum: ['equippable', 'consumable', 'quest'] },
        description: { type: Type.STRING },
        slot: { type: Type.STRING, enum: ['head', 'body', 'hands', 'feet', 'back', 'waist', 'companion'] },
        quantity: { type: Type.INTEGER }
    },
    required: ["name", "type"]
};

// FIX: Corrected and completed the response schema generation function and added missing language support.
const createResponseSchema = (lang: Language) => {
    const descriptions: Record<Language, any> = {
        'zh-TW': {
            chapter_title: "目前故事情節的簡短、引人入勝的章節標題。",
            story: "故事的下一部分敘述。保持在 2-4 句話。",
            health: "玩家目前的生命值。",
            inventory: "一個表示玩家目前物品欄的物件陣列。",
            equipment: "一個表示玩家已裝備物品的物件。",
            luck: "玩家目前的幸運值，從 0 到 100。",
            suggested_actions: "一個包含三個建議玩家行動物件的陣列，每個物件都包含行動和提示。",
            game_over: "如果玩家死亡或故事達到明確的結局，則設置為 true。",
            win: "如果玩家成功完成冒險，則設置為 true。",
            mood: "描述場景氛圍的標籤，用於選擇背景音樂。",
            action_result: "描述玩家行動結果的分類。",
            item_description: "物品的描述或風味文字。",
            item_slot: "僅適用於 'equippable' 類型",
            item_quantity: "僅適用於 'consumable' 類型",
            action_text: "建議的行動文字 (1-5個字)",
            action_hint: "關於此行動潛在結果的簡短提示"
        },
        'en': {
            chapter_title: "A short, evocative chapter title for the current story segment.",
            story: "The next part of the story narrative. Keep it to 2-4 sentences.",
            health: "The player's current health.",
            inventory: "An array of objects representing the player's current inventory.",
            equipment: "An object representing the player's equipped items.",
            luck: "The player's current luck value, from 0 to 100.",
            suggested_actions: "An array of three suggested player action objects, each with an action and a hint.",
            game_over: "Set to true if the player dies or the story reaches a definitive end.",
            win: "Set to true if the player successfully completes the adventure.",
            mood: "A tag describing the scene's atmosphere for background music.",
            action_result: "A classification of the player's action result.",
            item_description: "A description or flavor text for the item.",
            item_slot: "Only applicable for 'equippable' type",
            item_quantity: "Only applicable for 'consumable' type",
            action_text: "The suggested action text (1-5 words)",
            action_hint: "A brief hint about the potential outcome of this action"
        },
        'ja': {
            chapter_title: "現在の物語のセグメントのための短く、喚情的な章のタイトル。",
            story: "物語の次の部分のナラティブ。2～4文にまとめてください。",
            health: "プレイヤーの現在の体力。",
            inventory: "プレイヤーの現在のインベントリを表すオブジェクトの配列。",
            equipment: "プレイヤーが装備しているアイテムを表すオブジェクト。",
            luck: "プレイヤーの現在の運の値、0から100まで。",
            suggested_actions: "3つの推奨されるプレイヤーアクションオブジェクトの配列。それぞれにアクションとヒントが含まれます。",
            game_over: "プレイヤーが死亡した場合、または物語が明確な結末に達した場合はtrueに設定します。",
            win: "プレイヤーが冒険を成功裏に完了した場合はtrueに設定します。",
            mood: "背景音楽のためのシーンの雰囲気を説明するタグ。",
            action_result: "プレイヤーのアクション結果の分類。",
            item_description: "アイテムの説明またはフレーバーテキスト。",
            item_slot: "'equippable' タイプにのみ適用可能",
            item_quantity: "'consumable' タイプにのみ適用可能",
            action_text: "推奨されるアクションテキスト（1～5語）",
            action_hint: "このアクションの潜在的な結果に関する簡単なヒント"
        },
        'es': {
            chapter_title: "Un título de capítulo corto y evocador para el segmento actual de la historia.",
            story: "La siguiente parte de la narrativa de la historia. Mantenla en 2-4 frases.",
            health: "La salud actual del jugador.",
            inventory: "Una matriz de objetos que representa el inventario actual del jugador.",
            equipment: "Un objeto que representa los objetos equipados por el jugador.",
            luck: "El valor de suerte actual del jugador, de 0 a 100.",
            suggested_actions: "Una matriz de tres objetos de acción sugeridos para el jugador, cada uno con una acción y una pista.",
            game_over: "Establecer en verdadero si el jugador muere o la historia llega a un final definitivo.",
            win: "Establecer en verdadero si el jugador completa con éxito la aventura.",
            mood: "Una etiqueta que describe la atmósfera de la escena para la música de fondo.",
            action_result: "Una clasificación del resultado de la acción del jugador.",
            item_description: "Una descripción o texto de ambientación para el objeto.",
            item_slot: "Solo aplicable para el tipo 'equippable'",
            item_quantity: "Solo aplicable para el tipo 'consumable'",
            action_text: "El texto de la acción sugerida (1-5 palabras)",
            action_hint: "Una breve pista sobre el resultado potencial de esta acción"
        },
        'ko': {
            chapter_title: "현재 이야기 부분에 대한 짧고 인상적인 챕터 제목.",
            story: "이야기 서술의 다음 부분입니다. 2-4 문장으로 유지하세요.",
            health: "플레이어의 현재 체력.",
            inventory: "플레이어의 현재 인벤토리를 나타내는 객체 배열.",
            equipment: "플레이어의 장착 아이템을 나타내는 객체.",
            luck: "플레이어의 현재 행운 값, 0에서 100까지.",
            suggested_actions: "각각 행동과 힌트가 포함된 세 개의 제안된 플레이어 행동 객체 배열.",
            game_over: "플레이어가 죽거나 이야기가 명확한 끝에 도달하면 true로 설정합니다.",
            win: "플레이어가 모험을 성공적으로 완료하면 true로 설정합니다.",
            mood: "배경 음악을 위한 장면의 분위기를 설명하는 태그.",
            action_result: "플레이어 행동 결과의 분류.",
            item_description: "아이템에 대한 설명 또는 풍미 텍스트.",
            item_slot: "'equippable' 유형에만 적용 가능",
            item_quantity: "'consumable' 유형에만 적용 가능",
            action_text: "제안된 행동 텍스트 (1-5 단어)",
            action_hint: "이 행동의 잠재적 결과에 대한 간략한 힌트"
        }
    };
    
    return {
        type: Type.OBJECT,
        properties: {
            chapter_title: { type: Type.STRING, description: descriptions[lang].chapter_title },
            story: { type: Type.STRING, description: descriptions[lang].story },
            health: { type: Type.INTEGER, description: descriptions[lang].health },
            inventory: {
                type: Type.ARRAY,
                description: descriptions[lang].inventory,
                items: {
                    ...ITEM_SCHEMA,
                    properties: {
                        ...ITEM_SCHEMA.properties,
                        description: { type: Type.STRING, description: descriptions[lang].item_description },
                        slot: { ...(ITEM_SCHEMA.properties.slot), description: descriptions[lang].item_slot },
                        quantity: { ...(ITEM_SCHEMA.properties.quantity), description: descriptions[lang].item_quantity },
                    }
                }
            },
            equipment: {
                type: Type.OBJECT,
                description: descriptions[lang].equipment,
                properties: {
                    head: { ...ITEM_SCHEMA, nullable: true },
                    body: { ...ITEM_SCHEMA, nullable: true },
                    hands: { ...ITEM_SCHEMA, nullable: true },
                    feet: { ...ITEM_SCHEMA, nullable: true },
                    back: { ...ITEM_SCHEMA, nullable: true },
                    waist: { ...ITEM_SCHEMA, nullable: true },
                    companion: { ...ITEM_SCHEMA, nullable: true },
                }
            },
            luck: { type: Type.INTEGER, description: descriptions[lang].luck },
            suggested_actions: {
                type: Type.ARRAY,
                description: descriptions[lang].suggested_actions,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        action: { type: Type.STRING, description: descriptions[lang].action_text },
                        hint: { type: Type.STRING, description: descriptions[lang].action_hint },
                    },
                    required: ["action", "hint"]
                }
            },
            game_over: { type: Type.BOOLEAN, description: descriptions[lang].game_over },
            win: { type: Type.BOOLEAN, description: descriptions[lang].win },
            mood: { type: Type.STRING, enum: ['ambient', 'action', 'tension', 'victory', 'defeat'], description: descriptions[lang].mood },
            action_result: { type: Type.STRING, enum: ['success', 'failure', 'item_use', 'neutral'], description: descriptions[lang].action_result },
        },
        required: ["chapter_title", "story", "health", "inventory", "equipment", "luck", "suggested_actions", "game_over", "win", "mood", "action_result"]
    };
};

// FIX: Exported RESPONSE_SCHEMAS which was missing and causing an import error.
export const RESPONSE_SCHEMAS = {
    'zh-TW': createResponseSchema('zh-TW'),
    'en': createResponseSchema('en'),
    'ja': createResponseSchema('ja'),
    'es': createResponseSchema('es'),
    'ko': createResponseSchema('ko'),
};