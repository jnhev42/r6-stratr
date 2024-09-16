import { glob } from "glob";
import process from "process";
import livereload from 'rollup-plugin-livereload';
import serve from 'rollup-plugin-serve';
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import fs from "fs";
import commonjs from '@rollup/plugin-commonjs';


const TARGET_ENV = process.env.NODE_ENV;
const IS_PROD = TARGET_ENV == "prod";
const DIST = `dist/${TARGET_ENV}/`;

const watcher = (globs) => ({
    async buildStart(_options) {
        for (const g of globs) {
            const files = await glob(g);

            files.forEach((filename) => {
                this.addWatchFile(filename);
            });
        }
    },
});

const copier = {
    flatten: name => {
        const split = name.split(/[\\\/]/g);
        return split[split.length - 1];
    },

    strip: prefix => name => {
        const prefixes = [
            prefix.replace('\\', '/'),  
            prefix.replace('/', '\\')
        ];
        for (const prf of prefixes) {
            if (name.startsWith(prf)) {
                return name.slice(prf.length);
            }
        }
        return name;
    },

    make: ( {targets} ) => ({
        async generateBundle() {
            for (const { src, renamer = (n) => n } of targets) {
                const files = await glob(src);
                
                for (const file of files) {                
                    const name = renamer(file);
    
                    this.emitFile({
                        type: "asset",
                        fileName: name,
                        source: await fs.promises.readFile(file),
                    });
                }
            }
        }
    })
};

const tsconfig = { 
    compilerOptions: {
        lib: ["es5", "es6", "dom", "es2022"], 
        target: "es2015"
    }
};

const make_plugins_prod = () => ([
    commonjs(),
    nodeResolve({ browser: true }),
    typescript(tsconfig),
    copier.make({
        targets: [
            { src: "src/index.html", renamer: copier.flatten },
            { src: "assets/**/*.*" },
            { src: "src/styles/**/*.css", renamer: copier.strip("src/") }
        ]
    }),
]);

const make_plugins_dev = () => ([
    ...make_plugins_prod(),
    serve(DIST),
    livereload(),
    watcher(["src/**/*.{html,css,json}", "assets/*"])
]);

const ROLLUP = {
    input: `src/index.ts`,
    output: {
        file: `${DIST}/index.js`,
        format: "iife",
        sourcemap: IS_PROD ? false : "inline",
    },
    watch: !IS_PROD,
    plugins: IS_PROD ? make_plugins_prod() : make_plugins_dev()
};

export default ROLLUP;
