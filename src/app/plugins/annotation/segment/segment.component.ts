import {
    Component,
    computed,
    effect,
    EventEmitter,
    input,
    Input,
    Output,
    signal,
    ViewChild
} from '@angular/core';
import {AnnotationAction, AnnotationLocalisation} from "../../../core/metadata/model/annotation-localisation";
import {AbstractControl, NgForm, ValidatorFn} from "@angular/forms";
import {debounceTime, Subscription} from "rxjs";
import {FormatUtils} from "../../../core/utils/format-utils";
import {DEFAULT} from "../../../core/constant/default";
import {MessageService, Message} from "primeng/api";


@Component({
    selector: 'amalia-segment',
    templateUrl: './segment.component.html',
    styleUrl: './segment.component.scss',
})
export class SegmentComponent {
    //Inputs
    @Input({required: true})
    public segment: AnnotationLocalisation;
    @Input()
    public tcDisplayFormat: 's' | 'f' = 'f';
    @Input()
    public fps = DEFAULT.FPS;

    //InputSignals
    public tcIn = input<number>(0);
    public tcOut = input<number>(0);
    public displayMode = input<"new" | "edit" | "readonly">("readonly");

    //Outputs
    @Output()
    public actionEmitter: EventEmitter<AnnotationAction> = new EventEmitter<AnnotationAction>();

    //ViewChilds
    @ViewChild('segmentForm')
    public segmentForm: NgForm;

