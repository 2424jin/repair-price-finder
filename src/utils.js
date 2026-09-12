App.yen = (v) => "¥" + Number(v).toLocaleString("ja-JP");

App.escapeHtml = (v) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));

// hex色を白と混ぜて薄いティントを作る（ratio=白の割合、大きいほど薄くなる）
App.paleTint = (hex, ratio = 0.85) => {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const mix = (c) => Math.round(c + (255 - c) * ratio);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
};
