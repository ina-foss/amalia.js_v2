import { MediaPlayerElement } from '../media-player-element';
import { PluginConfigData } from '../config/model/plugin-config-data';
import { DefaultLogger } from '../logger/default-logger';
import { ChangeDetectorRef, Component, ElementRef, inject, Input, NgZone, OnDestroy, OnInit, ProviderToken } from '@angular/core';
import { PrimengShadowStylesService } from '../styles/primeng-shadow-styles.service';
import { PlayerEventType } from '../constant/event-type';
import { MediaPlayerService } from '../../service/media-player-service';
import { AmaliaException } from '../exception/amalia-exception';
import { Subscription } from "rxjs";
import { Utils } from "../utils/utils";

/**
 * Execution policy of a player-event listener with respect to change detection:
 * - `'zone'`: `zone.run(fn)` + `markForCheck()` — historical behaviour, forces a change
 *   detection tick through the zone (player events are emitted from a plain EventEmitter,
 *   often outside Angular's zone).
 * - `'schedule'`: `fn` + `markForCheck()` without re-entering the zone — relies on the hybrid
 *   scheduler (Angular ≥ 18): `markForCheck()` outside the zone schedules a coalesced
 *   `ApplicationRef.tick()`, in both zone and zoneless modes.
 * - `'none'`: bare `fn`, no change-detection notification — for handlers that only write
 *   signals (the signal write schedules the tick itself) or do pure DOM work.
 */
export type ListenerZonePolicy = 'zone' | 'schedule' | 'none';

/**
 * Base class for create plugin
 */
@Component({
    selector: 'amalia-base-plugin',
    template: '<div></div>',
})
export abstract class PluginBase<T> implements OnInit, OnDestroy {

    @Input()
    public playerId = null;
    public timeFormat;
    public tcOffset;
    public fps;
    public initialized;
    public dataLoading: boolean = false;
    public timeout: number = 30000;
    public intervalStep: number = 5;
    public noSpinner: boolean = true;
    public subscriptionToEventsEmitters: Subscription[] = [];
    /**
     * When false, it means that the pluginConfiguration was set through the template's attribute
     */
    public pluginConfSetThroughInit: boolean = false;
    /**
     * When false, means that the init function was not called yet
     */
    public initAlreadyCalled: boolean = false;
    /**
     * This plugin configuration
     */
    public _player;

    get player() {
        return this._player;
    }

    @Input()
    set player(value) {
        this._player = value;
    }

    public setDataLoading(dataLoading: boolean) {
        this.dataLoading = dataLoading;
    }

    logWaitForTcOffsetComplete() {
        if (this.mediaPlayerElementReady()) {
            this.logger.info(`Plugin ${this.pluginName}`, 'tcOffset bien renseigné');
        } else {
            this.logger.info(`Plugin ${this.pluginName}`, 'tcOffset n\' a pas  été renseigné');
        }
    }

    public metaDataLoaded(): boolean {
        let result: boolean = true;
        const handleMetadataIds = this.pluginConfiguration?.metadataIds;
        const metadataManager = this.mediaPlayerElement.metadataManager;
        this.logger.info(` Metadata loaded ${handleMetadataIds}`);
        // Check if metadata is initialized
        if (metadataManager && handleMetadataIds && Utils.isArrayLike<string>(handleMetadataIds)) {
            handleMetadataIds.forEach((metadataId) => {
                this.logger.info(`checking metadata for ${metadataId}`);
                if (!metadataManager.hasMetadataKey(metadataId)) {
                    result = false;
                }
            });
        } else {
            result = false;
        }
        return result;
    }

    /**
     * Retourne vrai si le mediaPlayerElement est initialisé.
     */
    public mediaPlayerElementReady(): boolean {
        return !!(this.mediaPlayerElement) && !!(this.mediaPlayerElement.getMediaPlayer()) && !!(this.mediaPlayerElement.getConfiguration());
    }

