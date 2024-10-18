import { defineConfig } from "vite";
import { resolve } from "path";
import viteHandlebars from "vite-plugin-handlebars";
import handlebars from "handlebars";
import viteImagemin from "vite-plugin-imagemin";
import fs from "fs";
import path from "path";

import { newsList } from "./data/news-list";

/**
 * カスタムヘルパー
 */
handlebars.registerHelper("eq", function (val1, val2) {
  return val1 === val2;
});
handlebars.registerHelper("or", function (val1, val2) {
  return val1 || val2;
});
handlebars.registerHelper("and", function (val1, val2) {
  return val1 && val2;
});

/**
 * サイトの共通情報
 */
const siteData = {
  siteName: "HTMLテンプレ",
  siteDesc: "ディスクリプションを入力",
  siteKwd: "キーワード1,キーワード2",
  siteCanonical: "https://xxxxx/",
};

/**
 * ページ別の情報
 */
const pageData = {
  "/index.html": {
    siteData: { ...siteData },
    newsList: { ...newsList },
    path: "",
    pageSlug: "index",
    pageTitle: "トップページ",
  },
  "/about/index.html": {
    siteData: { ...siteData },
    path: "../",
    pageSlug: "about",
    pageTitle: "このテンプレについて",
  },
  "/about/child/index.html": {
    siteData: { ...siteData },
    path: "../../",
    pageSlug: "about-child",
    pageTitle: "このテンプレについての子ページ",
    parentPageTitle: "このテンプレについて",
  },
};

/**
 * HTMLファイルの出力を自動化
 */
const files = [];

// ディレクトリを再帰的に読み込み、HTMLファイルを収集
function readDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);

  items.forEach((item) => {
    const itemPath = path.join(dirPath, item);
    const isDirectory = fs.statSync(itemPath).isDirectory();

    if (isDirectory) {
      // partsディレクトリをスキップ
      if (item !== "parts") readDirectory(itemPath);
    } else if (path.extname(itemPath) === ".html") {
      collectHtmlFile(dirPath, itemPath);
    }
  });
}

// HTMLファイル情報を収集し、files配列に追加
function collectHtmlFile(dirPath, filePath) {
  const name = generateFileName(dirPath, filePath);
  const relativePath = path.relative(path.resolve(__dirname, "src"), filePath);
  files.push({ name, path: `/${relativePath}` });
}

// ファイル名を生成
function generateFileName(dirPath, filePath) {
  if (dirPath === path.resolve(__dirname, "src")) {
    return path.parse(filePath).name;
  }

  const relativeDir = path.relative(path.resolve(__dirname, "src"), dirPath);
  const dirName = relativeDir.replace(/\//g, "_");
  return `${dirName}_${path.parse(filePath).name}`;
}

// ファイル情報を元にinputFilesオブジェクトを生成
function createInputFiles(files) {
  const inputFiles = {};
  files.forEach(({ name, path: filePath }) => {
    inputFiles[name] = path.resolve(__dirname, "./src" + filePath);
  });
  return inputFiles;
}

// 実行部分
readDirectory(path.resolve(__dirname, "src"));
const inputFiles = createInputFiles(files);

export default defineConfig({
  base: "./",
  root: "./src", // 開発ディレクトリ設定
  build: {
    outDir: "../dist/", // 出力場所の指定
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split(".")[1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webmanifest/i.test(extType)) {
            extType = "images";
          }
          if (extType === "images") {
            let assetPath = assetInfo.originalFileName; // フルパスを取得
            let startIndex = assetPath.indexOf("images/");
            if (startIndex === -1) return ""; // images/が見つからない場合は空文字を返す
            let endIndex = assetPath.lastIndexOf("/");
            let imgDir = assetPath.substring(startIndex, endIndex);
            return `assets/${imgDir}/[name][extname]`;
          }
          if (extType === "css") {
            return `assets/${extType}/style.css`;
          }
          return `assets/${extType}/[name][extname]`;
        },
        chunkFileNames: "assets/js/script.js",
        // entryFileNames: 'assets/js/script.js', // 下層あるときはコメントアウトする？
      },
      input: inputFiles,
    },
    assetsInlineLimit: 0, // base64 URL としてインライン化しない
    minify: false,
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
    },
  },
  plugins: [
    viteImagemin({
      pngquant: {
        quality: [0.8, 0.9],
        speed: 1, // 1～11
      },
      optipng: {
        optimizationLevel: 3, // 0～7
      },
      mozjpeg: {
        quality: 80, // 0～100
      },
      gifsicle: {
        optimizationLevel: 3, // 1～3
      },
      svgo: {},
      root: "src/assets/images",
      verbose: true,
    }),
    viteHandlebars({
      // コンポーネントの格納ディレクトリ
      partialDirectory: resolve(__dirname, "./src/parts"),
      context(pagePath) {
        return pageData[pagePath];
      },
    }),
  ],
});
