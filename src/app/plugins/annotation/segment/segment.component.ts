import {
    AfterViewInit, ChangeDetectorRef,
    Component,
    computed,
    effect, ElementRef,
    EventEmitter, HostListener,
    input,
    Input, OnInit,
    Output, signal,
    ViewChild
} from '@angular/core';
import {AnnotationAction, AnnotationLocalisation} from "../../../core/metadata/model/annotation-localisation";
import {AbstractControl, NgForm} from "@angular/forms";
import {debounceTime, interval, of, Subscription, takeUntil, takeWhile, timer} from "rxjs";
import {FormatUtils} from "../../../core/utils/format-utils";
import {DEFAULT} from "../../../core/constant/default";
import {MessageService} from "primeng/api";
import {switchMap} from 'rxjs/operators';
import {AutoCompleteCompleteEvent} from "primeng/autocomplete";

@Component({
    selector: 'amalia-segment',
    templateUrl: './segment.component.html',
    styleUrl: './segment.component.scss',
})
export class SegmentComponent implements OnInit, AfterViewInit {
    //Inputs
    @Input({required: true})
    public segment: AnnotationLocalisation;
    @Input()
    public tcDisplayFormat: 's' | 'f' = 'f';
    @Input()
    public fps = DEFAULT.FPS;
    @Input()
    availableCategories: string[] = [];
    @Input()
    availableKeywords: string[] = [];

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
    @ViewChild('titlediv')
    public titlediv: ElementRef;
    @ViewChild('descp')
    public descp: ElementRef;
    @ViewChild('readOnlyCategoriesDiv')
    public readOnlyCategoriesDiv: ElementRef;
    @ViewChild('readOnlyKeywordsDiv')
    public readOnlyKeywordsDiv: ElementRef;

    public isEllipsed: boolean = false;
    public isDescriptionCollapsed: boolean = true;
    public isDescriptionTruncated: boolean = false;

