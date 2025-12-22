import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { AnnotationPluginComponent, ExportColumnsHeader } from './annotation-plugin.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MediaPlayerService } from '../../service/media-player-service';
import { ThumbnailService } from '../../service/thumbnail-service';
import { FileService } from '../../service/file.service';
import { ChangeDetectorRef } from '@angular/core';
import { ElementRef } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToastComponent } from "../../core/toast/toast.component";
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MediaPlayerElement } from "../../core/media-player-element";
import { DefaultConfigLoader } from "../../core/config/loader/default-config-loader";
import { DefaultConfigConverter } from "../../core/config/converter/default-config-converter";
import { DefaultLogger } from "../../core/logger/default-logger";
import { ConfigurationManager } from "../../core/config/configuration-manager";
import { MetadataManager } from 'src/app/core/metadata/metadata-manager';
import { HttpClient } from '@angular/common/http';
import { DefaultMetadataLoader } from 'src/app/core/metadata/loader/default-metadata-loader';
import { DefaultMetadataConverter } from 'src/app/core/metadata/converter/default-metadata-converter';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SegmentComponent } from './segment/segment.component';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TcFormatPipe } from 'src/app/core/utils/tc-format.pipe';
import { ChipModule } from 'primeng/chip';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AvatarModule } from 'primeng/avatar';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'ng2-tooltip-directive-major-angular-updates';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ChipsModule } from 'primeng/chips';
import { PlayerEventType } from '../../core/constant/event-type';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AnnotationLocalisation } from 'src/app/core/metadata/model/annotation-localisation';
import { ShortcutEvent } from 'src/app/core/config/model/shortcuts-event';
import { AnnotationsService } from 'src/app/service/annotations.service';


