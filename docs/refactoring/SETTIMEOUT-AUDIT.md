# Audit des setTimeout / setInterval — gate du passage zoneless

Grille de triage des ~118 occurrences non-spec (25 fichiers) recensées au 2026-07-22. Complétée pendant les PR OnPush (phase 7) puis **soldée en phase 8**. **Le passage zoneless (phase 9) est bloqué tant que toutes les occurrences de catégorie (b) et (c) ne sont pas soldées — c'est fait : tout est trié ✅.**

## Catégories

- **(a) DOM/timing pur** — focus, classList, scroll nudges, flags internes non bindés, cancel de throttle. → **Aucune action** (zoneless-safe par nature).
- **(b) Mutation d'état template-bound** — le callback affecte un champ lu par le template. → **Convertir le champ en signal** (l'écriture programme la CD, zone ou pas). Cas particulier : état tiers non signalisable (TreeNode PrimeNG) → `markForCheck()` explicite en fin de callback.
- **(c) Hack « attendre le rendu »** — `setTimeout(..., 0|50)` pour attendre qu'Angular ait peint. → **Remplacer par `afterNextRender()`** (helper `PluginBase.runAfterNextRender`, injecteur passé explicitement ; exécution directe en fallback quand le composant est instancié avec `new` dans les specs).

## Inventaire par fichier (recompté phase 8, appels réels hors specs et hors commentaires/`typeof`)

