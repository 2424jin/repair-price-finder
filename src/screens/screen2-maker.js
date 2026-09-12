App.renderMakerScreen = function renderMakerScreen(v) {
  const escapeHtml = App.escapeHtml;
  const typeCard = v.isWasher ? `
    <div class="type-card">
      <div class="type-label-group">
        <span class="type-label">洗濯機のタイプ</span>
        <span class="badge-required">必須</span>
      </div>
      <div class="type-btns">
        ${App.WASHER_TYPES.map((t) => `
          <button type="button" class="type-btn${v.wtype === t ? " selected" : ""}" data-action="pick-type" data-type="${escapeHtml(t)}">${escapeHtml(t)}</button>
        `).join("")}
      </div>
      ${v.typeWarn ? `<div class="type-warn">先に洗濯機のタイプを選んでください</div>` : ""}
    </div>` : "";

  const cards = v.makers.map((m) => {
    // ラベルの有無でカードの高さが変わらないよう、無い場合も同じ場所に不可視のプレースホルダーを置く
    let label = `<span class="maker-label maker-label--placeholder">&nbsp;</span>`;
    if (m.katashiki) label = `<span class="maker-label maker-label--katashiki">型番から検索</span>`;
    else if (m.low) label = `<span class="maker-label maker-label--low">参考値のみ</span>`;
    else if (m.nodata) label = `<span class="maker-label maker-label--nodata">データなし</span>`;
    return `
    <button type="button" class="card-btn maker-card" data-action="pick-maker" data-maker="${escapeHtml(m.name)}">
      ${m.sel ? `<span class="badge-selected-sm">選択中</span>` : ""}
      <span class="maker-row">
        <span class="maker-avatar" style="background:${m.color}">${escapeHtml(m.initial)}</span>
        <span class="maker-name">${escapeHtml(m.name)}</span>
      </span>
      ${label}
    </button>`;
  }).join("");

  return `
  <main class="screen-maker">
    <div class="back-row">
      <button type="button" class="btn-back" data-action="back-to-1">${App.iconChevronLeft()}カテゴリーを選び直す</button>
      <span class="chip">${escapeHtml(v.cat)}</span>
    </div>
    <div class="head-block">
      <h1 class="title title--md">メーカーを選んでください</h1>
      <p class="subtitle subtitle--sm">製品本体のラベル、または保証書に記載されているメーカーを選択します</p>
    </div>
    ${typeCard}
    <div class="maker-grid">${cards}</div>
  </main>`;
};
