export default () => {
  // data-svg 属性を持つ <img> タグを取得
  const imgElements = document.querySelectorAll("img[data-svg]");

  imgElements.forEach((img) => {
    const svgSrc = img.src;
    const altText = img.getAttribute("alt")?.trim() || null;
    const className = img.getAttribute("class")?.trim() || null;
    const style = img.getAttribute("style")?.trim() || null;

    // SVGファイルを取得して埋め込み
    fetch(svgSrc)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`SVGファイルの取得に失敗しました: ${svgSrc}`);
        }
        return response.text();
      })
      .then((svgText) => {
        // SVGテキストをHTMLに埋め込む
        const parser = new DOMParser();
        const svgDocument = parser.parseFromString(svgText, "image/svg+xml");
        const svgElement = svgDocument.documentElement;

        // 必要な属性を条件付きで設定
        if (className) {
          svgElement.setAttribute("class", className);
        }
        if (style) {
          svgElement.setAttribute("style", style);
        }

        // alt属性を <title> 要素として追加
        if (altText) {
          const titleElement = document.createElementNS("http://www.w3.org/2000/svg", "title");
          titleElement.textContent = altText;
          svgElement.prepend(titleElement);
        }

        // img要素をSVG要素で置き換え
        img.replaceWith(svgElement);
      })
      .catch((error) => {
        console.error("エラー:", error);
      });
  });
};
