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

    @Input()
    key: string;
    @Input()
    position: ToastPositionType;

    public addMessage(msg: any) {
        this.messageService.add(msg);
        this.updateProgress(msg);
    }

    onConfirm() {
        this.messageService.clear(this.key);
    }

    updateProgress(msg: any) {
        msg.data = {progress: 0};
        const life = msg.life ? msg.life : 3000;
        if (life >= 3500) {
            setTimeout(() => {
                msg.data.progress = 100;
                this.cdr.detectChanges();
            }, life - 1000);
            const period = life / 10;
            const interval = setInterval(() => {
                msg.data.progress += 10;
                this.cdr.detectChanges();
                if (msg.data.progress >= 100) {
                    clearInterval(interval);
                }
            }, period);

        } else {
            msg.data.progress = 50;
            this.cdr.markForCheck();
            setTimeout(() => {
                msg.data.progress = 100;
                this.cdr.detectChanges();
            }, 50);
        }
        setTimeout(() => {
            this.onConfirm();
        }, life);
    }

}
