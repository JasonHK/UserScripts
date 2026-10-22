// ==UserScript==
// @name               ESJ Zone: Repair Non-clickable Chapters
// @name:zh-TW         ESJ Zone：修復無法點擊的章節
// @name:zh-CN         ESJ Zone：修复无法点击的章节
// @namespace          https://jasonhk.dev/
// @version            1.1.1
// @author             Jason Kwok
// @description        Repair chapter links that were not-clickable due to for example, author misconfigured or by-designed.
// @description:zh-TW  修復因作者設定錯誤或網頁設計問題等原因而無法點擊的章節連結。
// @description:zh-CN  修复因作者设定错误或网页设计问题等原因而无法点击的章节链接。
// @license            MIT
// @icon               https://icons.duckduckgo.com/ip3/www.esjzone.cc.ico
// @match              https://www.esjzone.cc/
// @match              https://www.esjzone.cc/update
// @match              https://www.esjzone.cc/update/
// @match              https://www.esjzone.cc/list
// @match              https://www.esjzone.cc/list/
// @match              https://www.esjzone.cc/list-*
// @match              https://www.esjzone.cc/tags/*
// @match              https://www.esjzone.cc/tags-*
// @match              https://www.esjzone.cc/my/favorite
// @match              https://www.esjzone.cc/my/favorite/*
// @match              https://www.esjzone.me/
// @match              https://www.esjzone.me/update
// @match              https://www.esjzone.me/update/
// @match              https://www.esjzone.me/list
// @match              https://www.esjzone.me/list/
// @match              https://www.esjzone.me/list-*
// @match              https://www.esjzone.me/tags/*
// @match              https://www.esjzone.me/tags-*
// @match              https://www.esjzone.me/my/favorite
// @match              https://www.esjzone.me/my/favorite/*
// @match              https://www.esjzone.one/
// @match              https://www.esjzone.one/update
// @match              https://www.esjzone.one/update/
// @match              https://www.esjzone.one/list
// @match              https://www.esjzone.one/list/
// @match              https://www.esjzone.one/list-*
// @match              https://www.esjzone.one/tags/*
// @match              https://www.esjzone.one/tags-*
// @match              https://www.esjzone.one/my/favorite
// @match              https://www.esjzone.one/my/favorite/*
// @grant              none
// @inject-into        page
// @run-at             document-end
// ==/UserScript==

