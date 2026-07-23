const fs = require('fs-extra');
const path = require('path');
const { version } = require('./package.json');

const OUT = 'dist/amalia';

/**
 * Depuis la migration vers le builder esbuild (@angular/build:application), le bundle est
 * émis en un seul main.js (ESM) : polyfills (zone.js, @ungap/custom-elements) inclus via
 * main.ts, plus de runtime.js/scripts.js à concaténer. Ce script se contente de copier le
 * bundle sous son nom versionné et de vérifier le contrat de distribution MONO-FICHIER
 * (docs/PLAYER_EXPERT_INTEGRATION.md) : si un chunk apparaît (import() dynamique, worker…),
 * le build échoue au lieu de livrer silencieusement un bundle incomplet.
 */
const buildWebComponent = async () => {
    const jsFiles = (await fs.readdir(OUT)).filter((f) => f.endsWith('.js') && !f.startsWith('amalia-'));
    const unexpected = jsFiles.filter((f) => f !== 'main.js');
    if (unexpected.length > 0) {
        throw new Error(
            `Contrat mono-fichier violé, JS inattendu(s) dans ${OUT} : ${unexpected.join(', ')}. ` +
            `Un import() dynamique ou un worker a probablement créé un chunk.`
        );
    }
    if (!(await fs.pathExists(path.join(OUT, 'main.js')))) {
        throw new Error(`${OUT}/main.js introuvable — le build Angular a-t-il réussi ?`);
    }

    await fs.copy(path.join(OUT, 'main.js'), path.join(OUT, `amalia-${version}.min.js`));
    await fs.copy(path.join(OUT, 'main.js'), 'samples/main.js');

    await fs.copy('src/assets', 'samples/assets', { overwrite: true });
    await fs.copy('src/assets/amalia/images', 'samples/', { overwrite: true });
};

buildWebComponent().catch((err) => {
    console.error(err.message || err);
    process.exit(1);
});
