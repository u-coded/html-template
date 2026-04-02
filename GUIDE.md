# Astro 構築ガイド

Vite+Handlebarsテンプレートを参照しながら、Astroでゼロから構築するための手順書。
`vite/` ディレクトリに既存のViteファイルがあるので、適宜参照してください。

---

## Phase 1: Astroプロジェクト初期化

### 1. Astroをインストール

プロジェクトルート（`html-template/`）で実行：

```bash
npm create astro@latest .
```

動作要件：**Node.js 22.12.0以上**

対話式の質問への回答：

| 質問                                          | 回答                                       |
| --------------------------------------------- | ------------------------------------------ |
| How would you like to start your new project? | **A basic, minimal starter (recommended)** |
| Do you plan to write TypeScript?              | **Yes**                                    |
| How strict should TypeScript be?              | **Strict**                                 |
| Install dependencies?                         | **Yes**                                    |
| Initialize a new git repository?              | **No**（すでにgitあるので）                |

### 2. 不要ファイルを削除

```
src/pages/index.astro  ← 後で自分で作り直すので削除
```

### 3. 動作確認

```bash
npm run dev
```

`http://localhost:4321` が起動すればOK（この時点では空白でOK）

---

## Phase 2: 開発環境を整える

コードの品質・整形・補完を整える。

---

### ESLintとは

**コードの「おかしな書き方」を検出するツール。**

例えば以下のような問題を自動で見つけてくれる：

- 使っていない変数がある
- `.astro` ファイルの書き方がAstroのルールに違反している
- TypeScriptの型が合っていない

VSCodeの拡張機能（ESLint）と組み合わせると、ファイルを保存した瞬間に赤波線で警告が出るようになる。

---

### Prettierとは

**コードの「見た目」を自動で整えるツール。**

インデント・クォートの種類・行末のセミコロンなどを、設定に従って自動で統一してくれる。

ESLintが「バグになりそうなコードを検出する」のに対して、Prettierは「見た目を綺麗にする」という役割分担。

---

### Huskyとは

**gitのコミット・プッシュなどの操作に「フック（処理）」を挟むツール。**

「コミットする前に自動でESLintとPrettierを実行する」という仕組みを作れる。
これにより、チェックを忘れたままコミットしてしまうのを防げる。

---

### lint-stagedとは

**Huskyと組み合わせて使うツール。「ステージングされたファイルだけ」にlintをかける。**

`git add` したファイルだけが対象になるので、無関係なファイルを毎回チェックせずに済む。

---

### 1. ESLint + Prettierをインストール

```bash
npm install -D eslint prettier eslint-plugin-astro @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier-plugin-astro
```

各パッケージの役割：

| パッケージ                         | 役割                                                       |
| ---------------------------------- | ---------------------------------------------------------- |
| `eslint`                           | ESLint本体                                                 |
| `prettier`                         | Prettier本体                                               |
| `eslint-plugin-astro`              | `.astro`ファイル用のESLintルール                           |
| `@typescript-eslint/parser`        | ESLintがTypeScriptを読めるようにするパーサー               |
| `@typescript-eslint/eslint-plugin` | TypeScript用のESLintルール                                 |
| `prettier-plugin-astro`            | Prettierが`.astro`ファイルを整形できるようにするプラグイン |

### 2. ESLintの設定ファイルを作成

`eslint.config.mjs`：

```js
import astro from 'eslint-plugin-astro';
import tsParser from '@typescript-eslint/parser';

export default [
  ...astro.configs.recommended, // Astro推奨ルールを一括適用
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser, // .tsファイルはTypeScriptパーサーで読む
    },
  },
];
```

### 3. Prettierの設定ファイルを作成

`.prettierrc`：

```json
{
  "plugins": ["prettier-plugin-astro"],
  "singleQuote": true,
  "overrides": [
    {
      "files": "*.astro",
      "options": {
        "parser": "astro"
      }
    }
  ]
}
```

設定の意味：

| 設定                                 | 意味                                      |
| ------------------------------------ | ----------------------------------------- |
| `singleQuote: true`                  | 文字列はシングルクォート `'` に統一       |
| `plugins: ["prettier-plugin-astro"]` | `.astro`ファイルの整形を有効化            |
| `overrides`                          | `.astro`ファイルはastroパーサーで処理する |

### 4. パスエイリアスを設定

**パスエイリアスとは**、ファイルのimportパスに短縮名をつける仕組み。

