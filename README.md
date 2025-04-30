# html-template

Vite の 静的 HTML コーディング環境

## コマンド

`npm install` 依存関係をインストール
`npm run dev` ローカルサーバーを起動
`npm run build` ビルド
`npm run preview` ビルドをローカルでプレビュー

## 注意点など

- node.js のバージョンは新しければ大丈夫なはず
- テンプレートエンジンは handlebars を使用している
- サイズをデザインサイズに応じた vw で指定する場合は、px を vw に変換する関数`f.v(xx)`を用意しているのでこれを使うと良い
- `src/images/` 以下の jpg,png 画像は自動で webp になる（html のパスも書き変わる）
- webp にしたくない画像は`src/public/`以下に入れる
