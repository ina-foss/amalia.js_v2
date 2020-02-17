import {ErrorMessage} from './error-message';


export class PlayerErrorCode {
    static ACCESS_DENIED = 1001;
    static MEDIA_FILE_NOT_FOUND = 2001;
    static CUSTOM_ERROR = 3001;
    static EXCEPTION = 4001;
    static HTTP_ERROR = 5001;
    static METADATA_HTTP_LOAD_ERROR = 5002;
    static ERROR_TO_CONVERT_METADATA = 5003;
    static ABORT = 6001;
    static TIMEOUT = 7008;
    static ERROR = 8008;
    static ERROR_HTML5_SUPPORT = 8000;
    static ERROR_LOAD_PLUGIN = 9001;
    static ERROR_MANIFEST_DASH = 9002;


    /**
     * Return message by code error
     *
     * @param errorCode error code number
     */
    static getMessage = (errorCode) => {
        switch (errorCode) {
            case PlayerErrorCode.ACCESS_DENIED :
                return ErrorMessage.ACCESS_DENIED;
            case PlayerErrorCode.MEDIA_FILE_NOT_FOUND :
                return ErrorMessage.MEDIA_FILE_NOT_FOUND;
            case PlayerErrorCode.EXCEPTION :
                return ErrorMessage.EXCEPTION;
            case PlayerErrorCode.HTTP_ERROR :
                return ErrorMessage.HTTP_ERROR;
            case PlayerErrorCode.ABORT :
                return ErrorMessage.ABORT;
            case PlayerErrorCode.TIMEOUT :
                return ErrorMessage.TIMEOUT;
            case PlayerErrorCode.ERROR_LOAD_PLUGIN :
                return ErrorMessage.ERROR_LOAD_PLUGIN;
            case PlayerErrorCode.CUSTOM_ERROR :
                return ErrorMessage.CUSTOM_ERROR;
            case PlayerErrorCode.ERROR :
                return ErrorMessage.ERROR;
            case PlayerErrorCode.ERROR_HTML5_SUPPORT :
                return ErrorMessage.ERROR_HTML5_SUPPORT;
            case PlayerErrorCode.ERROR_MANIFEST_DASH:
                return ErrorMessage.ERROR_MANIFEST_DASH;
            case PlayerErrorCode.METADATA_HTTP_LOAD_ERROR:
                return ErrorMessage.METADATA_HTTP_LOAD_ERROR;
            case PlayerErrorCode.ERROR_TO_CONVERT_METADATA:
                return ErrorMessage.ERROR_TO_CONVERT_METADATA;
            default :
                return ErrorMessage.DEFAULT;
        }
    };
}

