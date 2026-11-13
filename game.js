// 横画面アーケード版 GomiSortingGame ロジック
// スキルツリー（渋谷路線図 SKILL LINES） ＆ レリック・アイテムスロット完全対応

const RELIC_DATA = {
  coin: {
    id: 'coin',
    name: '回収員のコイン',
    icon: 'assets/sprites/png/relic_coin@4x.png',
    colorClass: 'slot-gold',
    desc: '分別するたびに回収員からチップ支給！獲得EP+30%＆スコア+10%'
  },
  clock: {
    id: 'clock',
    name: '渋谷駅の古時計',
    icon: 'assets/sprites/png/relic_clock@4x.png',
    colorClass: 'slot-blue',
    desc: 'ハチ公前時計台の歯車。時間減少速度15%緩和＆正解時回復+0.5秒'
  },
  star: {
    id: 'star',
    name: '美化スターバッジ',
    icon: 'assets/sprites/png/relic_star@4x.png',
    colorClass: 'slot-purple',
    desc: '輝く美化委員の証。5コンボからフィーバー突入＆フィーバー倍率2.0倍'
  },
  broom: {
    id: 'broom',
    name: 'エコほうき',
    icon: 'assets/sprites/png/relic_broom@4x.png',
    colorClass: 'slot-green',
    desc: '路地裏を瞬時に清掃！コンボ3回ごとにボーナススコア+100'
  },
  dragon_snack: {
    id: 'dragon_snack',
    name: 'どらごんの好物',
    icon: 'assets/sprites/png/dragon_zasshoku@4x.png',
    colorClass: 'slot-purple',
    desc: '雑食どらごん大好物のジャンク品！どらごん分別正解時の得点2倍＆時間+3秒'
  }
};

// ================= スキルライン.html 定義データ =================
const IC = {
  heart: ['.##..##.', '########', '########', '########', '.######.', '..####..', '...##...'],
  clock: ['..####..', '.#....#.', '#..#...#', '#..#...#', '#..###.#', '.#....#.', '..####..'],
  flame: ['...#....', '..##....', '.####.#.', '.#####.#', '########', '.######.', '..####..'],
  hour: ['########', '.#....#.', '..#..#..', '...##...', '..#..#..', '.#.##.#.', '########'],
  shield: ['########', '########', '########', '########', '.######.', '..####..', '...##...'],
  slot: ['########', '#......#', '#..##..#', '#.####.#', '#.####.#', '#..##..#', '########'],
  draft: ['.######.', '.#....#.', '.#.##.#.', '.#.##.#.', '.#....#.', '.######.'],
  dice: ['########', '#.#..#.#', '#......#', '#..##..#', '#......#', '#.#..#.#', '########'],
  gem: ['..####..', '.######.', '########', '.######.', '..####..', '...##...'],
  crown: ['#.#..#.#', '########', '########', '.######.', '.######.'],
  eye: ['..####..', '.######.', '##.##.##', '##.##.##', '.######.', '..####..'],
  arrow: ['....#...', '....##..', '########', '########', '....##..', '....#...'],
  book: ['########', '#.##.##.', '#.##.##.', '#.##.##.', '#.##.##.', '########'],
  star: ['...##...', '...##...', '########', '.######.', '..####..', '.##..##.', '.#....#.'],
  coin: ['..####..', '.######.', '##.##.##', '##.##.##', '.######.', '..####..'],
  trash: ['.######.', '########', '.#.##.#.', '.#.##.#.', '.#.##.#.', '.#.##.#.', '.######.'],
  spray: ['..###...', '..###...', '.#####..', '.#...#..', '.#...#..', '.#...#..', '.#####..'],
  up: ['...##...', '..####..', '.######.', '...##...', '...##...', '...##...', '...##...'],
  dragon: ['#.#..#.#', '########', '#.####.#', '########', '########', '.#.##.#.', '.######.'],
  q: ['..#####.', '.##...##', '......##', '....##..', '...##...', '........', '...##...']
};

const px = (k, col, sx, sy, sc) => {
  let r = '';
  if (!IC[k]) k = 'q';
  IC[k].forEach((row, y) => [...row].forEach((c, x) => {
    if (c === '#') r += `<rect x="${sx + x * sc}" y="${sy + y * sc}" width="${sc}" height="${sc}" fill="${col}"/>`;
  }));
  return r;
};

const L = [
  {
    n: '1号線', c: '#e0707e', t: '体', items: [
      ['予備ハート', 'ミス許容数+1 (最大4回)', 300, 'heart'],
      ['タイム延長', '初期制限時間+5秒', 400, 'clock'],
      ['フィーバー強化', 'フィーバー時回復+2秒', 500, 'flame'],
      ['ひと息', 'フロア開始時時間+3秒', 600, 'hour'],
      'T0',
      ['終電ダッシュ', '残り10秒未満でスコア1.5倍', 900, 'flame'],
      ['予備ハートⅡ', 'ミス許容数さらに+1 (最大5回)', 1200, 'heart'],
      ['タイム延長Ⅱ', '初期制限時間さらに+5秒', 1500, 'clock'],
      ['始発まで', 'ハート0時に1回だけ復活', 2200, 'shield']
    ]
  },
  {
    n: '2号線', c: '#9a8cf0', t: '装', items: [
      ['スロット拡張Ⅰ', 'レリック枠拡張 (最大3枠)', 400, 'slot'],
      ['ドラフト拡張', 'レリック選択肢が3択に増加', 500, 'draft'],
      ['リロール', 'ドラフトで1回引き直せる', 700, 'dice'],
      ['目利き', 'ドラフトにレア出現率UP', 900, 'eye'],
      'T0',
      ['スロット拡張Ⅱ', 'レリック枠拡張 (最大4枠)', 1000, 'slot'],
      'T1',
      ['レアレリック解放', '強力なレリックが出現', 1200, 'gem'],
      ['双子ドラフト', 'フロア突破時ドラフトが2回に', 1800, 'draft'],
      ['伝説レリック枠', '伝説レリックが出現可能に', 2500, 'crown']
    ]
  },
  {
    n: '3号線', c: '#e0b050', t: '知', items: [
      ['分別ヒント', 'フロア毎1回、正解ゴミ箱が発光', 300, 'eye'],
      ['NEXT先読み', 'NEXTの？が1個公開', 500, 'arrow'],
      ['ミス解説', '誤分別時に理由を表示', 500, 'book'],
      ['スロウタイム', 'フロア毎1回、2秒減速', 800, 'hour'],
      ['NEXT先読みⅡ', 'NEXTの？がもう1個公開', 1000, 'arrow'],
      ['スロウタイムⅡ', '減速時間が3秒に延長', 1300, 'hour'],
      'T1',
      ['分別辞典', '図鑑登録でEP獲得', 1500, 'star'],
      'T2',
      ['分別マスター', '図鑑コンプで名誉称号', 2000, 'crown']
    ]
  },
  {
    n: '4号線', c: '#52c4a4', t: '街', items: [
      ['エコ助成金', '獲得EP常時+25%', 400, 'coin'],
      ['日常ゴミ(Tier 2)', '傘・テープ・保冷剤解禁', 500, 'trash'],
      ['回収ボーナス', 'コンボ時の加点スコア増加', 700, 'up'],
      'T3',
      ['エコ助成金Ⅱ', '獲得EPさらに+25%', 900, 'coin'],
      ['危険物・金属(Tier 3)', 'スプレー缶・電池等解禁', 1000, 'spray'],
      ['高得点ゴミ増加', '高得点ゴミの出現率UP', 1200, 'star'],
      ['特別回収日', 'ランダムフロアでEP2倍', 1600, 'gem'],
      'T2',
      ['一周ボーナス', 'クリア毎にEP倍率UP', 2000, 'up']
    ]
  },
  {
    n: '5号線', c: '#5aa6e0', t: '竜', items: [
      ['餌やり', 'どらごん誤投入ペナルティ軽減', 400, 'dragon'],
      ['粗大ごみ処理', '粗大ごみのスコア上昇', 600, 'trash'],
      ['好物', 'どらごん好物投入でボーナス', 800, 'coin'],
      'T3',
      ['どらごん進化', 'どらごんの見た目が変化', 1000, 'dragon'],
      ['満腹ガード', '誤投入ミスを1回だけ無効化', 1500, 'shield'],
      ['大食い', 'フロア毎1回、全ゴミ捕食', 2500, 'crown']
    ]
  }
];

