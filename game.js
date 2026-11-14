// 横画面アーケード版 GomiSortingGame ロジック
// スキルツリー（渋谷路線図 SKILL LINES） ＆ レリック・アイテムスロット完全対応
// ※ アイテムデータは relics.js に分離されています

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
    this.correctCountSinceRelic = 0; // 15問正解ごとにドラフト

    // チュートリアル状態
    this.isTutorial = false;
    this.tutorialStep = 0;

    // フロア（階層）と各ステージクリア目標数
    this.floors = [
      { name: '渋谷駅前スクランブル', count: 10 },
      { name: '渋谷センター街', count: 25 },
      { name: '道玄坂路地裏', count: 45 },
      { name: '宮下パーク屋上', count: 65 },
      { name: '雑食どらごんの巣', count: 85 } // 85個達成でALL CLEAR！
    ];
    this.currentFloorIndex = 0;
    this.sortedInRun = 0;
    this.runMisses = []; // このランで間違えた {item, wrong}

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
      zukan: {},
      tutorialCompleted: false
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

    // カウントダウン演出
    this.countdownOverlay = document.getElementById('countdown-overlay');
    this.countdownStageBanner = document.getElementById('countdown-stage-banner');
    this.countdownMainNum = document.getElementById('countdown-main-num');

    // チュートリアル
    this.tutorialBtn = document.getElementById('tutorial-btn');
    this.tutorialBanner = document.getElementById('tutorial-banner');
    this.tutorialStepText = document.getElementById('tutorial-step-text');
    this.tutorialSkipBtn = document.getElementById('tutorial-skip-btn');
    this.tutorialGuideModal = document.getElementById('tutorial-guide-modal');
    this.tutorialGuideHeading = document.getElementById('tutorial-guide-heading');
    this.tutorialGuideBody = document.getElementById('tutorial-guide-body');

    // 装備編集モーダル
    this.equipModal = document.getElementById('equip-modal');
    this.equipModalBody = document.getElementById('equip-modal-body');

    // スキルツリーSVG & aside
    this.skillSvg = document.getElementById('skill-tree-svg');
    this.skillMapContainer = document.getElementById('skill-map-container');
    this.skillBuyBtn = document.getElementById('skill-buy-btn');
  }

  bindEvents() {
    // タイトルボタン
    document.getElementById('start-btn').addEventListener('click', () => this.startGame());
    if (this.tutorialBtn) {
      this.tutorialBtn.addEventListener('click', () => this.startTutorial());
    }
    if (this.tutorialSkipBtn) {
      this.tutorialSkipBtn.addEventListener('click', () => this.skipTutorial());
    }
    document.getElementById('zukan-btn').addEventListener('click', () => this.openZukan());
    document.getElementById('shop-btn').addEventListener('click', () => this.openTree());
    document.getElementById('help-btn').addEventListener('click', () => this.openHelp());

    // 装備編集ボタン（タイトル画面）
    const equipBtn = document.getElementById('equip-btn');
    if (equipBtn) equipBtn.addEventListener('click', () => this.openEquipModal());

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
    document.getElementById('result-zukan-btn').addEventListener('click', () => this.openZukan(this.runMisses && this.runMisses.length ? 'run' : 'all'));
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

      // リザルト画面でのキー操作（左右矢印で答え合わせスライド切り替え）
      if (!this.resultScreen.classList.contains('hidden')) {
        if (e.key === 'ArrowLeft') {
          const prevBtn = document.getElementById('lesson-prev-btn');
          if (prevBtn && !prevBtn.disabled) prevBtn.click();
        } else if (e.key === 'ArrowRight') {
          const nextBtn = document.getElementById('lesson-next-btn');
          if (nextBtn && !nextBtn.disabled) nextBtn.click();
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

    // チュートリアル未完了の場合はボタンを控えめに光らせて推奨
    if (this.tutorialBtn) {
      if (!this.saveData.tutorialCompleted) {
        this.tutorialBtn.classList.add('tutorial-btn-glow');
        this.tutorialBtn.textContent = '🔰 チュートリアル (推奨)';
      } else {
        this.tutorialBtn.classList.remove('tutorial-btn-glow');
        this.tutorialBtn.textContent = '🔰 チュートリアル';
      }
    }
  }

  startGame() {
    window.soundManager.playClick();
    this.isTutorial = false;
    this.isGameOver = false;
    this.isPausedForDraft = false;
    this.isPaused = false;
    this.currentScore = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.equippedRelics = []; // 毎回のランで初期化
    this.correctCountSinceRelic = 0; // 15問正解カウントリセット
    this.runMisses = [];

    // スキル用フラグの初期化
    this.hasUsedRevive = false; // 0_7: 始発まで（復活）
    this.hasUsedFloorFullEat = false; // 4_5: 大食い（フロア捕食）
    this.hasUsedManpukuShield = false; // 4_4: 満腹ガード

    // チュートリアルバナーを非表示
    if (this.tutorialBanner) this.tutorialBanner.classList.add('hidden');
    document.querySelectorAll('.station-bin-btn').forEach(b => b.classList.remove('tutorial-highlight'));

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

    // カウントダウン演出（3→2→1→START!）を実行後にゴミ出現＆タイマー開始
    this.startCountdown(() => {
      this.popNextItem();
      this.startTimer();
    });
  }

  // ステージ開始時の特大カウントダウン演出
  startCountdown(onComplete) {
    if (this.countdownTimeout) clearTimeout(this.countdownTimeout);

    if (!this.countdownOverlay) {
      if (onComplete) onComplete();
      return;
    }

    this.isPausedForDraft = true; // カウントダウン中の入力ガード
    const currentFloor = this.floors[this.currentFloorIndex] || { name: 'スクランブル交差点' };
    if (this.countdownStageBanner) {
      this.countdownStageBanner.textContent = `STAGE ${this.currentFloorIndex + 1}: ${currentFloor.name}`;
    }

    this.countdownOverlay.classList.remove('hidden');

    let count = 3;
    const tick = () => {
      if (!this.countdownMainNum) return;
      this.countdownMainNum.classList.remove('start', 'anim-pop');
      void this.countdownMainNum.offsetWidth; // リフロー強制でアニメーション再発火

      if (count > 0) {
        this.countdownMainNum.textContent = count;
        this.countdownMainNum.classList.add('anim-pop');
        try {
          if (window.soundManager && typeof window.soundManager.playCountdown === 'function') {
            window.soundManager.playCountdown(false);
          }
        } catch (e) {
          console.warn('Countdown audio error:', e);
        }
        count--;
        this.countdownTimeout = setTimeout(tick, 750);
      } else {
        this.countdownMainNum.textContent = 'START!';
        this.countdownMainNum.classList.add('start', 'anim-pop');
        try {
          if (window.soundManager && typeof window.soundManager.playCountdown === 'function') {
            window.soundManager.playCountdown(true);
          } else if (window.soundManager && typeof window.soundManager.playFever === 'function') {
            window.soundManager.playFever();
          }
        } catch (e) {
          console.warn('Countdown start audio error:', e);
        }
        this.countdownTimeout = setTimeout(() => {
          this.countdownOverlay.classList.add('hidden');
          this.isPausedForDraft = false;
          if (onComplete) onComplete();
        }, 650);
      }
    };

    tick();
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
      let timeDeduction = this.hasEquippedRelic('clock') ? (stepMs / 1000) * 0.85 : (stepMs / 1000);
      // FLOOR 1 固有: 忠犬の首輪（残り5秒以下で時間減少速度が半減）
      if (this.timeLeft <= 5.0 && this.hasEquippedRelic('hachiko_collar')) {
        timeDeduction *= 0.5;
      }
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
    const relicsMap = window.ALL_RELICS_MAP || window.RELIC_DATA || {};

    let html = '';
    for (let i = 0; i < totalDisplaySlots; i++) {
      const isSlotUnlocked = i < maxSlots;
      const equippedRelicId = this.equippedRelics[i];
      const relic = equippedRelicId ? relicsMap[equippedRelicId] : null;

      if (!isSlotUnlocked) {
        html += `
          <div class="relic-slot locked" title="スキルツリーでスロット拡張可能">
            <span class="relic-lock-icon">🔒</span>
          </div>
        `;
      } else if (relic) {
        const visualHtml = window.renderRelicVisual ? window.renderRelicVisual(relic) : `<span style="font-size:24px;">${relic.emoji || '✨'}</span>`;
        html += `
          <div class="relic-slot ${relic.colorClass || 'slot-gold'}" data-relic="${relic.id}">
            ${visualHtml}
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
      const rData = relicsMap[rId];
      if (rData) {
        el.addEventListener('mouseenter', () => this.showRelicTooltip(rData.name, rData.desc));
        el.addEventListener('mouseleave', () => this.hideRelicTooltip());
      }
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
    if (this.isTutorial) {
      this.floorText.textContent = `TUTORIAL`;
      this.areaName.textContent = '練習エリア（タイマー停止中）';
    } else {
      const floor = this.floors[this.currentFloorIndex];
      this.floorText.textContent = `FLOOR ${this.currentFloorIndex + 1} / 5`;
      this.areaName.textContent = floor.name;
    }

    // フロアドット
    const dots = this.areaDots.querySelectorAll('.area-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx <= this.currentFloorIndex);
    });

    // NEXTキュー表示（2_1: NEXT先読みで1個、2_4: NEXT先読みⅡで2個公開）
    const revealCount = this.hasSkill('2_4') ? 2 : (this.hasSkill('2_1') ? 1 : 0);
    let queueHtml = '';
    this.nextQueue.forEach((item, idx) => {
      const isRevealed = idx < revealCount;
      const displayIcon = isRevealed ? (item.icon || item.emoji || '🗑️') : '？';
      const displayTitle = isRevealed ? `${item.name} (先読み公開中)` : '？？？';
      queueHtml += `<div class="next-box ${isRevealed ? 'revealed' : ''}" title="${displayTitle}">${displayIcon}</div>`;
    });
    this.nextQueueEl.innerHTML = queueHtml;

    this.renderTimerBlocks();
  }

  getRandomItem() {
    const unlocked = this.getUnlockedTiers();
    let pool = this.items.filter(item => unlocked.includes(item.tier));
    if (pool.length === 0) return this.items[0];

    // 3_5: 高得点ゴミ増加（Tier 3やbasePoints >= 180の出現ウェイトUP）
    if (this.hasSkill('3_5')) {
      const highPool = pool.filter(item => item.basePoints >= 180 || item.tier === 3);
      if (highPool.length > 0 && Math.random() < 0.35) {
        return highPool[Math.floor(Math.random() * highPool.length)];
      }
    }

    const idx = Math.floor(Math.random() * pool.length);
    return pool[idx];
  }

  popNextItem() {
    if (this.isTutorial) return;

    this.currentItem = this.nextQueue.shift();
    this.nextQueue.push(this.getRandomItem());

    // 図鑑遭遇カウント & 2_6: 分別辞典（初遭遇で+20 EPボーナス）
    const itemId = this.currentItem.id;
    const isFirstEncounter = !this.saveData.zukan[itemId] || this.saveData.zukan[itemId].seen === 0;
    if (!this.saveData.zukan[itemId]) {
      this.saveData.zukan[itemId] = { seen: 0, correct: 0 };
    }
    this.saveData.zukan[itemId].seen += 1;

    if (isFirstEncounter && this.hasSkill('2_6')) {
      this.saveData.points += 20;
      this.updateTitleScreenStats();
      this.showRelicTooltip('📖 分別辞典ボーナス！', `${this.currentItem.name}を新発見！ +20 EP獲得！`);
      setTimeout(() => this.hideRelicTooltip(), 2000);
    }

    this.renderCurrentItem();
  }

  renderCurrentItem() {
    if (!this.currentItem) return;

    // ドット絵画像がある場合（ネガフィルムなど）はimgタグ表示、それ以外は絵文字
    if (this.currentItem.name && (this.currentItem.name.includes('写真フィルム') || this.currentItem.name.includes('ネガ'))) {
      this.itemIcon.innerHTML = `<img src="assets/sprites/png/item_film_negative@4x.png" alt="${this.currentItem.name}" style="width:48px;height:48px;image-rendering:pixelated;">`;
    } else {
      this.itemIcon.textContent = this.currentItem.emoji || this.currentItem.icon || '🗑️';
    }

    this.itemName.textContent = this.currentItem.name || 'ゴミ';
    this.itemCondition.textContent = this.currentItem.condition || this.getConditionHint(this.currentItem);
    this.itemTierBadge.textContent = `TIER ${this.currentItem.tier || 1} / ${this.currentItem.basePoints || 100}PT`;

    // アニメーションリセット
    const box = document.getElementById('trash-item-box');
    if (box) {
      box.style.animation = 'none';
      box.offsetHeight;
      box.style.animation = 'item-float 1.2s steps(2) infinite';
    }

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

    // チュートリアル中の入力ハンドリング
    if (this.isTutorial) {
      this.handleTutorialSort(selectedCategory);
      return;
    }

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

      let comboMultiplier = 1 + Math.min(this.combo - 1, 20) * 0.1;
      // 3_2: 回収ボーナス（コンボ加点倍率が 0.1 → 0.15 にUP）
      if (this.hasSkill('3_2')) {
        comboMultiplier = 1 + Math.min(this.combo - 1, 20) * 0.15;
      }
      // FLOOR 2 固有: センター街のスニーカー（10コンボ以上の獲得スコア+50%）
      if (this.combo >= 10 && this.hasEquippedRelic('center_sneaker')) {
        comboMultiplier *= 1.5;
      }

      let basePoints = this.currentItem.basePoints;

      // 4_1: 粗大ごみ処理（粗大ごみスコア+50%）
      if (selectedCategory === 'oversized' && this.hasSkill('4_1')) {
        basePoints *= 1.5;
      }

      // レリック: どらごんの好物（どらごん正解時スコア2倍）
      if (selectedCategory === 'dragon' && (this.hasEquippedRelic('dragon_snack') || this.hasSkill('4_2'))) {
        basePoints *= 2;
      }

      // レリック: 分別マグネット（資源ごみスコア+50%）
      if (selectedCategory === 'resource' && this.hasEquippedRelic('magnet')) {
        basePoints *= 1.5;
      }

      // レリック: 回収ボックス（不燃・粗大スコア+40%）
      if ((selectedCategory === 'unburnable' || selectedCategory === 'oversized') && this.hasEquippedRelic('battery_box')) {
        basePoints *= 1.4;
      }

      // FLOOR 4 固有: ミヤシタのスケボー（全スコア+30%）
      if (this.hasEquippedRelic('miyashita_board')) {
        basePoints *= 1.3;
      }

      // チュートリアル特典: 見習いバッジ（全スコア+15%）
      if (this.hasEquippedRelic('trainee_badge')) {
        basePoints *= 1.15;
      }

      // レリック: コイン（スコア+10%）
      const coinBonusMultiplier = this.hasEquippedRelic('coin') ? 1.1 : 1.0;

      // 0_4: 終電ダッシュ（残り10秒未満でスコア1.5倍）
      const lastTrainMultiplier = (this.timeLeft < 10.0 && this.hasSkill('0_4')) ? 1.5 : 1.0;

      const points = Math.round(basePoints * comboMultiplier * feverMultiplier * coinBonusMultiplier * lastTrainMultiplier) + broomBonus;
      this.currentScore += points;

      // 時間回復
      let timeRecovery = 1.2;
      if (this.hasEquippedRelic('clock')) timeRecovery += 0.5;
      if (this.hasEquippedRelic('coffee')) timeRecovery += 0.6; // カフェ珈琲
      if (selectedCategory === 'dragon' && this.hasEquippedRelic('dragon_snack')) timeRecovery += 3.0;
      if (isFever && this.hasSkill('0_2')) timeRecovery += 2.0; // フィーバー強化

      this.timeLeft = Math.min(this.maxTime, this.timeLeft + timeRecovery);

      // レリック: どらごんの呼子（どらごん正解でライフ1回復）
      if (selectedCategory === 'dragon' && this.hasEquippedRelic('whistle')) {
        const maxLives = this.hasSkill('0_5') ? 5 : (this.hasSkill('0_0') ? 4 : 3);
        if (this.lives < maxLives) {
          this.lives += 1;
          this.updateHUD();
        }
      }

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
      if (this.saveData.zukan[this.currentItem.id]) {
        this.saveData.zukan[this.currentItem.id].correct += 1;
      }

      // ポップアップ表示
      this.showPopups(true, `+${points}`);

      // ① 15問正解ごとの通常レリックドラフト判定
      this.correctCountSinceRelic += 1;
      if (this.correctCountSinceRelic >= 15) {
        this.correctCountSinceRelic = 0;
        this.triggerRelicDraft('🎉 15問正解ボーナス！レリックを選択');
        return;
      }

      // ② フロア進行＆ステージクリア固有レリック判定
      const currentFloorReq = this.floors[this.currentFloorIndex].count;
      if (this.sortedInRun >= currentFloorReq) {
        if (this.currentFloorIndex < this.floors.length - 1) {
          const clearedFloorIdx = this.currentFloorIndex;
          this.currentFloorIndex += 1;

          // 0_3: ひと息（フロア開始時時間+3秒）
          if (this.hasSkill('0_3')) {
            this.timeLeft = Math.min(this.maxTime, this.timeLeft + 3.0);
            this.showRelicTooltip('☕ ひと息ボーナス！', 'フロア突破！残り時間+3秒回復！');
            setTimeout(() => this.hideRelicTooltip(), 2500);
          }

          this.triggerStageClearRelic(clearedFloorIdx);
          return;
        } else {
          // 最終ステージ（FLOOR 5）突破！ALL CLEAR！
          this.gameClear();
          return;
        }
      }

      this.popNextItem();
    } else {
      // 不正解（ミス）
      this.combo = 0;
      this.recordMiss(this.currentItem, selectedCategory);

      // レリック: 耐火グローブ（ミスを1回だけ無効化）
      if (this.hasEquippedRelic('shield')) {
        this.equippedRelics = this.equippedRelics.filter(id => id !== 'shield');
        this.renderRelicSlots();
        window.soundManager.playCorrect(1);
        this.showPopups(false, '🛡️ 防護！');
        this.showRelicTooltip('耐火グローブ発動！', '身代わりとなってダメージを防いだ！（消滅）');
        setTimeout(() => this.hideRelicTooltip(), 2500);
        this.popNextItem();
        return;
      }

      // 4_4: 満腹ガード（フロア毎に1回、誤投入ミスを無効化）
      if (this.hasSkill('4_4') && !this.hasUsedManpukuShield) {
        this.hasUsedManpukuShield = true;
        window.soundManager.playCorrect(1);
        this.showPopups(false, '🛡️ 満腹ガード！');
        this.showRelicTooltip('満腹ガード発動！', 'どらごんが満腹でミスを無効化してくれた！（1ラン1回）');
        setTimeout(() => this.hideRelicTooltip(), 2500);
        this.popNextItem();
        return;
      }

      // 4_0: 餌やり（どらごん投入ミス時、時間ペナルティを軽減・無効化）
      if (selectedCategory === 'dragon' && this.hasSkill('4_0')) {
        // 通常のライフ減少をスキップして注意のみで済ませる
        window.soundManager.playWrong();
        this.showPopups(false, '🍗 餌やりセーフ！');
        this.showRelicTooltip('餌やりスキル発動！', 'どらごんへの誤投入ペナルティが軽減された！');
        setTimeout(() => this.hideRelicTooltip(), 2500);
        this.popNextItem();
        return;
      }

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
        // 0_7: 始発まで（ハート0時に1回だけ復活）
        if (this.hasSkill('0_7') && !this.hasUsedRevive) {
          this.hasUsedRevive = true;
          this.lives = 1;
          this.updateHUD();
          window.soundManager.playFever();
          this.showPopups(false, '🌅 始発で復活！');
          this.showRelicTooltip('始発まで発動！', '始発が動き出し奇跡的に復活した！（残機+1）');
          setTimeout(() => this.hideRelicTooltip(), 3000);
          this.popNextItem();
          return;
        }

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

  // レリック獲得ドラフト（15問正解ごと、または通常ドラフト）
  triggerRelicDraft(customTitle = '🎉 お宝レリックを選択') {
    this.isPausedForDraft = true;
    window.soundManager.playFever();

    const titleEl = document.getElementById('relic-modal-title');
    if (titleEl) titleEl.textContent = customTitle;
    const subEl = document.getElementById('relic-modal-sub');
    if (subEl) subEl.textContent = '渋谷の清掃活動で役立つ特殊パッシブアイテムを獲得できます（スロットに装備）';

    const relicsMap = window.RELIC_DATA || {};
    const allRelicKeys = Object.keys(relicsMap);
    let pool = allRelicKeys.filter(k => !this.equippedRelics.includes(k));
    
    // rare_relics未解放ならドラゴン好物は出にくい
    if (!this.hasSkill('1_5')) {
      pool = pool.filter(k => k !== 'dragon_snack');
    }
    if (pool.length === 0) pool = allRelicKeys;

    // 1_3: 目利き（強力レリックの優先抽選）
    if (this.hasSkill('1_3')) {
      const rareKeys = ['star', 'broom', 'coffee', 'magnet', 'whistle', 'dragon_snack'];
      pool.sort((a, b) => {
        const aRare = rareKeys.includes(a);
        const bRare = rareKeys.includes(b);
        if (aRare && !bRare) return Math.random() < 0.6 ? -1 : 1;
        if (!aRare && bRare) return Math.random() < 0.6 ? 1 : -1;
        return 0.5 - Math.random();
      });
    } else {
      // シャッフル
      pool = pool.sort(() => 0.5 - Math.random());
    }

    // 選択肢数（スキルで3択、初期2択）
    const choiceCount = this.hasSkill('1_1') ? 3 : 2;
    const candidates = pool.slice(0, choiceCount);

    const container = document.getElementById('relic-draft-cards');
    container.innerHTML = '';

    candidates.forEach(key => {
      const relic = relicsMap[key];
      const card = document.createElement('div');
      card.className = 'draft-card';
      const visualHtml = relic.icon ? `<img src="${relic.icon}" alt="${relic.name}" class="draft-card-img">` : `<div class="draft-card-emoji">${relic.emoji || '✨'}</div>`;
      card.innerHTML = `
        ${visualHtml}
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

  // ステージクリア固有アイテムの確定獲得
  triggerStageClearRelic(clearedFloorIdx) {
    this.isPausedForDraft = true;
    window.soundManager.playFever();

    const stageRelics = window.STAGE_RELIC_DATA || {};
    const stageRelic = stageRelics[clearedFloorIdx];

    if (!stageRelic) {
      // 固有レリックがなければ通常のドラフトへ
      this.triggerRelicDraft(`🎉 FLOOR ${clearedFloorIdx + 1} CLEAR! レリックを選択`);
      return;
    }

    const titleEl = document.getElementById('relic-modal-title');
    if (titleEl) titleEl.textContent = `🎉 FLOOR ${clearedFloorIdx + 1} CLEAR! エリア秘宝を獲得！`;
    const subEl = document.getElementById('relic-modal-sub');
    if (subEl) subEl.textContent = `${this.floors[clearedFloorIdx].name} を見事に美化！次のフロアへ進む強力な固有アイテムを獲得！`;

    const container = document.getElementById('relic-draft-cards');
    container.innerHTML = '';

    const card = document.createElement('div');
    card.className = 'draft-card';
    card.style.borderColor = '#facc15';
    card.style.boxShadow = '0 0 15px rgba(250, 204, 21, 0.4)';
    const visualHtml = stageRelic.icon ? `<img src="${stageRelic.icon}" alt="${stageRelic.name}" class="draft-card-img">` : `<div class="draft-card-emoji">${stageRelic.emoji || '✨'}</div>`;
    card.innerHTML = `
      ${visualHtml}
      <div class="draft-card-title" style="color:#facc15;">${stageRelic.name}</div>
      <div class="draft-card-desc">${stageRelic.desc}</div>
      <button class="draft-card-select-btn" style="background:#f59e0b;">装備して次のフロアへ！</button>
    `;
    card.onclick = () => {
      this.selectDraftRelic(stageRelic.id);
    };
    container.appendChild(card);

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
    const relicsMap = window.ALL_RELICS_MAP || window.RELIC_DATA || {};
    const relic = relicsMap[relicId];
    if (relic) {
      this.showRelicTooltip(`獲得: ${relic.name}`, relic.desc);
      setTimeout(() => this.hideRelicTooltip(), 3000);
    }

    this.isPausedForDraft = false;
    this.updateHUD();
    this.popNextItem();
  }

  // 全5ステージ制覇（ALL CLEAR / ゲームクリア）
  gameClear() {
    this.isGameOver = true;
    if (this.timerInterval) clearInterval(this.timerInterval);
    window.soundManager.playFever();

    // クリアボーナスEP（通常計算 + 500 EPボーナス）
    let epRatio = 0.15;
    if (this.hasSkill('3_0')) epRatio += 0.025;
    if (this.hasSkill('3_3')) epRatio += 0.025;
    if (this.hasEquippedRelic('coin')) epRatio += 0.03;
    if (this.hasEquippedRelic('dogenzaka_lantern')) epRatio += 0.035;

    const baseEarned = Math.floor(this.currentScore * epRatio);
    const clearBonusEp = 500;
    const earnedPoints = baseEarned + clearBonusEp;
    this.saveData.points += earnedPoints;

    // ハイスコア更新
    let isNewHigh = false;
    if (this.currentScore > this.saveData.highScore) {
      this.saveData.highScore = this.currentScore;
      isNewHigh = true;
    }
    this.saveGameData();

    // リザルト画面をクリア仕様で表示
    const titleEl = document.getElementById('result-title');
    if (titleEl) {
      titleEl.textContent = '🏆 ALL CLEAR! 渋谷防衛達成！';
      titleEl.style.color = '#5eead4';
    }
    const causeEl = document.getElementById('death-cause');
    if (causeEl) {
      causeEl.innerHTML = `🎉 <strong>全5ステージのゴミ山を爆速完全分別！</strong><br>雑食どらごんもお腹いっぱいで大満足！渋谷の街に平和と美しさが戻った！（クリアボーナス: +${clearBonusEp} EP）`;
      causeEl.style.borderColor = '#5eead4';
      causeEl.style.color = '#f0fdf4';
    }

    document.getElementById('result-score').textContent = String(this.currentScore).padStart(6, '0');
    document.getElementById('result-max-combo').textContent = String(this.maxCombo);
    document.getElementById('result-earned-points').textContent = `+${earnedPoints} EP (ボーナス含)`;
    this.renderResultLesson(true);

    this.gameScreen.classList.add('hidden');
    this.resultScreen.classList.remove('hidden');
    this.updateTitleScreenStats();
  }

  // ================= チュートリアルモード =================
  startTutorial() {
    if (document.activeElement && document.activeElement.blur) {
      document.activeElement.blur();
    }
    window.soundManager.playClick();
    this.isTutorial = true;
    this.tutorialStep = 1;
    this.isGameOver = false;
    this.isPausedForDraft = false;
    this.isPaused = false;
    this.currentScore = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.lives = 3;
    this.equippedRelics = [];
    this.currentFloorIndex = 0;
    this.sortedInRun = 0;

    // チュートリアル用固定キュー
    this.nextQueue = [
      { name: 'ペットボトル', icon: '🍾' },
      { name: '壊れた液晶テレビ', icon: '📺' },
      { name: '見習い証', icon: '🔰' }
    ];

    // タイマー停止
    if (this.timerInterval) clearInterval(this.timerInterval);

    // 画面切り替え
    this.titleScreen.classList.add('hidden');
    this.resultScreen.classList.add('hidden');
    this.gameScreen.classList.remove('hidden');
    this.closeModals();

    // チュートリアルバナー表示
    if (this.tutorialBanner) this.tutorialBanner.classList.remove('hidden');

    this.renderRelicSlots();
    // まずイントロ解説モーダルを表示し、閉じてから STEP 1 へ進む
    this.openTutorialIntroGuide();
  }

  // チュートリアル解説モーダル：画面0（ゲームの目的と時間制限）
  openTutorialIntroGuide() {
    // ページ1：ゲームの目的
    this.isPausedForDraft = true;

    if (!this.tutorialGuideModal) {
      // モーダルが存在しない場合は直接 STEP 1 へ
      this.isPausedForDraft = false;
      this.setupTutorialStep();
      return;
    }

    // バナーは一時的に隠してモーダルだけ表示
    if (this.tutorialBanner) this.tutorialBanner.classList.add('hidden');

    this._showTutorialIntroPage1();
    this.tutorialGuideModal.classList.remove('hidden');
  }

  _showTutorialIntroPage1() {
    // ページ1 / 2：このゲームの目的
    this.tutorialGuideHeading.textContent = '🌏 このゲームの目的　（1 / 2）';
    this.tutorialGuideBody.innerHTML = `
      <div class="tutorial-modal-section" style="background:rgba(250,204,21,0.08);padding:12px;border-radius:6px;border:1px solid rgba(250,204,21,0.3);">
        <div class="tutorial-modal-title" style="color:#facc15;"><span>🗑️</span> 渋谷区のゴミ分別ルールを学ぼう！</div>
        <div class="tutorial-modal-desc" style="color:#fef9c3;">
          日本では自治体ごとにゴミ分別のルールが異なります。<br>
          このゲームは<strong>渋谷区の実際の分別基準</strong>をもとに作られています。<br>
          ゲームを楽しみながら、<strong>正しい分け方・捨て方</strong>を身につけよう！
        </div>
      </div>

      <div class="tutorial-modal-section">
        <div class="tutorial-modal-title"><span>📖</span> ゴミ図鑑で復習できる！</div>
        <div class="tutorial-modal-desc">
          分別に成功・失敗したゴミはすべて<strong>「ゴミ図鑑」</strong>に記録されます。<br>
          タイトル画面の<strong>【📖 ゴミ図鑑】</strong>で、各ゴミの正しい分け方・注意事項を<strong>渋谷区のルールに基づいて</strong>いつでも確認できます。<br>
          <span style="color:#86efac;">ゲームで間違えたゴミを図鑑で復習して、現実でも正しく分別しよう！</span>
        </div>
      </div>

      <div class="tutorial-modal-btn-row">
        <button id="tutorial-intro-p1-btn" class="pixel-btn pixel-btn-green" style="padding:10px 20px;font-weight:bold;">
          次へ：遊び方を見る ▶
        </button>
      </div>
    `;

    document.getElementById('tutorial-intro-p1-btn').onclick = () => {
      window.soundManager.playClick();
      this._showTutorialIntroPage2();
    };
  }

  _showTutorialIntroPage2() {
    // ページ2 / 2：操作方法・ゲームルール
    this.tutorialGuideHeading.textContent = '🎮 遊び方　（2 / 2）';
    this.tutorialGuideBody.innerHTML = `
      <div class="tutorial-modal-section">
        <div class="tutorial-modal-title"><span>👆</span> 基本操作</div>
        <div class="tutorial-modal-desc">
          画面中央にゴミが出てくるので、<strong>正しい分別ボタンを押して</strong>投げ込もう！<br><br>
          <span style="font-size:1.2em;">🔥 可燃　♻️ 資源　🧊 不燃　🛢️ 粗大　🐉 どらごん</span>
        </div>
      </div>

      <div class="tutorial-modal-section">
        <div class="tutorial-modal-title"><span>⏱️</span> 時間制限</div>
        <div class="tutorial-modal-desc">
          画面上部の<strong>ブロックゲージ</strong>が残り時間です。ゼロになると<strong>ゲームオーバー！</strong><br>
          ✅ 正解 → 時間が少し回復<br>
          ❌ ミス → 残機（ライフ）が1減る<br>
          <span style="color:#fb923c;font-weight:bold;">残機が0になってもゲームオーバー。</span>
        </div>
      </div>

      <div class="tutorial-modal-section" style="background:rgba(56,189,248,0.08);padding:10px;border-radius:6px;border:1px solid rgba(56,189,248,0.25);">
        <div class="tutorial-modal-title" style="color:#facc15;"><span>🏆</span> 目標</div>
        <div class="tutorial-modal-desc" style="color:#e0f2fe;">
          全<strong>5ステージ</strong>を制覇して<strong>ALL CLEAR</strong>を目指そう！<br>
          道中でゲットできる<strong>レリック（お宝アイテム）</strong>を使いこなせ！
        </div>
      </div>

      <div class="tutorial-modal-btn-row">
        <button id="tutorial-intro-p2-btn" class="pixel-btn pixel-btn-green" style="padding:10px 20px;font-weight:bold;">
          実際に分別してみよう！ ▶
        </button>
      </div>
    `;

    document.getElementById('tutorial-intro-p2-btn').onclick = () => {
      window.soundManager.playClick();
      this.tutorialGuideModal.classList.add('hidden');
      this.isPausedForDraft = false;
      if (this.tutorialBanner) this.tutorialBanner.classList.remove('hidden');
      this.setupTutorialStep();
    };
  }

  setupTutorialStep() {
    // 全ボタンの点滅ハイライトを解除
    document.querySelectorAll('.station-bin-btn').forEach(b => b.classList.remove('tutorial-highlight'));

    if (this.tutorialStep === 1) {
      // STEP 1: 可燃ごみ
      this.currentItem = {
        id: 't_banana',
        name: 'バナナの皮',
        emoji: '🍌',
        category: 'burnable',
        basePoints: 100,
        condition: '生ごみ',
        tier: 1,
        note: '水気をよく切って可燃ごみへ'
      };
      this.nextQueue = [
        { name: 'ペットボトル', icon: '🍾' },
        { name: '壊れた液晶テレビ', icon: '📺' }
      ];
      this.renderCurrentItem();
      if (this.tutorialStepText) {
        this.tutorialStepText.textContent = '① 生ごみや紙くずは「可燃ごみ」！ [Q] キーまたは赤いゴミ箱を押してみよう！';
      }
      const burnBtn = document.querySelector('[data-category="burnable"]');
      if (burnBtn) burnBtn.classList.add('tutorial-highlight');
    } else if (this.tutorialStep === 2) {
      // STEP 2: 資源ごみ
      this.currentItem = {
        id: 't_pet',
        name: 'ペットボトル',
        emoji: '🍾',
        category: 'resource',
        basePoints: 100,
        condition: '水洗い済み',
        tier: 1,
        note: 'キャップとラベルを外して資源ごみへ'
      };
      this.nextQueue = [
        { name: '壊れた液晶テレビ', icon: '📺' },
        { name: '見習い証', icon: '🔰' }
      ];
      this.renderCurrentItem();
      if (this.tutorialStepText) {
        this.tutorialStepText.textContent = '② 缶・ビン・ペットボトルは「資源ごみ」！ [E] キーまたは緑のゴミ箱を押そう！';
      }
      const resBtn = document.querySelector('[data-category="resource"]');
      if (resBtn) resBtn.classList.add('tutorial-highlight');
    } else if (this.tutorialStep === 3) {
      // STEP 3: 雑食どらごん
      this.currentItem = {
        id: 't_tv',
        name: '壊れた液晶テレビ',
        emoji: '📺',
        category: 'dragon',
        basePoints: 300,
        condition: '家電リサイクル対象',
        tier: 3,
        note: '区では収集できません。雑食どらごんに食べさせましょう！'
      };
      this.nextQueue = [
        { name: '見習い証', icon: '🔰' },
        { name: '修了ボーナス', icon: '🎁' }
      ];
      this.renderCurrentItem();
      if (this.tutorialStepText) {
        this.tutorialStepText.textContent = '③ 家電リサイクル品や危険物など「区で収集できないゴミ」は、雑食どらごん [Space] へ！';
      }
      const dragonBtn = document.querySelector('[data-category="dragon"]');
      if (dragonBtn) dragonBtn.classList.add('tutorial-highlight');
    } else if (this.tutorialStep === 4) {
      // STEP 4: 特別レリック贈与
      if (this.tutorialStepText) {
        this.tutorialStepText.textContent = '④ 特別ボーナス！チュートリアル記念レリックを贈与します！';
      }
      this.giveTutorialRelic();
    }
  }

  handleTutorialSort(selectedCategory) {
    const isCorrect = (selectedCategory === this.currentItem.category);

    if (isCorrect) {
      if (selectedCategory === 'dragon') {
        window.soundManager.playDragon();
      } else {
        window.soundManager.playCorrect(1);
      }
      this.showPopups(true, 'NICE!');

      if (this.tutorialStep === 3) {
        // STEP 3（どらごん）完了！→ ステージ＆アイテム解説モーダルを開く
        setTimeout(() => {
          this.openTutorialStageGuide();
        }, 800);
      } else {
        this.tutorialStep += 1;
        setTimeout(() => {
          this.setupTutorialStep();
        }, 700);
      }
    } else {
      window.soundManager.playWrong();
      this.showPopups(false, 'MISS!');
      if (this.tutorialStepText) {
        const correctNames = {
          burnable: '「可燃ごみ」[Q]',
          resource: '「資源ごみ」[E]',
          dragon: '「雑食どらごん」[Space]'
        };
        this.tutorialStepText.textContent = `おしい！このゴミは ${correctNames[this.currentItem.category]} だよ！光っているボタンを押してみてね！`;
      }
    }
  }

  // チュートリアル詳細解説モーダル：画面1（ステージとお宝アイテム）
  openTutorialStageGuide() {
    this.isPausedForDraft = true;
    window.soundManager.playFever();

    if (this.tutorialBanner) this.tutorialBanner.classList.add('hidden');
    document.querySelectorAll('.station-bin-btn').forEach(b => b.classList.remove('tutorial-highlight'));

    if (!this.tutorialGuideModal) return;

    this.tutorialGuideHeading.textContent = '🏆 全5ステージ制覇とお宝アイテム（レリック）';
    this.tutorialGuideBody.innerHTML = `
      <div class="tutorial-modal-section">
        <div class="tutorial-modal-title"><span>🏙️</span> 全5ステージ構成</div>
        <div class="tutorial-modal-desc">
          本作は<strong>「スクランブル交差点」</strong>から始まり、<strong>「センター街」「道玄坂」「宮下パーク」</strong>を抜けて、最深部<strong>「雑食どらごんの巣」</strong>を目指す全5フロア！<br>
          各ステージで一定個数のゴミを分別すると次のフロアへ進みます。
        </div>
      </div>

      <div class="tutorial-modal-section">
        <div class="tutorial-modal-title"><span>🎁</span> 15問正解ドラフト ＆ エリア固有の秘宝</div>
        <div class="tutorial-modal-desc">
          ・<strong>15問正解するごと</strong>に、3つのレリックから好きな1つを選んで装備！<br>
          ・<strong>各ステージ突破時</strong>には、「忠犬の首輪」や「センター街のスニーカー」など<strong>エリア限定の固有アイテム</strong>を確定GET！
        </div>
      </div>

      <div class="tutorial-modal-section" style="background: rgba(56, 189, 248, 0.1); padding: 10px; border-radius: 6px; border: 1px solid rgba(56, 189, 248, 0.3);">
        <div class="tutorial-modal-title" style="color:#facc15;"><span>🔰</span> 記念品を特別プレゼント！</div>
        <div class="tutorial-modal-desc" style="color:#e0f2fe;">
          <strong>「見習い回収員の証」</strong>（全スコア+15% ＆ 初期時間+5秒）を特別に贈与します！左上のスロットに装備してみましょう！
        </div>
      </div>

      <div class="tutorial-modal-btn-row">
        <button id="tutorial-step1-next-btn" class="pixel-btn pixel-btn-green" style="padding: 8px 16px;">特別アイテムを装備して次へ (EPとスキルツリー) ▶</button>
      </div>
    `;

    document.getElementById('tutorial-step1-next-btn').onclick = () => {
      window.soundManager.playClick();
      // レリック装備
      const relic = window.TUTORIAL_RELIC_DATA || { id: 'trainee_badge', name: '見習い回収員の証', emoji: '🔰', desc: '全スコア+15%＆初期持ち時間+5秒' };
      if (!this.equippedRelics.includes(relic.id)) {
        this.equippedRelics.push(relic.id);
        this.renderRelicSlots();
        this.showRelicTooltip(`獲得: ${relic.name}`, relic.desc);
      }
      this.openTutorialSkillGuide();
    };

    this.tutorialGuideModal.classList.remove('hidden');
  }

  // チュートリアル詳細解説モーダル：画面2（EPとスキルツリー）
  openTutorialSkillGuide() {
    window.soundManager.playClick();
    if (!this.tutorialGuideModal) return;

    this.tutorialGuideHeading.textContent = '🌳 EP（エコポイント）とスキルツリー';
    this.tutorialGuideBody.innerHTML = `
      <div class="tutorial-modal-section">
        <div class="tutorial-modal-title"><span>🌱</span> 分別でEP（エコポイント）を獲得！</div>
        <div class="tutorial-modal-desc">
          ゴミを正しく分別するとスコアとともに<strong>「EP（エコポイント）」</strong>が貯まります。<br>
          ゲームオーバーになっても、獲得したEPはすべて持ち帰ることができます！
        </div>
      </div>

      <div class="tutorial-modal-section">
        <div class="tutorial-modal-title"><span>🗺️</span> 渋谷路線図で永続パワーアップ！</div>
        <div class="tutorial-modal-desc">
          タイトル画面の<strong>【🌳 スキルツリー】</strong>を開くと、渋谷の地下鉄のような路線図が広がっています。<br>
          貯めたEPを使って駅を開通すると、<strong>「残機ライフ増加」「制限時間延長」「アイテムスロット拡張」「危険ゴミの解放」</strong>など、自分好みに永続強化できます！
        </div>
      </div>

      <div class="tutorial-modal-section">
        <div class="tutorial-modal-title"><span>👑</span> 目指せ全5ステージ制覇（ALL CLEAR）！</div>
        <div class="tutorial-modal-desc">
          スキルツリーで能力を底上げし、道中で集めたお宝レリックを駆使して、渋谷の街をゴミの山から救い出しましょう！
        </div>
      </div>

      <div class="tutorial-modal-btn-row">
        <button id="tutorial-finish-btn" class="pixel-btn pixel-btn-yellow" style="padding: 10px 20px; font-weight:bold;">🎉 100 EP ボーナスを受け取って修了！</button>
      </div>
    `;

    document.getElementById('tutorial-finish-btn').onclick = () => {
      this.tutorialGuideModal.classList.add('hidden');
      this.finishTutorial();
    };
  }

  finishTutorial() {
    this.saveData.tutorialCompleted = true;
    this.saveData.points += 100;
    this.saveGameData();

    alert('🎉 チュートリアル修了！\n初回ボーナスとして 100 EP を獲得しました！\nタイトル画面の【🌳 スキルツリー】で強化して、全5ステージ制覇を目指しましょう！');

    this.isTutorial = false;
    if (this.tutorialBanner) this.tutorialBanner.classList.add('hidden');
    if (this.tutorialGuideModal) this.tutorialGuideModal.classList.add('hidden');
    document.querySelectorAll('.station-bin-btn').forEach(b => b.classList.remove('tutorial-highlight'));
    this.showTitleScreen();
  }

  skipTutorial() {
    this.isTutorial = false;
    if (this.tutorialBanner) this.tutorialBanner.classList.add('hidden');
    if (this.tutorialGuideModal) this.tutorialGuideModal.classList.add('hidden');
    document.querySelectorAll('.station-bin-btn').forEach(b => b.classList.remove('tutorial-highlight'));
    this.showTitleScreen();
  }

  showPopups(isCorrect, text) {
    if (isCorrect) {
      // 正解：左横にスコア（斜め右肩上がり）、右横にコンボ
      this.feedbackPopup.textContent = text;
      this.feedbackPopup.classList.remove('hidden');

      // アニメーションを強制的に再トリガー（連続分別時でも毎回確実に跳ねる）
      this.feedbackPopup.style.animation = 'none';
      void this.feedbackPopup.offsetWidth; // 強制リフロー
      this.feedbackPopup.style.animation = '';

      if (this.feedbackTimer) clearTimeout(this.feedbackTimer);
      this.feedbackTimer = setTimeout(() => this.feedbackPopup.classList.add('hidden'), 550);

      if (this.combo >= 2) {
        this.comboPopup.textContent = `${this.combo} COMBO!`;
        this.comboPopup.classList.remove('hidden');
        this.comboPopup.style.animation = 'none';
        void this.comboPopup.offsetWidth;
        this.comboPopup.style.animation = '';
        if (this.comboTimer) clearTimeout(this.comboTimer);
        this.comboTimer = setTimeout(() => this.comboPopup.classList.add('hidden'), 700);
      }
      if (this.missPopup) this.missPopup.classList.add('hidden');
    } else {
      // ミス：スコア・コンボとは別の位置（中央真上）に赤色で大きくMISS表示
      this.feedbackPopup.classList.add('hidden');
      this.comboPopup.classList.add('hidden');

      if (this.missPopup) {
        this.missPopup.textContent = text || 'MISS!';
        this.missPopup.classList.remove('hidden');
        this.missPopup.style.animation = 'none';
        void this.missPopup.offsetWidth;
        this.missPopup.style.animation = '';
        if (this.missTimer) clearTimeout(this.missTimer);
        this.missTimer = setTimeout(() => this.missPopup.classList.add('hidden'), 600);
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
    // 3_6: 特別回収日（ランダムフロアまたは全フロアでEP倍率UP）
    if (this.hasSkill('3_6')) epRatio += 0.05; // 特別回収日常時ボーナス
    // 3_7: 一周ボーナス（ハイスコアに応じてEP倍率UP）
    if (this.hasSkill('3_7')) epRatio += 0.05;
    if (this.hasEquippedRelic('coin')) epRatio += 0.03; // +30%
    if (this.hasEquippedRelic('dogenzaka_lantern')) epRatio += 0.035; // 道玄坂の提灯 (+35%)

    const earnedPoints = Math.floor(this.currentScore * epRatio);
    this.saveData.points += earnedPoints;

    let isNewHigh = false;
    if (this.currentScore > this.saveData.highScore) {
      this.saveData.highScore = this.currentScore;
      isNewHigh = true;
    }
    this.saveGameData();

    // リザルトDOM（ゲームオーバー用にリセット）
    const titleEl = document.getElementById('result-title');
    titleEl.textContent = isNewHigh ? '🏆 HIGH SCORE!!' : 'GAME OVER';
    titleEl.style.color = isNewHigh ? '#ffd36b' : '#ef4444';

    const causeEl = document.getElementById('death-cause');
    causeEl.textContent = reason;
    causeEl.style.borderColor = '#ef4444';
    causeEl.style.color = '#fecaca';

    document.getElementById('result-score').textContent = String(this.currentScore).padStart(6, '0');
    document.getElementById('result-max-combo').textContent = `${this.maxCombo}`;
    document.getElementById('result-earned-points').textContent = `+${earnedPoints.toLocaleString()} EP`;
    this.renderResultLesson(false);

    this.gameScreen.classList.add('hidden');
    this.resultScreen.classList.remove('hidden');

    this.updateTitleScreenStats();
  }

  showTitleScreen() {
    window.soundManager.playClick();
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.countdownTimeout) clearTimeout(this.countdownTimeout);
    if (this.countdownOverlay) this.countdownOverlay.classList.add('hidden');
    this.isPausedForDraft = false;
    this.gameScreen.classList.add('hidden');
    this.resultScreen.classList.add('hidden');
    this.titleScreen.classList.remove('hidden');
    this.updateTitleScreenStats();
  }

    // ミスの記録（図鑑の「苦手」とゲームオーバーの答え合わせに使う）
  recordMiss(item, wrongBin) {
    if (!item || !item.id) return;
    const z = this.saveData.zukan[item.id] || (this.saveData.zukan[item.id] = { seen: 1, correct: 0 });
    z.miss = (z.miss || 0) + 1;
    z.missBy = z.missBy || {};
    z.missBy[wrongBin] = (z.missBy[wrongBin] || 0) + 1;
    this.runMisses.push({ item, wrong: wrongBin });
    this.saveGameData();
  }

  // ゲームオーバー／クリア画面の「答え合わせ」パネル（スライド式）
  renderResultLesson(isClear) {
    const box = document.getElementById('death-lesson');
    if (!box) return;
    const L = window.GomiLesson;
    const rawMisses = this.runMisses || [];
    if (!L || rawMisses.length === 0) {
      box.classList.add('hidden');
      box.innerHTML = '';
      return;
    }

    // 重複を除いたミスリストを作成（最新順）
    // 最後に間違えたゴミがインデックス0に来るようにする
    const uniqueMisses = [];
    const seen = new Set();
    for (let i = rawMisses.length - 1; i >= 0; i--) {
      const m = rawMisses[i];
      if (!seen.has(m.item.id)) {
        seen.add(m.item.id);
        uniqueMisses.push(m);
      }
    }

    this.currentLessonIndex = 0;
    this.lessonMissesList = uniqueMisses;

    const renderSlide = (index) => {
      this.currentLessonIndex = Math.max(0, Math.min(index, uniqueMisses.length - 1));
      const cur = uniqueMisses[this.currentLessonIndex];
      const icon = (cur.item.icon || cur.item.emoji || '🗑️');
      const total = uniqueMisses.length;

      let html = `
        <div class="lesson-box-header">
          <div class="lesson-box-title">
            ${isClear ? '▶ ミスしたゴミをおさらい' : '▶ ミスしたゴミの答え合わせ'}
          </div>
          <div class="lesson-page-indicator">
            ${this.currentLessonIndex + 1} / ${total}
          </div>
        </div>
        <div class="lesson-card-content">
          <div class="lesson-main-item">
            <span>${L.esc(icon)}</span>
            <span>${L.esc(cur.item.name)}</span>
            ${cur.item.condition ? `<small>${L.esc(cur.item.condition)}</small>` : ''}
          </div>
          ${L.lessonBlockHtml(cur.item, cur.wrong)}
        </div>
      `;

      if (total > 1) {
        html += `
          <div class="lesson-nav-bar">
            <button id="lesson-prev-btn" class="lesson-nav-btn" ${this.currentLessonIndex === 0 ? 'disabled' : ''}>
              ◀ 前のミス
            </button>
            <div class="lesson-nav-dots">
              ${uniqueMisses.map((_, i) => `<span class="lesson-dot ${i === this.currentLessonIndex ? 'active' : ''}"></span>`).join('')}
            </div>
            <button id="lesson-next-btn" class="lesson-nav-btn" ${this.currentLessonIndex === total - 1 ? 'disabled' : ''}>
              次のミス ▶
            </button>
          </div>
        `;
      }

      box.innerHTML = html;

      // ボタンのイベント紐付け
      const prevBtn = document.getElementById('lesson-prev-btn');
      const nextBtn = document.getElementById('lesson-next-btn');
      if (prevBtn) {
        prevBtn.onclick = (e) => {
          e.stopPropagation();
          window.soundManager.playClick();
          renderSlide(this.currentLessonIndex - 1);
        };
      }
      if (nextBtn) {
        nextBtn.onclick = (e) => {
          e.stopPropagation();
          window.soundManager.playClick();
          renderSlide(this.currentLessonIndex + 1);
        };
      }
    };

    renderSlide(0);
    box.classList.remove('hidden');
  }

  // 図鑑モーダル
  // filterCat: all / burnable / unburnable / resource / oversized / dragon / weak(苦手) / unseen(未遭遇) / run(今回のミス)
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
    if (searchInput) searchInput.value = searchQuery;

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
    const L = window.GomiLesson;
    const esc = L ? L.esc : (s => String(s));

    const binImages = L ? L.BIN_IMG : {};
    const zstat = (item) => this.saveData.zukan[item.id] || { seen: 0, correct: 0 };

    let filtered = this.items;
    const isRun = filterCat === 'run';
    if (isRun) {
      const ids = new Set((this.runMisses || []).map(m => m.item.id));
      filtered = filtered.filter(i => ids.has(i.id));
    } else if (filterCat === 'weak') {
      filtered = filtered.filter(i => (zstat(i).miss || 0) > 0)
        .sort((a, b) => (zstat(b).miss || 0) - (zstat(a).miss || 0));
    } else if (filterCat === 'unseen') {
      filtered = filtered.filter(i => !(zstat(i).seen > 0));
    } else if (filterCat !== 'all') {
      filtered = filtered.filter(i => i.category === filterCat);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(i =>
        i.name.toLowerCase().includes(q) ||
        ((L ? L.getNote(i) : (i.notes || '')).toLowerCase().includes(q)));
    }

    // 今回のミスだけを見ているときの帯
    if (isRun) {
      const banner = document.createElement('div');
      banner.className = 'zukan-run-banner';
      banner.innerHTML = `<span>今回ミスしたゴミ ${filtered.length}件を表示中</span><button type="button">全部見る</button>`;
      banner.querySelector('button').onclick = () => this.openZukan('all', '');
      container.appendChild(banner);
    }

    if (filtered.length === 0) {
      const msg = filterCat === 'weak' ? 'まだミスしたゴミはありません。えらい！'
        : filterCat === 'unseen' ? '全部のゴミに出会えています！'
        : '該当するゴミが見つかりませんでした';
      container.insertAdjacentHTML('beforeend', `<div style="text-align:center;padding:24px;color:#94a3b8;font-size:13px;">${msg}</div>`);
      return;
    }

    const catBadges = {
      burnable: { label: '可燃', bg: '#dc2626' },
      unburnable: { label: '不燃', bg: '#2563eb' },
      resource: { label: '資源', bg: '#059669' },
      oversized: { label: '粗大', bg: '#d97706' },
      dragon: { label: 'どらごん', bg: '#9333ea' }
    };

    filtered.forEach(item => {
      const stat = zstat(item);
      const isUnlocked = stat.seen > 0;
      const miss = stat.miss || 0;

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
      } else if (isUnlocked) {
        rankBadge = '👀 遭遇済';
        rankColor = '#a78bfa';
      }

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

      const note = L ? L.getNote(item) : (item.notes || '');
      const subText = isUnlocked
        ? (note || '渋谷区のルールに従って分別しましょう。')
        : 'ゲームで分別に遭遇すると解放されます';

      const card = document.createElement('div');
      card.className = `zukan-card-row zukan-card-v2 ${isUnlocked ? '' : 'locked'}`;

      let detailHtml = '';
      if (isUnlocked && L) {
        detailHtml = L.lessonBlockHtml(item, null);

        // あなたがミスした先ごとの一言
        const missBy = stat.missBy || {};
        const entries = Object.entries(missBy).sort((a, b) => b[1] - a[1]);
        if (entries.length) {
          detailHtml += '<div class="zukan-miss-block"><div class="zukan-miss-title">あなたのミス</div>' +
            entries.map(([bin, n]) => {
              const tip = L.getMissTip(item, bin);
              return `<div class="lesson-answer-row"><span class="lesson-pill lesson-pill-wrong" style="border-color:${L.BIN_COLOR[bin] || '#475569'};">✕ ${esc(L.BIN_NAMES[bin] || '?')}</span><span class="lesson-arrow">×${n}回</span></div>` +
                (tip ? `<div class="lesson-tip">💡 ${esc(tip)}</div>` : '');
            }).join('') + '</div>';
        }
        detailHtml += `<div class="zukan-stat-line">遭遇 ${stat.seen}回 ／ 正解 ${stat.correct}回 ／ ミス ${miss}回</div>`;
      }

      card.innerHTML = `
        <div class="zukan-card-head">
          <div class="zukan-item-icon">${iconHtml}</div>
          ${isUnlocked && binImgSrc ? `<img src="${binImgSrc}" alt="${esc(catInfo.label)}" class="zukan-bin-tag-img">` : ''}
          <div class="zukan-card-title">
            <div class="zukan-card-name">
              ${isUnlocked ? esc(item.name) : '？？？？'}
              <span class="zukan-badge" style="background:${catInfo.bg};">${catInfo.label}</span>
              <span class="zukan-badge zukan-badge-rank" style="background:${rankColor};">${rankBadge}</span>
              ${miss >= 2 ? '<span class="zukan-badge zukan-badge-weak">⚠️ 苦手</span>' : ''}
            </div>
            <div class="zukan-card-sub">${esc(subText)}</div>
          </div>
          ${isUnlocked ? '<span class="zukan-card-chevron">▶</span>' : ''}
        </div>
        ${isUnlocked ? `<div class="zukan-card-detail">${detailHtml}</div>` : ''}
      `;

      if (isUnlocked) {
        card.addEventListener('click', () => card.classList.toggle('open'));
        if (isRun) card.classList.add('open'); // 今回のミスは最初から開いておく
      }
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
    if (this.tutorialGuideModal) this.tutorialGuideModal.classList.add('hidden');
    if (this.equipModal) this.equipModal.classList.add('hidden');
    const resetModal = document.getElementById('tree-reset-modal');
    if (resetModal) resetModal.classList.add('hidden');
    this.isPaused = false;
  }

  // ===== 装備編集モーダルを開く =====
  openEquipModal() {
    if (!this.equipModal || !this.equipModalBody) return;
    window.soundManager.playClick();

    const relicsMap = window.ALL_RELICS_MAP || window.RELIC_DATA || {};
    const maxSlots = this.getMaxRelicSlots();
    const totalDisplay = 5;
    let html = '';

    for (let i = 0; i < totalDisplay; i++) {
      const isUnlocked = i < maxSlots;
      const relicId = this.equippedRelics[i];
      const relic = relicId ? relicsMap[relicId] : null;

      if (!isUnlocked) {
        // ロック済みスロット
        html += `
          <div class="equip-locked-slot">
            <span style="font-size:20px;">🔒</span>
            <span class="equip-slot-desc">スロット${i + 1}：スキルツリー「スロット拡張」で解放</span>
          </div>
        `;
      } else if (relic) {
        // 装備中スロット
        const visual = window.renderRelicVisual ? window.renderRelicVisual(relic) : `<span style="font-size:24px;">${relic.emoji || '✨'}</span>`;
        html += `
          <div class="equip-slot-row">
            <span class="equip-slot-index">${i + 1}</span>
            <div class="equip-slot-visual">${visual}</div>
            <div class="equip-slot-info">
              <div class="equip-slot-name">${relic.name}</div>
              <div class="equip-slot-desc">${relic.desc || ''}</div>
            </div>
            <button class="equip-remove-btn" data-remove-relic="${relic.id}">外す</button>
          </div>
        `;
      } else {
        // 空きスロット
        html += `
          <div class="equip-slot-row" style="opacity:0.5;">
            <span class="equip-slot-index">${i + 1}</span>
            <div class="equip-slot-visual" style="font-size:20px;color:#4a4272;">○</div>
            <div class="equip-slot-info">
              <div class="equip-slot-empty">空きスロット（ゲーム中のドラフトで装備できます）</div>
            </div>
          </div>
        `;
      }
    }

    html += `<p class="equip-modal-hint">💡 装備を外すとスロットが空き、次のドラフトで新たに装備できます。<br>外した装備は消滅します。</p>`;
    this.equipModalBody.innerHTML = html;

    // 「外す」ボタンのイベント
    this.equipModalBody.querySelectorAll('.equip-remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const rid = btn.dataset.removeRelic;
        this.equippedRelics = this.equippedRelics.filter(id => id !== rid);
        this.renderRelicSlots();
        window.soundManager.playClick();
        this.openEquipModal(); // リフレッシュ
      });
    });

    this.equipModal.classList.remove('hidden');
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
