import { Directive, HostListener } from '@angular/core';

@Directive({
    selector: '[appPreventCtrlScroll]',
    standalone: false
})
export class PreventCtrlScrollDirective {

    @HostListener('wheel', ['$event'])
    onWheel(event: WheelEvent) {
        if (event.ctrlKey) {
            event.preventDefault();
        }
    }
}