(function () {
  'use strict';

  const has = Object.prototype.hasOwnProperty;
  class QueueEvent extends Event {
    constructor(name, detail) {
      super(name);
      this.detail = detail;
    }
  }
  class Queue extends EventTarget {
    constructor(options = {}) {
      super();
      const { concurrency = Infinity, timeout = 0, autostart = false, results = null } = options;
      this.concurrency = concurrency;
      this.timeout = timeout;
      this.autostart = autostart;
      this.results = results;
      this.pending = 0;
      this.session = 0;
      this.running = false;
      this.jobs = [];
      this.timers = [];
      this.addEventListener("error", this._errorHandler);
    }
    _errorHandler(evt) {
      this.end(evt.detail.error);
    }
    pop() {
      return this.jobs.pop();
    }
    shift() {
      return this.jobs.shift();
    }
    indexOf(searchElement, fromIndex) {
      return this.jobs.indexOf(searchElement, fromIndex);
    }
    lastIndexOf(searchElement, fromIndex) {
      if (fromIndex !== void 0) return this.jobs.lastIndexOf(searchElement, fromIndex);
      return this.jobs.lastIndexOf(searchElement);
    }
    slice(start, end) {
      this.jobs = this.jobs.slice(start, end);
      return this;
    }
    reverse() {
      this.jobs.reverse();
      return this;
    }
    push(...workers) {
      const methodResult = this.jobs.push(...workers);
      if (this.autostart) this._start();
      return methodResult;
    }
    unshift(...workers) {
      const methodResult = this.jobs.unshift(...workers);
      if (this.autostart) this._start();
      return methodResult;
    }
    splice(start, deleteCount, ...workers) {
      this.jobs.splice(start, deleteCount, ...workers);
      if (this.autostart) this._start();
      return this;
    }
    get length() {
      return this.pending + this.jobs.length;
    }
    start(callback) {
      if (this.running) throw new Error("already started");
      let awaiter;
      if (callback) {
        this._addCallbackToEndEvent(callback);
      } else {
        awaiter = this._createPromiseToEndEvent();
      }
      this._start();
      return awaiter;
    }
    _start() {
      this.running = true;
      if (this.pending >= this.concurrency) {
        return;
      }
      if (this.jobs.length === 0) {
        if (this.pending === 0) {
          this.done();
        }
        return;
      }
      const job = this.jobs.shift();
      const session = this.session;
      const timeout = job !== void 0 && has.call(job, "timeout") ? job.timeout : this.timeout;
      let once = true;
      let timeoutId = null;
      let didTimeout = false;
      let resultIndex = null;
      const next = (error, ...result) => {
        if (once && this.session === session) {
          once = false;
          this.pending--;
          if (timeoutId !== null) {
            this.timers = this.timers.filter((tID) => tID !== timeoutId);
            clearTimeout(timeoutId);
          }
          if (error) {
            this.dispatchEvent(new QueueEvent("error", { error, job }));
          } else if (!didTimeout) {
            if (resultIndex !== null && this.results !== null) {
              this.results[resultIndex] = [...result];
            }
            this.dispatchEvent(new QueueEvent("success", { result: [...result], job }));
          }
          if (this.session === session) {
            if (this.pending === 0 && this.jobs.length === 0) {
              this.done();
            } else if (this.running) {
              this._start();
            }
          }
        }
      };
      if (timeout) {
        timeoutId = setTimeout(() => {
          didTimeout = true;
          this.dispatchEvent(new QueueEvent("timeout", { next, job }));
          next();
        }, timeout);
        this.timers.push(timeoutId);
      }
      if (this.results != null) {
        resultIndex = this.results.length;
        this.results[resultIndex] = null;
      }
      this.pending++;
      this.dispatchEvent(new QueueEvent("start", { job }));
      job.promise = job(next);
      if (job.promise !== void 0 && typeof job.promise.then === "function") {
        job.promise.then(function(result) {
          return next(void 0, result);
        }).catch(function(err) {
          return next(err || true);
        });
      }
      if (this.running && this.jobs.length > 0) {
        this._start();
      }
    }
    stop() {
      this.running = false;
    }
    end(error) {
      this.clearTimers();
      this.jobs.length = 0;
      this.pending = 0;
      this.done(error);
    }
    clearTimers() {
      this.timers.forEach((timer) => {
        clearTimeout(timer);
      });
      this.timers = [];
    }
    _addCallbackToEndEvent(cb) {
      const onend = (evt) => {
        this.removeEventListener("end", onend);
        cb(evt.detail.error, this.results);
      };
      this.addEventListener("end", onend);
    }
    _createPromiseToEndEvent() {
      return new Promise((resolve, reject) => {
        this._addCallbackToEndEvent((error, results) => {
          if (error) reject(error);
          else resolve(results);
        });
      });
    }
    done(error) {
      this.session++;
      this.running = false;
      this.dispatchEvent(new QueueEvent("end", { error }));
    }
  }
  var _GM = (() => typeof GM != "undefined" ? GM : void 0)();
  let translateText;
  if (_GM.info.scriptHandler === "Greasemonkey") {
    translateText = window.eval("getCookie(targetEncodingCookie)") ? window.eval("translateText") : ((text) => text);
  } else {
    translateText = getCookie(targetEncodingCookie) ? window.translateText : ((text) => text);
  }
  let repaired = 0;
  const queue = new Queue({ autostart: true, concurrency: 4 });
  queue.addEventListener("error", (event) => console.error(event.detail.error));
  queue.addEventListener("end", () => console.info("Repaired %d URL(s).", repaired));
  const pathname = location.pathname;
  if (pathname === "/my/favorite" || pathname.startsWith("/my/favorite/")) {
    const novels = document.querySelectorAll(".product-item");
    for (const novel of novels) {
      const novelUrl = novel.querySelector(".product-title a")?.href;
      const chapterWrapper = novel.querySelector(".book-ep div:nth-child(2)");
      const chapterNode = chapterWrapper?.childNodes[0];
      if (novelUrl && chapterWrapper && chapterNode instanceof Text) {
        const chapter = chapterNode.splitText(chapterNode.data.indexOf("：") + 1);
        queue.push(createRepairChapterTask(novelUrl, chapter, chapterWrapper));
      }
    }
  } else {
    const novels = document.querySelectorAll(".card");
    for (const novel of novels) {
      const novelUrl = novel.querySelector(".card-title a")?.href;
      const chapterWrapper = novel.querySelector(".card-ep");
      const chapter = chapterWrapper?.childNodes[0];
      if (novelUrl && chapterWrapper && chapter instanceof Text) {
        queue.push(createRepairChapterTask(novelUrl, chapter, chapterWrapper));
      }
    }
  }
  function createRepairChapterTask(novelUrl, chapter, chapterWrapper) {
    async function repairChapter() {
      const url = await findChapterUrl(novelUrl, chapter.data);
      if (url) {
        const link = document.createElement("a");
        link.href = url;
        link.append(chapter);
        chapterWrapper.append(link);
        console.debug("Repaired chapter %o with link: %s", chapter, url);
        repaired++;
      }
    }
    return repairChapter;
  }
  async function findChapterUrl(novelUrl, chapterName) {
    const response = await fetch(novelUrl);
    if (response.status === 200) {
      const html = await response.text();
      const parser = new DOMParser();
      const page = parser.parseFromString(html, "text/html");
      return Array.from(page.querySelectorAll("#chapterList a")).reverse().find((chapter) => translateText(chapter.innerText.trim()) === chapterName)?.href ?? null;
    }
    return null;
  }

})();