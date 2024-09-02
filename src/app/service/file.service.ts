import {Injectable} from '@angular/core';
import {saveAs} from 'file-saver';

@Injectable()
export class FileService {

    constructor() {
    }

    public downloadFile(textFileContent: string, fileName?: string): void {
        const blob = new Blob([textFileContent], {type: 'application/json'});
        if (fileName) {
            saveAs(blob, fileName);
        } else {
            saveAs(blob, 'amalia_download_' + Date.now() + '.json');
        }

    }
}
