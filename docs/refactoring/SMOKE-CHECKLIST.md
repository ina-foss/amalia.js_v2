# Checklist de smoke test — chantier perf v21

À dérouler à la fin de chaque phase du [PLAN-PERF-2026.md](PLAN-PERF-2026.md), après `npm run build:component && npm run start-examples` (port 4203).

> **Hors réseau INA** : les médias et vignettes des samples pointent sur des hôtes internes et
> `samples/medias/` est vide — aucune page principale ne charge de média. Générer alors le
> harnais de substitution (flux HLS public, vignettes picsum, métadonnées locales) :
>
> ```sh
> node scripts/gen-smoke-offline.mjs                            # 5 pages samples/_smoke-*.html
> node scripts/gen-smoke-offline.mjs --ref debug/amalia-2.1.24.min.js   # + pages de contrôle
> ```
>
> L'option `--ref` sert le même scénario avec un bundle antérieur : si une anomalie s'y
> reproduit, elle est **pré-existante** et non imputable au chantier en cours. Les fichiers
> produits sont gitignorés.

## Pré-requis

- [ ] `ng lint` vert
- [ ] `npm test` vert (887 specs, ChromeHeadlessCI)
- [ ] `npm run build:component` sans erreur ni warning de budget
- [ ] `node scripts/size-report.mjs` : delta vs baseline cohérent avec la phase

## Global (sur chaque page testée)

- [ ] Zéro erreur dans la console navigateur
- [ ] `customElements.get('amalia-player')` défini
- [ ] Couleur primaire INA `#0b7698` appliquée (boutons, accents)
- [ ] Icônes rendues (sprite SVG, et `pi pi-*` tant que primeicons est présent)

## Pages / scénarios

### `amalia-hls.html` — lecture HLS
- [ ] La vidéo démarre, play/pause, seek clic + drag progress-bar (fluide, pas de latence perceptible)
- [ ] Volume / mute / fullscreen entrée-sortie / changement de vitesse
- [ ] Tooltips de la control-bar
- [ ] Menu contextuel (clic droit)

### `amalia-timeline-plugin.html`
- [ ] Toolbar, accordéons (déplier/replier), arbres (p-tree sélection), checkbox
- [ ] Sélection rectangle (drag), déplacement/resize de segments (interactjs)
- [ ] Toast affiché avec timer/progress-bar correct

### `amalia-transcription-plugin.html`
- [ ] Karaoké : mot actif surligné pendant la lecture
- [ ] Auto-scroll suit la lecture ; bouton synchro ; scroll manuel désynchronise puis resynchronise
- [ ] Recherche : navigation occurrence suivante/précédente ; entités nommées surlignées
- [ ] Clic sur un mot → seek

### `amalia-storyboard-plugin.html`
- [ ] Vignettes chargées, vignette active suit la lecture, clic vignette → seek

### Annotation (page annotation/segments)
- [ ] Créer / éditer / cloner / supprimer un segment ; chips catégories/mots-clés ; autocomplete
- [ ] Dialog de confirmation (suppression)
- [ ] Export JSON et **export Excel**
- [ ] Bouton caméra (snapshot) visible et fonctionnel

### Histogram / waveform
- [ ] Waveform rendue (wavesurfer), curseur suit la lecture, zoom/minimap

### `amalia-photo-plugin.html`
- [ ] Zoom, magnifier, crop (cropperjs)

### `amalia-test-vitesses.html`
- [ ] Changements de vitesse multiples sans désynchronisation

### Cycle de vie
- [ ] Detach / reattach du player (chemin `refreshAndInit`) : les plugins se réinitialisent
- [ ] 5 cycles attach/detach → pas de fuite (`Utils.mapOfRegisteredListenersPerTarget` revient à la baseline)

## Mesures perf (phases 1, 7, 9)

Profil Angular DevTools sur `amalia-hls.html`, scénario : 30 s lecture + 1 seek + 1 drag + 10 s de mousemove au-dessus du player.

| Métrique | Baseline | Cible ph. 1 | Cible ph. 7 | Cible ph. 9 |
|---|---|---|---|---|
| M1 : ticks CD / 10 s lecture | (à mesurer) | ÷5 minimum | — | 1 tick/timeupdate, vues ciblées |
| M2 : ms scripting / s | (à mesurer) | en baisse | ÷2 | minimal |
| M3 : latence drag progress-bar | fluide | inchangée | inchangée | inchangée |
| M4 : fuite listeners 5× attach/detach | 0 | 0 | 0 | 0 |

