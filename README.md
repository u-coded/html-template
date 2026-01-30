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

| 関数           | 用途                     | 例                         |
| -------------- | ------------------------ | -------------------------- |
| `f.rem($px)`   | 固定サイズ（SP/PC 同じ） | `font-size: f.rem(18);`    |
| `f.vw($px)`    | 画面幅に応じて可変       | `font-size: f.vw(30);`     |
| `f.vw($px, $max)` | 可変＋最大値で打ち止め | `font-size: f.vw(30, 36);` |

- **f.rem($px)** … 16px 基準で rem に変換。SP・PC で同じ px のときは 1 回指定でよい。
- **f.vw($px)** … rem で出力。画面幅に比例して可変。最小値は PC インナー幅（`$inner-min`）時。
- **f.vw($px, $max)** … 第二引数で最大値（px）を指定。大きくなりすぎないようにするとき用。
