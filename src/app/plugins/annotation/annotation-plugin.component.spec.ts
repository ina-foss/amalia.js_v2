import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AnnotationPluginComponent, ExportColumnsHeader} from './annotation-plugin.component';
import {ConfirmationService, MessageService} from 'primeng/api';
import {MediaPlayerService} from '../../service/media-player-service';
import {ThumbnailService} from '../../service/thumbnail-service';
import {FileService} from '../../service/file.service';
import {ChangeDetectorRef} from '@angular/core';
import {ElementRef} from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {ToastComponent} from "../../core/toast/toast.component";
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {MediaPlayerElement} from "../../core/media-player-element";
import {DefaultConfigLoader} from "../../core/config/loader/default-config-loader";
import {DefaultConfigConverter} from "../../core/config/converter/default-config-converter";
import {DefaultLogger} from "../../core/logger/default-logger";
import {ConfigurationManager} from "../../core/config/configuration-manager";

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
        component.pluginConfiguration = {
            name: "",
            "metadataIds": [
                "annotations"
            ],
            "data": {
                "title": "Annotation",
                "timeFormat": "f",
                "fps": 25,
                "autoScroll": true,
                "parseLevel": 1,
                "withSubLocalisations": true,
                "karaokeTcDelta": 0.25,
                "progressBar": true,
                "mode": 2,
                "label": "Gestion des annotations",
                "key": "Enter",
                "labelSynchro": "Synchronisation des annotations",
                "noSpinner": true,
                "availableCategories": [
                    "bleu",
                    "bleute",
                    "ca",
                    "cat",
                    "cat1",
                    "cat2",
                    "cat3",
                    "cat5",
                    "ddd",
                    "ddddddddddd",
                    "dddddddddddddddd",
                    "dgkgdskhdksqlfjlksjqfgkljdfskdgmdsjmjdsmjhmksjmkhjdfmjjjjjjjjkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",
                    "Erreur",
                    "france",
                    "historique",
                    "Journée Programme",
                    "président",
                    "Segmentation",
                    "télévision",
                    "test"
                ],
                "availableKeywords": [
                    "Accès",
                    "Amenagement",
                    "cat2",
                    "cle",
                    "cle1",
                    "cle2",
                    "cle3",
                    "cle4",
                    "cle5",
                    "cleopatre",
                    "danse",
                    "décès",
                    "héroïque",
                    "noel",
                    "Parking",
                    "politique",
                    "v",
                    "vcle2",
                    "ve"
                ],
                "link": "http://localhost:4201/asset/stock:FPVDB07032005.01:600:7200",
                "assetId": "stock:FPVDB07032005.01:600:7200"
            }
        };
        component.segmentsInfo.subLocalisations = [
            {
                "label": "Soleil levant",
                "data": {
                    "displayMode": "readonly",
                    "selected": true,
                    "tcMax": 2264,
                    "tcThumbnail": 600000,
                    "idmSet": "FPVDB07032005.01",
                    "idWsmedia": "FPVDB07032005.01",
                    "tcInParent": 600,
                    "tcOutParent": 2264
                },
                "tc": 0,
                "tcIn": 600,
                "tcOut": 600,
                "tclevel": 1,
                "tcOffset": 600,
                "thumb": "",
                "id": "0030008sxdwp",
                "property": [
                    {
                        "key": "category",
                        "value": "Journée Programme"
                    },
                    {
                        "key": "category",
                        "value": "président"
                    },
                    {
                        "key": "category",
                        "value": "télévision"
                    },
                    {
                        "key": "category",
                        "value": "historique"
                    },
                    {
                        "key": "keyword",
                        "value": "danse"
                    },
                    {
                        "key": "keyword",
                        "value": "décès"
                    },
                    {
                        "key": "keyword",
                        "value": "Parking"
                    }
                ],
                "description": "\"Impression, soleil levant\" est sans doute le tableau le plus connu de Claude Monet, mais aussi du mouvement impressionniste, puisqu'il est celui qui lui a donné son nom. Peint en 1872-73, il tient une place importante dans l'Histoire de l'Art et recèle de nombreux secrets."
            }
        ];
        component.mediaPlayerElement = new MediaPlayerElement();
        const loader = new DefaultConfigLoader(new DefaultConfigConverter(), new DefaultLogger());
        component.mediaPlayerElement.configurationManager = new ConfigurationManager(loader, new DefaultLogger());
        component.mediaPlayerElement.configurationManager.configData = {
            "tcOffset": 600,
            "player": {
                "backwardsSrc": "",
                "src": "",
                "autoplay": false,
                "crossOrigin": "anonymous",
                "ratio": "4:3"
            },
            "thumbnail": {
                "baseUrl": "https://image.wsmedia.sas.ina/thumbs/qNnhN1ISmDe8DBMdODoONH5_X_k9J4W0Z7sqO1JsvUST-DVa82vq-bEt2LmebGISKNUHvCX9sZcePvGoCfle6WyX8kcF6OQIx8H_AuU_Iv2vPY8Lmbv1zlF-7QbYJvKRfEhyuN8NjXlmzqFVVU8cCqIUs1_mtaFimK2TZ-Log7UXSAwKdu_FHYF4nxuGfW5V7GkqVz1AoS_lH9b0WEfO3y9zPexndfEtZju1jTekkx0Xc7s37g5UCKT6_rQycibYIWsVaq28iUf6lzyZ2UBDzwLWbwO-LtXbT-AfJxP2OjBYOy_2dqqPKOiLQ7Az0vFXCzOzYYuDrz8sQop2gxkwUtcWiRQuREGYCn1CTeRGmZKLFrVDLg73e-B_OUUkY-NfMc38K6W9n6aqzYI8Tkmasx_q0zSlBPzp1I3loJLUBr9eZQ3eknZsvWHzGzAn_sC-MlMrMr6FhBcwUQ29-7o7UNRGSS3ykMGFQpVQyK6uZh2A7N11qG_Mo4rhPgUWC6gN8n4bwvP4DOxYNjTtTtHDrAqk6OVoi9FoNooDGicKve2MqbZRszcwj4teR6X88MCgjYTDIjIuqsJxzMpzu3_qIOZAsL4_2NJlvYPKGT7UB6NB9jIlHosH4MY95b6exdCdXkdrcx4HMsOfPFS_Tqwyx06yIcIveMLgP6SjIOG9v_0cZ5rjomlCQ0F6hD5oVlmlwao_cO0w6Z8BYP98c8ZuUb2ygOaXbXOf5FXbQOFJJnDC_Gub4Tcz-OoHWSDmiFMsbiZ_s8lzQI-R0aGYvYs5WPGb08SvhD-9tV-7Mkl6odoqx7gb5f5t8oZGzQSb6pS9ua-mVjZnj36C3jM-R4-Yfbsz_toPL1t708vg5mUrSE5f-QELZluvvVbAipWRa4EOtE8FD6DxHj_ZMJx7QvPgu3JjAJY0fyW42wlDnqNsYxpKhkg9O7Jvo4MnEy6tS02nUv4x0RxFGjJt6abtfEktoKt_g5DpF39_ZHBMfBQDqnxLwna9hkxx8ADi7_NOOBmC/sl_iv/hpog2iFsrU10ltgchPvllg/sl_hm/?width=320",
                "enableThumbnail": true,
                "tcParam": "start"
            },
            "dataSources": [
                {
                    "url": "/notilusLdd/notilus/search/plugin?pluginName=transcriptions&format=amalia-mot&clientId=transcription-vrbs_part&itemId=FPVDB07032005.01:600:7200&algoname=vrbs_part",
                    "headers": [
                        "Authorization: ",
                        "Accept: application/x-msgpack"
                    ],
                    "plugin": "transcription-vrbs_part"
                },
                {
                    "url": "/notilusDossier/segments/stock?itemBusinessIdentifier=FPVDB07032005.01&tcin=600000&tcout=7200000&format=AMALIA&clientId=annotations",
                    "headers": [
                        "Authorization: "
                    ],
                    "plugin": "annotations"
                }
            ],
            "debug": false,
            "logLevel": "info",
            "displaySizes": {
                "large": 900,
                "medium": 700,
                "small": 550,
                "xsmall": 340
            }
        };
        component.init();
        const expectedJsonData: ExportColumnsHeader[] = [{
            "Lien": "http://localhost:4201/asset/stock:FPVDB07032005.01:600:7200",
            "ID du materiel": "stock:FPVDB07032005.01:600:7200",
            "ID du segment": "0030008sxdwp",
            "Titre": "Soleil levant",
            "TC Debut": "00:10:00:00",
            "TC Fin": "00:10:00:00",
            "Duree": "00:00:00:00",
            "Mots_cles": "danse; décès; Parking",
            "Categories": "Journée Programme; président; télévision; historique",
            "Description": "\"Impression, soleil levant\" est sans doute le tableau le plus connu de Claude Monet, mais aussi du mouvement impressionniste, puisqu'il est celui qui lui a donné son nom. Peint en 1872-73, il tient une place importante dans l'Histoire de l'Art et recèle de nombreux secrets.",
            "Lien de l'imagette": "https://image.wsmedia.sas.ina/thumbs/qNnhN1ISmDe8DBMdODoONH5_X_k9J4W0Z7sqO1JsvUST-DVa82vq-bEt2LmebGISKNUHvCX9sZcePvGoCfle6WyX8kcF6OQIx8H_AuU_Iv2vPY8Lmbv1zlF-7QbYJvKRfEhyuN8NjXlmzqFVVU8cCqIUs1_mtaFimK2TZ-Log7UXSAwKdu_FHYF4nxuGfW5V7GkqVz1AoS_lH9b0WEfO3y9zPexndfEtZju1jTekkx0Xc7s37g5UCKT6_rQycibYIWsVaq28iUf6lzyZ2UBDzwLWbwO-LtXbT-AfJxP2OjBYOy_2dqqPKOiLQ7Az0vFXCzOzYYuDrz8sQop2gxkwUtcWiRQuREGYCn1CTeRGmZKLFrVDLg73e-B_OUUkY-NfMc38K6W9n6aqzYI8Tkmasx_q0zSlBPzp1I3loJLUBr9eZQ3eknZsvWHzGzAn_sC-MlMrMr6FhBcwUQ29-7o7UNRGSS3ykMGFQpVQyK6uZh2A7N11qG_Mo4rhPgUWC6gN8n4bwvP4DOxYNjTtTtHDrAqk6OVoi9FoNooDGicKve2MqbZRszcwj4teR6X88MCgjYTDIjIuqsJxzMpzu3_qIOZAsL4_2NJlvYPKGT7UB6NB9jIlHosH4MY95b6exdCdXkdrcx4HMsOfPFS_Tqwyx06yIcIveMLgP6SjIOG9v_0cZ5rjomlCQ0F6hD5oVlmlwao_cO0w6Z8BYP98c8ZuUb2ygOaXbXOf5FXbQOFJJnDC_Gub4Tcz-OoHWSDmiFMsbiZ_s8lzQI-R0aGYvYs5WPGb08SvhD-9tV-7Mkl6odoqx7gb5f5t8oZGzQSb6pS9ua-mVjZnj36C3jM-R4-Yfbsz_toPL1t708vg5mUrSE5f-QELZluvvVbAipWRa4EOtE8FD6DxHj_ZMJx7QvPgu3JjAJY0fyW42wlDnqNsYxpKhkg9O7Jvo4MnEy6tS02nUv4x0RxFGjJt6abtfEktoKt_g5DpF39_ZHBMfBQDqnxLwna9hkxx8ADi7_NOOBmC/sl_iv/hpog2iFsrU10ltgchPvllg/sl_hm/?width=320&start=0"
        }];
        const jsonData = component.getJsonDataFromAnnotations();
        component.downloadSegmentJsonFormat();
        expect(fileService.downloadFile).toHaveBeenCalled();
        expect(jsonData).toEqual(expectedJsonData);
    });

    it('should export segments to Excel for a flux', () => {
        spyOn(fileService, 'exportToExcel');
        component.assetId = 'flux:tv:LCI:20230601T130000:1800';
        component.segmentsInfo.subLocalisations = [
            {id: '1', label: 'Segment1', tcIn: 0, tcOut: 10, tc: 10, data: {}, tcOffset: 0}
        ];
        component.downloadSegments();
        expect(fileService.exportToExcel).toHaveBeenCalled();
    });

    it('should export segments to Excel for a stock', () => {
        spyOn(fileService, 'exportToExcel');
        component.assetId = 'stock:FPVDB07032005.01:600:7200';
        component.segmentsInfo.subLocalisations = [
            {id: '1', label: 'Segment1', tcIn: 0, tcOut: 10, tc: 10, data: {}, tcOffset: 0}
        ];
        component.downloadSegments();
        expect(fileService.exportToExcel).toHaveBeenCalled();
    });
});
