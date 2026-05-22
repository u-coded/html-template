import { c as createComponent } from './astro-component_BQkYkiGH.mjs';
import 'piccolore';
import { p as createRenderInstruction, l as addAttribute, r as renderTemplate, m as maybeRenderHead, q as renderComponent, v as renderHead, w as renderSlot, u as unescapeHTML, x as isInputError, y as Fragment } from './entrypoint_CklKpU-T.mjs';
import { a as actions } from './server_CfOQhyj_.mjs';
import 'clsx';

async function renderScript(result, id) {
  const inlined = result.inlinedScripts.get(id);
  let content = "";
  if (inlined != null) {
    if (inlined) {
      content = `<script type="module">${inlined}</script>`;
    }
  } else {
    const resolved = await result.resolve(id);
    content = `<script type="module" src="${result.userAssetsBase ? (result.base === "/" ? "" : result.base) + result.userAssetsBase : ""}${resolved}"></script>`;
  }
  return createRenderInstruction({ type: "script", id, content });
}

const $$ClientRouter = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$ClientRouter;
  const { fallback = "animate" } = Astro2.props;
  return renderTemplate`<meta name="astro-view-transitions-enabled" content="true"><meta name="astro-view-transitions-fallback"${addAttribute(fallback, "content")}>${renderScript($$result, "/Users/yufujishima/git/html-template/node_modules/astro/components/ClientRouter.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/yufujishima/git/html-template/node_modules/astro/components/ClientRouter.astro", void 0);

const siteData = {
  siteName: "株式会社藤島製作所",
  siteDesc: "株式会社藤島製作所は、北海道札幌市東区に拠点を置く精密機械加工・金型製造のメーカーです。創業以来60年以上、自動車・産業機械向けの高精度部品を製造しています。",
  siteCanonical: "https://fujishima-mfg.example.com/"
};

const $$Header = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Header;
  const { pageSlug } = Astro2.props;
  const LogoTag = pageSlug === "index" ? "h1" : "p";
  return renderTemplate`${maybeRenderHead()}<header class="l-header" data-header> ${renderComponent($$result, "LogoTag", LogoTag, { "class": "l-header__logo" }, { "default": ($$result2) => renderTemplate` <a href="/" class="l-header__logo-link u-alpha">${siteData.siteName}</a> ` })} <button class="l-nav-hamburger u-hidden-md" type="button" data-nav-trigger aria-expanded="false" aria-controls="main-nav"> <span class="l-nav-hamburger__icon"><span class="u-sr-only">メニューを開閉する</span></span> </button> <nav id="main-nav" class="l-nav" data-nav aria-hidden="true"> <ul class="l-nav__list"> <li class="l-nav__list-item"> <a href="/" class="l-nav__list-link u-alpha">ホーム</a> </li> <li class="l-nav__list-item"> <a href="/about/" class="l-nav__list-link u-alpha">会社概要</a> </li> <li class="l-nav__list-item"> <a href="/news/" class="l-nav__list-link u-alpha">お知らせ</a> </li> <li class="l-nav__list-item"> <a href="/contact/" class="l-nav__list-link u-alpha">お問い合わせ</a> </li> </ul> </nav> <div class="l-nav-overlay u-hidden-md" data-nav-overlay tabindex="0" aria-hidden="true"></div> </header>`;
}, "/Users/yufujishima/git/html-template/src/components/Header.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  return renderTemplate`${maybeRenderHead()}<div class="l-page-top" data-page-top> <a class="l-page-top__link u-alpha" href="#top"><span class="u-sr-only">ページトップへ</span></a> </div> <footer id="footer" class="l-footer" data-page-top-stop> <div class="l-footer__inner u-inner"> <a href="/" class="l-footer__logo-link u-alpha">${siteData.siteName}</a> <p class="l-footer__copyright"> <small>&copy; ${year} ${siteData.siteName}</small> </p> </div> </footer>`;
}, "/Users/yufujishima/git/html-template/src/components/Footer.astro", void 0);

const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Layout;
  const { pageTitle, pageSlug } = Astro2.props;
  const title = pageSlug === "index" ? siteData.siteName : `${pageTitle} | ${siteData.siteName}`;
  return renderTemplate`<html lang="ja"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0"><title>${title}</title><meta name="description"${addAttribute(siteData.siteDesc, "content")}><link rel="canonical"${addAttribute(siteData.siteCanonical, "href")}><!-- OGP --><meta property="og:type" content="website"><meta property="og:title"${addAttribute(title, "content")}><meta property="og:description"${addAttribute(siteData.siteDesc, "content")}><meta property="og:image"${addAttribute(`${siteData.siteCanonical}assets/images/common/ogp.png`, "content")}><meta property="og:url"${addAttribute(siteData.siteCanonical, "content")}><meta property="og:site_name"${addAttribute(siteData.siteName, "content")}><!-- Twitter Card（og:*を自動参照するので最低限でOK） --><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image"${addAttribute(`${siteData.siteCanonical}assets/images/common/ogp.png`, "content")}><!-- Favicon --><link rel="apple-touch-icon" sizes="180x180" href="/assets/images/icon/apple-touch-icon.png"><link rel="icon" type="image/png" sizes="32x32" href="/assets/images/icon/favicon-32x32.png"><link rel="icon" type="image/png" sizes="16x16" href="/assets/images/icon/favicon-16x16.png"><link rel="manifest" href="/assets/images/icon/site.webmanifest"><meta name="theme-color" content="#ffffff">${renderComponent($$result, "ClientRouter", $$ClientRouter, {})}${renderHead()}</head> <body${addAttribute(pageSlug, "id")} ontouchstart=""> ${pageSlug === "index" && renderTemplate`<div class="l-loading" data-loading> <p class="l-loading__txt">Loading...</p> </div>`} ${renderComponent($$result, "Header", $$Header, { "pageSlug": pageSlug })} <div class="l-container"> ${renderSlot($$result, $$slots["default"])} </div> ${renderComponent($$result, "Footer", $$Footer, {})} ${renderScript($$result, "/Users/yufujishima/git/html-template/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts")} </body> </html>`;
}, "/Users/yufujishima/git/html-template/src/layouts/Layout.astro", void 0);

const $$SubKv = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$SubKv;
  const { pageTitle } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="l-sub-kv" data-page-top-hide> <h1 class="l-sub-kv__txt">${pageTitle}</h1> </div>`;
}, "/Users/yufujishima/git/html-template/src/components/SubKv.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Breadcrumb = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Breadcrumb;
  const { pageTitle, pageUrl, parentPageTitle, parentPageUrl } = Astro2.props;
  const position = parentPageTitle ? 3 : 2;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "ホーム",
        item: siteData.siteCanonical
      },
      ...parentPageTitle && parentPageUrl ? [
        {
          "@type": "ListItem",
          position: 2,
          name: parentPageTitle,
          item: `${siteData.siteCanonical}${parentPageUrl}/`
        }
      ] : [],
      {
        "@type": "ListItem",
        position,
        name: pageTitle,
        item: `${siteData.siteCanonical}${pageUrl}/`
      }
    ]
  };
  return renderTemplate(_a || (_a = __template(["", '<nav id="breadcrumb" class="l-breadcrumb u-inner" aria-label="Breadcrumb"> <ul role="list"> <li role="listitem"> <a href="/" class="u-alpha"><span>ホーム</span></a> </li> ', ' <li role="listitem"> <span aria-current="page">', '</span> </li> </ul> </nav> <script type="application/ld+json">', "<\/script>"])), maybeRenderHead(), parentPageTitle && renderTemplate`<li role="listitem"> <a href="../" class="u-alpha"> <span>${parentPageTitle}</span> </a> </li>`, pageTitle, unescapeHTML(JSON.stringify(jsonLd)));
}, "/Users/yufujishima/git/html-template/src/components/Breadcrumb.astro", void 0);

