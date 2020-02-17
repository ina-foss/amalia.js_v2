/**
 * Utils for format
 */
export class FormatUtils {
    /**
     * Method in charge to format time
     * @method formatTime
     * @param seconds seconds
     * @param format Format specifier h/m/s/f/ms/mms
     * @param defaultFps frames per second
     * @return return format time
     */
    public static formatTime(seconds: number, format: string = null, defaultFps: number = 25) {
        let minute: number = Math.floor(seconds / 60);
        let formatTime: string;
        const fps: number = ((Math.floor((seconds) * 10000) - Math.floor(seconds) * 10000) / 10000) / (1 / defaultFps);
        const hours: number = Math.floor(minute / 60);
        const milliseconds: number = seconds % 60;
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
            default :
                formatTime = hoursStr + ':' + minuteStr + ':' + secondsStr + ':' + milliseconds.toFixed(2).split('.')[1];
        }
        return formatTime;
    }

}