---

## Passe du 2026-08-12 (fin de chantier, branche `refactor/perf-v21`)

Environnement : Chrome 151 piloté (CDP), **hors réseau INA**. Contrainte majeure : les
médias et vignettes des samples pointent sur des hôtes INA injoignables
(`traitgpu03.wsmedia.p.sas.ina`, `image.wsmedia.d.sas.ina`, `lvltojson.wsmedia.d.sas.ina`)
et `samples/medias/` est vide (`.gitkeep`). Les scénarios ont donc été déroulés sur des
pages locales `samples/_smoke-*.html` : mêmes configs que les samples, `player.src`
remplacé par un HLS public (`ccavmedia-dd.akamaized.net/c2pa/reuls/master.m3u8`, 120,6 s),
vignettes sur picsum, métadonnées locales inchangées.

Méthode de discrimination : chaque anomalie a été rejouée sur le bundle **pré-chantier**
`debug/amalia-2.1.24.min.js` servi à la place de `main.js` (pages `_ref-*.html`). Comportement
identique ⇒ pré-existant, pas une régression du chantier.

### Pré-requis — vert

`ng lint` vert · `npm test` **887/887** (couverture 87,3 % stmts) · `build:component` sans
erreur (garde mono-fichier OK) · `size-report` : **3,46 Mo** (−2,47 Mo vs baseline).

### Validé

| Scénario | Résultat |
|---|---|
| Global | 0 erreur console (hors `favicon.ico` 404), 9 custom elements enregistrés, bleu INA appliqué, sprite SVG rendu, 0 résidu primeicons |
| Control-bar experte | Apparition au survol réel (classe `activated`, `display:flex`) puis auto-masquage ~1,8 s ; play/pause (icône + label temps + slider synchrones) ; seek clic barre (50 % → 60,3 s exact) ; **drag du curseur** (→ 21,84 s / 18,1 %) ; mute/démute (icône `volume-off`/`volume-on`) ; vitesse 2× (`currentPlaybackRate` + `video.playbackRate`) ; aspect ratio 16:9 → 4:3 (classe `aspect-ratio-4`) ; menu sous-titres (positions, sélection → `subtitlePosition() === 'down'`) ; **tooltip PrimeNG rendu dans le shadow root** ; menu contextuel (clic droit) |
| Transcription | Karaoké (`.w.activated` progresse pendant la lecture), segment actif suivi au seek ; **auto-scroll** (t=110 s → `scrollTop` 527) ; scroll manuel → bouton synchro `active` puis resynchronisation au clic ; clic mot → seek exact (21,53 s) |
| Transcription `@defer` (phase 8) | Avant recherche : 149 placeholders / 539 mots. Après recherche : **0 placeholder / 6 680 mots** (`forceRenderAll`), 2 occurrences, navigation suivant/précédent avec bouclage, clear OK. Bloc à entités nommées : hydratation complète forcée (0 placeholder, 191 boutons, 255 surlignages) |
| Timeline | 3 blocs / 342 segments / 4 nœuds d'arbre ; accordéons replier-déplier ; p-tree checkbox (`selectedNodes` 4 → 0 → 4) ; clic segment → seek + curseur TC ; **interactjs** : drag de la poignée de focus → `focusTcIn` 0 → 19,0 s et style recalculé (rendu OnPush depuis un drag hors zone) |
| Toast maison | Progress-bar animée 16 → 34 → 52 → 70 % sans CD manuelle |
| Fuite de listeners | 5 cycles détach/réattach d'un plugin : **74 → 68 puis stable à 68** (aucune accumulation), plugin re-rendu à chaque cycle |

### Pré-existant (identique sur le bundle 2.1.24, à ne pas imputer au chantier)

