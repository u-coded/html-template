// アンカーリンク（#xxx）のスムーズスクロール（固定ヘッダー高分のオフセット込み）

export default () => {
  const TRIGGER_SEL = 'a[href^="#"]';
  const HEADER_SEL = '[data-header]';

  const triggers = document.querySelectorAll<HTMLAnchorElement>(TRIGGER_SEL);
  const header = document.querySelector<HTMLElement>(HEADER_SEL);

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const href = trigger.getAttribute('href');
      if (!href) return;

      let position: number;

      // ページトップのとき
      if (href === '#top') {
        position = 0;
      } else {
        const target = document.getElementById(href.replace('#', ''));
        if (!target) return;

        const rect = target.getBoundingClientRect().top + window.scrollY;
        const headerHeight = header?.clientHeight ?? 0;
        position = rect - headerHeight;
      }

      window.scrollTo({
        top: position,
        behavior: 'smooth',
      });
    });
  });
};
