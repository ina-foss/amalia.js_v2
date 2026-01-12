const fs = require('fs-extra');
const concat = require('concat');
const { version } = require('./package.json');

const concatenate = async () => {
    const files = [
        './dist/amalia/runtime.js',
        './dist/amalia/polyfills.js',
        './dist/amalia/scripts.js',
        './dist/amalia/main.js'
    ];

    await fs.ensureDir('dist');
    await concat(files, `dist/amalia/amalia-${version}.min.js`);
    await fs.ensureDir('samples');
    await concat(files, 'samples/main.js');

    await fs.copy('src/assets', 'samples/assets', { overwrite: true });
    await fs.copy('src/assets/amalia/images', 'samples/', { overwrite: true });
}
concatenate();
