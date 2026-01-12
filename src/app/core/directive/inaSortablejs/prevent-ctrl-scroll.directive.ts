import { Directive, HostListener } from '@angular/core';

@Directive({
    selector: '[appPreventCtrlScroll]'
})
export class PreventCtrlScrollDirective {

    @HostListener('wheel', ['$event'])
    onWheel(event: WheelEvent) {
        if (event.ctrlKey) {
            event.preventDefault();
        }
    }
}
