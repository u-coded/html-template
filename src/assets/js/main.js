import { loadingSet, loadingHide } from "./assets/loading.js";
import nav from "./assets/nav.js";
import smoothScroll from "./assets/smoothScroll.js";
import pageTop from "./assets/pageTop.js";
import modal from "./assets/modal.js";

import index from "./scenes/index.js";
import about from "./scenes/about.js";

// bodyのid
const bodyId = document.body.getAttribute("id");

// DOM読み込み後
const domLoad = () => {
  loadingSet();

  // ページの読み込みが遅すぎるときの最大時間
  setTimeout(() => {
    loadingHide();
  }, 5000);
};

// ページ読み込み後
const pageLoaded = () => {
  loadingHide();
  nav();
  smoothScroll();
  pageTop();
  modal();

  // ページ別のJSを実行
  switch (bodyId) {
    case "index":
      index();
      break;
    case "about":
      about();
      break;
  }
};

// イベント宣言
if (document.readyState !== "loading") {
  domLoad();
} else {
  document.addEventListener("DOMContentLoaded", domLoad, false);
}
window.addEventListener("load", pageLoaded, false);
