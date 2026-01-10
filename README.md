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

### 画像

- `src/images/` 以下の jpg,png 画像は自動で webp になる（html のパスも書き変わる）
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

- スタイルを当てる `ul`, `ol` には `role="list"` を書く

## コーディング規約

### サイズ指定について

**重要: 全てのサイズ指定は `f.r()` または `f.v()` を使用してください**

このプロジェクトでは、SP と PC のデザインカンプからコーディングするため、デザインカンプの px 値をそのまま使用できる関数を用意しています。

#### `f.v($px)` - vw 変換関数

デザインカンプの px 値を vw に変換します。レスポンシブ対応で画面幅に応じて自動的にサイズが調整されます。

```scss
// 使用例
font-size: f.v(28); // デザインカンプの28pxをvwに変換
width: f.v(200); // デザインカンプの200pxをvwに変換
```

**用途:**

- レスポンシブで可変させたい要素
- フォントサイズ（可変）
- 幅・高さ（可変）

#### `f.r($px)` - rem 変換関数

デザインカンプの px 値を rem に変換します。基準フォントサイズは 16px です。

```scss
// 使用例
padding: f.r(20); // デザインカンプの20pxをremに変換（1.25rem）
margin-top: f.r(50); // デザインカンプの50pxをremに変換（3.125rem）
```

**用途:**

- padding, margin（余白）
- border-radius
- フォントサイズ（固定サイズにしたい場合）

#### 使い分けの目安

| 関数     | 用途                           | 例                                   |
| -------- | ------------------------------ | ------------------------------------ |
| `f.v()`  | レスポンシブで可変させたい要素 | `font-size: f.v(28);`                |
| `f.r()`  | 固定サイズで良い要素           | `padding: f.r(20);`                  |
| 直接単位 | ビューポート単位、相対単位など | `height: 100vh;`, `margin-top: 1em;` |

#### 詳細な説明

詳細は `src/assets/css/foundation/_functions.scss` のコメントを参照してください。
