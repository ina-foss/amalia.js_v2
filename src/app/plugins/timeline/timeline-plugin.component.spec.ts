import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { TimelinePluginComponent } from './timeline-plugin.component';
import { MediaPlayerService } from '../../service/media-player-service';
import { TreeNode } from 'primeng/api/treenode';
import { DataType } from "../../core/constant/data-type";
import { CheckboxModule } from "primeng/checkbox";
import { TreeModule } from "primeng/tree";
import { SortablejsDirective } from "../../core/directive/inaSortablejs/sortablejs.directive";
import { CUSTOM_ELEMENTS_SCHEMA, ElementRef } from "@angular/core";
import { DefaultConfigLoader } from 'src/app/core/config/loader/default-config-loader';
import { DefaultConfigConverter } from 'src/app/core/config/converter/default-config-converter';
import { DefaultLogger } from 'src/app/core/logger/default-logger';
import { ConfigurationManager } from 'src/app/core/config/configuration-manager';
import { DefaultMetadataLoader } from 'src/app/core/metadata/loader/default-metadata-loader';
import { DefaultMetadataConverter } from 'src/app/core/metadata/converter/default-metadata-converter';
import { MetadataManager } from 'src/app/core/metadata/metadata-manager';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MediaPlayerElement } from 'src/app/core/media-player-element';
import { TcFormatPipe } from 'src/app/core/utils/tc-format.pipe';
import { ToolbarModule } from 'primeng/toolbar';
import { InputSwitchModule } from 'primeng/inputswitch';
import { AccordionModule } from 'primeng/accordion';
import { DragDropModule } from 'primeng/dragdrop';
import { PreventCtrlScrollDirective } from 'src/app/core/directive/inaSortablejs/prevent-ctrl-scroll.directive';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PlayerConfigData } from 'src/app/core/config/model/player-config-data';
import { MinusIcon } from 'primeng/icons/minus';
import { CheckIcon } from 'primeng/icons/check';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TimelineLocalisation } from 'src/app/core/metadata/model/timeline-localisation';
import { MessagesModule } from 'primeng/messages';
import { ToastComponent } from "../../core/toast/toast.component";
import { PlayerEventType } from 'src/app/core/constant/event-type';
import { MessageService } from 'primeng/api';

