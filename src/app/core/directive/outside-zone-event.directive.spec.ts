import { Component, NgZone } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { OutsideZoneMousemoveDirective, OutsideZoneScrollDirective } from "./outside-zone-event.directive";

@Component({
    template: `<div
        class="target"
        [amaliaOutsideMousemove]="onMove"
        [amaliaOutsideScroll]="onScroll"
        style="height: 20px; overflow: auto"
    ></div>`,
    imports: [OutsideZoneMousemoveDirective, OutsideZoneScrollDirective],
})
class TestHostComponent {
    readonly moveEvents: Event[] = [];
    readonly scrollEvents: Event[] = [];
    readonly inAngularZone: boolean[] = [];
    onMove = (event: Event): void => {
        this.moveEvents.push(event);
        this.inAngularZone.push(NgZone.isInAngularZone());
    };
    onScroll = (event: Event): void => {
        this.scrollEvents.push(event);
    };
}

describe("OutsideZoneEventDirective (mousemove/scroll)", () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let host: TestHostComponent;
    let target: HTMLElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent],
        }).compileComponents();
        fixture = TestBed.createComponent(TestHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
        target = fixture.nativeElement.querySelector(".target");
    });

    it("exécute le handler hors zone Angular (listener et rAF enregistrés hors zone)", (done) => {
        host.onMove = () => {
            expect(NgZone.isInAngularZone()).toBeFalse();
            done();
        };
        // Propage la nouvelle valeur de l'input-callback avant de dispatcher.
        fixture.detectChanges();
        target.dispatchEvent(new MouseEvent("mousemove"));
    });

    describe("avec requestAnimationFrame contrôlé", () => {
        /** Vue interne minimale des directives testées : id du rAF programmé par le throttle. */
        type ThrottledDirective = { rafId: number | null };

        let rafCallbacks: Map<number, FrameRequestCallback>;
        let nextRafId: number;
        let mousemoveDirective: OutsideZoneMousemoveDirective;
        let scrollDirective: OutsideZoneScrollDirective;

        beforeEach(() => {
            rafCallbacks = new Map();
            nextRafId = 1;
            spyOn(window, "requestAnimationFrame").and.callFake((callback: FrameRequestCallback) => {
                const id = nextRafId++;
                rafCallbacks.set(id, callback);
                return id;
            });
            spyOn(window, "cancelAnimationFrame").and.callFake((id: number) => {
                rafCallbacks.delete(id);
            });
            const targetDebugElement = fixture.debugElement.query(By.directive(OutsideZoneMousemoveDirective));
            mousemoveDirective = targetDebugElement.injector.get(OutsideZoneMousemoveDirective);
            scrollDirective = targetDebugElement.injector.get(OutsideZoneScrollDirective);
        });

        /**
         * Id du rAF actuellement programmé par la directive (null si aucun).
         *
         * L'attribution passe par l'état de la directive et non par le compteur du spy :
         * `window.requestAnimationFrame` est global, et les autres suites du run (boucles rAF
         * de composants encore vivants, ticks programmés par le scheduler Angular) l'appellent
         * aussi. Comme Jasmine exécute les specs dans un ordre aléatoire, les assertions sur
         * `toHaveBeenCalledTimes`/`calls.count()` étaient donc rouges une passe sur deux.
         */
        function pendingRafId(directive: OutsideZoneMousemoveDirective | OutsideZoneScrollDirective): number | null {
            return (directive as unknown as ThrottledDirective).rafId;
        }

        /** Simule la fin de frame : exécute le rAF en attente des seules directives testées. */
        function flushFrame(): void {
            [mousemoveDirective, scrollDirective].forEach((directive) => {
                const id = pendingRafId(directive);
                if (id === null) {
                    return;
                }
                const callback = rafCallbacks.get(id);
                rafCallbacks.delete(id);
                callback?.(0);
            });
        }

        it("n'invoque pas le handler de façon synchrone et ne programme qu'un rAF par frame", () => {
            target.dispatchEvent(new MouseEvent("mousemove"));
            const rafId = pendingRafId(mousemoveDirective);
            target.dispatchEvent(new MouseEvent("mousemove"));
            expect(host.moveEvents.length).toBe(0);
            expect(rafId).not.toBeNull();
            // Le 2e événement de la frame réutilise le rAF déjà programmé (aucun nouvel id).
            expect(pendingRafId(mousemoveDirective)).toBe(rafId);
        });

        it("délivre uniquement le dernier événement de la frame", () => {
            const first = new MouseEvent("mousemove", { clientX: 1 });
            const last = new MouseEvent("mousemove", { clientX: 2 });
            target.dispatchEvent(first);
            target.dispatchEvent(last);
            flushFrame();
            expect(host.moveEvents.length).toBe(1);
            expect(host.moveEvents[0]).toBe(last);
        });

        it("ré-arme le throttle à chaque frame", () => {
            target.dispatchEvent(new MouseEvent("mousemove"));
            const firstRafId = pendingRafId(mousemoveDirective);
            flushFrame();
            // Throttle relâché à l'exécution du rAF…
            expect(pendingRafId(mousemoveDirective)).toBeNull();
            target.dispatchEvent(new MouseEvent("mousemove"));
            // … et re-programmé pour la frame suivante (nouvel id).
            const secondRafId = pendingRafId(mousemoveDirective);
            flushFrame();
            expect(host.moveEvents.length).toBe(2);
            expect(firstRafId).not.toBeNull();
            expect(secondRafId).not.toBeNull();
            expect(secondRafId).not.toBe(firstRafId);
        });

        it("écoute aussi l'événement scroll (directive dédiée)", () => {
            target.dispatchEvent(new Event("scroll"));
            flushFrame();
            expect(host.scrollEvents.length).toBe(1);
            expect(host.scrollEvents[0].type).toBe("scroll");
        });

        it("au destroy, retire le listener et annule le rAF en attente", () => {
            target.dispatchEvent(new MouseEvent("mousemove"));
            const rafId = pendingRafId(mousemoveDirective);
            expect(rafId).not.toBeNull();
            expect(rafCallbacks.has(rafId)).toBeTrue();
            fixture.destroy();
            // Le rAF en attente a été annulé (cancelAnimationFrame retire le callback).
            expect(window.cancelAnimationFrame).toHaveBeenCalledWith(rafId);
            expect(rafCallbacks.has(rafId)).toBeFalse();
            expect(pendingRafId(mousemoveDirective)).toBeNull();
            flushFrame();
            expect(host.moveEvents.length).toBe(0);
            // Le listener DOM est retiré : l'événement ne programme plus rien.
            target.dispatchEvent(new MouseEvent("mousemove"));
            expect(pendingRafId(mousemoveDirective)).toBeNull();
            flushFrame();
            expect(host.moveEvents.length).toBe(0);
        });
    });
});
