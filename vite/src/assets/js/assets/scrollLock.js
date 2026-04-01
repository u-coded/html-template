export default () => {
  let savedY = 0;

  const docEl = document.documentElement;
  const LOCKED_CLASS = "is-scroll-locked";

  const lock = () => {
    if (document.documentElement.classList.contains(LOCKED_CLASS)) return;
    savedY = window.scrollY || window.pageYOffset || 0;
    docEl.style.top = `-${savedY}px`;
    docEl.classList.add(LOCKED_CLASS);
  };

  const unlock = () => {
    if (!docEl.classList.contains(LOCKED_CLASS)) return;
    const y = Math.abs(parseInt(docEl.style.top || "0", 10)) || 0;
    docEl.classList.remove(LOCKED_CLASS);
    docEl.style.top = "";
    window.scrollTo(0, y);
  };

  return { lock, unlock };
};
