import {Pipe, PipeTransform} from '@angular/core';
import {FormatUtils} from './format-utils';


@Pipe({name: 'tcFormat'})
export class TcFormatPipe implements PipeTransform {
    transform(tc: number, format: 'h' | 'm' | 's' | 'f' | 'minutes' | 'ms' | 'mms' | 'seconds' = null, defaultFps: number = 25) {
        return FormatUtils.formatTime(tc, format, defaultFps);
    }
}
