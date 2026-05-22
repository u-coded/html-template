// グローバルナビ：SP時のハンバーガー開閉とリサイズ対応

import { debounce } from './utils/debounce';
import scrollLock from './utils/scrollLock';

export default () => {
  const NAV_SEL = '[data-nav]';
  const TRIGGER_SEL = '[data-nav-trigger]';
  const OVERLAY_SEL = '[data-nav-overlay]';

  const nav = document.querySelector(NAV_SEL);
  const trigger = document.querySelector(TRIGGER_SEL);
  const overlay = document.querySelector(OVERLAY_SEL);

  if (!nav || !trigger || !overlay) return;

  const navAnchors = nav.querySelectorAll<HTMLAnchorElement>('a');

  const OPEN_CLASS = 'is-open';
  const DESKTOP_BREAKPOINT = 744;

  const locker = scrollLock();

  // ナビを開く関数
  const openNav = () => {
    if (!nav.classList.contains(OPEN_CLASS)) {
      nav.classList.add(OPEN_CLASS);
      trigger.classList.add(OPEN_CLASS);
      overlay.classList.add(OPEN_CLASS);

      trigger.setAttribute('aria-expanded', 'true');
      nav.setAttribute('aria-hidden', 'false');
      overlay.setAttribute('aria-hidden', 'false');

      locker.lock();
    }
  };

  // ナビを閉じる関数
  const closeNav = () => {
    if (nav.classList.contains(OPEN_CLASS)) {
      nav.classList.remove(OPEN_CLASS);
      trigger.classList.remove(OPEN_CLASS);
      overlay.classList.remove(OPEN_CLASS);

      trigger.setAttribute('aria-expanded', 'false');
      nav.setAttribute('aria-hidden', 'true');
      overlay.setAttribute('aria-hidden', 'true');

      locker.unlock();
    }
  };

  // ハンバーガーボタンをクリックしたとき
  trigger.addEventListener('click', () => {
    const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
    isExpanded ? closeNav() : openNav();
  });

  // オーバーレイをクリックしたとき
  overlay.addEventListener('click', () => {
    closeNav();
  });

  // ページ内リンクをクリックしたときメニューを閉じる
  navAnchors.forEach((anchor) => {
    anchor.addEventListener('click', () => {
      closeNav();
    });
  });

  // オーバーレイにフォーカスが当たるとハンバーガーボタンにフォーカスを戻す
  overlay.addEventListener('focus', () => {
    (trigger as HTMLElement).focus();
  });

  // ウィンドウサイズに応じてナビゲーションの状態を更新
  const updateNavState = () => {
    if (window.innerWidth >= DESKTOP_BREAKPOINT) {
      nav.classList.remove(OPEN_CLASS);
      trigger.classList.remove(OPEN_CLASS);
      overlay.classList.remove(OPEN_CLASS);

      nav.setAttribute('aria-hidden', 'false');
      trigger.setAttribute('aria-expanded', 'false');
      overlay.setAttribute('aria-hidden', 'true');

      locker.unlock();
    } else {
      const isOpen = nav.classList.contains(OPEN_CLASS);
      nav.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
      trigger.setAttribute('aria-expanded', String(isOpen));
      overlay.setAttribute('aria-hidden', String(!isOpen));
    }
  };

  updateNavState();
  debounce(updateNavState, 100);
};