    public setTcOffset() {
        if (this.mediaPlayerElementReady()) {
            this.tcOffset = this.mediaPlayerElement.getConfiguration().tcOffset || 0;
        }
    }

    public _pluginConfiguration: PluginConfigData<T>;

    get pluginConfiguration(): PluginConfigData<T> {
        return this._pluginConfiguration;
    }

    @Input()
    set pluginConfiguration(value: PluginConfigData<T>) {
        if (typeof value === 'string') {
            try {
                value = JSON.parse(value);
            } catch (e) {
                value = null;
                this.logger.warn(`Error to parse ${this.pluginName} plugin configuration json.`);
            }
        }
        this._pluginConfiguration = value;
    }

    public playerService: MediaPlayerService;
    @Input()
    public pluginInstance = '';
    public mediaPlayerElement: MediaPlayerElement;
    @Input({ required: true })
    protected pluginName: string;
    logger: DefaultLogger;
    /**
     * Angular zone, used to re-enter the zone when player events (emitted from a non-Angular
     * EventEmitter, often outside the zone) update component state, so change detection runs.
     */
    private readonly _pluginZone: NgZone | null = PluginBase.tryInject(NgZone);
    /**
     * Change detector used to mark the (custom element) view dirty after event-driven updates.
     */
    private readonly _pluginCdr: ChangeDetectorRef | null = PluginBase.tryInject(ChangeDetectorRef);
    /**
     * Miroir des styles PrimeNG (document.head) vers le shadow root du plugin — remplace
     * l'ancien @import de styles.scss/theme.css dans le SCSS des composants Shadow DOM.
     */
    private readonly _shadowStyles: PrimengShadowStylesService | null = PluginBase.tryInject(PrimengShadowStylesService);
    private readonly _pluginElementRef: ElementRef | null = PluginBase.tryInject(ElementRef);

    /**
     * Resolve a dependency from the current injection context, returning null when there is no
     * active injector (e.g. when the plugin is instantiated directly with `new` in unit tests).
     */
    private static tryInject<T>(token: ProviderToken<T>): T | null {
        try {
            return inject(token, { optional: true });
        } catch {
            return null;
        }
    }

    /**
     * Plugin base constructor
     * @param playerService player service
     */
    protected constructor(playerService: MediaPlayerService) {
        this.playerService = playerService;
    }

