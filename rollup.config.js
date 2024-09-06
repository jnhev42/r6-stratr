import copy from "rollup-plugin-copy";
import { glob } from "glob";
import process from "process";
import livereload from 'rollup-plugin-livereload';
import serve from 'rollup-plugin-serve';
import typescript from '@rollup/plugin-typescript';


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

const TYPESCRIPT = { 
    compilerOptions: {
        lib: ["es5", "es6", "dom"], 
        target: "es5"
    }
};

const BUILD_PLUGINS = [
    typescript(TYPESCRIPT),
    copy({
        targets: [
            { src: ["src/index.html", "assets/"], dest: DIST },
            { src: ["src/styles/*.css"], dest: `${DIST}/styles/` }
        ],
        overwrite: true,
    }),
];

const DEV_PLUGINS = [
    serve(DIST),
    livereload(),
    watcher(["src/**/*.{html,css,json}", "assets/*"])

];

const ROLLUP = {
    input: `src/index.ts`,
    output: {
        file: `${DIST}/index.js`,
        format: "iife",
        sourcemap: IS_PROD ? false : "inline",
    },
    watch: IS_PROD ? false : true,
    plugins: [ 
        ...BUILD_PLUGINS,
        ...(!IS_PROD ? DEV_PLUGINS : [])
    ]
};

export default ROLLUP;
