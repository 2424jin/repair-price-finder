#!/usr/bin/env python3
"""
テスコム公式サイトの修理料金ページから、ヘアドライヤーの型番別定額データを取得し直して
src/data/tescom-models.js を再生成する。

使い方:
    価格改定などで最新化したいとき:
        python scripts/update_tescom_models.py

出典: https://www.tescom-japan.co.jp/support/repair/
このページの「ヘアドライヤー」セクション（現行ラインナップの一覧。型番・カラー・修理料金の3列）を
そのまま読み取る。ページ内には別に「販売店へお問合せください」扱いの旧型番セクションもあるが、
固定料金が無くこのアプリのデータ構造（型番ごとに単一の定額）に合わないため対象外にしている。

標準ライブラリのみで完結させるため requests 等は使わず urllib を使用。
"""

import re
import sys
import urllib.request
from pathlib import Path

# Windows のコンソール（cp932）は ¥ 等の一部記号を出力できずクラッシュすることがあるため、
# 標準出力を明示的に UTF-8 化しておく。
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

URL = "https://www.tescom-japan.co.jp/support/repair/"
ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / "src" / "data" / "tescom-models.js"

CAT_PATTERN = re.compile(r'<tr class="cat">\s*<th colspan="3">([^<]+)</th>\s*</tr>')
ROW_PATTERN = re.compile(
    r"<tr>\s*<td>([^<]*)</td>\s*<td>([^<]*)</td>\s*<td>\s*([^<]*)</td>\s*</tr>", re.S
)

HEADER_TEMPLATE = """// テスコム ヘアドライヤーの型番別定額修理料金（{count}機種）。
// 出典: テスコム公式サイト {url} （scripts/update_tescom_models.py で自動生成）
// 症状によらず型番ごとに固定料金。送料910円は別途加算（掲載元の注記より）。
// 型番表記は公式サイトの記載をそのまま使用（ハイフンありなし・スペースの有無が機種ごとに不統一だが、
// 検索時はハイフン・空白を除去して比較するため一致には影響しない）。
// 定期的に価格改定される可能性があるため、このスクリプトを再実行して最新化すること。

"""


def fetch_html(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=20) as resp:
        return resp.read().decode("utf-8", errors="replace")


def extract_hair_dryer_rows(html):
    matches = list(CAT_PATTERN.finditer(html))
    sections = []
    for i, m in enumerate(matches):
        start = m.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(html)
        sections.append((m.group(1), html[start:end]))

    hair_dryer_chunks = [chunk for name, chunk in sections if name == "ヘアドライヤー"]
    if not hair_dryer_chunks:
        raise SystemExit("「ヘアドライヤー」セクションが見つかりませんでした。ページ構造が変わった可能性があります。")

    # 最初のヘアドライヤーセクション = 現行ラインナップ（固定料金あり）。
    # 2つ目以降は旧型番の「要問合せ」セクションのため対象外。
    rows = ROW_PATTERN.findall(hair_dryer_chunks[0])
    if not rows:
        raise SystemExit("型番の行が抽出できませんでした。ページ構造が変わった可能性があります。")
    return rows


def build_models(rows):
    models = []
    skipped = []
    for model, color, price in rows:
        model = model.strip()
        price_digits = price.strip().replace("￥", "").replace("¥", "").replace(",", "")
        if not price_digits.isdigit():
            skipped.append((model, price.strip()))
            continue
        price_fmt = "¥" + format(int(price_digits), ",")
        models.append({"id": model, "name": "ヘアドライヤー", "price": price_fmt})
    return models, skipped


def render_js(models):
    lines = [
        '  { id: "%s", name: "%s", price: "%s" }' % (m["id"], m["name"], m["price"])
        for m in models
    ]
    header = HEADER_TEMPLATE.format(count=len(models), url=URL)
    return header + "App.MODELS = [\n" + ",\n".join(lines) + "\n];\n"


def main():
    print(f"取得中: {URL}")
    html = fetch_html(URL)

    rows = extract_hair_dryer_rows(html)
    models, skipped = build_models(rows)

    ids = [m["id"] for m in models]
    if len(ids) != len(set(ids)):
        dupes = sorted({i for i in ids if ids.count(i) > 1})
        print(f"警告: 型番が重複しています: {dupes}", file=sys.stderr)

    js = render_js(models)
    OUTPUT.write_text(js, encoding="utf-8", newline="\n")

    prices = [int(m["price"].replace("¥", "").replace(",", "")) for m in models]
    print(f"生成しました: {OUTPUT}（{len(models)}機種、¥{min(prices):,} 〜 ¥{max(prices):,}）")
    if skipped:
        print(f"注意: 固定料金が無いため除外した型番が{len(skipped)}件あります（「販売店へお問合せください」扱いなど）。")


if __name__ == "__main__":
    main()
