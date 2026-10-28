// ==UserScript==
// @name               Kadokawa TW: Blurs R-rated Covers
// @name:zh-TW         台灣角川：模糊限制級封面
// @namespace          https://jasonhk.dev/
// @version            2.1.2
// @author             Jason Kwok
// @description        Blurs the covers of R-rated books at Kadokawa TW.
// @description:zh-TW  模糊台灣角川限制級書本的封面。
// @license            MIT
// @icon               https://wsrv.nl/?url=https://img.shoplineapp.com/media/image_clips/655dc24c5782ce002011c5db/original.png?1700643404
// @downloadURL        https://github.com/JasonHK/UserScripts/raw/releases/kadokawa-tw-blurs-r-rated-covers/kadokawa-tw-blurs-r-rated-covers.user.js
// @updateURL          https://github.com/JasonHK/UserScripts/raw/releases/kadokawa-tw-blurs-r-rated-covers/kadokawa-tw-blurs-r-rated-covers.meta.js
// @match              https://www.kadokawa.com.tw/*
// @grant              none
// @run-at             document-end
// ==/UserScript==

(function() {
	"use strict";
	var s = new Set();
	var _css = async (t) => {
		if (s.has(t)) return;
		s.add(t);
		((c) => {
			if (typeof GM_addStyle === "function") GM_addStyle(c);
			else (document.head || document.documentElement).appendChild(document.createElement("style")).append(c);
		})(t);
	};
	_css(" .product-item._nsfw_vr3ye_1 .boxify-image{filter:blur(var(--nsfw-blur-radius,7.5px));transition:.4s, filter var(--nsfw-transition-duration,.3s)}.product-item._nsfw_vr3ye_1:hover .boxify-image,.product-item._nsfw_vr3ye_1:focus-within .boxify-image{filter:blur()}.product-item._nsfw_vr3ye_1:hover .boxify-image-wrapper.multi-image .boxify-image:nth-child(2),.product-item._nsfw_vr3ye_1:focus-within .boxify-image-wrapper.multi-image .boxify-image:nth-child(2){animation:_looping-covers_vr3ye_1 var(--nsfw-looping-covers-duration,5s) infinite alternate}.product-item._nsfw_vr3ye_1:hover .boxify-image-wrapper.multi-image .boxify-image:nth-child(3),.product-item._nsfw_vr3ye_1:focus-within .boxify-image-wrapper.multi-image .boxify-image:nth-child(3){animation:_looping-covers_vr3ye_1 var(--nsfw-looping-covers-duration,5s) infinite alternate-reverse}@keyframes _looping-covers_vr3ye_1{0%{opacity:0}45%{opacity:0}55%{opacity:1}to{opacity:1}}\n/*$vite$:1*/ ");
	var style_module_default = {
		nsfw: "_nsfw_vr3ye_1",
		"looping-covers": "_looping-covers_vr3ye_1"
	};
	var observer = new MutationObserver((records) => records.forEach((record) => record.target instanceof Element && blurBookCovers(record.target)));
	document.querySelectorAll("#relatedProductList").forEach((element) => observer.observe(element, { childList: true }));
	blurBookCovers(document.body);
	function blurBookCovers(container) {
		const products = container.querySelectorAll(".product-item");
		for (const product of products) {
			const badges = product.querySelectorAll(".product-customized-labels-content");
			for (const badge of badges) if (badge instanceof HTMLElement && badge.innerText.trim() === "限制級") {
				product.classList.add(style_module_default.nsfw);
				break;
			}
		}
	}
})();