```ts
// 設定前：ファイルの深さによってパスが変わる
import Header from '../../components/Header.astro';

// 設定後：どこからでも同じパスで書ける
import Header from '@/components/Header.astro';
```

`tsconfig.json` の `compilerOptions` に追記：

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

`astro.config.mts` にも追記（Viteにも同じ設定が必要）：

```ts
import { defineConfig } from 'astro/config';
import path from 'path';

export default defineConfig({
  vite: {
    resolve: {
      alias: {
        '@': path.resolve('./src'),
      },
    },
  },
});
```

tsconfig と astro.config の両方に書く理由：

- `tsconfig.json` → TypeScriptの型チェック・エディタの補完用
- `astro.config.mts` → 実際のビルド（Vite）用

### 5. 環境変数の管理ファイルを作成

**環境変数とは**、APIキーやURLなどをコードに直接書かずに外部から渡す仕組み。

`.env` ファイルに書いた値は `import.meta.env.変数名` でAstroのコード内から読み込める。

`.env`（実際の値を書く・gitignoreに追加）：

```
RESEND_API_KEY=re_xxxxxxxxxxxx
MICROCMS_API_KEY=xxxxxxxxxxxx
```

`.env.example`（キーの名前だけ書いてgit管理する）：

```
RESEND_API_KEY=
MICROCMS_API_KEY=
```

`.gitignore` に `.env` が入っていることを確認（Astroが自動追加済みのはず）。

### 6. Husky + lint-stagedをインストール

```bash
npm install -D husky lint-staged
npx husky init
```

`npx husky init` を実行すると `.husky/` ディレクトリと `pre-commit` ファイルが自動生成される。

`package.json` に追記（どのファイルに何を実行するか）：

```json
{
  "lint-staged": {
    "*.{astro,ts}": ["eslint --fix", "prettier --write"],
    "*.{css,scss,md}": ["prettier --write"]
  }
}
```

`.husky/pre-commit` の中身を以下に変更：

```bash
npx lint-staged
```

これで `git commit` するたびに、ステージング済みファイルに対してESLint→Prettierが自動実行される。
問題が見つかった場合はコミットが中断されるので、コードの品質を保てる。

### 7. `package.json` にスクリプトを追加

```json
{
  "scripts": {
    "lint": "eslint .",
    "format": "prettier --write ."
  }
}
```

手動で実行したい時：

```bash
npm run lint     # ESLintでチェック（エラーの確認）
npm run format   # Prettierで整形（全ファイルに適用）
```

---

## Phase 3: SCSSを移行する

既存のFLOCSSをそのままAstroに持ち込む。

### 1. ディレクトリを作成してコピー

```
vite/src/assets/css/ → src/styles/
```

フォルダごとコピーして、以下の構造にする：

```
src/
└── styles/
    ├── style.scss          ← エントリーポイント
    ├── foundation/
    ├── layout/
    └── object/
```

### 2. style.scssのimportパスを確認

`vite/src/assets/css/style.scss` のimportパスはそのまま使えるはず。
`./foundation/...` のような相対パスになっていれば変更不要。

（Astroへの読み込みはPhase 4のLayout作成時に行う）

---

## Phase 4: Layout.astro を作る

ヘッダー・フッターを含む全ページ共通のHTML骨格を作る。
参照元：`vite/src/parts/_header.html`、`vite/src/parts/_footer.html`

### 1. ファイルを作成

```
src/layouts/Layout.astro
```

### 2. .astroファイルの基本構造

```astro
---
// ここがTypeScriptを書くフロントマター（---で囲む）
// Propsの型定義や、import文を書く場所

import '../styles/style.scss';

interface Props {
  pageTitle: string;
  pageSlug: string;
}

const { pageTitle, pageSlug } = Astro.props;
---

<!-- ここがHTMLテンプレート --><!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <title>{pageTitle}</title>
  </head>
  <body>
    <header>ヘッダー</header>

    <slot />
    <!-- 各ページのコンテンツがここに入る -->

    <footer>フッター</footer>
  </body>
</html>
```

### 3. siteDataを作成

サイト共通の情報（サイト名・ディスクリプションなど）を切り出す。

```
src/data/site.ts
```

```ts
export const siteData = {
  siteName: 'サイト名',
  siteDesc: 'サンプル株式会社の公式サイトです。',
  siteKwd: 'サンプル,コーポレート',
  siteCanonical: 'https://xxxxx/',
} as const;
```

### 4. headタグの設定

#### Fonts APIを設定

Google Fontsをセルフホスティングして自動最適化する。`astro.config.mts` に追記：

