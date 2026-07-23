import { ChangeDetectorRef, Component, Input } from "@angular/core";
import { MessageService, PrimeTemplate } from "primeng/api";
import { Bind } from "primeng/bind";
import { Toast } from "primeng/toast";
import { ProgressBar } from "primeng/progressbar";

@Component({
    selector: "amalia-toast",
    templateUrl: "./toast.component.html",
    styleUrl: "./toast.component.scss",
    imports: [Bind, Toast, PrimeTemplate, ProgressBar],
})
export class ToastComponent {
    constructor(
        private cdr: ChangeDetectorRef,
        private messageService: MessageService,
    ) {}

    @Input()
    key: string;
    @Input()
    position: string;

    public addMessage(msg: any) {
        this.messageService.add(msg);
        this.updateProgress(msg);
    }

    onConfirm() {
        this.messageService.clear(this.key);
    }

    updateProgress(msg: any) {
        msg.data = { progress: 0 };
        const life = msg.life ? msg.life : 5000;
        if (life >= 3500) {
            setTimeout(() => {
                msg.data.progress = 100;
                this.cdr.detectChanges();
            }, life - 1000);
            const period = life / 50;
            const interval = setInterval(() => {
                msg.data.progress += 2;
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
