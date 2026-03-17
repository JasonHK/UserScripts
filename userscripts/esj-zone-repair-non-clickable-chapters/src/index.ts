import Queue from "queue";
import { translateText } from "./esjzone";

let repaired = 0;

const queue = new Queue({ autostart: true, concurrency: 4 });
queue.addEventListener("error", (event) => console.error(event.detail.error));
queue.addEventListener("end", () => console.info("Repaired %d URL(s).", repaired));

const pathname = location.pathname;
if ((pathname === "/my/favorite") || pathname.startsWith("/my/favorite/"))
{
    const novels = document.querySelectorAll(".product-item");
    for (const novel of novels)
    {
        const novelUrl = novel.querySelector<HTMLAnchorElement>(".product-title a")?.href;
        const chapterWrapper = novel.querySelector<HTMLDivElement>(".book-ep div:nth-child(2)");
        const chapterNode = chapterWrapper?.childNodes[0];
        if (novelUrl && chapterWrapper && (chapterNode instanceof Text))
        {
            const chapter = chapterNode.splitText(chapterNode.data.indexOf("：") + 1);
            queue.push(createRepairChapterTask(novelUrl, chapter, chapterWrapper));
        }
    }
}
else
{
    const novels = document.querySelectorAll(".card");
    for (const novel of novels)
    {
        const novelUrl = novel.querySelector<HTMLAnchorElement>(".card-title a")?.href;
        const chapterWrapper = novel.querySelector(".card-ep");
        const chapter = chapterWrapper?.childNodes[0];
        if (novelUrl && chapterWrapper && (chapter instanceof Text))
        {
            queue.push(createRepairChapterTask(novelUrl, chapter, chapterWrapper));
        }
    }
}

function createRepairChapterTask(novelUrl: string, chapter: Text, chapterWrapper: Element): () => Promise<void>
{
    async function repairChapter()
    {
        const url = await findChapterUrl(novelUrl, chapter.data);
        if (url)
        {
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

async function findChapterUrl(novelUrl: string, chapterName: string): Promise<string | null>
{
    const response = await fetch(novelUrl);
    if (response.status === 200)
    {
        const html = await response.text();
        const parser = new DOMParser();
        const page = parser.parseFromString(html, "text/html");

        return Array
            .from(page.querySelectorAll<HTMLAnchorElement>("#chapterList a"))
            .reverse()
            .find((chapter) => (translateText(chapter.innerText.trim()) === chapterName))
            ?.href ?? null;
    }

    return null;
}
