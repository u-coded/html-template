# html-template

Vite の 静的 HTML コーディング環境

## コマンド

`npm install` 依存関係をインストール
`npm run dev` ローカルサーバーを起動
`npm run build` ビルド
`npm run preview` ビルドをローカルでプレビュー

## 注意点など

### 環境

- Node.js のバージョンは Volta で `22.20.0` が指定されています（新しければ大丈夫なはず）
- テンプレートエンジンは handlebars を使用している

### カスタムヘルパー（Handlebars）

`vite.config.js` で登録している Handlebars 用のカスタムヘルパーです。テンプレート内で利用できます。

| ヘルパー | 説明                           | 使い方                                                                         |
| -------- | ------------------------------ | ------------------------------------------------------------------------------ |
| `eq`     | すべて同じ値かどうか           | `{{#if (eq a b)}}` または `{{#if (eq a b c)}}`                                 |
| `notEq`  | すべて異なる値かどうか         | `{{#if (notEq a b)}}` または `{{#if (notEq a b c)}}`                           |
| `or`     | いずれかが truthy か           | `{{#if (or a b c)}}`                                                           |
| `and`    | すべて truthy か               | `{{#if (and a b c)}}`                                                          |
| `limit`  | 配列の先頭から指定件数         | `{{#each (limit articles 3)}} ... {{/each}}`                                   |
| `times`  | 指定回数だけブロックを繰り返す | `{{#times 3}} ... {{/times}}`（ブロック内で `this` は 0 始まりのインデックス） |

### ページ情報の設定

ページのタイトルやメタ情報は `vite.config.js` で設定します。

#### サイト共通情報（`siteData`）

```javascript
const siteData = {
  siteName: "HTMLテンプレ", // サイト名
  siteDesc: "ディスクリプションを入力", // メタディスクリプション
  siteKwd: "キーワード1,キーワード2", // メタキーワード
  siteCanonical: "https://xxxxx/", // 正規URL
};
```

#### ページ別情報（`pageData`）

各ページの情報を `pageData` オブジェクトに追加してください。

```javascript
const pageData = {
  "/index.html": {
    siteData, // サイト共通情報
    path: "", // 相対パス（アセットへのパス）
    pageSlug: "index", // ページのスラッグ（bodyのidに使用）
    pageUrl: "", // ページのURL
    pageTitle: "トップページ", // ページタイトル
  },
  "/about/index.html": {
    siteData,
    path: "../", // 下層ページの場合は "../"
    pageSlug: "about",
    pageUrl: "about",
    pageTitle: "このテンプレについて",
  },
  // 新しいページを追加する場合はここに追記
};
```

**新規ページを追加する場合:**

1. `src/` 配下にページの HTML ファイルを作成
2. `vite.config.js` の `pageData` にページ情報を追加
3. `path` は階層に応じて調整（例: 2 階層下なら `../../`）
4. ページ別の JS が必要な場合は `src/assets/js/scenes/` に `xxx.js` を作成し、`main.js` の import と switch に case を追加する

### 画像

- `src/assets/images/` 以下の jpg,png 画像は自動で webp になる（html のパスも書き変わる）
- webp にしたくない画像は `src/public/` 以下に入れる

### CSS 設計

- CSS は **FLOCSS** ベースで記述する
- Foundation（変数、関数、mixin、リセット、ベーススタイル）
- Layout（ヘッダー、フッター、ナビゲーションなど）
- Object（Component、Project、Utility）

### レスポンシブ対応

- **SP カンプ幅・PC カンプ幅**: デザインサイズによるので、`src/assets/css/foundation/_variable.scss` の `$sp-design-width` と `$pc-design-width` を変更してください
- インナー幅の仕組み:
  - iPad 未満（SP）: SP デザインをベースに可変
  - iPad 以上〜指定した最大幅まで: PC デザインを基準に可変
  - 指定した最大幅以上: 固定される
- ブレイクポイントやその他のサイズ設定も `src/assets/css/foundation/_variable.scss` で定義・変更可能

### 用意されている JavaScript 機能

- ハンバーガーメニュー（`nav.js`）
- トップへ戻るボタン（`pageTop.js`）
- スムーススクロール（`smoothScroll.js`）
- スクロール時のアニメーション（`scrollAnimation.js`）
- モーダル（`modal.js`）
- ローディングアニメーション（`loading.js`）
- スクロールロック（`scrollLock.js`）

### ディレクトリ構造

```
src/
├── assets/
│   ├── css/          # SCSS ファイル（FLOCSS 構成）
│   ├── js/           # JavaScript ファイル
│   └── images/       # 画像ファイル（自動で webp 変換）
├── parts/            # Handlebars のパーシャル（_header.html など）
└── [ページ名]/       # 各ページの HTML ファイル
```

### その他

## コーディング規約

### サイズ指定

**全てのサイズ指定は `f.rem()` または `f.vw()` を使用してください。** デザインカンプの px 値をそのまま渡せます。

#### `f.rem($px)` — 固定サイズ

16px 基準で rem に変換します。SP・PC で同じサイズのときに使います。

```scss
font-size: f.rem(20);   // → 1.25rem
padding: f.rem(15);     // → 0.9375rem
```

#### `f.vw($size, $design-vw, $min-vw, $max-vw)` — 画面幅に応じて可変

デザイン上の px を基準に、ウィンドウ幅に比例して `clamp()` で可変出力します。

| 引数 | 説明 | デフォルト |
| --- | --- | --- |
| `$size` | デザインカンプ上のサイズ（px） | **必須** |
| `$design-vw` | そのサイズの基準となるデザイン幅 | `$pc-design-width`（1366） |
| `$min-vw` | 可変する最小ウィンドウ幅 | `$sp-design-width`（375） |
| `$max-vw` | 可変する最大ウィンドウ幅 | `$pc-design-width`（1366） |

**基本の使い方（1引数）:**

```scss
// PCデザイン（1366px）で30px、375px〜1366pxで比例可変
font-size: f.vw(30);
```

**カスタム範囲を指定（4引数）:**

```scss
// 1366pxデザインで30px、744px〜1600pxの範囲で比例可変
font-size: f.vw(30, 1366, 744, 1600);
```

**SP/PC をメディアクエリで分けるパターン:**

```scss
.heading {
  // SPデザイン（375px）で24px、375px〜743pxで比例可変
  font-size: f.vw(24, 375, 375, 743);

  @include m.mq-up(md) {
    // PCデザイン（1366px）で32px、1280px〜1600pxで比例可変
    font-size: f.vw(32, 1366, 1280, 1600);
  }
}
```
