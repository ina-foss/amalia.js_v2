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
import { FormatUtils } from '../../../core/utils/format-utils';
import { ShortcutEvent } from '../../../core/config/model/shortcuts-event';

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

        it('should apply a selection from the p-autoComplete dropdown (ngModelChange) via the categories signal', () => {
            component.categories.set(['Cat1']);
            component.availableCategories = [];

            component.onCategoriesModelChange(['Cat1', 'Cat2']);

            expect(component.categories()).toEqual(['Cat1', 'Cat2']);
            expect(component.availableCategories).toContain('Cat2');
        });
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

        it('should ignore blur and refocus input when ignoreNextKeywordsBlur is true', fakeAsync(() => {
            (component as any).ignoreNextKeywordsBlur = true;
            const input = document.createElement('input');
            const wrapper = document.createElement('div');
            wrapper.appendChild(input);
            component.keywordsEditWrapper = new ElementRef(wrapper);

            const focusSpy = spyOn(input, 'focus');
            const confirmSpy = spyOn(component, 'confirmKeywordsEdit');

            component.onKeywordsBlur();
            tick();

            expect((component as any).ignoreNextKeywordsBlur).toBeFalse();
            expect(focusSpy).toHaveBeenCalled();
            expect(confirmSpy).not.toHaveBeenCalled();
        }));

        it('should unmute shortcuts and confirm edit on blur when flag is false', fakeAsync(() => {
            (component as any).ignoreNextKeywordsBlur = false;
            component.keywords.set(['Key1']);
            const unmuteSpy = spyOn(component, 'unmuteShortCuts');
            const confirmSpy = spyOn(component, 'confirmKeywordsEdit');
            const updateDisplaySpy = spyOn(component, 'updateCategoriesAndKeywordsDisplay');

            component.onKeywordsBlur();
            tick(20);

            expect(unmuteSpy).toHaveBeenCalled();
            expect(confirmSpy).toHaveBeenCalled();
            expect(updateDisplaySpy).toHaveBeenCalled();
        }));

        it('should apply a selection from the p-autoComplete dropdown (ngModelChange) via the keywords signal', () => {
            component.keywords.set(['Key1']);
            component.availableKeywords = [];

            component.onKeywordsModelChange(['Key1', 'Key2']);

            expect(component.keywords()).toEqual(['Key1', 'Key2']);
            expect(component.availableKeywords).toContain('Key2');
        });
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

    describe('Additional branch coverage', () => {
        it('should validate every timecode boundary and report format errors', () => {
            const snackBarSpy = spyOn(component, 'displaySnackBar');
            component.segment.tcOffset = 5;
            component.segment.data.tcMax = 30;
            component.tcInFormatted = '00:00:10:00';
            component.tcOutFormatted = '00:00:20:00';

            expect(component.tcValidators('tcIn', '00:00:10:00')).toBe('00:00:10:00');
            expect(component.tcValidators('tcIn', '00:00:25:00', true).error).toBeTrue();
            expect(component.tcValidators('tcIn', '00:00:02:00', true).error).toBeTrue();
            component.tcOutFormatted = '00:00:40:00';
            expect(component.tcValidators('tcIn', '00:00:35:00', true).error).toBeTrue();

            component.tcInFormatted = '00:00:10:00';
            expect(component.tcValidators('tcOut', '00:00:05:00', true).error).toBeTrue();
            expect(component.tcValidators('tcOut', '00:00:35:00', true).error).toBeTrue();
            component.segment.tcOffset = 15;
            expect(component.tcValidators('tcOut', '00:00:12:00', true).error).toBeTrue();

            component.segment.tcOffset = 5;
            expect(component.tcValidators('tc', '00:00:20:00')).toBe('00:00:20:00');
            expect(component.tcValidators('tc', '00:00:26:00', true).error).toBeTrue();
            expect(component.tcValidators('tc', 'invalid', true).formatError).toBeTrue();
            expect(snackBarSpy).toHaveBeenCalled();
        });

        it('should handle missing controls and unbounded tcMax', () => {
            component.segment.data.tcMax = 0;
            component.segmentForm = {
                form: {
                    controls: {},
                    valid: false
                }
            } as unknown as NgForm;

            expect(() => component.doCheckTcIn()).not.toThrow();
            expect(() => component.doCheckTcOut()).not.toThrow();
            expect(() => component.doCheckTc()).not.toThrow();
            expect(() => component.resetTcInFormControlErrors()).not.toThrow();
            expect(() => component.resetTcOutFormControlErrors()).not.toThrow();
            expect(component.tcValidators('tc', 'invalid').formatError).toBeTrue();
        });

        it('should cover all post-validation update paths', () => {
            const conversionSpy = spyOn(FormatUtils, 'convertFormattedTcToSeconds');
            const setTcSpy = spyOn(component, 'setTc');
            const resetInSpy = spyOn(component, 'resetTcInFormControlErrors');
            const resetOutSpy = spyOn(component, 'resetTcOutFormControlErrors');

            conversionSpy.and.returnValue(-1);
            component.afterTcInValidation('00:00:01:00');
            component.afterTcOutValidation('00:00:01:00');
            component.afterTcValidation('00:00:01:00');
            expect(setTcSpy).not.toHaveBeenCalled();

            conversionSpy.and.returnValue(12);
            component.afterTcInValidation({ value: '00:00:12:00', error: true });
            expect(component.segment.tcIn).toBe(12);
            expect(resetOutSpy).toHaveBeenCalled();

            component.afterTcOutValidation({ value: '00:00:12:00', error: true });
            expect(component.segment.tcOut).toBe(12);
            expect(resetInSpy).toHaveBeenCalled();

            component.setTcInvoked = false;
            component.segment.tcIn = 4;
            component.afterTcValidation('00:00:12:00');
            expect(component.segment.tcOut).toBe(16);

            component.setTcInvoked = true;
            component.afterTcValidation({ formatError: true });
            expect(component.setTcInvoked).toBeFalse();
        });

        it('should validate category, keyword, title and description subscriptions', fakeAsync(() => {
            const categoriesChanges = new Subject<string>();
            const keywordsChanges = new Subject<string>();
            const titleChanges = new Subject<string>();
            const descriptionChanges = new Subject<string>();
            const categoriesControl = {
                valueChanges: categoriesChanges.asObservable(),
                setErrors: jasmine.createSpy('categoriesSetErrors')
            };
            const keywordsControl = {
                valueChanges: keywordsChanges.asObservable(),
                setErrors: jasmine.createSpy('keywordsSetErrors')
            };
            const titleControl = {
                valueChanges: titleChanges.asObservable(),
                setErrors: jasmine.createSpy('titleSetErrors')
            };
            const descriptionControl = {
                valueChanges: descriptionChanges.asObservable(),
                setErrors: jasmine.createSpy('descriptionSetErrors')
            };
            component.segmentForm = {
                form: {
                    controls: {
                        categories: categoriesControl,
                        keywords: keywordsControl,
                        title: titleControl,
                        description: descriptionControl
                    }
                }
            } as unknown as NgForm;

            (component as any).activateCategoriesEdition();
            (component as any).activateKeywordsEdition();
            (component as any).activateTitleEdition();
            (component as any).activateDescriptionEdition();

            component.categories.set(Array.from({ length: 11 }, (_, index) => `cat-${index}`));
            component.keywords.set(Array.from({ length: 11 }, (_, index) => `keyword-${index}`));
            categoriesChanges.next('');
            keywordsChanges.next('');
            tick(100);
            expect(categoriesControl.setErrors).toHaveBeenCalledWith({ invalid: true });
            expect(keywordsControl.setErrors).toHaveBeenCalledWith({ invalid: true });

            component.categories.set(['cat']);
            component.keywords.set(['keyword']);
            categoriesChanges.next('');
            keywordsChanges.next('');
            tick(100);
            expect(categoriesControl.setErrors).toHaveBeenCalledWith(null);
            expect(keywordsControl.setErrors).toHaveBeenCalledWith(null);

            titleChanges.next('x'.repeat(251));
            titleChanges.next('valid');
            descriptionChanges.next('x'.repeat(1001));
            descriptionChanges.next('valid');
            expect(titleControl.setErrors).toHaveBeenCalledWith({ Error: true });
            expect(titleControl.setErrors).toHaveBeenCalledWith(null);
            expect(descriptionControl.setErrors).toHaveBeenCalledWith({ Error: true });
            expect(descriptionControl.setErrors).toHaveBeenCalledWith(null);
        }));

        it('should compute responsive timecode wrapping in both layouts', () => {
            const tcIn = document.createElement('input');
            const tcOut = document.createElement('input');
            const tc = document.createElement('input');
            const container = document.createElement('div');
            component.tcInInputRef = new ElementRef(tcIn);
            component.tcOutInputRef = new ElementRef(tcOut);
            component.tcInputRef = new ElementRef(tc);
            component.segmentTcRef = new ElementRef(container);

            Object.defineProperty(tcIn, 'scrollWidth', { configurable: true, value: 200 });
            Object.defineProperty(tcIn, 'clientWidth', { configurable: true, value: 100 });
            component.updateTcsDisplay();
            expect(component.editableSegmentTcWrap).toBeTrue();

            Object.defineProperty(tcIn, 'scrollWidth', { configurable: true, value: 50 });
            Object.defineProperty(tcIn, 'clientWidth', { configurable: true, value: 100 });
            Object.defineProperty(container, 'offsetWidth', { configurable: true, value: 1000 });
            spyOn(component, 'calculateTextWidth').and.returnValue(10);
            component.updateTcsDisplay();
            expect(component.editableSegmentTcWrap).toBeFalse();

            Object.defineProperty(container, 'offsetWidth', { configurable: true, value: 20 });
            component.updateTcsDisplay();
            expect(component.editableSegmentTcWrap).toBeTrue();
        });

        it('should truncate overflowing category chips and keep fitting chips visible', () => {
            const host = document.createElement('div');
            const group = document.createElement('div');
            group.className = component.readonlyCategoriesClassName;
            const first = document.createElement('p-chip');
            const second = document.createElement('p-chip');
            const summary = document.createElement('p-chip');
            summary.id = component.hiddenCategoriesSummaryChipId;
            group.append(first, second, summary);
            host.appendChild(group);
            Object.defineProperty(host, 'offsetWidth', { configurable: true, value: 120 });
            Object.defineProperty(first, 'offsetWidth', { configurable: true, value: 80 });
            Object.defineProperty(second, 'offsetWidth', { configurable: true, value: 80 });
            Object.defineProperty(summary, 'offsetWidth', { configurable: true, value: 20 });

            const hidden = (component as any).updateDisplay(
                new ElementRef(host),
                component.readonlyCategoriesClassName,
                component.hiddenCategoriesSummaryChipId
            );

            expect(hidden).toBe(2);
            expect(first.style.display).toBe('none');
            expect(second.style.display).toBe('none');
            expect(summary.style.display).toBe('inline-flex');
        });

        it('should route only annotation shortcuts and cover modifier guards', () => {
            const validateSpy = spyOn(component, 'validateNewSegment');
            const cancelSpy = spyOn(component, 'cancelNewSegmentCreation');
            const baseShortcut = {
                key: 'enter',
                ctrl: false,
                shift: false,
                alt: false,
                meta: false
            };
            const event = (shortcut: Partial<typeof baseShortcut>, targets = ['ANNOTATIONS']): ShortcutEvent => ({
                shortcut: { ...baseShortcut, ...shortcut },
                targets: targets as ShortcutEvent['targets']
            });

            component.segment.data.selected = false;
            component.handleShortcuts(event({}));
            component.segment.data.selected = true;
            component.handleShortcuts(event({}, ['CONTROL_BAR']));
            component.handleShortcuts(event({ key: 'x' }));
            component.handleShortcuts(event({ ctrl: true }));
            component.handleShortcuts(event({ key: 's', ctrl: false }));
            component.handleShortcuts(event({ shift: true }));
            component.handleShortcuts(event({ alt: true }));
            component.handleShortcuts(event({ meta: true }));
            expect(validateSpy).not.toHaveBeenCalled();

            component.handleShortcuts(event({}));
            component.handleShortcuts(event({ key: 's', ctrl: true }));
            expect(validateSpy).toHaveBeenCalledTimes(2);

            component.segment.data.isTitleEditing = true;
            component.handleShortcuts(event({ key: 'escape', ctrl: true }));
            component.handleShortcuts(event({ key: 'escape', shift: true }));
            component.handleShortcuts(event({ key: 'escape', alt: true }));
            component.handleShortcuts(event({ key: 'escape', meta: true }));
            expect(cancelSpy).not.toHaveBeenCalled();

            component.handleShortcuts(event({ key: 'escape' }));
            expect(cancelSpy).toHaveBeenCalled();
        });
    });

    describe('setIsEllipsed', () => {
        it('measures the title once the readonly element is ready', () => {
            const div = document.createElement('div');
            Object.defineProperty(div, 'scrollWidth', { value: 300, configurable: true });
            Object.defineProperty(div, 'clientWidth', { value: 100, configurable: true });
            component.titlediv = new ElementRef(div);

            component.setIsEllipsed();

            expect(component.isEllipsed).toBeTrue();
        });

        it('does nothing when the readonly title element never becomes ready', () => {
            component.titlediv = undefined as any;
            expect(() => component.setIsEllipsed()).not.toThrow();
            expect(component.isEllipsed).toBeFalsy();
        });
    });

    describe('setIsDescriptionTruncated', () => {
        it('measures the description once the readonly element is ready', () => {
            spyOn(window, 'getComputedStyle').and.returnValue({ lineHeight: '20' } as CSSStyleDeclaration);
            const p = document.createElement('p');
            Object.defineProperty(p, 'scrollHeight', { value: 90, configurable: true });
            Object.defineProperty(p, 'clientHeight', { value: 30, configurable: true });
            component.descp = new ElementRef(p);
            const positionSpy = spyOn<any>(component, 'positionToggleSpan');

            component.setIsDescriptionTruncated();

            expect(component.isDescriptionTruncated).toBeTrue();
            expect(positionSpy).toHaveBeenCalled();
        });
    });

    describe('onWindowResizeScheduleUpdates', () => {
        it('batches several synchronous resize events into a single rAF-scheduled update', fakeAsync(() => {
            const categoriesSpy = spyOn(component, 'updateCategoriesAndKeywordsDisplay');
            const tcsSpy = spyOn(component, 'updateTcsDisplay');

            (component as any).onWindowResizeScheduleUpdates();
            (component as any).onWindowResizeScheduleUpdates();
            (component as any).onWindowResizeScheduleUpdates();
            expect(categoriesSpy).not.toHaveBeenCalled();

            tick(20); // let the scheduled requestAnimationFrame callback run
            expect(categoriesSpy).toHaveBeenCalledTimes(1);
            expect(tcsSpy).toHaveBeenCalledTimes(1);

            // A new burst after the frame ran schedules a fresh update.
            (component as any).onWindowResizeScheduleUpdates();
            tick(20);
            expect(categoriesSpy).toHaveBeenCalledTimes(2);
        }));
    });

    describe('getVisibleText', () => {
        // lineHeight/font/margins are pinned via getComputedStyle so maxHeight (3 lines * 20px =
        // 60px) is deterministic across environments/fonts; only the real (browser-rendered) text
        // wrapping within `width` decides whether a given text overflows it.
        const stubComputedStyle = () => spyOn(window, 'getComputedStyle').and.returnValue({
            lineHeight: '20px',
            font: '16px sans-serif',
            marginTop: '0px',
            marginBottom: '0px'
        } as CSSStyleDeclaration);

        it('returns the full text unchanged when it fits within maxHeight', () => {
            stubComputedStyle();
            const el = document.createElement('p');
            Object.defineProperty(el, 'clientWidth', { value: 300, configurable: true });
            document.body.appendChild(el);
            component.segment.description = 'hi';

            const result = component.getVisibleText(el);

            expect(result).toBe('hi...');
            document.body.removeChild(el);
        });

        it('truncates long text and always ends with an ellipsis', () => {
            stubComputedStyle();
            const el = document.createElement('p');
            Object.defineProperty(el, 'clientWidth', { value: 100, configurable: true });
            document.body.appendChild(el);
            component.segment.description = 'word '.repeat(500);

            const result = component.getVisibleText(el);

            expect(result.endsWith('...')).toBeTrue();
            expect(result.length).toBeLessThan(component.segment.description.length);
            document.body.removeChild(el);
        });
    });
});
