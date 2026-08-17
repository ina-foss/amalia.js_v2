import {Injectable} from '@angular/core';
import {saveAs} from 'file-saver';
// Import par défaut obligatoire : json-as-xlsx est un CJS dont module.exports EST la fonction
// (sans marqueur __esModule). Avec `import * as`, l'interop __toESM d'esbuild fabrique un
// namespace non appelable -> TypeError au premier export Excel (régression constatée en 2.1.26).
import xlsx from 'json-as-xlsx';

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
        xlsx(data, settings);
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