const initTestData = (component: AnnotationPluginComponent) => {
    const mediaPlayerElement = new MediaPlayerElement();
    const logger = new DefaultLogger();
    component.logger = logger;
    const loader = new DefaultConfigLoader(new DefaultConfigConverter(), logger);
    mediaPlayerElement.configurationManager = new ConfigurationManager(loader, logger);
    mediaPlayerElement.configurationManager.configData = {
        "tcOffset": 46800,
        "player": {
            "backwardsSrc": "",
            "src": "",
            "autoplay": false,
            "hls": {
                "enable": true,
                "config": {
                    "maxBufferLength": 12,
                    "maxMaxBufferLength": 60,
                    "backBufferLength": 0,
                    "enableWorker": false,
                    "startPosition": 0
                }
            },
            "crossOrigin": "anonymous",
            "media": "VIDEO",
            "ratio": "16:9"
        },
        "thumbnail": {
            "baseUrl": "",
            "enableThumbnail": true,
            "tcParam": "start"
        },
        "dataSources": [
            {
                "url": "/notilusLdd/notilus/search/plugin?pluginName=facesRecognition&format=amalia&clientId=FACES_RECOGNITION-&channel=LCI&startDate=2023-06-01 13:00:00&endDate=2023-06-01 14:00:00",
                "headers": [
                    "Authorization: Bearer ",
                    "Accept: application/x-msgpack"
                ],
                "plugin": "timelines"
            },
            {
                "url": "/notilusLdd/notilus/search/plugin?pluginName=transcriptions&format=amalia-mot&clientId=transcription-vrbs_lma.fre_7.1&channel=LCI&startDate=2023-06-01 13:00:00&endDate=2023-06-01 14:00:00&algoname=vrbs_lma.fre_7.1",
                "headers": [
                    "Authorization: Bearer ",
                    "Accept: application/x-msgpack"
                ],
                "plugin": "transcription-vrbs_lma.fre_7.1"
            },
            {
                "url": "/notilusLdd/notilus/search/plugin?pluginName=transcriptions&format=amalia-mot&clientId=transcription-vrbs_part&channel=LCI&startDate=2023-06-01 13:00:00&endDate=2023-06-01 14:00:00&algoname=vrbs_part",
                "headers": [
                    "Authorization: Bearer ",
                    "Accept: application/x-msgpack"
                ],
                "plugin": "transcription-vrbs_part"
            },
            {
                "url": "/notilusLdd/notilus/search/plugin?pluginName=transcriptions&format=amalia-mot&clientId=transcription-whisper&channel=LCI&startDate=2023-06-01 13:00:00&endDate=2023-06-01 14:00:00&algoname=whisper",
                "headers": [
                    "Authorization: Bearer ",
                    "Accept: application/x-msgpack"
                ],
                "plugin": "transcription-whisper"
            },
            {
                "url": "/notilusLdd/notilus/search/tv-program/days?clientId=DAY_SCHEDULE-&channel=LCI&startDate=2023-06-01 13:00:00&endDate=2023-06-01 14:00:00",
                "headers": [
                    "Authorization: Bearer ",
                    "Accept: application/x-msgpack"
                ],
                "plugin": "timelines"
            },
            {
                "url": "/notilusDossier/segments/flux?channel=LCI&startDate=2023-06-01 13:00:00&endDate=2023-06-01 14:00:00&format=AMALIA&clientId=annotations",
                "headers": [
                    "Authorization: Bearer "
                ],
                "plugin": "annotations"
            }
        ],
        "debug": false,
        "logLevel": "info",
        "pluginsConfiguration": {
            "CONTROL_BAR-PLAYER": {
                "data": [
                    {
                        "label": "Barre de progression",
                        "control": "progressBar",
                        "priority": 1
                    },
                    {
                        "label": "Télécharger",
                        "control": "download",
                        "icon": "download",
                        "zone": 1,
                        "order": 1,
                        "data": {
                            "href": ""
                        },
                        "priority": 3,
                        "key": "d"
                    },
                    {
                        "label": "Playback rate custom steps",
                        "control": "playbackRateCustomSteps"
                    },
                    {
                        "label": "Playback rate steps",
                        "control": "playbackRateSteps"
                    },
                    {
                        "label": "Capture",
                        "control": "download",
                        "icon": "screenshot",
                        "key": "c",
                        "zone": 1,
                        "order": 2,
                        "data": {
                            "tcParam": "start",
                            "href": ""
                        },
                        "priority": 1
                    },
                    {
                        "label": "Playback Rate",
                        "control": "playbackRate",
                        "zone": 1,
                        "priority": 1,
                        "order": 3
                    },
                    {
                        "label": "Aller au début du média",
                        "icon": "backward-start",
                        "control": "backward-start",
                        "zone": 2,
                        "priority": 1,
                        "key": "Shift + ArrowLeft"
                    },
                    {
                        "label": "Retour image par image",
                        "icon": "backward-frame",
                        "control": "backward-frame",
                        "zone": 2,
                        "priority": 1,
                        "key": "ArrowLeft"
                    },
                    {
                        "label": "Retour 5 secondes par 5 secondes",
                        "icon": "backward-5seconds",
                        "control": "backward-5seconds",
                        "zone": 2,
                        "priority": 1,
                        "key": "ArrowLeft"
                    },
                    {
                        "label": "Retour ralenti",
                        "icon": "slow-backward",
                        "control": "slow-backward",
                        "zone": 2,
                        "priority": 1,
                        "key": "Control + Shift + ArrowLeft"
                    },
                    {
                        "label": "Retour rapide",
                        "icon": "backward",
                        "control": "backward",
                        "zone": 2,
                        "priority": 1,
                        "key": "Control + ArrowLeft"
                    },
                    {
                        "label": "Pause / Lire",
                        "control": "playPause",
                        "zone": 2,
                        "priority": 1,
                        "key": "espace"
                    },
                    {
                        "label": "Avance rapide",
                        "icon": "forward",
                        "control": "forward",
                        "zone": 2,
                        "priority": 1,
                        "key": "Control + ArrowRight"
                    },
                    {
                        "label": "Avance ralentie",
                        "icon": "slow-forward",
                        "control": "slow-forward",
                        "zone": 2,
                        "priority": 1,
                        "key": "Control + Shift + ArrowRight"
                    },
                    {
                        "label": "Avance 5 secondes par 5 secondes",
                        "icon": "forward-5seconds",
                        "control": "forward-5seconds",
                        "zone": 2,
                        "priority": 1,
                        "key": "ArrowRight"
                    },
                    {
                        "label": "Avance image par image",
                        "icon": "forward-frame",
                        "control": "forward-frame",
                        "zone": 2,
                        "priority": 1,
                        "key": "ArrowRight"
                    },
                    {
                        "label": "Aller à la fin du média",
                        "icon": "forward-end",
                        "control": "forward-end",
                        "zone": 2,
                        "priority": 1,
                        "key": "Shift + ArrowRight"
                    },
                    {
                        "label": "Désactiver le son",
                        "control": "volume",
                        "zone": 3,
                        "priority": 1,
                        "key": "m",
                        "data": {
                            "channelMergeVolume": false,
                            "channelMergerNode": "",
                            "tracks": [
                                {
                                    "track": 1,
                                    "label": ""
                                }
                            ]
                        }
                    },
                    {
                        "label": "Plein écran",
                        "control": "toggleFullScreen",
                        "icon": "fullscreen",
                        "zone": 3,
                        "priority": 1,
                        "key": "f"
                    },
                    {
                        "label": "Aspect ratio",
                        "control": "aspectRatio",
                        "zone": 3,
                        "priority": 3,
                        "key": "a"
                    },
                    {
                        "label": "Figer",
                        "control": "pinControls",
                        "icon": "pin",
                        "zone": 3,
                        "priority": 1,
                        "order": 1,
                        "key": "g"
                    },
                    {
                        "label": "Afficher les vitesses",
                        "control": "displaySlider",
                        "icon": "slider",
                        "zone": 3,
                        "priority": 2,
                        "order": 1,
                        "key": "v"
                    },
                    {
                        "label": "Plus d'options",
                        "control": "menu",
                        "icon": "dots",
                        "zone": 3,
                        "key": "r"
                    }
                ],
                "pinnedControls": true
            }
        },
        "displaySizes": {
            "large": 900,
            "medium": 700,
            "small": 550,
            "xsmall": 340
        },
        "loadMetadataOnDemand": true
    } as any;
    component.pluginConfiguration = {
        "metadataIds": [
            "annotations"
        ],
        "name": "annotations",
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
                "777UUUU",
                "aaa",
                "aaaaaa",
                "arindam",
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
                "eee",
                "Erreur",
                "fff",
                "france",
                "gggggg",
                "gggtthh",
                "historique",
                "hthjyjujuyjyj",
                "jjjj",
                "jlkjhjlhl",
                "Journée Programme",
                "kjhdjkdzkzd",
                "président",
                "RRRTTT",
                "Segmentation",
                "tactac",
                "télévision",
                "test",
                "thththhj"
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
            "assetId": "flux:tv:LCI:20230601T130000:3600"
        }
    };

    const httpClient = TestBed.inject(HttpClient);
    const metadataLoader = new DefaultMetadataLoader(httpClient, new DefaultMetadataConverter(), logger);
    mediaPlayerElement.metadataManager = new MetadataManager(mediaPlayerElement.configurationManager, metadataLoader, logger);

    component.mediaPlayerElement = mediaPlayerElement;
    const mediaElement = document.createElement('video');
    component.mediaPlayerElement.setMediaPlayer(mediaElement);
    const mediaPlayer = component.mediaPlayerElement.getMediaPlayer();
    mediaPlayer.reverseMode = false;
    return { mediaPlayerElement, httpClient, logger };
}

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
                AnnotationsService,
                { provide: ElementRef, useValue: new ElementRef(null) }
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
            { id: '1', label: 'Segment1', tcIn: 0, tcOut: 10, tc: 10, data: {}, tcOffset: 0 }
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
                    "tcOutParent": 2264,
                    "idDocument": "123",
                    "typeDocument": "SEGMENT",
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
            "Lien de l'imagette": "https://image.wsmedia.sas.ina/thumbs/qNnhN1ISmDe8DBMdODoONH5_X_k9J4W0Z7sqO1JsvUST-DVa82vq-bEt2LmebGISKNUHvCX9sZcePvGoCfle6WyX8kcF6OQIx8H_AuU_Iv2vPY8Lmbv1zlF-7QbYJvKRfEhyuN8NjXlmzqFVVU8cCqIUs1_mtaFimK2TZ-Log7UXSAwKdu_FHYF4nxuGfW5V7GkqVz1AoS_lH9b0WEfO3y9zPexndfEtZju1jTekkx0Xc7s37g5UCKT6_rQycibYIWsVaq28iUf6lzyZ2UBDzwLWbwO-LtXbT-AfJxP2OjBYOy_2dqqPKOiLQ7Az0vFXCzOzYYuDrz8sQop2gxkwUtcWiRQuREGYCn1CTeRGmZKLFrVDLg73e-B_OUUkY-NfMc38K6W9n6aqzYI8Tkmasx_q0zSlBPzp1I3loJLUBr9eZQ3eknZsvWHzGzAn_sC-MlMrMr6FhBcwUQ29-7o7UNRGSS3ykMGFQpVQyK6uZh2A7N11qG_Mo4rhPgUWC6gN8n4bwvP4DOxYNjTtTtHDrAqk6OVoi9FoNooDGicKve2MqbZRszcwj4teR6X88MCgjYTDIjIuqsJxzMpzu3_qIOZAsL4_2NJlvYPKGT7UB6NB9jIlHosH4MY95b6exdCdXkdrcx4HMsOfPFS_Tqwyx06yIcIveMLgP6SjIOG9v_0cZ5rjomlCQ0F6hD5oVlmlwao_cO0w6Z8BYP98c8ZuUb2ygOaXbXOf5FXbQOFJJnDC_Gub4Tcz-OoHWSDmiFMsbiZ_s8lzQI-R0aGYvYs5WPGb08SvhD-9tV-7Mkl6odoqx7gb5f5t8oZGzQSb6pS9ua-mVjZnj36C3jM-R4-Yfbsz_toPL1t708vg5mUrSE5f-QELZluvvVbAipWRa4EOtE8FD6DxHj_ZMJx7QvPgu3JjAJY0fyW42wlDnqNsYxpKhkg9O7Jvo4MnEy6tS02nUv4x0RxFGjJt6abtfEktoKt_g5DpF39_ZHBMfBQDqnxLwna9hkxx8ADi7_NOOBmC/sl_iv/hpog2iFsrU10ltgchPvllg/sl_hm/?width=320&start=0",
            "Id Document": "123",
            "Type Document": "SEGMENT"
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
            { id: '1', label: 'Segment1', tcIn: 0, tcOut: 10, tc: 10, data: {}, tcOffset: 0 }
        ];
        component.downloadSegments();
        expect(fileService.exportToExcel).toHaveBeenCalled();
    });

    it('should export segments to Excel for a stock', () => {
        spyOn(fileService, 'exportToExcel');
        component.assetId = 'stock:FPVDB07032005.01:600:7200';
        component.segmentsInfo.subLocalisations = [
            { id: '1', label: 'Segment1', tcIn: 0, tcOut: 10, tc: 10, data: {}, tcOffset: 0 }
        ];
        component.downloadSegments();
        expect(fileService.exportToExcel).toHaveBeenCalled();
    });
});


