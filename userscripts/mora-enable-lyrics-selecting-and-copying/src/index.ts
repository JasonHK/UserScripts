import style from "./style.css?style";

const EVENT_TYPES = [
    "contextmenu",
    "copy",
    "cut",
    "keydown",
    "mousedown",
    "selectstart",
];

const isLyricsPage = location.pathname.startsWith("/lyrics");

window.addEventListener("load", () =>
{
    if (isLyricsPage || !isPC)
    {
        console.info("Injecting inline style...");
        (document.head ?? document.documentElement).append(style);
    }
});

type addEventListener = typeof EventTarget.prototype.addEventListener;
EventTarget.prototype.addEventListener = new Proxy(EventTarget.prototype.addEventListener,
{
    apply(target: addEventListener, that: EventTarget, args: Parameters<addEventListener>): ReturnType<addEventListener>
    {
        const type = args[0];
        if (EVENT_TYPES.includes(type) && (that === document.body) && (isLyricsPage || !isPC))
        {
            console.info("Defused \"%s\" event for %o", type, that);
            return;
        }

        return Reflect.apply(target, that, args);
    },
});
