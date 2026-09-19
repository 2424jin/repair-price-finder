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
//
// ソフトウェアキーボードが出ると、iOS Safariは visualViewport.height だけが縮み、
// window.innerHeight は変わらない。visualViewport の高さでそのまま拡大縮小すると、
// 画面全体が小さく縮んでしまう。そこで、文字入力中に見えている高さが大きく減ったときは
// 「キーボードが出ている」と見なし、拡大縮小は入力前の大きさ（innerHeight）のまま、
// 入力欄がキーボードの上に見えるようフレームを上へずらす。
// 読み込み直後に innerHeight がずれる問題を避けるため、文字入力欄にフォーカスが
// あるときだけ、キーボード表示と判定する。
const KEYBOARD_MIN_COVER_PX = 100; // これ以上、見える高さが減ったらキーボードと見なす
const KEYBOARD_TOP_GAP_PX = 12;    // キーボード表示中、入力欄を見える範囲の上端から離す量
const pageEl = document.querySelector(".page");
let keyboardOpen = false;
let keyboardTimer = null;

function focusedTextField() {
  const el = document.activeElement;
  return el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA") ? el : null;
}

function fitFrame() {
  const vv = window.visualViewport;
  const width = vv ? vv.width : window.innerWidth;
  const field = focusedTextField();

  // キーボード表示の判定。出たままの間は保ち、見える高さが戻ったら解除する
  const covered = vv ? window.innerHeight - vv.height : 0;
  if (!vv || covered <= KEYBOARD_MIN_COVER_PX || vv.scale > 1.01) keyboardOpen = false;
  else if (field) keyboardOpen = true;

  const height = keyboardOpen ? window.innerHeight : (vv ? vv.height : window.innerHeight);
  const scale = Math.min(width / 1194, height / 834);

  // 見た目のバランスを整えるため約1.5mm分だけ下にずらす（iPad mini基準、163pt/inchで換算）。
  // ただし余白（レターボックス）を超えて下端が見切れないよう、実際に空いている
  // 余白の範囲内に収める。
  const TARGET_SHIFT_PX = 10; // 約1.5mm（iPad mini: 163pt/inch換算）
  const marginY = height - 834 * scale;
  const shiftY = Math.max(0, Math.min(TARGET_SHIFT_PX, marginY / 2));

  pageEl.style.setProperty("--fit-scale", scale);
  pageEl.style.setProperty("--fit-shift-y", `${shiftY}px`);

  if (keyboardOpen && field) {
    // 入力欄を、見えている範囲（キーボードの上）の上端近くへ。ただし、
    // フレームの下端が、見えている範囲の下端より上に上がらないようにする
    const visTop = vv.offsetTop;
    const visBottom = vv.offsetTop + vv.height;
    const fieldTop = field.getBoundingClientRect().top;
    const frameBottom = pageEl.firstElementChild.getBoundingClientRect().bottom;
    const lift = Math.min(0, Math.max(visTop + KEYBOARD_TOP_GAP_PX - fieldTop, visBottom - frameBottom));
    pageEl.style.setProperty("--fit-shift-y", `${shiftY + lift}px`);
  }
}
window.addEventListener("resize", fitFrame);
window.addEventListener("orientationchange", fitFrame);
window.addEventListener("load", fitFrame);
if (window.visualViewport) {
  window.visualViewport.addEventListener("resize", fitFrame);
  window.visualViewport.addEventListener("scroll", fitFrame);
}
// 入力欄が再描画で作り直されても、キーボード表示の状態を保つ。
// 入力欄を離れて、しばらく戻らなければ、キーボード表示の判定を解除する
document.addEventListener("focusin", () => {
  clearTimeout(keyboardTimer);
  fitFrame();
});
document.addEventListener("focusout", () => {
  clearTimeout(keyboardTimer);
  keyboardTimer = setTimeout(() => {
    if (!focusedTextField()) { keyboardOpen = false; fitFrame(); }
  }, 800);
});
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
      fitFrame(); // 入力欄が作り直されても、キーボード表示中の位置を保つ
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
