/**
 * Utils for format
 */
import {AmaliaException} from '../exception/amalia-exception';

export class FormatUtils {
    /**
     * Method in charge to format time
     * @method formatTime
     * @param seconds seconds
     * @param format Format specifier h/m/s/f/ms/mms
     * @param defaultFps frames per second
     * @return return format time
     */
    public static formatTime(seconds: number, format: 'h' | 'm' | 's' | 'minutes' | 'f' | 'ms' | 'mms' | 'hours' | 'seconds' = 's', defaultFps: number = 25): string {
        let formatTime: string;
        let minute: number = Math.floor(seconds / 60);
        const fps: number = ((Math.floor((seconds) * 10000) - Math.floor(seconds) * 10000) / 10000) / (1 / defaultFps);
        const hours: number = Math.floor(minute / 60);
        const milliseconds: number = seconds % 60;
        const h = Math.floor(( minute / 60) % 24);
        const hStr = h.toFixed().padStart(2, '0');
        seconds = Math.floor(seconds % 60);
        minute = Math.floor(minute % 60);
        const hoursStr = hours.toFixed().padStart(2, '0');
        const minuteStr = minute.toFixed().padStart(2, '0');
        const secondsStr = seconds.toFixed().padStart(2, '0');
        const fpsStr = fps.toFixed().padStart(2, '0');
        switch (format) {
            case 'h' :
                formatTime = hoursStr;
                break;
            case 'm' :
                formatTime = hoursStr + ':' + minuteStr;
                break;
            case 's' :
                formatTime = hoursStr + ':' + minuteStr + ':' + secondsStr;
                break;
            case 'seconds' :
                formatTime = hours * 3600 + minute * 60 + milliseconds.toFixed(4);
                break;
            case 'mms' :
                formatTime = hoursStr + ':' + minuteStr + ':' + secondsStr + '.' + milliseconds.toFixed(4).split('.')[1];
                break;
            case 'ms' :
                formatTime = hoursStr + ':' + minuteStr + ':' + secondsStr + '.' + milliseconds.toFixed(2).split('.')[1];
                break;
            case 'f' :
                formatTime = hoursStr + ':' + minuteStr + ':' + secondsStr + ':' + fpsStr;
                break;
            case 'minutes' :
                formatTime = minute.toString();
                break;
            case 'hours' :
                formatTime = hStr + ':' + minuteStr + ':' +  secondsStr + ':' + fpsStr;
                break;
            default:
                throw new AmaliaException('Unknown time format');
                break;
        }
        return formatTime;
    }

    public static convertTcToSeconds(tc: string): number {
        let time = null;
        // regex patter to search on
        const patt = /\d{2}:\d{2}:\d{2}/;
        // return the matching date string
        let result;
        if (patt.exec(tc) !== null) {
            result = tc.split(':');
            const hours = Math.floor(result[0]);
            const minutes = Math.floor(result[1]);
            const seconds = parseFloat(result[2]);
            time = (hours * 60 * 60) + (minutes * 60) + seconds;
        }
        return time;
    }

    /**
     *  Formatting a string in java is using
     * @param str A format string
     * @param val Arguments referenced by the format specifiers in the format string
     */
    public static formatString(str: string, ...val: string[]) {
        for (let index = 0; index < val.length; index++) {
            str = str.replace(`{${index}}`, val[index]);
        }
        return str;
    }

}
