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

## 使用法など

- css でサイズの指定は、px を vw に変換する関数`f.vw(xx)`を用意しているのでこれを使うと良い
- `src/images/` 以下の画像は自動圧縮される
- 圧縮したくない場合は`public/`以下に入れる
