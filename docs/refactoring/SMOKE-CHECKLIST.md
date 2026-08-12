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
  ⇒ karaoké mort après un cycle. Le DOM du plugin, lui, se re-rend.
- **Détach/réattach du `<amalia-player>`** : `element.mediaPlayerElement` devient `undefined`
  après le premier cycle (le `<video>` reste en `readyState 4`).
- **Storyboard** : aucune vignette rendue (`listOfThumbnailFilter` reste vide alors que
  `listOfThumbnail` = 5) — enchaînement `handleScroll`/`updateScrollHeight` qui exige un
  premier enfant déjà rendu.
- **`amalia-timeline-plugin.html`** : arbre vide (« No results found ») car la page déclare
  `plugin-instance="1095"` alors que `timeline-type.json` porte des types `…-P1`.
- **`amalia-photo-plugin.html`** : page obsolète — `amalia-photo` n'est pas un custom element
  enregistré (le mode photo/cropper vit dans le player, `src/app/player/photo/`).

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
