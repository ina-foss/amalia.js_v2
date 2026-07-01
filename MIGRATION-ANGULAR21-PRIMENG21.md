# Bilan de migration : Angular 18 / PrimeNG 17 → Angular 21 / PrimeNG 21

> Bilan technique du passage du player `@ina/amalia` (`c:\windsurf\amalia\core`) d'Angular 18 / PrimeNG 17 vers Angular 21 / PrimeNG 21, fondé sur l'analyse des diffs git réels entre la tag `2.1.24` (`8108ed6`) et la branche `angular-primeng-upgrade` (`ae7cdfe`).

---

## 1. Synthèse exécutive

| Dépendance | Avant (2.1.24) | Après (2.1.25) |
| --- | --- | --- |
| `@angular/*` | `^18.0.0` | `21.2.17` (épinglé) |
| `@angular/cdk` | _absent_ | `^21.0.0` |
| `primeng` | `^17.18.12` | `^21.0.0` |
| `typescript` | `~5.5.0` | `~5.9.0` |
| `zone.js` | `~0.14.3` | `~0.15.0` |
| `@angular-devkit/build-angular` | `^18.0.6` | `^21.0.0` |
| `ngx-build-plus` | `^18.0.0` | `^20.0.0` |

**5 gains majeurs :**

1. **Performance de build** : passage à la chaîne esbuild/Vite d'Angular 21 et `moduleResolution: bundler`.
2. **Performance runtime** : moteur de réactivité moderne (signals, prêt pour le mode zoneless), theming PrimeNG par tokens plus léger.
3. **Sécurité** : retour sur des versions LTS maintenues (correctifs CVE Angular et PrimeNG), dépendances modernisées.
4. **Robustesse** : type-checking de template renforcé par défaut, TypeScript 5.9.
5. **Maintenabilité** : composants standalone, API PrimeNG v21 plus cohérente, alignement avec l'écosystème.

---

## 2. Montée de versions (faits)

Extrait du diff `package.json` :

- Angular `^18.0.0` → **`21.2.17`** : toutes les briques `@angular/*` (`animations`, `common`, `compiler`, `core`, `elements`, `forms`, `platform-browser`, `platform-browser-dynamic`, `router`) sont désormais **épinglées** à une version exacte (plus de plage `^`), ce qui garantit la reproductibilité des builds.
- Ajout de **`@angular/cdk ^21.0.0`** (dépendance désormais requise par PrimeNG 21).
- PrimeNG `^17.18.12` → **`^21.0.0`**.
- TypeScript `~5.5.0` → **`~5.9.0`**.
- zone.js `~0.14.3` → **`~0.15.0`**.
- Outillage : `@angular-devkit/build-angular`, `@angular-eslint/*`, `@angular/cli` → `^21`, `ngx-build-plus 18 → 20`.

Config TypeScript (`tsconfig.json`) :

- `moduleResolution: "node" → "bundler"` : résolution de modules alignée sur les bundlers modernes (meilleure prise en charge des `exports` de `package.json`).
- Suppression de `fullTemplateTypeCheck` (option dépréciée ; le strict template checking est désormais le comportement par défaut).

---

## 3. Aspects positifs

### 3.1 Performance

- **Build** : Angular 21 s'appuie sur la chaîne esbuild/Vite (`@angular-devkit/build-angular 21`), nettement plus rapide en compilation et en rebuild incrémental que le pipeline Webpack d'Angular 18.
- **Résolution de modules** : `moduleResolution: bundler` réduit les ambiguïtés de résolution et améliore le tree-shaking.
- **Réactivité** : la base Angular 21 (signals, compatibilité zoneless) ouvre la voie à une détection de changement plus fine et moins coûteuse.
- **CSS / theming** : suppression de l'import global `primeng/resources/primeng.min.css` (cf. `src/styles.scss`). PrimeNG 21 fonctionne par **design tokens** injectés dynamiquement, ce qui allège le CSS embarqué et évite le chargement d'une feuille de style monolithique.

### 3.2 Sécurité

- Retour sur des versions **LTS activement maintenues** : Angular 18 et PrimeNG 17 ne reçoivent plus les correctifs de sécurité ; la migration réintègre le flux de patchs (CVE Angular, dépendances transitives).
- **Modernisation des dépendances** transitives (via `package-lock.json` entièrement régénéré).
- **Type-checking de template** renforcé par défaut, réduisant les erreurs silencieuses au runtime.

### 3.3 Maintenabilité & DX

- **Composants standalone** désormais par défaut : architecture plus modulaire, imports explicites.
- **API PrimeNG v21** plus cohérente (nommage des modules harmonisé).
- **TypeScript 5.9** : meilleure inférence de types et messages d'erreur plus précis.
- **Alignement écosystème** : facilite l'intégration côté `player-expert` et les futures montées de version.

---

## 4. Changements importants (breaking changes)

### 4.1 Renommages de modules PrimeNG (`app.module.ts`)

| Avant (v17) | Après (v21) |
| --- | --- |
| `InputTextareaModule` | `TextareaModule` |
| `InputSwitchModule` | `ToggleSwitchModule` |
| `MessagesModule` | `MessageModule` |
| `ChipsModule` | _supprimé_ |

### 4.2 Suppression de `<p-messages>`