- **Réattach d'un plugin** : les listeners sont bien retirés au détach mais **pas
  re-souscrits** au réattach (TIME_CHANGE/SEEKING/SEEKED/INIT 5→4→4, METADATA_LOADED 8→6→6)
  ⇒ karaoké définitivement figé. Le DOM du plugin, lui, se re-rend.
  Seuil mesuré = celui du `scheduleDestroy` d'Angular Elements (~10 ms) :

  | Cycle | Listeners | Mots actifs à 10 s | à 100 s | Karaoké |
  |---|---:|---:|---:|---|
  | baseline | 74 | 33 | 251 | vivant |
  | `remove()` + `append()` synchrones | 74 | 33 | 251 | vivant |
  | `remove()` + 800 ms + `append()` | 68 | 251 | 251 | figé |

  Conséquence pour les hôtes : le Document Picture-in-Picture de `player-expert`
  (`asset-details.component.ts`, `restoreDocumentPiPNodes`) déplace les nœuds de façon
  **synchrone** et n'est donc pas affecté ; en revanche tout démontage réel (`@if`, onglet,
  changement de route puis retour) laisse le plugin muet. Piste de correction :
  `PluginBase.ngOnInit` n'ajoute l'écouteur METADATA_LOADED de rattrapage que si
  `isMetadataLoaded` est faux — au réattach il est vrai, et `init()` seul ne re-souscrit pas.
- **Détach/réattach du `<amalia-player>`** : `element.mediaPlayerElement` devient `undefined`
  après le premier cycle (le `<video>` reste en `readyState 4`).
- **Storyboard** : aucune vignette rendue (`listOfThumbnailFilter` reste vide alors que
  `listOfThumbnail` = 5) — enchaînement `handleScroll`/`updateScrollHeight` qui exige un
  premier enfant déjà rendu.
- **`amalia-timeline-plugin.html`** : arbre vide (« No results found ») car la page déclare
  `plugin-instance="1095"` alors que `timeline-type.json` porte des types `…-P1`.
- **`amalia-photo-plugin.html`** : page obsolète — `amalia-photo` n'est pas un custom element
  enregistré (le mode photo/cropper vit dans le player, `src/app/player/photo/`).

### Passe réseau INA du 2026-08-12 (dans `player-expert`, localhost:4201)

Le harnais isolé ne suffisait pas : les hôtes média des samples (`traitgpu03.wsmedia.p.sas.ina`,
`ws-media-vm.ina.fr:3001`) **ne répondent plus** (timeout, 0 octet), alors que le réseau INA est
joignable (`sso.agac.d.sas.ina` → 200). L'hôte média réellement utilisé aujourd'hui est
**`wsmedia.api.d.sas.ina`**, et les `dataSources` de l'app sont des URLs relatives `/api/...`
servies par son backend authentifié — non reproductibles dans une page samples isolée.

La passe a donc été déroulée **dans l'application hôte**, sur les 5 natures de média. Le bundle
servi par l'app (`/assets/amalia-2.1.26.min.js`) est **identique au bit près** au build de la
branche (MD5 `b035f9a956b1b3cf57bfdf5ea31256df`) : les observations portent bien sur le chantier.

| Asset | Validé |
|---|---|
| `flux:tv:LCI:20230601T130000:3600` (1 h) | HLS via hls.js (`readyState 4`, 3600 s) ; karaoké en lecture ; auto-scroll ; seek en pause **et** en lecture ; recherche sur **10 405 mots en 190 ms** (3 occurrences, navigation, clear) ; **lecture inverse `backwardsSrc`** (bascule de blob, temps qui recule) ; **vignette de survol réelle** (740×416, blob authentifié, TC affiché) ; **plein écran réel** (`fullScreenMode` true, `displayState` `'l'`, icône `compress`, retour correct) |
| `stock:FPVDB07011409.01:600` (26 min) | **Storyboard réel** : 53 vignettes calculées, 23 rendues (virtualisation), **23/23 images 300×225 chargées**, vignette active qui suit la lecture (60 → 300 → 900 s), clic vignette → seek exact (1020 s) |
| `flux:radio:FBL:20230601T130000:3600` | **Waveform wavesurfer** : instance créée, `duration 3600`, **12 canvas visibles** (1920×98 onde, 1920×72 minimap), peaks 2 canaux, curseur synchronisé au dixième en lecture (2,3 = 2,3) et après seek (1200 = 1200) |
| `stock:FIC05001010409` (photo) | **cropperjs** : image réelle 3000×3000, 24 éléments cropper, control-bar photo 16 contrôles, loupe (toggle), **zoom 25 % → 100 %** par le raccourci `z` (`.cropper-canvas` 750→3000 px, signal + label suivent) |

### Défauts trouvés en conditions réelles

