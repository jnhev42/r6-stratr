import copy from "rollup-plugin-copy";
import { glob } from "glob";
import process from "process";
import livereload from 'rollup-plugin-livereload';
import serve from 'rollup-plugin-serve';

const TARGET_ENV = process.env.NODE_ENV;
const IS_PROD = process.env.NODE_ENV == "prod";
const DIST = `dist/${TARGET_ENV}/`;

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
const PLUGINS = {
    prod: [
        copy({
            targets: [
                { src: ["src/index.html", "assets/"], dest: DIST },
                { src: ["src/**/*.css"], dest: `${DIST}/styles/` }
            ],
            overwrite: true,
        }),
    ],
    dev: [
        serve(DIST),
        livereload(),
        watcher(["src/**/*.{html,css,json}", "assets/*"])
    ],
};

const ROLLUP = {
    input: `src/index.js`,
    output: {
        file: `${DIST}/index.js`,
        format: "iife",
        sourcemap: IS_PROD ? false : "inline",
    },
    watch: IS_PROD ? false : true,
    plugins: [ 
        ...PLUGINS.prod,
        ...(!IS_PROD ? PLUGINS.dev : [])
    ]
};

export default ROLLUP;
