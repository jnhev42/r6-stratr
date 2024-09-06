import copy from "rollup-plugin-copy";
import { glob } from "glob";
import process from "process";

const TARGET_ENV = process.env.NODE_ENV;
const IS_PROD = process.env.NODE_ENV == "prod";
const BROWSER = process.env.BROWSER;
const DIST = `dist/${IS_PROD ? "prod" : "dev"}/`;

const watcher = (globs) => ({
    async buildStart(_options) {
        for (let g of globs) {
            const files = await glob(g);

            files.forEach((filename) => {
                this.addWatchFile(filename);
            });
        }
    },
});

// builds all static non-js assets into the project
// since static assets don't need rollup there is only plugins
const STATIC_BUILD = {
    prod: [
        copy({
            targets: [
                { src: ["src/*.html", "src/css/", "assets/"], dest: DIST },
            ],
            overwrite: true,
        }),
    ],
    dev: [watcher(["src/**/*.{html,css,json}", "assets/*"])],
};

const ROLLUP = {
    input: `src/index.js`,
    output: {
        file: `${DIST}/index.js`,
        format: "iife",
        sourcemap: IS_PROD ? false : "inline",
    },
    watch: IS_PROD ? false : true,
    plugins: []
};

// Set on the first build as these only need to run once
ROLLUP.plugins.push(
    ...(IS_PROD
        ? STATIC_BUILD.prod
        : STATIC_BUILD.prod.concat(STATIC_BUILD.dev))
);

export default ROLLUP;
