/**
 * Génère un jeu de pages de smoke jouables **hors réseau INA**.
 *
 * Pourquoi : les samples pointent leurs médias et leurs vignettes sur des hôtes internes
 * (`traitgpu03.wsmedia.p.sas.ina`, `image.wsmedia.d.sas.ina`, `lvltojson.wsmedia.d.sas.ina`)
 * et `samples/medias/` est volontairement vide. Hors du réseau INA, aucune des pages
 * principales ne charge de média, donc [SMOKE-CHECKLIST.md](../docs/refactoring/SMOKE-CHECKLIST.md)
 * n'est pas déroulable en l'état.
 *
 * Ce script réécrit les configs des samples en remplaçant `player.src` par un flux HLS
 * public, en neutralisant les dataSources injoignables et en pointant les vignettes sur
 * picsum. Les métadonnées locales (`samples/metadata/`) sont conservées telles quelles :
 * ce sont elles qui pilotent transcription, timeline et storyboard.
 *
 * Points d'attention encodés ici (découverts à la passe du 2026-08-12) :
 * - les clés de `pluginsConfiguration` sont suffixées par le **player-id**
 *   (`CONTROL_BAR-PLAYER`) : les pages doivent donc utiliser `player-id="PLAYER"`
 *   (`PLAYER1` pour base-config) sinon les plugins retombent sur leurs défauts ;
 * - `<amalia-timeline>` résout ses blocs par `<type>-<plugin-instance>` : `plugin-instance="P1"`
 *   correspond aux types `SEGMENTATION-P1` de `metadata/timeline-type.json` ;
 * - transcription et histogram exigent un `metadataIds` explicite dans
 *   `plugin-configuration`.
 *
 * Usage :
 *   npm run build:component            # copie main.js dans samples/
 *   node scripts/gen-smoke-offline.mjs
 *   npm run start-examples             # http://localhost:4203/_smoke-transcription.html
 *
 * Option `--ref <chemin-bundle>` : duplique chaque page en `_ref-*.html` servie par un
 * bundle antérieur (ex. `debug/amalia-2.1.24.min.js`). C'est le contrôle qui permet de
 * distinguer une régression d'un comportement pré-existant : si l'anomalie se reproduit
 * sur le bundle de référence, elle n'est pas imputable au chantier en cours.
 *
 * Les fichiers produits (`samples/_smoke-*`, `samples/_ref-*`) sont gitignorés.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SAMPLES = path.join(ROOT, "samples");
const CONFIGS = path.join(SAMPLES, "configs");

// Médias publics de substitution (vérifiés joignables en HTTP 200).
const VIDEO = "https://ccavmedia-dd.akamaized.net/c2pa/reuls/master.m3u8"; // ~120 s
const AUDIO = "https://playertest.longtailvideo.com/adaptive/captions/playlist.m3u8";
const THUMB = "https://picsum.photos/id/237/160/90";

const refBundle = (() => {
    const i = process.argv.indexOf("--ref");
    return i !== -1 ? process.argv[i + 1] : null;
})();

const readCfg = (name) => JSON.parse(fs.readFileSync(path.join(CONFIGS, `${name}.json`), "utf8"));
const writeCfg = (name, cfg) =>
    fs.writeFileSync(path.join(CONFIGS, `_smoke-${name}.json`), JSON.stringify(cfg, null, 1));

/** Retire les dataSources sur hôtes INA (bruit console) et remet des vignettes joignables. */
const reachable = (cfg) => {
    if (Array.isArray(cfg.dataSources)) {
        cfg.dataSources = cfg.dataSources.filter((d) => !/\.sas\.ina|\.ina\.fr/.test(d.url || ""));
    }
    cfg.thumbnail = { baseUrl: "https://picsum.photos/id/237/200/113", enableThumbnail: true };
    return cfg;
};

// --- configs -----------------------------------------------------------------

