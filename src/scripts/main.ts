import { loadingSet, loadingHide } from './assets/loading.ts';
// import nav from './assets/nav.ts';
// import smoothScroll from './assets/smoothScroll.ts';
// import pageTop from './assets/pageTop.ts';
// import modal from './assets/modal.ts';

// DOM読み込み後
const domLoad = () => {
  loadingSet();

  // ページの読み込みが遅すぎるときの最大時間
  setTimeout(() => loadingHide(), 5000);
};

// ページ読み込み後
const pageLoaded = () => {
  loadingHide();
  // nav();
  // smoothScroll();
  // pageTop();
  // modal();
};

if (document.readyState !== 'loading') {
  domLoad();
} else {
  document.addEventListener('DOMContentLoaded', domLoad, false);
}
window.addEventListener('load', pageLoaded, false);
