// Astro設定：パスエイリアス／フォント／Vercelアダプター／sitemap
// site URLは sitemap 生成・正規URLとして使われる

// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import path from 'path';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://fujishima-mfg.example.com',
  output: 'static',
  adapter: vercel(),
  integrations: [sitemap()],
  vite: {
    resolve: {
      alias: {
        '@': path.resolve('./src'),
      },
    },
  },
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
