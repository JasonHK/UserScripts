/// <reference path="mora.d.ts" />

const isLyrics = location.pathname.startsWith("/lyrics");

const EVENT_TYPES = [
    "contextmenu",
    "copy",
    "cut",
    "keydown",
    "mousedown",
    "selectstart",
];

type addEventListener = typeof EventTarget.prototype.addEventListener;
EventTarget.prototype.addEventListener = new Proxy(EventTarget.prototype.addEventListener,
{
    apply(target: addEventListener, that: EventTarget, args: Parameters<addEventListener>): ReturnType<addEventListener>
    {
        const type = args[0];
        if (EVENT_TYPES.includes(type) && (that === document.body) && (isLyrics || !window.isPC))
        {
            console.info("Defused \"%s\" event for %o", type, that);
            return;
        }

        return Reflect.apply(target, that, args);
    },
});
