import { GM } from "$";

/**
 * The global `translateText()` function from the website.
 */
export let translateText: typeof window.translateText;
if (GM.info.scriptHandler === "Greasemonkey")
{
    translateText = window.eval("getCookie(targetEncodingCookie)") ? window.eval("translateText") : ((text) => text);
}
else
{
    translateText = getCookie(targetEncodingCookie) ? window.translateText : ((text) => text);
}
