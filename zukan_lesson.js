// ゴミ図鑑カード / ゲームオーバーの「学び」表示を共通化するモジュール
// 図鑑カードとゲームオーバー画面は、どちらもここの getLesson() を元に描画する。
// 公式データ（zukan_official.js = 渋谷区の分別表）に書かれていることだけを根拠にして、
// 「出し方のタグ」と「ミス別の一言」を作る。

(function () {
  const BIN_NAMES = {
    burnable: '可燃ごみ',
    unburnable: '不燃ごみ',
    resource: '資源ごみ',
    oversized: '粗大ごみ',
    dragon: '雑食どらごん'
  };

  const BIN_IMG = {
    burnable: 'assets/sprites/png/bin_kanen_red@4x.png',
    unburnable: 'assets/sprites/png/bin_funen_blue@4x.png',
    resource: 'assets/sprites/png/bin_shigen_green@4x.png',
    oversized: 'assets/sprites/png/bin_sodai_crate@4x.png',
    dragon: 'assets/sprites/png/dragon_zasshoku@4x.png'
  };

  const BIN_COLOR = {
    burnable: '#dc2626',
    unburnable: '#2563eb',
    resource: '#059669',
    oversized: '#d97706',
    dragon: '#9333ea'
  };

  // 「正解の分別 × 間違えて入れた先」ごとの汎用ひとこと（キーは 正解_間違い）
  const PAIR_TIPS = {
    burnable_unburnable: 'ゴム・革・靴・貝殻など、燃えにくそうでも渋谷区では可燃ごみ。',
    burnable_resource: '資源になるのは紙・びん・缶・プラ容器など決まった種類だけ。布・革・ゴム・生ごみなどは可燃ごみ。',
    burnable_oversized: '粗大ごみは家具・寝具などの大きなもの。ふつうサイズのこれは可燃ごみ。',
    burnable_dragon: 'どらごんが食べるのは区で収集できないものだけ。ふつうのごみは可燃ごみへ。',

    unburnable_burnable: 'ガラス・金属・刃物・電池などは燃やせないので不燃ごみ。',
    unburnable_resource: '資源になるのは飲食料用のびん・缶や紙・プラ容器など。鍋・傘・割れ物などの金属・ガラス製品は不燃ごみ。',
    unburnable_oversized: '粗大ごみは家具・寝具・大型のもの。ふつうサイズの金属・ガラス製品は不燃ごみ。',
    unburnable_dragon: '家電リサイクル品などとは別。ふつうの金属・ガラスは不燃ごみ。',

    resource_burnable: 'きれいな紙・プラ・缶・びんは資源。可燃ごみに入れると資源が燃やされてしまう。',
    resource_unburnable: '紙・飲食料用のびん・缶・プラスチック製品は、不燃ごみではなく資源。',
    resource_oversized: '粗大ごみになるのは家具などの大きなもの。紙・びん・缶・プラは資源として出す。',
    resource_dragon: 'どらごんは区で収集できないものだけ。資源は資源として出そう。',

    oversized_burnable: '布団・毛布・座布団などは可燃ごみではなく粗大ごみ。',
    oversized_unburnable: '掃除機・空気清浄機・自転車など大きいものは不燃ごみではなく粗大ごみ。',
    oversized_resource: 'スーツケース・衣装ケース・家具など大きいものは資源にならず粗大ごみ。',
    oversized_dragon: 'テレビ・冷蔵庫・エアコン・洗濯機は家電リサイクルでどらごん行き。掃除機・布団・自転車は粗大ごみ。'
  };

  const DRAGON_GENERIC = '区で収集できないもの。テレビ・冷蔵庫・エアコン・洗濯機は家電リサイクル、ガソリン・塗料・バッテリーなどは販売店や専門業者へ。';

  function official(item) {
    const map = window.GOMI_OFFICIAL || {};
    return map[item.name] || null;
  }

  // 出し方のメモ（公式CSV優先、なければ items.js の notes）
  function getNote(item) {
    const o = official(item);
    const n = (o && o.note) || item.notes || '';
    return String(n).trim();
  }

  function getOfficialCategory(item) {
    const o = official(item);
    return o ? o.cat : '';
  }

  // メモの文面から「出し方タグ」を作る（書いてあることだけ）
  function getTags(item) {
    const n = getNote(item);
    const tags = [];
    if (/キケン/.test(n)) tags.push({ icon: '⚠️', text: '新聞紙などに包んで「キケン」と表示' });
    if (/30(cm|センチメートル)角|30cm超/.test(n)) tags.push({ icon: '📏', text: '30cm角以上は粗大ごみ' });
    if (/汚れが落ちなければ可燃|汚れた.*(可燃|不燃|資源になりません)/.test(n)) tags.push({ icon: '🧼', text: '汚れが落ちなければ資源にならない' });
    if (/拠点回収/.test(n) || /回収ボックス|区回収拠点/.test(n)) tags.push({ icon: '📍', text: '拠点・店頭回収あり' });
    if (/束ねる/.test(n)) tags.push({ icon: '📎', text: '雑誌・新聞などと一緒に束ねる' });
    if (/別袋/.test(n)) tags.push({ icon: '🛍️', text: '別袋に分けて出す' });
    if (/清掃事務所|専門業者|販売店|メーカー/.test(n) && !/回収ボックス|区回収拠点/.test(n)) tags.push({ icon: '📞', text: '清掃事務所・販売店などへ相談' });
    return tags;
  }

  // 「ミスったゴミ × ミスった場所」のひとこと
  function getMissTip(item, wrongBin) {
    const correct = item.category;
    const n = getNote(item);

    if (correct === 'dragon') {
      if (/家電リサイクル/.test(n)) return '家電リサイクル対象は区で収集しません。販売店や指定の方法で引き取ってもらうごみ。';
      if (/回収ボックス/.test(n)) return '電池は区で収集しません。販売店の回収ボックスへ。';
      return DRAGON_GENERIC;
    }

    // このゴミ固有の「ひっかけ」
    if (correct === 'resource' && wrongBin === 'burnable' && /汚れが落ちなければ可燃/.test(n)) {
      return '汚れが落ちない場合だけ可燃ごみ。洗って落ちるなら資源として出せる。';
    }
    if (correct === 'burnable' && wrongBin === 'resource' && /資源になりません/.test(n)) {
      return 'これは資源にならない紙・容器。見た目が似ていても可燃ごみ。';
    }
    if (correct === 'unburnable' && /キケン/.test(n)) {
      return '刃物・ガラス・針などは不燃ごみ。新聞紙などに包んで「キケン」と表示して出す。';
    }
    if (correct === 'unburnable' && wrongBin === 'resource' && /資源にならない|資源になりません/.test(n)) {
      return 'びんでも、これは資源にならない種類。不燃ごみとして出す。';
    }
    if (wrongBin === 'oversized' && /30(cm|センチメートル)/.test(n)) {
      return '30cm角以上のときだけ粗大ごみ。それより小さければ ' + BIN_NAMES[correct] + ' へ。';
    }
    if (correct === 'oversized' && /30cm/.test(n)) {
      return '30cm角以上は粗大ごみ。小さく切ったりせず粗大ごみとして出す。';
    }

    return PAIR_TIPS[correct + '_' + wrongBin] || '';
  }

  // カード1枚ぶんの「学び」情報
  function getLesson(item, wrongBin) {
    return {
      name: item.name,
      condition: item.condition || '',
      correct: item.category,
      correctName: BIN_NAMES[item.category] || '?',
      note: getNote(item),
      tags: getTags(item),
      tip: wrongBin ? getMissTip(item, wrongBin) : '',
      wrong: wrongBin || null,
      wrongName: wrongBin ? (BIN_NAMES[wrongBin] || '?') : ''
    };
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function tagsHtml(tags) {
    if (!tags.length) return '';
    return '<div class="lesson-tags">' +
      tags.map(t => `<span class="lesson-tag">${t.icon} ${esc(t.text)}</span>`).join('') +
      '</div>';
  }

  // 「正解 ○ / あなたの回答 ✕ / 理由 / ひとこと」ブロック（ゲームオーバー・図鑑詳細で共用）
  function lessonBlockHtml(item, wrongBin) {
    const l = getLesson(item, wrongBin);
    const correctColor = BIN_COLOR[l.correct] || '#475569';
    const wrongColor = BIN_COLOR[l.wrong] || '#475569';
    return `
      <div class="lesson-answer-row">
        ${l.wrong ? `<span class="lesson-pill lesson-pill-wrong" style="border-color:${wrongColor};">✕ ${esc(l.wrongName)}</span><span class="lesson-arrow">→</span>` : ''}
        <span class="lesson-pill lesson-pill-ok" style="background:${correctColor};">○ 正解：${esc(l.correctName)}</span>
      </div>
      ${l.note ? `<div class="lesson-note">📝 ${esc(l.note)}</div>` : ''}
      ${tagsHtml(l.tags)}
      ${l.tip ? `<div class="lesson-tip">💡 ${esc(l.tip)}</div>` : ''}
    `;
  }

  window.GomiLesson = {
    BIN_NAMES, BIN_IMG, BIN_COLOR,
    esc, getNote, getOfficialCategory, getTags, getMissTip, getLesson,
    tagsHtml, lessonBlockHtml
  };
})();
