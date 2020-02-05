/**
 * Utils for format
 */
export class FormatUtils {
  /**
   * Method in charge to format time
   * @method formatTime
   * @param seconds seconds
   * @param defaultFps frames per second
   * @param format Format specifier h/m/s/f/ms/mms
   * @return return format time
   */
  public static formatTime(seconds: number, defaultFps: number, format: string = null) {
    let minutes: number = Math.floor(seconds / 60);
    let formatTime: string;
    const FPS: number = defaultFps || 25;
    const fps: number = Math.floor((Math.floor((seconds - Math.floor(seconds)) * 100000) * FPS) / 100000);
    const hours: number = Math.floor(minutes / 60);
    const milliseconds: number = seconds % 60;
    seconds = Math.floor(seconds % 60);
    minutes = Math.floor(minutes % 60);
    switch (format) {
      case 'h' :
        formatTime = hours.toString();
        break;
      case 'm' :
        formatTime = hours + ':' + minutes;
        break;
      case 's' :
        formatTime = hours + ':' + minutes + ':' + seconds;
        break;
      case 'seconds' :
        formatTime = hours * 3600 + minutes * 60 + milliseconds.toFixed(4);
        break;
      case 'mms' :
        formatTime = hours + ':' + minutes + ':' + seconds + '.' + milliseconds.toFixed(4).split('.')[1];
        break;
      case 'ms' :
        formatTime = hours + ':' + minutes + ':' + seconds + '.' + milliseconds.toFixed(2).split('.')[1];
        break;
      case 'f' :
        formatTime = hours + ':' + minutes + ':' + seconds + ':' + fps;
        break;
      default :
        formatTime = hours + ':' + minutes + ':' + seconds + ':' + milliseconds.toFixed(2).split('.')[1];
    }
    return formatTime;
  }

}
