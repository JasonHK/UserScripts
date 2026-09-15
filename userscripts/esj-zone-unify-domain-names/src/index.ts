const WHITELISTED_HOSTNAMES = [
    "www.esjzone.cc",
    "www.esjzone.one",
    "www.esjzone.me",
];

const results = Array.from(document.getElementsByTagName("a")).map(handleAnchor);
console.info("Updated %d URL(s).", results.reduce((last, result) => (last + Number(result)), 0));

function handleAnchor(anchor: HTMLAnchorElement): boolean
{
    if (!anchor.href) { return false; }

    const url = new URL(anchor.href);
    if (!WHITELISTED_HOSTNAMES.includes(url.hostname)) { return false; }

    if (url.hostname !== location.hostname)
    {
        console.debug("Found href on %o linked to another mirror: %s", anchor, url.hostname);

        url.hostname = location.hostname;
        anchor.href = url.href;
        return true;
    }

    return false;
}
