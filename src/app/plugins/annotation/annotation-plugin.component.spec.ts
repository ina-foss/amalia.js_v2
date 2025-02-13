import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AnnotationPluginComponent} from './annotation-plugin.component';
import {ConfirmationService, MessageService} from 'primeng/api';
import {MediaPlayerService} from '../../service/media-player-service';
import {ThumbnailService} from '../../service/thumbnail-service';
import {FileService} from '../../service/file.service';
import {ChangeDetectorRef} from '@angular/core';
import {ElementRef} from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {ToastComponent} from "../../core/toast/toast.component";
import {ConfirmDialogModule} from 'primeng/confirmdialog';

describe('AnnotationPluginComponent', () => {
    let component: AnnotationPluginComponent;
    let fixture: ComponentFixture<AnnotationPluginComponent>;
    let fileService: FileService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AnnotationPluginComponent],
            providers: [
                ConfirmationService,
                MediaPlayerService,
                ThumbnailService,
                MessageService,
                FileService,
                ChangeDetectorRef,
                {provide: ElementRef, useValue: new ElementRef(null)}
            ],
            imports: [ButtonModule, ToastComponent, ConfirmDialogModule]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AnnotationPluginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        fileService = TestBed.inject(FileService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set annotations info from config', () => {
        component.pluginConfiguration = {
            name: '',
            data: {
                availableCategories: ['Category1', 'Category2'],
                availableKeywords: ['Keyword1', 'Keyword2'],
                timeout: 5000,
                assetId: 'asset123',
                link: 'http://example.com',
                title: '',
                parseLevel: 0,
                withSubLocalisations: false,
                label: '',
                labelSynchro: ''
            }
        };
        component.setAnnotationsInfoFromConfig();
        expect(component.availableCategories).toEqual(['Category1', 'Category2']);
        expect(component.availableKeywords).toEqual(['Keyword1', 'Keyword2']);
        expect(component.timeout).toBe(5000);
        expect(component.assetId).toBe('asset123');
        expect(component.link).toBe('http://example.com');
    });

    it('should download segment JSON format for a flux', () => {
        spyOn(fileService, 'downloadFile');
        component.assetId = 'flux:tv:LCI:20230601T130000:1800';
        component.segmentsInfo.subLocalisations = [
            {id: '1', label: 'Segment1', tcIn: 0, tcOut: 10, tc: 10, data: {}, tcOffset: 0}
        ];
        component.downloadSegmentJsonFormat();
        expect(fileService.downloadFile).toHaveBeenCalled();
    });

    it('should download segment JSON format for a stock', () => {
        spyOn(fileService, 'downloadFile');
        component.assetId = 'stock:FPVDB07032005.01:600:7200';
        component.segmentsInfo.subLocalisations = [
            {id: '1', label: 'Segment1', tcIn: 0, tcOut: 10, tc: 10, data: {}, tcOffset: 0}
        ];
        component.downloadSegmentJsonFormat();
        expect(fileService.downloadFile).toHaveBeenCalled();
    });

    it('should export segments to Excel', () => {
        spyOn(fileService, 'exportToExcel');
        component.assetId = 'flux:tv:LCI:20230601T130000:1800';
        component.segmentsInfo.subLocalisations = [
            {id: '1', label: 'Segment1', tcIn: 0, tcOut: 10, tc: 10, data: {}, tcOffset: 0}
        ];
        component.downloadSegments();
        expect(fileService.exportToExcel).toHaveBeenCalled();
    });

});
