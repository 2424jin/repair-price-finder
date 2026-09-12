// すべてインラインSVG。stroke-linecap:round / stroke-linejoin:round / fill:none。
// 実装側のアイコンセット（Lucide / Material Symbols 等）の同等アイコンに置き換えて構わない。

const svg = (viewBox, inner, { stroke = "currentColor", width = "1.7", extra = "" } = {}) =>
  `<svg viewBox="${viewBox}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${extra}>${inner}</svg>`;

App.iconChevronLeft = (stroke = "#6b7280") =>
  svg("0 0 24 24", `<path d="M14.5 5.5L8 12l6.5 6.5"></path>`, { stroke, width: "2.2" });

App.iconChevronRight = (stroke = "#c4c4c8") =>
  svg("0 0 24 24", `<path d="M9.5 5.5L16 12l-6.5 6.5"></path>`, { stroke, width: "2.2" });

App.iconInfo = (stroke = "#9ca3af") =>
  svg("0 0 24 24", `<circle cx="12" cy="12" r="9"></circle><path d="M12 11v5.5"></path><circle cx="12" cy="8" r="0.9" fill="${stroke}" stroke="none"></circle>`, { stroke });

App.iconWarning = (stroke = "#b45309") =>
  svg("0 0 24 24", `<path d="M12 4.5l9 15.5H3l9-15.5z"></path><path d="M12 10.5v4"></path><circle cx="12" cy="17.2" r="0.9" fill="${stroke}" stroke="none"></circle>`, { stroke });

App.iconQuestion = (stroke = "#9ca3af") =>
  svg("0 0 24 24", `<circle cx="12" cy="12" r="9"></circle><path d="M9.6 9.3a2.4 2.4 0 114.15 1.65c-.75.7-1.75 1.15-1.75 2.55"></path><circle cx="12" cy="16.7" r="0.9" fill="${stroke}" stroke="none"></circle>`, { stroke });

App.iconExternal = (stroke = "#ffffff") =>
  svg("0 0 24 24", `<path d="M9 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-3"></path><path d="M14 4h6v6"></path><path d="M20 4L11 13"></path>`, { stroke });

App.iconEmptyBox = (stroke = "#9ca3af") =>
  svg("0 0 24 24", `<path d="M3 8l9-4.5L21 8v9l-9 4.5L3 17V8z"></path><path d="M3 8l9 4.5L21 8"></path><path d="M12 12.5V21"></path>`, { stroke });

App.iconCheck = (stroke = "#0e6ba8") =>
  svg("0 0 24 24", `<path d="M5 12.5l4.5 4.5L19 7"></path>`, { stroke, width: "2.4" });

// カテゴリーアイコン（viewBox 0 0 48 48）
App.CATEGORY_ICONS = {
  "掃除機": () => `<img src="src/assets/icon-vacuum.png" alt="" class="cat-icon-img">`,
  "オーブンレンジ": () => `<img src="src/assets/icon-microwave.png" alt="" class="cat-icon-img">`,
  "冷蔵庫": () => `<img src="src/assets/icon-fridge.png" alt="" class="cat-icon-img">`,
  "洗濯機": () => `<img src="src/assets/icon-washer.png" alt="" class="cat-icon-img">`,
  "ドライヤー": () => `<img src="src/assets/icon-dryer.png" alt="" class="cat-icon-img">`,
  "炊飯器": () => `<img src="src/assets/icon-ricecooker.png" alt="" class="cat-icon-img">`
};