describe('AnnotationPluginComponent - Méthodes spécifiques', () => {
    let component: AnnotationPluginComponent;
    let fixture: ComponentFixture<AnnotationPluginComponent>;
    let mediaPlayerElement: MediaPlayerElement;
    let httpClient: HttpClient;
    let logger: DefaultLogger;


    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AnnotationPluginComponent, SegmentComponent, TcFormatPipe],
            providers: [
                ConfirmationService,
                MediaPlayerService,
                ThumbnailService,
                MessageService,
                FileService,
                ChangeDetectorRef,
                AnnotationsService,
                { provide: ElementRef, useValue: new ElementRef(null) }
            ],
            imports: [HttpClientTestingModule, ButtonModule, ToastComponent, FormsModule, TooltipModule,
                ButtonModule,
                InputTextModule,
                FloatLabelModule,
                InputTextareaModule,
                ChipsModule,
                ChipModule,
                CardModule,
                AvatarModule,
                DividerModule,
                ToastModule,
                ConfirmDialogModule,
                ProgressBarModule,
                ProgressSpinnerModule,
                AutoCompleteModule]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AnnotationPluginComponent);
        component = fixture.componentInstance;
        ({ mediaPlayerElement } = initTestData(component));
        component.mediaPlayerElement = mediaPlayerElement;
        fixture.detectChanges();
    });

    it('should call initializeNewSegment and return a segment object', fakeAsync(() => {
        const spyOnMediaPlayerElementReady = spyOn(component, 'mediaPlayerElementReady');
        let mediaPLayerElementReady = false;
        setTimeout(() => {
            mediaPLayerElementReady = true;
        }, 1000);
        spyOnMediaPlayerElementReady.and.callFake(() => {
            return mediaPLayerElementReady;
        });
        const spyOninitSegmentData = spyOn(component, 'initSegmentData');
        const spyOnsetDataLoading = spyOn(component, 'setDataLoading');
        component.initializeNewSegment();
        tick(30000);
        flush();
        expect(spyOninitSegmentData).toHaveBeenCalled();
        expect(spyOnsetDataLoading).toHaveBeenCalled();
    }));

    it('should initialize segment data with initSegmentData', () => {
        const segment = { tcIn: 0, tcOut: 10, data: {} };
        component.initSegmentData();
        expect(segment.data).toBeDefined();
    });

    it('Should handleMetadataLoaded', () => {
        component.mediaPlayerElement = mediaPlayerElement;
        const spyOnparseAnnotation = spyOn(component as any, 'parseAnnotation');
        spyOnparseAnnotation.and.callThrough();
        const spyOnGetAnnotationLocalisations = spyOn(mediaPlayerElement.metadataManager, 'getAnnotationLocalisations');
        spyOnGetAnnotationLocalisations.and.callFake((metadataId: string) => {
            return [
                {
                    "data": {
                        "tcThumbnail": 48600000,
                        "codeChannel": "LCI",
                        "idmChannel": "LCI",
                        "labelChannel": "La Chaîne Info",
                        "displayMode": "readonly"
                    },
                    "tc": 0,
                    "tcIn": 48600,
                    "tcOut": 48600,
                    "id": "00300004tppk",
                    "label": "",
                    "thumb": "data:image/png;base64,JRU5ErkJggg==",
                    "property": []
                },
                {
                    "data": {
                        "tcThumbnail": 48600000,
                        "codeChannel": "LCI",
                        "idmChannel": "LCI",
                        "labelChannel": "La Chaîne Info",
                        "displayMode": "readonly"
                    },
                    "tc": 0,
                    "tcIn": 48600,
                    "tcOut": 48600,
                    "id": "0030002trcfx",
                    "label": "",
                    "thumb": "data:image/png;base64,",
                    "property": []
                },
                {
                    "data": {
                        "tcThumbnail": 47816492,
                        "codeChannel": "LCI",
                        "idmChannel": "LCI",
                        "labelChannel": "La Chaîne Info",
                        "displayMode": "readonly"
                    },
                    "tc": 0,
                    "tcIn": 47816,
                    "tcOut": 47816,
                    "id": "0030005ajj53",
                    "label": "",
                    "thumb": "data:image/jpeg;base64,",
                    "property": []
                },
                {
                    "data": {
                        "tcThumbnail": 46800000,
                        "codeChannel": "LCI",
                        "idmChannel": "LCI",
                        "labelChannel": "La Chaîne Info",
                        "displayMode": "readonly"
                    },
                    "tc": 0,
                    "tcIn": 46800,
                    "tcOut": 46800,
                    "id": "003000ai0qgw",
                    "label": "dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
                    "description": "dsdqfg\ndsvfsfvgdfs\nsdfddgfsg\ndsgngn,\nsdghhsf",
                    "thumb": "data:image/png;base64,",
                    "property": [
                        {
                            "key": "category",
                            "value": "jlkjhjlhl"
                        },
                        {
                            "key": "category",
                            "value": "gggtthh"
                        },
                        {
                            "key": "category",
                            "value": "kjhdjkdzkzd"
                        },
                        {
                            "key": "category",
                            "value": "hthjyjujuyjyj"
                        },
                        {
                            "key": "category",
                            "value": "arindam"
                        },
                        {
                            "key": "category",
                            "value": "thththhj"
                        },
                        {
                            "key": "category",
                            "value": "gggggg"
                        }
                    ]
                },
                {
                    "data": {
                        "tcThumbnail": 46800000,
                        "codeChannel": "LCI",
                        "idmChannel": "LCI",
                        "labelChannel": "La Chaîne Info",
                        "displayMode": "readonly"
                    },
                    "tc": 0,
                    "tcIn": 46800,
                    "tcOut": 46800,
                    "id": "003000zayrxm",
                    "label": "",
                    "thumb": "data:image/png;base64,",
                    "property": []
                },
                {
                    "data": {
                        "tcThumbnail": 46800000,
                        "codeChannel": "LCI",
                        "idmChannel": "LCI",
                        "labelChannel": "La Chaîne Info",
                        "displayMode": "readonly"
                    },
                    "tc": 0,
                    "tcIn": 46800,
                    "tcOut": 46800,
                    "id": "0030016cbws3",
                    "label": "",
                    "thumb": "data:image/png;base64,",
                    "property": []
                },
                {
                    "data": {
                        "tcThumbnail": 48600000,
                        "codeChannel": "LCI",
                        "idmChannel": "LCI",
                        "labelChannel": "La Chaîne Info",
                        "displayMode": "readonly"
                    },
                    "tc": 0,
                    "tcIn": 48600,
                    "tcOut": 48600,
                    "id": "0030019jogtw",
                    "label": "",
                    "thumb": "data:image/png;base64,",
                    "property": []
                },
                {
                    "data": {
                        "tcThumbnail": 47932985,
                        "codeChannel": "LCI",
                        "idmChannel": "LCI",
                        "labelChannel": "La Chaîne Info",
                        "displayMode": "readonly"
                    },
                    "tc": 0,
                    "tcIn": 47932,
                    "tcOut": 47932,
                    "id": "003001m8oxpz",
                    "label": "",
                    "thumb": "data:image/jpeg;base64,",
                    "property": []
                },
                {
                    "data": {
                        "tcThumbnail": 48600000,
                        "codeChannel": "LCI",
                        "idmChannel": "LCI",
                        "labelChannel": "La Chaîne Info",
                        "displayMode": "readonly"
                    },
                    "tc": 0,
                    "tcIn": 48600,
                    "tcOut": 48600,
                    "id": "003001u68ngy",
                    "label": "",
                    "thumb": "data:image/png;base64,",
                    "property": []
                }
            ];
        });

        component.handleMetadataLoaded();

        expect(spyOnparseAnnotation).toHaveBeenCalled();
    });
});



