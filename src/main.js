// noticePlacement: "下部に控えめ" | "上部に強調" | "非表示"
// showStepBar: 全画面のステップバー表示可否
const config = {
  showStepBar: true,
  noticePlacement: "下部に控えめ"
};

let state = {
  screen: 1,
  cat: null, maker: null, wtype: null, typeWarn: false,
  q: "", symptom: null,
  mq: "", model: null,
  data: App.DATA || []
};

function setState(patch) {
  state = { ...state, ...patch };
  render();
}

// 実機のビューポートに合わせて1194×834のフレームをアスペクト比を保ったまま拡大縮小する。
// iOS Safariは window.innerWidth/innerHeight が読み込み直後は確定しておらず
// （アドレスバーの表示状態やフォント読み込みの前後で変わる）、初回表示だけサイズが
// ずれてダブルタップ操作で直る、という不具合が起きるため、window.visualViewport が
// 使える場合はそちらを優先し、resize イベントも併せて監視する。
const pageEl = document.querySelector(".page");
function fitFrame() {
  const vv = window.visualViewport;
  const width = vv ? vv.width : window.innerWidth;
  const height = vv ? vv.height : window.innerHeight;
  const scale = Math.min(width / 1194, height / 834);

  // 見た目のバランスを整えるため約1.5mm分だけ下にずらす（iPad mini基準、163pt/inchで換算）。
  // ただし余白（レターボックス）を超えて下端が見切れないよう、実際に空いている
  // 余白の範囲内に収める。
  const TARGET_SHIFT_PX = 10; // 約1.5mm（iPad mini: 163pt/inch換算）
  const marginY = height - 834 * scale;
  const shiftY = Math.max(0, Math.min(TARGET_SHIFT_PX, marginY / 2));

  pageEl.style.setProperty("--fit-scale", scale);
  pageEl.style.setProperty("--fit-shift-y", `${shiftY}px`);
}
window.addEventListener("resize", fitFrame);
window.addEventListener("orientationchange", fitFrame);
window.addEventListener("load", fitFrame);
if (window.visualViewport) {
  window.visualViewport.addEventListener("resize", fitFrame);
}
fitFrame();
// フォント読み込みなどでレイアウト確定が遅れるケースの保険として、
// 直後にもう一度計算し直す。
requestAnimationFrame(fitFrame);
setTimeout(fitFrame, 300);

// iOS Safariはダブルタップでのズームを CSS の touch-action だけでは
// 抑制しきれない場合があるため、JS側でも明示的に打ち消す。
// ズームされると、フレームは自前のスケール処理の上にさらに
// ブラウザ側の拡大がかかる形になり、overflow:hidden の外側が
// 見えてしまう（＝下端が見切れる）ため。
let lastTouchEnd = 0;
document.addEventListener("touchend", (e) => {
  const now = Date.now();
  if (now - lastTouchEnd <= 350) {
    e.preventDefault();
  }
  lastTouchEnd = now;
}, { passive: false });

const root = document.getElementById("app");

function renderScreen(v) {
  if (v.isS1) return App.renderCategoryScreen(v);
  if (v.isS2) return App.renderMakerScreen(v);
  if (v.isS3) return App.renderSymptomScreen(v);
  if (v.isS3b) return App.renderModelScreen(v);
  if (v.isS4) return App.renderResultScreen(v);
  return "";
}

function render() {
  const v = App.deriveState(state, config);

  // テキスト入力の再描画でフォーカス/カーソル位置が失われないよう保存しておく
  const active = document.activeElement;
  const activeAction = active && active.dataset ? active.dataset.action : null;
  const selStart = active && "selectionStart" in active ? active.selectionStart : null;
  const selEnd = active && "selectionEnd" in active ? active.selectionEnd : null;

  root.innerHTML = `
    ${App.renderHeader()}
    ${App.renderStepBar(v)}
    ${renderScreen(v)}
  `;

  if (activeAction) {
    const next = root.querySelector(`[data-action="${activeAction}"]`);
    if (next) {
      next.focus();
      if (selStart !== null && typeof next.setSelectionRange === "function") {
        next.setSelectionRange(selStart, selEnd);
      }
    }
  }
}

root.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn || btn.tagName === "INPUT") return;
  const action = btn.dataset.action;

  switch (action) {
    case "reset":
      setState({ screen: 1, maker: null, wtype: null, typeWarn: false, mq: "", model: null });
      break;
    case "pick-cat":
      setState({ cat: btn.dataset.cat, screen: 2, maker: null, wtype: null, typeWarn: false });
      break;
    case "pick-type":
      setState({ wtype: btn.dataset.type, typeWarn: false });
      break;
    case "pick-maker": {
      const name = btn.dataset.maker;
      const v = App.deriveState(state, config);
      if (v.isWasher && !state.wtype) { setState({ typeWarn: true }); break; }
      const row = v.makers.find((m) => m.name === name);
      if (row && row.katashiki) {
        setState({ maker: name, screen: "3b", mq: "", model: null });
      } else {
        setState({ maker: name, screen: 3, q: "", symptom: null });
      }
      break;
    }
    case "pick-symptom":
      setState({ symptom: btn.dataset.sym, model: null, screen: 4 });
      break;
    case "pick-model":
      setState({ model: btn.dataset.model, symptom: null, screen: 4 });
      break;
    case "back-to-1":
      setState({ screen: 1, maker: null, wtype: null, typeWarn: false, mq: "", model: null });
      break;
    case "back-to-2":
      setState({ screen: 2, symptom: null, q: "", mq: "", model: null });
      break;
    case "back-to-3": {
      const v = App.deriveState(state, config);
      setState({ screen: v.modelRow ? "3b" : 3, symptom: null, model: null });
      break;
    }
  }
});

root.addEventListener("input", (e) => {
  const el = e.target.closest("[data-action]");
  if (!el) return;
  if (el.dataset.action === "input-mq") {
    state = { ...state, mq: el.value };
    render();
  }
});

render();
