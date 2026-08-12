# CHANGELOG

## 2.1.26-develop (non publiée) — refactoring performance post-migration

Chantier `refactor/perf-v21` (plan et suivi : `docs/refactoring/PLAN-PERF-2026.md`). Aucun changement d'API publique : le contrat mono-fichier `amalia-<version>.min.js` (`<script type="module">`) et l'API événementielle host sont inchangés.

**Chiffres** : `main.js` 5,93 → 3,46 Mo (−41 %, gzip 1,19 Mo → 954 Ko), `styles.css` 723 Ko → 18 octets, 1,49 Mo de polices sorties du dist, build de production de plusieurs minutes → ~20 s, et pendant la lecture : 1 tick de change detection coalescé ciblé au lieu de 7 vérifications complètes de l'arbre par `timeupdate`.

* **Build** : migration Webpack (`ngx-build-plus`) → esbuild (`@angular/build:application`) ; karma sur `@angular/build:karma` ; `build-web-component.js` passe d'un concat à une copie + garde-fou anti-chunk ; −396 paquets npm ; polyfills absorbés par `main.ts` ; EventEmitter interne (le builtin Node `events` n'est plus une dépendance).
* **Styles** : suppression du thème legacy `aura-light-blue` (244 Ko, embarqué ×5) au profit du preset token-based + `PrimengShadowStylesService` (miroir des styles PrimeNG vers les shadow roots) ; suppression de primeflex et primeicons (icônes migrées vers le sprite SVG maison — corrige les glyphes cassés en Shadow DOM) ; retrait de `@angular/animations` (PrimeNG 21 est CSS-only).
* **Architecture** : composants 100 % standalone, bootstrap `createApplication()` (`src/app/bootstrap.ts`), `provideHttpClient()` ; store de signals `PlaybackState` par player alimenté hors zone ; politique de zone par listener (`'zone' | 'schedule' | 'none'`) dans `PluginBase` ; **13/13 composants en `OnPush`** ; ~40 `detectChanges/markForCheck` manuels supprimés (les structurels restants sont commentés).
* **Runtime** : coalescing de zone ; mousemove/scroll haute fréquence hors zone (directive `amaliaOutside*`, throttle rAF) ; wavesurfer/interactjs/ResizeObservers hors zone ; transcription en rendu différé par segment (`@defer` + placeholder isométrique, flag `data.deferredRendering`) ; audit exhaustif des 74 `setTimeout` (gate zoneless soldé).
* **Rendu différé de la transcription rendu effectif** : le surlignage des entités nommées passait par un `querySelectorAll` sur les mots et forçait donc l'hydratation de **tous** les blocs `@defer` dès qu'un segment portait une annotation — le cas dominant sur les assets réels, qui annulait le gain. Il est désormais marqué sur les données (`TranscriptionLocalisation.isNamedEntity`) et rendu par `[class.named-entity]`. Sur un flux TV d'une heure (151 segments dont 127 annotés, 10 405 mots) : **10 405 → 413 mots rendus au chargement (−96 %)** et **12 955 → 3 109 nœuds DOM (−76 %)**. La recherche reste le seul chemin qui hydrate tout (elle en paie le coût à la demande, ~3,5 s sur cet asset, au lieu de le faire supporter à chaque chargement).
* **Filigrane audio** : l'image de fond du player audio était référencée par une `url()` relative dans un SCSS, qu'esbuild externalisait dans `dist/amalia/media/` — fichier annexe non servi par les hôtes, donc **404 en intégration**. Elle est remplacée par un vectoriel **inline** dans le template : plus aucune requête ni fichier annexe, et les applications hôtes n'ont plus à livrer `newAudioBackGround.png` ni à fournir un `poster` pour l'audio. La garde du build échoue désormais si `dist/amalia/media/` réapparaît.
* **Zoneless (préparé)** : `ng serve -c zoneless` active `provideZonelessChangeDetection()` ; le flip par défaut attend un cycle de release en production (`environment.zoneless`).
* **Divers** : `environment.prod.ts` corrigé (`production: true`) ; budgets angular.json resserrés (initial 3,6/4 Mo, styles composant 100/200 Ko) ; lodash importé par méthode ; `isolatedModules` + `noImplicitOverride`/`noImplicitReturns`/`noFallthroughCasesInSwitch`.

## 2.1.25-develop (non publiée — depuis le tag 2.1.24)

Version essentiellement consacrée à la montée **Angular 17→21 / PrimeNG 17→21** et à sa traîne de correctifs visuels (dont les casses spécifiques au Shadow DOM), plus une passe de fiabilisation histogramme/minimap et annotations. Aucun changement d'API publique du web component.

### Socle : migration Angular 21 / PrimeNG 21

* `2d7b7e9` fix(plugins) : restaure le rendu des plugins après la migration Angular 21
* `f4fdcd8` fix(timeline, player) : restaure le rendu de la timeline et le resize plein écran
* `0b5026d` fix(timeline) : restaure les styles menu/tree/accordion (PrimeNG v21)
* `81866e7` / `ae7cdfe` fix : migration PrimeNG v21 — composants, styles et tests
* `78c2d4e` docs : rapport de migration Angular 21 / PrimeNG 21
* `7da68c6` chore : validation des changements de migration

### Corrections post-migration (PrimeNG 21 × Shadow DOM)

* `e403854` fix(annotation) : régressions d'affichage des segments
* `068f691` fix : perf segments et styles PrimeNG en Shadow DOM
* `048616c` fix : complète la migration des tooltips vers pTooltip dans les segments
* `b1e236a` fix : tooltips décalés, chips de segmentation mal centrées, minimap trop petit
* `6bc6a01` fix : restaure l'apparence du toast (timer) cassé dans le Shadow DOM

### Control bar

* `0ce961a` fix : control-bar vide après navigation vidéo/audio → photo avec le même player-id
* `318306f` fix : icône « Reset » masquée par un rond de survol toujours visible
* `644996e` fix : même bug d'icône masquée dans le menu « Plus d'options »
* `7c41ca3` fix : le menu « Plus d'options » flottait au-dessus de la barre au lieu d'y être collé
* `ee3526d` fix : aligne le menu « Plus d'options » sur le bouton réel, pas sur le bord du conteneur
* `974cd5a` fix : tooltips des boutons jamais thémés hors plein écran
* `4ff8e30` fix : la barre de contrôle photo restait invisible sans rechargement (course de mise en page)

### Histogramme / minimap

* `caf150e` fix : bandeau « Figer » persistant + poignées de zoom du minimap
* `1f0757a` fix : garde anti-null sur le suivi de la miniature pendant le drag (+ tests)
* `472b4d6` refactor : réduit l'imbrication et la complexité cognitive du drag minimap
* `0d7caf1` docs : commentaire `VIEWPORT_HANDLE_HIT_PX` (poignées réduites à 10 px)

### Annotations — catégories / mots-clés

* `d533141` fix : clic sur une suggestion perdu (blur avant click)
* `050e9df` fix : signal écrasé par ngModel + spinner bloqué sans detectChanges
* `a23b8bf` fix : police de secours générique sur `font-family: Lato`

### Qualité / divers

* `837168d` fix : accessibilité clavier (Sonar)
* `3665417` chore : mise à jour du package-lock.json
* `13b67a0` / `63d16e4` chore : relances de pipeline / analyse Sonar

## 2.0.0

### Features

* Rewrite in typescript
* Add Configuration loader 
* Add Metadata loader
* Add Logger interface