describe('TimelinePluginComponent', () => {
    let component: TimelinePluginComponent;
    let fixture: ComponentFixture<TimelinePluginComponent>;

    beforeEach(async () => {

        await TestBed.configureTestingModule({
            declarations: [TimelinePluginComponent, SortablejsDirective],
            providers: [MediaPlayerService, TcFormatPipe, MessageService],
            imports: [CheckboxModule, TreeModule, MinusIcon, CheckIcon, FormsModule, ButtonModule,
                MessagesModule, ToastComponent, NoopAnimationsModule],
            schemas: [
                CUSTOM_ELEMENTS_SCHEMA
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TimelinePluginComponent);
        component = fixture.componentInstance;
        component.playerId = 'playerOne';
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
        expect(component.title).toBeUndefined();
        expect(component.mainBlockColor).toBeUndefined();
        expect(component.mainLocalisations).toBeUndefined();
        expect(component.listOfBlocks).toBeUndefined();
        expect(component.configIsOpen).toBeFalse();
        expect(component.currentTime).toBe(0);
        expect(component.duration).toBe(0);
        expect(component.tcOffset).toBe(0);
        expect(component.focusTcIn).toBe(0);
        expect(component.focusTcOut).toBe(0);
        expect(component.selectionPosition).toEqual({ x: 0, y: 0, startX: 0, startY: 0 });
        expect(component.isDrawingRectangle).toBeFalse();
        expect(component.colors.length).toBeGreaterThan(0);
        expect(component.selectedBlock).toBeNull();
        expect(component.enableZoom).toBeFalse();
        expect(component.nodes).toEqual([]);
        expect(component.selectedNodes().length).toBe(0);
        expect(component.allNodesChecked).toBeFalse();
    });

    it('should toggle config state', () => {
        component.configIsOpen = false;
        component.toggleConfig();
        expect(component.configIsOpen).toBeTrue();

        component.toggleConfig();
        expect(component.configIsOpen).toBeFalse();
    });

    it('should toggle all nodes', () => {
        component.allNodesChecked = false;
        component.nodes = [{ key: '1', label: 'Node 1', children: [] } as TreeNode];
        component.toggleAllNodes();
        expect(component.selectedNodes().length).toBe(1);

        component.allNodesChecked = true;
        component.toggleAllNodes();
        expect(component.selectedNodes().length).toBe(0);
    });
    it('should toggle all blocks state', () => {
        const mainElement = document.createElement('div');
        const stateControl = document.createElement('div');
        const block = document.createElement('div');
        block.classList.add('timeline-block');
        mainElement.appendChild(block);

        component.toggleAllBlocksState(mainElement, stateControl);
        expect(stateControl.classList.contains('close')).toBeTrue();
        expect(block.classList.contains('small')).toBeTrue();

        component.toggleAllBlocksState(mainElement, stateControl);
        expect(stateControl.classList.contains('close')).toBeFalse();
        expect(block.classList.contains('small')).toBeFalse();
    });

    it('should toggle state', () => {
        const mainElement = document.createElement('div');
        mainElement.classList.add('small');

        component.toggleState(mainElement);
        expect(mainElement.classList.contains('small')).toBeFalse();

        component.toggleState(mainElement);
        expect(mainElement.classList.contains('small')).toBeTrue();
    });

    it('should get new child node from metadata element', () => {
        const metadata = { id: 'test-id', label: 'Test Label', viewControl: { color: '#000000' } };
        const childNode = component.getNewChildNodeFromMetadataElement(metadata, metadata.viewControl.color);

        expect(childNode.key).toBe(metadata.id);
        expect(childNode.label).toBe(metadata.label);
        expect(childNode.data.color).toBe(metadata.viewControl.color);
        expect(childNode.checked).toBeTrue();
        expect(childNode.expanded).toBeTrue();
    });

    describe('patchExtraitUtilisateur', () => {
        it('should add default label when metadata items have no label', () => {
            // Arrange
            const metadata = [
                { localisation: [{ label: undefined }] },
                { localisation: [{ label: '' }] },
                { localisation: [{}] }
            ];

            // Act
            component.patchExtraitUtilisateur(metadata);

            // Assert
            expect(metadata[0].localisation[0]['label']).toBe('Extrait sans titre');
            expect(metadata[1].localisation[0]['label']).toBe('Extrait sans titre');
            expect(metadata[2].localisation[0]['label']).toBe('Extrait sans titre');
        });

        it('should not modify existing labels', () => {
            // Arrange
            const metadata = [
                { localisation: [{ label: 'Existing Label' }] },
                { localisation: [{ label: 'Another Label' }] }
            ];

            // Act
            component.patchExtraitUtilisateur(metadata);

            // Assert
            expect(metadata[0].localisation[0].label).toBe('Existing Label');
            expect(metadata[1].localisation[0].label).toBe('Another Label');
        });

        it('should process nested localizations', () => {
            // Arrange
            const metadata = [
                {
                    localisation: [
                        {
                            label: 'Parent',
                            sublocalisations: {
                                localisation: [
                                    { label: undefined },
                                    { label: 'Child with label' }
                                ]
                            }
                        }
                    ]
                }
            ];

            // Act
            component.patchExtraitUtilisateur(metadata);

            // Assert
            expect(metadata[0].localisation[0].label).toBe('Parent');
            expect(metadata[0].localisation[0].sublocalisations.localisation[0].label).toBeUndefined();
            expect(metadata[0].localisation[0].sublocalisations.localisation[1].label).toBe('Child with label');
        });
    });

    it('should handle metadata properties', () => {
        const metadataManager = {
            getTimelineLocalisations: jasmine.createSpy('getTimelineLocalisations').and.returnValue([{
                tcIn: 0,
                tcOut: 10
            }])
        };
        const listOfMetadata = new Map([
            [
                "FACES_RECOGNITION-1739761189Julien Arnaud",
                {
                    "localisation": [
                        {
                            "sublocalisations": {
                                "localisation": [
                                    {
                                        "data": {
                                            "text": [
                                                "Julien Arnaud"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Julien Arnaud",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:00:00.000",
                                        "tcout": "00:00:01.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Julien Arnaud"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Julien Arnaud",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:00:03.000",
                                        "tcout": "00:00:04.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Julien Arnaud"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Julien Arnaud",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:06:37.000",
                                        "tcout": "00:06:46.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Julien Arnaud"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Julien Arnaud",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:07:10.000",
                                        "tcout": "00:07:20.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Julien Arnaud"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Julien Arnaud",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:07:52.000",
                                        "tcout": "00:07:53.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Julien Arnaud"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Julien Arnaud",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:09:29.000",
                                        "tcout": "00:09:30.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Julien Arnaud"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Julien Arnaud",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:09:33.000",
                                        "tcout": "00:09:34.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Julien Arnaud"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Julien Arnaud",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:10:05.000",
                                        "tcout": "00:10:08.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Julien Arnaud"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Julien Arnaud",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:10:44.000",
                                        "tcout": "00:10:46.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Julien Arnaud"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Julien Arnaud",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:11:30.000",
                                        "tcout": "00:11:36.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Julien Arnaud"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Julien Arnaud",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:11:39.000",
                                        "tcout": "00:11:49.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Julien Arnaud"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Julien Arnaud",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:12:32.000",
                                        "tcout": "00:12:33.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Julien Arnaud"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Julien Arnaud",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:12:40.000",
                                        "tcout": "00:12:40.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Julien Arnaud"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Julien Arnaud",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:14:24.000",
                                        "tcout": "00:14:43.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Julien Arnaud"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Julien Arnaud",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:15:17.000",
                                        "tcout": "00:15:19.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Julien Arnaud"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Julien Arnaud",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:17:00.000",
                                        "tcout": "00:17:05.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Julien Arnaud"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Julien Arnaud",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:18:46.000",
                                        "tcout": "00:19:15.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Julien Arnaud"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Julien Arnaud",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:21:26.000",
                                        "tcout": "00:21:27.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Julien Arnaud"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Julien Arnaud",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:22:46.000",
                                        "tcout": "00:22:46.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Julien Arnaud"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Julien Arnaud",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:23:42.000",
                                        "tcout": "00:23:44.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Julien Arnaud"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Julien Arnaud",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:24:16.000",
                                        "tcout": "00:24:18.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Julien Arnaud"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Julien Arnaud",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:27:04.000",
                                        "tcout": "00:27:04.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Julien Arnaud"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Julien Arnaud",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:29:08.000",
                                        "tcout": "00:29:11.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Julien Arnaud"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Julien Arnaud",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:29:13.000",
                                        "tcout": "00:29:15.000",
                                        "tclevel": 1
                                    }
                                ]
                            },
                            "type": "text",
                            "tcin": "00:00:00.000",
                            "tcout": "00:30:01.000",
                            "tclevel": 0
                        }
                    ],
                    "type": "FACES_RECOGNITION-",
                    "label": "Julien Arnaud",
                    "algorithm": "face detection null",
                    "processor": "null null",
                    "processed": 1739761189,
                    "version": 1,
                    "id": "FACES_RECOGNITION-1739761189Julien Arnaud"
                }
            ],
            [
                "FACES_RECOGNITION-1739761189Bernard Lecomte",
                {
                    "localisation": [
                        {
                            "sublocalisations": {
                                "localisation": [
                                    {
                                        "data": {
                                            "text": [
                                                "Bernard Lecomte"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Bernard Lecomte",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:00:00.000",
                                        "tcout": "00:00:04.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Bernard Lecomte"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Bernard Lecomte",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:06:50.000",
                                        "tcout": "00:06:58.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Bernard Lecomte"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Bernard Lecomte",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:08:05.000",
                                        "tcout": "00:08:16.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Bernard Lecomte"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Bernard Lecomte",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:09:23.000",
                                        "tcout": "00:09:34.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Bernard Lecomte"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Bernard Lecomte",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:10:41.000",
                                        "tcout": "00:10:52.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Bernard Lecomte"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Bernard Lecomte",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:11:59.000",
                                        "tcout": "00:12:10.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Bernard Lecomte"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Bernard Lecomte",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:13:17.000",
                                        "tcout": "00:13:28.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Bernard Lecomte"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Bernard Lecomte",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:14:35.000",
                                        "tcout": "00:14:46.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Bernard Lecomte"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Bernard Lecomte",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:15:53.000",
                                        "tcout": "00:16:04.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Bernard Lecomte"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Bernard Lecomte",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:17:11.000",
                                        "tcout": "00:17:22.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Bernard Lecomte"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Bernard Lecomte",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:18:29.000",
                                        "tcout": "00:18:40.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Bernard Lecomte"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Bernard Lecomte",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:19:47.000",
                                        "tcout": "00:19:58.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Bernard Lecomte"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Bernard Lecomte",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:21:05.000",
                                        "tcout": "00:21:16.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Bernard Lecomte"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Bernard Lecomte",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:22:23.000",
                                        "tcout": "00:22:34.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Bernard Lecomte"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Bernard Lecomte",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:23:41.000",
                                        "tcout": "00:23:52.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Bernard Lecomte"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Bernard Lecomte",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:24:59.000",
                                        "tcout": "00:25:10.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Bernard Lecomte"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Bernard Lecomte",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:26:18.000",
                                        "tcout": "00:26:28.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Bernard Lecomte"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Bernard Lecomte",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:27:35.000",
                                        "tcout": "00:27:46.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Bernard Lecomte"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Bernard Lecomte",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:28:53.000",
                                        "tcout": "00:29:04.000",
                                        "tclevel": 1
                                    }
                                ]
                            },
                            "type": "text",
                            "tcin": "00:00:00.000",
                            "tcout": "00:30:01.000",
                            "tclevel": 0
                        }
                    ],
                    "type": "FACES_RECOGNITION-",
                    "label": "Bernard Lecomte",
                    "algorithm": "face detection null",
                    "processor": "null null",
                    "processed": 1739761189,
                    "version": 1,
                    "id": "FACES_RECOGNITION-1739761189Bernard Lecomte"
                }
            ],
            [
                "FACES_RECOGNITION-1739761189Ruth Elkrief",
                {
                    "localisation": [
                        {
                            "sublocalisations": {
                                "localisation": [
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:06:37.000",
                                        "tcout": "00:06:37.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:06:37.000",
                                        "tcout": "00:06:38.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:06:38.000",
                                        "tcout": "00:06:39.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:06:39.000",
                                        "tcout": "00:06:40.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:06:40.000",
                                        "tcout": "00:06:49.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:06:52.000",
                                        "tcout": "00:06:52.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:06:57.000",
                                        "tcout": "00:06:57.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:07:00.000",
                                        "tcout": "00:07:09.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:07:52.000",
                                        "tcout": "00:07:53.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:07:53.000",
                                        "tcout": "00:07:54.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:07:54.000",
                                        "tcout": "00:07:55.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:07:55.000",
                                        "tcout": "00:07:56.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:07:56.000",
                                        "tcout": "00:07:57.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:07:57.000",
                                        "tcout": "00:08:04.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:08:07.000",
                                        "tcout": "00:08:10.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:09:11.000",
                                        "tcout": "00:09:22.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:10:05.000",
                                        "tcout": "00:10:08.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:10:13.000",
                                        "tcout": "00:10:15.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:10:29.000",
                                        "tcout": "00:10:40.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:10:44.000",
                                        "tcout": "00:10:46.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:11:12.000",
                                        "tcout": "00:11:12.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:11:47.000",
                                        "tcout": "00:11:58.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:12:32.000",
                                        "tcout": "00:12:33.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:13:05.000",
                                        "tcout": "00:13:16.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:14:02.000",
                                        "tcout": "00:14:02.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:14:23.000",
                                        "tcout": "00:14:34.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:15:17.000",
                                        "tcout": "00:15:21.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:15:29.000",
                                        "tcout": "00:15:29.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:15:41.000",
                                        "tcout": "00:15:52.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:16:06.000",
                                        "tcout": "00:16:06.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:16:59.000",
                                        "tcout": "00:17:00.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:17:00.000",
                                        "tcout": "00:17:01.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:17:01.000",
                                        "tcout": "00:17:02.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:17:02.000",
                                        "tcout": "00:17:03.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:17:03.000",
                                        "tcout": "00:17:04.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:17:04.000",
                                        "tcout": "00:17:05.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:17:05.000",
                                        "tcout": "00:17:10.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:17:27.000",
                                        "tcout": "00:17:28.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:17:33.000",
                                        "tcout": "00:17:34.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:18:17.000",
                                        "tcout": "00:18:28.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:19:35.000",
                                        "tcout": "00:19:46.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:20:53.000",
                                        "tcout": "00:21:04.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:21:26.000",
                                        "tcout": "00:21:29.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:21:31.000",
                                        "tcout": "00:21:33.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:21:41.000",
                                        "tcout": "00:21:45.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:22:11.000",
                                        "tcout": "00:22:22.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:23:25.000",
                                        "tcout": "00:23:27.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:23:29.000",
                                        "tcout": "00:23:40.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:24:47.000",
                                        "tcout": "00:24:56.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:24:56.000",
                                        "tcout": "00:24:57.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:24:57.000",
                                        "tcout": "00:24:58.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:24:58.000",
                                        "tcout": "00:25:04.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:25:09.000",
                                        "tcout": "00:25:30.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:25:43.000",
                                        "tcout": "00:25:49.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:26:05.000",
                                        "tcout": "00:26:16.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:27:23.000",
                                        "tcout": "00:27:34.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:28:11.000",
                                        "tcout": "00:28:11.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:28:23.000",
                                        "tcout": "00:28:33.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:28:41.000",
                                        "tcout": "00:28:52.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:29:56.000",
                                        "tcout": "00:29:59.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:29:59.000",
                                        "tcout": "00:30:00.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Ruth Elkrief"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Ruth Elkrief",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:30:00.000",
                                        "tcout": "00:30:01.000",
                                        "tclevel": 1
                                    }
                                ]
                            },
                            "type": "text",
                            "tcin": "00:00:00.000",
                            "tcout": "00:30:01.000",
                            "tclevel": 0
                        }
                    ],
                    "type": "FACES_RECOGNITION-",
                    "label": "Ruth Elkrief",
                    "algorithm": "face detection null",
                    "processor": "null null",
                    "processed": 1739761189,
                    "version": 1,
                    "id": "FACES_RECOGNITION-1739761189Ruth Elkrief"
                }
            ],
            [
                "FACES_RECOGNITION-1739761189Joe Biden",
                {
                    "localisation": [
                        {
                            "sublocalisations": {
                                "localisation": [
                                    {
                                        "data": {
                                            "text": [
                                                "Joe Biden"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Joe Biden",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:06:41.000",
                                        "tcout": "00:06:42.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Joe Biden"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Joe Biden",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:07:10.000",
                                        "tcout": "00:07:11.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Joe Biden"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Joe Biden",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:07:13.000",
                                        "tcout": "00:07:13.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Joe Biden"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Joe Biden",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:29:09.000",
                                        "tcout": "00:29:12.000",
                                        "tclevel": 1
                                    }
                                ]
                            },
                            "type": "text",
                            "tcin": "00:00:00.000",
                            "tcout": "00:30:01.000",
                            "tclevel": 0
                        }
                    ],
                    "type": "FACES_RECOGNITION-",
                    "label": "Joe Biden",
                    "algorithm": "face detection null",
                    "processor": "null null",
                    "processed": 1739761189,
                    "version": 1,
                    "id": "FACES_RECOGNITION-1739761189Joe Biden"
                }
            ],
            [
                "FACES_RECOGNITION-1739761189Marie Chantrait",
                {
                    "localisation": [
                        {
                            "sublocalisations": {
                                "localisation": [
                                    {
                                        "data": {
                                            "text": [
                                                "Marie Chantrait"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Marie Chantrait",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:07:01.000",
                                        "tcout": "00:07:12.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Marie Chantrait"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Marie Chantrait",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:08:19.000",
                                        "tcout": "00:08:30.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Marie Chantrait"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Marie Chantrait",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:09:37.000",
                                        "tcout": "00:09:48.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Marie Chantrait"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Marie Chantrait",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:10:55.000",
                                        "tcout": "00:11:06.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Marie Chantrait"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Marie Chantrait",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:12:13.000",
                                        "tcout": "00:12:24.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Marie Chantrait"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Marie Chantrait",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:13:31.000",
                                        "tcout": "00:13:42.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Marie Chantrait"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Marie Chantrait",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:14:49.000",
                                        "tcout": "00:15:00.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Marie Chantrait"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Marie Chantrait",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:16:07.000",
                                        "tcout": "00:16:18.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Marie Chantrait"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Marie Chantrait",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:17:25.000",
                                        "tcout": "00:17:36.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Marie Chantrait"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Marie Chantrait",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:18:43.000",
                                        "tcout": "00:18:54.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Marie Chantrait"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Marie Chantrait",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:20:01.000",
                                        "tcout": "00:20:12.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Marie Chantrait"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Marie Chantrait",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:21:19.000",
                                        "tcout": "00:21:30.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Marie Chantrait"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Marie Chantrait",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:22:37.000",
                                        "tcout": "00:22:48.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Marie Chantrait"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Marie Chantrait",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:23:55.000",
                                        "tcout": "00:24:06.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Marie Chantrait"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Marie Chantrait",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:25:13.000",
                                        "tcout": "00:25:24.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Marie Chantrait"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Marie Chantrait",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:26:31.000",
                                        "tcout": "00:26:42.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Marie Chantrait"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Marie Chantrait",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:27:49.000",
                                        "tcout": "00:28:00.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Marie Chantrait"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Marie Chantrait",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:29:07.000",
                                        "tcout": "00:29:18.000",
                                        "tclevel": 1
                                    }
                                ]
                            },
                            "type": "text",
                            "tcin": "00:00:00.000",
                            "tcout": "00:30:01.000",
                            "tclevel": 0
                        }
                    ],
                    "type": "FACES_RECOGNITION-",
                    "label": "Marie Chantrait",
                    "algorithm": "face detection null",
                    "processor": "null null",
                    "processed": 1739761189,
                    "version": 1,
                    "id": "FACES_RECOGNITION-1739761189Marie Chantrait"
                }
            ],
            [
                "FACES_RECOGNITION-1739761189Alexis Corbière",
                {
                    "localisation": [
                        {
                            "sublocalisations": {
                                "localisation": [
                                    {
                                        "data": {
                                            "text": [
                                                "Alexis Corbière"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Alexis Corbière",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:07:13.000",
                                        "tcout": "00:07:24.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Alexis Corbière"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Alexis Corbière",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:08:31.000",
                                        "tcout": "00:08:42.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Alexis Corbière"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Alexis Corbière",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:09:49.000",
                                        "tcout": "00:10:00.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Alexis Corbière"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Alexis Corbière",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:11:07.000",
                                        "tcout": "00:11:18.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Alexis Corbière"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Alexis Corbière",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:12:25.000",
                                        "tcout": "00:12:36.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Alexis Corbière"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Alexis Corbière",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:13:43.000",
                                        "tcout": "00:13:54.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Alexis Corbière"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Alexis Corbière",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:15:01.000",
                                        "tcout": "00:15:12.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Alexis Corbière"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Alexis Corbière",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:16:19.000",
                                        "tcout": "00:16:30.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Alexis Corbière"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Alexis Corbière",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:17:37.000",
                                        "tcout": "00:17:48.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Alexis Corbière"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Alexis Corbière",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:18:55.000",
                                        "tcout": "00:19:06.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Alexis Corbière"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Alexis Corbière",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:20:13.000",
                                        "tcout": "00:20:24.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Alexis Corbière"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Alexis Corbière",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:21:31.000",
                                        "tcout": "00:21:42.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Alexis Corbière"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Alexis Corbière",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:22:49.000",
                                        "tcout": "00:23:00.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Alexis Corbière"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Alexis Corbière",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:24:07.000",
                                        "tcout": "00:24:18.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Alexis Corbière"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Alexis Corbière",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:25:25.000",
                                        "tcout": "00:25:36.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Alexis Corbière"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Alexis Corbière",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:26:43.000",
                                        "tcout": "00:26:54.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Alexis Corbière"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Alexis Corbière",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:28:01.000",
                                        "tcout": "00:28:12.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Alexis Corbière"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Alexis Corbière",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:29:19.000",
                                        "tcout": "00:29:30.000",
                                        "tclevel": 1
                                    }
                                ]
                            },
                            "type": "text",
                            "tcin": "00:00:00.000",
                            "tcout": "00:30:01.000",
                            "tclevel": 0
                        }
                    ],
                    "type": "FACES_RECOGNITION-",
                    "label": "Alexis Corbière",
                    "algorithm": "face detection null",
                    "processor": "null null",
                    "processed": 1739761189,
                    "version": 1,
                    "id": "FACES_RECOGNITION-1739761189Alexis Corbière"
                }
            ],
            [
                "FACES_RECOGNITION-1739761189Marie-Arlette Carlotti",
                {
                    "localisation": [
                        {
                            "sublocalisations": {
                                "localisation": [
                                    {
                                        "data": {
                                            "text": [
                                                "Marie-Arlette Carlotti"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Marie-Arlette Carlotti",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:07:35.000",
                                        "tcout": "00:07:35.000",
                                        "tclevel": 1
                                    }
                                ]
                            },
                            "type": "text",
                            "tcin": "00:00:00.000",
                            "tcout": "00:30:01.000",
                            "tclevel": 0
                        }
                    ],
                    "type": "FACES_RECOGNITION-",
                    "label": "Marie-Arlette Carlotti",
                    "algorithm": "face detection null",
                    "processor": "null null",
                    "processed": 1739761189,
                    "version": 1,
                    "id": "FACES_RECOGNITION-1739761189Marie-Arlette Carlotti"
                }
            ],
            [
                "FACES_RECOGNITION-1739761189Samuel Ribot",
                {
                    "localisation": [
                        {
                            "sublocalisations": {
                                "localisation": [
                                    {
                                        "data": {
                                            "text": [
                                                "Samuel Ribot"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Samuel Ribot",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:07:40.000",
                                        "tcout": "00:07:50.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Samuel Ribot"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Samuel Ribot",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:08:58.000",
                                        "tcout": "00:09:08.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Samuel Ribot"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Samuel Ribot",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:10:16.000",
                                        "tcout": "00:10:26.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Samuel Ribot"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Samuel Ribot",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:11:34.000",
                                        "tcout": "00:11:44.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Samuel Ribot"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Samuel Ribot",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:12:52.000",
                                        "tcout": "00:13:02.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Samuel Ribot"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Samuel Ribot",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:14:10.000",
                                        "tcout": "00:14:20.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Samuel Ribot"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Samuel Ribot",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:15:28.000",
                                        "tcout": "00:15:38.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Samuel Ribot"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Samuel Ribot",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:16:46.000",
                                        "tcout": "00:16:56.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Samuel Ribot"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Samuel Ribot",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:18:04.000",
                                        "tcout": "00:18:14.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Samuel Ribot"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Samuel Ribot",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:19:22.000",
                                        "tcout": "00:19:32.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Samuel Ribot"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Samuel Ribot",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:20:40.000",
                                        "tcout": "00:20:50.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Samuel Ribot"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Samuel Ribot",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:21:58.000",
                                        "tcout": "00:22:08.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Samuel Ribot"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Samuel Ribot",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:23:16.000",
                                        "tcout": "00:23:26.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Samuel Ribot"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Samuel Ribot",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:24:34.000",
                                        "tcout": "00:24:44.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Samuel Ribot"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Samuel Ribot",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:25:52.000",
                                        "tcout": "00:26:02.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Samuel Ribot"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Samuel Ribot",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:27:10.000",
                                        "tcout": "00:27:20.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Samuel Ribot"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Samuel Ribot",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:28:28.000",
                                        "tcout": "00:28:38.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Samuel Ribot"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Samuel Ribot",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:29:46.000",
                                        "tcout": "00:29:56.000",
                                        "tclevel": 1
                                    }
                                ]
                            },
                            "type": "text",
                            "tcin": "00:00:00.000",
                            "tcout": "00:30:01.000",
                            "tclevel": 0
                        }
                    ],
                    "type": "FACES_RECOGNITION-",
                    "label": "Samuel Ribot",
                    "algorithm": "face detection null",
                    "processor": "null null",
                    "processed": 1739761189,
                    "version": 1,
                    "id": "FACES_RECOGNITION-1739761189Samuel Ribot"
                }
            ],
            [
                "FACES_RECOGNITION-1739761189Stéphane Israël",
                {
                    "localisation": [
                        {
                            "sublocalisations": {
                                "localisation": [
                                    {
                                        "data": {
                                            "text": [
                                                "Stéphane Israël"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Stéphane Israël",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:07:49.000",
                                        "tcout": "00:07:49.000",
                                        "tclevel": 1
                                    }
                                ]
                            },
                            "type": "text",
                            "tcin": "00:00:00.000",
                            "tcout": "00:30:01.000",
                            "tclevel": 0
                        }
                    ],
                    "type": "FACES_RECOGNITION-",
                    "label": "Stéphane Israël",
                    "algorithm": "face detection null",
                    "processor": "null null",
                    "processed": 1739761189,
                    "version": 1,
                    "id": "FACES_RECOGNITION-1739761189Stéphane Israël"
                }
            ],
            [
                "FACES_RECOGNITION-1739761189Emmanuel Macron",
                {
                    "localisation": [
                        {
                            "sublocalisations": {
                                "localisation": [
                                    {
                                        "data": {
                                            "text": [
                                                "Emmanuel Macron"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Emmanuel Macron",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:09:02.000",
                                        "tcout": "00:09:02.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Emmanuel Macron"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Emmanuel Macron",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:09:31.000",
                                        "tcout": "00:09:32.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Emmanuel Macron"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Emmanuel Macron",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:09:59.000",
                                        "tcout": "00:09:59.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Emmanuel Macron"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Emmanuel Macron",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:10:03.000",
                                        "tcout": "00:10:03.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Emmanuel Macron"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Emmanuel Macron",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:12:05.000",
                                        "tcout": "00:12:05.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Emmanuel Macron"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Emmanuel Macron",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:12:34.000",
                                        "tcout": "00:12:34.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Emmanuel Macron"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Emmanuel Macron",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:13:30.000",
                                        "tcout": "00:13:30.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Emmanuel Macron"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Emmanuel Macron",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:13:33.000",
                                        "tcout": "00:13:33.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Emmanuel Macron"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Emmanuel Macron",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:17:31.000",
                                        "tcout": "00:17:32.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Emmanuel Macron"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Emmanuel Macron",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:25:31.000",
                                        "tcout": "00:25:31.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Emmanuel Macron"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Emmanuel Macron",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:29:45.000",
                                        "tcout": "00:29:48.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Emmanuel Macron"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Emmanuel Macron",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:29:50.000",
                                        "tcout": "00:29:54.000",
                                        "tclevel": 1
                                    }
                                ]
                            },
                            "type": "text",
                            "tcin": "00:00:00.000",
                            "tcout": "00:30:01.000",
                            "tclevel": 0
                        }
                    ],
                    "type": "FACES_RECOGNITION-",
                    "label": "Emmanuel Macron",
                    "algorithm": "face detection null",
                    "processor": "null null",
                    "processed": 1739761189,
                    "version": 1,
                    "id": "FACES_RECOGNITION-1739761189Emmanuel Macron"
                }
            ],
            [
                "DAY_SCHEDULE-1739761189Margot Haddad",
                {
                    "localisation": [
                        {
                            "sublocalisations": {
                                "localisation": [
                                    {
                                        "data": {
                                            "text": [
                                                "Margot Haddad"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Margot Haddad",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:19:16.000",
                                        "tcout": "00:19:52.000",
                                        "tclevel": 1
                                    }
                                ]
                            },
                            "type": "text",
                            "tcin": "00:00:00.000",
                            "tcout": "00:30:01.000",
                            "tclevel": 0
                        }
                    ],
                    "type": "DAY_SCHEDULE-",
                    "label": "Margot Haddad",
                    "algorithm": "face detection null",
                    "processor": "null null",
                    "processed": 1739761189,
                    "version": 1,
                    "id": "DAY_SCHEDULE-1739761189Margot Haddad"
                }
            ],
            [
                "SEGMENTATION-1739761189Volodymyr Zelensky",
                {
                    "localisation": [
                        {
                            "sublocalisations": {
                                "localisation": [
                                    {
                                        "data": {
                                            "text": [
                                                "Volodymyr Zelensky"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Volodymyr Zelensky",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:19:53.000",
                                        "tcout": "00:21:25.000",
                                        "tclevel": 1
                                    },
                                    {
                                        "data": {
                                            "text": [
                                                "Volodymyr Zelensky"
                                            ],
                                            "attribute": [
                                                {
                                                    "value": "Volodymyr Zelensky",
                                                    "name": "label",
                                                    "score": 1
                                                }
                                            ]
                                        },
                                        "type": "text",
                                        "tcin": "00:22:19.000",
                                        "tcout": "00:22:23.000",
                                        "tclevel": 1
                                    }
                                ]
                            },
                            "type": "text",
                            "tcin": "00:00:00.000",
                            "tcout": "00:30:01.000",
                            "tclevel": 0
                        }
                    ],
                    "type": "SEGMENTATION-",
                    "label": "Volodymyr Zelensky",
                    "algorithm": "face detection null",
                    "processor": "null null",
                    "processed": 1739761189,
                    "version": 1,
                    "id": "SEGMENTATION-1739761189Volodymyr Zelensky"
                }
            ],
            [
                "EXTRAITS_UTILISATEUR001001kq9t5x",
                {
                    "localisation": [
                        {
                            "sublocalisations": {
                                "localisation": [
                                    {
                                        "data": {
                                            "text": [""],
                                            "attribute": [{
                                                "value": "",
                                                "name": "label",
                                                "score": 1
                                            }
                                            ],
                                        },
                                        "type": "VIDEO",
                                        "tcin": "00:-4:-58:00",
                                        "tcout": "00:05:34:00",
                                        "tclevel": 1
                                    }
                                ]
                            },
                            "type": "VIDEO",
                            "tcin": "00:-4:-58:00",
                            "tcout": "00:05:34:00",
                            "tclevel": 0
                        }
                    ],
                    "type": "EXTRAITS_UTILISATEUR-",
                    "label": "",
                    "algorithm": "null null",
                    "processor": "null null",
                    "processed": 1739761189,
                    "version": 1,
                    "id": "EXTRAITS_UTILISATEUR001001kq9t5x"
                }
            ]

        ]);
        component.nodes = [];
        component.listOfBlocks = [];
        component.pluginConfiguration = {
            name: "",
            "metadataIds": null,
            "data": {
                "title": "Timeline globale",
                "mainBlockColor": null,
                "timeFormat": "s",
                "expendable": true,
                "mainMetadataIds": [],
                "resizeable": true
            }
        }
        component.handleMetadataProperties(listOfMetadata, metadataManager);

        expect(component.listOfBlocks.length).toBe(13);
        expect(component.nodes.length).toBe(1);
        expect(component.selectedNodes().length).toBe(14);
        expect(component.allNodesChecked).toBeTrue();
    });

    it('should get new node from metadata element', () => {
        const metadata = { type: DataType.SEGMENTATION };
        const newNode = component.getNewNodeFromMetadataElement(metadata);

        expect(newNode.key).toBe(metadata.type);
        expect(newNode.label).toBe('Segmentation sonore');
        expect(newNode.icon).toBe('pi pi-fw pi-volume-down');
        expect(newNode.children.length).toBe(0);
        expect(newNode.checked).toBeTrue();
        expect(newNode.expanded).toBeTrue();
    });

    it('should handle display blocks', () => {
        component.listOfBlocks = [
            {
                id: 'block1', displayState: false,
                expendable: false,
                data: []
            },
            {
                id: 'block2', displayState: false,
                expendable: false,
                data: []
            }
        ];
        const node1 = {
            key: 'key',
            label: 'block1',
            children: [],
            checked: true,
            expanded: true
        };
        component.selectedNodes.set([node1]);

        component.handleDisplayBlocks(true);
        expect(component.listOfBlocks[0].displayState).toBeFalse();
        expect(component.listOfBlocks[1].displayState).toBeFalse();

        component.handleDisplayBlocks(false);
        expect(component.selectedNodes().length).toBe(1);
    });


    it('should toggle filter', () => {
        component.filterHidden = false;
        component.toggleFilter();
        expect(component.filterHidden).toBeTrue();

        component.toggleFilter();
        expect(component.filterHidden).toBeFalse();
    });
});

describe('TimelinePluginComponent 2', () => {
    let component: TimelinePluginComponent;
    let fixture: ComponentFixture<TimelinePluginComponent>;
    let spyOngetCurrentTime: jasmine.Spy;
    let spyOngetDuration: jasmine.Spy;

    const timeline_metadata_url = "http://localhost/metadata/timelineListOfMetaData.json";
    const timeline_metadata_Model = require("tests/assets/metadata/timelineListOfMetaData.json");
    let httpTestingController: HttpTestingController;
    let mediaPlayerElement: MediaPlayerElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TimelinePluginComponent, SortablejsDirective, TcFormatPipe, PreventCtrlScrollDirective],
            providers: [MediaPlayerService, MessageService],
            imports: [BrowserAnimationsModule, CheckboxModule, TreeModule, HttpClientTestingModule, ToolbarModule, InputSwitchModule, AccordionModule, DragDropModule,
                MinusIcon, CheckIcon, FormsModule, ButtonModule, MessagesModule, ToastComponent],
            schemas: [
                CUSTOM_ELEMENTS_SCHEMA
            ]
        }).compileComponents();
    });


    beforeEach(() => {
        fixture = TestBed.createComponent(TimelinePluginComponent);
        component = fixture.componentInstance;
        component.playerId = 'playerOne';
        const playerService = TestBed.inject(MediaPlayerService);
        mediaPlayerElement = playerService.get(component.playerId);
        const logger = new DefaultLogger();
        const loader = new DefaultConfigLoader(new DefaultConfigConverter(), logger);
        const httpClient: HttpClient = TestBed.inject(HttpClient);
        mediaPlayerElement.configurationManager = new ConfigurationManager(loader, logger);
        mediaPlayerElement.configurationManager.configData = {
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
                    "url": "http://localhost/metadata/timelineListOfMetaData.json",
                    "headers": [
                        "Authorization: "
                    ],
                    "plugin": "timeline"
                }
            ],
            loadMetadataOnDemand: true,
            "debug": false,
            "logLevel": "info",
            "displaySizes": {
                "large": 900,
                "medium": 700,
                "small": 550,
                "xsmall": 340
            }
        };
        const metadataLoader = new DefaultMetadataLoader(httpClient, new DefaultMetadataConverter(), logger);
        mediaPlayerElement.metadataManager = new MetadataManager(mediaPlayerElement.configurationManager, metadataLoader, logger);
        const obj = document.createElement('video');
        mediaPlayerElement.setMediaPlayer(obj);
        httpTestingController = TestBed.inject(HttpTestingController);
        spyOngetDuration = spyOn(mediaPlayerElement.getMediaPlayer(), 'getDuration').and.returnValue(1800);
    });

    it('Should call init, handleMetaDataLoaded and handleOnDurationChange', fakeAsync(() => {
        const spyOnInit = spyOn(component, 'init').and.callThrough();
        const spyOnHandleMetaDataLoaded = spyOn(component, 'parseTimelineMetadata').and.callThrough();

        mediaPlayerElement.metadataManager.init().then(() => {
            fixture.detectChanges();
            tick(35000);
            flush();
        });
        httpTestingController.expectOne(timeline_metadata_url).flush(timeline_metadata_Model, {
            status: 200,
            statusText: 'Ok'
        });

        tick(30000);
        flush();
        expect(spyOnInit).toHaveBeenCalled();
        expect(spyOnHandleMetaDataLoaded).toHaveBeenCalled();
    }));
    it('Should manage onDragStart and onDrop', fakeAsync(() => {
        fixture.detectChanges();
        tick(35000);
        flush();
        component.onDragStart(0);
        expect(component.startIndex).toEqual(0);
        component.onDrop(0);
        tick(30000);
        flush();
    }));
    it('Should handle refreshTimeCursor', () => {
        fixture.detectChanges();
        component.currentTime = 600;
        component.duration = 1800;
        component.refreshTimeCursor();
    });
    it('Should handle unZoom', () => {
        fixture.detectChanges();
        component.unZoom();
        const container: HTMLElement = component.focusContainer.nativeElement;
        container.style.left = `0`;
        container.style.width = `100%`;
        expect(container.style.left).toEqual('0px');
        expect(container.style.width).toEqual('100%');
    });
    it('Should updateMouseEvent', () => {
        fixture.detectChanges();
        component.updateMouseEvent({ clientX: `200px`, clientY: `200px` });
        component.handleMouseMoveToDrawRect({ clientX: `200px`, clientY: `200px` });
    });
    it('Should handleMouseEnterOnTc', fakeAsync(() => {
        const spyOnHandleMouseEnterOnTc = spyOn(component, 'handleMouseEnterOnTc').and.callThrough();
        const spyOnHandleMouseLeaveOnTc = spyOn(component, 'handleMouseLeaveOnTc').and.callThrough();
        const spyOnRefreshTimeCursor = spyOn(component, 'refreshTimeCursor').and.callThrough();
        const spyOnUpdateTimeCodePosition = spyOn(component, 'updateTimeCodePosition').and.callThrough();
        spyOngetCurrentTime = spyOn(mediaPlayerElement.getMediaPlayer(), 'getCurrentTime').and.returnValue(0);
        mediaPlayerElement.metadataManager.init().then(() => {
            component.currentTime = 600;
            component.duration = 1800;
            fixture.detectChanges();
            tick(35000);
            flush();

            fixture.changeDetectorRef.detectChanges();
            tick(35000);
            flush();
            expect(spyOnRefreshTimeCursor).toHaveBeenCalled();
            expect(spyOnUpdateTimeCodePosition).toHaveBeenCalled();
            const listOfBlocks = component.listOfBlocks;
            const loc = listOfBlocks[0].data[0];
            const mouseEnterEvent = new MouseEvent('mouseenter', { clientX: 200, clientY: 200 });
            const target = component.listOfBlocksContainer.nativeElement.querySelector('.segment');
            target.dispatchEvent(mouseEnterEvent);

            expect(spyOngetCurrentTime).toHaveBeenCalled();
            expect(spyOngetDuration).toHaveBeenCalled();
            expect(component.selectedBlockElement.nativeElement.style.display).toEqual('block');
            expect(component.selectedBlock).toEqual(loc);
            expect(spyOnHandleMouseEnterOnTc).toHaveBeenCalled();

            const mouseLeaveEvent = new MouseEvent('mouseleave', { clientX: 200, clientY: 200 });
            target.dispatchEvent(mouseLeaveEvent);
            expect(component.selectedBlockElement.nativeElement.style.display).toEqual('none');
            expect(component.selectedBlock).toEqual(null);
            expect(spyOnHandleMouseLeaveOnTc).toHaveBeenCalled();
        });
        httpTestingController.expectOne(timeline_metadata_url).flush(timeline_metadata_Model, {
            status: 200,
            statusText: 'Ok'
        });
        tick(35000);
        flush();
    }));
    it('Should manage callSeek', () => {
        const srcMedia = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
        const backSrc = 'http://test-streams.mu.dev/9898.m3u8';
        const config: PlayerConfigData = {
            autoplay: false, crossOrigin: null, data: null, defaultVolume: 0, duration: null, poster: '', src: srcMedia,
            backwardsSrc: backSrc, hls: { enable: true }
        };
        mediaPlayerElement.getMediaPlayer().setSrc(config);
        spyOngetCurrentTime = spyOn(mediaPlayerElement.getMediaPlayer(), 'getCurrentTime').and.callThrough();
        fixture.detectChanges();
        component.callSeek(700);//tcOffset=600
        expect(component.mediaPlayerElement.getMediaPlayer().getCurrentTime()).toEqual(700);
    });
    it('Should removeBlock', fakeAsync(() => {
        spyOngetCurrentTime = spyOn(mediaPlayerElement.getMediaPlayer(), 'getCurrentTime').and.returnValue(0);
        mediaPlayerElement.metadataManager.init().then(() => {
            fixture.detectChanges();
            tick(35000);
            flush();
            fixture.changeDetectorRef.detectChanges();
            const mouseEnterEvent = new MouseEvent('mouseenter', { clientX: 200, clientY: 200 });
            const target = component.listOfBlocksContainer.nativeElement.querySelector('.p-accordion-header');
            target.dispatchEvent(mouseEnterEvent);
            const removeButton: HTMLElement = target.querySelector('p-button');
            removeButton.click();
            expect(component.listOfBlocks[0].displayState).toEqual(false);

        });
        httpTestingController.expectOne(timeline_metadata_url).flush(timeline_metadata_Model, {
            status: 200,
            statusText: 'Ok'
        });
        tick(30000);
        flush();
    }));


    it('should update the element\'s position correctly', function () {

        const target = document.createElement('div');
        target.setAttribute('data-x', '0');
        target.setAttribute('data-y', '0');
        target.style.left = '0%';
        document.body.appendChild(target);

        const event = {
            target: target,
            dx: 50,
            dy: 0
        };
        component.dragElement(event);

        const x = parseFloat(target.getAttribute('data-x'));
        const y = parseFloat(target.getAttribute('data-y'));

        expect(x).toBe(50);
        expect(y).toBe(0);

        document.body.removeChild(target);

    });


    it('should update the element\'s position and size correctly', function () {

        const target = document.createElement('div');

        target.setAttribute('data-x', '0');
        target.setAttribute('data-y', '0');
        target.style.left = '0%';
        target.style.width = '0%';
        document.body.appendChild(target);

        const event = {
            target: target,
            deltaRect: { left: 50 },
            rect: { width: 200 }
        };
        component.moveElement(event);

        const x = parseFloat(target.getAttribute('data-x'));
        const y = parseFloat(target.getAttribute('data-y'));

        expect(x).toBe(50);
        expect(y).toBe(0);

        document.body.removeChild(target);

    });
    it('Should updateTreeComponent', fakeAsync(() => {
        spyOngetCurrentTime = spyOn(mediaPlayerElement.getMediaPlayer(), 'getCurrentTime').and.returnValue(0);
        mediaPlayerElement.metadataManager.init().then(() => {
            component.currentTime = 600;
            component.duration = 1800;
            fixture.detectChanges();
            tick(35000);
            flush();
            component.updateTreeComponent();
            expect(component.allNodesChecked).toBe(true);
            expect(component.indeterminate).toBe(false);
        });
        httpTestingController.expectOne(timeline_metadata_url).flush(timeline_metadata_Model, {
            status: 200,
            statusText: 'Ok'
        });
        tick(30000);
        flush();
    }));
    it('Should closeMenu', fakeAsync(() => {
        spyOngetCurrentTime = spyOn(mediaPlayerElement.getMediaPlayer(), 'getCurrentTime').and.returnValue(0);
        const spyOnCloseMenu = spyOn(component, 'closeMenu').and.callThrough();
        mediaPlayerElement.metadataManager.init().then(() => {
            component.currentTime = 600;
            component.duration = 1800;
            fixture.detectChanges();
            tick(35000);
            flush();
            fixture.changeDetectorRef.detectChanges();
            const mouseEnterEvent = new MouseEvent('mouseenter', { clientX: 200, clientY: 200 });
            const target = component.listOfBlocksContainer.nativeElement.querySelector('.p-accordion-header');
            target.dispatchEvent(mouseEnterEvent);
            const removeButton: HTMLElement = target.querySelector('p-button');
            component.toggleConfig();
            removeButton.click();
            tick(35000);
            flush();
            expect(spyOnCloseMenu).toHaveBeenCalled();
        });
        httpTestingController.expectOne(timeline_metadata_url).flush(timeline_metadata_Model, {
            status: 200,
            statusText: 'Ok'
        });
        tick(30000);
        flush();
    }));

    it('devrait positionner correctement les éléments et ajuster le translateX', fakeAsync(() => {
        const middle = document.createElement('span');
        const start = document.createElement('span');
        const end = document.createElement('span');
        const container = document.createElement('div');

        const startRect = { width: 50 } as DOMRect;
        const endRect = { width: 60 } as DOMRect;
        const focusRect = { left: 100, right: 400 } as DOMRect;

        // Mock de mainBlockContainer
        component.mainBlockContainer = {
            nativeElement: {
                getBoundingClientRect: () => ({
                    left: 0,
                    right: 500
                })
            }
        } as ElementRef;

        spyOn(container, 'getBoundingClientRect').and.returnValues(
            {
                left: 150, right: 350,
                height: 0,
                width: 0,
                x: 0,
                y: 0,
                bottom: 0,
                top: 0,
                toJSON: function () {
                    //not implemented;
                }
            }, // 1er setTimeout
            {
                left: -20,
                right: 600,
                height: 0,
                width: 0,
                x: 0,
                y: 0,
                bottom: 0,
                top: 0,
                toJSON: function () {
                    //not implemented;
                }
            }  // 2e setTimeout
        );

        component.displayDashInTimeCode(middle, startRect, container, endRect, start, end, focusRect);

        // Avance le temps pour le 1er setTimeout
        tick(100);

        expect(container.style.transform).toBe('translateX(0px)');

        // Avance le temps pour le 2e setTimeout
        tick(100);

        // Vérifie que le translateX a été ajusté à cause du débordement à gauche
        expect(container.style.transform).toBe('translateX(-100px)');
    }));

    it('should position the selected block and apply transform if needed', fakeAsync(() => {
        const mockEvent = {
            target: document.createElement('div')
        } as unknown as MouseEvent;

        const mockLocalisation = { id: 1 } as unknown as TimelineLocalisation;

        const selectedBlockElement = document.createElement('div');
        const listOfBlocksContainer = document.createElement('div');

        // Simuler les dimensions
        spyOn(mockEvent.target as any, 'getBoundingClientRect').and.returnValue({
            left: 100,
            top: 200,
            right: 200,
            bottom: 250,
            width: 100,
            height: 50,
            x: 100,
            y: 200,
            toJSON: () => { }
        });

        spyOn(selectedBlockElement, 'getBoundingClientRect').and.returnValue({
            left: 90,
            right: 310,
            top: 200,
            bottom: 300,
            width: 220,
            height: 100,
            x: 90,
            y: 200,
            toJSON: () => { }
        });

        spyOn(listOfBlocksContainer, 'getBoundingClientRect').and.returnValue({
            left: 100,
            right: 300,
            top: 0,
            bottom: 280,
            width: 200,
            height: 280,
            x: 100,
            y: 0,
            toJSON: () => { }
        });

        component.selectedBlockElement = new ElementRef(selectedBlockElement);
        component.listOfBlocksContainer = new ElementRef(listOfBlocksContainer);

        component.handleMouseEnterOnTc(mockEvent, mockLocalisation);

        expect(selectedBlockElement.style.left).toBe('100px');
        expect(selectedBlockElement.style.top).toBe('220px');
        expect(selectedBlockElement.style.bottom).toBe('auto');
        expect(selectedBlockElement.style.display).toBe('block');
        expect(selectedBlockElement.style.transform).toBe('none');
        expect(component.selectedBlock).toBe(mockLocalisation);

        tick(10); // avancer le temps pour exécuter setTimeout

        // Vérifie que le transform a été mis à jour
        expect(selectedBlockElement.style.transform).toContain('translateX');
        expect(selectedBlockElement.style.bottom).toBe('auto');
        expect(selectedBlockElement.style.top).toBe('220px');
    }));

    it('should not apply transform if the selected block is fully within the container', fakeAsync(() => {
        const mockEvent = {
            target: document.createElement('div')
        } as unknown as MouseEvent;

        const mockLocalisation = { id: 2 } as unknown as TimelineLocalisation;

        const selectedBlockElement = document.createElement('div');
        const listOfBlocksContainer = document.createElement('div');

        spyOn(mockEvent.target as any, 'getBoundingClientRect').and.returnValue({
            left: 100,
            top: 100,
            right: 200,
            bottom: 150,
            width: 100,
            height: 50,
            x: 100,
            y: 100,
            toJSON: () => { }
        });

        spyOn(selectedBlockElement, 'getBoundingClientRect').and.returnValue({
            left: 100,
            right: 200,
            top: 120,
            bottom: 170,
            width: 100,
            height: 50,
            x: 100,
            y: 120,
            toJSON: () => { }
        });

        spyOn(listOfBlocksContainer, 'getBoundingClientRect').and.returnValue({
            left: 90,
            right: 210,
            top: 0,
            bottom: 300,
            width: 120,
            height: 300,
            x: 90,
            y: 0,
            toJSON: () => { }
        });

        component.selectedBlockElement = new ElementRef(selectedBlockElement);
        component.listOfBlocksContainer = new ElementRef(listOfBlocksContainer);

        component.handleMouseEnterOnTc(mockEvent, mockLocalisation);
        tick(10);

        expect(selectedBlockElement.style.transform).toBe('none');
    }));
    it('should apply positive translateX if selected block overflows to the left', fakeAsync(() => {
        const mockEvent = {
            target: document.createElement('div')
        } as unknown as MouseEvent;

        const mockLocalisation = { id: 3 } as unknown as TimelineLocalisation;

        const selectedBlockElement = document.createElement('div');
        const listOfBlocksContainer = document.createElement('div');

        spyOn(mockEvent.target as any, 'getBoundingClientRect').and.returnValue({
            left: 100,
            top: 100,
            right: 200,
            bottom: 150,
            width: 100,
            height: 50,
            x: 100,
            y: 100,
            toJSON: () => { }
        });

        spyOn(selectedBlockElement, 'getBoundingClientRect').and.returnValue({
            left: 80,
            right: 180,
            top: 120,
            bottom: 170,
            width: 100,
            height: 50,
            x: 80,
            y: 120,
            toJSON: () => { }
        });

        spyOn(listOfBlocksContainer, 'getBoundingClientRect').and.returnValue({
            left: 100,
            right: 300,
            top: 0,
            bottom: 300,
            width: 200,
            height: 300,
            x: 100,
            y: 0,
            toJSON: () => { }
        });

        component.selectedBlockElement = new ElementRef(selectedBlockElement);
        component.listOfBlocksContainer = new ElementRef(listOfBlocksContainer);

        component.handleMouseEnterOnTc(mockEvent, mockLocalisation);
        tick(10);

        expect(selectedBlockElement.style.transform).toBe('translateX(20px)');
    }));

    it('should adjust bottom and reset top if selected block overflows below container', fakeAsync(() => {
        const mockEvent = {
            target: document.createElement('div')
        } as unknown as MouseEvent;

        const mockLocalisation = { id: 4 } as unknown as TimelineLocalisation;

        const selectedBlockElement = document.createElement('div');
        const listOfBlocksContainer = document.createElement('div');

        spyOn(mockEvent.target as any, 'getBoundingClientRect').and.returnValue({
            left: 100,
            top: 100,
            right: 200,
            bottom: 150,
            width: 100,
            height: 50,
            x: 100,
            y: 100,
            toJSON: () => { }
        });

        spyOn(selectedBlockElement, 'getBoundingClientRect').and.returnValue({
            left: 100,
            right: 200,
            top: 120,
            bottom: 350,
            width: 100,
            height: 230,
            x: 100,
            y: 120,
            toJSON: () => { }
        });

        spyOn(listOfBlocksContainer, 'getBoundingClientRect').and.returnValue({
            left: 90,
            right: 300,
            top: 0,
            bottom: 300,
            width: 210,
            height: 300,
            x: 90,
            y: 0,
            toJSON: () => { }
        });

        component.selectedBlockElement = new ElementRef(selectedBlockElement);
        component.listOfBlocksContainer = new ElementRef(listOfBlocksContainer);

        component.handleMouseEnterOnTc(mockEvent, mockLocalisation);
        tick(10);

        expect(selectedBlockElement.style.bottom).toBe('auto'); // 300 - 100 + 10
        expect(selectedBlockElement.style.top).toBe('120px');
    }));


});

describe('TimelinePluginComponent 3 ', () => {
    let component: TimelinePluginComponent;
    let fixture: ComponentFixture<TimelinePluginComponent>;

    let mediaPlayerElement: MediaPlayerElement;
    let httpTestingController: HttpTestingController;
    let spyOngetCurrentTime: jasmine.Spy;
    let spyOngetDuration: jasmine.Spy;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TimelinePluginComponent, SortablejsDirective, TcFormatPipe, PreventCtrlScrollDirective],
            providers: [MediaPlayerService, MessageService],
            imports: [BrowserAnimationsModule, CheckboxModule, TreeModule, HttpClientTestingModule, ToolbarModule, InputSwitchModule, AccordionModule, DragDropModule,
                MinusIcon, CheckIcon, FormsModule, ButtonModule
            ],
            schemas: [
                CUSTOM_ELEMENTS_SCHEMA
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(TimelinePluginComponent);
        component = fixture.componentInstance;
        component.playerId = 'playerOne';
        const playerService = TestBed.inject(MediaPlayerService);
        mediaPlayerElement = playerService.get(component.playerId);
        const logger = new DefaultLogger();
        const loader = new DefaultConfigLoader(new DefaultConfigConverter(), logger);
        const httpClient: HttpClient = TestBed.inject(HttpClient);
        mediaPlayerElement.configurationManager = new ConfigurationManager(loader, logger);
        mediaPlayerElement.configurationManager.configData = {
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
                    "url": "http://localhost/metadata/timelineListOfMetaData.json",
                    "headers": [
                        "Authorization: "
                    ],
                    "plugin": "timeline"
                }
            ],
            loadMetadataOnDemand: true,
            "debug": false,
            "logLevel": "info",
            "displaySizes": {
                "large": 900,
                "medium": 700,
                "small": 550,
                "xsmall": 340
            }
        };
        const metadataLoader = new DefaultMetadataLoader(httpClient, new DefaultMetadataConverter(), logger);
        mediaPlayerElement.metadataManager = new MetadataManager(mediaPlayerElement.configurationManager, metadataLoader, logger);
        const obj = document.createElement('video');
        mediaPlayerElement.setMediaPlayer(obj);
        httpTestingController = TestBed.inject(HttpTestingController);
        spyOngetDuration = spyOn(mediaPlayerElement.getMediaPlayer(), 'getDuration').and.returnValue(1800);
        // Simulez les éléments DOM
        const mainTimeline = document.createElement('div');
        mainTimeline.style.width = '1000px';
        mainTimeline.style.position = 'absolute';
        mainTimeline.style.left = '100px';
        Object.defineProperty(mainTimeline, 'offsetWidth', { value: 1000 });
        Object.defineProperty(mainTimeline, 'offsetLeft', { value: 100 });

        const mainBlock = document.createElement('div');
        mainBlock.classList.add('tc-cursor');

        const listBlock = document.createElement('div');
        listBlock.classList.add('tc-cursor');

        const timeline = document.createElement('div');
        timeline.classList.add('timeline');
        Object.defineProperty(timeline, 'offsetLeft', { value: 50 });

        const accordion = document.createElement('div');
        accordion.classList.add('p-accordion');
        accordion.getBoundingClientRect = () => ({ height: 200 } as DOMRect);

        const container = document.createElement('div');
        container.appendChild(mainBlock);
        container.appendChild(listBlock);
        container.appendChild(timeline);
        container.appendChild(accordion);

        component.mainTimeline = { nativeElement: mainTimeline };
        component.mainBlockContainer = { nativeElement: container };
        component.listOfBlocksContainer = { nativeElement: container };

        // Valeurs de test
        component.currentTime = 50;
        component.duration = 100;
        component.tcOffset = 0;
        component.focusTcIn = 0;
        component.focusTcOut = 100;
        component.timeFormat = 's';
        fixture.detectChanges();
    });

    it('should correctly position and size the cursor elements', () => {
        component.refreshTimeCursor();

        const mainBlock: HTMLElement = component.mainBlockContainer.nativeElement.querySelector('.tc-cursor');
        const listBlock: HTMLElement = component.listOfBlocksContainer.nativeElement.querySelector('.tc-cursor');

        expect(mainBlock.style.left).toBe('550px'); // 100 + (50 * 1000 / 100)
        expect(mainBlock.style.width).toBe('2px');
        expect(listBlock.style.left).toBe('550px'); // 50 + (0 + 50 - 0) * 1000 / 100
        expect(listBlock.style.height).toBe('200px');
        expect(listBlock.style.width).toBe('2px');
    });

    it('should update mapOfBlocksIndexes based on event array', () => {
        component.listOfBlocks = [{ id: 1 }, { id: 2 }, { id: 3 }] as any;
        component.mapOfBlocksIndexes = new Map();

        component.refreshTimeCursor([0, 2]);

        expect(component.mapOfBlocksIndexes.size).toBe(2);
        expect(component.mapOfBlocksIndexes.has(component.listOfBlocks[0])).toBeTrue();
        expect(component.mapOfBlocksIndexes.has(component.listOfBlocks[1])).toBeFalse();
        expect(component.mapOfBlocksIndexes.has(component.listOfBlocks[2])).toBeTrue();
    });
    it('should skip DOM updates if currentTime or duration is not finite', () => {
        component.currentTime = NaN;
        component.duration = 100;

        const mainBlock = jasmine.createSpyObj('mainBlock', ['style']);
        spyOn(component.mainBlockContainer.nativeElement, 'querySelector').and.returnValue(mainBlock);

        component.refreshTimeCursor();

        // Aucun style ne doit être modifié
        expect(mainBlock.style.left).toBeUndefined();
    });
    it('should fallback to mainTimelineLeftPosition if listBlockTimeline is null', () => {
        spyOn(component.listOfBlocksContainer.nativeElement, 'querySelector').and.callFake((selector: string) => {
            if (selector === '.timeline') return null;
            const el = document.createElement('div');
            el.classList.add(selector.replace('.', ''));
            return el;
        });

        component.refreshTimeCursor();

        const listBlock: HTMLElement = component.listOfBlocksContainer.nativeElement.querySelector('.tc-cursor');
        expect(listBlock.style.left).toBe(''); // fallback utilisé
    });
    it('should not set height if accordion is null', () => {
        spyOn(component.listOfBlocksContainer.nativeElement, 'querySelector').and.callFake((selector: string) => {
            if (selector === '.p-accordion') return null;
            const el = document.createElement('div');
            el.classList.add(selector.replace('.', ''));
            return el;
        });

        component.refreshTimeCursor();

        const listBlock: HTMLElement = component.listOfBlocksContainer.nativeElement.querySelector('.tc-cursor');
        expect(listBlock.style.height).toBe(''); // pas de hauteur définie
    });
    it('should not update mapOfBlocksIndexes if event is not an array', () => {
        component.mapOfBlocksIndexes = new Map();
        const initialSize = component.mapOfBlocksIndexes.size;

        component.refreshTimeCursor('not-an-array');

        expect(component.mapOfBlocksIndexes.size).toBe(initialSize);
    });
    it('should ignore invalid indexes in listOfBlocksIndexes', () => {
        component.listOfBlocks = [{ id: 1 }, { id: 2 }] as any;
        component.mapOfBlocksIndexes = new Map();

        component.refreshTimeCursor([0, 5]); // 5 est invalide

        expect(component.mapOfBlocksIndexes.has(component.listOfBlocks[0])).toBeTrue();
        expect(component.mapOfBlocksIndexes.has(component.listOfBlocks[1])).toBeFalse();
    });
    it('should export tv days', () => {
        spyOn(component.mediaPlayerElement.eventEmitter, 'emit').and.callThrough();
        component.exportTvDays();
        expect(component.mediaPlayerElement.eventEmitter.emit).toHaveBeenCalledWith(PlayerEventType.TIMELINE_EXPORT_TV_DAYS);
    });
});
describe('TimelinePluginComponent For Stock', () => {
    let component: TimelinePluginComponent;
    let fixture: ComponentFixture<TimelinePluginComponent>;
    let spyOngetCurrentTime: jasmine.Spy;
    let spyOngetDuration: jasmine.Spy;

    const timeline_metadata_url = "http://localhost/metadata/timelineListOfMetaData.json";
    const timeline_metadata_Model = require("tests/assets/metadata/timelineListOfMetaDataForStock.json");
    let httpTestingController: HttpTestingController;
    let mediaPlayerElement: MediaPlayerElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TimelinePluginComponent, SortablejsDirective, TcFormatPipe, PreventCtrlScrollDirective],
            providers: [MediaPlayerService, MessageService],
            imports: [BrowserAnimationsModule, CheckboxModule, TreeModule, HttpClientTestingModule, ToolbarModule, InputSwitchModule, AccordionModule, DragDropModule,
                MinusIcon, CheckIcon, FormsModule, ButtonModule, MessagesModule, ToastComponent],
            schemas: [
                CUSTOM_ELEMENTS_SCHEMA
            ]
        }).compileComponents();
    });


    beforeEach(() => {
        fixture = TestBed.createComponent(TimelinePluginComponent);
        component = fixture.componentInstance;
        component.playerId = 'playerOne';
        const playerService = TestBed.inject(MediaPlayerService);
        mediaPlayerElement = playerService.get(component.playerId);
        const logger = new DefaultLogger();
        const loader = new DefaultConfigLoader(new DefaultConfigConverter(), logger);
        const httpClient: HttpClient = TestBed.inject(HttpClient);
        mediaPlayerElement.configurationManager = new ConfigurationManager(loader, logger);
        mediaPlayerElement.configurationManager.configData = {
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
                    "url": "http://localhost/metadata/timelineListOfMetaData.json",
                    "headers": [
                        "Authorization: "
                    ],
                    "plugin": "timeline"
                }
            ],
            loadMetadataOnDemand: true,
            "debug": false,
            "logLevel": "info",
            "displaySizes": {
                "large": 900,
                "medium": 700,
                "small": 550,
                "xsmall": 340
            }
        };
        const metadataLoader = new DefaultMetadataLoader(httpClient, new DefaultMetadataConverter(), logger);
        mediaPlayerElement.metadataManager = new MetadataManager(mediaPlayerElement.configurationManager, metadataLoader, logger);
        const obj = document.createElement('video');
        mediaPlayerElement.setMediaPlayer(obj);
        httpTestingController = TestBed.inject(HttpTestingController);
        spyOngetDuration = spyOn(mediaPlayerElement.getMediaPlayer(), 'getDuration').and.returnValue(1800);

        component.pluginConfiguration = {
            name: "",
            "metadataIds": null,
            "data": {
                "title": "Timeline globale",
                "mainBlockColor": null,
                "timeFormat": "s",
                "expendable": true,
                "mainMetadataIds": [],
                "resizeable": true,
                "resourceType": "stock",
                "tcIn": 1979,
                "duration": 1750
            }
        }
    });
    it('Should call init, handleMetaDataLoaded and handleOnDurationChange', fakeAsync(() => {
        const spyOnInit = spyOn(component, 'init').and.callThrough();
        const spyOnHandleMetaDataLoaded = spyOn(component, 'parseTimelineMetadata').and.callThrough();

        mediaPlayerElement.metadataManager.init().then(() => {
            fixture.detectChanges();
            tick(35000);
            flush();
        });
        httpTestingController.expectOne(timeline_metadata_url).flush(timeline_metadata_Model, {
            status: 200,
            statusText: 'Ok'
        });
        tick(400);
        expect(spyOnInit).toHaveBeenCalled();
        expect(spyOnHandleMetaDataLoaded).toHaveBeenCalled();
        flush();
    }));
});