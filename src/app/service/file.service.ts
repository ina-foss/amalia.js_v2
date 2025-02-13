import {Injectable} from '@angular/core';
import {saveAs} from 'file-saver';
import * as xlsx from 'json-as-xlsx';

@Injectable({providedIn: 'root'})
export class FileService {

    public downloadFile(textFileContent: string, fileName?: string): void {
        const blob = new Blob([textFileContent], {type: 'application/json'});
        if (fileName) {
            saveAs(blob, fileName);
        } else {
            saveAs(blob, 'amalia_download_' + Date.now() + '.json');
        }
    }

    public callXlsx(data, settings) {
        const callableXlsx = xlsx as unknown as any;
        callableXlsx(data, settings);
    }

    public exportToExcel(jsonData: any[], fileName: string) {
        const settings = {
            fileName
        }
        const data = [{
            sheet: "Sheet1",
            columns: Object.keys(jsonData[0]).map(key => {
                return {label: key, value: key};
            }),
            content: jsonData
        }];
        this.callXlsx(data, settings);
    }

}
