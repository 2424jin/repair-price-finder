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

// 実機のビューポートに合わせて1194×834のフレームをアスペクト比を保ったまま拡大縮小する
const pageEl = document.querySelector(".page");
function fitFrame() {
  const scale = Math.min(window.innerWidth / 1194, window.innerHeight / 834);
  pageEl.style.setProperty("--fit-scale", scale);
}
window.addEventListener("resize", fitFrame);
window.addEventListener("orientationchange", fitFrame);
fitFrame();

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
