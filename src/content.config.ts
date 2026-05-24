// Content Collections のスキーマ定義
// src/content/news/*.md がここで検証される。microCMSへ切替時は loader を差し替える

import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const news = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    category: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const collections = { news };
