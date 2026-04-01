import scrollAnimation from "./scrollAnimation.js";
import scrollLock from "./scrollLock.js";

const loading = document.querySelector("[data-loading]");

const LOADED_CLASS = "is-loaded";
const lock = scrollLock();

/**
 * ローディング画面を表示時に背景を固定する関数
 */
export const loadingSet = () => {
  if (!loading) {
    return;
  }

  // ローディング中は画面固定
  lock.lock();
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

  // スクロールを有効化
  lock.unlock();

  setTimeout(() => {
    loading.remove();
  }, 1000);
};