    ngOnInit(): void {
        this._shadowStyles?.attach(this._pluginElementRef?.nativeElement?.shadowRoot);
        this.logger = new DefaultLogger(`${this.pluginName}`);
        this.mediaPlayerElement = this.playerService.get(this.playerId);
        if (!this.mediaPlayerElement) {
            throw new AmaliaException(`Error to init plugin ${this.pluginName} (player id : ${this.playerId}).`);
        }
        if (this.mediaPlayerElement.isMetadataLoaded || this.pluginName === 'STORYBOARD') {
            this.init();
        }
        //The TIME_BAR and CONTROL_BAR plugins need this
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.INIT, this.refreshAndInit);
        // Fallback for plugins connecting while isMetadataLoaded=false (e.g. detached mode player re-init):
        // INIT won't fire again, but METADATA_LOADED will once the player finishes loading.
        if (!this.mediaPlayerElement.isMetadataLoaded) {
            this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.METADATA_LOADED, this.refreshAndInit);
        }
    }

    private refreshAndInit = (): void => {
        const fresh = this.playerService.get(this.playerId);
        if (fresh && fresh !== this.mediaPlayerElement) {
            this.mediaPlayerElement = fresh;
        }
        this.init();
        this.handleMetadataLoaded();
    };

    addListener(element: any, playerEventType: PlayerEventType, func: any, opts?: { policy?: ListenerZonePolicy }) {
        const policy = opts?.policy ?? this.defaultListenerPolicy(playerEventType);
        Utils.addListener(this, element, playerEventType, this.wrapForCd(func, policy));
    }

    /**
     * Default {@link ListenerZonePolicy} applied by {@link addListener} when the caller does not
     * pass an explicit policy. Returns `'zone'` — strictly identical behaviour to the historical
     * `wrapInZone` during the OnPush/zoneless transition. Subclasses can override this to relax
     * the policy per event type (e.g. rAF-coalesced or signal-writing handlers → `'none'`).
     */
    protected defaultListenerPolicy(playerEventType: PlayerEventType): ListenerZonePolicy {
        return 'zone';
    }

    /**
     * Wraps a player-event handler according to the given {@link ListenerZonePolicy}. Player
     * events are emitted from a plain EventEmitter whose `emit` may originate outside Angular's
     * zone (the host page drives the player via the custom-element API), in which case mutations
     * done by the handler would not trigger change detection:
     * - `'zone'`: runs the handler inside the Angular zone and marks the view for check;
     * - `'schedule'`: runs the handler as-is and marks the view for check (the hybrid scheduler
     *   turns the out-of-zone `markForCheck` into a coalesced tick);
     * - `'none'`: returns the handler untouched.
     * IMPORTANT: the wrapper's `name` is preserved (`Object.defineProperty`) so the listener
     * de-duplication/removal logic in `Utils` (which matches on the bound function name) keeps
     * working.
     */
    private wrapForCd(func: any, policy: ListenerZonePolicy): any {
        if (policy === 'none') {
            // Bare handler: its own `name` is naturally preserved for the Utils name-based dedup.
            return func;
        }
        const zone = this._pluginZone;
        const cdr = this._pluginCdr;
        const wrapped = function (...args: any[]) {
            // `this` is bound to the plugin instance by Utils.addListener.
            const run = () => {
                const result = func.apply(this, args);
                cdr?.markForCheck();
                return result;
            };
            return (policy === 'zone' && zone) ? zone.run(run) : run();
        };
        Object.defineProperty(wrapped, 'name', { value: func.name, configurable: true });
        return wrapped;
    }
    removeListener(element: any, playerEventType: PlayerEventType, func: any) {
        Utils.unsubscribeTargetedElementEventListener(this, element, playerEventType, func);
    }

    protected handleMetadataLoaded() {
        // this method 'handleMetadataLoaded' is empty
        /**
         * This method is empty because It is called in ngOnInit for all the components inheriting from PluginBase.
         */
    }

    init() {
        const defaultConfig = this.getDefaultConfig();
        if (!this.initAlreadyCalled) {
            //This code ensures that we identify the case when pluginConf was initialized from an init that is no longer up to date
            this.pluginConfSetThroughInit = !this.pluginConfiguration;
        }
        try {
            const customConfig = this.mediaPlayerElement.getPluginConfiguration(`${this.pluginName}-${this.playerId}${this.pluginInstance}`);
            if (customConfig) {
                if (this.pluginConfiguration) {
                    if (this.pluginConfSetThroughInit) {
                        this.pluginConfiguration = {
                            ...defaultConfig,
                            ...customConfig,
                        };
                    } else {
                        this.pluginConfiguration = {
                            ...defaultConfig,
                            ...customConfig,
                            ...this.pluginConfiguration
                        };
                    }
                } else {
                    this.pluginConfiguration = {
                        ...defaultConfig,
                        ...customConfig
                    };
                }
            }
        } catch (e) {
            this.logger.debug(`${this.pluginName} : init default configuration`);
        }
        if (!this.pluginConfiguration) {
            this.pluginConfiguration = defaultConfig;
        } else {
            this.pluginConfiguration.data = {
                ...defaultConfig.data,
                ...this.pluginConfiguration.data
            };
        }

        this.tcOffset = this.mediaPlayerElement.getConfiguration()?.tcOffset || 0;
        this.fps = this.mediaPlayerElement.getConfiguration()?.player.framerate || 25;
        this.initAlreadyCalled = true;
    }

    abstract getDefaultConfig(): PluginConfigData<T>;

    ngOnDestroy(): void {
        Utils.unsubscribeTargetedElementEventListeners(this);
    }
}
