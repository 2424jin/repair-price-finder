// 画面1：保証期間注記。noticePlacement プロパティで下部に控えめ／上部に強調／非表示を切替
App.renderNoticeTop = function renderNoticeTop(v) {
  if (!v.noticeShown || !v.noticeLoud) return "";
  return `<div class="footnote footnote--loud">${App.iconWarning("#b45309")}<span>${App.NOTICE_TEXT}</span></div>`;
};

App.renderNoticeBottom = function renderNoticeBottom(v) {
  if (!v.noticeShown || !v.noticeQuiet) return "";
  return `<div class="footnote">${App.iconInfo("#9ca3af")}<span>${App.NOTICE_TEXT}</span></div>`;
};

// 画面3-A / 3-B：右寄せ1行の短縮版
App.renderNoticeCompact = function renderNoticeCompact(isSand) {
  return `<div class="footnote--compact${isSand ? " sand" : ""}">${App.NOTICE_TEXT_SHORT}</div>`;
};

// 画面4：カード形式の共通注記（画面1と同一文言、アイコンなし）
App.renderNoticeCard = function renderNoticeCard() {
  return `<div class="notice-card"><span>${App.NOTICE_TEXT}</span></div>`;
};
