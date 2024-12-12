import {ChangeDetectorRef, Component, Input} from '@angular/core';
import {ProgressBarModule} from "primeng/progressbar";
import {ToastModule, ToastPositionType} from "primeng/toast";
import {MessageService} from "primeng/api";
import {NgIf} from "@angular/common";

@Component({
    selector: 'amalia-toast',
    standalone: true,
    imports: [
        ProgressBarModule,
        ToastModule,
        NgIf
    ],
    templateUrl: './toast.component.html',
    styleUrl: './toast.component.scss'
})
export class ToastComponent {

    constructor(private cdr: ChangeDetectorRef, private messageService: MessageService) {
    }

    visible: boolean = false;
    @Input()
    key: string;
    @Input()
    position: ToastPositionType;

    public addMessage(msg: any) {
        if (!this.visible) {
            this.messageService.add(msg);
            this.updateProgress(msg);
            this.visible = true;
        }
    }

    onConfirm() {
        this.messageService.clear(this.key);
        this.visible = false;
    }

    updateProgress(msg: any) {
        msg.data = {progress: 0};
        const period = msg.life ? msg.life / 10 : 150;
        const interval = setInterval(() => {
            msg.data.progress += 10;
            if (msg.data.progress >= 220) {
                clearInterval(interval);
                this.onConfirm();
            }
            this.cdr.markForCheck();
        }, period);
    }

}
