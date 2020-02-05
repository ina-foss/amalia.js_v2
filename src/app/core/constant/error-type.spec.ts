import {async, getTestBed, TestBed} from '@angular/core/testing';
import {DefaultLogger} from '../logger/default-logger';
import {HttpTestingController} from '@angular/common/http/testing';
import {LoggerInterface} from '../logger/logger-interface';
import {ErrorMessage} from './error-message';
import {PlayerErrorCode} from './error-type';


describe('ConfigurationManager', () => {
  let injector: TestBed;
  const logger: LoggerInterface = new DefaultLogger();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [],
    }).compileComponents();
    injector = getTestBed();
  }));

  it('Test Error message', () => {
    expect(PlayerErrorCode.getMessage(PlayerErrorCode.ACCESS_DENIED)).toContain(ErrorMessage.ACCESS_DENIED);
    expect(PlayerErrorCode.getMessage(PlayerErrorCode.MEDIA_FILE_NOT_FOUND)).toContain(ErrorMessage.MEDIA_FILE_NOT_FOUND);
    expect(PlayerErrorCode.getMessage(PlayerErrorCode.EXCEPTION)).toContain(ErrorMessage.EXCEPTION);
    expect(PlayerErrorCode.getMessage(PlayerErrorCode.HTTP_ERROR)).toContain(ErrorMessage.HTTP_ERROR);
    expect(PlayerErrorCode.getMessage(PlayerErrorCode.ABORT)).toContain(ErrorMessage.ABORT);
    expect(PlayerErrorCode.getMessage(PlayerErrorCode.TIMEOUT)).toContain(ErrorMessage.TIMEOUT);
    expect(PlayerErrorCode.getMessage(PlayerErrorCode.ERROR_LOAD_PLUGIN)).toContain(ErrorMessage.ERROR_LOAD_PLUGIN);
    expect(PlayerErrorCode.getMessage(PlayerErrorCode.CUSTOM_ERROR)).toContain(ErrorMessage.CUSTOM_ERROR);
    expect(PlayerErrorCode.getMessage(PlayerErrorCode.ERROR)).toContain(ErrorMessage.ERROR);
    expect(PlayerErrorCode.getMessage(PlayerErrorCode.ERROR_HTML5_SUPPORT)).toContain(ErrorMessage.ERROR_HTML5_SUPPORT);
    expect(PlayerErrorCode.getMessage(PlayerErrorCode.ERROR_MANIFEST_DASH)).toContain(ErrorMessage.ERROR_MANIFEST_DASH);
    expect(PlayerErrorCode.getMessage(PlayerErrorCode.METADATA_HTTP_LOAD_ERROR)).toContain(ErrorMessage.METADATA_HTTP_LOAD_ERROR);
    expect(PlayerErrorCode.getMessage(PlayerErrorCode.ERROR_TO_CONVERT_METADATA)).toContain(ErrorMessage.ERROR_TO_CONVERT_METADATA);
    expect(PlayerErrorCode.getMessage(null)).toContain(ErrorMessage.DEFAULT);
  });

});
