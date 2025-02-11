import {Injectable} from '@angular/core';
import {saveAs} from 'file-saver';
import * as XLSX from 'exceljs';

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
        const workbook = new XLSX.Workbook();
        const worksheet = workbook.addWorksheet('Sheet1');
        worksheet.addRows(jsonData);
        workbook.xlsx.writeFile(`${fileName}${EXCEL_EXTENSION}`).then(() => {
            console.log('Fichier Excel créé avec succès!');
        }).catch((error) => {
            console.error('Erreur lors de la création du fichier Excel:', error);
        });
    }

}