const TT = {
  T0: { n: 'スクランブル', d: 'フィーバー中、レリック効果2倍', cost: 2000 },
  T1: { n: '宮益坂', d: '危険物出現前にヒント表示', cost: 2200 },
  T2: { n: '道玄坂', d: '図鑑登録でEP獲得', cost: 2400 },
  T3: { n: '神南', d: 'どらごんの食事でEP獲得', cost: 2500 }
};

// カラーの明度を落とすヘルパー関数
const dimColor = (hex, factor = 0.55) => {
  if (!hex || hex[0] !== '#') return '#6f6ba3';
  const c = parseInt(hex.slice(1), 16);
  const r = Math.round(((c >> 16) & 255) * factor);
  const g = Math.round(((c >> 8) & 255) * factor);
  const b = Math.round((c & 255) * factor);
  return `rgb(${r},${g},${b})`;
};

const X = i => 150 + 72 * i;
const Y = l => 64 + 86 * l;
const DY = 43;

const N = {};
const R = {};
const tp = {};

L.forEach((l, li) => {
  let col = 0, prev = null, k = 0;
  R[li] = [];
  l.items.forEach(it => {
    if (typeof it === 'string') {
      tp[it] = tp[it] || { col, ls: [] };
      tp[it].ls.push({ li, prev });
      R[li].push(it);
      col++;
    } else {
      const id = li + '_' + k++;
      N[id] = { id, name: it[0], d: it[1], cost: it[2], ic: it[3], c: l.c, x: X(col), y: Y(li), req: [prev || 'hub'], tag: l.n };
      R[li].push(id);
      prev = id;
      col++;
    }
  });
});

Object.entries(tp).forEach(([k, t]) => {
  const [a, b] = t.ls;
  N[k] = {
    id: k,
    name: TT[k].n,
    d: TT[k].d,
    cost: TT[k].cost,
    ic: 'gem',
    c: '#d8d4f5',
    x: X(t.col),
    y: (Y(a.li) + Y(b.li)) / 2,
    req: [a.prev, b.prev],
    tag: '乗換駅',
    tr: 1,
    cs: [L[a.li].c, L[b.li].c]
  };
});



class GomiGame {
  constructor() {
    this.items = window.GOMI_DATA || [];
    this.maxTime = 25.0; // 秒
    this.timeLeft = this.maxTime;
    this.timerInterval = null;
    this.currentScore = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.lives = 3;
    this.currentItem = null;
    this.nextQueue = [];
    this.isGameOver = false;
    this.isPausedForDraft = false;
    this.isPaused = false;

    // 装備中のレリック（プレイ中のみ保持）
    this.equippedRelics = [];

    // フロア（階層）
    this.floors = [
      { name: '渋谷駅前スクランブル', count: 10 },
      { name: '渋谷センター街', count: 20 },
      { name: '道玄坂路地裏', count: 35 },
      { name: '宮下パーク屋上', count: 50 },
      { name: '雑食どらごんの巣', count: 999 }
    ];
    this.currentFloorIndex = 0;
    this.sortedInRun = 0;

    // スキル選択中ノード
    this.selectedSkillId = '1_0';
    this.isSkillTrainMoving = false;

    // 永続化ステータス
    this.saveData = this.loadSaveData();

    // DOM要素キャッシュ
    this.cacheDOM();

    // ウィンドウリサイズ（16:9 スケーリング）
    this.initScaling();

    // イベントバインド
    this.bindEvents();

    // タイトル更新
    this.updateTitleScreenStats();
  }

