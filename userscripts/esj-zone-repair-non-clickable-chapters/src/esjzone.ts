import { GM } from "$";

const noop: typeof translateText = (text: string | null | undefined) => String(text);

/**
 * The global `translateText()` function from the website.
 */
const _translateText: typeof translateText = (() =>
{
    if (GM.info.scriptHandler === "Greasemonkey")
    {
        return window.eval(`typeof translateText === "function"`) ? window.eval("translateText") as typeof translateText : noop;
    }
    else
    {
        return (typeof translateText === "function") ? translateText : noop;
    }
})();

export { _translateText as translateText };
