import {async, getTestBed, TestBed} from '@angular/core/testing';
import {PreferenceStorageManager} from './preference-storage-manager';

describe('Test Storage Manager', () => {
    let injector: TestBed;
    const component = new PreferenceStorageManager();
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [],
        }).compileComponents();
        injector = getTestBed();
    }));

    afterEach(() => {
    });

    it('Preference storage Manager ', () => {
        component.clear();
        component.setItem('test', 'toto');
        expect(component.hasItem('test')).toEqual(true);
        expect(component.getItem('test')).toContain('toto');
        expect(component.removeItem('test')).toEqual(true);
        expect(component).toBeTruthy();
    });
});