  initScaling() {
    const cabinet = document.getElementById('game-cabinet');
    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const scaleX = w / 960;
      const scaleY = h / 540;
      const scale = Math.min(scaleX, scaleY); // 全画面: 上限なしでウィンドウいっぱいに拡大
      cabinet.style.transform = `scale(${scale})`;
    };
    window.addEventListener('resize', resize);
    resize();
  }

  loadSaveData() {
    const defaultData = {
      points: 600, // 初期ボーナスEP
      highScore: 0,
      skills: ['0_0', '0_1', '1_0', '3_0'], // 初期開通駅
      zukan: {}
    };
    try {
      const saved = localStorage.getItem('shibuya_gomi_save_v3');
      if (saved) {
        return { ...defaultData, ...JSON.parse(saved) };
      }
      // v2以前からの引継ぎ
      const oldSaved = localStorage.getItem('shibuya_gomi_save_v2');
      if (oldSaved) {
        const oldData = JSON.parse(oldSaved);
        defaultData.points = oldData.points || defaultData.points;
        defaultData.highScore = oldData.highScore || 0;
        defaultData.zukan = oldData.zukan || {};
        if (oldData.skills) {
          if (oldData.skills.includes('slot_3')) defaultData.skills.push('1_0');
          if (oldData.skills.includes('slot_4')) defaultData.skills.push('1_4');
          if (oldData.skills.includes('extra_life')) defaultData.skills.push('0_0');
          if (oldData.skills.includes('extra_time')) defaultData.skills.push('0_1');
          if (oldData.skills.includes('tier_2')) defaultData.skills.push('3_1');
          if (oldData.skills.includes('tier_3')) defaultData.skills.push('3_4');
        }
      }
    } catch (e) {
      console.warn('LocalStorage load failed', e);
    }
    return defaultData;
  }

  saveGameData() {
    try {
      localStorage.setItem('shibuya_gomi_save_v3', JSON.stringify(this.saveData));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }

  hasSkill(skillId) {
    return this.saveData.skills && this.saveData.skills.includes(skillId);
  }

  getMaxRelicSlots() {
    let slots = 2; // 基本2枠
    if (this.hasSkill('1_0')) slots = 3; // スロット拡張Ⅰ
    if (this.hasSkill('1_4')) slots = 4; // スロット拡張Ⅱ
    return slots;
  }

  getUnlockedTiers() {
    const tiers = [1];
    if (this.hasSkill('3_1')) tiers.push(2); // 日常ゴミ (Tier 2)
    if (this.hasSkill('3_4')) tiers.push(3); // 危険物・金属 (Tier 3)
    return tiers;
  }

  cacheDOM() {
    // 画面
    this.titleScreen = document.getElementById('title-screen');
    this.gameScreen = document.getElementById('game-screen');
    this.resultScreen = document.getElementById('result-screen');

    // モーダル
    this.zukanModal = document.getElementById('zukan-modal');
    this.treeModal = document.getElementById('tree-modal');
    this.relicDraftModal = document.getElementById('relic-draft-modal');
    this.pauseModal = document.getElementById('pause-modal');
    this.helpModal = document.getElementById('help-modal');

    // HUD
    this.hudScore = document.getElementById('hud-score');
    this.hudLives = document.getElementById('hud-lives');
    this.relicRow = document.getElementById('relic-row');
    this.relicTooltip = document.getElementById('relic-tooltip');
    this.tooltipTitle = document.getElementById('tooltip-title');
    this.tooltipDesc = document.getElementById('tooltip-desc');
    this.floorText = document.getElementById('floor-text');
    this.areaName = document.getElementById('area-name');
    this.areaDots = document.getElementById('area-dots');
    this.nextQueueEl = document.getElementById('next-queue');
    this.timerBlocksContainer = document.getElementById('timer-blocks-container');

    // ゴミステージ
    this.itemIcon = document.getElementById('item-icon');
    this.itemName = document.getElementById('item-name');
    this.itemCondition = document.getElementById('item-condition');
    this.itemTierBadge = document.getElementById('item-tier-badge');
    this.comboPopup = document.getElementById('combo-popup');
    this.feedbackPopup = document.getElementById('feedback-popup');
    this.missPopup = document.getElementById('miss-popup');

    // スキルツリーSVG & aside
    this.skillSvg = document.getElementById('skill-tree-svg');
    this.skillMapContainer = document.getElementById('skill-map-container');
    this.skillBuyBtn = document.getElementById('skill-buy-btn');
  }

  bindEvents() {
    // タイトルボタン
    document.getElementById('start-btn').addEventListener('click', () => this.startGame());
    document.getElementById('zukan-btn').addEventListener('click', () => this.openZukan());
    document.getElementById('shop-btn').addEventListener('click', () => this.openTree());
    document.getElementById('help-btn').addEventListener('click', () => this.openHelp());

    // サウンド切替
    const soundToggle = document.getElementById('sound-toggle');
    if (soundToggle) {
      soundToggle.addEventListener('click', () => {
        const enabled = window.soundManager.toggleSound();
        soundToggle.classList.toggle('muted', !enabled);
      });
    }

    // ポーズボタン
    const pauseBtn = document.getElementById('pause-btn');
    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => this.togglePause());
    }

    // ポーズモーダル内ボタン
    document.getElementById('resume-btn').addEventListener('click', () => this.togglePause(false));
    document.getElementById('pause-sound-btn').addEventListener('click', () => {
      const enabled = window.soundManager.toggleSound();
      if (soundToggle) soundToggle.classList.toggle('muted', !enabled);
    });
    document.getElementById('pause-retry-btn').addEventListener('click', () => {
      this.togglePause(false);
      this.startGame();
    });
    document.getElementById('pause-title-btn').addEventListener('click', () => {
      this.togglePause(false);
      this.showTitleScreen();
    });

    // リザルトボタン
    document.getElementById('retry-btn').addEventListener('click', () => this.startGame());
    document.getElementById('share-btn').addEventListener('click', () => this.shareToX());
    document.getElementById('result-zukan-btn').addEventListener('click', () => this.openZukan());
    document.getElementById('title-btn').addEventListener('click', () => this.showTitleScreen());

    // モーダル閉じる
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', () => this.closeModals());
    });

    // 分別ステーションボタン（クリック）
    const binBtns = document.querySelectorAll('.station-bin-btn');
    binBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.dataset.category;
        this.handleSort(cat);
      });
    });

    // スキルツリードラッグスクロール
    if (this.skillMapContainer) {
      let dn = 0, sx0 = 0, sl0 = 0;
      this.skillMapContainer.onpointerdown = e => {
        dn = 1;
        this.isMapMoved = 0;
        sx0 = e.clientX;
        sl0 = this.skillMapContainer.scrollLeft;
      };
      this.skillMapContainer.onpointermove = e => {
        if (dn && Math.abs(e.clientX - sx0) > 4) {
          this.isMapMoved = 1;
          this.skillMapContainer.scrollLeft = sl0 - (e.clientX - sx0);
        }
      };
      window.addEventListener('pointerup', () => {
        dn = 0;
        setTimeout(() => this.isMapMoved = 0, 50);
      });
    }

    // スキル発車ボタン
    if (this.skillBuyBtn) {
      this.skillBuyBtn.onclick = () => this.buySkillNode();
    }

    // EP振り直しボタン
    const skillResetBtn = document.getElementById('skill-reset-btn');
    if (skillResetBtn) {
      skillResetBtn.addEventListener('click', () => this.resetSkills());
    }

    // 振り直し確認モーダルボタン
    const resetCancelBtn = document.getElementById('reset-cancel-btn');
    if (resetCancelBtn) {
      resetCancelBtn.addEventListener('click', () => this.closeResetModal());
    }
    const resetOkBtn = document.getElementById('reset-ok-btn');
    if (resetOkBtn) {
      resetOkBtn.addEventListener('click', () => this.executeResetSkills());
    }

    // キーボード操作
    window.addEventListener('keydown', (e) => {
      if (e.repeat) return;

      // タイトル画面でSPACE
      if (!this.titleScreen.classList.contains('hidden')) {
        if (e.code === 'Space' || e.code === 'Enter') {
          e.preventDefault();
          this.startGame();
          return;
        }
      }

      // サウンド・ヘルプショートカット
      if (e.key.toLowerCase() === 'm') {
        const enabled = window.soundManager.toggleSound();
        if (soundToggle) soundToggle.classList.toggle('muted', !enabled);
        return;
      }

      // ポーズ [P] または [Escape]
      if (e.key.toLowerCase() === 'p' || e.code === 'Escape') {
        if (!this.gameScreen.classList.contains('hidden') && !this.isGameOver && !this.isPausedForDraft) {
          e.preventDefault();
          this.togglePause();
          return;
        }
      }

      // ゲーム中
      if (!this.gameScreen.classList.contains('hidden') && !this.isGameOver && !this.isPausedForDraft && !this.isPaused) {
        const key = e.key.toLowerCase();
        if (key === 'q') {
          this.handleSort('burnable');
        } else if (key === 'w') {
          this.handleSort('unburnable');
        } else if (key === 'e') {
          this.handleSort('resource');
        } else if (key === 'r') {
          this.handleSort('oversized');
        } else if (key === '5' || e.code === 'Space') {
          e.preventDefault();
          this.handleSort('dragon');
        }
      }
    });
  }

  updateTitleScreenStats() {
    document.getElementById('title-high-score').textContent = String(this.saveData.highScore).padStart(6, '0');
    document.getElementById('title-points').textContent = this.saveData.points.toLocaleString();
  }

  startGame() {
    window.soundManager.playClick();
    this.isGameOver = false;
    this.isPausedForDraft = false;
    this.isPaused = false;
    this.currentScore = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.equippedRelics = []; // 毎回のランで初期化

    // スキルによる初期値
    this.lives = this.hasSkill('0_5') ? 5 : (this.hasSkill('0_0') ? 4 : 3);
    this.maxTime = this.hasSkill('0_6') ? 35.0 : (this.hasSkill('0_1') ? 30.0 : 25.0);
    this.timeLeft = this.maxTime;
    this.currentFloorIndex = 0;
    this.sortedInRun = 0;

    // キュー初期化
    this.nextQueue = [];
    for (let i = 0; i < 3; i++) {
      this.nextQueue.push(this.getRandomItem());
    }

    // 画面切り替え
    this.titleScreen.classList.add('hidden');
    this.resultScreen.classList.add('hidden');
    this.gameScreen.classList.remove('hidden');
    this.closeModals();

    this.renderRelicSlots();
    this.updateHUD();
    this.popNextItem();

    // タイマー（100ms周期）
    this.startTimer();
  }

  togglePause(forceState = null) {
    if (this.isGameOver || this.isPausedForDraft) return;

    if (forceState !== null) {
      this.isPaused = forceState;
    } else {
      this.isPaused = !this.isPaused;
    }

    window.soundManager.playClick();

    if (this.isPaused) {
      document.getElementById('pause-floor').textContent = `FLOOR ${this.currentFloorIndex + 1} / 5 (${this.floors[this.currentFloorIndex].name})`;
      document.getElementById('pause-score').textContent = String(this.currentScore).padStart(6, '0');
      this.pauseModal.classList.remove('hidden');
    } else {
      this.pauseModal.classList.add('hidden');
    }
  }

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    const stepMs = 100;
    this.timerInterval = setInterval(() => {
      if (this.isPausedForDraft || this.isPaused) return;

      // 古時計レリック: 時間減少速度15%緩和
      const timeDeduction = this.hasEquippedRelic('clock') ? (stepMs / 1000) * 0.85 : (stepMs / 1000);
      this.timeLeft -= timeDeduction;

      if (this.timeLeft <= 0) {
        this.timeLeft = 0;
        this.gameOver('タイムアップ！渋谷のゴミ山に埋もれた！');
      }
      this.renderTimerBlocks();
    }, stepMs);
  }

  hasEquippedRelic(relicId) {
    return this.equippedRelics.includes(relicId);
  }

  renderTimerBlocks() {
    if (!this.timerBlocksContainer) return;
    const totalBlocks = 30;
    const activeBlocks = Math.max(0, Math.min(totalBlocks, Math.round((this.timeLeft / this.maxTime) * totalBlocks)));
    const isDanger = activeBlocks <= 7;

    let html = '';
    for (let i = 0; i < totalBlocks; i++) {
      const isOn = i < activeBlocks;
      html += `<div class="timer-block ${isOn ? (isDanger ? 'danger' : '') : 'off'}"></div>`;
    }
    this.timerBlocksContainer.innerHTML = html;
  }

  renderRelicSlots() {
    if (!this.relicRow) return;
    const maxSlots = this.getMaxRelicSlots();
    const totalDisplaySlots = 5; // 見た目上5枠表示（未開放枠は鍵アイコン）

    let html = '';
    for (let i = 0; i < totalDisplaySlots; i++) {
      const isSlotUnlocked = i < maxSlots;
      const equippedRelicId = this.equippedRelics[i];
      const relic = equippedRelicId ? RELIC_DATA[equippedRelicId] : null;

      if (!isSlotUnlocked) {
        html += `
          <div class="relic-slot locked" title="スキルツリーでスロット拡張可能">
            <span class="relic-lock-icon">🔒</span>
          </div>
        `;
      } else if (relic) {
        html += `
          <div class="relic-slot ${relic.colorClass}" data-relic="${relic.id}">
            <img src="${relic.icon}" alt="${relic.name}" class="relic-slot-img">
          </div>
        `;
      } else {
        html += `
          <div class="relic-slot" title="空きスロット">
            <span style="color:#4a4272;font-size:11px;">空</span>
          </div>
        `;
      }
    }
    this.relicRow.innerHTML = html;

    // スロットのホバーイベントでツールチップ表示
    const slotEls = this.relicRow.querySelectorAll('.relic-slot[data-relic]');
    slotEls.forEach(el => {
      const rId = el.dataset.relic;
      const rData = RELIC_DATA[rId];
      el.addEventListener('mouseenter', () => this.showRelicTooltip(rData.name, rData.desc));
      el.addEventListener('mouseleave', () => this.hideRelicTooltip());
    });
  }

  showRelicTooltip(title, desc) {
    if (!this.relicTooltip) return;
    this.tooltipTitle.textContent = title;
    this.tooltipDesc.textContent = desc;
    this.relicTooltip.classList.remove('hidden');
  }

  hideRelicTooltip() {
    if (!this.relicTooltip) return;
    this.relicTooltip.classList.add('hidden');
  }

  updateHUD() {
    // スコア
    this.hudScore.textContent = String(this.currentScore).padStart(6, '0');

    // ライフ（ドット絵ハートPNG）
    let livesHtml = '';
    const maxLives = this.hasSkill('0_5') ? 5 : (this.hasSkill('0_0') ? 4 : 3);
    for (let i = 0; i < maxLives; i++) {
      const isAlive = i < this.lives;
      livesHtml += `
        <img src="assets/sprites/png/heart@4x.png" alt="heart" class="pixel-heart" style="${isAlive ? '' : 'filter: grayscale(1) opacity(0.2);'}">
      `;
    }
    this.hudLives.innerHTML = livesHtml;

    // フロア更新
    const floor = this.floors[this.currentFloorIndex];
    this.floorText.textContent = `FLOOR ${this.currentFloorIndex + 1} / 5`;
    this.areaName.textContent = floor.name;

    // フロアドット
    const dots = this.areaDots.querySelectorAll('.area-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx <= this.currentFloorIndex);
    });

    // NEXTキュー表示
    let queueHtml = '';
    this.nextQueue.forEach(item => {
      queueHtml += `<div class="next-box" title="${item.name}">${item.icon || '？'}</div>`;
    });
    this.nextQueueEl.innerHTML = queueHtml;

    this.renderTimerBlocks();
  }

  getRandomItem() {
    const unlocked = this.getUnlockedTiers();
    const pool = this.items.filter(item => unlocked.includes(item.tier));
    if (pool.length === 0) return this.items[0];
    const idx = Math.floor(Math.random() * pool.length);
    return pool[idx];
  }

  popNextItem() {
    this.currentItem = this.nextQueue.shift();
    this.nextQueue.push(this.getRandomItem());

    // 図鑑遭遇カウント
    const itemId = this.currentItem.id;
    if (!this.saveData.zukan[itemId]) {
      this.saveData.zukan[itemId] = { seen: 0, correct: 0 };
    }
    this.saveData.zukan[itemId].seen += 1;

    // ドット絵画像がある場合（ネガフィルムなど）はimgタグ表示、それ以外は絵文字
    if (this.currentItem.name.includes('写真フィルム') || this.currentItem.name.includes('ネガ')) {
      this.itemIcon.innerHTML = `<img src="assets/sprites/png/item_film_negative@4x.png" alt="${this.currentItem.name}" style="width:48px;height:48px;image-rendering:pixelated;">`;
    } else {
      this.itemIcon.textContent = this.currentItem.icon || '🗑️';
    }

    this.itemName.textContent = this.currentItem.name;
    this.itemCondition.textContent = this.currentItem.condition || this.getConditionHint(this.currentItem);
    this.itemTierBadge.textContent = `TIER ${this.currentItem.tier} / ${this.currentItem.basePoints}PT`;

    // アニメーションリセット
    const box = document.getElementById('trash-item-box');
    box.style.animation = 'none';
    box.offsetHeight;
    box.style.animation = 'item-float 1.2s steps(2) infinite';

    this.updateHUD();
  }

  getConditionHint(item) {
    if (item.category === 'dragon') return '区では収集不可の特殊物！';
    if (item.category === 'oversized') return '一辺が30cm以上！';
    if (item.category === 'resource') return 'きれいに洗浄・分別済み！';
    if (item.notes && item.notes.length > 0) return item.notes.split('。')[0];
    return '通常状態';
  }

  handleSort(selectedCategory) {
    if (this.isGameOver || this.isPausedForDraft || this.isPaused || !this.currentItem) return;

    const isCorrect = (selectedCategory === this.currentItem.category);

    if (isCorrect) {
      // 正解処理
      this.combo += 1;
      if (this.combo > this.maxCombo) this.maxCombo = this.combo;
      this.sortedInRun += 1;

      // レリック: 美化ほうき（コンボ3回ごとに+100）
      let broomBonus = 0;
      if (this.hasEquippedRelic('broom') && this.combo % 3 === 0) {
        broomBonus = 100;
      }

      // レリック: スターバッジ（5コンボでフィーバー、倍率2.0倍）
      const feverThreshold = this.hasEquippedRelic('star') ? 5 : 10;
      const isFever = this.combo >= feverThreshold;
      const feverMultiplier = isFever ? (this.hasEquippedRelic('star') ? 2.0 : 1.5) : 1.0;

      const comboMultiplier = 1 + Math.min(this.combo - 1, 20) * 0.1;
      let basePoints = this.currentItem.basePoints;

      // レリック: どらごんの好物（どらごん正解時スコア2倍）
      if (selectedCategory === 'dragon' && (this.hasEquippedRelic('dragon_snack') || this.hasSkill('4_2'))) {
        basePoints *= 2;
      }

      // レリック: コイン（スコア+10%）
      const coinBonusMultiplier = this.hasEquippedRelic('coin') ? 1.1 : 1.0;

      const points = Math.round(basePoints * comboMultiplier * feverMultiplier * coinBonusMultiplier) + broomBonus;
      this.currentScore += points;

      // 時間回復
      let timeRecovery = 1.2;
      if (this.hasEquippedRelic('clock')) timeRecovery += 0.5;
      if (selectedCategory === 'dragon' && this.hasEquippedRelic('dragon_snack')) timeRecovery += 3.0;
      if (isFever && this.hasSkill('0_2')) timeRecovery += 2.0; // フィーバー強化

      this.timeLeft = Math.min(this.maxTime, this.timeLeft + timeRecovery);

      // サウンド
      if (selectedCategory === 'dragon') {
        window.soundManager.playDragon();
      } else {
        window.soundManager.playCorrect(this.combo);
      }
      if (this.combo === feverThreshold) {
        window.soundManager.playFever();
      }

      // 図鑑正解カウント
      this.saveData.zukan[this.currentItem.id].correct += 1;

      // ポップアップ表示
      this.showPopups(true, `+${points}`);

      // フロア進行＆レリックドラフト判定
      const currentFloorReq = this.floors[this.currentFloorIndex].count;
      if (this.sortedInRun >= currentFloorReq && this.currentFloorIndex < this.floors.length - 1) {
        this.currentFloorIndex += 1;
        this.triggerRelicDraft();
        return;
      }

      this.popNextItem();
    } else {
      // 不正解（ミス）
      this.combo = 0;
      this.lives -= 1;

      // 爆発エフェクトを間違えたゴミ箱の上に発生
      const targetBtn = document.querySelector(`[data-category="${selectedCategory}"]`);
      if (targetBtn) {
        const boom = document.createElement('div');
        boom.className = 'explode-effect';
        boom.textContent = '💥';
        targetBtn.appendChild(boom);
        setTimeout(() => boom.remove(), 400);
      }

      window.soundManager.playWrong();
      this.showPopups(false, 'MISS!');

      if (this.lives <= 0) {
        const catNames = {
          burnable: '可燃ごみ',
          unburnable: '不燃ごみ',
          resource: '資源ごみ',
          oversized: '粗大ごみ',
          dragon: '雑食どらごん'
        };
        const deathMsg = `【悲報】${this.currentItem.name} を ${catNames[selectedCategory]} に突っ込んで渋谷が焦土と化した！`;
        this.gameOver(deathMsg);
      } else {
        this.popNextItem();
      }
    }
  }

  // フロアクリア時のレリック獲得ドラフト
  triggerRelicDraft() {
    this.isPausedForDraft = true;
    window.soundManager.playFever();

    // 選択肢候補の作成（未装備のレリック）
    const allRelicKeys = Object.keys(RELIC_DATA);
    let pool = allRelicKeys.filter(k => !this.equippedRelics.includes(k));
    
    // rare_relics未解放ならドラゴン好物は出にくい
    if (!this.hasSkill('1_5')) { // レアレリック解放
      pool = pool.filter(k => k !== 'dragon_snack');
    }
    if (pool.length === 0) pool = allRelicKeys;

    // シャッフル
    pool = pool.sort(() => 0.5 - Math.random());

    // 選択肢数（スキルで3択、初期2択）
    const choiceCount = this.hasSkill('1_1') ? 3 : 2; // ドラフト拡張
    const candidates = pool.slice(0, choiceCount);

    const container = document.getElementById('relic-draft-cards');
    container.innerHTML = '';

    candidates.forEach(key => {
      const relic = RELIC_DATA[key];
      const card = document.createElement('div');
      card.className = 'draft-card';
      card.innerHTML = `
        <img src="${relic.icon}" alt="${relic.name}" class="draft-card-img">
        <div class="draft-card-title">${relic.name}</div>
        <div class="draft-card-desc">${relic.desc}</div>
        <button class="draft-card-select-btn">装備する</button>
      `;
      card.onclick = () => {
        this.selectDraftRelic(relic.id);
      };
      container.appendChild(card);
    });

    this.relicDraftModal.classList.remove('hidden');
  }

  selectDraftRelic(relicId) {
    window.soundManager.playClick();
    this.relicDraftModal.classList.add('hidden');

    const maxSlots = this.getMaxRelicSlots();
    if (this.equippedRelics.length < maxSlots) {
      this.equippedRelics.push(relicId);
    } else {
      // スロット満杯時は先頭と入れ替え
      this.equippedRelics.shift();
      this.equippedRelics.push(relicId);
    }

    this.renderRelicSlots();
    const relic = RELIC_DATA[relicId];
    this.showRelicTooltip(`獲得: ${relic.name}`, relic.desc);
    setTimeout(() => this.hideRelicTooltip(), 3000);

    this.isPausedForDraft = false;
    this.popNextItem();
  }

  showPopups(isCorrect, text) {
    if (isCorrect) {
      // 正解：左横にスコア、右横にコンボ
      this.feedbackPopup.textContent = text;
      this.feedbackPopup.classList.remove('hidden');
      setTimeout(() => this.feedbackPopup.classList.add('hidden'), 500);

      if (this.combo >= 2) {
        this.comboPopup.textContent = `${this.combo} COMBO!`;
        this.comboPopup.classList.remove('hidden');
        setTimeout(() => this.comboPopup.classList.add('hidden'), 700);
      }
      if (this.missPopup) this.missPopup.classList.add('hidden');
    } else {
      // ミス：スコア・コンボとは別の位置（中央真上）に赤色で大きくMISS表示
      this.feedbackPopup.classList.add('hidden');
      this.comboPopup.classList.add('hidden');

      if (this.missPopup) {
        this.missPopup.textContent = text || 'MISS!';
        this.missPopup.classList.remove('hidden');
        setTimeout(() => this.missPopup.classList.add('hidden'), 600);
      }
    }
  }

  gameOver(reason) {
    this.isGameOver = true;
    if (this.timerInterval) clearInterval(this.timerInterval);
    window.soundManager.playGameOver();

    // エコポイント獲得（10%基本）
    let epRatio = 0.1;
    if (this.hasSkill('3_0')) epRatio += 0.025; // エコ助成金 (+25%)
    if (this.hasSkill('3_3')) epRatio += 0.025; // エコ助成金Ⅱ (+25%)
    if (this.hasEquippedRelic('coin')) epRatio += 0.03; // +30%

    const earnedPoints = Math.floor(this.currentScore * epRatio);
    this.saveData.points += earnedPoints;

    let isNewHigh = false;
    if (this.currentScore > this.saveData.highScore) {
      this.saveData.highScore = this.currentScore;
      isNewHigh = true;
    }
    this.saveGameData();

    // リザルトDOM
    document.getElementById('result-title').textContent = isNewHigh ? '🏆 HIGH SCORE!!' : 'GAME OVER';
    document.getElementById('death-cause').textContent = reason;
    document.getElementById('result-score').textContent = String(this.currentScore).padStart(6, '0');
    document.getElementById('result-max-combo').textContent = `${this.maxCombo}`;
    document.getElementById('result-earned-points').textContent = `+${earnedPoints.toLocaleString()} EP`;

    this.gameScreen.classList.add('hidden');
    this.resultScreen.classList.remove('hidden');

    this.updateTitleScreenStats();
  }

  showTitleScreen() {
    window.soundManager.playClick();
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.gameScreen.classList.add('hidden');
    this.resultScreen.classList.add('hidden');
    this.titleScreen.classList.remove('hidden');
    this.updateTitleScreenStats();
  }

  // 図鑑モーダル
  openZukan(filterCat = 'all', searchQuery = '') {
    window.soundManager.playClick();
    this.currentZukanCat = filterCat;

    const totalItems = this.items.length;
    let unlockedCount = 0;
    this.items.forEach(item => {
      const stat = this.saveData.zukan[item.id];
      if (stat && stat.seen > 0) unlockedCount++;
    });
    const pct = totalItems > 0 ? ((unlockedCount / totalItems) * 100).toFixed(1) : 0;

    const progNum = document.getElementById('zukan-progress-num');
    const progFill = document.getElementById('zukan-progress-fill');
    if (progNum) progNum.textContent = `${unlockedCount} / ${totalItems} (${pct}%)`;
    if (progFill) progFill.style.width = `${pct}%`;

    const searchInput = document.getElementById('zukan-search-input');
    if (searchInput && !searchInput.dataset.bound) {
      searchInput.dataset.bound = 'true';
      searchInput.addEventListener('input', (e) => {
        this.renderZukanList(this.currentZukanCat || 'all', e.target.value.trim());
      });
    }

    const filterChips = document.querySelectorAll('.filter-chip');
    filterChips.forEach(chip => {
      chip.classList.toggle('active', chip.dataset.cat === filterCat);
      chip.onclick = () => {
        this.openZukan(chip.dataset.cat, searchInput ? searchInput.value.trim() : '');
      };
    });

    this.renderZukanList(filterCat, searchQuery);
    this.zukanModal.classList.remove('hidden');
  }

  renderZukanList(filterCat = 'all', searchQuery = '') {
    const container = document.getElementById('zukan-list');
    if (!container) return;
    container.innerHTML = '';

    // 新ドット絵アセットの参照
    const binImages = {
      burnable: 'assets/sprites/png/bin_kanen_red@4x.png',
      unburnable: 'assets/sprites/png/bin_funen_blue@4x.png',
      resource: 'assets/sprites/png/bin_shigen_green@4x.png',
      oversized: 'assets/sprites/png/bin_sodai_crate@4x.png',
      dragon: 'assets/sprites/png/dragon_zasshoku@4x.png'
    };

    let filtered = this.items;
    if (filterCat !== 'all') {
      filtered = filtered.filter(i => i.category === filterCat);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(i => i.name.toLowerCase().includes(q) || (i.notes && i.notes.toLowerCase().includes(q)));
    }

    if (filtered.length === 0) {
      container.innerHTML = '<div style="text-align:center;padding:24px;color:#94a3b8;font-size:13px;">該当するゴミが見つかりませんでした</div>';
      return;
    }

    filtered.forEach(item => {
      const stat = this.saveData.zukan[item.id] || { seen: 0, correct: 0 };
      const isUnlocked = stat.seen > 0;

      const card = document.createElement('div');
      card.className = `zukan-card-row ${isUnlocked ? '' : 'locked'}`;

      let rankBadge = '未遭遇';
      let rankColor = '#64748b';
      if (stat.correct >= 50) {
        rankBadge = '👑 マスター';
        rankColor = '#fbbf24';
      } else if (stat.correct >= 10) {
        rankBadge = '⭐ プロ';
        rankColor = '#38bdf8';
      } else if (stat.correct >= 1) {
        rankBadge = '🌱 習得済';
        rankColor = '#10b981';
      }

      const catBadges = {
        burnable: { label: '可燃', bg: '#dc2626' },
        unburnable: { label: '不燃', bg: '#2563eb' },
        resource: { label: '資源', bg: '#059669' },
        oversized: { label: '粗大', bg: '#d97706' },
        dragon: { label: 'どらごん', bg: '#9333ea' }
      };
      const catInfo = catBadges[item.category] || { label: '？', bg: '#475569' };
      const binImgSrc = binImages[item.category];

      let iconHtml = '❓';
      if (isUnlocked) {
        if (item.name.includes('写真フィルム') || item.name.includes('ネガ')) {
          iconHtml = `<img src="assets/sprites/png/item_film_negative@4x.png" style="width:28px;height:28px;image-rendering:pixelated;">`;
        } else {
          iconHtml = item.icon || '🗑️';
        }
      }

      card.innerHTML = `
        <div class="zukan-item-icon">${iconHtml}</div>
        ${isUnlocked && binImgSrc ? `<img src="${binImgSrc}" alt="${catInfo.label}" class="zukan-bin-tag-img">` : ''}
        <div style="flex:1;">
          <div style="font-size:14px;font-weight:bold;display:flex;align-items:center;gap:6px;">
            ${isUnlocked ? item.name : '？？？？'}
            <span style="background:${catInfo.bg};font-size:10px;padding:2px 6px;border-radius:4px;">${catInfo.label}</span>
            <span style="background:${rankColor};color:#000;font-size:10px;padding:2px 6px;border-radius:4px;">${rankBadge}</span>
          </div>
          <div style="font-size:11px;color:#c9bff0;margin-top:2px;">
            ${isUnlocked ? (item.notes || '渋谷区のルールに従って分別しましょう。') : 'ゲームで分別に遭遇すると解放されます'}
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  // ================= スキルツリー（スキルライン.html完全統合） =================
  openTree() {
    window.soundManager.playClick();
    this.drawSkillTree();
    this.panelSkillTree();
    this.treeModal.classList.remove('hidden');
  }

  isSkillDone(id) {
    return id === 'hub' || this.saveData.skills.includes(id);
  }

  getSkillStatus(n) {
    if (this.saveData.skills.includes(n.id)) return 'u'; // unlocked
    if (n.req.every(r => this.isSkillDone(r))) return 'a'; // available
    return 'l'; // locked
  }

  isSkillFog(n) {
    const s = this.getSkillStatus(n);
    return s === 'l' && !n.req.some(r => this.isSkillDone(r) || (N[r] && this.getSkillStatus(N[r]) === 'a'));
  }

  // EP振り直し確認モーダルを開く
  resetSkills() {
    const RESET_COST = 50;
    if (this.saveData.points < RESET_COST) {
      const btn = document.getElementById('skill-reset-btn');
      if (btn) {
        btn.style.color = '#ff6666';
        setTimeout(() => btn.style.color = '', 600);
      }
      return;
    }
    // 開通済みスキルのコスト合計を計算して表示
    const refund = this.saveData.skills.reduce((sum, id) => {
      const node = N[id];
      return sum + (node ? node.cost : 0);
    }, 0);

    const amountEl = document.getElementById('reset-refund-amount');
    if (amountEl) {
      amountEl.textContent = refund.toLocaleString();
    }

    const modal = document.getElementById('tree-reset-modal');
    if (modal) {
      modal.classList.remove('hidden');
    }
    if (window.soundManager) window.soundManager.playClick();
  }

  // 振り直し確認モーダルを閉じる
  closeResetModal() {
    const modal = document.getElementById('tree-reset-modal');
    if (modal) {
      modal.classList.add('hidden');
    }
    if (window.soundManager) window.soundManager.playClick();
  }

  // 振り直しの本実行（「はい」ボタン押下時）
  executeResetSkills() {
    const RESET_COST = 50;
    if (this.saveData.points < RESET_COST) {
      this.closeResetModal();
      return;
    }

    const refund = this.saveData.skills.reduce((sum, id) => {
      const node = N[id];
      return sum + (node ? node.cost : 0);
    }, 0);

    this.saveData.points -= RESET_COST;
    this.saveData.points += refund;
    this.saveData.skills = [];
    this.saveGameData();

    this.closeResetModal();
    this.drawSkillTree();
    this.panelSkillTree();
    this.updateTitleScreenStats();
    if (window.soundManager) window.soundManager.playClick();
  }

  drawSkillTree() {
    const s = document.getElementById('skill-tree-svg');
    if (!s) return;

    const OFF = '#211f44';
    let h = '';

    // 各路線レールとラベル
    L.forEach((l, li) => {
      const y = Y(li);
      const it = R[li].map(i => N[i]);
      const reg = it.filter(n => !n.tr);
      const cnt = reg.filter(n => this.saveData.skills.includes(n.id)).length;

      const seg = (d, on) => h += `<path d="${d}" stroke="${on ? l.c : OFF}" stroke-width="5" fill="none"/>`;
      seg(`M58 ${y} H${it[0].x}`, this.saveData.skills.includes(it[0].id));

      for (let i = 1; i < it.length; i++) {
        const p = it[i - 1], q = it[i], nx = it[i + 1];
        if (q.tr) {
          seg(`M${p.x} ${y} H${q.x - DY} L${q.x} ${q.y}`, this.saveData.skills.includes(q.id) || (nx && this.saveData.skills.includes(nx.id)));
        } else if (p.tr) {
          seg(`M${p.x} ${p.y} L${p.x + DY} ${y} H${q.x}`, this.saveData.skills.includes(q.id));
        } else {
          seg(`M${p.x} ${y} H${q.x}`, this.saveData.skills.includes(q.id));
        }
      }

      h += `<text x="66" y="${y - 14}" font-size="10" fill="${l.c}">${l.n}</text>`;
      h += `<text x="66" y="${y + 22}" font-size="9" fill="#6f6ba3">${cnt}/${reg.length}</text>`;
    });

    // 渋谷ターミナル柱看板（路線レールより前面に描画し、路線の端を綺麗に覆い隠す）
    h += `<rect x="14" y="34" width="44" height="${Y(4) - 34 + 30}" fill="#16142e" stroke="#4a4780" stroke-width="2"/>`;
    '渋谷'.split('').forEach((c, i) => {
      h += `<text x="36" y="${210 + i * 26}" fill="#ece9ff" font-size="20" text-anchor="middle">${c}</text>`;
    });

    // 各駅ノード
    Object.values(N).forEach(n => {
      const q = this.getSkillStatus(n);
      const f = this.isSkillFog(n);
      const on = q === 'u';
      const av = q === 'a';
      const r = n.tr ? 15 : 13;
      const sx = n.x - r;
      const sy = n.y - r;

      const bd = on ? (n.tr ? '#ece9ff' : n.c) : (av ? '#e8b04a' : '#2f2d52');
      const col = on ? '#12102a' : (av ? '#e8b04a' : '#3b3868');

      let fill = `<rect x="${sx}" y="${sy}" width="${r * 2}" height="${r * 2}" fill="${on && !n.tr ? n.c : '#14122b'}"/>`;
      if (on && n.tr) {
        fill += `<rect x="${sx}" y="${sy}" width="${r * 2}" height="${r}" fill="${n.cs[0]}"/><rect x="${sx}" y="${n.y}" width="${r * 2}" height="${r}" fill="${n.cs[1]}"/>`;
      }

      h += `<g class="n ${av ? 'avail' : ''}" data-id="${n.id}">${fill}<rect class="b" x="${sx}" y="${sy}" width="${r * 2}" height="${r * 2}" fill="none" stroke="${bd}" stroke-width="2"/>${(()=>{const k=f?'q':n.ic;const rows=IC[k]||IC['q'];const ox=rows[0].length;const oy=rows.length;return px(k,col,Math.round(n.x-ox),Math.round(n.y-oy),2);})()} `;

      if (this.selectedSkillId === n.id) {
        h += `<rect x="${sx - 5}" y="${sy - 5}" width="${r * 2 + 10}" height="${r * 2 + 10}" fill="none" stroke="#ece9ff" stroke-opacity=".7" stroke-width="1.5" stroke-dasharray="4 3"/>`;
      }
      if (av) {
        h += `<text x="${n.x}" y="${n.y + r + 11}" font-size="9" fill="#e8b04a" text-anchor="middle">${n.cost}</text>`;
      }
      h += `</g>`;
    });

    s.innerHTML = h;

    // クリックイベント
    s.querySelectorAll('.n').forEach(g => {
      g.onclick = () => {
        if (this.isMapMoved) return;
        this.selectedSkillId = g.dataset.id;
        this.drawSkillTree();
        this.panelSkillTree();
      };
    });

    // ヘッダー情報更新
    document.getElementById('tree-current-ep').textContent = this.saveData.points.toLocaleString();
    document.getElementById('subway-progress-stat').textContent = this.saveData.skills.length;
    document.getElementById('subway-total-stat').textContent = Object.keys(N).length;
  }

  panelSkillTree() {
    const n = N[this.selectedSkillId] || N['1_0'];
    const q = this.getSkillStatus(n);
    const f = this.isSkillFog(n);
    const on = q === 'u';

    const ic = document.getElementById('skill-inspect-ic');
    if (ic) {
      ic.style.background = on ? (n.tr ? `linear-gradient(${n.cs[0]} 50%,${n.cs[1]} 50%)` : n.c) : '#14122b';
      ic.innerHTML = `<svg viewBox="0 0 24 24" width="36" height="36" style="aspect-ratio:1;height:36px">${px(f ? 'q' : n.ic, on ? '#12102a' : '#e8b04a', 0, 0, 3)}</svg>`;
    }

    const nm = document.getElementById('skill-inspect-nm');
    if (nm) {
      nm.innerHTML = f ? '？？？' : `${n.name}<span class="tag">${n.tag}</span>`;
    }

    const ds = document.getElementById('skill-inspect-ds');
    if (ds) {
      ds.textContent = f ? '手前の駅を開通すると見えてくる。' : n.d;
    }

    const pre = document.getElementById('skill-inspect-pre');
    if (pre) {
      if (n.req[0] === 'hub') {
        pre.innerHTML = '';
      } else {
        const itemsHtml = n.req.map(r => {
          const done = this.isSkillDone(r);
          const reqNode = N[r];
          if (!reqNode) return '';
          // バツマークの代わりに、そのスキルがある号線名をその号線の明度を落とした色で表示
          const dimmed = dimColor(reqNode.c, 0.6);
          const mark = done
            ? '<span style="color:#5fcfae;font-weight:bold;margin-right:2px">✓</span>'
            : `<span class="req-line-tag" style="color:${dimmed};border-color:${dimmed};background:rgba(0,0,0,0.25);">${reqNode.tag}</span>`;
          return `<div class="req-item ${done ? 'ok' : 'ng'}">${mark}<span>${reqNode.name}</span></div>`;
        }).join('');
        pre.innerHTML = `<span class="req-title">解放条件</span>${itemsHtml}`;
      }
    }

    const costPreview = document.getElementById('skill-inspect-cost-preview');
    if (costPreview) {
      costPreview.textContent = on ? '' : `${this.saveData.points.toLocaleString()} → ${(this.saveData.points - n.cost).toLocaleString()} EP`;
    }

    const b = document.getElementById('skill-buy-btn');
    if (b) {
      b.disabled = on || q === 'l' || this.saveData.points < n.cost || this.isSkillTrainMoving;
      b.textContent = on ? '開通済み' : (q === 'l' ? '前提未達' : (this.saveData.points < n.cost ? 'EP不足' : `${n.cost} EP で発車`));
    }
  }

  playSubwayJingle() {
    try {
      const a = new (window.AudioContext || window.webkitAudioContext)();
      [659, 784, 988, 1319].forEach((f, i) => {
        const o = a.createOscillator(), g = a.createGain();
        o.type = 'square';
        o.frequency.value = f;
        g.gain.value = 0.04;
        o.connect(g);
        g.connect(a.destination);
        o.start(a.currentTime + i * 0.1);
        o.stop(a.currentTime + i * 0.1 + 0.09);
      });
    } catch (e) {}
  }

  buySkillNode() {
    const n = N[this.selectedSkillId];
    if (this.getSkillStatus(n) !== 'a' || this.saveData.points < n.cost || this.isSkillTrainMoving) return;

    this.isSkillTrainMoving = true;
    this.playSubwayJingle();
    this.saveData.points -= n.cost;
    this.saveGameData();

    // 電車発車アニメーション
    const p = N[n.req[0]], fx = p ? p.x : 58, fy = p ? p.y : n.y, t0 = performance.now();
    const s = document.getElementById('skill-tree-svg');
    const tr = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    tr.setAttribute('width', 16);
    tr.setAttribute('height', 9);
    tr.setAttribute('fill', n.tr ? '#ece9ff' : n.c);
    tr.setAttribute('stroke', '#ece9ff');
    s.appendChild(tr);

    const animateTrain = (t) => {
      const k = Math.min(1, (t - t0) / 450);
      tr.setAttribute('x', fx + (n.x - fx) * k - 8);
      tr.setAttribute('y', fy + (n.y - fy) * k - 4.5);

      if (k < 1) {
        requestAnimationFrame(animateTrain);
      } else {
        tr.remove();
        this.saveData.skills.push(n.id);
        this.saveGameData();
        this.isSkillTrainMoving = false;
        this.drawSkillTree();
        this.panelSkillTree();
        this.updateTitleScreenStats();
      }
    };

    requestAnimationFrame(animateTrain);
    document.getElementById('tree-current-ep').textContent = this.saveData.points.toLocaleString();
  }

  openHelp() {
    window.soundManager.playClick();
    this.helpModal.classList.remove('hidden');
  }

  closeModals() {
    this.zukanModal.classList.add('hidden');
    this.treeModal.classList.add('hidden');
    this.relicDraftModal.classList.add('hidden');
    this.pauseModal.classList.add('hidden');
    this.helpModal.classList.add('hidden');
    const resetModal = document.getElementById('tree-reset-modal');
    if (resetModal) resetModal.classList.add('hidden');
    this.isPaused = false;
  }

  shareToX() {
    const text = `【爆速分別！雑食どらごんと渋谷のゴミ山】
スコア: ${this.currentScore.toLocaleString()}点
最大コンボ: ${this.maxCombo}回
死因: ${document.getElementById('death-cause').textContent}

渋谷区のゴミ分別をマスターしてSDGsに貢献しよう！
#ゴミ分別ゲーム #渋谷SDGs #バカゲー #サービスラーニング`;

    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank');
  }
}

// 起動
window.addEventListener('DOMContentLoaded', () => {
  window.game = new GomiGame();
});
