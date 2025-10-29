export default () => {
  const TARGET_SEL = "[data-anime]";
  const FOUND_CLASS = "is-found";

  const targets = document.querySelectorAll(TARGET_SEL);
  if (!targets.length) return;

  const enterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        if (entry.target.dataset.anime.trim() !== "") {
          entry.target.classList.add(FOUND_CLASS);
          return;
        }
        const children = entry.target.querySelectorAll(TARGET_SEL);
        children.forEach((el) => el.classList.add(FOUND_CLASS));
      });
    },
    {
      root: null,
      rootMargin: "0px 0px -30% 0px", // どれくらいで表示するか
      threshold: 0,
    }
  );

  // 表示を外れたとき
  const exitObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) return;

        if (entry.target.dataset.anime.trim() !== "") {
          entry.target.classList.remove(FOUND_CLASS);
          return;
        }

        const founds = entry.target.querySelectorAll(`${TARGET_SEL}.${FOUND_CLASS}`);
        founds.forEach((el) => el.classList.remove(FOUND_CLASS));
      });
    },
    {
      root: null,
      rootMargin: "0px",
      threshold: 0,
    }
  );

  targets.forEach((t) => {
    enterObserver.observe(t);
    exitObserver.observe(t);
  });

  document.body.classList.add(FOUND_CLASS);
};
