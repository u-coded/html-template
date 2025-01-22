/**
 * デバウンス処理を行いつつ、最初の呼び出し時には即時実行する
 * @param {Function} func - 遅延実行する関数
 * @param {number} delay - 遅延時間 (ミリ秒)
 */
export const debounce = (func, delay) => {
  let timeoutId;

  const debouncedFunction = () => {
    if (timeoutId) clearTimeout(timeoutId);

    // 最初の呼び出しを即時実行
    if (!timeoutId) func();

    // 次回以降の呼び出しを遅延実行
    timeoutId = setTimeout(() => {
      func();
      timeoutId = null; // タイマーリセット
    }, delay);
  };

  // デバウンス関数をリサイズイベントに直接登録
  window.addEventListener("resize", debouncedFunction);
};
