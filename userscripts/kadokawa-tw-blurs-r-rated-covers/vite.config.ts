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
                            "": "Kadokawa TW: Blurs R-rated Covers",
                            "zh-TW": "台灣角川：模糊限制級封面",
                        },
                        "description": {
                            "": "Blurs the covers of R-rated books at Kadokawa TW.",
                            "zh-TW": "模糊台灣角川限制級書本的封面。",
                        },
                        "icon": "https://wsrv.nl/?url=https://img.shoplineapp.com/media/image_clips/655dc24c5782ce002011c5db/original.png?1700643404",
                        "namespace": "https://jasonhk.dev/",
                        "match": [
                            "https://www.kadokawa.com.tw/*",
                        ],
                        "run-at": "document-end",
                        "grant": "none",
                    },
                    build: {
                        metaFileName: true,
                    },
                }),
        ],
    });