```ts
import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Lato',
      cssVariable: '--font-en',
      weights: [400],
    },
    {
      provider: fontProviders.google(),
      name: 'Noto Sans JP',
      cssVariable: '--font-ja',
      weights: [400, 700, 900],
    },
  ],
});
```

SCSSのフォント指定はCSS変数で参照できる：

```scss
font-family: var(--font-ja), sans-serif;
```

#### Layout.astroのheadタグ

```astro
---
const title =
  pageSlug === 'index'
    ? siteData.siteName
    : `${pageTitle} | ${siteData.siteName}`;
---

<head>
  <meta charset="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
  />
  <meta name="format-detection" content="telephone=no" />

  <title>{title}</title>
  <meta name="description" content={siteData.siteDesc} />
  <link rel="canonical" href={siteData.siteCanonical} />

  <!-- OGP -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={siteData.siteDesc} />
  <meta
    property="og:image"
    content={`${siteData.siteCanonical}assets/images/common/ogp.png`}
  />
  <meta property="og:url" content={siteData.siteCanonical} />
  <meta property="og:site_name" content={siteData.siteName} />

  <!-- Twitter Card（og:*を自動参照するので最低限でOK） -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta
    name="twitter:image"
    content={`${siteData.siteCanonical}assets/images/common/ogp.png`}
  />

  <!-- Favicon -->
  <link
    rel="apple-touch-icon"
    sizes="180x180"
    href="/assets/images/icon/apple-touch-icon.png"
  />
  <link
    rel="icon"
    type="image/png"
    sizes="32x32"
    href="/assets/images/icon/favicon-32x32.png"
  />
  <link
    rel="icon"
    type="image/png"
    sizes="16x16"
    href="/assets/images/icon/favicon-16x16.png"
  />
  <link rel="manifest" href="/assets/images/icon/site.webmanifest" />
  <meta name="theme-color" content="#ffffff" />
</head>
```

faviconファイルは `public/assets/images/icon/` に配置する（`vite/src/public/assets/images/icon/` からコピー）。

省いたもの：

- `keywords` → Googleは無視するため不要
- `twitter:title` / `twitter:description` / `twitter:url` → `og:*` を自動参照するため省略可
- `msapplication-TileColor` → Windows 8のピン留め用で現在はほぼ不要

### 5. bodyタグとローディング画面

`pageSlug` をbodyのidに設定する（JS側でページ判定に使う）。
`ontouchstart=""` はiOSでhoverを有効にするためのおまじない。

```astro
<body id={pageSlug} ontouchstart="">
  <!-- ローディング画面：トップページのみ表示 -->
  {
    pageSlug === 'index' && (
      <div class="l-loading" data-loading>
        <p class="l-loading__txt">Loading...</p>
      </div>
    )
  }

  <Header pageSlug={pageSlug} />

  <div class="l-container">
    <slot />
  </div>

  <Footer />
</body>
```

### ページ遷移アニメーションを付けたい場合（オプション）

Astro標準の `<ClientRouter />` を使うとSPA風のページ遷移が実現できる。

> **Astro 6の注意**: 旧バージョンの `<ViewTransitions />` は廃止。必ず `<ClientRouter />` を使うこと。

```astro
---
import { ClientRouter } from 'astro:transitions';
---

<head>
  ...
  <ClientRouter />
</head>
```

---

## Phase 5: トップページを作る

### 1. ファイルを作成

```
src/pages/index.astro
```

### 2. Layoutを使う

```astro
---
import Layout from '@/layouts/Layout.astro';
---

<Layout pageTitle="トップページ" pageSlug="index">
  <main>
    <p>トップページのコンテンツ</p>
  </main>
</Layout>
```

### 3. vite側のHTMLを参照しながらコンテンツを移植

`vite/src/index.html` の中身を見ながら、セクションを1つずつ移植していく。

---

## Phase 6: ヘッダーをコンポーネントにする

### 1. ファイルを作成

```
src/components/Header.astro
```

### 2. Layoutから分離する

Layout.astroのヘッダー部分を切り出して、Headerコンポーネントとして独立させる。

```astro
---
interface Props {
  pageSlug: string;
}
const { pageSlug } = Astro.props;
---

<!-- src/components/Header.astro -->
<header class="l-header">...</header>
```

Layout.astroでimportして使う：

```astro
---
import Header from '@/components/Header.astro';
---

<Header pageSlug={pageSlug} />
```

---

## Phase 7: 残りのコンポーネントを作る

同じ要領で以下を順番に作っていく。

