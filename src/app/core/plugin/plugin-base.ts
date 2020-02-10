import {MediaPlayerElement} from '../media-player-element';
import {PluginConfigData} from '../config/model/plugin-config-data';
import {DefaultLogger} from '../logger/default-logger';

/**
 * Base class for create plugin
 */
export abstract class PluginBase extends HTMLElement {
  protected readonly pluginName: string;
  protected readonly mediaPlayerElement: MediaPlayerElement;
  protected readonly pluginConfiguration: PluginConfigData;
  protected readonly logger: DefaultLogger;

  protected constructor(pluginName: string, mediaPlayerElement: MediaPlayerElement, logger: DefaultLogger) {
    super();
    this.pluginName = pluginName;
    this.mediaPlayerElement = mediaPlayerElement;
    this.logger = logger;
    try {
      this.pluginConfiguration = this.mediaPlayerElement.getPluginConfiguration(this.pluginName);
    } catch (e) {
      this.pluginConfiguration = null;
    }
  }

  /**
   * connected callback
   */
  abstract connectedCallback(): void;

  /**
   * disconnected callback
   */
  abstract disconnectedCallback(): void;

  /**
   * component will mount
   */
  abstract componentWillMount(): void;

  /**
   * component did mount
   */
  abstract componentDidMount(): void;

  /**
   * component will unmount
   */
  abstract componentWillUnmount(): void;

  /**
   * component did unmount
   */
  abstract componentDidUnmount(): void;
}

