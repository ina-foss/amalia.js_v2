# Audit des setTimeout / setInterval — gate du passage zoneless

Grille de triage des ~118 occurrences non-spec (25 fichiers). À compléter pendant les PR OnPush (phase 7) et la phase 8. **Le passage zoneless (phase 9) est bloqué tant que toutes les occurrences de catégorie (b) et (c) ne sont pas soldées.**

## Catégories

- **(a) DOM/timing pur** — focus, classList, scroll nudges, flags internes non bindés, cancel de throttle. → **Aucune action** (zoneless-safe par nature).
- **(b) Mutation d'état template-bound** — le callback affecte un champ lu par le template. → **Convertir le champ en signal** (l'écriture programme la CD, zone ou pas).
- **(c) Hack « attendre le rendu »** — `setTimeout(..., 0|50)` pour attendre qu'Angular ait peint. → **Remplacer par `afterNextRender()`**.

## Inventaire par fichier (compte non-spec au 2026-07-22)

| Fichier | Occurrences | Triage |
|---|---|---|
| `plugins/annotation/segment/segment.component.ts` | 26 | ⬜ à trier |
| `plugins/control-bar/control-bar-plugin.component.ts` | 14 | ⬜ à trier |
| `plugins/storyboard/storyboard-plugin.component.ts` | 9 | ⬜ à trier |
| `plugins/histogram/histogram-plugin.component.ts` | 7 | ⬜ à trier |
| `plugins/transcription/transcription-plugin.component.ts` | 5 | ⬜ à trier (dont `setTimeout(() => handleOnTimeChange(), 50)` :456 → catégorie b/c) |
| `plugins/timeline/timeline-plugin.component.ts` | 5 | ⬜ à trier |
| autres (19 fichiers) | ~52 | ⬜ à trier |

## Méthode

1. Pendant la PR OnPush d'un composant (phase 7), trier chacune de ses occurrences dans le tableau ci-dessous.
2. Catégorie (b) : le champ muté doit être un signal **avant** le flip OnPush du composant.
3. Catégorie (c) : `afterNextRender(() => {...}, { injector })` — attention, nécessite un contexte d'injection.
4. Marquer ✅ avec la catégorie et l'action réalisée.

## Détail (à compléter au fil des PR)

| Fichier:ligne | Code (résumé) | Catégorie | Action | Statut |
|---|---|---|---|---|
| | | | | |