| コンポーネント     | 参照元                            | Props                                                        |
| ------------------ | --------------------------------- | ------------------------------------------------------------ |
| `Footer.astro`     | `vite/src/parts/_footer.html`     | なし                                                         |
| `SubKv.astro`      | `vite/src/parts/_sub-kv.html`     | `pageTitle`                                                  |
| `Breadcrumb.astro` | `vite/src/parts/_breadcrumb.html` | `pageTitle`, `pageUrl`, `parentPageTitle?`, `parentPageUrl?` |

---

## Phase 8: 下層ページを作る

```
src/pages/about/index.astro
src/pages/news/index.astro
src/pages/contact/index.astro
```

SubKv・Breadcrumbを使う例（aboutページ）：

```astro
---
import Layout from '@/layouts/Layout.astro';
import SubKv from '@/components/SubKv.astro';
import Breadcrumb from '@/components/Breadcrumb.astro';
---

<Layout pageTitle="会社概要" pageSlug="about">
  <SubKv pageTitle="会社概要" />
  <Breadcrumb pageTitle="会社概要" pageUrl="about" />
  <main>...</main>
</Layout>
```

---

## Phase 9: JavaScriptをTypeScript化して移行する

`vite/src/assets/js/` を見ながら、自分で書き直していく。

### 移行先の構造

```
src/scripts/
├── main.ts
└── assets/
    ├── debounce.ts
    ├── loading.ts
    ├── modal.ts
    ├── nav.ts
    ├── pageTop.ts
    ├── scrollAnimation.ts
    ├── scrollLock.ts
    └── smoothScroll.ts
```

### Layout.astroで読み込む

```astro
<script>
  import '@/scripts/main.ts';
</script>
```

### TypeScript化のポイント

- 関数の引数・戻り値に型をつける
- `document.querySelector()` の返り値は `Element | null` になるので null チェックが必要
- `as HTMLElement` のようなキャストより、型ガード（`instanceof`）を使うとより安全

---

## Phase 10: 404ページを作る

```
src/pages/404.astro
```

このファイルが存在するだけでAstroが自動で404ページとして扱う。

```astro
---
import Layout from '@/layouts/Layout.astro';
---

<Layout pageTitle="ページが見つかりません" pageSlug="404">
  <main>
    <p>お探しのページは見つかりませんでした。</p>
    <a href="/">トップページへ戻る</a>
  </main>
</Layout>
```

---

## Phase 11: ニュースページ（Content Collections）

Markdownファイルで記事を管理する仕組みを作る。

> **Astro 6の注意点**
>
> - 設定ファイルの場所が `src/content/config.ts` → **プロジェクトルート直下の `src/content.config.ts`** に変わった
> - `loader` の指定が必須になった
> - `post.slug` → `post.id`
> - `post.render()` → `render(post)`（`astro:content` からimport）

### 1. スキーマ定義

ファイルの場所に注意（`src/` 直下、`content/` の中ではない）：

```
src/content.config.ts
```

```ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const news = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    category: z.string().optional(),
  }),
});

export const collections = { news };
```

### 2. サンプル記事を作成

```
src/content/news/first-post.md
```

```markdown
---
title: '最初のお知らせ'
pubDate: 2026-04-01
category: 'お知らせ'
---

記事の本文をここに書きます。
```

### 3. 動的ルーティングで記事詳細ページを作成

```
src/pages/news/[slug].astro
```

```astro
---
import { getCollection, render } from 'astro:content';
import Layout from '@/layouts/Layout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('news');
  return posts.map((post) => ({
    params: { slug: post.id }, // slug → id に変更
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post); // post.render() → render(post) に変更
---

<Layout pageTitle={post.data.title} pageSlug="news-article">
  <main>
    <h1>{post.data.title}</h1>
    <Content />
  </main>
</Layout>
```

### microCMSに切り替えたくなったら

`microcms-js-sdk` を追加して `getStaticPaths()` のデータ取得部分をmicroCMS APIに変えるだけ。
スキーマのZod型定義はそのまま流用できる。

---

## Phase 12: フォームを動かす（Astro Actions）

フォームのバリデーションとメール送信をサーバーサイドで処理する。

### 1. output を hybrid に変更

`astro.config.mts` に追記：

```ts
export default defineConfig({
  output: 'hybrid',
});
```

### 2. Actionを定義

```
src/actions/index.ts
```

