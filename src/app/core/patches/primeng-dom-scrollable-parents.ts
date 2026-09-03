import {DomHandler} from "primeng/dom";

/**
 * PrimeNG 21.1.9 : DomHandler.getScrollableParents remonte la chaîne des parentNode
 * et passe chaque nœud à getComputedStyle avec pour seule garde nodeType !== 9
 * (Document). Dans un custom element, le ShadowRoot (nodeType 11, parentNode null,
 * donc toujours dernier de la chaîne) passe la garde → TypeError « parameter 1 is
 * not of type 'Element' » au dernier tour de boucle, la liste construite est perdue
 * et p-overlay/pTooltip n'attachent jamais leurs listeners (scroll, click document,
 * resize, clavier) : le panneau ne se ferme/repositionne pas au scroll.
 *
 * Corrigé upstream dans @primeuix/utils (try/catch autour de getComputedStyle),
 * mais primeng/dom conserve une copie locale non gardée. Réimplémentation
 * iso-comportement avec garde `instanceof Element` — à retirer quand primeng/dom
 * déléguera à @primeuix/utils.
 */
const overflowRegex = /(auto|scroll)/;

const overflowCheck = (node: Element): boolean => {
    const styleDeclaration = window.getComputedStyle(node, null);
    return overflowRegex.test(styleDeclaration.getPropertyValue("overflow"))
        || overflowRegex.test(styleDeclaration.getPropertyValue("overflowX"))
        || overflowRegex.test(styleDeclaration.getPropertyValue("overflowY"));
};

const collectScrollSelectorTargets = (parent: any): Element[] => {
    const targets: Element[] = [];
    const scrollSelectors = parent.nodeType === 1 && parent.dataset["scrollselectors"];
    if (scrollSelectors) {
        for (const selector of scrollSelectors.split(",")) {
            const el = DomHandler.findSingle(parent, selector);
            if (el && overflowCheck(el)) {
                targets.push(el);
            }
        }
    }
    return targets;
};

DomHandler.getScrollableParents = (element: any): any[] => {
    const scrollableParents: any[] = [];
    if (element) {
        for (const parent of DomHandler.getParents(element)) {
            scrollableParents.push(...collectScrollSelectorTargets(parent));
            // Garde ajoutée : Document (9) mais aussi ShadowRoot (11) et tout autre
            // nœud non-Element sont ignorés au lieu d'être passés à getComputedStyle.
            if (parent instanceof Element && overflowCheck(parent)) {
                scrollableParents.push(parent);
            }
        }
    }
    return scrollableParents;
};
