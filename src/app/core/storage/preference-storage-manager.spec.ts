import {waitForAsync, getTestBed, TestBed} from '@angular/core/testing';
import {PreferenceStorageManager} from './preference-storage-manager';

describe('Test Storage Manager', () => {
    let injector: TestBed;
    const component = new PreferenceStorageManager();
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [],
        }).compileComponents();
        injector = getTestBed();
    }));
    it('Preference storage Manager ', () => {
        component.clear();
        component.setItem('test', 'toto');
        expect(component.setItem('test2', 'value')).toEqual(true);
        expect(component.hasItem('test')).toEqual(true);
        expect(component.getItem('test')).toContain('toto');
        expect(component.getItem('testing')).toEqual(null);
        expect(component.getItem(null)).toEqual(null);
        expect(component.removeItem('test')).toEqual(true);
        expect(component.removeItem(null)).toEqual(false);
        expect(component).toBeTruthy();
    });
});