| Fichier | Occurrences | Triage |
|---|---|---|
| `plugins/annotation/segment/segment.component.ts` | 24 | ✅ trié phase 7 vague 3 (voir détail) |
| `plugins/control-bar/control-bar-plugin.component.ts` | 14 | ✅ trié phase 7 vague 3 (voir détail) |
| `plugins/storyboard/storyboard-plugin.component.ts` | 7 (était 8 : 1 converti en `afterNextRender`) | ✅ trié phase 8 (voir détail) |
| `plugins/timeline/timeline-plugin.component.ts` | 5 | ✅ trié phase 8 (voir détail) |
| `player/photo/components/PlayerHtmlElement.ts` | 5 | ✅ trié phase 8 : classe hors Angular (voir détail) |
| `plugins/transcription/transcription-plugin.component.ts` | 3 (était 4 : le `setTimeout(handleOnTimeChange, 50)` converti en `afterNextRender`) | ✅ trié phase 8 (voir détail) |
| `player/amalia.component.ts` | 3 + 1 setInterval | ✅ trié phase 7 vague 3 (voir détail) |
| `core/toast/toast.component.ts` | 3 + 1 setInterval | ✅ trié phase 8 (voir détail) |
| `plugins/annotation/annotation-plugin.component.ts` | 2 | ✅ trié phase 7 vague 3 (voir détail) |
| `plugins/histogram/histogram-plugin.component.ts` | 1 (usine `scheduleTimeout`, 12 sites d'appel) | ✅ trié phase 8 (voir détail) |
| `core/utils/utils.ts` | 1 | ✅ trié phase 8 (a) |
| `core/utils/hls-c2pa-bridge.ts` | 1 | ✅ trié phase 8 (a) |
| `core/media-player-element.ts` | 1 | ✅ trié phase 8 (a) |
| `core/media/media-element.ts` | 1 setInterval | ✅ trié phase 8 (a) |
| `core/directive/inaSortablejs/sortablejs.directive.ts` | 1 | ✅ trié phase 8 (a) |

Écart vs les ~118 de 2026-07-22 : les phases 1→7 ont supprimé ou signalisé une partie des occurrences (recomptage 2026-08 : 74 appels réels).

## Méthode

1. Pendant la PR OnPush d'un composant (phase 7), trier chacune de ses occurrences dans le tableau ci-dessous.
2. Catégorie (b) : le champ muté doit être un signal **avant** le flip OnPush du composant.
3. Catégorie (c) : `afterNextRender(() => {...}, { injector })` — attention, nécessite un contexte d'injection (voir `PluginBase.runAfterNextRender`).
4. Marquer ✅ avec la catégorie et l'action réalisée.

## Détail

Audité pendant la phase 7 vague 3 (amalia/control-bar/annotation/segment) et la phase 8 (le reste). Repères par fonction (les numéros de ligne dérivent).

| Fichier:site | Code (résumé) | Catégorie | Action | Statut |
|---|---|---|---|---|
| `amalia.component.ts` handleFullScreenChange | `setTimeout(updatePlayerSizeWithAspectRatio, 0)` | b | `ratio` converti en signal (le reste = styles DOM directs) | ✅ |
| `amalia.component.ts` startTimer | chrono 1800 ms → `hideControls()` (émission PLAYER_MOUSE_LEAVE) | a | aucune (pas d'état template) | ✅ |
| `amalia.component.ts` scrollPlaybackRateImages | `setInterval(displayImages, 1000)` | b | `enablePreviewThumbnail`/`thumbnailBlobVideo` convertis en signals (`tc` non lu par le template) | ✅ |
| `amalia.component.ts` loopImages | `setTimeout(loopImages, r)` récursif → `showImage` | b | `thumbnailBlobVideo` converti en signal | ✅ |
| `control-bar` handlePlaybackRateChange / changePlaybackRate / changePlaybackrate(click) / nextPlaybackRateImages | `setTimeout(selectActivePlaybackrate, 10)` ×4 | a | aucune (padding DOM du thumb du slider) | ✅ |
| `control-bar` applyShortcut (volume up/down) | `volumeMouseEnterTimeOut = setTimeout(hideAll, 1500)` ×2 | b | flags de menus (`enableMenu`, `enableVolumeSlider`, `enableListRatio`, `enableListPositionsSubtitle`) convertis en signals | ✅ |
| `control-bar` changeTooltipEmplacement | `setTimeout(déplacement .p-tooltip, 150)` | a | aucune (DOM pur, contrainte Fullscreen API) | ✅ |
| `control-bar` handleDisplayState | `setTimeout(updatePinAndSpeedSliderPositions, 100)` | a | aucune (classes SVG via Renderer2) | ✅ |
| `control-bar` displaySlider / changeSlider | `setTimeout(initDragThumb, 10)` ×2 | a | aucune (init interactjs sur DOM déjà rendu ; `selectedSlider` converti en signal par ailleurs) | ✅ |
| `control-bar` aspectRatioMouseEnter | `setTimeout(enableListRatio=false, 4000)` | b | `enableListRatio` converti en signal | ✅ |
| `control-bar` volumeMouseEnter | `setTimeout(enableVolumeSlider/openPisteAudio=false, 4000)` | b | `enableVolumeSlider`/`openPisteAudio` convertis en signals | ✅ |
| `control-bar` initDragThumb (interact move) | `setTimeout(handleMoveDragThumb, 50)` | a | aucune (padding/data-x DOM) | ✅ |
| `control-bar` initDragThumb (interact end) | `setTimeout(handleStopMoveDragThumb, 10)` | b | `currentPlaybackRate`/`currentPlaybackRateSlider` convertis en signals (via changePlaybackrate) | ✅ |
| `segment` activateEdition | `setTimeout(activate*Edition, 0)` ×6 | c | conservés : attendent l'enregistrement des FormControls par NgForm (pas le rendu) ; callbacks sans mutation d'état template (subscriptions seulement, avec markForCheck) → zoneless-safe | ✅ |
| `segment` start*Edit (title/tcIn/tcOut/tc/categories/keywords/description) | `setTimeout(focus/select, 0)` ×7 | a | aucune (focus DOM) | ✅ |
| `segment` onCategoriesBlur / onKeywordsBlur (refocus) | `setTimeout(input.focus, 0)` ×2 | a | aucune | ✅ |
| `segment` on{Categories,Keywords}{Blur,Escape,Enter} | `setTimeout(updateCategoriesAndKeywordsDisplay, 10)` ×6 | b | `hiddenCategoriesCount`/`hiddenKeywordsCount` déjà signals (le reste = styles DOM des chips) | ✅ |
| `segment` editSegment | `setTimeout(updateTcsDisplay, 100)` | a | aucune (mesures DOM ; `editableSegmentTcWrap` non lu par le template) | ✅ |
| `segment` positionToggleSpan | `setTimeout(…, 10)` | b | `truncatedDescription` converti en signal (le reste = styles DOM) | ✅ |
| `segment` toggleDescription | `setTimeout(…, 100)` | b | `truncatedDescription` converti en signal | ✅ |
| `annotation` addSegmentToSegmentsInfo / addSegmentAtIndex | `setTimeout(scroll, 50)` ×2 | a | aucune (scrollIntoView via Utils.waitFor ; liste notifiée par le signal segmentsVersion) | ✅ |
| `storyboard` handleMetadataLoaded | ~~`setTimeout(currentTime+handleSeeked, 100)`~~ | **c** | **converti en `runAfterNextRender` (phase 8)** : attendait le re-rendu du @for des miniatures (signal `listOfThumbnailFilter`) avant de resynchroniser la vignette active | ✅ |
| `storyboard` updateScrollForTimeCode | `setTimeout(isAutoScrolling=false, 100)` | a | aucune (flag interne anti-feedback de scroll, non bindé) | ✅ |
| `storyboard` handleScroll | `setTimeout(selectThumbnail, 800)` | a | aucune (classes DOM + dataset ; le délai couvre le scroll lissé de scrollToActiveThumbnail, pas le rendu ; `listOfThumbnailFilter` déjà signal) | ✅ |
| `storyboard` startAutoSyncTimer | `setTimeout(scrollToActiveThumbnail, 8000)` | a | aucune (chrono fonctionnel ; `displaySynchro` déjà signal) | ✅ |
| `storyboard` handleThumbnailSizeChange | `setTimeout(updateThumbnailSize, 250)` | a | aucune (attend la transition CSS avant les mesures getBoundingClientRect ; `openIntervalList`/`listOfThumbnailFilter` déjà signals) | ✅ |
| `storyboard` scrollToActiveThumbnail | `setTimeout(isAutoScrolling=false, 600)` + `setTimeout(seekToTc, 800)` | a | aucune (attend la fin du `scrollTo({behavior:'smooth'})` ; `displaySynchro` déjà signal) | ✅ |
| `storyboard` waitAndReload | `setTimeout(retry img.src, 500)` | a | aucune (DOM pur, retry d'image) | ✅ |
| `histogram` scheduleTimeout (usine unique, 12 sites : syncBottomInsetIfNeeded ×7, resizeDebounce ×2, attach observers ×2, forceMinimapRefit) | `setTimeout(cb, delay)` tracké dans `pendingTimeouts`, purgé au destroy | a/b | déjà soldé en phase 7 vague 2 : les callbacks ne font que du DOM/wavesurfer (hors zone) ou écrivent le signal `histogramBottomInsetSignal` | ✅ |
| `transcription` handleMetadataLoaded | ~~`setTimeout(handleOnTimeChange, 50)`~~ | **c** | **converti en `runAfterNextRender` (phase 8)** : attendait le re-rendu du template (mode détaché, vidéo en pause) avant la synchro initiale des mots | ✅ |
| `transcription` scrollToNode | `setTimeout(isAutoScrolling=false, 50)` | a | aucune (flag interne anti-feedback de scroll, non bindé) | ✅ |
| `transcription` scrollToSelectedSegment | `setTimeout(isAutoScrolling/automaticallyScrolled=false, 100)` | a | aucune (flags non lus par le template) | ✅ |
| `transcription` startAutoSyncTimer | `setTimeout(scrollToSelectedSegment, 8000)` | a | aucune (chrono fonctionnel ; `displaySynchro` déjà signal) | ✅ |
| `timeline` refreshTcInAndTcOutPositions | `setTimeout(styles left/right, 100)` | a | aucune (styles DOM des spans de timecode) | ✅ |
| `timeline` displayDashInTimeCode | `setTimeout(transform, 100)` + imbriqué `setTimeout(clamp transform, 100)` | a | aucune (mesures + styles DOM) | ✅ |
| `timeline` handleMouseEnterOnTc | `setTimeout(position tooltip, 10)` | a | aucune (styles DOM du bloc sélectionné) | ✅ |
| `timeline` updateTreeComponent | `setTimeout(checked/partialSelected des TreeNode, 10)` | **b** | TreeNode PrimeNG non signalisables → **`cdr.markForCheck()` ajouté en fin de callback (phase 8)** : hors zone, il programme le tick coalescé via le scheduler hybride → zoneless-safe. Le commentaire « doit rester dans la zone » des listeners METADATA_LOADED/USER_SEGMENT_CHANGED est actualisé (la zone reste requise pour parseTimelineMetadata, plus pour ce timer) | ✅ |
| `toast` updateProgress | `setTimeout(progress.set(100))` ×2 + `setInterval(progress.update)` | b | déjà soldé en phase 7 vague 1 : `progress` est un signal par message | ✅ |
| `toast` updateProgress (fin de vie) | `setTimeout(onConfirm → MessageService.clear, life)` | a | aucune (p-toast fait son propre `markForCheck` sur son abonnement MessageService → zoneless-safe) | ✅ |
| `PlayerHtmlElement` (photo) handleFullscreenChange / resetHideControlTimeout / requestFullscreen / createCropperInstance / replaceSrc | `setTimeout(...)` ×5 (cropper fit, hide controls, recreate cropper, retry, debounce src) | a | aucune : classe hors Angular (DOM + cropperjs) ; les événements émis passent par l'EventEmitter → les listeners portent leur ListenerZonePolicy | ✅ |
| `utils.ts` copyToClipBoard | `setTimeout(tooltip.classList.remove('show'), 1000)` | a | aucune (DOM pur) | ✅ |
| `hls-c2pa-bridge.ts` initC2PA | `setTimeout(async init c2pa, …)` | a | aucune (init de runtime WASM hors Angular) | ✅ |
| `media-player-element.ts` applyPicturePlayerLayout (runRetry) | `setTimeout(applyPicturePlayerLayoutFromHost, delay)` en chaîne | a | aucune (layout DOM du host picture, hors composant Angular) | ✅ |
| `media-element.ts` setRewindInterval | `setInterval(setCurrentTime, 30)` | a | aucune (cœur média hors Angular ; les TIME_CHANGE émis passent par les listeners policiés) | ✅ |
| `sortablejs.directive.ts` create | `setTimeout(Sortable.create + emit, 0)` | a | aucune (widget DOM tiers, pas d'état template ; l'output `sortablejsInit` est lié en template → `wrapListener` d'Ivy fait `markViewDirty` → tick planifié même hors zone) | ✅ |
