# Plan de refactoring performance — post-migration Angular 21 / PrimeNG 21

> Document maître du chantier. Créé le 2026-07-22. Branche : `refactor/perf-v21`.
> Documents liés : [SMOKE-CHECKLIST.md](SMOKE-CHECKLIST.md) · [SETTIMEOUT-AUDIT.md](SETTIMEOUT-AUDIT.md) · [size-baseline.json](size-baseline.json)

## Suivi

| Phase | Contenu | Statut | Date | Commit/PR |
|---|---|---|---|---|
| 0 | Persistance du plan + baseline + size-report | ✅ | 2026-07-22 | ff720d9 |
| 1 | Quick wins (package.json, coalescing, templates chauds, animations) | ✅ (lint + 856 specs + build ; main.js −62 Ko) | 2026-07-23 | 7e8c757 |
| 2 | Builder esbuild + karma moderne | ✅ (lint + 856 specs + build ; dist −361 Ko, styles.css −188 Ko, −396 paquets npm ; EventEmitter interne remplace le builtin 'events') | 2026-07-23 | |
| 3 | Dédup styles (miroir shadow, theme.css, primeflex, primeicons) | ✅ code+tests (main.js 5,93→3,53 Mo −40 %, styles.css 723 Ko→18 o, polices −1,49 Mo) — **smoke visuel à dérouler avant merge** | 2026-07-23 | 3 commits |
| 4 | Réductions JS (lodash, hls type-only) + tsconfig | ✅ (lint + 856 specs + build mono-fichier ; main.js −50,7 Ko / −17,3 Ko gzip) | 2026-07-23 | |
| 5 | Standalone + `createApplication()` | ✅ (lint + 858 specs + build mono-fichier ; main.js −44,2 Ko / −5,9 Ko transfert ; app.module.ts supprimé → bootstrap.ts) | 2026-07-23 | |
| 6 | `PlaybackState` signals + politique de zone PluginBase | ✅ (lint + 876 specs dont 17 nouvelles playback-state + build mono-fichier ; main.js 3,44 Mo stable, comportement inchangé — défaut `'zone'`) | 2026-07-23 | |
| 7 | OnPush vague 1 (sûrs) | ✅ (lint + 876 specs + build mono-fichier ; main.js 3,44 Mo stable ; ina-messages/toast/subtitles/time-bar en OnPush — subtitles et time-bar consomment PlaybackState via computeds, listeners TIME_CHANGE/DURATION_CHANGE/SEEKING supprimés, 4 detectChanges manuels retirés du toast) | 2026-07-23 | |
| 7 | OnPush vague 2 (moyens) | ✅ (lint + 876 specs après chaque composant + build mono-fichier + size-report ; main.js 3,44 Mo stable ; storyboard/histogram/transcription/timeline en OnPush — état template signalisé (displaySynchro, openIntervalList, listOfThumbnailFilter, displayState, inset histogram, searching/typing/index/listOfSearchedNodes/transcriptions, duration/focusTcIn/focusTcOut/configIsOpen), TIME_CHANGE/SEEKED/SEEKING/mousemove en policy 'none', wavesurfer + observers + interactjs hors zone, 1 detectChanges supprimé (histogram), 2 conservés commentés (timeline) ; METADATA_LOADED/USER_SEGMENT_CHANGED de la timeline volontairement en 'zone') | 2026-07-23 | |
| 7 | OnPush vague 3 (durs) | ✅ (lint + 876 specs après chaque composant + build mono-fichier + size-report ; main.js 3,45 Mo stable ; amalia/control-bar/annotation/segment en OnPush → **13/13 composants OnPush** — amalia : 14 champs template signalisés (state, inLoading, inError, pinned…, playerConfig), 3 detectChanges structurels conservés commentés ; control-bar : ~37 champs → signals, TIME_CHANGE/DURATION_CHANGE et 11 autres listeners en 'none' (handlers = écritures de signals ; pas de computeds playback : sémantique inverse/reverse/drag non dérivable), 2 blocs ngZone.run et 6 markForCheck supprimés, PLAYING/PAUSED/ENDED en 'schedule' pour les lectures isPaused() du template, controlsByZone conservé (notifié par le signal controls) ; annotation+segment : boucles annotation.cdr.detectChanges() croisées remplacées par le signal AnnotationsService.refreshedBy + effect par instance, liste mutée en place notifiée par segmentsVersion/segments() + input refreshHint vers les segments, dataLoading doublé du signal dataLoadingState, valueChanges → takeUntilDestroyed + markForCheck, 2 detectChanges supprimés (onEnter categories/keywords), 7 conservés commentés (contextes timer Utils.waitFor / AutoComplete) ; audit setTimeout des 4 composants soldé dans SETTIMEOUT-AUDIT.md) | 2026-07-23 | |
| 8 | Hors-zone + `@defer` transcription + audit setTimeout | ✅ (lint + 887 specs dont 11 nouvelles + build mono-fichier sans chunk ; main.js 3,46 Mo stable ; directives `OutsideZone{Mousemove,Scroll}Directive` (runOutsideAngular + throttle rAF, input-callback — pas d'output pour éviter le markViewDirty du wrapListener) appliquées au mousemove racine du player et aux scroll/mousemove transcription+storyboard (click/keydown et drag progress-bar restent in-template) ; transcription : `@defer (on viewport; when forceRenderAll() \|\| t.tcIn === activeSegmentTcIn())` par segment, placeholder = texte brut isométrique, `track t.tcIn`/`track w.tcIn`, feature-flag `data.deferredRendering` (défaut true), recherche/entités nommées forcent l'hydratation puis re-sélectionnent via afterNextRender, seek en pause couvert par le when activeSegmentTcIn + re-sélection karaoké one-shot ; audit setTimeout soldé : 2 conversions (c) en `PluginBase.runAfterNextRender` (transcription handleMetadataLoaded, storyboard handleMetadataLoaded), 1 (b) markForCheck (timeline updateTreeComponent, TreeNode PrimeNG), le reste trié (a) — TOUT ✅ dans SETTIMEOUT-AUDIT.md) | 2026-08-10 | |
| 9 | Zoneless | 🟡 **préparée** — `provideZonelessChangeDetection()` sélectionné par `environment.zoneless` (bootstrap.ts), config de build/serve `zoneless` pour valider dès maintenant (`ng serve -c zoneless`). Gates code soldés (13/13 OnPush, audit setTimeout ✅, politiques compatibles NgZone noop). **Flip final = `zoneless: true` dans environment.prod.ts + retrait de l'import zone.js dans main.ts, APRÈS ≥ 1 cycle de release en prod des phases 1-8** | 2026-08-10 | |
| 10 | Budgets finaux, CHANGELOG, docs | ✅ (budgets initial 3,6/4 Mo + anyComponentStyle 100/200 Ko ; CHANGELOG 2.1.26-develop ; PLAYER_EXPERT_INTEGRATION.md corrigé — le concat n'existe plus ; environment.prod.ts corrigé production: true) | 2026-08-10 | |
| 8bis | **Correctif post-smoke : rendu différé de la transcription réellement différé** | ✅ (lint + **892 specs** dont 5 nouvelles + build mono-fichier ; 3,46 Mo / 954,0 Ko gzip) — le surlignage des entités nommées passait par `querySelectorAll` et forçait l'hydratation de **tous** les blocs `@defer` dès qu'un segment portait une annotation (cas dominant : 127/151 segments sur un flux TV réel). Il est désormais marqué sur les données (`TranscriptionLocalisation.isNamedEntity` via `markNamedEntities`, appelé par `parseTranscription`) et rendu par `[class.named-entity]`. Mesure sur le panneau à entités nommées : **5 194 → 77 mots rendus au chargement** (−98,5 %), 116 placeholders restaurés, `forceRenderAll` déclenché par la seule recherche ; parité vérifiée (255 surlignages identiques après hydratation globale). Suppression au passage de 4 helpers DOM et du `Utils.waitFor` de `ngAfterViewInit` | 2026-08-12 | |
| — | **Smoke visuel avant merge** | 🟡 **quasi complet** — 2 passes du 2026-08-12 dans [SMOKE-CHECKLIST.md](SMOKE-CHECKLIST.md) : (1) hors réseau, sur harnais isolé — control-bar experte, transcription, timeline/interactjs, toast, 0 fuite de listeners ; 6 anomalies rejouées sur le bundle pré-chantier 2.1.24 ⇒ toutes pré-existantes. (2) **sur réseau INA dans `player-expert`** (bundle identique au bit près au build de branche) — HLS/hls.js, `backwardsSrc`, vignettes de survol, plein écran réel, storyboard réel, **waveform wavesurfer**, **mode photo/cropperjs** tous ✅. **Restent** : 2 défauts à traiter (404 `media/newAudioBackGround.png` qui casse le contrat mono-fichier ; `@defer` annulé par les entités nommées), l'annotation/export bloquée par un 500 backend dev, et les mesures M1/M2 | 2026-08-12 | |

## Contexte

La migration Angular 18→21 / PrimeNG 17→21 est fonctionnellement terminée (control flow `@if/@for` partout, API PrimeNG 21 propres, thème token-based `providePrimeNG` en place). Mais aucun des leviers de performance rendus possibles par Angular 21 n'est exploité :

- **Build** : builder Webpack legacy (`ngx-build-plus:browser` v20) au lieu de la chaîne esbuild `@angular/build:application` → `main.js` de **5,9 Mo**, lodash entier importé dans 8 fichiers, budgets angular.json (7/12 Mo) inopérants.
- **Runtime** : zone.js + CD `Default` sur les 13 composants (0 OnPush). Chaque `timeupdate` vidéo déclenche ~7 ré-entrées de zone (`PluginBase.wrapInZone` → `zone.run` + `markForCheck`, `plugin-base.ts:192-206`) = 7 change detections complètes de l'arbre. ~29 `detectChanges()/markForCheck()` manuels compensent. Signals quasi absents (3 fichiers).
- **Styles** : double thème actif — preset token-based PrimeNG 21 **et** ancien `aura-light-blue/theme.css` (244 Ko) ré-importé dans 4 SCSS Shadow DOM → theme.css + primeflex + primeicons embarqués 4× dans main.js (~1,4 Mo mesuré), et ~3 Mo de CSS dupliqué à runtime dans les 9 shadow roots.
- **Transcription** : un `<div>` par mot, sans virtualisation, re-vérifié à chaque CD.

## Décisions actées (2026-07-22)

1. **Distribution : fichier unique** — le contrat `amalia-<version>.min.js` seul est conservé. Pas de lazy chunks ; un garde-fou dans le build échoue si un chunk apparaît. (Lazy possible plus tard : `import()` résout relatif à `import.meta.url`, le passage à un « dossier » resterait faisable.)
2. **Zoneless : oui, jusqu'au bout** — phase finale avec garde-fous (audit des 118 setTimeout, config `zoneful` de secours pendant 1 release).
3. **primeicons : suppression** — les 22 usages `pi pi-*` migrent vers le sprite SVG maison (corrige au passage les glyphes vraisemblablement déjà cassés en mono-fichier : `@font-face` ignoré dans les shadow roots).

Faits vérifiés clés : les consommateurs chargent déjà en `<script type="module">` (samples + `docs/PLAYER_EXPERT_INTEGRATION.md`) → sortie ESM d'esbuild compatible. PrimeNG 21 n'a aucune référence à `@angular/animations` (vérifié dans fesm2022) → module supprimable. PrimeNG 21 injecte ses styles uniquement dans `document.head` (pas d'option shadow) → service de miroir nécessaire. hls.js n'est que type-only dans `player-config-data.ts`. lodash 4.18.1 s'installe correctement sur le registre utilisé.

## Architecture cible (runtime)

Un **store de signals `PlaybackState`** (framework-free, 1 instance par `MediaPlayerElement`), alimenté **hors zone** depuis l'EventEmitter Node existant. Depuis Angular 18 (stable en 21), le scheduler hybride fait qu'une écriture de signal hors zone programme un `ApplicationRef.tick()` coalescé — en mode zone **et** zoneless. Les composants migrent donc un par un vers `playback.currentTime()` etc., et le zoneless final n'est qu'un swap de provider. L'EventEmitter reste la source de vérité pour l'API événementielle publique (aucun breaking change host-page).

---

## Phases (chacune = livraison indépendante, avec gates)

**Gates systématiques** : `ng lint` + `npm test` (887 specs vertes en fin de chantier) + `npm run build:component` + `node scripts/size-report.mjs` + [SMOKE-CHECKLIST.md](SMOKE-CHECKLIST.md).

### Phase 0 — Persistance du plan + baseline

1. Ce document + SMOKE-CHECKLIST.md + SETTIMEOUT-AUDIT.md dans `docs/refactoring/`.
2. `scripts/size-report.mjs` : parcourt `dist/amalia/`, écrit `{file, bytes, gzip}`, delta vs `docs/refactoring/size-baseline.json` (`--update-baseline`).
3. Baseline : min.js 5,93 Mo / styles.css 723 Ko / polices 1,49 Mo. Profil Angular DevTools sur samples (30 s lecture + seek + drag + mousemove) : ticks (M1), ms scripting (M2), latence drag (M3), fuite listeners après 5 attach/detach (M4).

### Phase 1 — Quick wins

1. **Hygiène package.json** : supprimer deps `ci`, `s`, `dompurify`, `mini-css-extract-plugin` ; déplacer `@types/*` (cropperjs/file-saver/msgpack-lite) en devDeps ; déplacer `msgpack-lite` en dependencies (importé en prod par `default-metadata-loader.ts`) ; supprimer `codelyzer`, `@types/jasminewd2`. lodash : ne pas toucher au pin.
2. **Coalescing zone** (`src/main.ts`) : `bootstrapModule(AppModule, { ngZoneEventCoalescing: true, ngZoneRunCoalescing: true })`. Ne pas utiliser `__zone_symbol__UNPATCHED_EVENTS` (casserait le drag progress-bar et le scroll transcription).
3. **Mémoïser `getControlsByZone`** (`control-bar-plugin.component.ts:1045`, appelé depuis un `@for` du template) : structure `controlsByZone[zone]` reconstruite aux affectations de `this.elements`.
4. **Supprimer les 8 bindings-fonctions** de `segment.component.html` (`textLatoWidthHigherThan(...)` etc.) : champs précalculés ou `computed()` ; cache `(text, font)` pour les mesures canvas.
5. **Supprimer `BrowserAnimationsModule`** + dep `@angular/animations` (0 animation Angular dans l'app, PrimeNG 21 = CSS). Smoke : ConfirmDialog/Toast/Tooltip/AutoComplete/Tree/Accordion.

### Phase 2 — Builder esbuild + karma moderne

1. `src/main.ts` absorbe les polyfills : `import 'zone.js'; import '@ungap/custom-elements';` en tête. Supprimer `src/polyfills.ts`.
2. `angular.json` : `builder: "@angular/build:application"`, `browser: "src/main.ts"`, `polyfills: []`, `outputPath: { base: "dist/amalia", browser: "" }`, `outputHashing: "none"` en prod, budgets anti-régression (initial 6 Mo warn/6,5 Mo err). Supprimer la target `e2e` morte. `serve` → `@angular/build:dev-server`.
3. `build-web-component.js` : concat → **copy + garde-fou** (échec si un chunk `.js` inattendu apparaît dans dist).
4. Tests : `test.builder` → `@angular/build:karma` ; nettoyer `karma.conf.js` ; purger les reporters inutilisés. Vitest différé (builder `unit-test` encore expérimental).
5. Deps : `@angular/build` en devDeps directes ; supprimer `ngx-build-plus`, `concat`, puis `@angular-devkit/build-angular`.
6. Vérif : dist sans `runtime/polyfills/scripts.js`, pas de chunk, `customElements.get('amalia-player')` OK.

### Phase 3 — Dédup styles (~1,4 Mo de main.js, le plus gros gain)

1. **Nouveau `src/app/core/styles/primeng-shadow-styles.service.ts`** : miroir des `<style data-primeng-style-id>` de `document.head` vers des `CSSStyleSheet` construites (`replaceSync`), adoptées par chaque shadow root, avec `MutationObserver`. Accroches : `PluginBase.ngOnInit` + `amalia.component.ts`. Vérifier l'absence de FOUC.
2. **Supprimer le thème legacy** : retirer `@import '../../../styles.scss'` de transcription/timeline/annotation/segment `.scss` ; purger `styles.scss` et les `styles[]` d'angular.json (build **et** test) ; supprimer `src/assets/themes/`.
3. **Supprimer primeflex** (~10 usages) : utilitaires locaux SCSS.
4. **Supprimer primeicons** : remplacer les 22 `pi pi-*` par le sprite SVG maison ; ajuster les specs timeline (~3864, 4989-5038) et ina-messages.
5. Différé (PR de suivi) : audit des redéclarations structurelles PrimeNG à la main (~4000 lignes) ; 4 `::ng-deep`.
6. Attendu : main.js ~4,4 Mo ; styles.css ~5 Ko ; polices dist 0.

### Phase 4 — Réductions JS + tsconfig

1. **lodash par méthode** (pas lodash-es) dans les 8 fichiers (throttle×3, sortBy×2, filter×2, debounce, orderBy, find, map, trim, range). ~65-90 Ko.
2. **hls.js type-only** : `player-config-data.ts` `import * as Hls` → `import type { HlsConfig }`.
3. **tsconfig** : `isolatedModules: true` (corriger les ré-exports de types de `public-api.ts` en `export type`) ; **garder `useDefineForClassFields: false`** (subclassing hls.js `Loader`) ; ajouter `noImplicitOverride`, `noImplicitReturns`, `noFallthroughCasesInSwitch`.

### Phase 5 — Standalone + bootstrap `createApplication()`

1. `ng generate @angular/core:standalone --mode convert-to-standalone` ; revue manuelle des `imports` du control-bar et des `schemas` ; puis `ng generate @angular/core:inject`.
2. **Nouveau `src/app/bootstrap.ts`** : `createApplication({ providers: [provideZoneChangeDetection({eventCoalescing, runCoalescing}), provideHttpClient(), services, providePrimeNG(...)] })` + `customElements.define(...)` ×9. Supprimer `app.module.ts` (remplace aussi `HttpClientModule` déprécié).
3. **Specs** : `declarations:` → `imports:` (~10 specs) ; specs `new` insensibles ; `app.module.spec.ts` réécrit sur `bootstrapAmaliaElements()`.
4. Phase neutre en comportement → tag de rollback.

### Phase 6 — `PlaybackState` signals + politique de zone PluginBase

1. **Nouveau `src/app/core/state/playback-state.ts`** : signaux `currentTime/duration/playing/volume/muted/playbackRate/seekingTime/fullscreen/displayState` + computeds `displayTime`, `progressPercent` ; `connect(emitter, media)` hors zone ; dédup par `Object.is`. Instancié dans `media-player-element.ts`, connecté dans `setMediaPlayer`. Spec unitaire pure sans TestBed.
2. **`plugin-base.ts`** : `wrapInZone` → `wrapForCd(func, policy)` avec `ListenerZonePolicy = 'zone' | 'schedule' | 'none'`. **Conserver la préservation du `name`** (la dédup d'`Utils` matche par nom). Signature `addListener` inchangée.
3. Livrable sans changement de comportement (défaut `'zone'`).

### Phase 7 — OnPush par vagues (1 composant = 1 livraison)

Recette : champs template-bound → signals ; champs EventEmitter → computeds `playback.*` ou listeners `'schedule'` ; setTimeout mutateurs → signals ; flip OnPush ; suppression des cdr manuels. Dev : `provideCheckNoChangesConfig({ exhaustive: true })`.

- **Vague 1 (sûrs)** : ina-messages, toast, subtitles (PR modèle : supprime son listener TIME_CHANGE, `subTitle` = computed), time-bar.
- **Vague 2 (moyens)** : storyboard (TIME_CHANGE throttlé → `'none'`), histogram (déjà rAF-coalescé → `'none'`, wavesurfer hors zone), transcription (karaoké tout-DOM → `'none'`), timeline (interactjs hors zone).
- **Vague 3 (durs)** : amalia.component (garder les 2 `detectChanges` structurels :287), control-bar (computeds playback, `inSliding` signal, suppression des `ngZone.run` et markForCheck), annotation+segment en dernier (tuer les boucles `annotation.cdr.detectChanges()` via état signalisé dans `AnnotationsService` ; `@Input` → `input()` ; `valueChanges` → `takeUntilDestroyed`).

### Phase 8 — Événements hors zone + `@defer` transcription

1. **Directive `out-of-zone-events`** (`runOutsideAngular` + rAF, handler écrit des signals) : `(mousemove)` racine player, `(scroll)`/`(mousemove)` transcription et storyboard. Le drag progress-bar reste in-template.
2. **Triage des 118 setTimeout** ([SETTIMEOUT-AUDIT.md](SETTIMEOUT-AUDIT.md)) : (a) DOM/timing pur → inchangé ; (b) mutation d'état template → signal (gate zoneless) ; (c) « attendre le rendu » → `afterNextRender()`.
3. **Transcription : `@defer (on viewport)` par segment, PAS cdk-virtual-scroll** (hauteurs variables + karaoké/recherche reposant sur `querySelectorAll`). Placeholder = texte brut (hauteur ≈ conservée) ; signal `forceRenderAll` (recherche/entités nommées) ; `track t.tcIn`/`track w.tcIn` ; feature-flag config `data.deferredRendering` (défaut on).

### Phase 9 — Zoneless

**Gates durs** : audit setTimeout b/c soldé ; tous les composants OnPush ; plus aucun listener `'zone'` ; phases 1-8 en prod ≥ 1 cycle de release.

1. `bootstrap.ts` : `provideZoneChangeDetection(...)` → `provideZonelessChangeDetection()`.
2. Retirer `import 'zone.js'` de main.ts.
3. `plugin-base.ts` : supprimer `_pluginZone` et la branche `'zone'`.
4. Karma : garder `zone.js` + `zone.js/testing` côté tests ; `provideZonelessChangeDetection()` dans les TestBed progressivement.
5. **Rollback** : revert 1 commit + configuration `zoneful` conservée dans angular.json pendant 1 release.

### Phase 10 — Budgets finaux, docs, clôture

- Budgets : initial 4,2 Mo warn / 4,5 Mo err ; anyComponentStyle 100 Ko warn / 200 Ko err.
- Vérifier `docs/README.md` et `docs/PLAYER_EXPERT_INTEGRATION.md` (contrat mono-fichier inchangé) ; CHANGELOG ; tableau de tailles final.

## Projection chiffrée

| Artefact | Baseline | Ph. 2 (esbuild) | Ph. 3 (styles) | Ph. 4 (JS) | Ph. 9 (zoneless) |
|---|---|---|---|---|---|
| min.js | 5,93 Mo | ~5,6 Mo | ~4,4 Mo | ~4,3 Mo | ~4,25 Mo |
| styles.css | 723 Ko | 723 Ko | ~5 Ko | — | — |
| Polices dist | 1,49 Mo | 1,49 Mo | 0 | — | — |
| CD par timeupdate | 7 ticks full-tree | 1 tick coalescé (ph. 1) | — | — | 1 tick, vues OnPush touchées seules |
| Build prod | minutes (webpack) | ~10-30 s | — | — | — |

## Risques principaux

| Risque | Mitigation |
|---|---|
| Coalescing : latence 1 frame sur drag/menus | Option 1 ligne, revert immédiat |
| Standalone : import manquant silencieux en shadow DOM | Schematic + type-check build + specs ; phase neutre taguée |
| Suppression theme.css : régressions visuelles dans les 4 scopes PrimeNG | Miroir 3.1 posé AVANT la suppression 3.2 ; commits séparés ; checklist visuelle |
| OnPush : vue figée par notification manquée | 1 composant/livraison ; `provideCheckNoChangesConfig({exhaustive})` en dev ; revert par composant |
| @defer transcription : recherche sur blocs non hydratés | `forceRenderAll`, placeholder isométrique, feature-flag config |
| Zoneless : un setTimeout mutateur oublié fige le rendu | Gate = audit exhaustif ; config `zoneful` de secours 1 release |

## Hors scope (différé explicitement)

- Migration vitest (`@angular/build:unit-test` encore expérimental) — réévaluer à Angular 22.
- `strict: true` global TypeScript — chantier séparé.
- Réécriture cdk-virtual-scroll de la transcription — seulement si le `@defer` ne suffit pas sur les flux multi-heures.
- Audit complet des ~4000 lignes de CSS structurel PrimeNG redéclaré à la main — PR de suivi après la phase 3.
