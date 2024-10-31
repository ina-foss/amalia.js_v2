import {Injectable} from '@angular/core';
import {saveAs} from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_EXTENSION = '.xlsx';

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

    public exportToExcel(jsonData: any[], fileName: string): void {
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
        const workbook: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, `${fileName}${EXCEL_EXTENSION}`);
    }

}