describe('AnnotationPluginComponent ManageSegments', () => {
    let component: AnnotationPluginComponent;
    let fixture: ComponentFixture<AnnotationPluginComponent>;
    let mediaPlayerElement: any;
    let httpClient: HttpClient;
    let logger: DefaultLogger;
    let mediaPlayerService: MediaPlayerService;
    const segmentsInfo: AnnotationLocalisation = {
        "data": {},
        "tc": 0,
        "tcIn": 0,
        "tcOut": 0,
        "subLocalisations": [
            {
                "data": {
                    "tcThumbnail": 46800000,
                    "codeChannel": "LCI",
                    "idmChannel": "LCI",
                    "labelChannel": "La Chaîne Info",
                    "displayMode": "readonly",
                    "media": "VIDEO",
                },
                "tc": 0,
                "tcIn": 46800,
                "tcOut": 46800,
                "id": "003000ai0qgw",
                "label": "dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
                "description": "dsdqfg\ndsvfsfvgdfs\nsdfddgfsg\ndsgngn,\nsdghhsf",
                "thumb": "",
                "property": [
                    {
                        "key": "category",
                        "value": "jlkjhjlhl"
                    },
                    {
                        "key": "category",
                        "value": "gggtthh"
                    },
                    {
                        "key": "category",
                        "value": "kjhdjkdzkzd"
                    },
                    {
                        "key": "category",
                        "value": "hthjyjujuyjyj"
                    },
                    {
                        "key": "category",
                        "value": "arindam"
                    },
                    {
                        "key": "category",
                        "value": "thththhj"
                    },
                    {
                        "key": "category",
                        "value": "gggggg"
                    }
                ]
            },
            {
                "data": {
                    "tcThumbnail": 46800000,
                    "codeChannel": "LCI",
                    "idmChannel": "LCI",
                    "labelChannel": "La Chaîne Info",
                    "displayMode": "readonly",
                    "media": "VIDEO",
                },
                "tc": 0,
                "tcIn": 46800,
                "tcOut": 46800,
                "id": "003000zayrxm",
                "label": "",
                "thumb": "",
                "property": []
            },
            {
                "data": {
                    "tcThumbnail": 46800000,
                    "codeChannel": "LCI",
                    "idmChannel": "LCI",
                    "labelChannel": "La Chaîne Info",
                    "displayMode": "readonly",
                    "media": "VIDEO",
                },
                "tc": 0,
                "tcIn": 46800,
                "tcOut": 46800,
                "id": "0030016cbws3",
                "label": "",
                "thumb": "",
                "property": []
            },
            {
                "data": {
                    "tcThumbnail": 46800000,
                    "codeChannel": "LCI",
                    "idmChannel": "LCI",
                    "labelChannel": "La Chaîne Info",
                    "displayMode": "readonly",
                    "media": "VIDEO",
                },
                "tc": 0,
                "tcIn": 46800,
                "tcOut": 46800,
                "id": "003001y7tygn",
                "label": "",
                "thumb": "",
                "property": []
            },
            {
                "data": {
                    "tcThumbnail": 47816492,
                    "codeChannel": "LCI",
                    "idmChannel": "LCI",
                    "labelChannel": "La Chaîne Info",
                    "displayMode": "readonly",
                    "media": "VIDEO",
                },
                "tc": 0,
                "tcIn": 47816,
                "tcOut": 47816,
                "id": "0030005ajj53",
                "label": "",
                "thumb": "",
                "property": [],
                "description": "I am used in manageSegment tests"
            },
            {
                "data": {
                    "tcThumbnail": 47932985,
                    "codeChannel": "LCI",
                    "idmChannel": "LCI",
                    "labelChannel": "La Chaîne Info",
                    "displayMode": "readonly",
                    "media": "VIDEO",
                },
                "tc": 0,
                "tcIn": 47932,
                "tcOut": 47932,
                "id": "003001m8oxpz",
                "label": "",
                "thumb": "",
                "property": []
            },
            {
                "data": {
                    "tcThumbnail": 48600000,
                    "codeChannel": "LCI",
                    "idmChannel": "LCI",
                    "labelChannel": "La Chaîne Info",
                    "displayMode": "readonly",
                    "media": "VIDEO",
                },
                "tc": 0,
                "tcIn": 48600,
                "tcOut": 48600,
                "id": "00300004tppk",
                "label": "",
                "thumb": "",
                "property": []
            },
            {
                "data": {
                    "tcThumbnail": 48600000,
                    "codeChannel": "LCI",
                    "idmChannel": "LCI",
                    "labelChannel": "La Chaîne Info",
                    "displayMode": "readonly",
                    "media": "VIDEO",
                },
                "tc": 0,
                "tcIn": 48600,
                "tcOut": 48600,
                "id": "0030002trcfx",
                "label": "",
                "thumb": "",
                "property": []
            },
            {
                "data": {
                    "tcThumbnail": 48600000,
                    "codeChannel": "LCI",
                    "idmChannel": "LCI",
                    "labelChannel": "La Chaîne Info",
                    "displayMode": "readonly",
                    "media": "VIDEO",
                },
                "tc": 0,
                "tcIn": 48600,
                "tcOut": 48600,
                "id": "0030019jogtw",
                "label": "",
                "thumb": "",
                "property": []
            },
            {
                "data": {
                    "tcThumbnail": 48600000,
                    "codeChannel": "LCI",
                    "idmChannel": "LCI",
                    "labelChannel": "La Chaîne Info",
                    "displayMode": "readonly",
                    "media": "VIDEO",
                },
                "tc": 0,
                "tcIn": 48600,
                "tcOut": 48600,
                "id": "003001u68ngy",
                "label": "",
                "thumb": "",
                "property": []
            },
            {
                "data": {
                    "tcThumbnail": 48825469,
                    "codeChannel": "LCI",
                    "idmChannel": "LCI",
                    "labelChannel": "La Chaîne Info",
                    "displayMode": "readonly",
                    "media": "VIDEO",
                },
                "tc": 0,
                "tcIn": 48825,
                "tcOut": 48825,
                "id": "003000p4l4un",
                "label": "",
                "thumb": "",
                "property": []
            },
            {
                "data": {
                    "tcThumbnail": 49009398,
                    "codeChannel": "LCI",
                    "idmChannel": "LCI",
                    "labelChannel": "La Chaîne Info",
                    "displayMode": "readonly",
                    "media": "VIDEO",
                },
                "tc": 0,
                "tcIn": 49009,
                "tcOut": 49009,
                "id": "003001s7hvsi",
                "label": "",
                "thumb": "",
                "property": []
            },
            {
                "data": {
                    "tcThumbnail": 49122338,
                    "codeChannel": "LCI",
                    "idmChannel": "LCI",
                    "labelChannel": "La Chaîne Info",
                    "displayMode": "readonly",
                    "media": "VIDEO",
                },
                "tc": 0,
                "tcIn": 49122,
                "tcOut": 49122,
                "id": "003001388lb3",
                "label": "",
                "thumb": "",
                "property": []
            },
            {
                "data": {
                    "tcThumbnail": 49982881,
                    "codeChannel": "LCI",
                    "idmChannel": "LCI",
                    "labelChannel": "La Chaîne Info",
                    "displayMode": "readonly",
                    "media": "VIDEO",
                },
                "tc": 0,
                "tcIn": 49982,
                "tcOut": 49982,
                "id": "003000pgbg2x",
                "label": "",
                "thumb": "",
                "property": []
            }
        ]
    };
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AnnotationPluginComponent, SegmentComponent, TcFormatPipe],
            providers: [
                ConfirmationService,
                MediaPlayerService,
                ThumbnailService,
                MessageService,
                FileService,
                ChangeDetectorRef,
                AnnotationsService,
                { provide: ElementRef, useValue: new ElementRef(null) }
            ],
            imports: [HttpClientTestingModule, ButtonModule, ToastComponent, FormsModule, TooltipModule,
                ButtonModule,
                InputTextModule,
                FloatLabelModule,
                InputTextareaModule,
                ChipsModule,
                ChipModule,
                CardModule,
                AvatarModule,
                DividerModule,
                ToastModule,
                ConfirmDialogModule,
                ProgressBarModule,
                ProgressSpinnerModule,
                AutoCompleteModule,
                BrowserAnimationsModule]
        }).compileComponents();

        fixture = TestBed.createComponent(AnnotationPluginComponent);
        component = fixture.componentInstance;
        ({ mediaPlayerElement } = initTestData(component));
        component.mediaPlayerElement = mediaPlayerElement;
        mediaPlayerService = TestBed.inject(MediaPlayerService);
        mediaPlayerService.players.set('manageSements', mediaPlayerElement);
        component.playerId = 'manageSements';
        component.subscriptionToEventsEmitters = [];
        component.intervalStep = 10;
        const spyOnGetAnnotationLocalisations = spyOn(mediaPlayerElement.metadataManager, 'getAnnotationLocalisations');
        const annotations = structuredClone(segmentsInfo.subLocalisations);
        spyOnGetAnnotationLocalisations.and.callFake((metadataId: string) => {
            return annotations;
        });
        fixture.detectChanges();
    });

    it('should handle validate event in manageSegment', fakeAsync(() => {
        const event: any = {
            type: 'validate',
            payload: { id: '123', data: {} }
        };
        const spyOnEmit = spyOn(mediaPlayerElement.eventEmitter, 'emit');
        const spyOnManageEventResponseStatus = spyOn(component, 'manageEventResponseStatus').and.callThrough();
        const spyOnSaveSegment = spyOn(component, 'saveSegment').and.callThrough();
        const spyOnDisplayEventResponseStatus = spyOn(component, 'displayEventResponseStatus').and.callThrough();
        const spyOnDisplaySnackBar = spyOn(component, 'displaySnackBar').and.callThrough();
        setTimeout(() => {
            event.status = 'success';
            event.responseMessage = 'Segment enregistré.';
        }, 100);
        component.manageSegment(event);
        tick(5000);
        expect(event.payload.updatedSegment).toEqual(component.segmentBeforeEdition);
        expect(spyOnEmit).toHaveBeenCalledWith(PlayerEventType.ANNOTATION_UPDATE, event);
        expect(spyOnManageEventResponseStatus).toHaveBeenCalledWith(event);
        expect(spyOnSaveSegment).toHaveBeenCalledWith(event);
        expect(event.payload.segment.data.selected).toEqual(true);
        expect(event.payload.segment.data.displayMode).toEqual("readonly");
        expect(spyOnDisplayEventResponseStatus).toHaveBeenCalledWith(event);
        expect(spyOnDisplaySnackBar).toHaveBeenCalledWith(event.responseMessage, event.status);
        flush();
    }));
    it('Should handle edit event in manageSegment when no other segment is being edited', () => {
        const segmentToEdit = component.segmentsInfo.subLocalisations.find(segment => segment.id === "0030005ajj53");
        const event: any = {
            type: 'edit',
            payload: segmentToEdit
        };
        //s'assurer qu'auncun segment n'est en cours de modification (edit ou new)
        component.segmentsInfo.subLocalisations.forEach(segment => segment.data.displayMode = "readonly");
        const spyOnEmit = spyOn(mediaPlayerElement.eventEmitter, 'emit');
        const spyOnEditSegment = spyOn(component, 'editSegment').and.callThrough();
        const spyOnunselectAllSegments = spyOn(component, 'unselectAllSegments').and.callThrough();
        component.manageSegment(event);
        expect(spyOnEmit).toHaveBeenCalledWith(PlayerEventType.ANNOTATION_EDITING, event);
        expect(spyOnEditSegment).toHaveBeenCalledWith(event.payload);
        expect(spyOnunselectAllSegments).toHaveBeenCalled();
        expect(segmentToEdit.data.displayMode).toEqual("edit");
        expect(segmentToEdit.data.selected).toEqual(true);
    });
    it('Should handle edit event in manageSegment when other segment is being edited and confirm', fakeAsync(() => {
        const segmentBeingEdited = component.segmentsInfo.subLocalisations.find(segment => segment.id === "00300004tppk");
        component.segmentBeforeEdition = structuredClone(segmentBeingEdited);
        segmentBeingEdited.data.displayMode = "edit";
        const event: any = {
            "type": "edit",
            "payload": segmentBeingEdited
        };

        const segmentToEdit = component.segmentsInfo.subLocalisations.find(segment => segment.id === "003001m8oxpz");
        const newEvent: any = {
            "type": "edit",
            "payload": segmentToEdit
        };
        const spyOnEmit = spyOn(mediaPlayerElement.eventEmitter, 'emit');
        const spyOnEditSegment = spyOn(component, 'editSegment').and.callThrough();
        const spyOncancelNewSegmentEdition = spyOn(component, 'cancelNewSegmentEdition').and.callThrough();
        component.manageSegment(newEvent);
        expect(spyOnEmit).toHaveBeenCalledWith(PlayerEventType.ANNOTATION_EDITING, newEvent);
        expect(spyOnEditSegment).toHaveBeenCalledWith(newEvent.payload);
        tick();
        fixture.changeDetectorRef.detectChanges();
        const spans = fixture.debugElement.queryAll(
            el => el.nativeElement.tagName.toLowerCase() === 'span' &&
                el.nativeElement.classList.contains('p-button-label') &&
                el.nativeElement.textContent.trim() === 'Oui'
        );
        expect(spans.length).toBe(1);
        spans[0].nativeElement.click();
        fixture.changeDetectorRef.detectChanges();
        tick(1000);
        expect(spyOncancelNewSegmentEdition).toHaveBeenCalledWith(event.payload);
        expect(event.payload.data.displayMode).toEqual("readonly");
        expect(newEvent.payload.id).toEqual(component.segmentBeforeEdition.id);
        expect(newEvent.payload.data.displayMode).toEqual("edit");
        expect(event.payload.data.selected).toEqual(false);
        expect(newEvent.payload.data.selected).toEqual(true);
        tick(5000);
        flush();
    }));
    it('Should handle edit event in manageSegment when other segment is being edited and cancel', fakeAsync(() => {
        const segmentBeingEdited = component.segmentsInfo.subLocalisations.find(segment => segment.id === "0030002trcfx");
        component.segmentBeforeEdition = structuredClone(segmentBeingEdited);
        segmentBeingEdited.data.displayMode = "edit";

        const segmentToEdit = component.segmentsInfo.subLocalisations.find(segment => segment.id === "003000ai0qgw");
        const newEvent: any = {
            "type": "edit",
            "payload": segmentToEdit
        };
        const spyOnEmit = spyOn(mediaPlayerElement.eventEmitter, 'emit');
        const spyOnEditSegment = spyOn(component, 'editSegment').and.callThrough();
        component.manageSegment(newEvent);
        expect(spyOnEmit).toHaveBeenCalledWith(PlayerEventType.ANNOTATION_EDITING, newEvent);
        expect(spyOnEditSegment).toHaveBeenCalledWith(newEvent.payload);
        tick();
        fixture.changeDetectorRef.detectChanges();
        const spans = fixture.debugElement.queryAll(
            el => el.nativeElement.tagName.toLowerCase() === 'span' &&
                el.nativeElement.classList.contains('p-button-label') &&
                el.nativeElement.textContent.trim() === 'Non'
        );
        expect(spans.length).toBe(1);
        spans[0].nativeElement.click();
        fixture.changeDetectorRef.detectChanges();
        tick(1000);
        expect(segmentBeingEdited.data.selected).toEqual(true);
        expect(segmentToEdit.data.selected).toEqual(false);
        tick(5000);
        flush();
    }));
    it('should cancel new segment edition', () => {
        const segmentBeingEdited = component.segmentsInfo.subLocalisations.find(segment => segment.id === "003000zayrxm");
        component.segmentBeforeEdition = structuredClone(segmentBeingEdited);
        segmentBeingEdited.description = "I am being Edited!";
        const event: any = {
            "type": "cancel",
            "payload": segmentBeingEdited
        };
        const spyOnEmit = spyOn(mediaPlayerElement.eventEmitter, 'emit').and.callThrough();
        const spyOncancelNewSegmentEdition = spyOn(component, 'cancelNewSegmentEdition').and.callThrough();
        component.manageSegment(event);
        expect(spyOnEmit).toHaveBeenCalledWith(PlayerEventType.ANNOTATION_CANCEL_EDITING, event);

        expect(spyOncancelNewSegmentEdition).toHaveBeenCalled();
        expect(segmentBeingEdited.data.displayMode).toEqual("readonly");
        expect(segmentBeingEdited.description).toEqual(component.segmentBeforeEdition.description);
    });
    it('should clone a segment', fakeAsync(() => {
        const segmentToBeCloned = component.segmentsInfo.subLocalisations.find(segment => segment.id === "003000pgbg2x");
        segmentToBeCloned.label = "I am being cloned!";
        const event: any = {
            "type": "clone",
            "payload": segmentToBeCloned
        };
        let event_of_cloned: any;
        let param: any = { index: component.segmentsInfo.subLocalisations.indexOf(event.payload) + 1, sourceSegment: event.payload };
        const spyOnEmit = spyOn(mediaPlayerElement.eventEmitter, 'emit').and.callThrough();
        const spyOnCloneSegment = spyOn(component as any, 'cloneSegment').and.callThrough();
        const spyOnAddSegmentAtIndex = spyOn(component as any, 'addSegmentAtIndex').and.callThrough();
        const setEvent_of_cloned = (event: any) => {
            event_of_cloned = event;
            param.event = event_of_cloned;
        };
        mediaPlayerElement.eventEmitter.on(PlayerEventType.ANNOTATION_ADD, setEvent_of_cloned);
        setTimeout(() => {
            event_of_cloned.status = 'success';
            event_of_cloned.responseMessage = 'Segment enregistré.';
        }, 100);
        const spyOnManageEventResponseStatus = spyOn(component, 'manageEventResponseStatus').and.callThrough();
        const spyOnDisplayEventResponseStatus = spyOn(component, 'displayEventResponseStatus').and.callThrough();
        const spyOnDisplaySnackBar = spyOn(component, 'displaySnackBar').and.callThrough();
        component.manageSegment(event);
        tick(200);
        expect(spyOnEmit).toHaveBeenCalledWith(PlayerEventType.ANNOTATION_ADD, event_of_cloned);
        expect(spyOnCloneSegment).toHaveBeenCalledWith(event.payload);
        expect(event.payload.data.displayMode).toEqual("readonly");
        expect(spyOnAddSegmentAtIndex).toHaveBeenCalledWith(param);
        expect(event_of_cloned.payload.id).toBeUndefined();
        expect(event_of_cloned.payload.data.displayMode).toEqual("readonly");
        expect(event_of_cloned.payload.data.selected).toEqual(true);
        expect(event_of_cloned.payload.label).toEqual('Copie de I am being cloned!');
        expect(spyOnManageEventResponseStatus).toHaveBeenCalledWith(event_of_cloned);
        expect(spyOnDisplayEventResponseStatus).toHaveBeenCalledWith(event_of_cloned);
        expect(spyOnDisplaySnackBar).toHaveBeenCalledWith(event_of_cloned.responseMessage, event_of_cloned.status);
        tick(5000);
        mediaPlayerElement.eventEmitter.off(PlayerEventType.ANNOTATION_ADD, setEvent_of_cloned);
        flush();
    }));
    it('should remove a segment with confirm', fakeAsync(() => {
        const segmentToBeRemoved = component.segmentsInfo.subLocalisations.find(segment => segment.id === "003001388lb3");
        const event: any = {
            "type": "remove",
            "payload": segmentToBeRemoved
        };
        let event_of_remove: any;
        const setEvent_of_remove = (event: any) => {
            event_of_remove = event;
        };
        mediaPlayerElement.eventEmitter.on(PlayerEventType.ANNOTATION_REMOVE, setEvent_of_remove);
        const spyOnEmit = spyOn(mediaPlayerElement.eventEmitter, 'emit').and.callThrough();
        const spyOnRemoveSegment = spyOn(component, 'removeSegment').and.callThrough();
        const spyOnunselectAllSegments = spyOn(component, 'unselectAllSegments').and.callThrough();
        const spyOnRemoveSegmentFromSegmentsInfo = spyOn(component as any, 'removeSegmentFromSegmentsInfo').and.callThrough();
        const spyOnManageEventResponseStatus = spyOn(component, 'manageEventResponseStatus').and.callThrough();
        const spyOnDisplayEventResponseStatus = spyOn(component, 'displayEventResponseStatus').and.callThrough();
        const spyOnDisplaySnackBar = spyOn(component, 'displaySnackBar').and.callThrough();
        component.manageSegment(event);
        fixture.detectChanges();
        const spans = fixture.debugElement.queryAll(
            el => el.nativeElement.tagName.toLowerCase() === 'span' &&
                el.nativeElement.classList.contains('p-button-label') &&
                el.nativeElement.textContent.trim() === 'Supprimer'
        );
        expect(spans.length).toBe(1);
        spans[0].nativeElement.click();
        setTimeout(() => {
            event_of_remove.status = 'success';
            event_of_remove.responseMessage = 'Le segment a bien été supprimé.';
        }, 100);
        fixture.detectChanges();
        tick(200);
        expect(spyOnRemoveSegment).toHaveBeenCalledWith(event.payload);
        expect(spyOnunselectAllSegments).toHaveBeenCalled();
        expect(spyOnEmit).toHaveBeenCalledWith(PlayerEventType.ANNOTATION_REMOVE, event_of_remove);
        expect(spyOnRemoveSegmentFromSegmentsInfo).toHaveBeenCalledWith(event_of_remove);
        expect(spyOnManageEventResponseStatus).toHaveBeenCalledWith(event_of_remove);
        expect(spyOnDisplayEventResponseStatus).toHaveBeenCalledWith(event_of_remove);
        expect(spyOnDisplaySnackBar).toHaveBeenCalledWith(event_of_remove.responseMessage, event_of_remove.status);
        expect(component.segmentsInfo.subLocalisations.find(segment => segment.id === "003001388lb3")).toBeUndefined();
        tick(5000);
        mediaPlayerElement.eventEmitter.off(PlayerEventType.ANNOTATION_REMOVE, setEvent_of_remove);
        flush();
    }));

    it('should update a thumbnail', fakeAsync(() => {
        const segmentToUpdateThumbnail = component.segmentsInfo.subLocalisations.find(segment => segment.id === "0030019jogtw");
        const event: any = {
            "type": "updatethumbnail",
            "payload": segmentToUpdateThumbnail
        };
        const spyOnEmit = spyOn(mediaPlayerElement.eventEmitter, 'emit').and.callThrough();
        const spyOnUpdateThumbnail = spyOn(component, 'updatethumbnail').and.callThrough();
        const spyOnManageEventResponseStatus = spyOn(component, 'manageEventResponseStatus').and.callThrough();
        const spyOnDisplayEventResponseStatus = spyOn(component, 'displayEventResponseStatus').and.callThrough();
        const spyOnDisplaySnackBar = spyOn(component, 'displaySnackBar').and.callThrough();
        const videoElement = document.createElement('video');
        mediaPlayerElement.setMediaPlayer(videoElement);
        const mediaPlayer = component.mediaPlayerElement.getMediaPlayer();
        const spyOnGetCurrentTime = spyOn(mediaPlayer, 'getCurrentTime').and.returnValue(0);
        const spyOnCaptureImage = spyOn(mediaPlayer, 'captureImage').and.returnValue("updated thumbnail");
        setTimeout(() => {
            event.status = 'success';
            event.responseMessage = 'Le segment a bien été mis à jour.';
        }, 100);
        component.manageSegment(event);
        tick(200);
        expect(spyOnGetCurrentTime).toHaveBeenCalled();
        expect(spyOnCaptureImage).toHaveBeenCalled();
        expect(spyOnEmit).toHaveBeenCalledWith(PlayerEventType.ANNOTATION_UPDATE, event);
        expect(spyOnUpdateThumbnail).toHaveBeenCalledWith(event);
        expect(spyOnManageEventResponseStatus).toHaveBeenCalledWith(event);
        expect(spyOnDisplayEventResponseStatus).toHaveBeenCalledWith(event);
        expect(spyOnDisplaySnackBar).toHaveBeenCalledWith(event.responseMessage, event.status);
        expect(segmentToUpdateThumbnail.thumb).toEqual("updated thumbnail");
        tick(5000);
        flush();
    }));

    it('should play the media', () => {
        const segmentToPlay: AnnotationLocalisation = component.segmentsInfo.subLocalisations.find(segment => segment.id === "003001y7tygn");
        segmentToPlay.data.selected = true;
        fixture.detectChanges();
        const segmentToPlayCard = fixture.debugElement.query(el => el.nativeElement.tagName.toLowerCase() === 'p-card' && el.nativeElement.classList.contains('segment-selected'));
        const playButton = segmentToPlayCard.query(el => el.nativeElement.tagName.toLowerCase() === 'svg' && el.nativeElement.classList.contains('amalia-svg-blue-play-size'));

        const spyOnManageSegment = spyOn(component, 'manageSegment').and.callThrough();
        const spyOnGetDuration = spyOn(component.mediaPlayerElement.getMediaPlayer(), 'getDuration').and.returnValue(600);
        const spyOnSetCurrentTime = spyOn(component.mediaPlayerElement.getMediaPlayer(), 'setCurrentTime');
        const spyOnPlay = spyOn(component.mediaPlayerElement.getMediaPlayer(), 'play');
        playButton.triggerEventHandler('click', null);
        expect(spyOnManageSegment).toHaveBeenCalled();
        expect(spyOnGetDuration).toHaveBeenCalled();
        expect(spyOnSetCurrentTime).toHaveBeenCalledWith(segmentToPlay.tcIn - segmentToPlay.tcOffset);
        expect(spyOnPlay).toHaveBeenCalled();

    });

    it('should init segment data', fakeAsync(() => {
        fixture.detectChanges();
        const button_AjouterUnSegment = fixture.debugElement.query(el => el.nativeElement.tagName.toLowerCase() === 'span'
            && el.nativeElement.classList.contains('p-button-label')
            && el.nativeElement.textContent.trim() === 'Ajouter un segment');
        const spyOnInitializeNewSegment = spyOn(component, 'initializeNewSegment').and.callThrough();
        const spyOnInitSegmentData = spyOn(component, 'initSegmentData').and.callThrough();
        const spyOnAddSegmentToSegmentsInfo = spyOn(component as any, 'addSegmentToSegmentsInfo').and.callThrough();
        let event_add_annotation: any;
        const getEvent = (event: any) => {
            event_add_annotation = event;
        };
        mediaPlayerElement.eventEmitter.on(PlayerEventType.ANNOTATION_ADD, getEvent);
        button_AjouterUnSegment.nativeElement.click();
        setTimeout(() => {
            event_add_annotation.status = 'success';
            event_add_annotation.responseMessage = 'Segment enregistré.';
        }, 100);
        tick(200);
        expect(spyOnInitializeNewSegment).toHaveBeenCalled();
        expect(spyOnInitSegmentData).toHaveBeenCalled();
        expect(spyOnAddSegmentToSegmentsInfo).toHaveBeenCalled();
        tick(5000);
        flush();
    }));

    it('should emit OPEN_NOTILUS_MATERIAL when manageSegment receives openNotilusMaterial', () => {
        // On prend un segment existant des données d'init
        const segmentToOpen = component.segmentsInfo.subLocalisations.find(seg => seg.id === "003000ai0qgw")
            ?? component.segmentsInfo.subLocalisations[0];

        const event: any = {
            type: 'openNotilusMaterial',
            payload: segmentToOpen
        };

        // On espionne l’émission de l’évènement
        const spyOnEmit = spyOn(mediaPlayerElement.eventEmitter, 'emit').and.callThrough();

        // (Optionnel) s'assurer que d'autres méthodes ne sont pas invoquées par erreur
        const spyOnRemove = spyOn(component, 'removeSegment');
        const spyOnEdit = spyOn(component, 'editSegment');

        // Act
        component.manageSegment(event);

        // Assert
        expect(spyOnEmit).toHaveBeenCalledWith(PlayerEventType.OPEN_NOTILUS_MATERIAL, event);
        expect(spyOnRemove).not.toHaveBeenCalled();
        expect(spyOnEdit).not.toHaveBeenCalled;
    });

    it('should call initializeNewSegment on "i" shortcut', () => {
        spyOn(component, 'initializeNewSegment');
        const event: ShortcutEvent = {
            shortcut: { key: 'i', ctrl: false, shift: false, alt: false, meta: false },
            targets: ['ANNOTATIONS']
        };
        component.applyShortcut(event);
        expect(component.initializeNewSegment).toHaveBeenCalled();
    });

    it('should call setTcOut on "o" shortcut', () => {
        spyOn(component, 'setTcOut');
        const event: ShortcutEvent = {
            shortcut: { key: 'o', ctrl: false, shift: false, alt: false, meta: false },
            targets: ['ANNOTATIONS']
        };
        component.applyShortcut(event);
        expect(component.setTcOut).toHaveBeenCalled();
    });

    it('should call downloadSegmentJsonFormat on "Ctrl + d" shortcut', () => {
        spyOn(component, 'downloadSegmentJsonFormat');
        const event: ShortcutEvent = {
            shortcut: { key: 'd', ctrl: true, shift: false, alt: false, meta: false },
            targets: ['ANNOTATIONS']
        };
        component.applyShortcut(event);
        expect(component.downloadSegmentJsonFormat).toHaveBeenCalled();
    });

    it('should not call any method for unrelated shortcut', () => {
        spyOn(component, 'initializeNewSegment');
        spyOn(component, 'setTcOut');
        spyOn(component, 'downloadSegmentJsonFormat');
        const event: ShortcutEvent = {
            shortcut: { key: 'x', ctrl: false, shift: false, alt: false, meta: false },
            targets: ['ANNOTATIONS']
        };
        component.applyShortcut(event);
        expect(component.initializeNewSegment).not.toHaveBeenCalled();
        expect(component.setTcOut).not.toHaveBeenCalled();
        expect(component.downloadSegmentJsonFormat).not.toHaveBeenCalled();
    });

    it('should call applyShortcut if target matches plugin name', () => {
        const event: ShortcutEvent = {
            shortcut: { key: 'i', ctrl: false, shift: false, alt: false, meta: false },
            targets: ['ANNOTATIONS']
        };
        spyOn(component, 'applyShortcut');
        component.handleShortcuts(event);
        expect(component.applyShortcut).toHaveBeenCalledWith(event);
    });

    it('should not call applyShortcut if target does not match plugin name', () => {
        const event: ShortcutEvent = {
            shortcut: { key: 'i', ctrl: false, shift: false, alt: false, meta: false },
            targets: ['CONTROL_BAR']
        };
        spyOn(component, 'applyShortcut');
        component.handleShortcuts(event);
        expect(component.applyShortcut).not.toHaveBeenCalled();
    });
});