{
    const c = reachable(readCfg("notilus-config-transcription-player"));
    c.player.src = VIDEO;
    c.player.hls = { enable: true };
    delete c.player.crossOrigin;
    // metadata_transcription.json (bloc id=1) porte 131 entités nommées : c'est le cas qui
    // force l'hydratation complète du rendu @defer par mot (phase 8).
    c.dataSources.push({ url: "http://localhost:4203/metadata/metadata_transcription.json" });
    writeCfg("transcription", c);
}
{
    const c = reachable(readCfg("notilus-config-expert-player"));
    c.player.src = VIDEO;
    c.player.backwardsSrc = VIDEO;
    delete c.player.crossOrigin;
    writeCfg("expert", c);
}
{
    const c = reachable(readCfg("notilus-config-audio-expert-player"));
    c.player.src = AUDIO;
    c.player.backwardsSrc = AUDIO;
    delete c.player.crossOrigin;
    // Media audio : declenche le filigrane `.audio-watermark` du player (vectoriel inline).
    c.player.media = "AUDIO";
    writeCfg("histogram", c);
}
{
    const c = reachable(readCfg("base-config"));
    c.player.src = VIDEO;
    c.player.backwardsSrc = VIDEO;
    delete c.player.duration;
    c.player.hls = { enable: true };
    writeCfg("storyboard", c);
}

// --- pages -------------------------------------------------------------------

const page = (title, body) => `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>${title}</title>
<base href="/">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script src="main.js" type="module"></script>
<style>
  body { font-family: system-ui, sans-serif; margin: 0; padding: 8px; }
  h5 { margin: 4px 0 12px; }
  .box { border: 1px solid #ddd; }
</style>
</head>
<body>
<h5>${title}</h5>
${body}
</body>
</html>
`;

