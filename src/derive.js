// state から各画面の描画に必要な値を導出する（元の HTML プロトタイプの renderVals 相当）
App.deriveState = function deriveState(state, config) {
  const MAKERS = App.MAKERS, MODELS = App.MODELS, WARN_RE = App.WARN_RE, NG_RE = App.NG_RE;
  const MAKER_COLORS = App.MAKER_COLORS, MAKER_COLOR_FALLBACK = App.MAKER_COLOR_FALLBACK;
  const yen = App.yen;
  const cat = state.cat;
  const isWasher = cat === "洗濯機";
  const loaded = state.data.length > 0;

  const makers = (MAKERS[cat] || []).map((raw) => {
    const name = raw.replace(/[*#]$/, "");
    const katashiki = raw.endsWith("#");
    const low = raw.endsWith("*");
    const nodata = loaded && !katashiki && !state.data.some((r) =>
      r.c === cat && r.m === name &&
      (!isWasher || !state.wtype || !r.t || r.t === state.wtype || r.t.includes("不明")));
    const color = MAKER_COLORS[name] || MAKER_COLOR_FALLBACK;
    const initial = Array.from(name)[0] || "";
    return { name, low, katashiki, nodata, sel: state.maker === name, color, initial };
  });

  const rowsForMaker = state.data.filter((r) => r.c === cat && r.m === state.maker &&
    (!isWasher || !state.wtype || !r.t || r.t === state.wtype || r.t.includes("不明")));

  const seen = {};
  const symptomsAll = [];
  for (const r of rowsForMaker) {
    if (seen[r.s]) continue;
    seen[r.s] = true;
    symptomsAll.push({ key: r.s, s: r.s, warn: WARN_RE.test(r.s), sel: state.symptom === r.s });
  }

  const typeIsReason = isWasher && !!state.wtype && rowsForMaker.length === 0 &&
    state.data.some((r) => r.c === cat && r.m === state.maker);

  const mqRaw = (state.mq || "").trim();
  const norm = (v) => v.toUpperCase().replace(/[-\s]/g, "");
  const modelHits = mqRaw ? MODELS.filter((x) => norm(x.id).includes(norm(mqRaw))) : [];

  const modelRow = state.model ? MODELS.find((x) => x.id === state.model) : null;
  const dataRow = state.symptom ? rowsForMaker.find((r) => r.s === state.symptom) : null;
  const flatRow = state.data.find((r) => r.c === cat && r.m === state.maker) || {};

  let result = null;
  if (modelRow) {
    result = {
      priceText: modelRow.price, priceKind: "型番ごとの一律料金", hasPrice: true, noPrice: false,
      level: "high", confLabel: "信頼度：高（メーカー公式の型番別料金表）",
      symHeading: "対象の型番", symLabel: `${modelRow.id}（${modelRow.name}）`,
      notes: flatRow.n, url: flatRow.u, detail: "ヘアドライヤー（型番別定額）",
      pformat: "一律料金（型番ごとに確定）", consumable: false
    };
  } else if (dataRow) {
    const one = dataRow.a !== null && dataRow.a === dataRow.b;
    const none = dataRow.a === null;
    const kind = none ? "" : (/一律|定額/.test(dataRow.f) ? "一律料金" : (one ? "単一の目安" : "概算の幅"));
    const lv = dataRow.v.charAt(0) === "高" ? "high" : (dataRow.v.charAt(0) === "中" ? "mid" : "low");
    const labels = {
      "高（公式）": "信頼度：高（メーカー公式の料金表）",
      "高（実機取得）": "信頼度：高（メーカー公式の診断ツールで取得）",
      "中（体験談複数一致）": "信頼度：中（複数の体験談が一致）",
      "低（推定・類推）": "信頼度：低（推定・類推 / 参考程度）"
    };
    result = {
      priceText: none ? "" : (one ? yen(dataRow.a) : `${yen(dataRow.a)} 〜 ${yen(dataRow.b)}`),
      priceKind: kind, hasPrice: !none, noPrice: none,
      level: lv, confLabel: labels[dataRow.v] || dataRow.v,
      symHeading: "対象の症状", symLabel: dataRow.s,
      notes: dataRow.n, url: dataRow.u, detail: dataRow.g || "—",
      pformat: dataRow.f, consumable: WARN_RE.test(dataRow.s)
    };
  }

  const r = result || {};
  const isUrl = /^https?:\/\//.test(r.url || "");
  const domain = isUrl ? r.url.replace(/^https?:\/\//, "").split("/")[0] : "";
  const official = state.data.find((x) => x.c === cat && x.m === state.maker && x.v.charAt(0) === "高" &&
    /^https?:\/\//.test(x.u || "") && !NG_RE.test(x.u));
  const ctaUrl = official ? official.u : (isUrl ? r.url : null);
  const ctaOfficial = !!official;
  const ctaDomain = ctaUrl ? ctaUrl.replace(/^https?:\/\//, "").split("/")[0] : "";

  const q = (state.q || "").trim();
  const symptoms = q ? symptomsAll.filter((x) => x.s.includes(q)) : symptomsAll;

  return {
    cat, maker: state.maker, wtype: state.wtype, isWasher,
    loaded, makers,
    typeWarn: state.typeWarn,
    hasType: isWasher && !!state.wtype,

    symptoms, count: symptoms.length,
    hasSymptoms: symptoms.length > 0,
    emptySym: loaded && symptoms.length === 0,
    emptyByType: loaded && symptoms.length === 0 && typeIsReason,
    emptyByMaker: loaded && symptoms.length === 0 && !typeIsReason,
    manyRows: symptoms.length > 10,

    mq: state.mq || "",
    hasMQ: mqRaw.length > 0,
    noMQ: mqRaw.length === 0,
    modelHits,
    mCount: modelHits.length,
    mNoHits: mqRaw.length > 0 && modelHits.length === 0,

    modelRow,
    stepLabel3: modelRow ? "型番" : "症状",
    backLabel: modelRow ? "型番を選び直す" : "症状を選び直す",

    // result screen
    priceText: r.priceText, priceKind: r.priceKind,
    hasPrice: !!r.hasPrice, noPrice: !!r.noPrice,
    isHigh: r.level === "high", isMid: r.level === "mid", isLow: r.level === "low",
    confLabel: r.confLabel,
    symHeading: r.symHeading, symLabel: r.symLabel,
    hasNotes: !!r.notes, notes: r.notes || "",
    consumable: !!r.consumable,
    ctaUrl: ctaUrl || "#", ctaOfficial, ctaRef: !!ctaUrl && !ctaOfficial,
    noCta: !ctaUrl, ctaDomain,
    srcIsUrl: isUrl, srcNotUrl: !isUrl,
    domain: domain || "—", srcText: r.url || "—",
    detail: r.detail || "—", pformat: r.pformat || "—",

    showStepBar: config.showStepBar,
    noticeQuiet: config.noticePlacement === "下部に控えめ",
    noticeLoud: config.noticePlacement === "上部に強調",
    noticeShown: config.noticePlacement !== "非表示",

    isS1: state.screen === 1, isS2: state.screen === 2, isS3: state.screen === 3,
    isS3b: state.screen === "3b", isS4: state.screen === 4
  };
};
