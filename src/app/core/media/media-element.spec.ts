import {async, getTestBed, TestBed} from '@angular/core/testing';
import {MediaElement} from './media-element';
import {EventEmitter} from 'events';
import {DefaultLogger} from '../logger/default-logger';

describe('Test Media element', () => {
    let injector: TestBed;
    const component = new MediaElement(document.createElement('video'), new EventEmitter(), new DefaultLogger());
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [],
        }).compileComponents();
        injector = getTestBed();
    }));

    afterEach(() => {
    });

    it('Media player element ', () => {
        expect(component).toBeTruthy();
        expect(component.audioChannel).toEqual(1);
        component.audioChannel = 2;
        expect(component.audioChannel).toEqual(2);
    });
    it('test playbackrate setter and getter' , () => {
        expect(component.playbackRate).toEqual(1);
    });
    it('Tests merge volume' , () => {
        expect(component.withMergeVolume).toEqual(true);
        component.withMergeVolume = false;
        expect(component.withMergeVolume).toEqual(false);
    });
    it('Tests framerate' , () => {
        expect(component.framerate).toEqual(25);
        component.framerate = 60;
        expect(component.framerate).toEqual(60);
    });
    it('Tests poster' , () => {
        component.poster = '../assets/image.png';
        expect(component.poster).toEqual('../assets/image.png');
    });
});