- ~~**404 `/media/newAudioBackGround.png`**~~ **Corrigé** — le SCSS du player référençait
  `assets/amalia/images/newAudioBackGround.png` ; le build esbuild (phase 2) l'externalisait en
  `dist/amalia/media/newAudioBackGround.png`, or l'app charge le bundle depuis `/assets/` donc
  l'URL relative résolvait en `/media/…` → 404 et perte de l'image de fond du player audio.
  Le filigrane est désormais un **vectoriel inline** dans le template
  (`<ng-template #audioWatermark>`, rendu dans l'overlay de chargement et dans le conteneur) :
  aucune requête, aucun fichier annexe. La garde de `build-web-component.js` **échoue maintenant
  si `dist/amalia/media/` réapparaît**, au même titre qu'un chunk JS.

  Deux options ont été écartées, mesures à l'appui : le data-URI (le `headphones.svg` existant
  n'est pas un vectoriel mais un **bitmap de 24 Ko encapsulé dans un `<pattern>`**, dupliqué dans
  chaque shadow root par le miroir de styles) et le `<use>` vers le sprite (même bitmap, et son
  chargement externe fait échouer les 2 specs de `outside-zone-event.directive.spec.ts` qui
  comptent les `requestAnimationFrame` **globaux** — vérifié : suite verte avec une forme inline,
  2 échecs avec le `<use>`).

  Côté `player-expert`, l'application n'a plus à fournir d'image : le `poster` PNG de
  `asset-details.component.ts` et les 3 globs `newAudioBackGround.png` d'`angular.json` (dont 2
  pointaient sur un fichier absent) sont supprimés ; seule la couleur `posterBackground` reste
  configurée. **Vérifié sur le flux radio réel** : plus aucune 404, `<video>` sans `poster`,
  filigrane présent dans le DOM (100×100, centré). Il y reste invisible parce que la **waveform
  occupe toute la surface du player** — l'ancienne image PNG était masquée de la même façon, ce
  404 ne coûtait donc qu'une requête inutile.
- **`displayState` reste `'l'` après sortie du plein écran** (au lieu de revenir à `'m'`) ;
  `fullScreenMode` et l'icône, eux, sont corrects.
- **`playerConfig()` contient l'input brut, pas la configuration résolue** (pré-existant, découvert
  en vérifiant le filigrane). Le signal est alimenté par `this.playerConfig.set(this.config)` : si
  l'hôte passe un **objet** de configuration (cas de `player-expert`), `.player` est exploitable ;
  s'il passe une **URL** (cas de tous les samples), `playerConfig()?.player` reste `undefined` et
  **toutes les branches `media === 'AUDIO'` / `'PICTURE'` du template sont mortes** — classes
  `audio-player` et `p-progress-spinner-audio` jamais appliquées, `#photoHost` jamais rendu.
  C'est pourquoi l'ancien fond audio ne s'affichait que dans l'app. Correction envisageable :
  lire `mediaPlayerElement.getConfiguration()` (la config résolue) plutôt que l'input.
