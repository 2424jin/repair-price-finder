function chips(v) {
  const escapeHtml = App.escapeHtml;
  return `<span class="chip">${escapeHtml(v.cat)}</span><span class="chip">${escapeHtml(v.maker)}</span>`;
}

function priceCard(v) {
  const escapeHtml = App.escapeHtml;
  const priceBlock = v.noPrice ? `
    <div class="no-price-box">
      ${App.iconQuestion("#9ca3af")}
      <div>
        <p class="no-price-title">料金非公開・要問い合わせ</p>
        <p class="no-price-sub">このメーカーは修理料金を公開していないため、個別の見積もりとなります</p>
      </div>
    </div>` : `
    <div class="price-row">
      <span class="price-amount">${escapeHtml(v.priceText)}</span>
      <span class="price-kind">${escapeHtml(v.priceKind)}</span>
    </div>`;

  const confClass = v.isHigh ? "conf-badge--high" : v.isMid ? "conf-badge--mid" : "conf-badge--low";

  return `
  <div class="price-card">
    <span class="price-label">修理費用の目安</span>
    ${priceBlock}
    <div class="conf-badge ${confClass}"><span class="conf-dot"></span><span class="conf-label">${escapeHtml(v.confLabel)}</span></div>
    <div class="price-divider">
      <span class="label">${escapeHtml(v.symHeading)}</span>
      <span class="value">${escapeHtml(v.symLabel)}</span>
    </div>
  </div>`;
}

function notesCard(v) {
  if (!v.hasNotes) return "";
  return `<div class="notes-card"><span class="label">備考</span><p class="body">${App.escapeHtml(v.notes)}</p></div>`;
}

function consumableWarning(v) {
  if (!v.consumable) return "";
  return `<div class="warn-card">${App.iconWarning("#b45309")}<p>この症状は経年劣化・消耗品扱いとなるため、保証期間内でも有償になる場合があります</p></div>`;
}

function lowConfNote(v) {
  if (!v.isLow) return "";
  return `<div class="low-conf-card">${App.iconInfo("#9ca3af")}<p>このメーカーは公式の修理料金表を公開していないため、実際の修理事例や他社の相場をもとにした参考値を表示しています。正確な金額はメーカーの見積もりでご確認ください</p></div>`;
}

function cta(v) {
  const escapeHtml = App.escapeHtml;
  if (v.ctaOfficial) {
    return `
    <a class="cta-primary" href="${escapeHtml(v.ctaUrl)}" target="_blank" rel="noreferrer">
      <span>
        <span class="cta-title">メーカー公式の<br>修理料金ページを見る</span>
        <span class="cta-domain">${escapeHtml(v.ctaDomain)}</span>
      </span>
      ${App.iconExternal("#ffffff")}
    </a>`;
  }
  if (v.ctaRef) {
    return `
    <a class="cta-secondary" href="${escapeHtml(v.ctaUrl)}" target="_blank" rel="noreferrer">
      <span>
        <span class="cta-title">参考にした<br>情報サイトを見る</span>
        <span class="cta-domain">${escapeHtml(v.ctaDomain)}</span>
      </span>
      ${App.iconChevronRight("#6b7280")}
    </a>
    <p class="cta-caption">メーカー公式ではない外部サイトです。金額の根拠としてご参照ください</p>`;
  }
  return `
  <div class="cta-none">
    ${App.iconInfo("#9ca3af")}
    <div>
      <p class="title">参照できるページがありません</p>
      <p class="sub">この症状は公開されている料金ページがないため、リンクをご案内できません</p>
    </div>
  </div>`;
}

function sourcePanel(v) {
  const escapeHtml = App.escapeHtml;
  const items = [];
  if (v.srcNotUrl) items.push(["金額の根拠", v.srcText]);
  items.push(["対象製品", v.detail]);
  items.push(["金額の形式", v.pformat]);
  return `
  <div class="source-panel">
    <span class="title">この金額の出どころ</span>
    ${items.map(([label, value]) => `
      <div class="source-item"><span class="label">${escapeHtml(label)}</span><span class="value">${escapeHtml(value)}</span></div>
    `).join("")}
  </div>`;
}

App.renderResultScreen = function renderResultScreen(v) {
  return `
  <main class="screen-result">
    <div class="back-row">
      <button type="button" class="btn-back" data-action="back-to-3">${App.iconChevronLeft()}${v.backLabel}</button>
      ${chips(v)}
    </div>
    <div class="result-grid">
      <div class="result-left">
        ${priceCard(v)}
        ${notesCard(v)}
        ${consumableWarning(v)}
        ${lowConfNote(v)}
        ${App.renderNoticeCard()}
      </div>
      <div class="result-right">
        ${cta(v)}
        ${sourcePanel(v)}
      </div>
    </div>
  </main>`;
};
