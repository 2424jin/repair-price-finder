#!/usr/bin/env python3
"""
files/repair_costs.json（ノジマ側で管理する実データ）から
src/data/repair-data.js（アプリが読み込む短縮キー形式）を再生成する。

使い方:
    価格・症状データを更新したいとき:
    1. files/repair_costs.json を差し替える（同じスキーマのまま行を追加・修正）
    2. このスクリプトを実行する:
         python scripts/build_repair_data.py
    3. src/data/repair-data.js が上書きされる。index.html をブラウザで開いて確認する。

repair_costs.json の各行のキー -> repair-data.js での短縮キー:
    category      -> c   （カテゴリー）
    maker         -> m   （メーカー）
    product_type  -> t   （洗濯機のタイプ。洗濯機以外は null）
    symptom       -> s   （症状）
    price_min     -> a   （下限、円。非公開は null）
    price_max     -> b   （上限、円。非公開は null）
    price_format  -> f   （金額の形式）
    confidence    -> v   （信頼度）
    notes         -> n   （備考）
    source_url    -> u   （出典URL）
    category_detail -> g （対象製品の補足）

source_type / fetched_method は repair-data.js 側では使わないため出力しない。
"""

import json
import sys
from pathlib import Path

# Windows のコンソール（cp932）は一部の記号を出力できずクラッシュすることがあるため、
# 標準出力を明示的に UTF-8 化しておく。
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT.parent / "files" / "repair_costs.json"
OUTPUT = ROOT / "src" / "data" / "repair-data.js"

FIELD_MAP = [
    ("c", "category"),
    ("m", "maker"),
    ("t", "product_type"),
    ("s", "symptom"),
    ("a", "price_min"),
    ("b", "price_max"),
    ("f", "price_format"),
    ("v", "confidence"),
    ("n", "notes"),
    ("u", "source_url"),
    ("g", "category_detail"),
]


def main():
    if not SOURCE.exists():
        raise SystemExit(f"入力ファイルが見つかりません: {SOURCE}")

    with SOURCE.open(encoding="utf-8") as f:
        rows = json.load(f)

    out_rows = []
    for r in rows:
        out_rows.append({short: r[long] for short, long in FIELD_MAP})

    js_array = json.dumps(out_rows, ensure_ascii=False, separators=(",", ":"))
    content = "App.DATA = " + js_array + ";"

    OUTPUT.write_text(content, encoding="utf-8", newline="\n")
    print(f"生成しました: {OUTPUT}（{len(out_rows)}件）")


if __name__ == "__main__":
    main()
