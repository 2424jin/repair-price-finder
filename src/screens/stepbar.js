const STEPS_BASE = ["カテゴリー", "メーカー", "症状", "修理費用の目安"];

function stepItem(num, label, state, isSand) {
  // state: "current" | "done" | "todo"
  const numClass = `step-num step-num--${state}`;
  const labelClass = `step-label step-label--${state}`;
  const inner = state === "done" ? App.iconCheck(isSand ? "#8a6a2f" : "#0e6ba8") : String(num);
  return `<div class="step-item"><span class="${numClass}">${inner}</span><span class="${labelClass}">${label}</span></div>`;
}

App.renderStepBar = function renderStepBar(v) {
  const escapeHtml = App.escapeHtml;
  if (!v.showStepBar) return "";

  let steps;
  if (v.isS1) {
    steps = [
      stepItem(1, STEPS_BASE[0], "current"),
      stepItem(2, STEPS_BASE[1], "todo"),
      stepItem(3, STEPS_BASE[2], "todo"),
      stepItem(4, STEPS_BASE[3], "todo")
    ];
  } else if (v.isS2) {
    steps = [
      stepItem(1, escapeHtml(v.cat), "done"),
      stepItem(2, STEPS_BASE[1], "current"),
      stepItem(3, STEPS_BASE[2], "todo"),
      stepItem(4, STEPS_BASE[3], "todo")
    ];
  } else if (v.isS3 || v.isS3b) {
    const isSand = v.isS3b;
    steps = [
      stepItem(1, escapeHtml(v.cat), "done", isSand),
      stepItem(2, escapeHtml(v.maker), "done", isSand),
      stepItem(3, v.stepLabel3, "current", isSand),
      stepItem(4, STEPS_BASE[3], "todo", isSand)
    ];
    const sep = `<span class="step-sep"></span>`;
    return `<div class="stepbar${isSand ? " stepbar--sand" : ""}">${steps.join(sep)}</div>`;
  } else if (v.isS4) {
    steps = [
      stepItem(1, escapeHtml(v.cat), "done"),
      stepItem(2, escapeHtml(v.maker), "done"),
      stepItem(3, v.stepLabel3, "done"),
      stepItem(4, STEPS_BASE[3], "current")
    ];
  } else {
    return "";
  }
  const sep = `<span class="step-sep"></span>`;
  return `<div class="stepbar">${steps.join(sep)}</div>`;
};
