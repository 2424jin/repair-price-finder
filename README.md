# かんたん修理診断

`家電修理金額確認サイト設計/design_handoff_repair_price_finder/README.md` のハンドオフをもとに実装。
ビルド不要のプレーン HTML / CSS / JavaScript。

## 起動方法

`index.html` をダブルクリックしてブラウザで直接開けば動作します（サーバー不要）。
`src/` 以下は ES モジュールではなく、`index.html` が読み込み順に並べた通常の `<script>` タグとして構成されており、
すべて `window.App` という共有オブジェクトに関数・定数をぶら下げる形で連携しています。

## 構成

- `index.html` — エントリーポイント。`src/*.js` を依存順に `<script>` タグで読み込む
- `src/main.js` — 状態管理・画面遷移・イベント処理
- `src/derive.js` — state から各画面の表示用データを導出するロジック（元プロトタイプの `renderVals` 相当）
- `src/constants.js` — メーカー一覧・型番定額データ・消耗品判定・メーカーイメージカラーなどの定数
- `src/icons.js` — インラインSVGアイコン
- `src/utils.js` — 共通ユーティリティ（金額フォーマット、HTMLエスケープ、色のティント生成）
- `src/styles.css` — デザイントークンと全画面のスタイル
- `src/screens/` — 画面ごとの描画関数（ヘッダー／ステップバー／注記／画面1〜4）
- `src/data/repair-data.js` — 修理料金の実データ（357件、`files/repair_costs.json` から生成）
- `src/data/tescom-models.js` — テスコム ヘアドライヤーの型番別定額データ（229機種、テスコム公式サイトから生成）
- `scripts/` — データ更新用スクリプト（下記）

## データの更新方法

### 修理料金データ（`src/data/repair-data.js`）

「ノジマ側で管理する実データ」= `files/repair_costs.json` が元データ。価格・症状などを更新したいときは、

1. `files/repair_costs.json` を編集する（`category`/`maker`/`symptom`/`price_min`/`price_max`/... のスキーマは変えない）
2. 以下を実行して `src/data/repair-data.js` を再生成する

   ```
   python scripts/build_repair_data.py
   ```

3. `index.html` をブラウザで開いて確認する

### テスコムの型番別定額データ（`src/data/tescom-models.js`）

こちらはテスコム公式サイト（https://www.tescom-japan.co.jp/support/repair/ ）の掲載内容をそのまま転記したもの。
価格改定などで最新化したいときは、ネットワークに接続した状態で以下を実行する。

```
python scripts/update_tescom_models.py
```

公式サイトの表を直接取得して229機種分を再生成する。ページ内には別に「販売店へお問合せください」扱いの
旧型番（固定料金なし）もあるが、このアプリのデータ構造（型番ごとに単一の定額）に合わないため対象外にしている。
サイトの構造が変わっていた場合はエラーで止まる。
