function chips(v) {
  const escapeHtml = App.escapeHtml;
  let out = `<span class="chip">${escapeHtml(v.cat)}</span><span class="chip">${escapeHtml(v.maker)}</span>`;
  if (v.hasType) out += `<span class="chip">${escapeHtml(v.wtype)}</span>`;
  return out;
}

function emptyState(v) {
  const escapeHtml = App.escapeHtml;
  const byType = v.emptyByType;
  const title = byType ? `${escapeHtml(v.wtype)}の修理料金データがありません` : "このメーカーの修理料金データがありません";
  const body = byType
    ? `「${escapeHtml(v.maker)}」の${escapeHtml(v.cat)}のうち、${escapeHtml(v.wtype)}については公開されている修理料金の情報が確認できませんでした。他のタイプならご案内できる場合があります`
    : `「${escapeHtml(v.cat)}」の「${escapeHtml(v.maker)}」について、公開されている修理料金の情報が確認できませんでした。この端末では金額の目安をご案内できません`;
  const primaryLabel = byType ? "タイプ・メーカーを選び直す" : "メーカーを選び直す";

  return `
  <div class="empty-wrap">
    <div class="empty-card">
      <span class="empty-icon-wrap">${App.iconEmptyBox()}</span>
      <h2 class="empty-title">${title}</h2>
      <p class="empty-body">${body}</p>
      <div class="empty-btns">
        <button type="button" class="btn-primary" data-action="back-to-2">${primaryLabel}</button>
        <button type="button" class="btn-secondary" data-action="reset">最初から</button>
      </div>
      <div class="empty-divider">お急ぎの場合は、店頭スタッフがメーカーの修理窓口をご案内します</div>
    </div>
  </div>`;
}

App.renderSymptomScreen = function renderSymptomScreen(v) {
  const escapeHtml = App.escapeHtml;
  const body = v.emptySym ? emptyState(v) : `
    <div class="count-row">
      <span>該当 ${v.count} 件</span>
      ${v.manyRows ? `<span>下にスクロールできます</span>` : ""}
    </div>
    <div class="sym-grid">
      ${v.symptoms.map((sym) => `
        <button type="button" class="card-btn sym-card" data-action="pick-symptom" data-sym="${escapeHtml(sym.key)}">
          <span class="sym-card-main">
            <span class="sym-name">${escapeHtml(sym.s)}</span>
            ${sym.sub ? `<span class="sym-sub">対象：${escapeHtml(sym.sub)}</span>` : ""}
            ${sym.warn ? `<span class="sym-warn-label">保証対象外の場合あり</span>` : ""}
          </span>
          ${sym.sel ? `<span class="sym-badge-selected">選択中</span>` : ""}
          <span class="sym-chevron">${App.iconChevronRight()}</span>
        </button>`).join("")}
    </div>`;

  return `
  <main class="screen-symptom">
    <div class="back-row">
      <button type="button" class="btn-back" data-action="back-to-2">${App.iconChevronLeft()}メーカーを選び直す</button>
      ${chips(v)}
    </div>
    <div class="head-block">
      <h1 class="title title--md">どのような症状ですか？</h1>
      <p class="subtitle subtitle--sm">いちばん困っている症状に近いものを選んでください</p>
    </div>
    ${body}
    ${App.renderNoticeCompact(false)}
  </main>`;
};