const prerender = false;
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Index;
  const pageTitle = "お問い合わせ";
  const pageSlug = "contact";
  const result = Astro2.getActionResult(actions.contact);
  const inputErrors = result && isInputError(result.error) ? result.error.fields : {};
  const sent = result && !result.error;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "pageTitle": pageTitle, "pageSlug": pageSlug }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "SubKv", $$SubKv, { "pageTitle": pageTitle })} ${renderComponent($$result2, "Breadcrumb", $$Breadcrumb, { "pageTitle": pageTitle, "pageUrl": pageSlug })} ${maybeRenderHead()}<main> <section class="p-contact-main"> <div class="p-contact-main__inner u-inner"> ${sent ? renderTemplate`<div class="p-contact-main__thanks"> <h2 class="p-contact-main__thanks-title">送信完了しました</h2> <p class="p-contact-main__thanks-txt">
お問い合わせありがとうございました。
<br>
通常2〜3営業日以内に担当者よりご返信いたします。
</p> </div>` : renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate` <p class="p-contact-main__lead">
お見積もり・技術相談・採用に関するご質問など、下記フォームよりお気軽にお問い合わせください。通常2〜3営業日以内に担当者よりご返信いたします。
</p> <form method="POST"${addAttribute(actions.contact, "action")} class="p-contact-main__form"> <div class="c-form1"> <fieldset class="c-form1__fieldset"> <legend class="c-form1__legend">お名前</legend> <div class="c-form1__inputs"> <input type="text" name="name" placeholder="山田 太郎" required> ${inputErrors.name && renderTemplate`<p class="c-form1__error">${inputErrors.name[0]}</p>`} </div> </fieldset> <fieldset class="c-form1__fieldset"> <legend class="c-form1__legend">メールアドレス</legend> <div class="c-form1__inputs"> <input type="email" name="email" placeholder="example@example.com" required> ${inputErrors.email && renderTemplate`<p class="c-form1__error">${inputErrors.email[0]}</p>`} </div> </fieldset> <fieldset class="c-form1__fieldset"> <legend class="c-form1__legend">お問い合わせ内容</legend> <div class="c-form1__inputs"> <textarea name="message" placeholder="お問い合わせ内容をご記入ください" required></textarea> ${inputErrors.message && renderTemplate`<p class="c-form1__error">${inputErrors.message[0]}</p>`} </div> </fieldset> <div class="c-form1__btns"> <button class="c-btn2 c-btn2--primary" type="submit">
送信する
</button> </div> </div> </form> ` })}`} </div> </section> </main> ` })}`;
}, "/Users/yufujishima/git/html-template/src/pages/contact/index.astro", void 0);

const $$file = "/Users/yufujishima/git/html-template/src/pages/contact/index.astro";
const $$url = "/contact";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