```ts
import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

export const server = {
  contact: defineAction({
    input: z.object({
      name: z.string().min(1, '名前を入力してください'),
      email: z.string().email('正しいメールアドレスを入力してください'),
      message: z.string().min(10, '10文字以上入力してください'),
    }),
    handler: async (input) => {
      // TODO: Resendでメール送信
      console.log(input);
      return { success: true };
    },
  }),
};
```

### 3. Resendでメール送信する場合

```bash
npm install resend
```

```ts
import { Resend } from 'resend';
const resend = new Resend(import.meta.env.RESEND_API_KEY);

handler: async (input) => {
  await resend.emails.send({
    from: 'no-reply@yourdomain.com',
    to: 'info@yourdomain.com',
    subject: `お問い合わせ: ${input.name}`,
    text: input.message,
  });
  return { success: true };
};
```

### レンタルサーバー（静的ビルド）の場合

`output: 'hybrid'` ではなく `output: 'static'` のままにして、
フォームのsubmit先をFormspreeのエンドポイントに差し替える：

```html
<form action="https://formspree.io/f/YOUR_ID" method="POST"></form>
```

---

## Phase 13: 画像最適化（astro:assets）

`<img>` タグを Astroの `<Image />` コンポーネントに置き換えてWebP自動変換を有効にする。

### 画像ファイルの置き場所

```
vite/src/assets/images/ → src/assets/images/   ← Astroが最適化する対象
vite/src/public/        → public/               ← 変換しないファイル（favicon等）
```

### 使い方

```astro
---
import { Image } from 'astro:assets';
import heroImg from '@/assets/images/index/img_dummy1_pc.jpg';
---

<Image src={heroImg} alt="ヒーロー画像" format="webp" width={1200} />
```

> **Astro 6の注意点**
> レスポンシブ画像のCSS属性が変わった。インラインの `--fit` / `--pos` スタイルは廃止され、`data-astro-fit` / `data-astro-pos` 属性を使う。
> SCSSでこれらの属性をスタイリングしている場合はセレクタを更新すること。

---

## Phase 14: ホスティング設定

### Netlify / Cloudflare / Vercel

アダプターをインストールするだけで対応できる：

```bash
# Netlifyの場合
npx astro add netlify

# Cloudflare Pagesの場合
npx astro add cloudflare

# Vercelの場合
npx astro add vercel
```

### サイトマップとRSSフィードを追加

```bash
npx astro add sitemap
```

`astro.config.mts` に `site` の設定が必要：

```ts
export default defineConfig({
  site: 'https://yourdomain.com',
  integrations: [sitemap()],
});
```

RSSフィード（ニュース用）：

```bash
npm install @astrojs/rss
```

`src/pages/rss.xml.ts` を作成することでRSSフィードを自動生成できる。

### 通常のレンタルサーバー（静的ビルド）

`astro.config.mts` の `output` を `static` にしてビルド：

```bash
npm run build
```

`dist/` の中身をそのままFTPでアップロードすればOK。

---

## Phase 15: コンポーネントカタログページを作る

Storybookのように、作ったコンポーネントを一覧で確認できるページをAstro内に作る。
追加ライブラリ不要で、開発中だけ使うページとして管理する。

### 1. ファイルを作成

```
src/pages/catalog/index.astro
```

### 2. カタログページの構成例

```astro
---
// 本番ビルドから除外する（開発時のみアクセス可）
if (import.meta.env.PROD) {
  return Astro.redirect('/');
}

import Layout from '@/layouts/Layout.astro';
import Button from '@/components/ui/Button.astro';
import Heading from '@/components/ui/Heading.astro';
---

<Layout pageTitle="コンポーネントカタログ" pageSlug="catalog">
  <main style="padding: 40px;">
    <section>
      <h2>Button</h2>
      <Button variant="primary">プライマリボタン</Button>
      <Button variant="secondary">セカンダリボタン</Button>
    </section>

    <section>
      <h2>Heading</h2>
      <Heading level={2}>見出し2</Heading>
      <Heading level={3}>見出し3</Heading>
    </section>
  </main>
</Layout>
```

### 3. アクセス方法

開発サーバー起動中に `http://localhost:4321/catalog` で確認できる。

`import.meta.env.PROD` で本番時はトップページにリダイレクトされるので、
そのまま公開しても問題ない。

### コンポーネントの置き場所

汎用UIパーツは `ui/` サブフォルダで管理するとすっきりする：

```
src/components/
├── Header.astro       ← レイアウト系
├── Footer.astro
├── Breadcrumb.astro
├── SubKv.astro
└── ui/                ← 汎用UIパーツ
    ├── Button.astro
    ├── Heading.astro
    └── ...
```
