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
                            "": "ESJ Zone: Unify Domain Names",
                            "zh-TW": "ESJ Zone：統一域名",
                            "zh-CN": "ESJ Zone：统一网域",
                        },
                        description: {
                            "": "Unify internal links to use the current mirror.",
                            "zh-TW": "統一內部連結使用目前鏡像站點。",
                            "zh-CN": "统一内部链接使用目前镜像站点。",
                        },
                        icon: "https://icons.duckduckgo.com/ip3/www.esjzone.cc.ico",
                        namespace: "https://jasonhk.dev/",
                        match: [
                            "https://www.esjzone.cc/*",
                            "https://www.esjzone.me/*",
                            "https://www.esjzone.one/*",
                        ],
                        "run-at": "document-end",
                    },
                    build: {
                        metaFileName: true,
                    },
                }),
        ],
    });
