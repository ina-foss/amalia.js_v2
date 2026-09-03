import {ConnectedOverlayScrollHandler, DomHandler} from "primeng/dom";
import "./primeng-dom-scrollable-parents";

/**
 * Spec unitaire pure (sans TestBed) : vérifie que le patch de
 * DomHandler.getScrollableParents rend la fonction non-jetante en Shadow DOM
 * (le ShadowRoot, nodeType 11, était passé à getComputedStyle → TypeError) et
 * que ConnectedOverlayScrollHandler peut donc enfin lier ses listeners de scroll
 * — le défaut fonctionnel réel derrière l'erreur console.
 */
describe("primeng-dom-scrollable-parents (patch DomHandler)", () => {
    let host: HTMLElement;

    afterEach(() => {
        host?.remove();
    });

    function createShadowTarget(): {scrollable: HTMLElement; target: HTMLElement} {
        host = document.createElement("div");
        document.body.appendChild(host);
        const shadowRoot = host.attachShadow({mode: "open"});
        const scrollable = document.createElement("div");
        scrollable.style.overflow = "auto";
        shadowRoot.appendChild(scrollable);
        const target = document.createElement("div");
        scrollable.appendChild(target);
        return {scrollable, target};
    }

    it("ne jette plus sur un élément dans un ShadowRoot et ignore le ShadowRoot", () => {
        const {scrollable, target} = createShadowTarget();

        let result: Element[] = [];
        expect(() => {
            result = DomHandler.getScrollableParents(target);
        }).not.toThrow();

        expect(result).toEqual([scrollable]);
    });

    it("lie les listeners de scroll via ConnectedOverlayScrollHandler (avant : jamais liés)", () => {
        const {scrollable, target} = createShadowTarget();
        const listener = jasmine.createSpy("scrollListener");
        spyOn(scrollable, "addEventListener").and.callThrough();

        const handler = new ConnectedOverlayScrollHandler(target, listener);
        expect(() => handler.bindScrollListener()).not.toThrow();

        expect(scrollable.addEventListener).toHaveBeenCalledWith("scroll", listener);
        handler.destroy();
    });

    it("garde le comportement d'origine hors Shadow DOM (parents scrollables Element, Document exclu)", () => {
        host = document.createElement("div");
        host.style.overflow = "scroll";
        document.body.appendChild(host);
        const target = document.createElement("span");
        host.appendChild(target);

        const result = DomHandler.getScrollableParents(target);

        // Le body de la page Karma peut être lui-même scrollable : on vérifie
        // l'intention (host détecté, uniquement des Element, Document exclu)
        // sans figer l'environnement du runner.
        expect(result).toContain(host);
        expect(result.every((node: Node) => node instanceof Element)).toBeTrue();
    });

    it("conserve la gestion data-scrollselectors de l'original", () => {
        host = document.createElement("div");
        host.dataset["scrollselectors"] = ".inner-scroll";
        document.body.appendChild(host);
        const inner = document.createElement("div");
        inner.className = "inner-scroll";
        inner.style.overflowY = "auto";
        host.appendChild(inner);
        const target = document.createElement("span");
        host.appendChild(target);

        const result = DomHandler.getScrollableParents(target);

        expect(result).toContain(inner);
    });
});
