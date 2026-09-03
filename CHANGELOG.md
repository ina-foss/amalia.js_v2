# CHANGELOG

## 2.1.27 (en cours) — seek ±5s en rafale : l'image suit les clics

Chantier issu du retour terrain « clics très rapides sur ±5s : l'image se fige ». Aucun changement d'API événementielle ; un ajout de configuration rétro-compatible.

* **Seek ±5s fiabilisé** : throttle leading+trailing (remplace le debounce trailing-only qui n'exécutait qu'un seul seek par rafale), `executeFrameJump` en seek pur (plus de `pauseOnly()`/`play()`, donc plus de course AbortError), clamp des sauts par frames à `duration − 1/framerate` (la dernière frame visible — `seekToEnd` garde seul le droit d'aller à `duration` pile), annulation du throttle en attente au destroy.
* **Overlay de prévisualisation en rafale** : dès le 2e clic dans la fenêtre de throttle, la control bar émet `SEEKING` avec la position projetée et le player affiche la vignette correspondante à la place de la vidéo ; la frame réellement décodée reprend la main au `seeked`. Un clic isolé ne déclenche rien (mode sobre).
* **Fenêtre d'accumulation de la rafale dédiée : 400 ms** (`RAFALE_ACCUMULATION_WINDOW_MS`, découplée du throttle générique 150 ms qui reste celui du drag slider et des vignettes de survol). Mesure en conditions réelles (225 clics instrumentés) : la cadence humaine plafonne à ~6 clics/s (intervalle médian 162 ms, p90 183 ms, max 313 ms) — à 150 ms, 82 % des clics retombaient dans une fenêtre expirée et étaient traités en « isolés » (seek immédiat, aucune vignette) : la rafale ne se déclenchait presque jamais. À 400 ms, 100 % des intervalles mesurés accumulent ; le clic isolé garde sa latence nulle (leading immédiat).
* **Mode glissement : coupe précise uniquement à l'atterrissage** — les seeks live du drag chargent des fragments normaux (coupe keyframe : chaque cible est aussitôt dépassée, la coupe précise y serait du surcoût serveur pur) ; au mouseup, l'événement interne `ACCURATE_SEEK_CHANGE` arme `accurate_seek=1` juste avant le seek exact, consommé en **one-shot** par le `CustomFragmentLoader` sur le premier fragment chargé — même canal `fragLoadPolicy` que le switch de piste audio, mais attention : hls.js passe une **copie** de la policy au `load()` (`getLoaderConfigWithoutReties`), la consommation se fait donc sur la config partagée reçue au constructeur du loader. Filet : quitter le mode glissement désarme un flag non consommé (atterrissage déjà bufferisé, aucun fragment chargé). Mesuré sur flux LCI réel : ~20 fragments pendant un drag de 2,5 s, **0** `accurate_seek` pendant le geste, **exactement 1** après le mouseup, atterrissage exact. La lecture normale et les autres modes restent sans paramètre.
* **Peinture monotone des vignettes** (`setThumbnail` de la control-bar, `setPreviewThumbnail` du player) : la garde anti-désordre historique « seule la réponse de la **dernière demande** peint » jetait, pendant un geste continu, la quasi-totalité des réponses (la dernière demande avance plus vite que la latence réseau) — vignette de survol figée pendant tout le drag quel que soit le débit, overlay rafale limité à 2 images sur 8 clics sous réseau lent. Désormais on ne jette qu'une réponse plus ancienne que l'image **affichée** (anti-désordre conservé) : toute réponse plus récente peint, même si une demande postérieure est déjà partie. La peinture synchrone depuis le cache (`handleSeeking`) avance la même horloge (une réponse réseau en vol plus ancienne ne l'écrase pas), et l'upgrade éclaireur→grande du tc courant est préservé. Mesuré sur flux LCI réel : **14** images peintes pendant un drag de 2,5 s (avant : **1**, appliquée seulement à l'arrêt du geste) ; rafale 8×+5s sous Slow 4G émulé : **6** images (avant : **2**).
* Limites connues sous réseau lent (Slow 4G émulé, identifiées et non traitées) : le préchargement ±5s de vignettes part en même temps que le fragment d'atterrissage et lui dispute la bande passante (frame d'atterrissage affichée en 7-12 s) ; doublons ponctuels de requêtes vignettes sur un même tc ; le fragment du dernier seek live n'est pas annulé au mouseup (7,5 s en vol observés) — le one-shot `accurate_seek` se consomme alors sur un fragment voisin (borné, auto-guérissant, atterrissage visuellement exact quand même).
* **Vignettes deux tailles** (`thumbnail.width` = petites pour le survol de la progress-bar et l'éclaireur rafale, nouveau `thumbnail.previewWidth` = grandes pour l'overlay plein cadre) : `getThumbnailUrl` applique la largeur selon le contexte et ne double jamais un `width=` déjà soudé dans `baseUrl` par un hôte non migré (rétro-compat). `ThumbnailService` refondu : deux caches FIFO bornés par taille (120 petites / 60 grandes, object URLs révoqués), lecture synchrone `getCached`, déduplication des requêtes en vol, garde de génération post-`clear()`.
* **Préchargement deux étages pendant la rafale** : petites vignettes 8 pas en avance au pas réellement observé entre clics (sens du déplacement respecté), grandes 3 pas derrière — en zone froide l'image suit en petite agrandie puis est remplacée par la grande (upgrade seulement, jamais l'inverse) ; en zone déjà visitée les grandes s'affichent directement du cache. Mesuré sur flux HLS réel (30 clics à ~9 clics/s, infra à ~1,8 s/vignette) : 11 images successives en zone froide, 19 en zone chaude, saut total exact, 0 requête dupliquée.
* **Clés de cache des vignettes alignées sur la grille 0,04 s** : le survol arrondissait sa clé à 6 décimales, la rafale et le préchargement à 2, alors que l'URL est quantifiée à 0,04 s — la même image existait donc sous plusieurs clés qui ne se retrouvaient jamais (mesuré en rafale réelle de 20 clics : 3 familles d'URLs pour les mêmes positions, ~60 requêtes de 0,8-4 s, overlay figé sur une image périmée pendant 3,7 s). Nouvelle source unique `core/utils/thumbnail-tc.ts` (`quantizeThumbnailTc`, formule identique à l'arrondi historique des URLs — bundle iso-URL), normalisation structurelle des clés dans `ThumbnailService` (cache **et** dédup en vol, clés string inchangées) et quantification aux sites d'appel (`handleSeeking`, `prefetchRange`, `updateThumbnail`) — le pas de préchargement devient exact (5,00) et clé ⇔ URL ⇔ image sont 1:1. Mesuré sur flux LCI réel (rafales de 18-20 clics à ~8 clics/s) : **0 URL dupliquée** sur 80 requêtes (avant : mêmes URLs re-fetchées), une seule famille de cibles à fraction constante en régime établi (stride exactement 5), et en zone déjà visitée la vignette **suit chaque clic** (11 changements d'image pendant la rafale de 2,4 s, zéro re-fetch des cellules cachées — avant : 0 changement pendant la rafale). En zone froide, la limite reste l'infra (~1,5 s/vignette, cf. mesure ci-dessus) : la première image arrive ~1 s après la fin de la rafale. Contre-épreuve cache sur page smoke (aller-retour 18 clics en pause) : retour servi par le cache, 44 → **6** requêtes. Au passage, l'erreur console récurrente `getComputedStyle` (tooltip PrimeNG × Shadow DOM, levée au **survol** des ~30 contrôles à `pTooltip`) est **hors de cause** dans le gel — reproduit sans aucune erreur console ; correction à traiter séparément.
* **Erreur console `getComputedStyle` × Shadow DOM corrigée** (celle notée « à traiter séparément » ci-dessus, documentée pré-existante dans la SMOKE-CHECKLIST) : `DomHandler.getScrollableParents` de PrimeNG 21.1.9 passe le ShadowRoot (nodeType 11, seule garde `nodeType !== 9`) à `getComputedStyle` → TypeError à chaque survol d'un contrôle à `pTooltip` et chaque ouverture d'overlay d'autocomplete, et surtout **aucun listener d'overlay n'était jamais lié** (`bindListeners` avorté : ni scroll, ni click document, ni resize, ni clavier — le panneau ne se fermait/repositionnait pas au scroll). Patch runtime ciblé `src/app/core/patches/primeng-dom-scrollable-parents.ts` (réassignation de la statique publique, iso-algorithme + garde `instanceof Element`), importé par `main.ts` — aucun global de page hôte touché. Le correctif existe upstream dans `@primeuix/utils` (try/catch) mais `primeng/dom` garde une copie locale non migrée : patch à retirer quand `primeng/dom` déléguera à `@primeuix/utils`.
* Champs de config morts supprimés (`thumbnail.enableThumbnailPreview`, `thumbnail.debounceTime` — déclarés, jamais lus) ; l'export d'annotation (« Lien de l'imagette ») reste en grande taille.
* Côté hôte (player-expert) : `configureThumbnails` pose désormais `baseUrl` nu + `width: 150` + `previewWidth: 740` au lieu de souder `?width=740` pour toutes les vignettes — le survol passe de ~740 px à 150 px (latence d'extraction serveur nettement réduite, mesurée).

## 2.1.26 (publiée le 19/08/2026) — refactoring performance post-migration

Chantier `refactor/perf-v21` (plan et suivi : `docs/refactoring/PLAN-PERF-2026.md`). Aucun changement d'API publique : le contrat mono-fichier `amalia-<version>.min.js` (`<script type="module">`) et l'API événementielle host sont inchangés.

**Chiffres** : `main.js` 5,93 → 3,42 Mo (−42 %, gzip 1,19 Mo → 942 Ko), `styles.css` 723 Ko → 18 octets, 1,49 Mo de polices sorties du dist, build de production de plusieurs minutes → ~20 s, et pendant la lecture : 1 tick de change detection coalescé ciblé au lieu de 7 vérifications complètes de l'arbre par `timeupdate`.

* **Build** : migration Webpack (`ngx-build-plus`) → esbuild (`@angular/build:application`) ; karma sur `@angular/build:karma` ; `build-web-component.js` passe d'un concat à une copie + garde-fou anti-chunk ; −396 paquets npm ; polyfills absorbés par `main.ts` ; EventEmitter interne (le builtin Node `events` n'est plus une dépendance).
* **Styles** : suppression du thème legacy `aura-light-blue` (244 Ko, embarqué ×5) au profit du preset token-based + `PrimengShadowStylesService` (miroir des styles PrimeNG vers les shadow roots) ; suppression de primeflex et primeicons (icônes migrées vers le sprite SVG maison — corrige les glyphes cassés en Shadow DOM) ; retrait de `@angular/animations` (PrimeNG 21 est CSS-only).
* **Architecture** : composants 100 % standalone, bootstrap `createApplication()` (`src/app/bootstrap.ts`), `provideHttpClient()` ; store de signals `PlaybackState` par player alimenté hors zone ; politique de zone par listener (`'zone' | 'schedule' | 'none'`) dans `PluginBase` ; **13/13 composants en `OnPush`** ; ~40 `detectChanges/markForCheck` manuels supprimés (les structurels restants sont commentés).
* **Runtime** : coalescing de zone ; mousemove/scroll haute fréquence hors zone (directive `amaliaOutside*`, throttle rAF) ; wavesurfer/interactjs/ResizeObservers hors zone ; transcription en rendu différé par segment (`@defer` + placeholder isométrique, flag `data.deferredRendering`) ; audit exhaustif des 74 `setTimeout` (gate zoneless soldé).
* **Rendu différé de la transcription rendu effectif** : le surlignage des entités nommées passait par un `querySelectorAll` sur les mots et forçait donc l'hydratation de **tous** les blocs `@defer` dès qu'un segment portait une annotation — le cas dominant sur les assets réels, qui annulait le gain. Il est désormais marqué sur les données (`TranscriptionLocalisation.isNamedEntity`) et rendu par `[class.named-entity]`. Sur un flux TV d'une heure (151 segments dont 127 annotés, 10 405 mots) : **10 405 → 413 mots rendus au chargement (−96 %)** et **12 955 → 3 109 nœuds DOM (−76 %)**. La recherche reste le seul chemin qui hydrate tout (elle en paie le coût à la demande, ~3,5 s sur cet asset, au lieu de le faire supporter à chaque chargement).
* **Filigrane audio** : l'image de fond du player audio était référencée par une `url()` relative dans un SCSS, qu'esbuild externalisait dans `dist/amalia/media/` — fichier annexe non servi par les hôtes, donc **404 en intégration**. Elle est remplacée par un vectoriel **inline** dans le template : plus aucune requête ni fichier annexe, et les applications hôtes n'ont plus à livrer `newAudioBackGround.png` ni à fournir un `poster` pour l'audio. La garde du build échoue désormais si `dist/amalia/media/` réapparaît.
* **Zoneless (livré)** : le player tourne en `provideZonelessChangeDetection()` et **zone.js est sorti du bundle** (main.js 3,46 → 3,42 Mo, gzip 954 → 942 Ko) — plus aucun monkey-patching global apporté aux pages hôtes. La politique de listener `'zone'` disparaît (`'schedule' | 'none'`). Configuration de secours `ng build -c zoneful` (bundle zoné identique au comportement pré-flip), conservée le temps d'une release.
* **Export Excel des segments réparé** : la migration esbuild avait cassé l'interop CJS de `json-as-xlsx` (`import * as` d'un module dont `module.exports` est la fonction → namespace non appelable, `TypeError` au clic « Exporter au format Excel »). Import par défaut désormais ; vérifié en conditions réelles dans `player-expert` (passe de smoke du 2026-08-17).
* **Divers** : `environment.prod.ts` corrigé (`production: true`) ; budgets angular.json resserrés (initial 3,6/4 Mo, styles composant 100/200 Ko) ; lodash importé par méthode ; `isolatedModules` + `noImplicitOverride`/`noImplicitReturns`/`noFallthroughCasesInSwitch`.

## 2.1.25 (depuis le tag 2.1.24)

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
