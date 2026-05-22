// Content Collections のスキーマ定義
// src/content/news/*.md がここで検証される。microCMSへ切替時は loader を差し替える

import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const news = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/news' }),
  // image() を使うため schema は関数形式
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      pubDate: z.coerce.date(),
      category: z.string().optional(),
      description: z.string().optional(),
      thumbnail: image().optional(),
    }),
});

export const collections = { news };