Le composant `<p-messages>` a été retiré de PrimeNG 21. Il est remplacé par un composant maison **`InaMessagesComponent`** (`src/app/core/messages/`) reproduisant le markup et les classes CSS PrimeNG pour préserver le style et la compatibilité des tests.

### 4.3 Composants standalone par défaut

`ToastComponent` et `InaMessagesComponent` sont déplacés de `imports` vers `declarations` dans `app.module.ts`, conformément au nouveau comportement standalone d'Angular 21.

### 4.4 API Accordion

- Suppression de `activeIndex` au profit d'un modèle basé sur `value`.
- Renommage des classes CSS : `.p-accordion-panel → .p-accordionpanel`, `.p-accordion-header → .p-accordionheader`.
- Ajustement du comportement de collapse (hauteur des panneaux inactifs).

### 4.5 API / CSS Tree

- Renommage des classes : `.p-tree-node-content.p-highlight → .p-tree-node-content.p-tree-node-selected`.
- Ajustement des `pTemplate` (`node` → `default`) pour restaurer le rendu (pastilles de couleur).
- Re-stylage des checkbox, chevrons (toggle) et icône de filtre.

### 4.6 Encapsulation Shadow DOM & theming

Le player est exposé en **custom element** avec `ViewEncapsulation.ShadowDom`. En PrimeNG v21, l'habillage des composants n'est plus une feuille CSS importée mais un **thème global injecté par design tokens** dans le `<head>` du document. Or **les styles globaux ne traversent pas la frontière Shadow DOM** : les *widgets PrimeNG* rendus **à l'intérieur** du shadow root se retrouvent donc sans leur habillage v21.

**Périmètre exact** : cela ne concerne **que les composants PrimeNG utilisés dans la timeline** (Tree, Accordion, Checkbox, Menu), et **un seul fichier** a été touché — `timeline-plugin.component.scss` (+176 lignes, cf. commit `0b5026d`). Les **styles des composants maison ne sont pas affectés** : le SCSS d'un composant Angular est compilé avec lui et injecté *dans* son shadow root, donc il continue de s'appliquer normalement. Seuls les styles tiers (PrimeNG), qui dépendaient du thème *global* extérieur au shadow, ont dû être **re-localisés**.

Styles ré-implémentés localement :

- **Checkbox** : `.p-checkbox-input` rendu transparent et `.p-checkbox-box` re-dimensionnée (le nouvel `<input>` natif décalait la case).
- **Tree** : chevrons (couleur de l'icône, suppression du « point » de fond, masquage sur les nœuds feuilles), suppression des puces `::marker`, icône de filtre repositionnée via `.p-iconfield`/`.p-inputicon` (remplace `.p-tree-filter-container` obsolète), restauration du padding des lignes et de l'alignement des nœuds racine ; bascule de `pTemplate="node"` vers `"default"` pour restaurer les pastilles de couleur.
- **Accordion** : correction du sélecteur `.p-accordion-panel` → `.p-accordionpanel` (habillage des lignes et espacement inter-lignes), et collapse des panneaux inactifs (`display: none`) puisque le CSS de collapse par grille/motion de v21 n'est pas disponible dans le Shadow DOM.

### 4.7 Injection Angular 21 (`plugin-base.ts`)

Angular 21 est plus strict sur l'usage de `inject()` hors contexte d'injection (erreur `NG0203`). `PluginBase` adopte une **injection défensive** :

```ts
private static tryInject<T>(token: ProviderToken<T>): T | null {
    try {
        return inject(token, { optional: true });
    } catch {
        return null;
    }
}
```

`NgZone` et `ChangeDetectorRef` sont injectés de cette manière, et un wrapper `wrapInZone` garantit que les handlers d'événements (émis depuis un `EventEmitter` Node, souvent hors zone Angular) ré-entrent dans la zone et déclenchent la détection de changement (`markForCheck`).

---

## 5. Impacts sur les tests

La migration a nécessité une mise à jour large des specs :

- Renommage des modules PrimeNG dans les `TestBed` (`InputSwitch → ToggleSwitch`, `Messages → Message`).
- Ajout de `standalone: false` sur les composants de test inline (Angular 21 les considère standalone par défaut).
- Ajout de `CUSTOM_ELEMENTS_SCHEMA` pour tolérer les composants PrimeNG internes.
- Correction des sélecteurs CSS obsolètes (`.p-accordion-header → .p-accordionheader`, etc.).
- Déplacement de `ToastComponent` de `imports` vers `declarations`.
- Ajout de mocks DOM (`getBoundingClientRect`) là où la logique refactorée l'exigeait.
- Retrait de `primeng.min.css` des styles de test dans `angular.json`.

---

## 6. Risques résiduels & recommandations

- **Shadow DOM côté `player-expert`** : valider le rendu visuel après `npm link` (cf. workflow `linkToPXAndStartPX.sh`), les styles encapsulés étant sensibles.
- **ESLint / TypeScript** : `@typescript-eslint` ne supporte pas encore officiellement TS 5.9 (warning au lint) ; surveiller une montée de version compatible.
- **Adoption progressive des signals** et évaluation du **mode zoneless** pour capitaliser sur les gains de performance d'Angular 21.
- **Couverture de tests** : maintenir la suite verte après chaque ajustement de style/API PrimeNG.

---

_Document généré à partir de l'analyse git de la branche `angular-primeng-upgrade` (commit `ae7cdfe`) — version `@ina/amalia` 2.1.25._
