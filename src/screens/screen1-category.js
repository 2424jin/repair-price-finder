App.renderCategoryScreen = function renderCategoryScreen(v) {
  const escapeHtml = App.escapeHtml;
  const cards = App.CATEGORIES.map(({ key, note }) => {
    const sel = v.cat === key;
    const icon = App.CATEGORY_ICONS[key] ? App.CATEGORY_ICONS[key]() : "";
    return `
    <button type="button" class="card-btn cat-card" data-action="pick-cat" data-cat="${escapeHtml(key)}">
      ${sel ? `<span class="badge-selected">選択中</span>` : ""}
      <span class="cat-icon-wrap">${icon}</span>
      <span class="cat-info">
        <span class="cat-name">${escapeHtml(key)}</span>
        <span class="cat-note">${escapeHtml(note)}</span>
      </span>
    </button>`;
  }).join("");

  return `
  <main class="screen-cat">
    ${App.renderNoticeTop(v)}
    <div class="head-block">
      <h1 class="title">修理したい製品のカテゴリーを選んでください</h1>
      <p class="subtitle">ノジマで購入した製品の修理費用を、かんたんに調べられます</p>
    </div>
    <div class="cat-grid">${cards}</div>
    ${App.renderNoticeBottom(v)}
  </main>`;
};
