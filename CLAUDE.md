# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projet

Amalia (`@ina/amalia`) est un player multimédia HTML5 extensible (Angular 21 + PrimeNG 21), packagé en **Web Components** (Angular Elements). Il expose l'élément `amalia-player` et 8 plugins custom elements (time-bar, control-bar, transcription, subtitles, storyboard, histogram, timeline, annotation) — la liste est dans `src/app/bootstrap.ts` (`AMALIA_CUSTOM_ELEMENTS`).

La langue de travail du dépôt est le **français** (commentaires, docs, messages de commit).

## Commandes

```sh
npm start                  # dev server sur http://localhost:4210 (build:icon inclus)
npm run start-examples     # sert samples/ sur http://localhost:4203
npm test                   # tests unitaires, une passe headless + coverage (ChromeHeadlessCI)
npm run test-watch         # tests en mode watch
npm run lint               # ng lint (aussi exécuté par le hook husky pre-commit)
npm run build              # lint + icônes + build composant + types + package.json publiable
npm run build:component    # ng build prod + build-web-component.js (contrat mono-fichier)
npm run build:icon         # régénère le sprite SVG depuis src/styles/svgs/*.svg
node scripts/size-report.mjs   # tailles dist/ + delta vs docs/refactoring/size-baseline.json
```

Lancer un seul fichier de specs (le builder `@angular/build:karma` supporte `--include`) :

```sh
ng test --watch=false --browsers=ChromeHeadlessCI --include='**/time-bar/*.spec.ts'
```

Tests : Jasmine/Karma. Rapports JUnit dans `target/surefire-reports/`, couverture dans `coverage/`.

## Contrat de distribution : fichier unique

Le build livre **un seul bundle** `dist/amalia/amalia-<version>.min.js` (ESM), consommé tel quel par les applications hôtes (cf. `docs/PLAYER_EXPERT_INTEGRATION.md`). `build-web-component.js` **fait échouer le build** si un chunk JS inattendu apparaît dans `dist/amalia/` — donc pas d'`import()` dynamique ni de worker qui créerait un chunk.

## Architecture

### Bootstrap sans composant racine

Pas d'app Angular classique : `src/main.ts` charge les polyfills (zone.js, `@ungap/custom-elements`) puis `bootstrapAmaliaElements()` (`src/app/bootstrap.ts`) crée l'application via `createApplication()` et enregistre les custom elements. Tous les composants sont **standalone** (aucun NgModule) et portent leurs propres imports.

### Objet runtime central : `MediaPlayerElement`

`src/app/core/media-player-element.ts` orchestre par instance de player : chargement de la configuration (`ConfigData`, cœur + `pluginsConfiguration`), chargement/parsing des métadonnées (`MetadataManager`, avec refresh du header Authorization), câblage du `<video>`/`<audio>` et émission des événements (`PlayerEventType`, via l'`EventEmitter` maison de `src/app/core/utils/event-emitter.ts` — c'est la source de vérité de l'API événementielle publique).

`MediaPlayerService` maintient une map `playerId -> MediaPlayerElement` : le player et ses plugins partagent la même instance via l'attribut `player-id`.

### Système de plugins

Chaque plugin étend `PluginBase<T>` (`src/app/core/plugin/plugin-base.ts`) : il reçoit un `playerId`, récupère le `MediaPlayerElement` correspondant, et fusionne sa configuration (défauts du plugin + config globale du player + attribut/input direct). Les listeners d'événements player déclarent une `ListenerZonePolicy` (`'zone'` | `'schedule'` | `'none'`) qui pilote leur interaction avec la change detection — voir les commentaires dans plugin-base.ts avant d'en changer une.

### Store de signals `PlaybackState`

`src/app/core/state/playback-state.ts` : store framework-free (uniquement `signal`/`computed`), **1 instance par `MediaPlayerElement`** (pas un service DI), alimenté hors zone depuis l'EventEmitter interne. Grâce au scheduler hybride d'Angular ≥18, une écriture de signal hors zone programme un tick coalescé : les composants consomment `playback.currentTime()` etc. sans `zone.run` ni `markForCheck`. Pour tout nouveau besoin d'état de lecture dans un composant, préférer ce store aux listeners d'événements + CD manuelle.

### Shadow DOM et styles PrimeNG

La plupart des composants utilisent l'encapsulation Shadow DOM. PrimeNG 21 (theming par design tokens, preset `AmaliaPreset` dans `src/app/core/styles/amalia-primeng-preset.ts`) n'injecte ses styles que dans `document.head` : `PrimengShadowStylesService` les **miroite** vers chaque shadow root (balises `<style>` insérées en tête du root — l'ordre préserve la cascade historique : PrimeNG d'abord, surcharges du composant ensuite — suivies par `MutationObserver`). Ne jamais ré-importer de CSS de thème dans un SCSS de composant. Les icônes viennent du sprite SVG maison (`npm run build:icon`, usage `<svg><use xlink:href="/assets/svgs/symbol/svg/sprite.symbol.svg#id">`) — primeicons et primeflex ont été supprimés.

## Chantier refactoring performance : livré (branche `refactor/perf-v21`)

Document maître : `docs/refactoring/PLAN-PERF-2026.md` (suivi des phases, décisions actées) — **à maintenir** pour tout travail lié. Toutes les phases sont livrées (main.js 5,93 → 3,46 Mo, 13/13 composants OnPush, 887 specs), sauf :
- **Flip zoneless** : préparé mais différé — `ng serve -c zoneless` active `provideZonelessChangeDetection()` via `environment.zoneless` ; le flip définitif (flag en prod + retrait de l'import zone.js dans main.ts) attend ≥ 1 cycle de release en prod.
- **Smoke visuel avant merge** : dérouler `docs/refactoring/SMOKE-CHECKLIST.md` sur les samples.

Gates systématiques pour toute évolution : `ng lint` + `npm test` + `npm run build:component` (garde mono-fichier + budgets 3,7/4 Mo) + `node scripts/size-report.mjs`.

Règles issues du chantier (à respecter dans tout nouveau code) :
- **Tous les composants sont `OnPush`** : tout champ lu par un template et muté hors handler de template (événement player, `setTimeout`, promesse, observer) doit être un `signal`/`computed`. Pour l'état de lecture, consommer `PlaybackState` ; pour les listeners player, choisir la `ListenerZonePolicy` la plus faible possible (`'none'` si le handler n'écrit que des signals ou du DOM).
- Nouveaux `setTimeout` : suivre la grille de `docs/refactoring/SETTIMEOUT-AUDIT.md` (catégories a/b/c ; « attendre le rendu » = `afterNextRender`, jamais `setTimeout(0)`) — c'est ce qui garde le code zoneless-safe.
- Événements DOM haute fréquence (mousemove/scroll) : directives `amaliaOutsideMousemove`/`amaliaOutsideScroll` (`src/app/core/directive/outside-zone-event.directive.ts`), handlers en écritures de signals.
- Ne pas réintroduire lodash entier (`import ... from 'lodash'`) : imports par méthode (`lodash/xxx`). hls.js n'est importé qu'en type-only dans les modèles de config.
- La transcription rend les mots en `@defer` par segment (flag `data.deferredRendering`) : tout nouveau code qui fait du `querySelectorAll` sur les mots (`.w`) doit gérer l'hydratation (cf. `hydrateAllWordsThen`).
- `MIGRATION-ANGULAR21-PRIMENG21.md` documente les breaking changes PrimeNG 17→21 (dont `<p-messages>` remplacé par le composant maison `InaMessagesComponent`).
