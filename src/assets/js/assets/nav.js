import { debounce } from "./debounce";
import scrollLock from "./scrollLock";

export default () => {
  const nav = document.querySelector("[data-nav]");
  const trigger = document.querySelector("[data-nav-trigger]");
  const overlay = document.querySelector("[data-nav-overlay]");
  const navAnchors = nav.querySelectorAll("a");

  const OPEN_CLASS = "is-open";
  const DESKTOP_BREAKPOINT = 744;

  const locker = scrollLock();

  // ナビを開く関数
  const openNav = () => {
    if (!nav.classList.contains(OPEN_CLASS)) {
      nav.classList.add(OPEN_CLASS);
      trigger.classList.add(OPEN_CLASS);
      overlay.classList.add(OPEN_CLASS);

      // aria属性の更新
      trigger.setAttribute("aria-expanded", "true");
      nav.setAttribute("aria-hidden", "false");
      overlay.setAttribute("aria-hidden", "false");

      // スクロールを無効化
      locker.lock();
    }
  };

  // ナビを閉じる関数
  const closeNav = () => {
    if (nav.classList.contains(OPEN_CLASS)) {
      nav.classList.remove(OPEN_CLASS);
      trigger.classList.remove(OPEN_CLASS);
      overlay.classList.remove(OPEN_CLASS);

      // aria属性の更新
      trigger.setAttribute("aria-expanded", "false");
      nav.setAttribute("aria-hidden", "true");
      overlay.setAttribute("aria-hidden", "true");

      // スクロールを有効化
      locker.unlock();
    }
  };

  // ハンバーガーボタンをクリックしたとき
  trigger.addEventListener("click", () => {
    const isExpanded = trigger.getAttribute("aria-expanded") === "true";
    isExpanded ? closeNav() : openNav();
  });

  // オーバーレイをクリックしたとき
  overlay.addEventListener("click", () => {
    closeNav();
  });

  // ページ内リンクをクリックしたときメニューを閉じる
  navAnchors.forEach((anchor) => {
    anchor.addEventListener("click", () => {
      closeNav();
    });
  });

  // オーバーレイにフォーカスが当たるとハンバーガーボタンにフォーカスを戻す
  overlay.addEventListener("focus", () => {
    trigger.focus();
  });

  // ウィンドウサイズに応じてナビゲーションの状態を更新
  const updateNavState = () => {
    if (window.innerWidth >= DESKTOP_BREAKPOINT) {
      // デスクトップの場合: ナビゲーションを常に表示
      nav.classList.remove(OPEN_CLASS);
      trigger.classList.remove(OPEN_CLASS);
      overlay.classList.remove(OPEN_CLASS);

      nav.setAttribute("aria-hidden", "false");
      trigger.setAttribute("aria-expanded", "false");
      overlay.setAttribute("aria-hidden", "true");

      locker.unlock();
    } else {
      // モバイルの場合: 現在の状態を維持しつつ属性を適切に更新
      const isOpen = nav.classList.contains(OPEN_CLASS);
      nav.setAttribute("aria-hidden", isOpen ? "false" : "true");
      trigger.setAttribute("aria-expanded", String(isOpen));
      overlay.setAttribute("aria-hidden", String(!isOpen));
    }
  };

  debounce(updateNavState, 100);
};
