// ==UserScript==
// @name               mora: Enable Lyrics Selecting and Copying
// @name:zh-TW         mora：啟用歌詞選擇及複製
// @namespace          https://jasonhk.dev/
// @version            1.1.1
// @author             Jason Kwok
// @description        Disable the style and event handlers blocking the selection and copy of lyrics.
// @description:zh-TW  停用阻止選擇及複製歌詞的樣式及事件處理器。
// @license            MIT
// @icon               https://icons.duckduckgo.com/ip3/mora.jp.ico
// @match              https://mora.jp/*
// @inject-into        page
// @run-at             document-start
// ==/UserScript==

(function () {
  'use strict';

  console.info("Injecting inline style...");
  injectStyle(`
    body
    {
        user-select: auto !important;
    }
`);
  const isLyrics = location.pathname.startsWith("/lyrics");
  const EVENT_TYPES = [
    "contextmenu",
    "copy",
    "cut",
    "keydown",
    "mousedown",
    "selectstart"
  ];
  EventTarget.prototype.addEventListener = new Proxy(
    EventTarget.prototype.addEventListener,
    {
      apply(target, that, args) {
        const type = args[0];
        if (EVENT_TYPES.includes(type) && that === document.body && (isLyrics || !window.isPC)) {
          console.info('Defused "%s" event for %o', type, that);
          return;
        }
        return Reflect.apply(target, that, args);
      }
    }
  );
  function injectStyle(css) {
    const style = document.createElement("style");
    style.setAttribute("type", "text/css");
    style.textContent = css;
    const target = document.head ?? document.documentElement;
    return target.appendChild(style);
  }

})();