# 株式会社藤島製作所 コーポレートサイト

精密機械加工・金型製造を行う架空企業のコーポレートサイト。
**Astro v6** をベースにした制作テンプレートを兼ねており、新規案件のスタートポイントとして使えるよう設計されています。

---

## 主な機能

- **コンテンツ管理**：Markdown（Content Collections）でお知らせを管理。microCMS への切替も容易
- **お問い合わせフォーム**：Astro Actions + Zod + Resend でサーバーサイド検証＆メール送信
- **画像最適化**：`astro:assets` で WebP 自動変換・レスポンシブ対応
- **SPA 風遷移**：Astro 標準の `<ClientRouter />` で View Transitions
- **SEO**：sitemap 自動生成・OGP・JSON-LD（パンくず）対応
- **TypeScript**：Strict モード
- **コード品質**：ESLint / Prettier / Husky / lint-staged
- **スタイルガイド**：開発用に `/styleguide/` で全コンポーネントを確認可能（本番では非公開）

---

## 必要環境

- Node.js **22.12.0** 以上
- npm

---

## セットアップ

```bash
# 1. 依存パッケージのインストール
npm install

# 2. 環境変数ファイルを作成
cp .env.example .env

# 3. .env に実際の値を記入（最低限 RESEND_API_KEY が必要、後述）
```

### 開発サーバー起動

```bash
npm run dev
```

ブラウザで `http://localhost:4321` を開く。

### 本番ビルド

```bash
npm run build      # dist/ にビルド成果物が出力される
npm run preview    # 本番ビルドの動作確認
```

---

## ディレクトリ構成

```
.
├── public/                       # そのまま配信される静的ファイル（favicon, OGP画像等）
├── src/
│   ├── actions/                  # Astro Actions（フォーム送信処理）
│   │   └── index.ts
│   ├── assets/                   # ビルド時に最適化される画像
│   │   └── images/
│   ├── components/               # Astroコンポーネント
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── SubKv.astro
│   │   └── Breadcrumb.astro
│   ├── content/                  # Content Collections（Markdown記事）
│   │   └── news/
│   ├── data/                     # サイト共通の定数
│   │   └── site.ts
│   ├── layouts/
│   │   └── Layout.astro          # 全ページ共通レイアウト
│   ├── pages/
│   │   ├── index.astro
│   │   ├── 404.astro
│   │   ├── about/
│   │   ├── contact/
│   │   ├── news/
│   │   │   ├── [...page].astro  # 一覧（ページネーション）
│   │   │   └── article/
│   │   │       └── [slug].astro # 詳細
│   │   └── styleguide/           # 開発用コンポーネント一覧（本番非公開）
│   ├── scripts/                  # クライアントサイドTS
│   ├── styles/                   # FLOCSSベースのSCSS
│   └── content.config.ts         # Content Collections スキーマ
├── astro.config.mts
├── eslint.config.mjs
└── tsconfig.json
```

---

## サイト基本情報の編集

`src/data/site.ts`：サイト名・SEO ディスクリプション・正規 URL 等。Layout の head・Header・Footer に反映される。

```ts
export const siteData = {
  siteName: '株式会社藤島製作所',
  siteDesc: '...',
  siteCanonical: 'https://fujishima-mfg.example.com/',
};
```

ページ固有のコンテンツ（会社概要・事業内容・沿革など）は、各ページの `.astro` ファイル内に直書きされています。

---

## お知らせ（ニュース）の更新

### Markdown を追加する

`src/content/news/` に `.md` ファイルを追加するだけ。
ファイル名が URL のスラッグ（例：`new-product.md` → `/news/article/new-product/`）。

```markdown
---
title: '記事タイトル'
pubDate: 2026-05-22
category: 'お知らせ'
description: '一覧ページに表示する概要文'
thumbnail: ../../assets/images/news/example.jpg
---

本文をMarkdownで記述します。

![代替テキスト](../../assets/images/news/example2.jpg)
```

### フィールド一覧

