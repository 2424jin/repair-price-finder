App.renderHeader = function renderHeader() {
  const iconWrench = App.iconWrench;
  return `
  <header class="header">
    <div class="header-left">
      <div class="header-icon">${iconWrench("#ffffff")}</div>
      <div class="header-text">
        <span class="header-title">修理費用かんたん見積もり</span>
      </div>
    </div>
    <div>
      <button type="button" class="btn-reset" data-action="reset">最初から</button>
    </div>
  </header>`;
};
