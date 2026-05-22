// デバウンス：連続呼び出しを抑制（初回は即時実行）

export const debounce = (func: () => void, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const debouncedFunction = () => {
    if (timeoutId) clearTimeout(timeoutId);

    // 最初の呼び出しを即時実行
    if (!timeoutId) func();

    // 次回以降の呼び出しを遅延実行
    timeoutId = setTimeout(() => {
      func();
      timeoutId = null;
    }, delay);
  };

  // デバウンス関数をリサイズイベントに直接登録
  window.addEventListener('resize', debouncedFunction);
};
