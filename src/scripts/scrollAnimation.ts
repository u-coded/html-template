// スクロールアニメーション：data-anime 要素を IntersectionObserver で監視し、画面内に入ったらクラス付与
// SPA遷移で再呼び出しされても累積しないよう、前回のobserverをdisconnectしてから再生成する

let enterObserver: IntersectionObserver | null = null;
let exitObserver: IntersectionObserver | null = null;

export default () => {
  // 前回のobserverを切断（SPA遷移時の累積防止）
  enterObserver?.disconnect();
  exitObserver?.disconnect();

  const TARGET_SEL = '[data-anime]';
  const FOUND_CLASS = 'is-found';

  const targets = document.querySelectorAll(TARGET_SEL);
  if (!targets.length) return;

  enterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const target = entry.target as HTMLElement;
        if (target.dataset.anime?.trim() !== '') {
          target.classList.add(FOUND_CLASS);
          return;
        }
        const children = target.querySelectorAll(TARGET_SEL);
        children.forEach((el) => el.classList.add(FOUND_CLASS));
      });
    },
    {
      root: null,
      rootMargin: '0px 0px -30% 0px', // どれくらいで表示するか
      threshold: 0,
    },
  );

  // 表示を外れたとき
  exitObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) return;

        const target = entry.target as HTMLElement;
        if (target.dataset.anime?.trim() !== '') {
          target.classList.remove(FOUND_CLASS);
          return;
        }

        const founds = target.querySelectorAll(`${TARGET_SEL}.${FOUND_CLASS}`);
        founds.forEach((el) => el.classList.remove(FOUND_CLASS));
      });
    },
    {
      root: null,
      rootMargin: '0px',
      threshold: 0,
    },
  );

  targets.forEach((t) => {
    enterObserver?.observe(t);
    exitObserver?.observe(t);
  });
};
