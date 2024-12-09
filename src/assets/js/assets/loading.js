import scrollAnimation from "./scroll_animation.js";

const body = document.body;
const loading = document.querySelector("[data-loading]");

const LOADED_CLASS = "is-loaded";

/**
 * ローディング画面を表示時に背景を固定する関数
 */
export const loadingSet = () => {
  if (!loading) {
    return;
  }

  // ローディング中は画面固定
  body.style.overflow = "hidden";
};

/**
 * ローディング画面を非表示にする関数
 */
export const loadingHide = () => {
  if (!loading || loading.classList.contains(LOADED_CLASS)) {
    scrollAnimation();
    return;
  }

  loading.classList.add(LOADED_CLASS);

  scrollAnimation();

  body.style.overflow = null;

  setTimeout(() => {
    loading.remove();
  }, 1000);
};