- ~~**Le `@defer` de la phase 8 est annulé dès qu'une transcription porte des entités
  nommées.**~~ **Corrigé** — `handleMatchedTextStyle()` hydratait **tous** les segments pour son
  `querySelectorAll` de surlignage ; sur le flux LCI, 127 segments sur 151 portent des entités
  → 0 placeholder, 10 405 mots, 12 955 nœuds au chargement, soit le gain du rendu différé annulé
  dans le cas dominant. Le surlignage est désormais **marqué sur les données**
  (`TranscriptionLocalisation.isNamedEntity`, calculé par `markNamedEntities` à l'issue du parse)
  et rendu par `[class.named-entity]` : plus aucun `querySelectorAll`, donc plus d'hydratation
  forcée. Mesuré sur le panneau à entités nommées du harnais (120 segments, 191 entités,
  255 mots marqués) :

  | État | Mots rendus | Placeholders | Mots surlignés | `forceRenderAll` |
  |---|---:|---:|---:|---|
  | Chargement | **77** (avant : 5 194) | 116 | 0 | `false` |
  | Seek sur un segment annoté | 188 | 112 | 4 | `false` |
  | Après recherche | 5 194 | 0 | **255** | `true` |

  Parité de comportement vérifiée : après hydratation globale on retrouve exactement les
  255 surlignages de la version DOM, cas composés inclus (« Maï-Maï Brottes »). La recherche
  reste le seul déclencheur de `forceRenderAll`.

  **Mesure confirmée sur le flux LCI réel** (dans `player-expert`, 151 segments dont 127 annotés,
  10 405 mots et 597 marqués comme entités nommées) :

  | | Avant | Après |
  |---|---:|---:|
  | Mots rendus au chargement | 10 405 | **413** (−96,0 %) |
  | Placeholders | 0 | **146** |
  | Nœuds DOM de la transcription | 12 955 | **3 109** (−76,0 %) |
  | `forceRenderAll` au chargement | `true` | **`false`** |
  | Chips d'entités nommées | 401 | 401 |

  Seek à 1500 s (segment hors viewport initial) : le segment s'hydrate à la demande
  (`activeSegmentTcIn` 1475,95), 730 mots rendus, 140 placeholders restants, **35 mots surlignés
  par le binding** et `forceRenderAll` toujours `false`. Recherche : hydratation globale,
  **597 mots surlignés — exactement le compte marqué dans les données**.

  **Contrepartie assumée** : le premier résultat de recherche passe de ~190 ms à **~3,5 s** sur cet
  asset, parce que l'hydratation des 10 405 mots n'est plus déjà faite au chargement — le coût est
  déplacé du chargement (systématique) vers la première recherche (à la demande). Piste pour le
  supprimer aussi : chercher sur le modèle de données (`subLocalisations`) plutôt que sur le DOM,
  puis n'hydrater que les segments porteurs d'occurrences — même remède que pour les entités
  nommées, ce qui retirerait le dernier `forceRenderAll`.

### Bloqué par l'environnement

- **Annotation / segments : non testé.** Le module « Segmentation » monte bien
  `<amalia-annotation>`, mais `POST /api/dossier/segments/stock` renvoie **500** côté backend dev.
  `manageEventResponseStatus` attend via `Utils.waitFor` (10 s) que l'hôte renseigne
  `event.status` sur l'événement `ANNOTATION_*` ; le contrat n'est jamais honoré, amalia expire et
  affiche « init delai d'attente dépassé ». Côté amalia le comportement est correct (émission,
  attente, toast d'erreur — chemin `displaySnackBar` validé au passage), mais **CRUD, chips,
  autocomplete, dialog de confirmation, export JSON/Excel et snapshot restent à dérouler** une
  fois le 500 corrigé.
- **Mesures M1/M2** (ticks CD, ms scripting) : non relevées.

### Pistes écartées après vérification

- « Anomalie de seek en pause » : **fausse alerte**. Les seeks qui ne repositionnaient pas le
  karaoké tombaient tous dans un **trou entre segments** (corrélation parfaite sur 15 cibles ; la
  transcription ne couvre que 91 % du flux). `selectSegment` laisse `activeSegmentTcIn` inchangé
  quand aucun segment ne couvre le temps courant — correct.
- « Storyboard sans vignettes » : dû aux hôtes de vignettes injoignables dans les pages isolées ;
  parfaitement fonctionnel sur média réel.

### Non validable hors réseau INA — à dérouler avant merge

- [ ] `amalia-hls.html` / `amalia-controlbar.html` / `amalia-storyboard-plugin.html` avec les
      médias INA réels (backwardsSrc, `hls.js`, vignettes de la progress-bar).
- [ ] **Histogram / waveform** : les peaks viennent de `lvltojson.wsmedia.d.sas.ina`
      (la structure `minimap-container` + `wavesurfer-container` est rendue, mais aucun
      wavesurfer instancié sans données).
- [ ] **Entrée/sortie plein écran** : `fullScreenMode` est dérivé de l'événement `resize`
      (`handleWindowResize`) ; en fenêtre pilotée par CDP le passage plein écran ne change pas
      la taille de fenêtre, donc l'état ne bascule pas. Vérifié réactif en forçant un `resize`
      (icône `fullscreen` ↔ `compress`) — à confirmer sur un vrai navigateur.
- [ ] **Annotation / segments** (CRUD, chips, autocomplete, dialog de confirmation, export
      JSON + Excel, snapshot) : aucun sample ne déclare `<amalia-annotation>` → à dérouler
      dans `player-expert`.
- [ ] `amalia-test-vitesses.html` et le mode photo (zoom/magnifier/crop) : médias absents.
- [ ] Sélection rectangle de segments : mécanisme non trouvé côté timeline (la case
      « Sélectionner des segments » existe mais ne change pas le clic → seek) ; à préciser
      côté annotation.
- [ ] Mesures Angular DevTools (M1/M2) : non relevées, nécessitent le scénario de référence
      sur média INA.
