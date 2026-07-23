import { SortablejsDirective } from "./sortablejs.directive";
import { Component } from "@angular/core";
import { TestBed, waitForAsync } from "@angular/core/testing";
import { ElementRef, NgZone, Renderer2, SimpleChange } from "@angular/core";
import Sortable from "sortablejs";
import { SortablejsService } from "./sortablejs.service";

describe("SortablejsDirective", () => {
    @Component({
        template: `
            <div [sortablejs]="items">
                @for (item of items; track item) {
                    <div>{{ item }}</div>
                }
            </div>
        `,
        imports: [SortablejsDirective],
    })
    class TestComponent1 {
        items = [1, 2, 3, 4, 5];
    }

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [TestComponent1, SortablejsDirective],
        }).compileComponents();
    }));

    it("should create", () => {
        const fixture = TestBed.createComponent(TestComponent1);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    });

    it("should create sortable instance on init and emit sortablejsInit", () => {
        jasmine.clock().install();
        const container = document.createElement("div");
        const host = document.createElement("div");
        host.appendChild(container);

        const service = new SortablejsService();
        const renderer = jasmine.createSpyObj<Renderer2>("Renderer2", ["removeChild", "insertBefore"]);
        const directive = new SortablejsDirective(
            null as any,
            service,
            new ElementRef(host),
            new NgZone({ enableLongStackTrace: false }),
            renderer,
        );
        directive.sortablejsContainer = "div";
        const instance = { destroy: jasmine.createSpy("destroy"), option: jasmine.createSpy("option") };
        spyOn(Sortable as any, "create").and.returnValue(instance as any);
        const emitSpy = spyOn(directive.sortablejsInit, "emit");

        directive.ngOnInit();
        jasmine.clock().tick(1);

        expect((Sortable as any).create).toHaveBeenCalled();
        expect(emitSpy).toHaveBeenCalledWith(instance as any);
        jasmine.clock().uninstall();
    });

    it("should update changed options in ngOnChanges and destroy on ngOnDestroy", () => {
        const service = new SortablejsService();
        const host = document.createElement("div");
        const renderer = jasmine.createSpyObj<Renderer2>("Renderer2", ["removeChild", "insertBefore"]);
        const directive = new SortablejsDirective(
            null as any,
            service,
            new ElementRef(host),
            new NgZone({ enableLongStackTrace: false }),
            renderer,
        );

        const optionSpy = jasmine.createSpy("option");
        const destroySpy = jasmine.createSpy("destroy");
        (directive as any).sortableInstance = { option: optionSpy, destroy: destroySpy };

        directive.sortablejsOptions = { animation: 100, sort: true } as any;
        directive.ngOnChanges({
            sortablejsOptions: new SimpleChange({ animation: 50, sort: true }, { animation: 100, sort: true }, false),
        } as any);
        expect(optionSpy).toHaveBeenCalledWith("animation", 100);

        directive.ngOnDestroy();
        expect(destroySpy).toHaveBeenCalled();
    });

    it("should execute onAdd/onRemove/onUpdate overridden behaviors", () => {
        const host = document.createElement("div");
        const renderer = jasmine.createSpyObj<Renderer2>("Renderer2", ["removeChild", "insertBefore"]);
        const service = new SortablejsService();
        const zone = { run: (fn: any) => fn() } as NgZone;

        const directive = new SortablejsDirective(null as any, service, new ElementRef(host), zone, renderer);

        const source = [1, 2, 3];
        directive.sortablejs = source as any;
        const onAddSpy = jasmine.createSpy("onAdd");
        const onAddOriginalSpy = jasmine.createSpy("onAddOriginal");
        const onRemoveSpy = jasmine.createSpy("onRemove");
        const onUpdateSpy = jasmine.createSpy("onUpdate");
        directive.sortablejsOptions = {
            onAdd: onAddSpy,
            onAddOriginal: onAddOriginalSpy,
            onRemove: onRemoveSpy,
            onUpdate: onUpdateSpy,
        } as any;

        const options = (directive as any).overridenOptions;

        options.onAdd({ newIndex: 1, oldIndex: 0 } as any);
        expect(typeof service.transfer).toBe("function");
        service.transfer([9]);
        expect(source).toEqual([1, 9, 2, 3]);
        expect(onAddSpy).toHaveBeenCalled();
        expect(onAddOriginalSpy).toHaveBeenCalled();

        (directive as any).sortableInstance = { options: { group: { checkPull: () => false } } };
        options.onRemove({ oldIndex: 0, newIndex: 0 } as any);
        expect(onRemoveSpy).toHaveBeenCalled();

        const updateSource = [1, 2, 3];
        directive.sortablejs = updateSource as any;
        options.onUpdate({ oldDraggableIndex: 0, newDraggableIndex: 2 } as any);
        expect(updateSource).toEqual([2, 3, 1]);
        expect(onUpdateSpy).toHaveBeenCalled();
    });

    it("should handle clone mode on remove with renderer operations", () => {
        const host = document.createElement("div");
        const parent = document.createElement("div");
        const item = document.createElement("div");
        const clone = document.createElement("div");
        parent.appendChild(item);
        parent.appendChild(clone);

        const renderer = jasmine.createSpyObj<Renderer2>("Renderer2", ["removeChild", "insertBefore"]);
        const service = new SortablejsService();
        const zone = { run: (fn: any) => fn() } as NgZone;

        const directive = new SortablejsDirective(null as any, service, new ElementRef(host), zone, renderer);
        directive.sortablejs = [5, 6] as any;
        directive.sortablejsCloneFunction = (v: number) => v * 10;
        directive.sortablejsOptions = { onRemove: jasmine.createSpy("onRemove") } as any;
        service.transfer = jasmine.createSpy("transfer");
        (directive as any).sortableInstance = { options: { group: { checkPull: () => "clone" } } };

        (directive as any).overridenOptions.onRemove({
            oldIndex: 1,
            newIndex: 0,
            item,
            clone,
        } as any);

        expect(renderer.removeChild).toHaveBeenCalled();
        expect(renderer.insertBefore).toHaveBeenCalled();
        expect(service.transfer).toBeNull();
    });
});
