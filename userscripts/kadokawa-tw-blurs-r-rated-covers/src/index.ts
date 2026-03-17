import "./style.css?style";

const observer = new MutationObserver((records) => records.forEach((record) => ((record.target instanceof Element) && blurBookCovers(record.target))));
document.querySelectorAll("#relatedProductList")
        .forEach((element) => observer.observe(element, { childList: true }));
 
blurBookCovers(document.body);
 
function blurBookCovers(container: Element)
{
    const products = container.querySelectorAll(".product-item");
    for (const product of products)
    {
        const badges = product.querySelectorAll(".product-customized-labels-content");
        for (const badge of badges)
        {
            if ((badge instanceof HTMLElement) && (badge.innerText.trim() === "限制級"))
            {
                product.classList.add("nsfw");
                break;
            }
        }
    }
}
