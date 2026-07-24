# Audit des setTimeout / setInterval — gate du passage zoneless

Grille de triage des ~118 occurrences non-spec (25 fichiers). À compléter pendant les PR OnPush (phase 7) et la phase 8. **Le passage zoneless (phase 9) est bloqué tant que toutes les occurrences de catégorie (b) et (c) ne sont pas soldées.**

## Catégories

- **(a) DOM/timing pur** — focus, classList, scroll nudges, flags internes non bindés, cancel de throttle. → **Aucune action** (zoneless-safe par nature).
- **(b) Mutation d'état template-bound** — le callback affecte un champ lu par le template. → **Convertir le champ en signal** (l'écriture programme la CD, zone ou pas).
- **(c) Hack « attendre le rendu »** — `setTimeout(..., 0|50)` pour attendre qu'Angular ait peint. → **Remplacer par `afterNextRender()`**.

## Inventaire par fichier (compte non-spec au 2026-07-22)

| Fichier | Occurrences | Triage |
|---|---|---|
| `plugins/annotation/segment/segment.component.ts` | 24 (recompté phase 7 vague 3) | ✅ trié (voir détail) |
| `plugins/control-bar/control-bar-plugin.component.ts` | 14 | ✅ trié (voir détail) |
| `plugins/storyboard/storyboard-plugin.component.ts` | 9 | ⬜ à trier |
| `plugins/histogram/histogram-plugin.component.ts` | 7 | ⬜ à trier |
| `plugins/transcription/transcription-plugin.component.ts` | 5 | ⬜ à trier (dont `setTimeout(() => handleOnTimeChange(), 50)` :456 → catégorie b/c) |
| `plugins/timeline/timeline-plugin.component.ts` | 5 | ⬜ à trier |
| `player/amalia.component.ts` | 3 + 1 setInterval | ✅ trié (voir détail) |
| `plugins/annotation/annotation-plugin.component.ts` | 2 | ✅ trié (voir détail) |
| autres (17 fichiers) | ~47 | ⬜ à trier |

## Méthode

1. Pendant la PR OnPush d'un composant (phase 7), trier chacune de ses occurrences dans le tableau ci-dessous.
2. Catégorie (b) : le champ muté doit être un signal **avant** le flip OnPush du composant.
3. Catégorie (c) : `afterNextRender(() => {...}, { injector })` — attention, nécessite un contexte d'injection.
4. Marquer ✅ avec la catégorie et l'action réalisée.

## Détail (à compléter au fil des PR)

Audité pendant la phase 7 vague 3 (OnPush amalia/control-bar/annotation/segment). Repères par fonction (les numéros de ligne dérivent).

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
