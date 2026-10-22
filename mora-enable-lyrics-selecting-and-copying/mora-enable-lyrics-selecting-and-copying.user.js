// ==UserScript==
// @name               mora: Enable Lyrics Selecting and Copying
// @name:zh-TW         mora：啟用歌詞選擇及複製
// @namespace          https://jasonhk.dev/
// @version            1.2.0
// @author             Jason Kwok
// @description        Disable the style and event handlers blocking the selection and copy of lyrics.
// @description:zh-TW  停用阻止選擇及複製歌詞的樣式及事件處理器。
// @license            MIT
// @icon               https://icons.duckduckgo.com/ip3/mora.jp.ico
// @match              https://mora.jp/*
// @inject-into        page
// @run-at             document-start
// ==/UserScript==

(function() {
	"use strict";
	var style_default = "body{-webkit-user-select:auto!important;user-select:auto!important}";
	var _style = (b, a = document.createElement("style")) => (a.append(b), a);
	var style_css_default = _style(style_default);
	var EVENT_TYPES = [
		"contextmenu",
		"copy",
		"cut",
		"keydown",
		"mousedown",
		"selectstart"
	];
	var isLyricsPage = location.pathname.startsWith("/lyrics");
	window.addEventListener("load", () => {
		if (typeof isPC !== "boolean") console.warn("Global variable isPC does not exist or is not a boolean (possibly website internals changed); please contact the UserScript's maintainer for further investigation.");
		if (isLyricsPage || (typeof isPC === "boolean" ? !isPC : true)) {
			console.info("Injecting inline style...");
			(document.head ?? document.documentElement).append(style_css_default);
		}
	});
	EventTarget.prototype.addEventListener = new Proxy(EventTarget.prototype.addEventListener, { apply(target, that, args) {
		const type = args[0];
		if (EVENT_TYPES.includes(type) && that === document.body && (isLyricsPage || (typeof isPC === "boolean" ? !isPC : true))) {
			console.info("Defused \"%s\" event for %o", type, that);
			return;
		}
		return Reflect.apply(target, that, args);
	} });
})();
