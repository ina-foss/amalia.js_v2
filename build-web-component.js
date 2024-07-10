const fs = require('fs-extra');
const concat = require('concat');

const concatenate = async () => {
    const files = [
        './dist/amalia/runtime.js',
        './dist/amalia/polyfills.js',
        './dist/amalia/scripts.js',
        './dist/amalia/main.js'
    ];

    await fs.ensureDir('dist');
    await concat(files, 'dist/amalia/amalia.min.js');
}
concatenate();