// Config audio minimale passee en ligne (cf. _smoke-audio-inline.html).
const INLINE_AUDIO_CONFIG = JSON.stringify({
    player: { src: AUDIO, media: "AUDIO", ratio: "16:9" },
    pluginsConfiguration: {},
}).replace(/'/g, "&apos;");

const pages = {
    "_smoke-transcription.html": page(
        "Smoke — transcription + storyboard",
        `
<div style="display:flex; gap:8px; align-items:flex-start;">
  <div class="box" style="width:520px;height:340px;">
    <amalia-player player-id="PLAYER" config="http://localhost:4203/configs/_smoke-transcription.json">
      <amalia-time-bar player-id="PLAYER"></amalia-time-bar>
      <amalia-control-bar player-id="PLAYER"></amalia-control-bar>
    </amalia-player>
  </div>
  <!-- La hauteur est portée par le conteneur, pas par le custom element : c'est ce qui rend
       .transcription scrollable et permet de tester l'auto-scroll. -->
  <div id="transcription" style="width:520px;height:340px;">
    <amalia-transcription player-id="PLAYER" style="border:1px solid #ddd"
      plugin-configuration='{"metadataIds":["6737"],"data":{"title":"smoke","parseLevel":1,"progressBar":true,"autoScroll":true,"withSubLocalisations":true}}'></amalia-transcription>
  </div>
  <div id="transcription-ne" style="width:520px;height:340px;">
    <amalia-transcription player-id="PLAYER" style="border:1px solid #ddd"
      plugin-configuration='{"metadataIds":["1"],"data":{"title":"entités nommées","parseLevel":1,"progressBar":true,"autoScroll":true,"withSubLocalisations":true}}'></amalia-transcription>
  </div>
</div>
<div class="box" style="width:1048px;height:170px;margin-top:8px;">
  <amalia-storyboard player-id="PLAYER" plugin-configuration='{"data":{"baseUrl":"${THUMB}","tcParam":"start"}}'></amalia-storyboard>
</div>`,
    ),

    "_smoke-expert.html": page(
        "Smoke — control-bar experte + subtitles",
        `
<div class="box" style="width:720px;height:460px;">
  <amalia-time-bar player-id="PLAYER"></amalia-time-bar>
  <amalia-player player-id="PLAYER" config="http://localhost:4203/configs/_smoke-expert.json">
    <amalia-subtitles player-id="PLAYER"></amalia-subtitles>
    <amalia-control-bar player-id="PLAYER"></amalia-control-bar>
  </amalia-player>
</div>`,
    ),

    "_smoke-timeline.html": page(
        "Smoke — timeline",
        `
<div style="display:flex; gap:8px; align-items:flex-start;">
  <div class="box" style="width:480px;height:320px;">
    <amalia-time-bar player-id="PLAYER"></amalia-time-bar>
    <amalia-player player-id="PLAYER" config="http://localhost:4203/configs/notilus-config-timeline-player.json">
      <amalia-control-bar player-id="PLAYER"></amalia-control-bar>
    </amalia-player>
  </div>
  <!-- plugin-instance="P1" : les blocs sont résolus par type SEGMENTATION-P1. -->
  <div class="box" style="width:700px;height:460px;">
    <amalia-timeline player-id="PLAYER" plugin-instance="P1" style="height:460px;display:block"></amalia-timeline>
  </div>
</div>`,
    ),

    "_smoke-histogram.html": page(
        "Smoke — histogram / waveform",
        `
<div class="box" style="width:720px;height:240px;">
  <amalia-player player-id="PLAYER" config="http://localhost:4203/configs/_smoke-histogram.json">
    <amalia-histogram player-id="PLAYER"
      plugin-configuration='{"metadataIds":["waveform-MA00605_01-2048-0"],"data":{"minimapHeight":30}}'></amalia-histogram>
    <amalia-control-bar player-id="PLAYER"></amalia-control-bar>
  </amalia-player>
  <amalia-time-bar player-id="PLAYER"></amalia-time-bar>
</div>`,
    ),

    // Config passee EN LIGNE (objet JSON dans l'attribut), comme le fait player-expert. C'est le
    // seul mode ou `playerConfig()` du composant expose `.player` : avec une URL de config, les
    // branches `media === 'AUDIO'` / `'PICTURE'` du template ne se declenchent pas (limitation
    // pre-existante). Cette page verifie donc le filigrane audio.
    "_smoke-audio-inline.html": page(
        "Smoke — filigrane audio (config en ligne)",
        `
<div class="box" style="width:640px;height:360px;">
  <amalia-player player-id="PLAYER" config='${INLINE_AUDIO_CONFIG}'>
    <amalia-control-bar player-id="PLAYER"></amalia-control-bar>
  </amalia-player>
</div>`,
    ),

    // Reprise de la structure de amalia-storyboard-plugin.html (conteneur sans hauteur,
    // itemPerLine 5, pas de player-id sur le plugin) avec des vignettes joignables.
    "_smoke-storyboard.html": page(
        "Smoke — storyboard (base-config)",
        `
<div style="display:flex; gap:8px; align-items:flex-start;">
  <div class="box" style="width:520px;height:340px;">
    <amalia-time-bar player-id="PLAYER1"></amalia-time-bar>
    <amalia-player player-id="PLAYER1" config="http://localhost:4203/configs/_smoke-storyboard.json">
      <amalia-control-bar player-id="PLAYER1"></amalia-control-bar>
    </amalia-player>
  </div>
  <div id="storyboard">
    <amalia-storyboard plugin-configuration='{"data":{"baseUrl":"${THUMB}","theme":"v","tcParam":"start","itemPerLine":5}}'>
    </amalia-storyboard>
  </div>
</div>`,
    ),
};

for (const [name, html] of Object.entries(pages)) {
    fs.writeFileSync(path.join(SAMPLES, name), html);
}

let refCopies = 0;
if (refBundle) {
    const src = path.resolve(ROOT, refBundle);
    if (!fs.existsSync(src)) {
        console.error(`--ref : bundle introuvable (${src})`);
        process.exit(1);
    }
    const refName = "_ref-bundle.js";
    fs.copyFileSync(src, path.join(SAMPLES, refName));
    for (const name of Object.keys(pages)) {
        const html = fs.readFileSync(path.join(SAMPLES, name), "utf8").replace('src="main.js"', `src="${refName}"`);
        fs.writeFileSync(path.join(SAMPLES, name.replace("_smoke-", "_ref-smoke-")), html);
        refCopies++;
    }
}

console.log(`Pages de smoke : ${Object.keys(pages).length} écrites dans samples/`);
if (refCopies) {
    console.log(`Pages de contrôle : ${refCopies} écrites (bundle ${refBundle} → samples/_ref-bundle.js)`);
}
console.log("Servir avec : npm run start-examples  →  http://localhost:4203/_smoke-transcription.html");
