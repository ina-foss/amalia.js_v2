import { Directive, ElementRef, inject, input, NgZone, OnDestroy, OnInit, Signal } from "@angular/core";

/**
 * Signature du handler consommateur des directives hors-zone : il reçoit le dernier
 * événement DOM de la frame (throttle requestAnimationFrame).
 */
export type OutsideZoneEventHandler = (event: Event) => void;

/**
 * Base des directives d'événements haute fréquence hors zone Angular (phase 8 du chantier
 * performance) : le listener DOM est attaché via `NgZone.runOutsideAngular` et coalescé par
 * `requestAnimationFrame` (le dernier événement de la frame gagne). Ni l'événement ni le rAF
 * ne déclenchent de change detection : c'est au handler consommateur d'écrire des signals —
 * l'écriture programme seule le tick coalescé (scheduler hybride), les composants étant OnPush.
 *
 * Le handler est fourni par un input-callback (et non un output) : un output lié en template
 * passerait par le `wrapListener` d'Ivy qui appelle `markViewDirty` à chaque émission, ce qui
 * re-rendrait la vue OnPush hôte à chaque frame — exactement le coût que l'on veut éviter.
 */
@Directive()
abstract class OutsideZoneEventDirective implements OnInit, OnDestroy {
    /** Nom de l'événement DOM écouté, fourni par la directive concrète. */
    protected abstract readonly eventName: string;
    /** Callback consommateur, fourni par l'input de la directive concrète. */
    protected abstract readonly handler: Signal<OutsideZoneEventHandler>;

    private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
    private readonly ngZone = inject(NgZone);

    private rafId: number | null = null;
    private lastEvent: Event | null = null;

    /**
     * Listener DOM brut : mémorise le dernier événement reçu et programme au plus un
     * requestAnimationFrame par frame ; le handler consommateur n'est invoqué qu'au rAF,
     * avec ce dernier événement.
     */
    private readonly domListener = (event: Event): void => {
        this.lastEvent = event;
        if (this.rafId === null) {
            this.rafId = requestAnimationFrame(() => {
                this.rafId = null;
                const lastEvent = this.lastEvent;
                this.lastEvent = null;
                if (lastEvent !== null) {
                    this.handler()(lastEvent);
                }
            });
        }
    };

    ngOnInit(): void {
        // Hors zone : zone.js enregistre le listener dans la zone racine, donc ni le
        // dispatch de l'événement ni le rAF qu'il programme ne ré-entrent dans Angular.
        this.ngZone.runOutsideAngular(() => {
            this.elementRef.nativeElement.addEventListener(this.eventName, this.domListener, { passive: true });
        });
    }

    ngOnDestroy(): void {
        this.elementRef.nativeElement.removeEventListener(this.eventName, this.domListener);
        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
        this.lastEvent = null;
    }
}

/**
 * `mousemove` hors zone + throttle rAF.
 * Usage : `<div [amaliaOutsideMousemove]="onMousemoveOutside">` où `onMousemoveOutside`
 * est une propriété fléchée du composant (le handler s'exécute hors zone Angular).
 */
@Directive({ selector: "[amaliaOutsideMousemove]" })
export class OutsideZoneMousemoveDirective extends OutsideZoneEventDirective {
    protected readonly eventName = "mousemove";
    public readonly amaliaOutsideMousemove = input.required<OutsideZoneEventHandler>();
    protected readonly handler = this.amaliaOutsideMousemove;
}

/**
 * `scroll` hors zone + throttle rAF.
 * Usage : `<div [amaliaOutsideScroll]="onScrollOutside">` où `onScrollOutside`
 * est une propriété fléchée du composant (le handler s'exécute hors zone Angular).
 */
@Directive({ selector: "[amaliaOutsideScroll]" })
export class OutsideZoneScrollDirective extends OutsideZoneEventDirective {
    protected readonly eventName = "scroll";
    public readonly amaliaOutsideScroll = input.required<OutsideZoneEventHandler>();
    protected readonly handler = this.amaliaOutsideScroll;
}
