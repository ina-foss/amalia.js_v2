import {
    AfterViewInit, ChangeDetectorRef,
    Component,
    computed,
    effect, ElementRef,
    EventEmitter, HostListener,
    input,
    Input, OnDestroy, OnInit,
    Output, signal,
    ViewChild
} from '@angular/core';
import { AnnotationAction, AnnotationLocalisation } from "../../../core/metadata/model/annotation-localisation";
import { debounceTime, interval, of, Subscription, takeUntil, takeWhile, timer } from "rxjs";
import { FormatUtils } from "../../../core/utils/format-utils";
import { DEFAULT } from "../../../core/constant/default";
import { MessageService } from "primeng/api";
import { switchMap } from 'rxjs/operators';
import { AutoCompleteCompleteEvent } from "primeng/autocomplete";
import { NgForm } from "@angular/forms";
import { ToastComponent } from "../../../core/toast/toast.component";
import { ShortcutEvent } from 'src/app/core/config/model/shortcuts-event';
import { MediaPlayerElement } from 'src/app/core/media-player-element';
import { PlayerEventType } from 'src/app/core/constant/event-type';
import { Utils } from 'src/app/core/utils/utils';
import { AnnotationsService } from 'src/app/service/annotations.service';

@Component({
    selector: 'amalia-segment',
    templateUrl: './segment.component.html',
    styleUrl: './segment.component.scss',
})
export class SegmentComponent implements OnInit, AfterViewInit, OnDestroy {
    //Inputs
    @Input({ required: true })
    public segment: AnnotationLocalisation;
    @Input()
    public tcDisplayFormat: 's' | 'f' = 'f';
    @Input()
    public fps = DEFAULT.FPS;
    @Input()
    availableCategories: string[] = [];
    @Input()
    availableKeywords: string[] = [];
    @Input()
    mediaPlayerElement: MediaPlayerElement;

    //InputSignals
    public tcIn = input<number>(0);
    public tcOut = input<number>(0);


    //Outputs
    @Output()
    public actionEmitter: EventEmitter<AnnotationAction> = new EventEmitter<AnnotationAction>();

    //ViewChilds
    @ViewChild('segmentForm')
    public segmentForm: NgForm;
    @ViewChild('titlediv')
    public titlediv: ElementRef;
    @ViewChild('titleInputEdit')
    public titleInputEdit: ElementRef<HTMLTextAreaElement>;
    @ViewChild('titleInputReadonly')
    public titleInputReadonly: ElementRef<HTMLTextAreaElement>;
    @ViewChild('descp')
    public descp: ElementRef;
    @ViewChild('readOnlyCategoriesDiv')
    public readOnlyCategoriesDiv: ElementRef;
    @ViewChild('readOnlyKeywordsDiv')
    public readOnlyKeywordsDiv: ElementRef;
    @ViewChild('toast')
    public toast: ToastComponent;
    @ViewChild('tcInInputRef')
    public tcInInputRef: ElementRef;
    @ViewChild('tcInReadonlyInput')
    public tcInReadonlyInput: ElementRef<HTMLInputElement>;
    @ViewChild('tcOutReadonlyInput')
    public tcOutReadonlyInput: ElementRef<HTMLInputElement>;
    @ViewChild('tcReadonlyInput')
    public tcReadonlyInput: ElementRef<HTMLInputElement>;
    @ViewChild('categoriesReadonlyWrapper')
    public categoriesReadonlyWrapper: ElementRef<HTMLElement>;
    @ViewChild('keywordsReadonlyWrapper')
    public keywordsReadonlyWrapper: ElementRef<HTMLElement>;
    @ViewChild('descriptionReadonlyTextarea')
    public descriptionReadonlyTextarea: ElementRef<HTMLTextAreaElement>;
    @ViewChild('tcOutInputRef')
    public tcOutInputRef: ElementRef;
    @ViewChild('tcInputRef')
    public tcInputRef: ElementRef;
    @ViewChild('segmentTcRef')
    public segmentTcRef: ElementRef;
    public isEllipsed: boolean = false;
    public isDescriptionCollapsed: boolean = true;
    public isDescriptionTruncated: boolean = false;

    private titleBeforeEdit: string = '';
    private tcInBeforeEdit: string = '';
    private tcOutBeforeEdit: string = '';
    private tcBeforeEdit: string = '';
    private categoriesBeforeEdit: string[] = [];
    private keywordsBeforeEdit: string[] = [];
    private descriptionBeforeEdit: string = '';

    private titleBeforeEdition: string = '';
    private titleEditionAlreadyActivated: boolean = false;
    private titleEditSubscriptions: Subscription[] = [];

