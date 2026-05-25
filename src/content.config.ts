// Content Collections のスキーマ定義
// USE_MICROCMS=true で microCMS / それ以外は src/content/news/*.md（Markdown）
// 切替時はサーバー再起動が必要

import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { createClient } from 'microcms-js-sdk';

const useMicroCMS = import.meta.env.USE_MICROCMS === 'true';

// microCMS版：エンドポイント news を想定
const microCmsNews = defineCollection({
  loader: async () => {
    const serviceDomain = import.meta.env.MICROCMS_SERVICE_DOMAIN;
    const apiKey = import.meta.env.MICROCMS_API_KEY;
    if (!serviceDomain || !apiKey) {
      throw new Error(
        'USE_MICROCMS=true ですが MICROCMS_SERVICE_DOMAIN / MICROCMS_API_KEY が未設定です',
      );
    }
    const client = createClient({ serviceDomain, apiKey });
    const { contents } = await client.get({
      endpoint: 'news',
      queries: { limit: 100 },
    });
    // categoryが string / string[] / { name: string } のどれでも文字列に正規化
    const normalizeCategory = (c: unknown): string | undefined => {
      if (!c) return undefined;
      if (typeof c === 'string') return c;
      if (Array.isArray(c)) return c[0];
      if (typeof c === 'object' && 'name' in c)
        return String((c as { name: string }).name);
      return undefined;
    };

    return contents.map(
      (item: {
        id: string;
        title: string;
        publishedAt: string;
        category?: unknown;
        description?: string;
        body: string;
        thumbnail?: { url: string; width: number; height: number };
      }) => ({
        id: item.id,
        title: item.title,
        pubDate: item.publishedAt,
        category: normalizeCategory(item.category),
        description: item.description,
        body: item.body,
        // 画像未アップ時の null / 空オブジェクトは undefined に正規化
        thumbnail: item.thumbnail?.url ? item.thumbnail : undefined,
      }),
    );
  },
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    category: z.string().optional(),
    description: z.string().optional(),
    body: z.string(),
    thumbnail: z
      .object({
        url: z.string(),
        width: z.number(),
        height: z.number(),
      })
      .optional(),
  }),
});

// Markdown版：src/content/news/*.md
const markdownNews = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    category: z.string().optional(),
    description: z.string().optional(),
  }),
});

const news = useMicroCMS ? microCmsNews : markdownNews;

export const collections = { news };
