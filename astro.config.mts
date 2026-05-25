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
  // 東京リージョン（hnd1）で関数を実行：日本からのアクセスのレイテンシ削減
  adapter: vercel({ regions: ['hnd1'] }),
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
