import {async, getTestBed, TestBed} from '@angular/core/testing';
import {MediaElement} from './media-element';

describe('Test Media element', () => {
    let injector: TestBed;
    const component = new MediaElement(document.createElement('video'));
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
    });
});