    public timeFormatPattern = this.tcDisplayFormat === 'f' ? /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d:)(\d{2})$/ : /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
    private formChangesSubscriptions: Subscription[] = [];
    public tcInFormatted = FormatUtils.formatTime(0, this.tcDisplayFormat, this.fps);
    public tcOutFormatted = FormatUtils.formatTime(0, this.tcDisplayFormat, this.fps);
    public tcFormatted = FormatUtils.formatTime(0, this.tcDisplayFormat, this.fps);

    //Signals
    public categories = signal<string[]>([]);
    public keywords = signal<string[]>([]);
    public property = computed(() => {
        const prop: { key: string; value: string }[] = [];
        this.categories()?.forEach(cat => {
            if (!prop.find(p => p.key === 'category' && p.value === cat)) {
                prop.push({key: 'category', value: cat});
            }
        });
        this.keywords()?.forEach(keyword => {
            if (!prop.find(p => p.key === 'keyword' && p.value === keyword)) {
                prop.push({key: 'keyword', value: keyword});
            }
        });
        return prop;
    });
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

    constructor(private messageService: MessageService, private cdr: ChangeDetectorRef) {
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
                this.updateCategoriesAndKeywordsDisplay();
            }
        });
    }

    public validateNewSegment() {
        this.doCheckTcIn();
        this.doCheckTcOut();
        this.doCheckTc();
        if (this.segmentForm.valid) {
            this.actionEmitter.emit({type: "validate", payload: this.segment});
            this.setIsEllipsed();
            this.setIsDescriptionTruncated();
        }
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

    private checkTcIn(value: string) {
        const tcIn = FormatUtils.convertFormattedTcToSeconds(value, this.tcDisplayFormat, this.fps);
        const tcOut = FormatUtils.convertFormattedTcToSeconds(this.tcOutFormatted, this.tcDisplayFormat, this.fps);
        const tcOffset = this.segment.tcOffset;
        const tcMax = this.segment.data.tcMax;

        if (tcIn > tcOut || tcIn < tcOffset || tcIn > tcMax) {
            this.displaySnackBar('le TC IN doit être inférieur au TC OUT et compris entre le TC IN et le TC OUT de l\'intégral');
            return null;
        }
        return value;
    }

    private checkTcOut(value: string, tcMax: number) {
        const tcOut = FormatUtils.convertFormattedTcToSeconds(value, this.tcDisplayFormat, this.fps);
        const tcIn = FormatUtils.convertFormattedTcToSeconds(this.tcInFormatted, this.tcDisplayFormat, this.fps);
        const tcOffset = this.segment.tcOffset;
        if (tcIn > tcOut || tcOut > tcMax || tcOffset > tcOut) {
            this.displaySnackBar('Le TC OUT doit être supérieur au TC IN et compris entre le TC IN et le TC OUT du fichier intégral');
            return null;
        }
        return value;
    }

    private checkTc(value: string, tcMax: number) {
        const tc = FormatUtils.convertFormattedTcToSeconds(value, this.tcDisplayFormat, this.fps);
        const tcOffset = this.segment.tcOffset;
        if ((tc + tcOffset) > tcMax) {
            this.displaySnackBar('La durée du segment doit être inférieure à la durée total du média visionné');
            return null;
        }
        return value;
    }

    public doCheckTcIn() {
        const tcInFormControl = this.segmentForm.form.controls['tcIn'];
        if (tcInFormControl) {
            const value = this.tcValidators("tcIn", tcInFormControl.value);
            this.afterTcInValidation(value, tcInFormControl);
        }
    }

    doCheckTcOut() {
        const tcOutFormControl = this.segmentForm.form.controls['tcOut'];
        if (tcOutFormControl) {
            const value = this.tcValidators("tcOut", tcOutFormControl.value);
            this.afterTcOutValidation(value, tcOutFormControl);
        }
    }

    doCheckTc() {
        const tcFormControl = this.segmentForm.form.controls['tc'];
        if (tcFormControl) {
            const value = this.tcValidators("tc", tcFormControl.value);
            this.afterTcValidation(value, tcFormControl);
        }
    }

    tcValidators(forTC: "tcIn" | "tcOut" | "tc", value: string): string | null {
        let result = null;
        if (this.timeFormatPattern.test(value)) {
            let tcMax = this.segment.data.tcMax ? this.segment.data.tcMax : Number.MAX_VALUE;
            switch (forTC) {
                case "tcIn":
                    result = this.checkTcIn(value);
                    break;
                case "tcOut":
                    result = this.checkTcOut(value, tcMax);
                    break;
                case "tc":
                    result = this.checkTc(value, tcMax);
                    break;
            }
        } else {
            this.displaySnackBar(forTC + ': Le format de temps est incorrect');
        }
        return result;
    }

    public afterTcInValidation(value: string, tcInFormControl: AbstractControl<any>) {
        if (value) {
            const tcIn = FormatUtils.convertFormattedTcToSeconds(value, this.tcDisplayFormat, this.fps);
            if (tcIn >= 0) {
                this.segment.tcIn = tcIn;
                this.setTc();
            }
        } else {
            tcInFormControl.setErrors({'Error': true});
        }
    }

    public afterTcOutValidation(value: string, tcOutFormControl: AbstractControl<any>) {
        if (value) {
            const tcOut = FormatUtils.convertFormattedTcToSeconds(value, this.tcDisplayFormat, this.fps);
            if (tcOut >= 0) {
                this.segment.tcOut = tcOut;
                this.setTc();
            }
        } else {
            tcOutFormControl.setErrors({'Error': true});
        }
    }

    public afterTcValidation(value: string, tcFormControl: AbstractControl<any>) {
        if (value) {
            const tc = FormatUtils.convertFormattedTcToSeconds(value, this.tcDisplayFormat, this.fps);
            if (tc >= 0) {
                this.segment.tc = tc;
                if (this.segment.tcIn + this.segment.tc >= 0) {
                    this.segment.tcOut = this.segment.tcIn + this.segment.tc;
                    this.tcOutFormatted = FormatUtils.formatTime(this.segment.tcOut, this.tcDisplayFormat, this.fps);
                }
            }
        } else {
            tcFormControl.setErrors({'Error': true});
        }
    }

    private activateEdition() {
        if (!this.editionAlreadyActivated) {
            this.propertyBeforeEdition = structuredClone(this.property());
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
                this.activateTitleEdition();
                //description
                this.activateDescriptionEdition();
            }, 200);
            this.editionAlreadyActivated = true;
        }
    }

    private activateTcOutEdition = () => {
        const tcOutFormControl = this.segmentForm.form.controls['tcOut'];
        if (tcOutFormControl) {
            const tcOutSubscription = tcOutFormControl.valueChanges.pipe(debounceTime(2000), switchMap((value) => {
                return of(this.tcValidators("tcOut", value));
            })).subscribe(value => {
                this.afterTcOutValidation(value, tcOutFormControl);
            });
            this.formChangesSubscriptions.push(tcOutSubscription);
        }
    }
    private activateTcInEdition = () => {
        const tcInFormControl = this.segmentForm.form.controls['tcIn'];
        if (tcInFormControl) {
            const tcInSubscription = tcInFormControl.valueChanges.pipe(debounceTime(2000), switchMap((value) => {
                return of(this.tcValidators("tcIn", value));
            })).subscribe(value => {
                this.afterTcInValidation(value, tcInFormControl);
            });
            this.formChangesSubscriptions.push(tcInSubscription);
        }
    }
    private activateTcEdition = () => {
        const tcFormControl = this.segmentForm.form.controls['tc'];
        if (tcFormControl) {
            const tcSubscription = tcFormControl.valueChanges.pipe(debounceTime(2000), switchMap((value) => {
                return of(this.tcValidators("tc", value));
            })).subscribe(value => {
                this.afterTcValidation(value, tcFormControl);
            });
            this.formChangesSubscriptions.push(tcSubscription);
        }
    }
    private activateCategoriesEdition = () => {
        const categoriesFormControl = this.segmentForm.form.controls['categories'];
        if (categoriesFormControl) {
            const categoriesSubscription = categoriesFormControl.valueChanges.pipe(debounceTime(100)).subscribe(() => {
                this.segment.property = this.property();
                if (this.categories().length > 10) {
                    categoriesFormControl.setErrors({'invalid': true});
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
                    keywordsFormControl.setErrors({'invalid': true});
                } else {
                    keywordsFormControl.setErrors(null);
                }
            });
            this.formChangesSubscriptions.push(keywordsSubscription);

        }
    }
    private activateTitleEdition = () => {
        const titleFormControl = this.segmentForm.form.controls['title'];
        if (titleFormControl) {
            const titleChangesSubscription = titleFormControl.valueChanges.subscribe((value) => {
                if (value.length > 250) {
                    titleFormControl.setErrors({'Error': true})
                } else {
                    titleFormControl.setErrors(null);
                }
            });
            this.formChangesSubscriptions.push(titleChangesSubscription);
        }
    }
    private activateDescriptionEdition = () => {
        const descriptionFormControl = this.segmentForm.form.controls['description'];
        if (descriptionFormControl) {
            const descriptionChangesSubscription = descriptionFormControl.valueChanges.subscribe((value) => {
                if (value.length > 1000) {
                    descriptionFormControl.setErrors({'Error': true})
                } else {
                    descriptionFormControl.setErrors(null);
                }
            });
            this.formChangesSubscriptions.push(descriptionChangesSubscription);
        }
    }

    public editSegment() {
        this.editionAlreadyActivated = false;
        this.actionEmitter.emit({type: "edit", payload: this.segment});
    }

    public cancelNewSegmentCreation() {
        this.actionEmitter.emit({type: "cancel", payload: this.segment});
        this.setCategoriesFromProperty(this.propertyBeforeEdition);
        this.setKeywordsFromProperty(this.propertyBeforeEdition);
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

    public setCategoriesFromProperty(props) {
        this.categories.set(props?.filter(prop => prop.key === "category").map(prop => prop.value) ?? []);
    }

    public setKeywordsFromProperty(props) {
        this.keywords.set(props?.filter(prop => prop.key === "keyword").map(prop => prop.value) ?? []);
    }

    ngOnInit(): void {
        this.setCategoriesFromProperty(this.segment.property);
        this.setKeywordsFromProperty(this.segment.property);
    }

    ngAfterViewInit(): void {
        this.setIsEllipsed();
        this.setIsDescriptionTruncated();
        this.updateCategoriesAndKeywordsDisplay();
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

    searchCategories($event: AutoCompleteCompleteEvent) {
        this.filteredCategories = this.availableCategories.filter(item => item.toLowerCase().includes($event.query.toLowerCase())).slice(0, 10);
        if (this.filteredCategories.length === 0) {
            this.filteredCategories.push($event.query);
        } else {
            this.categories().forEach(category => {
                if (this.filteredCategories.includes(category)) {
                    this.filteredCategories.splice(this.filteredCategories.indexOf(category), 1);
                }
            })
        }
        this.cdr.detectChanges();
    }

    searchKeywords($event: AutoCompleteCompleteEvent) {
        this.filteredKeywords = this.availableKeywords.filter(item => item.toLowerCase().includes($event.query.toLowerCase())).slice(0, 10);
        if (this.filteredKeywords.length === 0) {
            this.filteredKeywords.push($event.query);
        } else {
            this.keywords().forEach(keyword => {
                if (this.filteredKeywords.includes(keyword)) {
                    this.filteredKeywords.splice(this.filteredKeywords.indexOf(keyword), 1);
                }
            })
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

    private updateDisplay(readOnlyDiv: ElementRef, readOnlyClassName: string, summaryChipId: string) {
        const div = readOnlyDiv.nativeElement;
        const divWidth = div.offsetWidth;
        const chips = div.querySelectorAll(`.${readOnlyClassName} p-chip`);
        let totalWidth = 0;
        let truncateChips: boolean = false;
        let hiddenChipsCount = 0;
        const gap = 6;

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
            let availableWidth = divWidth - 60;
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
}
