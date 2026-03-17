import { defineConfig } from "vite";
import monkey from "vite-plugin-monkey";

export default defineConfig(
    {
        plugins: [
            monkey(
                {
                    entry: "src/index.ts",
                    userscript: {
                        "name": {
                            "": "ESJ Zone: Repair Non-clickable Chapters",
                            "zh-TW": "ESJ Zone：修復無法點擊的章節",
                            "zh-CN": "ESJ Zone：修复无法点击的章节",
                        },
                        "description": {
                            "": "Repair chapter links that were not-clickable due to for example, author misconfigured or by-designed.",
                            "zh-TW": "修復因作者設定錯誤或網頁設計問題等原因而無法點擊的章節連結。",
                            "zh-CN": "修复因作者设定错误或网页设计问题等原因而无法点击的章节链接。",
                        },
                        "icon": "https://icons.duckduckgo.com/ip3/www.esjzone.cc.ico",
                        "namespace": "https://jasonhk.dev/",
                        "match": [
                            "https://www.esjzone.cc/",
                            "https://www.esjzone.cc/update",
                            "https://www.esjzone.cc/update/",
                            "https://www.esjzone.cc/list",
                            "https://www.esjzone.cc/list/",
                            "https://www.esjzone.cc/list-*",
                            "https://www.esjzone.cc/tags/*",
                            "https://www.esjzone.cc/tags-*",
                            "https://www.esjzone.cc/my/favorite",
                            "https://www.esjzone.cc/my/favorite/*",
                            "https://www.esjzone.me/",
                            "https://www.esjzone.me/update",
                            "https://www.esjzone.me/update/",
                            "https://www.esjzone.me/list",
                            "https://www.esjzone.me/list/",
                            "https://www.esjzone.me/list-*",
                            "https://www.esjzone.me/tags/*",
                            "https://www.esjzone.me/tags-*",
                            "https://www.esjzone.me/my/favorite",
                            "https://www.esjzone.me/my/favorite/*",
                            "https://www.esjzone.one/",
                            "https://www.esjzone.one/update",
                            "https://www.esjzone.one/update/",
                            "https://www.esjzone.one/list",
                            "https://www.esjzone.one/list/",
                            "https://www.esjzone.one/list-*",
                            "https://www.esjzone.one/tags/*",
                            "https://www.esjzone.one/tags-*",
                            "https://www.esjzone.one/my/favorite",
                            "https://www.esjzone.one/my/favorite/*",
                        ],
                        "run-at": "document-end",
                        "inject-into": "page",
                        "grant": "none",
                    },
                    build: {
                        metaFileName: true,
                    },
                }),
        ],
    });
