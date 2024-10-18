export default () => {
	const nav = document.querySelector("[data-nav]");
	const trigger = document.querySelector("[data-nav-trigger]");
	const overlay = document.querySelector("[data-nav-overlay]");
	const navAnchors = nav.querySelectorAll("a");

	const OPEN_CLASS = "is-open";

	// ナビを開閉する関数
	const toggleNav = () => {
		nav.classList.toggle(OPEN_CLASS);
		trigger.classList.toggle(OPEN_CLASS);
		overlay.classList.toggle(OPEN_CLASS);
	};

	// ハンバーガーボタンをクリックしたとき
	trigger.addEventListener("click", () => {
		toggleNav();
	});

	// オーバーレイをクリックしたとき
	overlay.addEventListener("click", () => {
		if (nav.classList.contains(OPEN_CLASS)) {
			toggleNav();
		}
	});

	// ページ内リンクのとき閉じる
	navAnchors.forEach((anchor) => {
		anchor.addEventListener("click", () => {
			if (nav.classList.contains(OPEN_CLASS)) {
				toggleNav();
			}
		});
	});

	// オーバーレイにフォーカスが当たるとハンバーガーボタンににフォーカスを戻す
	overlay.addEventListener("focus", () => {
		trigger.focus();
	});
};
