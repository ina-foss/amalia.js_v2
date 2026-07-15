# CHANGELOG

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