    public timeFormatPattern = this.tcDisplayFormat === 'f' ? /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d:)(\d{2})$/ : /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
    private formChangesSubscriptions: Subscription[] = [];
    public tcInFormatted = FormatUtils.formatTime(0, this.tcDisplayFormat, this.fps);
    public tcOutFormatted = FormatUtils.formatTime(0, this.tcDisplayFormat, this.fps);
    public tcFormatted = FormatUtils.formatTime(0, this.tcDisplayFormat, this.fps);
    public messageSubscription: Subscription;

    //Signals
    public categories = signal([]);
    public keywords = signal([]);
    public property = computed(() => {
        const prop: { key: string; value: string }[] = [];
        this.categories().forEach(cat => {
            prop.push({key: 'categories', value: cat});
        });
        this.keywords().forEach(keyword => {
            prop.push({key: 'keywords', value: keyword});
        });
        return prop;
    })

    constructor(private messageService: MessageService) {
        effect(() => {
            this.tcInFormatted = FormatUtils.formatTime(this.tcIn(), this.tcDisplayFormat, this.fps);
            this.tcOutFormatted = FormatUtils.formatTime(this.tcOut(), this.tcDisplayFormat, this.fps);
        });
        effect(() => {
            if (this.displayMode() !== "readonly") {
                this.activateEdition();
            } else {
                this.formChangesSubscriptions.forEach(subscription => {
                    subscription.unsubscribe();
                });
                this.formChangesSubscriptions = [];
            }
        });
    }

    private checkTcIn(control: AbstractControl) {
        let result = null;
        const tcIn = FormatUtils.convertFormattedTcToSeconds(control.value, this.tcDisplayFormat, this.fps);
        const tcOut = FormatUtils.convertFormattedTcToSeconds(this.tcOutFormatted, this.tcDisplayFormat, this.fps);
        if (tcIn > tcOut) {
            this.displaySnackBar('le TC IN doit être inférieur au TC OUT et compris entre le TC IN et le TC OUT de l\'intégral');
            result = {'tcInError': {value: control.value}};
        }
        return result;
    }

    private checkTcOut(control: AbstractControl, tcMax: number) {
        let result = null;
        const tcOut = FormatUtils.convertFormattedTcToSeconds(control.value, this.tcDisplayFormat, this.fps);
        const tcIn = FormatUtils.convertFormattedTcToSeconds(this.tcInFormatted, this.tcDisplayFormat, this.fps);
        if (tcIn > tcOut || tcOut > tcMax) {
            this.displaySnackBar('Le TC OUT doit être supérieur au TC IN et compris entre le TC IN et le TC OUT du fichier intégral');
            result = {'tcOutError': {value: control.value}};
        }
        return result;
    }

    private checkTc(control: AbstractControl, tcMax: number) {
        let result = null;
        const tc = FormatUtils.convertFormattedTcToSeconds(control.value, this.tcDisplayFormat, this.fps);
        if (tc > tcMax) {
            this.displaySnackBar('La durée du segment doit être inférieure à la durée total du média visionné');
            result = {'tcError': {value: control.value}};
        }
        return result;
    }

    tcValidators(forTC: "tcIn" | "tcOut" | "tc"): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            let result = null;
            if (this.timeFormatPattern.test(control.value)) {
                let tcMax = this.segment.data.tcMax ? this.segment.data.tcMax : Number.MAX_VALUE;
                switch (forTC) {
                    case "tcIn":
                        result = this.checkTcIn(control);
                        break;
                    case "tcOut":
                        result = this.checkTcOut(control, tcMax);
                        break;
                    case "tc":
                        result = this.checkTc(control, tcMax);
                        break;
                }
            } else {
                this.displaySnackBar(forTC + ': Le format de temps est incorrect');
                result = {'tcFormatError': {value: control.value}};
            }
            return result;
        };


    }

    public validateNewSegment() {
        this.actionEmitter.emit({type: "validate", payload: this.segment});
    }

    public setTc() {
        //Pour éviter de modifier le tc lorsque les tcIn et out ne sont pas corrects (null ou négatifs)
        if (this.segment.tcOut >= 0 && this.segment.tcIn >= 0) {
            const tc = this.segment.tcOut - this.segment.tcIn;
            //On ne modifie le tc du segment que lorsque la différence est positive
            if (tc >= 0) {
                this.segment.tc = tc;
                this.tcFormatted = FormatUtils.formatTime(this.segment.tc, this.tcDisplayFormat, this.fps);
            }
        }
    }

    public displaySnackBar(msgContent) {
        //life: 1500,
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: msgContent,
            key: 'segment',
            data: {progress: 100} // initial progress value (life/ interval timeout)*2
        });
    }

    private listenToNewMessageCreation() {
        this.messageSubscription = this.messageService.messageObserver.subscribe({
            next: (message: Message) => {
                if (message.key === 'segment') {
                    const interval = setInterval(() => {
                        if (message.data?.progress) {
                            message.data.progress -= 1;
                            if (message.data.progress <= 0) {
                                clearInterval(interval);
                            }
                        } else {
                            clearInterval(interval);
                        }
                    }, 100);
                }
            }, error: err => {
            }
        });

    }

    private activateEdition() {
        this.tcOutFormatted = FormatUtils.formatTime(this.segment.tcOut, this.tcDisplayFormat, this.fps);
        this.tcInFormatted = FormatUtils.formatTime(this.segment.tcIn, this.tcDisplayFormat, this.fps);
        this.tcFormatted = FormatUtils.formatTime(this.segment.tc, this.tcDisplayFormat, this.fps);

        setTimeout(() => {
            //tcout edition
            const tcOutFormControl = this.segmentForm.form.controls['tcOut'];
            if (tcOutFormControl) {
                tcOutFormControl.addValidators(this.tcValidators("tcOut"));
                const tcOutSubscription = tcOutFormControl.valueChanges.pipe(debounceTime(400)).subscribe(value => {
                    const tcOut = FormatUtils.convertFormattedTcToSeconds(value, this.tcDisplayFormat, this.fps);
                    if (tcOut >= 0) {
                        this.segment.tcOut = tcOut;
                        this.setTc();
                    }

                });
                this.formChangesSubscriptions.push(tcOutSubscription);
            }

            //tcIn edition
            const tcInFormControl = this.segmentForm.form.controls['tcIn'];
            if (tcInFormControl) {
                tcInFormControl.addValidators(this.tcValidators("tcIn"));
                const tcInSubscription = tcInFormControl.valueChanges.pipe(debounceTime(400)).subscribe(value => {
                    const tcIn = FormatUtils.convertFormattedTcToSeconds(value, this.tcDisplayFormat, this.fps);
                    if (tcIn >= 0) {
                        this.segment.tcIn = tcIn;
                        this.setTc();
                    }
                });
                this.formChangesSubscriptions.push(tcInSubscription);
            }

            //tc edition
            const tcFormControl = this.segmentForm.form.controls['tc'];
            if (tcFormControl) {
                tcFormControl.addValidators(this.tcValidators("tc"));
                const tcSubscription = tcFormControl.valueChanges.pipe(debounceTime(400)).subscribe(value => {
                    const tc = FormatUtils.convertFormattedTcToSeconds(value, this.tcDisplayFormat, this.fps);
                    if (tc >= 0) {
                        this.segment.tc = tc;
                        if (this.segment.tcIn + this.segment.tc >= 0) {
                            this.segment.tcOut = this.segment.tcIn + this.segment.tc;
                            this.tcOutFormatted = FormatUtils.formatTime(this.segment.tcOut, this.tcDisplayFormat, this.fps);
                        }
                    }
                });
                this.formChangesSubscriptions.push(tcSubscription);
            }
            //categories
            const categoriesFormControl = this.segmentForm.form.controls['categories'];
            if (categoriesFormControl) {
                const categoriesSubscription = categoriesFormControl.valueChanges.pipe(debounceTime(400)).subscribe(() => {
                    this.segment.property = this.property();
                });
                this.formChangesSubscriptions.push(categoriesSubscription);
            }
            //keywords
            const keywordsFormControl = this.segmentForm.form.controls['keywords'];
            if (keywordsFormControl) {
                const keywordsSubscription = keywordsFormControl.valueChanges.pipe(debounceTime(400)).subscribe(() => {
                    this.segment.property = this.property();
                });
                this.formChangesSubscriptions.push(keywordsSubscription);
            }
        }, 400);
    }

    public editSegment() {
        this.actionEmitter.emit({type: "edit", payload: this.segment});
    }

    public cancelNewSegmentCreation() {
        this.actionEmitter.emit({type: "cancel", payload: this.segment});
    }

    public cloneSegment() {
        this.actionEmitter.emit({type: "clone", payload: this.segment});
    }

    public removeSegment() {
        this.actionEmitter.emit({type: "remove", payload: this.segment});
    }

    public updateThumbnail() {
        this.actionEmitter.emit({type: "updatethumbnail", payload: this.segment});
    }

}
