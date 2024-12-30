export default () => {
  const body = document.body;
  const nav = document.querySelector("[data-nav]");
  const trigger = document.querySelector("[data-nav-trigger]");
  const overlay = document.querySelector("[data-nav-overlay]");
  const navAnchors = nav.querySelectorAll("a");

  const OPEN_CLASS = "is-open";

  // ナビを開く関数
  const openNav = () => {
    if (!nav.classList.contains(OPEN_CLASS)) {
      nav.classList.add(OPEN_CLASS);
      trigger.classList.add(OPEN_CLASS);
      overlay.classList.add(OPEN_CLASS);

      // スクロールを無効化
      body.style.overflow = "hidden";
      body.style.height = "100vh";

      // aria属性の更新
      trigger.setAttribute("aria-expanded", "true");
      nav.setAttribute("aria-hidden", "false");
      overlay.setAttribute("aria-hidden", "false");
    }
  };

  // ナビを閉じる関数
  const closeNav = () => {
    if (nav.classList.contains(OPEN_CLASS)) {
      nav.classList.remove(OPEN_CLASS);
      trigger.classList.remove(OPEN_CLASS);
      overlay.classList.remove(OPEN_CLASS);

      // スクロールを有効化
      body.style.overflow = "";
      body.style.height = "";

      // aria属性の更新
      trigger.setAttribute("aria-expanded", "false");
      nav.setAttribute("aria-hidden", "true");
      overlay.setAttribute("aria-hidden", "true");
    }
  };

  // ハンバーガーボタンをクリックしたとき
  trigger.addEventListener("click", () => {
    const isExpanded = trigger.getAttribute("aria-expanded") === "true";
    if (isExpanded) {
      closeNav();
    } else {
      openNav();
    }
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
};
