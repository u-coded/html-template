#!/usr/bin/env node
/**
 * コミット時にステージされたファイル内の康熙部首（U+2F00–U+2FD5）を
 * 対応するCJK統合漢字に自動変換する。
 * Unicode EquivalentUnifiedIdeograph に基づく。
 */

import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
// 康熙部首 U+2F00..U+2FD5 の順に対応CJKのコードポイントが並ぶ配列（Unicode EquivalentUnifiedIdeograph）
const KANGXI_CJK_MAP = require("./kangxi-radical-map.json");
const KANGXI_START = 0x2f00;
const KANGXI_END = 0x2fd5;

const TEXT_EXTENSIONS = new Set([
  ".html", ".htm", ".js", ".mjs", ".cjs", ".ts", ".jsx", ".tsx",
  ".css", ".scss", ".sass", ".md", ".json", ".txt", ".xml", ".svg",
  ".yaml", ".yml", ".handlebars", ".hbs",
]);

/**
 * 康熙部首をCJK漢字に変換する
 */
function convertKangxiToCJK(text) {
  return [...text]
    .map((char) => {
      const codePoint = char.codePointAt(0);
      if (codePoint >= KANGXI_START && codePoint <= KANGXI_END) {
        const cjk = KANGXI_CJK_MAP[codePoint - KANGXI_START];
        if (cjk != null) return String.fromCodePoint(cjk);
      }
      return char;
    })
    .join("");
}

/**
 * ステージされたファイル一覧を取得
 */
function getStagedFiles() {
  try {
    const out = execSync("git diff --cached --name-only", {
      encoding: "utf-8",
    });
    return out.trim() ? out.trim().split("\n") : [];
  } catch {
    return [];
  }
}

/**
 * テキストファイルとして変換対象かどうか
 */
function isConvertibleFile(path) {
  const ext = path.slice(path.lastIndexOf(".")).toLowerCase();
  return TEXT_EXTENSIONS.has(ext);
}

function main() {
  const staged = getStagedFiles();
  const toConvert = staged.filter(isConvertibleFile);
  let changedCount = 0;

  for (const file of toConvert) {
    try {
      const content = readFileSync(file, "utf-8");
      const converted = convertKangxiToCJK(content);
      if (content !== converted) {
        writeFileSync(file, converted, "utf-8");
        execSync("git", ["add", file], { stdio: "inherit" });
        changedCount += 1;
        console.log(`[kangxi-convert] 変換: ${file}`);
      }
    } catch (err) {
      console.error(`[kangxi-convert] エラー ${file}:`, err.message);
      process.exit(1);
    }
  }

  if (changedCount > 0) {
    console.log(`[kangxi-convert] ${changedCount} ファイルを康熙部首→CJKに変換し、再ステージしました。`);
  }

  process.exit(0);
}

main();
