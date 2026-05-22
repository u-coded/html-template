// ページトップボタン：スクロール位置に応じて表示／非表示、フッター位置で吸い付き

export default () => {
  const PAGE_TOP_SEL = '[data-page-top]';
  const HIDE_SEL = '[data-page-top-hide]';
  const STOP_SEL = '[data-page-top-stop]';

  const pageTop = document.querySelector(PAGE_TOP_SEL);
  const hide = document.querySelector(HIDE_SEL);
  const stop = document.querySelector(STOP_SEL);

  const SHOW_CLASS = 'is-show';
  const STOP_CLASS = 'is-stop';

  if (!pageTop || !hide || !stop) return;

  // 指定した要素の半分過ぎたら表示
  const pageTopShowObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          pageTop.classList.remove(SHOW_CLASS);
        } else {
          pageTop.classList.add(SHOW_CLASS);
        }
      });
    },
    {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    },
  );

  pageTopShowObserver.observe(hide);

  // 指定した要素が見えたら固定
  const pageTopStopObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          pageTop.classList.add(STOP_CLASS);
        } else {
          pageTop.classList.remove(STOP_CLASS);
        }
      });
    },
    {
      root: null,
      rootMargin: '-99% 0px 0px 0px',
      threshold: 0,
    },
  );

  pageTopStopObserver.observe(stop);
};
