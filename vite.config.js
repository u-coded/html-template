import { defineConfig } from "vite";
import { resolve } from "path";
import viteHandlebars from "vite-plugin-handlebars";
import handlebars from "handlebars";
import sharp from "sharp";
import fs from "fs";
import path from "path";

import { newsList } from "./data/news-list"; // newsListのインポート

// カスタムヘルパー
handlebars.registerHelper("eq", (val1, val2) => val1 === val2);
handlebars.registerHelper("notEq", (val1, val2) => val1 !== val2);
handlebars.registerHelper("or", (val1, val2) => val1 || val2);
handlebars.registerHelper("and", (val1, val2) => val1 && val2);
handlebars.registerHelper("limit", function (arr, limit) {
  if (!Array.isArray(arr)) {
    return [];
  }
  return arr.slice(0, limit);
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
    siteData,
    newsList,
    path: "",
    pageSlug: "index",
    pageTitle: "トップページ",
  },
  "/about/index.html": {
    siteData,
    path: "../",
    pageSlug: "about",
    pageTitle: "このテンプレについて",
  },
  "/about/child/index.html": {
    siteData,
    path: "../../",
    pageSlug: "about-child",
    pageTitle: "このテンプレについての子ページ",
    parentPageTitle: "このテンプレについて",
  },
  "/contact/index.html": {
    siteData,
    path: "../",
    pageSlug: "contact",
    pageTitle: "お問い合わせ",
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

/**
 * build時にwebPを自動生成する自作プラグイン
 */
function sharpWebpPlugin({ srcDir, outDir, quality = 80 }) {
  return {
    name: "sharp-webp-plugin",
    apply: "build",
    enforce: "post",
    async closeBundle() {
      const publicDir = path.resolve(srcDir, "public");
      const supportedFormats = [".jpg", ".jpeg", ".png"];

      // 画像の変換処理関数
      async function processImages(dir) {
        const files = await fs.promises.readdir(dir, { withFileTypes: true });

        await Promise.all(
          files.map(async (file) => {
            const filePath = path.join(dir, file.name);

            // publicディレクトリを除外
            if (filePath.startsWith(publicDir)) return;

            if (file.isDirectory()) {
              // ディレクトリの場合は再帰処理
              await processImages(filePath);
            } else {
              const ext = path.extname(file.name).toLowerCase();

              // JPGまたはPNGファイルの場合のみ変換
              if (supportedFormats.includes(ext)) {
                const outputFilePath = filePath
                  .replace(srcDir, outDir)
                  .replace(ext, ".webp");
                try {
                  // outDir内にWebPを出力
                  await sharp(filePath)
                    .webp({ quality }) // 引数で指定された圧縮率を使用
                    .toFile(outputFilePath);

                  // outDir内の元の画像ファイルを削除
                  const originalOutPath = filePath.replace(srcDir, outDir);
                  if (fs.existsSync(originalOutPath)) {
                    await fs.promises.unlink(originalOutPath);
                  }
                } catch (error) {
                  console.error(`Error converting ${filePath}:`, error);
                }
              }
            }
          })
        );
      }

      // HTMLファイルのWebPパス変換関数
      async function updateHtmlToWebp(dir) {
        const files = await fs.promises.readdir(dir, { withFileTypes: true });

        await Promise.all(
          files.map(async (file) => {
            const filePath = path.join(dir, file.name);

            if (file.isDirectory()) {
              // ディレクトリの場合は再帰処理
              await updateHtmlToWebp(filePath);
            } else if (file.name.endsWith(".html")) {
              let content = fs.readFileSync(filePath, "utf-8");

              // src属性、srcset属性、url()内のパスをWebPに変換（元の拡張子を削除）
              content = content.replace(
                /((?:src|srcset|url\()=["']?)(?!\/?public\/)([^"')]+)\.(jpg|jpeg|png)/g,
                "$1$2.webp"
              );

              fs.writeFileSync(filePath, content);
            }
          })
        );
      }

      // srcディレクトリ内の画像を変換
      await processImages(srcDir);

      // outDirディレクトリ内のHTMLファイルのパスを更新
      await updateHtmlToWebp(outDir);
    },
  };
}

export default defineConfig({
  base: "./",
  root: "./src", // 開発ディレクトリ設定
  build: {
    outDir: "../dist/", // 出力場所の指定
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          let extType =
            assetInfo.names && assetInfo.names.length > 0
              ? assetInfo.names[0].split(".").pop()
              : "";
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webmanifest/i.test(extType)) {
            extType = "images";
          }
          if (extType === "images") {
            let assetPath =
              assetInfo.originalFileNames &&
              assetInfo.originalFileNames.length > 0
                ? assetInfo.originalFileNames[0]
                : "";
            if (!assetPath) return ""; // assetPath が空の場合も空文字を返す
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
    sharpWebpPlugin({
      srcDir: path.resolve(__dirname, "./src"),
      outDir: path.resolve(__dirname, "./dist"), // 出力ディレクトリ
      quality: 80, // 圧縮率
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
