/**
 * Rapport de taille du dist — chantier perf v21 (docs/refactoring/PLAN-PERF-2026.md).
 *
 * Usage :
 *   node scripts/size-report.mjs                  # delta vs docs/refactoring/size-baseline.json
 *   node scripts/size-report.mjs --update-baseline
 *
 * Sans dépendance externe (node:fs / node:zlib). Parcourt dist/amalia récursivement,
 * ignore les assets copiés (samples) et ne retient que js/css/woff/ttf/eot/svg de police.
 */
import { readdirSync, readFileSync, statSync, writeFileSync, existsSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(root, 'dist', 'amalia');
const baselinePath = join(root, 'docs', 'refactoring', 'size-baseline.json');

const TRACKED_EXT = /\.(js|css|woff2?|ttf|eot)$/i;

function walk(dir) {
    const out = [];
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) {
            out.push(...walk(full));
        } else if (TRACKED_EXT.test(entry.name)) {
            out.push(full);
        }
    }
    return out;
}

function fmt(bytes) {
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} Mo`;
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
    return `${bytes} o`;
}

function fmtDelta(bytes) {
    const sign = bytes > 0 ? '+' : '';
    return `${sign}${fmt(Math.abs(bytes)).replace(/^/, bytes < 0 ? '-' : '')}`;
}

if (!existsSync(distDir)) {
    console.error(`dist introuvable : ${distDir} — lancer "npm run build:component" d'abord.`);
    process.exit(1);
}

const files = walk(distDir)
    .map((f) => {
        const buf = readFileSync(f);
        return {
            file: relative(distDir, f).replaceAll('\\', '/'),
            bytes: statSync(f).size,
            gzip: gzipSync(buf, { level: 9 }).length,
        };
    })
    .sort((a, b) => b.bytes - a.bytes);

const total = files.reduce((s, f) => s + f.bytes, 0);
const totalGzip = files.reduce((s, f) => s + f.gzip, 0);
const report = { date: new Date().toISOString().slice(0, 10), total, totalGzip, files };

if (process.argv.includes('--update-baseline')) {
    writeFileSync(baselinePath, JSON.stringify(report, null, 2) + '\n');
    console.log(`Baseline écrite : ${relative(root, baselinePath)} (${files.length} fichiers, ${fmt(total)})`);
    process.exit(0);
}

const baseline = existsSync(baselinePath) ? JSON.parse(readFileSync(baselinePath, 'utf8')) : null;
const baseMap = new Map((baseline?.files ?? []).map((f) => [f.file, f]));

console.log(`\n## Tailles dist/amalia (${report.date})${baseline ? ` — delta vs baseline du ${baseline.date}` : ''}\n`);
console.log('| Fichier | Taille | gzip | Δ taille |');
console.log('|---|---:|---:|---:|');
for (const f of files) {
    const base = baseMap.get(f.file);
    const delta = base ? fmtDelta(f.bytes - base.bytes) : '(nouveau)';
    console.log(`| ${f.file} | ${fmt(f.bytes)} | ${fmt(f.gzip)} | ${delta} |`);
    baseMap.delete(f.file);
}
for (const [name, base] of baseMap) {
    console.log(`| ~~${name}~~ | supprimé | | -${fmt(base.bytes)} |`);
}
const baseTotal = baseline?.total ?? 0;
console.log(`| **TOTAL** | **${fmt(total)}** | **${fmt(totalGzip)}** | **${baseline ? fmtDelta(total - baseTotal) : ''}** |`);
console.log();
