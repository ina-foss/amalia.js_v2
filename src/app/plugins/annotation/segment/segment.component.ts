import {Component, computed, EventEmitter, Input, Output, signal, ViewChild} from '@angular/core';
import {AnnotationAction, AnnotationLocalisation} from "../../../core/metadata/model/annotation-localisation";
import {AbstractControl, NgForm, ValidatorFn} from "@angular/forms";
import {debounceTime, Subscription} from "rxjs";
import {FormatUtils} from "../../../core/utils/format-utils";
import {DEFAULT} from "../../../core/constant/default";
import {MessageService} from "primeng/api";


@Component({
    selector: 'amalia-segment',
    templateUrl: './segment.component.html',
    styleUrl: './segment.component.scss',
})
export class SegmentComponent {
    @Input({required: true})
    public segment!: AnnotationLocalisation;
    @Input()
    public displayMode: "new" | "edit" | "readonly" = "readonly";
    @Output()
    public actionEmitter: EventEmitter<AnnotationAction> = new EventEmitter<AnnotationAction>();
    @ViewChild('segmentForm')
    public segmentForm: NgForm;
    @Input()
    public tcDisplayFormat: 's' | 'f' | 'seconds' = 'f';
    @Input()
    public fps = DEFAULT.FPS;
    public timeFormatPattern = this.tcDisplayFormat === 'f' ? /^(?:(?:(?:([01]\d|2[0-3]):)([0-5]\d):)([0-5]\d:)(2[0-4]|[01]\d))$/ : /^(?:(?:([01]\d|2[0-3]):)([0-5]\d):)([0-5]\d)$/;
    private formChangesSubscriptions: Subscription[] = [];

    public tcInFormatted = FormatUtils.formatTime(0, this.tcDisplayFormat, this.fps);
    public tcOutFormatted = FormatUtils.formatTime(0, this.tcDisplayFormat, this.fps);
    public tcFormatted = FormatUtils.formatTime(0, this.tcDisplayFormat, this.fps);
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
        console.log('property', prop);
        return prop;
    })

    constructor(private messageService: MessageService) {
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
        this.timeFormatPattern = this.tcDisplayFormat === 'f' ? /^(?:(?:(?:([01]\d|2[0-3]):)([0-5]\d):)([0-5]\d:)(2[0-4]|[01]\d))$/ : /^(?:(?:([01]\d|2[0-3]):)([0-5]\d):)([0-5]\d)$/;
        return (control: AbstractControl): { [key: string]: any } | null => {
            console.log('forTC', forTC, control.value);
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
        this.segment.tc = this.segment.tcOut - this.segment.tcIn;
    }

    public displaySnackBar(msgContent) {
        this.messageService.add({severity: 'error', summary: 'Error', detail: msgContent, key: 'br'});
    }

    public editSegment() {
        this.tcOutFormatted = FormatUtils.formatTime(this.segment.tcOut, this.tcDisplayFormat, this.fps);
        this.tcInFormatted = FormatUtils.formatTime(this.segment.tcIn, this.tcDisplayFormat, this.fps);
        this.tcFormatted = FormatUtils.formatTime(this.segment.tc, this.tcDisplayFormat, this.fps);
        this.displayMode = "edit";
        this.actionEmitter.emit({type: "edit", payload: this.segment});
        setTimeout(() => {
            //tcout edition
            const tcOutFormControl = this.segmentForm.form.controls['tcOut'];
            if (tcOutFormControl) {
                tcOutFormControl.addValidators(this.tcValidators("tcOut"));
                const tcOutSubscription = tcOutFormControl.valueChanges.pipe(debounceTime(200)).subscribe(value => {
                    console.log('this.segment.tcOut', this.segment.tcOut);
                    console.log('tcOutFormatted', this.tcOutFormatted);
                    console.log('tcOutFormattedValue', value);
                    this.segment.tcOut = FormatUtils.convertFormattedTcToSeconds(value, this.tcDisplayFormat, this.fps);
                    this.setTc();
                    this.tcFormatted = FormatUtils.formatTime(this.segment.tc, this.tcDisplayFormat, this.fps);
                });
                this.formChangesSubscriptions.push(tcOutSubscription);
            }

            //tcIn edition
            const tcInFormControl = this.segmentForm.form.controls['tcIn'];
            if (tcInFormControl) {
                tcInFormControl.addValidators(this.tcValidators("tcIn"));
                const tcInSubscription = tcInFormControl.valueChanges.pipe(debounceTime(200)).subscribe(value => {
                    console.log('this.segment.tcIn', this.segment.tcIn);
                    console.log('tcInFormattedValue', value);
                    this.segment.tcIn = FormatUtils.convertFormattedTcToSeconds(value, this.tcDisplayFormat, this.fps);
                    this.setTc();
                    this.tcFormatted = FormatUtils.formatTime(this.segment.tc, this.tcDisplayFormat, this.fps);
                });
                this.formChangesSubscriptions.push(tcInSubscription);
            }

            //tc edition
            const tcFormControl = this.segmentForm.form.controls['tc'];
            if (tcFormControl) {
                tcFormControl.addValidators(this.tcValidators("tc"));
                const tcSubscription = tcFormControl.valueChanges.pipe(debounceTime(200)).subscribe(value => {
                    console.log('this.segment.tc', this.segment.tc);
                    console.log('tcFormatted', this.tcFormatted);
                    console.log('tcFormattedValue', value);
                    this.segment.tc = FormatUtils.convertFormattedTcToSeconds(value, this.tcDisplayFormat, this.fps);
                    this.segment.tcOut = this.segment.tcIn + this.segment.tc;
                    this.tcOutFormatted = FormatUtils.formatTime(this.segment.tcOut, this.tcDisplayFormat, this.fps);
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

    public cancelNewSegmentCreation() {
        this.actionEmitter.emit({type: "cancel", payload: this.segment});
        this.displayMode = "readonly";
        this.formChangesSubscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
        this.formChangesSubscriptions = [];
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
