import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { SegmentComponent } from './segment.component';
import { FormsModule, NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ChangeDetectorRef, ElementRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AnnotationLocalisation } from '../../../core/metadata/model/annotation-localisation';
import { AnnotationsService } from 'src/app/service/annotations.service';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ChipModule } from 'primeng/chip';
import { TooltipModule } from 'primeng/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TcFormatPipe } from 'src/app/core/utils/tc-format.pipe';
import { Subject } from 'rxjs';

const createMockFormControl = (initialValue: string = '') => {
    const valueChanges = new Subject<string>();
    return {
        value: initialValue,
        errors: null,
        setErrors: jasmine.createSpy('setErrors'),
        valueChanges: valueChanges.asObservable()
    };
};

describe('SegmentComponent', () => {
    let component: SegmentComponent;
    let fixture: ComponentFixture<SegmentComponent>;
    let mockMessageService: jasmine.SpyObj<MessageService>;
    let mockAnnotationsService: jasmine.SpyObj<AnnotationsService>;

    const createMockSegment = (): AnnotationLocalisation => ({
        id: '1',
        label: 'Test Segment',
        description: 'Test Description',
        tcIn: 100,
        tcOut: 200,
        tc: 100,
        tcOffset: 0,
        property: [
            { key: 'category', value: 'Cat1' },
            { key: 'keyword', value: 'Key1' }
        ],
        data: {
            isNew: false,
            isTitleEditing: false,
            isTcInEditing: false,
            isTcOutEditing: false,
            isTcEditing: false,
            isCategoriesEditing: false,
            isKeywordsEditing: false,
            isDescriptionEditing: false,
            selected: false,
            tcMax: 1000
        }
    } as AnnotationLocalisation);

    beforeEach(async () => {
        mockMessageService = jasmine.createSpyObj('MessageService', ['add']);
        mockAnnotationsService = jasmine.createSpyObj('AnnotationsService', ['getAnnotations']);

        await TestBed.configureTestingModule({
            declarations: [SegmentComponent, TcFormatPipe],
            imports: [
                FormsModule,
                AutoCompleteModule,
                ChipModule,
                TooltipModule,
                BrowserAnimationsModule
            ],
            providers: [
                { provide: MessageService, useValue: mockMessageService },
                { provide: AnnotationsService, useValue: mockAnnotationsService },
                ChangeDetectorRef
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(SegmentComponent);
        component = fixture.componentInstance;
        component.segment = createMockSegment();
        component.availableCategories = ['Cat1', 'Cat2', 'Cat3'];
        component.availableKeywords = ['Key1', 'Key2', 'Key3'];

        // Mock ViewChild elements
        component.titlediv = new ElementRef(document.createElement('div'));
        component.descp = new ElementRef(document.createElement('p'));
        component.descp2 = new ElementRef(document.createElement('p'));

        // Mock segmentForm with proper form controls
        component.segmentForm = {
            form: {
                controls: {
                    title: createMockFormControl('Test Segment'),
                    tcIn: createMockFormControl('00:01:40:00'),
                    tcOut: createMockFormControl('00:03:20:00'),
                    tc: createMockFormControl('00:01:40:00'),
                    categories: createMockFormControl(''),
                    keywords: createMockFormControl(''),
                    description: createMockFormControl('Test Description')
                },
                valid: true
            }
        } as unknown as NgForm;

        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    describe('Component Initialization', () => {
        it('should create', () => {
            expect(component).toBeTruthy();
        });

        it('should initialize categories and keywords from segment property', () => {
            component.ngOnInit();
            expect(component.categories()).toContain('Cat1');
            expect(component.keywords()).toContain('Key1');
        });

        it('should format tcIn and tcOut on init', () => {
            component.ngOnInit();
            expect(component.tcInFormatted).toBeDefined();
            expect(component.tcOutFormatted).toBeDefined();
        });
    });

    describe('Title Editing', () => {
        it('should start title edit', () => {
            const emitSpy = spyOn(component.actionEmitter, 'emit');
            component.startTitleEdit();

            expect(component.segment.data.isTitleEditing).toBeTrue();
            expect(emitSpy).toHaveBeenCalledWith({ type: 'edit', payload: component.segment });
        });

        it('should confirm title edit when value is valid', () => {
            component.segment.label = 'Valid Title';
            const emitSpy = spyOn(component.actionEmitter, 'emit');
            component.confirmTitleEdit();

            expect(component.segment.data.isTitleEditing).toBeFalse();
            expect(emitSpy).toHaveBeenCalledWith({ type: 'validate', payload: component.segment });
        });

        it('should not confirm title edit when value exceeds 250 characters', () => {
            component.segment.label = 'a'.repeat(251);
            const emitSpy = spyOn(component.actionEmitter, 'emit');
            component.confirmTitleEdit();

            expect(emitSpy).not.toHaveBeenCalled();
        });

        it('should cancel title edit and restore previous value', () => {
            component.startTitleEdit();
            component.segment.label = 'New Title';
            component.cancelTitleEdit();

            expect(component.segment.label).toBe('Test Segment');
            expect(component.segment.data.isTitleEditing).toBeFalse();
        });

        it('should handle Escape key to cancel title edit', () => {
            component.startTitleEdit();
            const event = new KeyboardEvent('keydown', { key: 'Escape' });
            spyOn(event, 'preventDefault');
            spyOn(event, 'stopPropagation');

            component.onTitleEditKeydown(event);

            expect(event.preventDefault).toHaveBeenCalled();
            expect(component.segment.data.isTitleEditing).toBeFalse();
        });

        it('should handle Enter key to confirm title edit', () => {
            component.startTitleEdit();
            component.segment.label = 'Valid Title';
            const event = new KeyboardEvent('keydown', { key: 'Enter' });
            spyOn(event, 'preventDefault');

            component.onTitleEditKeydown(event);

            expect(event.preventDefault).toHaveBeenCalled();
        });

        it('should ignore blur when flag is set', () => {
            component.onTitleActionMouseDown();
            const confirmSpy = spyOn(component, 'confirmTitleEdit');

            component.onTitleBlur();

            expect(confirmSpy).not.toHaveBeenCalled();
        });

        it('should confirm on blur when flag is not set', () => {
            const confirmSpy = spyOn(component, 'confirmTitleEdit');

            component.onTitleBlur();

            expect(confirmSpy).toHaveBeenCalled();
        });
    });

    describe('TcIn Editing', () => {
        it('should start tcIn edit', () => {
            const emitSpy = spyOn(component.actionEmitter, 'emit');
            component.startTcInEdit();

            expect(component.segment.data.isTcInEditing).toBeTrue();
            expect(emitSpy).toHaveBeenCalledWith({ type: 'edit', payload: component.segment });
        });

        it('should cancel tcIn edit and restore previous value', () => {
            component.tcInFormatted = '00:01:40:00';
            component.startTcInEdit();
            component.tcInFormatted = '00:02:00:00';
            component.cancelTcInEdit();

            expect(component.tcInFormatted).toBe('00:01:40:00');
            expect(component.segment.data.isTcInEditing).toBeFalse();
        });

        it('should handle Escape key to cancel tcIn edit', () => {
            component.startTcInEdit();
            const event = new KeyboardEvent('keydown', { key: 'Escape' });
            spyOn(event, 'preventDefault');

            component.onTcInKeydown(event);

            expect(event.preventDefault).toHaveBeenCalled();
            expect(component.segment.data.isTcInEditing).toBeFalse();
        });

        it('should handle Enter key to confirm tcIn edit', () => {
            component.startTcInEdit();
            const event = new KeyboardEvent('keydown', { key: 'Enter' });
            spyOn(event, 'preventDefault');
            spyOn(component, 'confirmTcInEdit');

            component.onTcInKeydown(event);

            expect(event.preventDefault).toHaveBeenCalled();
            expect(component.confirmTcInEdit).toHaveBeenCalled();
        });
    });

    describe('TcOut Editing', () => {
        it('should start tcOut edit', () => {
            const emitSpy = spyOn(component.actionEmitter, 'emit');
            component.startTcOutEdit();

            expect(component.segment.data.isTcOutEditing).toBeTrue();
            expect(emitSpy).toHaveBeenCalledWith({ type: 'edit', payload: component.segment });
        });

        it('should cancel tcOut edit and restore previous value', () => {
            component.tcOutFormatted = '00:03:20:00';
            component.startTcOutEdit();
            component.tcOutFormatted = '00:04:00:00';
            component.cancelTcOutEdit();

            expect(component.tcOutFormatted).toBe('00:03:20:00');
            expect(component.segment.data.isTcOutEditing).toBeFalse();
        });

        it('should handle Escape key to cancel tcOut edit', () => {
            component.startTcOutEdit();
            const event = new KeyboardEvent('keydown', { key: 'Escape' });
            spyOn(event, 'preventDefault');

            component.onTcOutKeydown(event);

            expect(event.preventDefault).toHaveBeenCalled();
            expect(component.segment.data.isTcOutEditing).toBeFalse();
        });
    });

    describe('Tc (Duration) Editing', () => {
        it('should start tc edit', () => {
            const emitSpy = spyOn(component.actionEmitter, 'emit');
            component.startTcEdit();

            expect(component.segment.data.isTcEditing).toBeTrue();
            expect(emitSpy).toHaveBeenCalledWith({ type: 'edit', payload: component.segment });
        });

        it('should cancel tc edit and restore previous value', () => {
            component.tcFormatted = '00:01:40:00';
            component.startTcEdit();
            component.tcFormatted = '00:02:00:00';
            component.cancelTcEdit();

            expect(component.tcFormatted).toBe('00:01:40:00');
            expect(component.segment.data.isTcEditing).toBeFalse();
        });

        it('should handle Escape key to cancel tc edit', () => {
            component.startTcEdit();
            const event = new KeyboardEvent('keydown', { key: 'Escape' });
            spyOn(event, 'preventDefault');

            component.onTcKeydown(event);

            expect(event.preventDefault).toHaveBeenCalled();
            expect(component.segment.data.isTcEditing).toBeFalse();
        });
    });

    describe('Categories Editing', () => {
        it('should start categories edit', () => {
            const emitSpy = spyOn(component.actionEmitter, 'emit');
            component.startCategoriesEdit();

            expect(component.segment.data.isCategoriesEditing).toBeTrue();
            expect(emitSpy).toHaveBeenCalledWith({ type: 'edit', payload: component.segment });
        });

        it('should confirm categories edit when count is valid', () => {
            component.categories.set(['Cat1', 'Cat2']);
            const emitSpy = spyOn(component.actionEmitter, 'emit');
            component.confirmCategoriesEdit();

            expect(component.segment.data.isCategoriesEditing).toBeFalse();
            expect(emitSpy).toHaveBeenCalledWith({ type: 'validate', payload: component.segment });
        });

        it('should not confirm categories edit when count exceeds 10', () => {
            component.categories.set(['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'C11']);
            const emitSpy = spyOn(component.actionEmitter, 'emit');
            component.confirmCategoriesEdit();

            expect(emitSpy).not.toHaveBeenCalled();
        });

        it('should cancel categories edit and restore previous values', () => {
            component.categories.set(['Cat1']);
            component.startCategoriesEdit();
            component.categories.set(['Cat1', 'Cat2', 'Cat3']);
            component.cancelCategoriesEdit();

            expect(component.categories()).toEqual(['Cat1']);
            expect(component.segment.data.isCategoriesEditing).toBeFalse();
        });

        it('should ignore blur when flag is set', fakeAsync(() => {
            component.categoriesEditWrapper = new ElementRef(document.createElement('div'));
            component.onCategoriesMouseDown({ target: { closest: () => ({ classList: { contains: () => true } }) } } as any);

            const confirmSpy = spyOn(component, 'confirmCategoriesEdit');
            component.onCategoriesBlur();
            tick(10);

            expect(confirmSpy).not.toHaveBeenCalled();
        }));

        it('should handle Escape key to cancel categories edit', fakeAsync(() => {
            component.startCategoriesEdit();
            const event = new KeyboardEvent('keydown', { key: 'Escape' });
            spyOn(event, 'preventDefault');
            spyOn(event, 'stopPropagation');

            component.onCategoriesEscape(event);
            tick(20);

            expect(event.preventDefault).toHaveBeenCalled();
            expect(component.segment.data.isCategoriesEditing).toBeFalse();
        }));

        it('should add category on Enter with valid query', fakeAsync(() => {
            component.categories.set(['Cat1']);
            const input = document.createElement('input');
            input.value = 'NewCat';
            const event = new KeyboardEvent('keydown', { key: 'Enter' });
            Object.defineProperty(event, 'target', { value: input });
            spyOn(event, 'preventDefault');

            component.onCategoriesEnter(event);
            tick();

            expect(component.categories()).toContain('NewCat');
            expect(input.value).toBe('');
        }));

        it('should not add duplicate category (case insensitive)', fakeAsync(() => {
            component.categories.set(['Cat1']);
            const input = document.createElement('input');
            input.value = 'cat1';
            const event = new KeyboardEvent('keydown', { key: 'Enter' });
            Object.defineProperty(event, 'target', { value: input });

            component.onCategoriesEnter(event);
            tick();

            expect(component.categories().length).toBe(1);
        }));
    });

    describe('Keywords Editing', () => {
        it('should start keywords edit', () => {
            const emitSpy = spyOn(component.actionEmitter, 'emit');
            component.startKeywordsEdit();

            expect(component.segment.data.isKeywordsEditing).toBeTrue();
            expect(emitSpy).toHaveBeenCalledWith({ type: 'edit', payload: component.segment });
        });

        it('should confirm keywords edit when count is valid', () => {
            component.keywords.set(['Key1', 'Key2']);
            const emitSpy = spyOn(component.actionEmitter, 'emit');
            component.confirmKeywordsEdit();

            expect(component.segment.data.isKeywordsEditing).toBeFalse();
            expect(emitSpy).toHaveBeenCalledWith({ type: 'validate', payload: component.segment });
        });

        it('should not confirm keywords edit when count exceeds 10', () => {
            component.keywords.set(['K1', 'K2', 'K3', 'K4', 'K5', 'K6', 'K7', 'K8', 'K9', 'K10', 'K11']);
            const emitSpy = spyOn(component.actionEmitter, 'emit');
            component.confirmKeywordsEdit();

            expect(emitSpy).not.toHaveBeenCalled();
        });

        it('should cancel keywords edit and restore previous values', () => {
            component.keywords.set(['Key1']);
            component.startKeywordsEdit();
            component.keywords.set(['Key1', 'Key2', 'Key3']);
            component.cancelKeywordsEdit();

            expect(component.keywords()).toEqual(['Key1']);
            expect(component.segment.data.isKeywordsEditing).toBeFalse();
        });

        it('should handle Escape key to cancel keywords edit', fakeAsync(() => {
            component.startKeywordsEdit();
            const event = new KeyboardEvent('keydown', { key: 'Escape' });
            spyOn(event, 'preventDefault');
            spyOn(event, 'stopPropagation');

            component.onKeywordsEscape(event);
            tick(20);

            expect(event.preventDefault).toHaveBeenCalled();
            expect(component.segment.data.isKeywordsEditing).toBeFalse();
        }));

        it('should add keyword on Enter with valid query', fakeAsync(() => {
            component.keywords.set(['Key1']);
            const input = document.createElement('input');
            input.value = 'NewKey';
            const event = new KeyboardEvent('keydown', { key: 'Enter' });
            Object.defineProperty(event, 'target', { value: input });
            spyOn(event, 'preventDefault');

            component.onKeywordsEnter(event);
            tick();

            expect(component.keywords()).toContain('NewKey');
            expect(input.value).toBe('');
        }));
    });

    describe('Description Editing', () => {
        it('should start description edit', () => {
            const emitSpy = spyOn(component.actionEmitter, 'emit');
            component.startDescriptionEdit();

            expect(component.segment.data.isDescriptionEditing).toBeTrue();
            expect(emitSpy).toHaveBeenCalledWith({ type: 'edit', payload: component.segment });
        });

        it('should confirm description edit when value is valid', fakeAsync(() => {
            component.segment.description = 'Valid Description';
            const emitSpy = spyOn(component.actionEmitter, 'emit');
            component.confirmDescriptionEdit();
            tick(2100);

            expect(component.segment.data.isDescriptionEditing).toBeFalse();
            expect(emitSpy).toHaveBeenCalledWith({ type: 'validate', payload: component.segment });
        }));

        it('should not confirm description edit when value exceeds 1000 characters', () => {
            component.segment.description = 'a'.repeat(1001);
            const emitSpy = spyOn(component.actionEmitter, 'emit');
            component.confirmDescriptionEdit();

            expect(emitSpy).not.toHaveBeenCalled();
        });

        it('should cancel description edit and restore previous value', fakeAsync(() => {
            component.startDescriptionEdit();
            component.segment.description = 'New Description';
            component.cancelDescriptionEdit();
            tick(2100);

            expect(component.segment.description).toBe('Test Description');
            expect(component.segment.data.isDescriptionEditing).toBeFalse();
        }));

        it('should handle Escape key to cancel description edit', fakeAsync(() => {
            component.startDescriptionEdit();
            const event = new KeyboardEvent('keydown', { key: 'Escape' });
            spyOn(event, 'preventDefault');

            component.onDescriptionKeydown(event);
            tick(2100);

            expect(event.preventDefault).toHaveBeenCalled();
            expect(component.segment.data.isDescriptionEditing).toBeFalse();
        }));

        it('should ignore blur when flag is set', () => {
            component.onDescriptionActionMouseDown();
            const confirmSpy = spyOn(component, 'confirmDescriptionEdit');

            component.onDescriptionBlur();

            expect(confirmSpy).not.toHaveBeenCalled();
        });
    });

    describe('Toggle Description', () => {
        it('should toggle description collapsed state', () => {
            component.isDescriptionCollapsed = true;
            const event = new Event('click');
            spyOn(event, 'preventDefault');

            component.toggleDescription(event);

            expect(component.isDescriptionCollapsed).toBeFalse();
        });
    });

    describe('Segment Actions', () => {
        it('should emit clone action', () => {
            const emitSpy = spyOn(component.actionEmitter, 'emit');
            component.cloneSegment();

            expect(emitSpy).toHaveBeenCalledWith({ type: 'clone', payload: component.segment });
        });

        it('should emit remove action', () => {
            const emitSpy = spyOn(component.actionEmitter, 'emit');
            component.removeSegment();

            expect(emitSpy).toHaveBeenCalledWith({ type: 'remove', payload: component.segment });
        });

        it('should emit playMedia action', () => {
            const emitSpy = spyOn(component.actionEmitter, 'emit');
            component.playMedia();

            expect(emitSpy).toHaveBeenCalledWith({ type: 'playMedia', payload: component.segment });
        });

        it('should emit updatethumbnail action', () => {
            const emitSpy = spyOn(component.actionEmitter, 'emit');
            component.updateThumbnail();

            expect(emitSpy).toHaveBeenCalledWith({ type: 'updatethumbnail', payload: component.segment });
        });

        it('should emit openNotilusMaterial action', () => {
            const emitSpy = spyOn(component.actionEmitter, 'emit');
            component.openNotilusMaterial();

            expect(emitSpy).toHaveBeenCalledWith({ type: 'openNotilusMaterial', payload: component.segment });
        });

        it('should emit muteShortCuts action', () => {
            const emitSpy = spyOn(component.actionEmitter, 'emit');
            component.muteShortCuts();

            expect(emitSpy).toHaveBeenCalledWith({ type: 'muteShortCuts', payload: component.segment });
        });

        it('should emit unmuteShortCuts action', () => {
            const emitSpy = spyOn(component.actionEmitter, 'emit');
            component.unmuteShortCuts();

            expect(emitSpy).toHaveBeenCalledWith({ type: 'unmuteShortCuts', payload: component.segment });
        });
    });

    describe('Search Methods', () => {
        it('should filter categories based on query', () => {
            component.categories.set([]);
            component.searchCategories({ query: 'Cat' } as any);

            expect(component.filteredCategories.length).toBeGreaterThan(0);
            expect(component.filteredCategories.every(c => c.toLowerCase().includes('cat'))).toBeTrue();
        });

        it('should exclude already selected categories from suggestions', () => {
            component.categories.set(['Cat1']);
            component.searchCategories({ query: 'Cat' } as any);

            expect(component.filteredCategories).not.toContain('Cat1');
        });

        it('should filter keywords based on query', () => {
            component.keywords.set([]);
            component.searchKeywords({ query: 'Key' } as any);

            expect(component.filteredKeywords.length).toBeGreaterThan(0);
            expect(component.filteredKeywords.every(k => k.toLowerCase().includes('key'))).toBeTrue();
        });

        it('should exclude already selected keywords from suggestions', () => {
            component.keywords.set(['Key1']);
            component.searchKeywords({ query: 'Key' } as any);

            expect(component.filteredKeywords).not.toContain('Key1');
        });
    });

    describe('Utility Methods', () => {
        it('should add new categories to available list', () => {
            component.availableCategories = ['Cat1'];
            component.addToAvailableCategories(['NewCat']);

            expect(component.availableCategories).toContain('NewCat');
        });

        it('should not add duplicate categories to available list', () => {
            component.availableCategories = ['Cat1'];
            component.addToAvailableCategories(['Cat1']);

            expect(component.availableCategories.filter(c => c === 'Cat1').length).toBe(1);
        });

        it('should add new keywords to available list', () => {
            component.availableKeywords = ['Key1'];
            component.addToAvailableKeywords(['NewKey']);

            expect(component.availableKeywords).toContain('NewKey');
        });

        it('should calculate text width', () => {
            const width = component.calculateTextWidth('Test', 'Lato');
            expect(width).toBeGreaterThan(0);
        });

        it('should display remaining items correctly', () => {
            const items = ['a', 'b', 'c', 'd', 'e'];
            const result = component.displayRemaining(items, 2);

            expect(result).toBe('d; e');
        });

        it('should return empty string when items count is less than minus', () => {
            const items = ['a', 'b'];
            const result = component.displayRemaining(items, 3);

            expect(result).toBe('');
        });

        it('should set categories from property', () => {
            const props = [
                { key: 'category', value: 'NewCat1' },
                { key: 'category', value: 'NewCat2' },
                { key: 'keyword', value: 'Key1' }
            ];
            component.setCategoriesFromProperty(props);

            expect(component.categories()).toEqual(['NewCat1', 'NewCat2']);
        });

        it('should set keywords from property', () => {
            const props = [
                { key: 'keyword', value: 'NewKey1' },
                { key: 'keyword', value: 'NewKey2' },
                { key: 'category', value: 'Cat1' }
            ];
            component.setKeywordsFromProperty(props);

            expect(component.keywords()).toEqual(['NewKey1', 'NewKey2']);
        });
    });

    describe('setTc', () => {
        it('should calculate tc from tcIn and tcOut', () => {
            component.segment.tcIn = 100;
            component.segment.tcOut = 200;
            component.setTc();

            expect(component.segment.tc).toBe(100);
            expect(component.setTcInvoked).toBeTrue();
        });

        it('should not set tc when tcIn is greater than tcOut', () => {
            component.segment.tcIn = 300;
            component.segment.tcOut = 200;
            component.segment.tc = 50;
            component.setTc();

            expect(component.segment.tc).toBe(50);
        });

        it('should not set tc when tcIn is negative', () => {
            component.segment.tcIn = -1;
            component.segment.tcOut = 200;
            component.segment.tc = 50;
            component.setTc();

            expect(component.segment.tc).toBe(50);
        });
    });

    describe('editionInProgress', () => {
        it('should return true when title is being edited', () => {
            component.segment.data.isTitleEditing = true;
            expect(component.editionInProgess()).toBeTrue();
        });

        it('should return true when categories are being edited', () => {
            component.segment.data.isCategoriesEditing = true;
            expect(component.editionInProgess()).toBeTrue();
        });

        it('should return true when keywords are being edited', () => {
            component.segment.data.isKeywordsEditing = true;
            expect(component.editionInProgess()).toBeTrue();
        });

        it('should return true when description is being edited', () => {
            component.segment.data.isDescriptionEditing = true;
            expect(component.editionInProgess()).toBeTrue();
        });

        it('should return true when tcIn is being edited', () => {
            component.segment.data.isTcInEditing = true;
            expect(component.editionInProgess()).toBeTrue();
        });

        it('should return true when tcOut is being edited', () => {
            component.segment.data.isTcOutEditing = true;
            expect(component.editionInProgess()).toBeTrue();
        });

        it('should return true when tc is being edited', () => {
            component.segment.data.isTcEditing = true;
            expect(component.editionInProgess()).toBeTrue();
        });

        it('should return false when nothing is being edited', () => {
            component.segment.data.isTitleEditing = false;
            component.segment.data.isCategoriesEditing = false;
            component.segment.data.isKeywordsEditing = false;
            component.segment.data.isDescriptionEditing = false;
            component.segment.data.isTcInEditing = false;
            component.segment.data.isTcOutEditing = false;
            component.segment.data.isTcEditing = false;

            expect(component.editionInProgess()).toBeFalse();
        });
    });

    describe('readOnlyTitleReady', () => {
        it('should return true when titlediv is available', () => {
            component.titlediv = new ElementRef(document.createElement('div'));
            expect(component.readOnlyTitleReady()).toBeTrue();
        });

        it('should return false when titlediv is not available', () => {
            component.titlediv = undefined as any;
            expect(component.readOnlyTitleReady()).toBeFalse();
        });
    });

    describe('readOnlyDescriptionReady', () => {
        it('should return true when descp is available', () => {
            component.descp = new ElementRef(document.createElement('p'));
            expect(component.readOnlyDescriptionReady()).toBeTrue();
        });

        it('should return false when descp is not available', () => {
            component.descp = undefined as any;
            expect(component.readOnlyDescriptionReady()).toBeFalse();
        });
    });

    describe('cancelNewSegmentCreation', () => {
        it('should emit cancel action and restore values', () => {
            const emitSpy = spyOn(component.actionEmitter, 'emit');
            component.cancelNewSegmentCreation();

            expect(emitSpy).toHaveBeenCalledWith({ type: 'cancel', payload: component.segment });
        });
    });

    describe('validateNewSegment', () => {
        it('should emit validate action when form is valid', fakeAsync(() => {
            const emitSpy = spyOn(component.actionEmitter, 'emit');
            component.validateNewSegment();
            tick(2100);

            expect(emitSpy).toHaveBeenCalledWith({ type: 'validate', payload: component.segment });
        }));
    });
});