| フィールド    | 必須 | 説明                                           |
| ------------- | ---- | ---------------------------------------------- |
| `title`       | ✅   | 記事タイトル                                   |
| `pubDate`     | ✅   | 公開日（YYYY-MM-DD）                           |
| `category`    | –    | カテゴリー（任意）                             |
| `description` | –    | 一覧ページに表示される概要文                   |
| `thumbnail`   | –    | 一覧・詳細冒頭に表示されるサムネイル画像のパス |

スキーマは `src/content.config.ts` で定義。フィールドを追加したい場合はここを編集する。

### 本文中の画像

`src/assets/images/news/` 配下に置いた画像を Markdown 標準記法で参照すると、ビルド時に自動で WebP 変換・最適化されます。

```markdown
![完成した第二工場](../../assets/images/news/factory.jpg)
```

### ページネーション設定

`src/pages/news/[...page].astro` の `paginate(posts, { pageSize: 3 })` の数値を変更。

### microCMS に切り替える場合

Markdown 管理を microCMS に切り替えるには、`src/content.config.ts` の `loader` を差し替えるだけで OK（記事詳細ページの実装はそのまま使える）。

```bash
npm install microcms-js-sdk
```

```ts
// src/content.config.ts
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { createClient } from 'microcms-js-sdk';

const client = createClient({
  serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: import.meta.env.MICROCMS_API_KEY,
});

const news = defineCollection({
  loader: async () => {
    const { contents } = await client.get({
      endpoint: 'news',
      queries: { limit: 100 },
    });
    return contents.map((item) => ({
      id: item.id,
      title: item.title,
      pubDate: item.publishedAt,
      category: item.category?.name,
      description: item.description,
      body: item.body, // HTMLとして返す
    }));
  },
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    category: z.string().optional(),
    description: z.string().optional(),
    body: z.string(),
  }),
});

export const collections = { news };
```

> microCMS は本文を HTML で返すため、記事詳細ページの `<Content />` の代わりに `<Fragment set:html={post.data.body} />` を使うように変更する必要があります。

`.env` に追記：

```
MICROCMS_SERVICE_DOMAIN=your-service
MICROCMS_API_KEY=xxxxxxxxxxxxxxxx
```

---

## お問い合わせフォーム（Resend）

`src/actions/index.ts` で `Resend` を使ってメール送信しています。

### Resend のセットアップ手順

