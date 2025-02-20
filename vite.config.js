import { defineConfig } from "vite";
import { resolve } from "path";
import viteHandlebars from "vite-plugin-handlebars";
import handlebars from "handlebars";
import sharp from "sharp";
import fs from "fs";
import path from "path";

// カスタムヘルパー
handlebars.registerHelper("eq", (val1, val2) => val1 === val2);
handlebars.registerHelper("notEq", (val1, val2) => val1 !== val2);
handlebars.registerHelper("or", (val1, val2) => val1 || val2);
handlebars.registerHelper("and", (val1, val2) => val1 && val2);

// 配列を指定件数分回す
// 例：articlesを3件ループ {{#each (limit articles 3)}} <p>{{date}}</p><p>{{title}}</p>  {{/each}}
handlebars.registerHelper("limit", function (arr, limit) {
  if (!Array.isArray(arr)) {
    return [];
  }
  return arr.slice(0, limit);
});

// 指定回数分繰り返す
// 例：3件繰り返し {{#times 3}} <p>テキスト</p> {{/times}}
handlebars.registerHelper("times", function (n, block) {
  let result = "";
  for (let i = 0; i < n; i++) {
    result += block.fn(i);
  }
  return result;
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
    path: "",
    pageSlug: "index",
    pageUrl: "",
    pageTitle: "トップページ",
  },
  "/about/index.html": {
    siteData,
    path: "../",
    pageSlug: "about",
    pageUrl: "about",
    pageTitle: "このテンプレについて",
  },
  "/news/index.html": {
    siteData,
    path: "../",
    pageSlug: "news",
    pageUrl: "news",
    pageTitle: "お知らせ",
  },
  "/news/article/index.html": {
    siteData,
    path: "../../",
    pageSlug: "news-article",
    pageUrl: "news/article",
    pageTitle: "記事タイトル",
    parentPageUrl: "news",
    parentPageTitle: "お知らせ",
  },
  "/contact/index.html": {
    siteData,
    path: "../",
    pageSlug: "contact",
    pageUrl: "contact",
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
 * build時にWebPを自動生成する自作プラグイン
 */
function sharpWebpPlugin({ srcDir, outDir, quality = 80 }) {
  let publicImages = new Set(); // public 内の画像リスト

  return {
    name: "sharp-webp-plugin",
    apply: "build",
    enforce: "post",

    async closeBundle() {
      const publicDir = path.resolve(srcDir, "public");
      const supportedFormats = [".jpg", ".jpeg", ".png"];

      // public 内の画像リストを取得
      async function collectPublicImages(dir) {
        const files = await fs.promises.readdir(dir, { withFileTypes: true });

        await Promise.all(
          files.map(async (file) => {
            const filePath = path.join(dir, file.name);

            if (file.isDirectory()) {
              await collectPublicImages(filePath);
            } else {
              const ext = path.extname(file.name).toLowerCase();
              if (supportedFormats.includes(ext)) {
                const relativePath = path.relative(publicDir, filePath).replace(/\\/g, "/");
                publicImages.add(relativePath);
              }
            }
          })
        );
      }

      // HTML 内の画像パスを WebP に変換（public 内の画像はそのまま）
      async function updateHtmlToWebp(dir) {
        const files = await fs.promises.readdir(dir, { withFileTypes: true });

        await Promise.all(
          files.map(async (file) => {
            const filePath = path.join(dir, file.name);

            if (file.isDirectory()) {
              await updateHtmlToWebp(filePath);
            } else if (file.name.endsWith(".html")) {
              let content = fs.readFileSync(filePath, "utf-8");

              content = content.replace(/((?:src|srcset|url\()=["']?)([^"')]+\.(jpg|jpeg|png))/g, (match, prefix, imgPath) => {
                let normalizedPath = imgPath.replace(/^\.?\//, "").replace(/\\/g, "/");
                let possiblePublicPath = normalizedPath.replace(/^public\//, "");

                if (publicImages.has(possiblePublicPath)) {
                  return match; // public 内の画像は変更しない
                }

                return `${prefix}${imgPath.replace(/\.(jpg|jpeg|png)$/, ".webp")}`;
              });

              fs.writeFileSync(filePath, content);
            }
          })
        );
      }

      // public 内の画像リストを収集
      await collectPublicImages(publicDir);

      // HTML のパスを変換（public 内の画像はそのまま）
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
          let extType = assetInfo.names && assetInfo.names.length > 0 ? assetInfo.names[0].split(".").pop() : "";
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webmanifest/i.test(extType)) {
            extType = "images";
          }
          if (extType === "images") {
            let assetPath = assetInfo.originalFileNames && assetInfo.originalFileNames.length > 0 ? assetInfo.originalFileNames[0] : "";
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
        // entryFileNames: "assets/js/script.js", // 下層あるときはコメントアウトする
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
