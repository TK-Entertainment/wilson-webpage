// 地科動物塔羅：22 張大阿爾克那，每張配一種動物
// 圖片在 public/img/tarot/{key}.webp，牌背是 back.webp

export type TarotMeaning = { kw: string; text: string };

export type TarotCard = {
  key: string;
  num: string;
  name: string;
  en: string;
  animal: string;
  up: TarotMeaning;
  rev: TarotMeaning;
};

export const tarotCards: TarotCard[] = [
  {
    key: "fool",
    num: "0",
    name: "愚者",
    en: "The Fool",
    animal: "海獺",
    up: {
      kw: "新的開始・自由・冒險",
      text: "像躺在海面上隨洋流漂浮的海獺，放輕鬆、相信直覺，勇敢踏出第一步。未知也是一種禮物。",
    },
    rev: {
      kw: "魯莽・猶豫・方向不明",
      text: "漂得太隨性，可能忘了看看自己被帶往哪裡。出發前，先確認一下洋流的方向。",
    },
  },
  {
    key: "magician",
    num: "I",
    name: "魔術師",
    en: "The Magician",
    animal: "狐狸",
    up: {
      kw: "創造力・行動・資源到位",
      text: "機靈的狐狸把權杖、聖杯、寶劍、星幣都擺上桌，你需要的工具其實已經在手邊，現在就動手吧。",
    },
    rev: {
      kw: "眼高手低・分心・小聰明",
      text: "點子很多卻沒有一個落地。先挑一件事做到底，別讓才華只停在嘴上。",
    },
  },
  {
    key: "priestess",
    num: "II",
    name: "女祭司",
    en: "The High Priestess",
    animal: "魟魚",
    up: {
      kw: "直覺・沉靜・內在智慧",
      text: "魟魚安靜地滑過深海，答案不在喧鬧的海面，而在你心底最深的地方。",
    },
    rev: {
      kw: "忽略直覺・心事悶著",
      text: "你其實早就感覺到了，只是不願意聽。給自己一點安靜的時間。",
    },
  },
  {
    key: "empress",
    num: "III",
    name: "皇后",
    en: "The Empress",
    animal: "熊",
    up: {
      kw: "豐盛・滋養・照顧",
      text: "森林裡的熊媽媽，溫柔又強大。好好照顧自己和身邊的人，豐收會慢慢長出來。",
    },
    rev: {
      kw: "過度付出・忽略自己",
      text: "一直在照顧別人，卻忘了替自己補充能量。今天換你被照顧。",
    },
  },
  {
    key: "emperor",
    num: "IV",
    name: "皇帝",
    en: "The Emperor",
    animal: "老虎",
    up: {
      kw: "穩定・秩序・領導",
      text: "像穩穩站在山前的老虎，建立規則、承擔責任，你的堅定會讓人安心。",
    },
    rev: {
      kw: "固執・控制欲",
      text: "太想掌控一切，反而讓自己和別人都喘不過氣。試著放一點手。",
    },
  },
  {
    key: "hierophant",
    num: "V",
    name: "教皇",
    en: "The Hierophant",
    animal: "海龜",
    up: {
      kw: "傳承・學習・向前輩請教",
      text: "活了上百年的海龜，看過很多潮起潮落。這時候向有經驗的人學習，會少走很多冤枉路。",
    },
    rev: {
      kw: "墨守成規・不想被框住",
      text: "老方法不一定適合你。尊重傳統，也別忘了替自己找新的路。",
    },
  },
  {
    key: "lovers",
    num: "VI",
    name: "戀人",
    en: "The Lovers",
    animal: "天鵝",
    up: {
      kw: "愛・連結・重要的選擇",
      text: "兩隻天鵝的脖子圍成一顆心。真誠的關係，或是一個發自內心的選擇，正在等你。",
    },
    rev: {
      kw: "失衡・猶豫不決",
      text: "關係裡有一方太用力，或你在兩條路之間搖擺。先問問自己真正在乎的是什麼。",
    },
  },
  {
    key: "chariot",
    num: "VII",
    name: "戰車",
    en: "The Chariot",
    animal: "袋鼠",
    up: {
      kw: "前進・意志力・勝利",
      text: "袋鼠只會往前跳。目標清楚、全力衝刺，你會比想像中走得更遠。",
    },
    rev: {
      kw: "失控・橫衝直撞",
      text: "衝得太快，方向盤可能已經歪了。停下來看看地圖再出發。",
    },
  },
  {
    key: "strength",
    num: "VIII",
    name: "力量",
    en: "Strength",
    animal: "虎鯨",
    up: {
      kw: "溫柔的力量・勇氣・耐心",
      text: "虎鯨是海洋最強的獵手，卻也是最重視家人的動物。真正的力量是溫柔又堅定。",
    },
    rev: {
      kw: "自我懷疑・壓抑情緒",
      text: "你比自己以為的還要有力量，只是暫時忘了。慢慢來，先相信自己一次。",
    },
  },
  {
    key: "hermit",
    num: "IX",
    name: "隱士",
    en: "The Hermit",
    animal: "貓頭鷹",
    up: {
      kw: "獨處・反思・尋找答案",
      text: "貓頭鷹在夜裡安靜地觀察。暫時離開人群，提著自己的燈，答案會慢慢浮現。",
    },
    rev: {
      kw: "孤立・逃避",
      text: "獨處是為了充電，不是為了躲起來。準備好了，就回到人群裡吧。",
    },
  },
  {
    key: "wheel",
    num: "X",
    name: "命運之輪",
    en: "Wheel of Fortune",
    animal: "座頭鯨",
    up: {
      kw: "轉機・循環・好運到來",
      text: "座頭鯨每年都會遷徙，世界也一直在轉動。順著這股流動，轉機就在眼前。",
    },
    rev: {
      kw: "低潮・抗拒變化",
      text: "運氣有起有落，低潮也只是循環的一段。撐過去，輪子會再轉上來。",
    },
  },
  {
    key: "justice",
    num: "XI",
    name: "正義",
    en: "Justice",
    animal: "丹頂鶴",
    up: {
      kw: "公平・平衡・誠實面對",
      text: "丹頂鶴單腳站立也能保持平衡。用公平的眼光看待每一件事，結果自然會對。",
    },
    rev: {
      kw: "失衡・逃避責任",
      text: "天平歪了一邊，也許有些事情你還沒說清楚。誠實是找回平衡的第一步。",
    },
  },
  {
    key: "hanged",
    num: "XII",
    name: "吊人",
    en: "The Hanged Man",
    animal: "蝙蝠",
    up: {
      kw: "換個角度・暫停・等待",
      text: "蝙蝠倒掛著看世界。事情卡住的時候，試著換個角度，你會看到之前沒看到的東西。",
    },
    rev: {
      kw: "白白犧牲・拖延",
      text: "一直等待，卻沒有任何改變。是時候放下，或是做出決定了。",
    },
  },
  {
    key: "death",
    num: "XIII",
    name: "死神",
    en: "Death",
    animal: "烏鴉",
    up: {
      kw: "結束・轉變・重生",
      text: "夕陽落下，明天還會再升起。一段旅程的結束，正好是下一段的開始。",
    },
    rev: {
      kw: "抗拒結束・停滯",
      text: "緊抓著已經過去的東西不放，新的就進不來。勇敢說再見吧。",
    },
  },
  {
    key: "temperance",
    num: "XIV",
    name: "節制",
    en: "Temperance",
    animal: "海豚",
    up: {
      kw: "調和・平衡・剛剛好",
      text: "海豚在海與天之間優雅跳躍。不急不躁，把兩件事慢慢調和成剛剛好的樣子。",
    },
    rev: {
      kw: "過度・失去節奏",
      text: "某件事做得太多或太少了。回到自己的節奏，找回平衡。",
    },
  },
  {
    key: "devil",
    num: "XV",
    name: "惡魔",
    en: "The Devil",
    animal: "章魚",
    up: {
      kw: "束縛・誘惑・執著",
      text: "章魚的觸手緊緊纏住，你被什麼困住了？看清楚那條鎖鏈，其實可以自己解開。",
    },
    rev: {
      kw: "掙脫・重獲自由",
      text: "你開始意識到困住自己的是什麼，這就是解開鎖鏈的第一步。",
    },
  },
  {
    key: "tower",
    num: "XVI",
    name: "高塔",
    en: "The Tower",
    animal: "山羊",
    up: {
      kw: "劇變・打破舊局・真相揭露",
      text: "火山突然爆發，原本的平衡瞬間崩塌。看似混亂的改變，往往是重新開始的契機。",
    },
    rev: {
      kw: "抗拒改變・延遲的危機",
      text: "地底的壓力還在累積。與其假裝沒事，不如早點面對、讓能量慢慢釋放。",
    },
  },
  {
    key: "star",
    num: "XVII",
    name: "星星",
    en: "The Star",
    animal: "企鵝",
    up: {
      kw: "希望・療癒・靈感",
      text: "企鵝在寒冷的極地仰望星空。風暴過後，請相信前方有光。",
    },
    rev: {
      kw: "失去信心・迷惘",
      text: "暫時看不見星星時，別忘了你心裡還有指南針。慢慢來，方向會回來的。",
    },
  },
  {
    key: "moon",
    num: "XVIII",
    name: "月亮",
    en: "The Moon",
    animal: "狼",
    up: {
      kw: "不安・直覺・看不清的事",
      text: "月光下的一切都朦朧不清。先別急著下結論，讓直覺帶你走過這段迷霧。",
    },
    rev: {
      kw: "迷霧散去・真相浮現",
      text: "困擾你的不安慢慢退去，事情的樣子越來越清楚了。",
    },
  },
  {
    key: "sun",
    num: "XIX",
    name: "太陽",
    en: "The Sun",
    animal: "狐獴",
    up: {
      kw: "快樂・成功・活力",
      text: "狐獴站得直挺挺地曬太陽。好事正在發生，盡情享受這份溫暖吧。",
    },
    rev: {
      kw: "短暫低落・過度樂觀",
      text: "太陽只是被雲遮住了一下。調整一下期待，好心情很快就回來。",
    },
  },
  {
    key: "judgement",
    num: "XX",
    name: "審判",
    en: "Judgement",
    animal: "老鷹",
    up: {
      kw: "覺醒・回顧・重新出發",
      text: "老鷹從高處看清一切。回頭看看走過的路，你已經準備好迎接新的階段。",
    },
    rev: {
      kw: "自我批判・錯過召喚",
      text: "對自己太嚴格，反而聽不見內心的聲音。原諒過去，才能往前走。",
    },
  },
  {
    key: "world",
    num: "XXI",
    name: "世界",
    en: "The World",
    animal: "鯨鯊",
    up: {
      kw: "完成・圓滿・新的循環",
      text: "鯨鯊游遍世界的大洋，終於完成一趟旅程。好好慶祝，下一段冒險已經在等你。",
    },
    rev: {
      kw: "差一點點・還沒結束",
      text: "只差最後一步了。別急著放棄，把剩下的那塊拼圖補上。",
    },
  },
];
