// すべてインラインSVG。stroke-linecap:round / stroke-linejoin:round / fill:none。
// 実装側のアイコンセット（Lucide / Material Symbols 等）の同等アイコンに置き換えて構わない。

const svg = (viewBox, inner, { stroke = "currentColor", width = "1.7", extra = "" } = {}) =>
  `<svg viewBox="${viewBox}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${extra}>${inner}</svg>`;

App.iconWrench = (stroke = "#ffffff") =>
  svg("0 0 24 24", `<path d="M14.5 4.5a4 4 0 015.3 5.3l-9 9-4.6 1.3 1.3-4.6 9-9z"></path><path d="M4 20h6"></path>`, { stroke, width: "1.9" });

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
  "掃除機": (stroke = "#0e6ba8") => svg("0 0 48 48",
    `<path d="M24 8h8"></path>
     <path d="M30 8v6"></path>
     <rect x="26" y="14" width="9" height="13" rx="3"></rect>
     <path d="M30 27v7"></path>
     <rect x="12" y="34" width="26" height="7" rx="2.5"></rect>`, { stroke }),
  "オーブンレンジ": (stroke = "#0e6ba8") => svg("0 0 48 48",
    `<rect x="6" y="10" width="36" height="28" rx="3"></rect>
     <rect x="10" y="14" width="19" height="20" rx="2"></rect>
     <circle cx="35" cy="18" r="2"></circle>
     <path d="M32 26h6"></path>
     <path d="M32 30h6"></path>`, { stroke }),
  "冷蔵庫": (stroke = "#0e6ba8") => svg("0 0 48 48",
    `<rect x="12" y="5" width="24" height="38" rx="3"></rect>
     <path d="M12 20h24"></path>
     <path d="M18 10v6"></path>
     <path d="M18 25v6"></path>`, { stroke }),
  "洗濯機": (stroke = "#0e6ba8") => svg("0 0 48 48",
    `<rect x="7" y="6" width="34" height="36" rx="3"></rect>
     <path d="M7 13h34"></path>
     <circle cx="13" cy="9.5" r="1"></circle>
     <circle cx="17" cy="9.5" r="1"></circle>
     <circle cx="24" cy="26" r="10"></circle>
     <path d="M19 26a5 5 0 005 5"></path>`, { stroke }),
  "ドライヤー": (stroke = "#0e6ba8") => svg("0 0 48 48",
    `<rect x="8" y="13" width="26" height="11" rx="5.5"></rect>
     <path d="M34 15h5v7h-5"></path>
     <path d="M17 24l-2 13h8l-2-13"></path>`, { stroke }),
  "炊飯器": (stroke = "#0e6ba8") => svg("0 0 48 48",
    `<path d="M8 20h32l-2.5 18a3 3 0 01-3 2.5h-21a3 3 0 01-3-2.5L8 20z"></path>
     <rect x="6" y="14" width="36" height="7" rx="2.5"></rect>
     <path d="M24 6v5"></path>
     <circle cx="24" cy="30" r="1.4" fill="${stroke}" stroke="none"></circle>`, { stroke })
};
