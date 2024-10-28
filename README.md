# html-template

Vite の 静的 HTML コーディング環境

## 導入

```
npm install
```

## 実行

```
npm run dev
```

## ビルド

```
npm run build
```

## 注意点など

- テンプレートエンジンは handlebars を使用している
- css でサイズの指定は、px を vw に変換する関数`f.vw(xx)`を用意しているのでこれを使うと良い
- `src/images/` 以下の jpg,png 画像は自動で webp になる（html のパスも書き変わる）
- webp にしたくない場合は`src/public/`以下に入れる
