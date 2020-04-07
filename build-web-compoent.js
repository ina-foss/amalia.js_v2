const fs = require('fs-extra');
const concat = require('concat');

concatenate = async () => {
    const files = [
        './dist/amalia/runtime-es2015.js',
        './dist/amalia/polyfills-es2015.js',
        './dist/amalia/scripts.js',
        './dist/amalia/main-es2015.js'
    ];

    await fs.ensureDir('dist');
    await concat(files, 'dist/amalia/amalia.min.js');
}
concatenate();
