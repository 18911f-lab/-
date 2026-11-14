// ========================================================
// 渋谷ゴミ分別ゲーム：アイテム（レリック）定義ファイル
// 新アイテムの追加・効果変更はここを編集してください
// ========================================================

/**
 * 通常ドラフト（15問正解ごと）で抽選されるアイテム一覧
 * - icon: 画像パス または emoji: 絵文字
 * - colorClass: 枠線の色（slot-gold, slot-blue, slot-purple, slot-green, slot-red 等）
 */
const RELIC_DATA = {
  // --- 既存スプライトアイテム ---
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
  },

  // --- 新規追加アイテム（絵文字・特殊効果） ---
  magnet: {
    id: 'magnet',
    name: '分別マグネット',
    emoji: '🧲',
    colorClass: 'slot-red',
    desc: '磁力で資源を吸着！資源ごみの獲得スコア＆EP+50%'
  },
  shield: {
    id: 'shield',
    name: '耐火グローブ',
    emoji: '🧤',
    colorClass: 'slot-blue',
    desc: '耐火・防護仕様！ミスした時のライフ減少を1回だけ無効化（身代わりシールド）'
  },
  coffee: {
    id: 'coffee',
    name: '渋谷カフェの珈琲',
    emoji: '☕',
    colorClass: 'slot-gold',
    desc: '冴えわたる集中力！正解時のタイム回復がすべて+0.6秒'
  },
  whistle: {
    id: 'whistle',
    name: 'どらごんの呼子',
    emoji: '📢',
    colorClass: 'slot-purple',
    desc: 'どらごんの出現率UP＆どらごん分別正解でライフが1回復！'
  },
  battery_box: {
    id: 'battery_box',
    name: '回収ボックス',
    emoji: '📦',
    colorClass: 'slot-green',
    desc: '不燃ごみ・粗大ごみの獲得スコア+40%'
  }
};

/**
 * ステージ（フロア）クリア時に確定で獲得できる固有アイテム
 */
const STAGE_RELIC_DATA = {
  0: { // FLOOR 1 (スクランブル交差点) クリア時
    id: 'hachiko_collar',
    name: '忠犬の首輪',
    emoji: '🐕',
    colorClass: 'slot-gold',
    desc: '【FLOOR 1 固有】ハチ公の守護。残り時間が5秒以下のピンチ時、時間の減少速度が半減！'
  },
  1: { // FLOOR 2 (センター街) クリア時
    id: 'center_sneaker',
    name: 'センター街のスニーカー',
    emoji: '👟',
    colorClass: 'slot-purple',
    desc: '【FLOOR 2 固有】軽快なステップ！10コンボ以上の獲得スコア+50%'
  },
  2: { // FLOOR 3 (道玄坂) クリア時
    id: 'dogenzaka_lantern',
    name: '道玄坂の提灯',
    emoji: '🏮',
    colorClass: 'slot-red',
    desc: '【FLOOR 3 固有】夜道を照らす灯火。獲得EPが常に+35%増加！'
  },
  3: { // FLOOR 4 (宮下パーク) クリア時
    id: 'miyashita_board',
    name: 'ミヤシタのスケボー',
    emoji: '🛹',
    colorClass: 'slot-green',
    desc: '【FLOOR 4 固有】ストリートの覇者。全スコア+30%＆ライフが即座に1回復！'
  }
};

/**
 * チュートリアル特別贈与アイテム
 */
const TUTORIAL_RELIC_DATA = {
  id: 'trainee_badge',
  name: '見習い回収員の証',
  emoji: '🔰',
  colorClass: 'slot-green',
  desc: '【チュートリアル特典】渋谷美化の第一歩！全スコア+15%＆初期持ち時間+5秒'
};

/**
 * すべてのレリック辞書（ID引き用）
 */
const ALL_RELICS_MAP = {
  ...RELIC_DATA,
  [TUTORIAL_RELIC_DATA.id]: TUTORIAL_RELIC_DATA
};
Object.values(STAGE_RELIC_DATA).forEach(item => {
  ALL_RELICS_MAP[item.id] = item;
});

/**
 * レリックのビジュアル要素を生成するヘルパー関数
 */
function renderRelicVisual(relic, className = 'relic-slot-content') {
  if (!relic) return '';
  if (relic.icon) {
    return `<img src="${relic.icon}" alt="${relic.name}" class="${className} relic-slot-img">`;
  }
  return `<span class="${className} relic-slot-emoji" style="font-size:24px;line-height:1;display:flex;align-items:center;justify-content:center;">${relic.emoji || '✨'}</span>`;
}

// グローバル公開
window.RELIC_DATA = RELIC_DATA;
window.STAGE_RELIC_DATA = STAGE_RELIC_DATA;
window.TUTORIAL_RELIC_DATA = TUTORIAL_RELIC_DATA;
window.ALL_RELICS_MAP = ALL_RELICS_MAP;
window.renderRelicVisual = renderRelicVisual;