1. [resend.com](https://resend.com) で無料アカウント作成
2. **Domains** から送信元ドメインを追加（例：`yourcompany.co.jp`）
3. 表示される **SPF / DKIM の DNS レコード** を、ドメイン管理画面に追加
4. ドメイン認証が完了するまで待つ（数分〜数時間）
5. **API Keys** → **Create API Key** で API キーを発行
6. `.env` に下記を設定

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
MAIL_FROM=no-reply@yourcompany.co.jp      # 認証済みドメインのアドレス
MAIL_TO=info@yourcompany.co.jp            # 受信側（自社の問い合わせ受け先）
```

### ドメイン認証なしで試したい場合

開発・テスト用には Resend が用意している `onboarding@resend.dev` を `MAIL_FROM` に設定可能（ただし送信先は自分のアカウントの登録メールに限定）。

### 自動返信を追加したい場合

`src/actions/index.ts` の `handler` 内で `resend.emails.send()` を2回呼ぶ：

```ts
handler: async (input) => {
  // 管理者宛
  await resend.emails.send({
    from: import.meta.env.MAIL_FROM,
    to: import.meta.env.MAIL_TO,
    subject: `お問い合わせ: ${input.name}`,
    text: `...`,
  });

  // 送信者本人宛（自動返信）
  await resend.emails.send({
    from: import.meta.env.MAIL_FROM,
    to: input.email,
    subject: 'お問い合わせを受け付けました',
    text: `${input.name} 様\n\nお問い合わせありがとうございます。\n...`,
  });

  return { success: true };
},
```

### Resend の無料枠

- **3,000通／月**（1日100通まで）
- 超過するとメール送信が止まる（コードはエラーで返る）
- コーポレートサイトの問い合わせ程度なら無料枠で十分

### Formspree などに切り替える場合（レンタルサーバー向け）

`output: 'static'`（デフォルト）でサーバー機能を使わない構成にして、フォームを Formspree に差し替えます。

1. `src/pages/contact/index.astro` から `export const prerender = false` を削除
2. `<form>` の action を Formspree の URL に変更
3. `src/actions/index.ts` を削除
4. `astro.config.mts` から `adapter: vercel()` を削除

---

## 画像の追加

### 最適化したい画像（推奨）

`src/assets/images/` に置く。ビルド時に WebP 変換・サイズ最適化される。

```astro
---
import { Image } from 'astro:assets';
import heroImg from '@/assets/images/hero.jpg';
---

<Image src={heroImg} alt="ヒーロー画像" format="webp" width={1200} />
```

### そのまま配信したい画像

`public/assets/images/` に置く（favicon・OGP用画像など）。
最適化されない代わりに、ファイル名・URL がそのまま保持される。

### 1枚の画像で PC/SP 出し分けたい場合

`<picture>` + `getImage()` で表現できる：

```astro
---
import { Image, getImage } from 'astro:assets';
import pc from '@/assets/images/index/img_dummy1_pc.jpg';
import sp from '@/assets/images/index/img_dummy1_sp.jpg';

const pcWebp = await getImage({ src: pc, format: 'webp' });
---

<picture>
  <source srcset={pcWebp.src} media="(min-width: 744px)" />
  <Image src={sp} alt="" format="webp" width={750} height={750} />
</picture>
```

---

## スタイルガイド

開発時に `http://localhost:4321/styleguide/` でコンポーネント一覧を確認できます。
本番ビルド時は自動的にTOPページへリダイレクトされるため、公開されません。

新しいコンポーネントを追加した際は、`src/pages/styleguide/index.astro` にも見本を追記しておくと、後からの確認が楽になります。

---

## デプロイ（Vercel）

### 初回セットアップ

1. [vercel.com](https://vercel.com) でアカウント作成（GitHub 連携が楽）
2. GitHub にこのリポジトリを push
3. Vercel ダッシュボードで **New Project** → リポジトリを選択
4. **Environment Variables** に `.env` の中身を登録（Resend のキー等）
5. **Deploy** ボタンをクリック

### 環境変数の設定

Vercel の **Settings → Environment Variables** に下記を追加：

| キー             | 値                        |
| ---------------- | ------------------------- |
| `RESEND_API_KEY` | `re_...`                  |
| `MAIL_FROM`      | `no-reply@yourdomain.com` |
| `MAIL_TO`        | `info@yourdomain.com`     |

### カスタムドメインを設定する

1. Vercel の **Settings → Domains** からドメインを追加
2. ドメイン管理画面で DNS レコードを設定
3. `astro.config.mts` の `site` を本番URLに更新（sitemap生成のため）
4. `src/data/site.ts` の `siteCanonical` も同じ URL に更新

### 別のホスティングに切り替える

`@astrojs/vercel` の代わりに、対応するアダプターを入れて `astro.config.mts` を差し替える：

```bash
# Netlify
npm install @astrojs/netlify

# Cloudflare Pages
npm install @astrojs/cloudflare

# 自前のNode サーバー
npm install @astrojs/node
```

---

## コマンド一覧

| コマンド          | 動作                                        |
| ----------------- | ------------------------------------------- |
| `npm run dev`     | 開発サーバー起動（`http://localhost:4321`） |
| `npm run build`   | 本番ビルド（`dist/`）                       |
| `npm run preview` | ビルド成果物をローカルプレビュー            |
| `npm run lint`    | ESLint チェック                             |
| `npm run format`  | Prettier で整形                             |
| `npm run astro`   | Astro CLI（add, check, etc.）               |

---

## 関連ドキュメント

- [Astro 公式ドキュメント](https://docs.astro.build/)
- [Resend ドキュメント](https://resend.com/docs)
- [Vercel ドキュメント](https://vercel.com/docs)
