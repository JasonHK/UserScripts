import { defineConfig } from "vite";
import monkey from "vite-plugin-monkey";

export default defineConfig(
    {
        plugins: [
            monkey(
                {
                    entry: "src/index.ts",
                    userscript: {
                        name: {
                            "": "mora: Enable Lyrics Selecting and Copying",
                            "zh-TW": "mora：啟用歌詞選擇及複製",
                        },
                        description: {
                            "": "Disable the style and event handlers blocking the selection and copy of lyrics.",
                            "zh-TW": "停用阻止選擇及複製歌詞的樣式及事件處理器。",
                        },
                        icon: "https://icons.duckduckgo.com/ip3/mora.jp.ico",
                        namespace: "https://jasonhk.dev/",
                        match: [
                            "https://mora.jp/*",
                        ],
                        "run-at": "document-start",
                        "inject-into": "page",
                    },
                    build: {
                        metaFileName: true,
                    },
                }),
        ],
    });