    public timeFormatPattern = this.tcDisplayFormat === 'f' ? /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d:)(\d{2})$/ : /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
    private formChangesSubscriptions: Subscription[] = [];
    public tcInFormatted = FormatUtils.formatTime(0, this.tcDisplayFormat, this.fps);
    public tcOutFormatted = FormatUtils.formatTime(0, this.tcDisplayFormat, this.fps);
    public tcFormatted = FormatUtils.formatTime(0, this.tcDisplayFormat, this.fps);
    public setTcInvoked: boolean = false;
    public propertyBeforeEdition: { key: string; value: string }[] = [];
    private editionAlreadyActivated: boolean = false;

    filteredCategories: string[];
    filteredKeywords: string[];
    hiddenCategoriesCount: number = 0;
    hiddenKeywordsCount: number = 0;
    readonlyCategoriesClassName = 'readonly-segment-categories';
    readOnlyKeywordsClassName = 'readonly-segment-keywords';
    hiddenCategoriesSummaryChipId = 'hiddenCategoriesSummaryChip';
    hiddenKeywordsSummaryChipId = 'hiddenKeywordsSummaryChip';

    //Constantes
    public static SEGMENT_SANS_TITRE = 'Segment sans titre';
    public readonly SEGMENT_SANS_TITRE = SegmentComponent.SEGMENT_SANS_TITRE;

    //Signals
    public categories = signal<string[]>([]);
    public keywords = signal<string[]>([]);
    public property = computed(() => {
        const prop: { key: string; value: string }[] = [];
        this.categories()?.forEach(cat => {
            if (!prop.find(p => p.key === 'category' && p.value === cat)) {
                prop.push({ key: 'category', value: cat });
            }
        });
        this.keywords()?.forEach(keyword => {
            if (!prop.find(p => p.key === 'keyword' && p.value === keyword)) {
                prop.push({ key: 'keyword', value: keyword });
            }
        });
        return prop;
    });
    editableSegmentTcWrap: boolean = false;


    constructor(private messageService: MessageService, private cdr: ChangeDetectorRef,
        private annotationsService: AnnotationsService) {
        effect(() => {
            this.tcInFormatted = FormatUtils.formatTime(this.tcIn(), this.tcDisplayFormat, this.fps);
        });
        effect(() => {
            this.tcOutFormatted = FormatUtils.formatTime(this.tcOut(), this.tcDisplayFormat, this.fps);
        });

        effect(() => {
            if (this.segment.data.isTitleEditing === true || this.segment.data.isTcInEditing === true || this.segment.data.isTcOutEditing === true || this.segment.data.isTcEditing === true || this.segment.data.isCategoriesEditing === true || this.segment.data.isKeywordsEditing === true || this.segment.data.isDescriptionEditing === true) {
                this.activateEdition();
            } else {
                this.formChangesSubscriptions.forEach(subscription => {
                    subscription.unsubscribe();
                });
                this.formChangesSubscriptions = [];
                this.updateCategoriesAndKeywordsDisplay();
            }
        });

    }

    public validateNewSegment() {
        this.doCheckTcIn();
        this.doCheckTcOut();
        this.doCheckTc();
        if (this.segmentForm.valid) {
            this.actionEmitter.emit({ type: "validate", payload: this.segment });
            this.setIsEllipsed();
            this.setIsDescriptionTruncated();
        }
    }

    public setTc() {
        //Pour éviter de modifier le tc lorsque les tcIn et out ne sont pas corrects (null ou négatifs)
        if (this.segment.tcOut >= 0 && this.segment.tcIn >= 0 && this.segment.tcIn <= this.segment.tcOut) {
            const tc = this.segment.tcOut - this.segment.tcIn;
            //On ne modifie le tc du segment que lorsque la différence est positive
            if (tc >= 0) {
                if (tc !== this.segment.tc) {
                    this.segment.tc = tc;
                }
                this.tcFormatted = FormatUtils.formatTime(this.segment.tc, this.tcDisplayFormat, this.fps);
                this.setTcInvoked = true;
            }
        }
    }

    public displaySnackBar(msgContent) {
        //life: 1500,
        this.toast.addMessage({
            severity: 'error',
            summary: undefined,
            detail: msgContent,
            key: 'segment',
            life: 5000,
            data: { progress: 0 } // initial progress value (life/ interval timeout)*2
        });
    }

    private checkTcIn(value: string, displaySnackBar?: boolean): any {
        const tcIn = FormatUtils.convertFormattedTcToSeconds(value, this.tcDisplayFormat, this.fps);
        const tcOut = FormatUtils.convertFormattedTcToSeconds(this.tcOutFormatted, this.tcDisplayFormat, this.fps);
        const tcOffset = this.segment.tcOffset;
        const tcMax = this.segment.data.tcMax;

        if (tcIn > tcOut || tcIn < tcOffset || tcIn > tcMax) {
            if (displaySnackBar === true) {
                this.displaySnackBar('le TC Début doit être inférieur au TC Fin et compris entre le TC Début et le TC Fin de l\'intégral');
            }
            const tcInFormControl = this.segmentForm.form.controls['tcIn'];
            if (tcInFormControl) {
                tcInFormControl.setErrors({ 'Error': true });
            }
            return { value, error: true };
        }
        return value;
    }

    private checkTcOut(value: string, tcMax: number, displaySnackBar?: boolean): any {
        const tcOut = FormatUtils.convertFormattedTcToSeconds(value, this.tcDisplayFormat, this.fps);
        const tcIn = FormatUtils.convertFormattedTcToSeconds(this.tcInFormatted, this.tcDisplayFormat, this.fps);
        const tcOffset = this.segment.tcOffset;
        if (tcIn > tcOut || tcOut > tcMax || tcOffset > tcOut) {
            if (displaySnackBar === true) {
                this.displaySnackBar('Le TC Fin doit être supérieur au TC Début et compris entre le TC Début et le TC Fin du fichier intégral');
            }
            const tcOutFormControl = this.segmentForm.form.controls['tcOut'];
            if (tcOutFormControl) {
                tcOutFormControl.setErrors({ 'Error': true });
            }
            return { value, error: true };
        }
        return value;
    }

    private checkTc(value: string, tcMax: number, displaySnackBar?: boolean) {
        const tc = FormatUtils.convertFormattedTcToSeconds(value, this.tcDisplayFormat, this.fps);
        const tcOffset = this.segment.tcOffset;
        if ((tc + tcOffset) > tcMax) {
            if (displaySnackBar === true) {
                this.displaySnackBar('La durée du segment doit être inférieure à la durée total du média visionné');
            }
            const tcFormControl = this.segmentForm.form.controls['tc'];
            if (tcFormControl) {
                tcFormControl.setErrors({ 'Error': true });
            }
            return { value, error: true };
        }
        return value;
    }

    public doCheckTcIn() {
        const tcInFormControl = this.segmentForm.form.controls['tcIn'];
        if (tcInFormControl) {
            const value = this.tcValidators("tcIn", tcInFormControl.value);
            this.afterTcInValidation(value);
        }
    }

    doCheckTcOut() {
        const tcOutFormControl = this.segmentForm.form.controls['tcOut'];
        if (tcOutFormControl) {
            const value = this.tcValidators("tcOut", tcOutFormControl.value);
            this.afterTcOutValidation(value);
        }
    }

    doCheckTc() {
        const tcFormControl = this.segmentForm.form.controls['tc'];
        if (tcFormControl) {
            const value = this.tcValidators("tc", tcFormControl.value);
            this.afterTcValidation(value);
        }
    }

    tcValidators(forTC: "tcIn" | "tcOut" | "tc", value: string, displaySnackBar?: boolean): any {
        let result: any = { value, error: true, formatError: true };
        if (this.timeFormatPattern.test(value)) {
            let tcMax = this.segment.data.tcMax ? this.segment.data.tcMax : Number.MAX_VALUE;
            switch (forTC) {
                case "tcIn":
                    result = this.checkTcIn(value, displaySnackBar);
                    break;
                case "tcOut":
                    result = this.checkTcOut(value, tcMax, displaySnackBar);
                    break;
                case "tc":
                    result = this.checkTc(value, tcMax, displaySnackBar);
                    break;
            }
        } else {
            if (displaySnackBar === true) {
                this.displaySnackBar(forTC + ': Le format de temps est incorrect');
            }
            const formControl = this.segmentForm.form.controls[forTC];
            if (formControl) {
                formControl.setErrors({ 'Error': true });
            }
        }
        return result;
    }

    public resetTcOutFormControlErrors() {
        let tcMax = this.segment.data.tcMax ? this.segment.data.tcMax : Number.MAX_VALUE;
        const tcOutCheckResult = this.checkTcOut(this.tcOutFormatted, tcMax, false);
        if (!tcOutCheckResult.error === true) {
            const tcOutFormControl = this.segmentForm.form.controls['tcOut'];
            if (tcOutFormControl) {
                tcOutFormControl.setErrors(null);
            }
        }
    }

    public resetTcInFormControlErrors() {
        const tcInCheckResult = this.checkTcIn(this.tcInFormatted, false);
        if (!tcInCheckResult.error === true) {
            const tcInFormControl = this.segmentForm.form.controls['tcIn'];
            if (tcInFormControl) {
                tcInFormControl.setErrors(null);
            }
        }
    }

    public afterTcInValidation(value: any) {
        //Nous supposons dans cette fonction que le format de value est correct
        if (!value.formatError) {
            const tcIn = FormatUtils.convertFormattedTcToSeconds(value.error ? value.value : value, this.tcDisplayFormat, this.fps);
            if (tcIn >= 0) {
                this.segment.tcIn = tcIn;
                this.setTc();
                this.resetTcOutFormControlErrors();
            }
        }
    }

    public afterTcOutValidation(value: any) {
        //Nous supposons dans cette fonction que le format de value est correct
        if (!value.formatError) {
            const tcOut = FormatUtils.convertFormattedTcToSeconds(value.error ? value.value : value, this.tcDisplayFormat, this.fps);
            if (tcOut >= 0) {
                if (tcOut !== this.segment.tcOut) {
                    this.segment.tcOut = tcOut;
                }
                this.setTc();
                this.resetTcInFormControlErrors();
            }
        }
    }

    public afterTcValidation(value: any) {
        //Nous supposons dans cette fonction que le format de value est correct
        if (!value.formatError) {
            const tc = FormatUtils.convertFormattedTcToSeconds(value.error ? value.value : value, this.tcDisplayFormat, this.fps);
            if (tc >= 0) {
                this.segment.tc = tc;
                //Si le tc (durée) a été modifié via setTc, nous ne modifions pas le tcOut.
                if (this.setTcInvoked !== true) {
                    if (this.segment.tcIn >= 0 && this.segment.tc >= 0) {
                        this.segment.tcOut = this.segment.tcIn + this.segment.tc;
                        this.tcOutFormatted = FormatUtils.formatTime(this.segment.tcOut, this.tcDisplayFormat, this.fps);
                    }
                }
            }
        }
        //Nous gérons ici le fait que le Tc n'est pas setté via l'ui mais plutôt via setTc
        if (this.setTcInvoked === true) {
            this.setTcInvoked = false;
        }
    }

    private clearTitleEditSubscriptions() {
        this.titleEditSubscriptions.forEach(s => s.unsubscribe());
        this.titleEditSubscriptions = [];
        this.titleEditionAlreadyActivated = false;
    }

    private activateEdition(options?: { titleOnly?: boolean }) {
        const titleOnly = !!options?.titleOnly;
        if (titleOnly) {
            if (this.titleEditionAlreadyActivated) {
                return;
            }
            this.actionEmitter.emit({ type: "edit", payload: this.segment });
            setTimeout(() => {
                this.activateTitleEdition(this.titleEditSubscriptions);

                const titleEl = this.titleInputReadonly?.nativeElement;
                if (titleEl) {
                    titleEl.focus();
                    titleEl.select();
                }
            }, 0);
            this.titleEditionAlreadyActivated = true;
            return;
        }

        if (!this.editionAlreadyActivated) {
            this.propertyBeforeEdition = structuredClone(this.property());
            this.titleBeforeEdition = this.segment?.label ?? '';
            this.tcOutFormatted = FormatUtils.formatTime(this.segment.tcOut, this.tcDisplayFormat, this.fps);
            this.tcInFormatted = FormatUtils.formatTime(this.segment.tcIn, this.tcDisplayFormat, this.fps);
            this.tcFormatted = FormatUtils.formatTime(this.segment.tc, this.tcDisplayFormat, this.fps);
            setTimeout(() => {
                //tcout edition
                this.activateTcOutEdition();
                //tcIn edition
                this.activateTcInEdition();
                //tc edition
                this.activateTcEdition();
                //categories
                this.activateCategoriesEdition();
                //keywords
                this.activateKeywordsEdition();
                //title
                this.activateTitleEdition(this.formChangesSubscriptions);
                //description
                this.activateDescriptionEdition();

                const titleEl = this.titleInputEdit?.nativeElement;
                if (titleEl) {
                    titleEl.focus();
                    titleEl.select();
                }
            }, 200);
            this.editionAlreadyActivated = true;
        }
    }

    private activateTcOutEdition = () => {
        const tcOutFormControl = this.segmentForm.form.controls['tcOut'];
        if (tcOutFormControl) {
            //Si pendant 2000 ms, le control n'est pas valide, une snackbar apparaît
            const tcOutSubscription = tcOutFormControl.valueChanges.pipe(debounceTime(2000), switchMap((value) => {
                return of(this.tcValidators("tcOut", value, true));
            })).subscribe(() => {
                //On reset l'état valid ou non du control tcInFormatted puisqu'il dépend de tcOut
                this.resetTcInFormControlErrors();
            });
            this.formChangesSubscriptions.push(tcOutSubscription);

            //A chaque modification de tcOutFormatted - via une assignation ou via l'ui ngModel - nous checkons le tcOut puis modifions le tc (la durée)
            const tcOutSubscription1 = tcOutFormControl.valueChanges.pipe(switchMap((value) => {
                return of(this.tcValidators("tcOut", value));
            })).subscribe(value => {
                this.afterTcOutValidation(value);
            });
            this.formChangesSubscriptions.push(tcOutSubscription1);
        }
    }
    private activateTcInEdition = () => {
        const tcInFormControl = this.segmentForm.form.controls['tcIn'];
        if (tcInFormControl) {
            //Si pendant 2000 ms, le control n'est pas valide, une snackbar apparaît
            const tcInSubscription = tcInFormControl.valueChanges.pipe(debounceTime(2000), switchMap((value) => {
                return of(this.tcValidators("tcIn", value, true));
            })).subscribe(() => {
                //On reset l'état valid ou non du control tcOutFormatted puisqu'il dépend de tcIn
                this.resetTcOutFormControlErrors();
            });
            this.formChangesSubscriptions.push(tcInSubscription);
            //A chaque modification de tcInFormatted - via une assignation ou via l'ui ngModel - nous checkons le tcIn puis modifions le tc (la durée)
            const tcInSubscription1 = tcInFormControl.valueChanges.pipe(switchMap((value) => {
                return of(this.tcValidators("tcIn", value));
            })).subscribe(value => {
                this.afterTcInValidation(value);
            });
            this.formChangesSubscriptions.push(tcInSubscription1);
        }
    }
    private activateTcEdition = () => {
        const tcFormControl = this.segmentForm.form.controls['tc'];
        if (tcFormControl) {
            const tcSubscription = tcFormControl.valueChanges.pipe(debounceTime(2000), switchMap((value) => {
                return of(this.tcValidators("tc", value, true));
            })).subscribe(() => {
            });
            this.formChangesSubscriptions.push(tcSubscription);

            const tcSubscription1 = tcFormControl.valueChanges.pipe(switchMap((value) => {
                return of(this.tcValidators("tc", value));
            })).subscribe(value => {
                this.afterTcValidation(value);
            });
            this.formChangesSubscriptions.push(tcSubscription1);
        }
    }
    private activateCategoriesEdition = () => {
        const categoriesFormControl = this.segmentForm.form.controls['categories'];
        if (categoriesFormControl) {
            const categoriesSubscription = categoriesFormControl.valueChanges.pipe(debounceTime(100)).subscribe(() => {
                this.segment.property = this.property();
                if (this.categories().length > 10) {
                    categoriesFormControl.setErrors({ 'invalid': true });
                } else {
                    categoriesFormControl.setErrors(null);
                }
            });
            this.formChangesSubscriptions.push(categoriesSubscription);
        }
    }
    private activateKeywordsEdition = () => {
        const keywordsFormControl = this.segmentForm.form.controls['keywords'];
        if (keywordsFormControl) {
            const keywordsSubscription = keywordsFormControl.valueChanges.pipe(debounceTime(100)).subscribe(() => {
                this.segment.property = this.property();
                if (this.keywords().length > 10) {
                    keywordsFormControl.setErrors({ 'invalid': true });
                } else {
                    keywordsFormControl.setErrors(null);
                }
            });
            this.formChangesSubscriptions.push(keywordsSubscription);

        }
    }
    private activateTitleEdition = (subscriptions: Subscription[] = this.formChangesSubscriptions) => {
        const titleFormControl = this.segmentForm.form.controls['title'];
        if (titleFormControl) {
            const titleChangesSubscription = titleFormControl.valueChanges.subscribe((value) => {
                if (value.length > 250) {
                    titleFormControl.setErrors({ 'Error': true })
                } else {
                    titleFormControl.setErrors(null);
                }
            });
            subscriptions.push(titleChangesSubscription);
        }
    }
    private activateDescriptionEdition = () => {
        const descriptionFormControl = this.segmentForm.form.controls['description'];
        if (descriptionFormControl) {
            const descriptionChangesSubscription = descriptionFormControl.valueChanges.subscribe((value) => {
                if (value.length > 1000) {
                    descriptionFormControl.setErrors({ 'Error': true })
                } else {
                    descriptionFormControl.setErrors(null);
                }
            });
            this.formChangesSubscriptions.push(descriptionChangesSubscription);
        }
    }

    public editSegment() {
        this.editionAlreadyActivated = false;
        this.actionEmitter.emit({ type: "edit", payload: this.segment });
        setTimeout(() => {
            this.updateTcsDisplay();
        }, 100);
    }

    public startTitleEdit() {
        this.titleBeforeEdit = this.segment?.label ?? '';
        this.segment.data.isTitleEditing = true;
        setTimeout(() => {
            this.activateEdition({ titleOnly: true });
        });
    }

    public confirmTitleEdit() {
        const value = this.segment?.label ?? '';
        if (value.length > 250) {
            return;
        }
        this.actionEmitter.emit({ type: "validate", payload: this.segment });
        this.setIsEllipsed();
        this.clearTitleEditSubscriptions();
        this.segment.data.isTitleEditing = false;
    }

    public onTitleEditKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            event.preventDefault();
            event.stopPropagation();
            this.cancelTitleEdit();
            return;
        }

        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            event.stopPropagation();
            this.confirmTitleEdit();
        }
    }

    public cancelTitleEdit() {
        if (this.segment) {
            this.segment.label = this.titleBeforeEdit;
        }
        this.setIsEllipsed();
        this.clearTitleEditSubscriptions();
        this.segment.data.isTitleEditing = false;
    }

    public onTitleBlur() {
        this.unmuteShortCuts();
        this.confirmTitleEdit();
    }

    // TcIn inline editing
    public startTcInEdit() {
        this.tcInBeforeEdit = this.tcInFormatted;
        this.segment.data.isTcInEditing = true;
        this.actionEmitter.emit({ type: "edit", payload: this.segment });

        setTimeout(() => {
            const el = this.tcInReadonlyInput?.nativeElement;
            if (el) {
                el.focus();
                el.select();
            }
        }, 0);
    }

    public confirmTcInEdit() {
        this.doCheckTcIn();
        if (!this.segmentForm.form.controls['tcIn']?.errors) {
            this.actionEmitter.emit({ type: "validate", payload: this.segment });
            this.segment.data.isTcInEditing = false;
        }
    }

    public cancelTcInEdit() {
        this.tcInFormatted = this.tcInBeforeEdit;
        this.segment.tcIn = FormatUtils.convertTcToSeconds(this.tcInBeforeEdit);
        this.segment.data.isTcInEditing = false;
    }

    public onTcInKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            event.preventDefault();
            event.stopPropagation();
            this.cancelTcInEdit();
            return;
        }
        if (event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();
            this.confirmTcInEdit();
        }
    }

    public onTcInBlur() {
        this.unmuteShortCuts();
        this.confirmTcInEdit();
    }

    // TcOut inline editing
    public startTcOutEdit() {
        this.tcOutBeforeEdit = this.tcOutFormatted;
        this.segment.data.isTcOutEditing = true;
        this.actionEmitter.emit({ type: "edit", payload: this.segment });

        setTimeout(() => {
            const el = this.tcOutReadonlyInput?.nativeElement;
            if (el) {
                el.focus();
                el.select();
            }
        }, 0);
    }

    public confirmTcOutEdit() {
        this.doCheckTcOut();
        if (!this.segmentForm.form.controls['tcOut']?.errors) {
            this.actionEmitter.emit({ type: "validate", payload: this.segment });
            this.segment.data.isTcOutEditing = false;
        }
    }

    public cancelTcOutEdit() {
        this.tcOutFormatted = this.tcOutBeforeEdit;
        this.segment.tcOut = FormatUtils.convertTcToSeconds(this.tcOutBeforeEdit);
        this.segment.data.isTcOutEditing = false;
    }

    public onTcOutKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            event.preventDefault();
            event.stopPropagation();
            this.cancelTcOutEdit();
            return;
        }
        if (event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();
            this.confirmTcOutEdit();
        }
    }

    public onTcOutBlur() {
        this.unmuteShortCuts();
        this.confirmTcOutEdit();
    }

    // Tc inline editing
    public startTcEdit() {
        this.tcBeforeEdit = this.tcFormatted;
        this.segment.data.isTcEditing = true;
        this.actionEmitter.emit({ type: "edit", payload: this.segment });

        setTimeout(() => {
            const el = this.tcReadonlyInput?.nativeElement;
            if (el) {
                el.focus();
                el.select();
            }
        }, 0);
    }

    public confirmTcEdit() {
        this.doCheckTc();
        if (!this.segmentForm.form.controls['tc']?.errors) {
            this.actionEmitter.emit({ type: "validate", payload: this.segment });
            this.segment.data.isTcEditing = false;
        }
    }

    public cancelTcEdit() {
        this.tcFormatted = this.tcBeforeEdit;
        this.segment.tc = FormatUtils.convertTcToSeconds(this.tcBeforeEdit);
        this.segment.data.isTcEditing = false;
    }

    public onTcKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            event.preventDefault();
            event.stopPropagation();
            this.cancelTcEdit();
            return;
        }
        if (event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();
            this.confirmTcEdit();
        }
    }

    public onTcBlur() {
        this.unmuteShortCuts();
        this.confirmTcEdit();
    }

    // Categories inline editing
    public startCategoriesEdit() {
        this.categoriesBeforeEdit = [...this.categories()];
        this.segment.data.isCategoriesEditing = true;
        this.actionEmitter.emit({ type: "edit", payload: this.segment });

        setTimeout(() => {
            const wrapper = this.categoriesReadonlyWrapper?.nativeElement;
            const input = wrapper?.querySelector('input') as HTMLInputElement | null;
            if (input) {
                input.focus();
                input.select?.();
            }
        }, 0);
    }

    public confirmCategoriesEdit() {
        if (this.categories().length <= 10) {
            this.segment.property = this.property();
            this.actionEmitter.emit({ type: "validate", payload: this.segment });
            this.segment.data.isCategoriesEditing = false;
        }
    }

    public cancelCategoriesEdit() {
        this.categories.set([...this.categoriesBeforeEdit]);
        this.segment.property = this.property();
        this.segment.data.isCategoriesEditing = false;
    }

    public onCategoriesBlur() {
        this.unmuteShortCuts();
        this.confirmCategoriesEdit();
    }

    // Keywords inline editing
    public startKeywordsEdit() {
        this.keywordsBeforeEdit = [...this.keywords()];
        this.segment.data.isKeywordsEditing = true;
        this.actionEmitter.emit({ type: "edit", payload: this.segment });

        setTimeout(() => {
            const wrapper = this.keywordsReadonlyWrapper?.nativeElement;
            const input = wrapper?.querySelector('input') as HTMLInputElement | null;
            if (input) {
                input.focus();
                input.select?.();
            }
        }, 0);
    }

    public confirmKeywordsEdit() {
        if (this.keywords().length <= 10) {
            this.segment.property = this.property();
            this.actionEmitter.emit({ type: "validate", payload: this.segment });
            this.segment.data.isKeywordsEditing = false;
        }
    }

    public cancelKeywordsEdit() {
        this.keywords.set([...this.keywordsBeforeEdit]);
        this.segment.property = this.property();
        this.segment.data.isKeywordsEditing = false;
    }

    public onKeywordsBlur() {
        this.unmuteShortCuts();
        this.confirmKeywordsEdit();
    }

    // Description inline editing
    public startDescriptionEdit() {
        this.descriptionBeforeEdit = this.segment?.description ?? '';
        this.segment.data.isDescriptionEditing = true;
        this.actionEmitter.emit({ type: "edit", payload: this.segment });

        setTimeout(() => {
            const el = this.descriptionReadonlyTextarea?.nativeElement;
            if (el) {
                el.focus();
                el.select();
            }
        }, 0);
    }

    public confirmDescriptionEdit() {
        const value = this.segment?.description ?? '';
        if (value.length <= 1000) {
            this.actionEmitter.emit({ type: "validate", payload: this.segment });
            this.segment.data.isDescriptionEditing = false;
            this.setIsDescriptionTruncated();
        }
    }

    public cancelDescriptionEdit() {
        if (this.segment) {
            this.segment.description = this.descriptionBeforeEdit;
        }
        this.segment.data.isDescriptionEditing = false;
        this.setIsDescriptionTruncated();
    }

    public onDescriptionKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            event.preventDefault();
            event.stopPropagation();
            this.cancelDescriptionEdit();
        }
    }
    
    public onDescriptionBlur() {
        this.unmuteShortCuts();
        this.confirmDescriptionEdit();
    }

    public cancelNewSegmentCreation() {
        this.actionEmitter.emit({ type: "cancel", payload: this.segment });
        if (this.segment) {
            this.segment.label = this.titleBeforeEdition;
        }
        this.setCategoriesFromProperty(this.propertyBeforeEdition);
        this.setKeywordsFromProperty(this.propertyBeforeEdition);
    }

    public cloneSegment() {
        this.actionEmitter.emit({ type: "clone", payload: this.segment });
    }

    public removeSegment() {
        this.actionEmitter.emit({ type: "remove", payload: this.segment });
    }

    public updateThumbnail() {
        this.actionEmitter.emit({ type: "updatethumbnail", payload: this.segment });
    }

    public setCategoriesFromProperty(props) {
        this.categories.set(props?.filter(prop => prop.key === "category").map(prop => prop.value) ?? []);
    }

    public setKeywordsFromProperty(props) {
        this.keywords.set(props?.filter(prop => prop.key === "keyword").map(prop => prop.value) ?? []);
    }

    ngOnInit(): void {
        this.setCategoriesFromProperty(this.segment.property);
        this.setKeywordsFromProperty(this.segment.property);
        this.tcInFormatted = FormatUtils.formatTime(this.tcIn(), this.tcDisplayFormat, this.fps);
        this.tcOutFormatted = FormatUtils.formatTime(this.tcOut(), this.tcDisplayFormat, this.fps);
    }

    ngAfterViewInit(): void {
        this.setIsEllipsed();
        this.setIsDescriptionTruncated();
        this.updateCategoriesAndKeywordsDisplay();
        if (this.mediaPlayerElement) {
            Utils.addListener(this, this.mediaPlayerElement.eventEmitter, PlayerEventType.SHORTCUT_KEYDOWN, this.handleShortcuts);
        }
    }

    public readOnlyTitleReady(): boolean {
        return !!(this.titlediv && this.titlediv.nativeElement);
    }

    public readOnlyDescriptionReady(): boolean {
        return !!(this.descp && this.descp.nativeElement);
    }

    public setIsEllipsed() {
        interval(2).pipe(// Vérifier toutes les 2 millisecondes
            switchMap(() => of(this.readOnlyTitleReady())),
            takeWhile(conditionMet => !conditionMet, true), // Continuer tant que la condition n'est pas vérifiée
            takeUntil(timer(2000))
        ).subscribe({
            next: () => {
                if (this.readOnlyTitleReady()) {
                    this.isEllipsed = this.titlediv.nativeElement.scrollWidth > this.titlediv.nativeElement.clientWidth;
                }
            }
        });
    }

    public setIsDescriptionTruncated() {
        interval(2).pipe(// Vérifier toutes les 2 millisecondes
            switchMap(() => of(this.readOnlyDescriptionReady())),
            takeWhile(conditionMet => !conditionMet, true), // Continuer tant que la condition n'est pas vérifiée
            takeUntil(timer(2000))
        ).subscribe({
            next: () => {
                if (this.readOnlyDescriptionReady()) {
                    this.descp.nativeElement.getBoundingClientRect();
                    const lineHeight = parseFloat(window.getComputedStyle(this.descp.nativeElement).lineHeight);
                    const nbLines = Math.ceil(this.descp.nativeElement.clientHeight / lineHeight);
                    this.isDescriptionTruncated = this.descp.nativeElement.scrollHeight > this.descp.nativeElement.clientHeight || (nbLines > 4);
                }
            }
        });
    }


    public toggleDescription(event: Event) {
        event.preventDefault();
        this.isDescriptionCollapsed = !this.isDescriptionCollapsed;
    }

    private isIncludedInArrayIgnoreCase(array, searchItem) {
        let result = false;
        array.forEach(alement => {
            if (alement.toLowerCase() === searchItem.toLowerCase()) {
                result = true;
            }
        });
        return result;
    }

    searchCategories($event: AutoCompleteCompleteEvent) {
        this.filteredCategories = this.availableCategories.filter(item => {
            //on enlève les catégories déjà sélectionnées en ne tenant pas compte de la casse
            return !this.isIncludedInArrayIgnoreCase(this.categories(), item);
        })//on inclut les les options qui contiennent le mot recherché
            .filter(item => item.toLowerCase().includes($event.query.toLowerCase()))
            //On limite la liste à 10 éléménts
            .slice(0, 10);
        // On inclut le mot recherché s'il n'est pas déjà sélectionné, ni déjà dans la liste des availables après filtres
        let addCurrentQuery = !this.isIncludedInArrayIgnoreCase(this.categories(), $event.query) && !this.isIncludedInArrayIgnoreCase(this.filteredCategories, $event.query);
        if (addCurrentQuery) {
            this.filteredCategories = this.filteredCategories.slice(0, 9);
            this.filteredCategories.splice(0, 0, $event.query);
        }
        this.cdr.detectChanges();
    }

    searchKeywords($event: AutoCompleteCompleteEvent) {
        this.filteredKeywords = this.availableKeywords.filter(item => {
            //on enlève les keywords déjà sélectionnées en ne tenant pas compte de la casse
            return !this.isIncludedInArrayIgnoreCase(this.keywords(), item);
        })//on inclut les les options qui contiennent le mot recherché
            .filter(item => item.toLowerCase().includes($event.query.toLowerCase()))
            //On limite la liste à 10 éléménts
            .slice(0, 10);
        // On inclut le mot recherché s'il n'est pas déjà sélectionné, ni déjà dans la liste des availables après filtres
        let addCurrentQuery = !this.isIncludedInArrayIgnoreCase(this.keywords(), $event.query) && !this.isIncludedInArrayIgnoreCase(this.filteredKeywords, $event.query);
        if (addCurrentQuery) {
            this.filteredKeywords = this.filteredKeywords.slice(0, 9);
            this.filteredKeywords.splice(0, 0, $event.query);
        }
        this.cdr.detectChanges();
    }

    addToAvailableCategories($event: any[]) {
        $event.forEach(element => {
            if (!this.availableCategories.includes(element)) {
                this.availableCategories.push(element);
            }
        });
    }

    addToAvailableKeywords($event: any[]) {
        $event.forEach(element => {
            if (!this.availableKeywords.includes(element)) {
                this.availableKeywords.push(element);
            }
        });
    }

    displayRemaining(items: string[], minus: number) {
        let result = '';
        if (items.length > minus) {
            result = items.slice(items.length - minus).join('; ');
        }
        return result;
    }

    @HostListener("window:resize", [])
    public updateCategoriesAndKeywordsDisplay() {
        if (this.readOnlyCategoriesDiv && this.readOnlyKeywordsDiv) {
            this.hiddenCategoriesCount = this.updateDisplay(this.readOnlyCategoriesDiv, this.readonlyCategoriesClassName, this.hiddenCategoriesSummaryChipId);
            this.hiddenKeywordsCount = this.updateDisplay(this.readOnlyKeywordsDiv, this.readOnlyKeywordsClassName, this.hiddenKeywordsSummaryChipId);
        }
    }
    @HostListener("window:resize", [])
    updateTcsDisplay() {
        if (this.tcInInputRef && this.tcOutInputRef && this.tcInputRef && this.segmentTcRef) {
            const tcInInputRef = this.tcInInputRef.nativeElement;
            if (tcInInputRef.scrollWidth > tcInInputRef.clientWidth) {
                this.editableSegmentTcWrap = true;
            } else {
                const margin = 24 + 2;
                const gap = 2;
                const segmentTcGap = 2;
                const tcInTextSize = this.calculateTextWidth(this.tcInFormatted, 'Lato') + margin;
                const tcOutTextSize = this.calculateTextWidth(this.tcOutFormatted, 'Lato') + margin;
                const tcTextSize = this.calculateTextWidth(this.tcFormatted, 'Lato') + margin;
                const labelTcInSize = this.calculateTextWidth('Début', 'Lato') + gap;
                const labelTcOutSize = this.calculateTextWidth('Fin', 'Lato') + gap;
                const labelTcSize = this.calculateTextWidth('Durée', 'Lato') + gap;
                const totalWidth = tcInTextSize + tcOutTextSize + tcTextSize + labelTcInSize + labelTcOutSize + labelTcSize + (segmentTcGap * 2);
                this.editableSegmentTcWrap = totalWidth > this.segmentTcRef.nativeElement.offsetWidth;
            }
        }
    }
    private updateDisplay(readOnlyDiv: ElementRef, readOnlyClassName: string, summaryChipId: string) {
        const div = readOnlyDiv.nativeElement;
        const divWidth = div.offsetWidth;
        const chips = div.querySelectorAll(`.${readOnlyClassName} p-chip`);
        let totalWidth = 0;
        let truncateChips: boolean = false;
        let hiddenChipsCount = 0;
        const gap = 12;

        //renseigner le style.display à inline-block pour que les p-chip aient un offsetWidth défini
        chips.forEach((chip: HTMLElement) => {
            if (chip.id === summaryChipId) {
                chip.style.display = 'none';
            } else {
                chip.style.display = 'inline-block';
            }
        });

        //Faut-il tronquer ou non. Pour le savoir, on compare la somme des largeurs des p-chip avec toute la largeur de la div qui les contient
        chips.forEach((chip: HTMLElement) => {
            totalWidth += (chip.offsetWidth + gap);
            if (totalWidth > divWidth) {
                truncateChips = true;
                return;
            }
        });

        //Si la somme des largeurs des p-chip est plus grande que la largeur de la div contenante,
        //on se base sur la largeur de la div contenante moins (-) la largeur de la p-chip qui a pour label le résumé
        if (truncateChips) {
            totalWidth = 0;
            let availableWidth = divWidth - 85;
            chips.forEach((chip: HTMLElement) => {
                if (chip.id != summaryChipId) {
                    totalWidth += (chip.offsetWidth + gap);
                    if (totalWidth > availableWidth) {
                        chip.style.display = 'none';
                        hiddenChipsCount++;
                    } else {
                        chip.style.display = 'inline-block';
                    }
                } else {
                    chip.style.display = 'inline-block';
                }
            });
        }
        return hiddenChipsCount;
    }

    public calculateTextWidth(text: string, font: string): number {
        const span = document.createElement('span');
        span.style.font = font;
        span.style.visibility = 'hidden';
        span.style.whiteSpace = 'nowrap';
        span.innerText = text;
        document.body.appendChild(span);
        const width = span.offsetWidth;
        document.body.removeChild(span);
        return width;
    }

    public textLatoWidthHigherThan(text: string, width: number) {
        return this.calculateTextWidth(text, 'Lato') > width;
    }

    playMedia() {
        this.actionEmitter.emit({ type: "playMedia", payload: this.segment });
    }

    unmuteShortCuts() {
        this.actionEmitter.emit({ type: "unmuteShortCuts", payload: this.segment });
    }
    muteShortCuts() {
        this.actionEmitter.emit({ type: "muteShortCuts", payload: this.segment });
    }
    /**
      * Apply shortcut if exists on keydown
      */
    public handleShortcuts(event: ShortcutEvent) {
        if (event.targets.find(target => target.toLowerCase() === 'ANNOTATIONS'.toLowerCase())) {
            this.applyShortcut(event);
        }
    }

    editionInProgess(): boolean {
        return this.segment.data.isTitleEditing
            || this.segment.data.isKeywordsEditing
            || this.segment.data.isCategoriesEditing
            || this.segment.data.isDescriptionEditing
            || this.segment.data.isTcEditing
            || this.segment.data.isTcInEditing
            || this.segment.data.isTcOutEditing;
    }

    applyShortcut(event: ShortcutEvent) {
        if (this.segment.data.selected === true
            && ((event.shortcut.key === 'enter' && event.shortcut.ctrl !== true)
                || (event.shortcut.key === 's' && event.shortcut.ctrl === true))
            && event.shortcut.shift !== true
            && event.shortcut.alt !== true
            && event.shortcut.meta !== true) {
            this.validateNewSegment();
            return;
        }
        if (this.segment.data.selected === true
            && this.editionInProgess()
            && event.shortcut.key === 'escape'
            && event.shortcut.ctrl !== true
            && event.shortcut.shift !== true
            && event.shortcut.alt !== true
            && event.shortcut.meta !== true) {
            this.cancelNewSegmentCreation();
            return;
        }
    }
    openNotilusMaterial() {
        this.actionEmitter.emit({ type: "openNotilusMaterial", payload: this.segment });
    }
    ngOnDestroy() {
        this.formChangesSubscriptions.forEach(subscription => subscription.unsubscribe());
        Utils.unsubscribeTargetedElementEventListeners(this);
    }
}
