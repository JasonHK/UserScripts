// ==UserScript==
// @name               Kadokawa TW: Blurs R-rated Covers
// @name:zh-TW         台灣角川：模糊限制級封面
// @namespace          https://jasonhk.dev/
// @version            2.1.1
// @author             Jason Kwok
// @description        Blurs the covers of R-rated books at Kadokawa TW.
// @description:zh-TW  模糊台灣角川限制級書本的封面。
// @license            MIT
// @icon               https://wsrv.nl/?url=https://img.shoplineapp.com/media/image_clips/655dc24c5782ce002011c5db/original.png?1700643404
// @match              https://www.kadokawa.com.tw/*
// @grant              none
// @run-at             document-end
// ==/UserScript==

(function () {
  'use strict';

  const styleCss = ".product-item.nsfw .boxify-image{filter:blur(var(--nsfw-blur-radius, 7.5px));transition:.4s,filter var(--nsfw-transition-duration, .3s)}.product-item.nsfw:hover .boxify-image,.product-item.nsfw:focus-within .boxify-image{filter:blur(0px)}body:not(.ios) .product-item.nsfw .quick-cart-item:hover .boxify-image-wrapper.multi-image .boxify-image:nth-child(2){animation:nsfw-looping-covers var(--nsfw-looping-covers-duration, 5s) infinite alternate}body:not(.ios) .product-item.nsfw .quick-cart-item:hover .boxify-image-wrapper.multi-image .boxify-image:nth-child(3){animation:nsfw-looping-covers var(--nsfw-looping-covers-duration, 5s) infinite alternate-reverse}@keyframes nsfw-looping-covers{0%{opacity:0}45%{opacity:0}55%{opacity:1}to{opacity:1}}";
  var a;
  const d = (b) => (a = document.createElement("style"), a.append(b), a);
  d(styleCss);
  const observer = new MutationObserver((records) => records.forEach((record) => record.target instanceof Element && blurBookCovers(record.target)));
  document.querySelectorAll("#relatedProductList").forEach((element) => observer.observe(element, { childList: true }));
  blurBookCovers(document.body);
  function blurBookCovers(container) {
    const products = container.querySelectorAll(".product-item");
    for (const product of products) {
      const badges = product.querySelectorAll(".product-customized-labels-content");
      for (const badge of badges) {
        if (badge instanceof HTMLElement && badge.innerText.trim() === "限制級") {
          product.classList.add("nsfw");
          break;
        }
      }
    }
  }

})();