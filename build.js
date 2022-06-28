const { build } = require('esbuild');
const { dependencies } = require('./package.json');
const pkgParse = require('./node_modules/parse-server/package.json');
build({
    entryPoints: ['src/index.ts', 'src/cloud/main.ts'],
    outdir: 'dist',
    bundle: true,
    platform: 'node',
    minify: true,
    external: [
        ...Object.keys(dependencies),
        ...Object.keys(pkgParse.dependencies)
    ]
})