// Analyse M2 (SMOKE-CHECKLIST.md) : ms de scripting / s et occupation du thread principal,
// par fenêtre bornée par des performance.mark('m2-...') dans une trace Chrome (CDP ou DevTools).
//
// Scénario producteur des marks (déroulé sur une page _smoke-*/_ref-* du harnais offline) :
//   m2-lecture-debut/-fin   -> lecture 0 -> 30 s
//   m2-seek, m2-drag-debut/-fin -> 1 seek + 36 pas de currentTime sur ~1,2 s
//   m2-mousemove-debut/-fin -> 10 s de mousemove synthétiques ~40 Hz au-dessus du player
//
// « scripting » = union d'intervalles des événements JS (pas de double comptage des
// imbrications) ; « busy » = union de tous les événements complets du thread des marks.
//
// usage : node scripts/perf-m2-analyse.mjs <trace.json[.gz]>
import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';

const file = process.argv[2];
if (!file) { console.error('usage: node scripts/perf-m2-analyse.mjs <trace.json[.gz]>'); process.exit(1); }

let raw = readFileSync(file);
if (file.endsWith('.gz')) raw = gunzipSync(raw);
const json = JSON.parse(raw.toString('utf8'));
const events = Array.isArray(json) ? json : json.traceEvents;

// 1) Marks m2-* -> pid/tid du renderer + bornes de fenêtres
const marks = {};
let markPid = null, markTid = null;
for (const e of events) {
    if (e.cat && e.cat.includes('blink.user_timing') && typeof e.name === 'string' && e.name.startsWith('m2-')) {
        marks[e.name] = e.ts;
        markPid = e.pid; markTid = e.tid;
    }
}
if (markPid === null) { console.error('aucun mark m2-* trouvé'); process.exit(2); }

// Le thread des marks est le CrRendererMain de notre page (les user timings y sont émis).
const windows = {
    lecture: [marks['m2-lecture-debut'], marks['m2-lecture-fin']],
    'seek+drag': [marks['m2-seek'], marks['m2-drag-fin']],
    mousemove: [marks['m2-mousemove-debut'], marks['m2-mousemove-fin']],
};

// 2) Événements complets (ph=X) du thread principal
const SCRIPT_NAMES = new Set([
    'FunctionCall', 'EvaluateScript', 'v8.run', 'V8.Execute', 'RunMicrotasks',
    'TimerFire', 'FireAnimationFrame', 'FireIdleCallback', 'EventDispatch',
    'MajorGC', 'MinorGC', 'V8.GCFinalizeMC', 'BlinkGC.AtomicPhase',
]);
const xAll = [];
const xScript = [];
for (const e of events) {
    if (e.pid !== markPid || e.tid !== markTid || e.ph !== 'X' || !(e.dur > 0)) continue;
    const iv = [e.ts, e.ts + e.dur];
    xAll.push(iv);
    if (SCRIPT_NAMES.has(e.name)) xScript.push(iv);
}

// 3) Union d'intervalles bornée à une fenêtre
function unionMs(intervals, [a, b]) {
    const clipped = intervals
        .filter(([s, t]) => t > a && s < b)
        .map(([s, t]) => [Math.max(s, a), Math.min(t, b)])
        .sort((x, y) => x[0] - y[0]);
    let total = 0, curS = null, curT = null;
    for (const [s, t] of clipped) {
        if (curT === null || s > curT) { if (curT !== null) total += curT - curS; curS = s; curT = t; }
        else if (t > curT) curT = t;
    }
    if (curT !== null) total += curT - curS;
    return total / 1000; // µs -> ms
}

const out = { fichier: file.split(/[\\/]/).pop(), fenetres: {} };
for (const [nom, [a, b]] of Object.entries(windows)) {
    if (a === undefined || b === undefined) { out.fenetres[nom] = 'marks absents'; continue; }
    const dureeS = (b - a) / 1e6;
    const busy = unionMs(xAll, [a, b]);
    const script = unionMs(xScript, [a, b]);
    out.fenetres[nom] = {
        duree_s: +dureeS.toFixed(2),
        scripting_ms: +script.toFixed(1),
        scripting_ms_par_s: +(script / dureeS).toFixed(1),
        busy_ms: +busy.toFixed(1),
        busy_ms_par_s: +(busy / dureeS).toFixed(1),
    };
}
console.log(JSON.stringify(out, null, 2));
