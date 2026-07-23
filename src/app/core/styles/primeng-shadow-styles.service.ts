import { Injectable, OnDestroy } from '@angular/core';

/**
 * Miroir des styles PrimeNG vers les shadow roots des web components Amalia.
 *
 * PrimeNG 21 (thème token-based + styles de base) injecte son CSS uniquement dans
 * `document.head` via des balises `<style data-primeng-style-id="...">` ; ce CSS
 * n'atteint jamais les composants rendus en Shadow DOM. Historiquement, le projet
 * compensait en important l'intégralité de styles.scss (dont le theme.css legacy
 * de 244 Ko) dans le SCSS de chaque composant concerné — soit ~1,4 Mo dupliqué
 * dans le bundle et autant de CSS dupliqué à runtime.
 *
 * Ce service réplique chaque balise de `document.head` en tête de chaque shadow
 * root enregistré (balise `<style data-amalia-primeng-mirror>`), et suit les
 * ajouts/mises à jour via un MutationObserver (PrimeNG injecte paresseusement au
 * premier rendu de chaque composant ; le callback s'exécute avant le paint, donc
 * sans FOUC). L'insertion EN TÊTE du shadow root reproduit l'ordre de cascade
 * historique : les styles PrimeNG d'abord, les styles du composant ensuite —
 * les surcharges locales continuent de gagner à spécificité égale.
 */
@Injectable({ providedIn: 'root' })
export class PrimengShadowStylesService implements OnDestroy {

    private static readonly HEAD_SELECTOR = 'style[data-primeng-style-id]';
    private static readonly MIRROR_ATTR = 'data-amalia-primeng-mirror';

    private readonly roots = new Set<WeakRef<ShadowRoot>>();
    private observer: MutationObserver | null = null;

    /**
     * Enregistre un shadow root : les styles PrimeNG déjà présents y sont copiés
     * immédiatement, les injections futures y seront répliquées.
     */
    public attach(root: ShadowRoot | null | undefined): void {
        if (!root) {
            return;
        }
        for (const ref of this.roots) {
            if (ref.deref() === root) {
                return;
            }
        }
        this.roots.add(new WeakRef(root));
        this.syncRoot(root);
        this.ensureObserver();
    }

    /** Réplique l'état courant de document.head vers tous les roots vivants. */
    private syncAll(): void {
        for (const ref of this.roots) {
            const root = ref.deref();
            if (root) {
                this.syncRoot(root);
            } else {
                this.roots.delete(ref);
            }
        }
    }

    private syncRoot(root: ShadowRoot): void {
        const headStyles = document.head.querySelectorAll<HTMLStyleElement>(PrimengShadowStylesService.HEAD_SELECTOR);
        let anchor: Node | null = root.firstChild;
        headStyles.forEach((headStyle) => {
            const styleId = headStyle.getAttribute('data-primeng-style-id');
            let mirror = root.querySelector<HTMLStyleElement>(`style[${PrimengShadowStylesService.MIRROR_ATTR}="${styleId}"]`);
            if (!mirror) {
                mirror = document.createElement('style');
                mirror.setAttribute(PrimengShadowStylesService.MIRROR_ATTR, styleId);
                // Insertion en tête, dans l'ordre de document.head (avant les styles du composant).
                root.insertBefore(mirror, anchor);
            }
            if (mirror.textContent !== headStyle.textContent) {
                mirror.textContent = headStyle.textContent;
            }
            anchor = mirror.nextSibling;
        });
    }

    private ensureObserver(): void {
        if (this.observer) {
            return;
        }
        this.observer = new MutationObserver(() => this.syncAll());
        this.observer.observe(document.head, { childList: true, subtree: true, characterData: true });
    }

    ngOnDestroy(): void {
        this.observer?.disconnect();
        this.observer = null;
        this.roots.clear();
    }
}
