import { ChangeDetectionStrategy, Component, Input, signal, WritableSignal } from "@angular/core";
import { MessageService, PrimeTemplate } from "primeng/api";
import { Bind } from "primeng/bind";
import { Toast } from "primeng/toast";
import { ProgressBar } from "primeng/progressbar";

/**
 * Données portées par chaque message du toast : la progression (0-100) est un signal —
 * les timers de {@link ToastComponent#updateProgress} l'écrivent et la vue (OnPush)
 * se rafraîchit via la réactivité des signals, sans `detectChanges()` manuel.
 */
interface ToastMessageData {
    progress: WritableSignal<number>;
}

@Component({
    selector: "amalia-toast",
    templateUrl: "./toast.component.html",
    styleUrl: "./toast.component.scss",
    imports: [Bind, Toast, PrimeTemplate, ProgressBar],
    // OnPush (phase 7 vague 1) : le template ne lit que des @Input (key/position) et le
    // signal message.data.progress ; p-toast gère lui-même ses messages via MessageService.
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent {
    constructor(private messageService: MessageService) {}

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
        const data: ToastMessageData = { progress: signal(0) };
        msg.data = data;
        const life = msg.life ? msg.life : 5000;
        if (life >= 3500) {
            setTimeout(() => {
                data.progress.set(100);
            }, life - 1000);
            const period = life / 50;
            const interval = setInterval(() => {
                data.progress.update((progress) => progress + 2);
                if (data.progress() >= 100) {
                    clearInterval(interval);
                }
            }, period);
        } else {
            data.progress.set(50);
            setTimeout(() => {
                data.progress.set(100);
            }, 50);
        }
        setTimeout(() => {
            this.onConfirm();
        }, life);
    }
}
