import {waitForAsync, getTestBed, TestBed} from '@angular/core/testing';
import {TimeBarPluginComponent} from './time-bar-plugin.component';
import {MediaPlayerService} from '../../service/media-player-service';
import {ConfigurationManager} from '../../core/config/configuration-manager';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {EventEmitter} from 'events';
import {PlayerConfigData} from '../../core/config/model/player-config-data';
import {MediaElement} from '../../core/media/media-element';
import {PluginConfigData} from '../../core/config/model/plugin-config-data';
import {TimeBarConfig} from '../../core/config/model/time-bar-config';
import {DefaultLogger} from '../../core/logger/default-logger';
import {LoggerInterface} from '../../core/logger/logger-interface';
import {DefaultConfigLoader} from '../../core/config/loader/default-config-loader';
import {DefaultConfigConverter} from '../../core/config/converter/default-config-converter';
import {ConfigDataSource} from '../../core/config/model/config-data-source';
import {ConfigData} from '../../core/config/model/config-data';
import {MediaPlayerElement} from '../../core/media-player-element';
import {DefaultMetadataLoader} from '../../core/metadata/loader/default-metadata-loader';
import {PlayerState} from '../../core/constant/player-state';
import {HttpClient} from '@angular/common/http';
import {DefaultMetadataConverter} from '../../core/metadata/converter/default-metadata-converter';

describe('TimeBar plugin test', () => {
    let injector: TestBed;
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    const logger: LoggerInterface = new DefaultLogger();
    const loader = new DefaultConfigLoader(new DefaultConfigConverter(), logger);
    const mediaSrc = 'http://localhost:4201/medias/outputlm.mp4';
    const configPlugin: PluginConfigData<TimeBarConfig> = {name: 'TIME_BAR', data: {timeFormat: 'f', theme : 'outside'}};
    const eventEmitter = new EventEmitter();
    const metadataConverter = new DefaultMetadataConverter();

    // const mediaPlayer = new MediaElement(obj, eventEmitter);
    const configLoader = new DefaultConfigLoader(new DefaultConfigConverter(), logger);
    const configData = require('tests/assets/config-mpe.json');

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            declarations: [],
        }).compileComponents();
        injector = getTestBed();
        httpTestingController = injector.inject(HttpTestingController);
        httpClient = injector.inject(HttpClient);
    }));
    it('Test functions plugin timebarcode', () => {
        const metadataLoader = new DefaultMetadataLoader(httpClient, metadataConverter, logger);
        const configurationManager = new ConfigurationManager(loader, logger);
        const playerService = new MediaPlayerService();
        const mpe = new MediaPlayerElement();
        mpe.init(configData, metadataLoader, configLoader)
            .then((state) => {

                expect(state).toEqual(PlayerState.INITIALIZED);
            })
            .catch(() => {
                fail('Error to init player');
            });
        configurationManager.load(configData).then(() => {
            expect(configurationManager.getCoreConfig().player.src).toContain(mediaSrc);
        });
        mpe.configurationManager.configData = configData;
        const obj = document.createElement('video');
        mpe.setMediaPlayer(obj);
        const mediaPlayer = new MediaElement(obj, eventEmitter);
        expect(mpe.getMediaPlayer()).toEqual(mediaPlayer);
        mpe.setMediaPlayerWidth(1980);
        playerService.players.set('PLAYER', mpe);
        const plugin = new TimeBarPluginComponent(playerService);
        expect(plugin.getDefaultConfig()).toEqual(configPlugin);
        plugin.playerId = 'PLAYER';
        plugin.pluginInstance = 'PLAYER';
        plugin.mediaPlayerElement = mpe;
        plugin.ngOnInit();
        plugin.hideTimeBar();
        expect(plugin.active).toEqual(false);
        plugin.showTimeBar();
        expect(plugin.active).toEqual(true);
        mediaPlayer.setCurrentTime(10);
        plugin.handleOnTimeChange();
        expect(plugin.timeTimeBar).toEqual(10);
        plugin.handleDisplayState();
        expect(plugin.displayState).toEqual('l');
        mpe.setMediaPlayerWidth(320);
        plugin.handleDisplayState();
        expect(plugin.displayState).toEqual('xs');
        plugin.showTimeBar();
        expect(plugin.active).toEqual(true);
        plugin.handleOnDurationChange();
        playerService.get('PLAYER');
        playerService.get('PLAYER2');
        playerService.get(null);


    });
});
