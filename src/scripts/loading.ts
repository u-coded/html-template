// TOPページのローディング画面：表示／非表示の制御

import scrollAnimation from './scrollAnimation';
import scrollLock from './utils/scrollLock';

const LOADING_SEL = '[data-loading]';
const LOADED_CLASS = 'is-loaded';
const locker = scrollLock();

/**
 * ローディング画面を表示時に背景を固定する関数
 */
export const loadingSet = () => {
  const loading = document.querySelector(LOADING_SEL);
  if (!loading) {
    return;
  }

  // ローディング中は画面固定
  locker.lock();
};

/**
 * ローディング画面を非表示にする関数
 */
export const loadingHide = () => {
  const loading = document.querySelector(LOADING_SEL);
  if (!loading || loading.classList.contains(LOADED_CLASS)) {
    scrollAnimation();
    return;
  }

  loading.classList.add(LOADED_CLASS);

  scrollAnimation();

  // スクロールを有効化
  locker.unlock();

  setTimeout(() => {
    loading.remove();
  }, 1000);
};
