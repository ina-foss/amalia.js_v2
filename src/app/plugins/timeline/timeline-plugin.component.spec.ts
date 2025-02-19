import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TimelinePluginComponent} from './timeline-plugin.component';
import {MediaPlayerService} from '../../service/media-player-service';
import {TreeNode} from 'primeng/api/treenode';
import {DataType} from "../../core/constant/data-type";
import {CheckboxModule} from "primeng/checkbox";
import {TreeModule} from "primeng/tree";
import {SortablejsDirective} from "../../core/directive/inaSortablejs/sortablejs.directive";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";

describe('TimelinePluginComponent', () => {
    let component: TimelinePluginComponent;
    let fixture: ComponentFixture<TimelinePluginComponent>;
    let mediaPlayerServiceStub: Partial<MediaPlayerService>;

    beforeEach(async () => {
        mediaPlayerServiceStub = {
            // Ajoutez ici les méthodes nécessaires pour le stub du service
        };

        await TestBed.configureTestingModule({
            declarations: [TimelinePluginComponent, SortablejsDirective],
            providers: [{provide: MediaPlayerService, useValue: mediaPlayerServiceStub}],
            imports: [CheckboxModule, TreeModule],
            schemas: [
                CUSTOM_ELEMENTS_SCHEMA
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TimelinePluginComponent);
        component = fixture.componentInstance;
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
        expect(component.enableDragDrop).toBeFalse();
        expect(component.configIsOpen).toBeFalse();
        expect(component.currentTime).toBe(0);
        expect(component.duration).toBe(0);
        expect(component.tcOffset).toBe(0);
        expect(component.focusTcIn).toBe(0);
        expect(component.focusTcOut).toBe(0);
        expect(component.selectionPosition).toEqual({x: 0, y: 0, startX: 0, startY: 0});
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
        component.allNodesChecked = true;
        component.nodes = [{key: '1', label: 'Node 1', children: []} as TreeNode];
        component.toggleAllNodes();
        expect(component.selectedNodes().length).toBe(1);

        component.allNodesChecked = false;
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
        const metadata = {id: 'test-id', label: 'Test Label', viewControl: {color: '#000000'}};
        const childNode = component.getNewChildNodeFromMetadataElement(metadata);

        expect(childNode.key).toBe(metadata.id);
        expect(childNode.label).toBe(metadata.label);
        expect(childNode.data.color).toBe(metadata.viewControl.color);
        expect(childNode.checked).toBeTrue();
        expect(childNode.expanded).toBeTrue();
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

        expect(component.listOfBlocks.length).toBe(12);
        expect(component.nodes.length).toBe(3);
        expect(component.selectedNodes().length).toBe(15);
        expect(component.allNodesChecked).toBeTrue();
    });

    it('should get new node from metadata element', () => {
        const metadata = {type: DataType.SEGMENTATION};
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

    it('should filter nodes', () => {
        const event = {target: {value: 'test'}};
        component.nodes = [
            {label: 'testNode', children: []} as TreeNode,
            {label: 'otherNode', children: []} as TreeNode
        ];

        component.filterNodes(event);
        expect(component.nodes[0].styleClass).toBe('');
        expect(component.nodes[1].styleClass).toBe('hidden-node');
    });

    it('should filter node', () => {
        const node = {label: 'testNode', children: []} as TreeNode;
        const query = 'test';

        const result = component.filterNode(node, query);
        expect(result).toBeTrue();
        expect(node.styleClass).toBe('');
    });

    it('should toggle filter', () => {
        component.filterHidden = false;
        component.toggleFilter();
        expect(component.filterHidden).toBeTrue();

        component.toggleFilter();
        expect(component.filterHidden).toBeFalse();
    });
});
