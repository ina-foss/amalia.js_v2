import {PluginBase} from '../core/plugin/plugin-base';
import {AmaliaPlugin} from '../core/plugin/amalia-plugin';

/**
 * In charge to handle control bar plugin
 */
@AmaliaPlugin({
  selector: 'control-bar',
  template: `<div class="flex-container row">
                <div class="column 1"></div>
                <div class="column 2"></div>
                <div class="column 3"></div>
                <div class="column 4"></div>
            </div>`,
  style: `:host {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: #009cff;
      padding: 16px;
      border-top: 1px solid black;
      font-size: 24px;
    }
    .flex-container.row {
      -webkit-flex-direction: row;
      -ms-flex-direction: row;
      flex-direction: row;
    }
    .flex-container.row .column {
      flex-wrap: wrap;
    }`
})
export class PluginControlBar extends PluginBase {
  private readonly listOfControls = new Map<string, { icon: 'string', 'control': string }>();

  connectedCallback() {
    const elm = document.createElement('h3');
    elm.textContent = 'Boo!';
    this.shadowRoot.appendChild(elm);
    // todo create controls elements with for  control player
    console.log('connected callback');
  }

  disconnectedCallback() {
    console.log('disconnected callback');
  }

  componentWillMount() {
    console.log('component will mount');
  }

  componentDidMount() {
    console.log('component did mount');
  }

  componentWillUnmount() {
    console.log('component will unmount');
  }

  componentDidUnmount() {
    console.log('component did unmount');
  }

}
