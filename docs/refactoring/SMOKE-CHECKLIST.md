# Checklist de smoke test — chantier perf v21

À dérouler à la fin de chaque phase du [PLAN-PERF-2026.md](PLAN-PERF-2026.md), après `npm run build:component && npm run start-examples` (port 4203).

## Pré-requis

- [ ] `ng lint` vert
- [ ] `npm test` vert (51 specs, ChromeHeadlessCI)
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
