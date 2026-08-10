import { Component, NgZone } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
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
        let rafCallbacks: Map<number, FrameRequestCallback>;
        let nextRafId: number;

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
        });

        /** Simule la fin de frame : exécute (et vide) les callbacks rAF en attente. */
        function flushFrame(): void {
            const callbacks = Array.from(rafCallbacks.values());
            rafCallbacks.clear();
            callbacks.forEach((callback) => callback(0));
        }

        it("n'invoque pas le handler de façon synchrone et ne programme qu'un rAF par frame", () => {
            target.dispatchEvent(new MouseEvent("mousemove"));
            target.dispatchEvent(new MouseEvent("mousemove"));
            expect(host.moveEvents.length).toBe(0);
            expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1);
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
            flushFrame();
            target.dispatchEvent(new MouseEvent("mousemove"));
            flushFrame();
            expect(host.moveEvents.length).toBe(2);
            expect(window.requestAnimationFrame).toHaveBeenCalledTimes(2);
        });

        it("écoute aussi l'événement scroll (directive dédiée)", () => {
            target.dispatchEvent(new Event("scroll"));
            flushFrame();
            expect(host.scrollEvents.length).toBe(1);
            expect(host.scrollEvents[0].type).toBe("scroll");
        });

        it("au destroy, retire le listener et annule le rAF en attente", () => {
            target.dispatchEvent(new MouseEvent("mousemove"));
            expect(rafCallbacks.size).toBeGreaterThan(0);
            fixture.destroy();
            // Le rAF en attente a été annulé (cancelAnimationFrame retire le callback).
            expect(window.cancelAnimationFrame).toHaveBeenCalled();
            flushFrame();
            expect(host.moveEvents.length).toBe(0);
            // Le listener DOM est retiré : plus aucun rAF programmé.
            const rafCallsBefore = (window.requestAnimationFrame as jasmine.Spy).calls.count();
            target.dispatchEvent(new MouseEvent("mousemove"));
            expect((window.requestAnimationFrame as jasmine.Spy).calls.count()).toBe(rafCallsBefore);
        });
    });
});
