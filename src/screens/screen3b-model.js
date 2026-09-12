const SAMPLES = ["TD330A-P", "TD30 W", "TCD5500 P"];

function chips(v) {
  const escapeHtml = App.escapeHtml;
  return `<span class="chip chip--sand">${escapeHtml(v.cat)}</span><span class="chip chip--sand">${escapeHtml(v.maker)}</span>`;
}

function leftPane(v) {
  const escapeHtml = App.escapeHtml;
  let listArea;
  if (v.noMQ) {
    listArea = `
      <div class="model-hint">入力すると候補が表示されます</div>
      <div class="sample-chips">
        ${SAMPLES.map((s) => `<span class="sample-chip">${s}</span>`).join("")}
        <span class="sample-more">…など229機種</span>
      </div>`;
  } else if (v.mNoHits) {
    listArea = `
      <div class="model-nohit">
        <p class="model-nohit-title">一致する型番が見つかりません</p>
        <p class="model-nohit-body">ハイフンを省いても検索できます。右のヘルプで型番の位置をご確認ください</p>
      </div>`;
  } else {
    listArea = `
      <div class="model-count">候補 ${v.mCount} 件（型番をタップして進みます）</div>
      <div class="model-list">
        ${v.modelHits.map((m) => `
          <button type="button" class="card-btn model-card" data-action="pick-model" data-model="${escapeHtml(m.id)}">
            <span class="model-info">
              <span class="model-id">${escapeHtml(m.id)}</span>
              <span class="model-name">${escapeHtml(m.name)}</span>
            </span>
            <span class="model-right">
              <span class="model-price">${escapeHtml(m.price)}</span>
              ${App.iconChevronRight()}
            </span>
          </button>`).join("")}
      </div>`;
  }

  return `
  <div class="model-left">
    <h1 class="title title--md" style="color:#241f16">型番を入力してください</h1>
    <p class="model-desc">このメーカーは型番ごとに修理料金が決まっています。型番が分かれば、症状によらず金額が確定します</p>
    <input type="text" class="model-input" placeholder="型番を入力してください（例：TD330A-P）" value="${escapeHtml(v.mq)}" data-action="input-mq" autocomplete="off">
    ${listArea}
  </div>`;
}

function asidePane() {
  return `
  <aside class="model-aside">
    <div class="model-aside-title">${App.iconInfo("#8a6a2f")}型番の調べ方</div>
    <ol>
      <li>取扱説明書の表紙に「品番」「形名」「型番」として記載されています</li>
      <li>取扱説明書が無い場合は、本体のTESCOMロゴの近くに記載されています</li>
      <li>ハイフン以降（例：<code>-P</code>）は本体の色を表します。分からない場合は前半だけでも検索できます</li>
    </ol>
    <a class="model-aside-link" href="https://www.tescom-japan.co.jp/support/check/" target="_blank" rel="noreferrer">テスコム公式：型番がわからない場合の調べ方${App.iconChevronRight("#8a6a2f")}</a>
  </aside>`;
}

App.renderModelScreen = function renderModelScreen(v) {
  return `
  <main class="screen-model">
    <div class="back-row">
      <button type="button" class="btn-back btn-back--sand" data-action="back-to-2">${App.iconChevronLeft("#6b6250")}メーカーを選び直す</button>
      ${chips(v)}
      <span class="badge-sand">型番から検索するメーカー</span>
    </div>
    <div class="model-grid">
      ${leftPane(v)}
      ${asidePane()}
    </div>
    ${App.renderNoticeCompact(true)}
  </main>`;
};
