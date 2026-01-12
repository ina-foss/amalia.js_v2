import {TestBed} from '@angular/core/testing';

import {FileService} from './file.service';
import {saveAs} from 'file-saver';

describe('FileService', () => {
    let service: FileService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [], providers: [FileService]
        });
        service = TestBed.inject(FileService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should download a JSON file', () => {
        spyOn(saveAs, 'saveAs');
        const textFileContent = JSON.stringify({key: 'value'});
        service.downloadFile(textFileContent, 'test.json');
        expect(saveAs).toHaveBeenCalled();
    });

    it('should download a JSON file without a fileName', () => {
        spyOn(saveAs, 'saveAs');
        const textFileContent = JSON.stringify({key: 'value'});
        service.downloadFile(textFileContent);
        expect(saveAs).toHaveBeenCalled();
    });

    it('should export data to Excel', () => {
        spyOn(service, 'callXlsx');
        const jsonData = [
            {name: 'Alice', age: 30, city: 'Paris'},
            {name: 'Bob', age: 25, city: 'Lyon'}
        ];
        service.exportToExcel(jsonData, 'sample');
        expect(service.callXlsx).toHaveBeenCalled();
    });
});
