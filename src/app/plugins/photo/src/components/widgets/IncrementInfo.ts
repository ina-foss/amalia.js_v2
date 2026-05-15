import BaseHtmlElement from "../BaseHtmlElement";
import BaseButton from "../buttons/BaseButton";
import Utils from "../../business/Utils";

export default class IncrementInfo extends BaseHtmlElement {

    private _btnMinus: BaseButton;
    private _btnPlus: BaseButton;
    private _resultSpan: BaseButton;
    private readonly _increment: number;
    private readonly _steps: number[];
    private readonly _max: number;
    private readonly _min: number;

    public static events: any = {
        change: 'ina.amalia.photo.event.incrementinfo.change'
    };

    constructor(increment: number = 1,
                steps: number[] = null,
                min: number = null,
                max: number = null,
                settings: any = null) {
        super();
        this._increment = increment;
        if (steps) {
            this._steps = steps.sort((a: number, b: number) => a - b);
        }
        this._min = min;
        this._max = max;
        this.dom = document.createElement('div');
        this.addClass('ajs-photo-percentage-info');

        settings = Utils.mergeDeep({}, settings, {
            minus: {
                className: 'ajs-photo-operator'
            },
            result: {
                className: 'ajs-photo-result'
            },
            plus: {
                className: 'ajs-photo-operator'
            }
        });

        this._btnMinus = new BaseButton(settings.minus, this.decrement.bind(this))
            .addClass('ajs-photo-minus');

        this._btnPlus = new BaseButton(settings.plus, this.increment.bind(this))
            .addClass('ajs-photo-plus');

        this._resultSpan = new BaseButton(settings.result, this.showRealSize.bind(this));

        this.dom.appendChild(this._btnMinus.getDom());
        this.dom.appendChild(this._resultSpan.getDom());
        this.dom.appendChild(this._btnPlus.getDom());
    }

    public increment() {
        const currentValue: number = parseInt(this._resultSpan.getTextContent('.ajs-photo-result'), 10);
        if (this._max !== null && currentValue === this._max) {
            return;
        }

        let newValue: number;
        if (!this._steps) {
            newValue = Utils.roundToMultiple(currentValue + this._increment, this._increment);
            if (this._max !== null && newValue > this._max) {
                newValue = this._max;
            }
        } else {
            newValue = Utils.roundToSteps(currentValue, this._steps, 'next');
        }

        const v: number = this.setResultValue(newValue);
        if (v !== null) {
            this.dom.dispatchEvent(new CustomEvent(IncrementInfo.events.change, {
                detail: {
                    value: v
                }
            }));
        }
    }

    public decrement() {
        const currentValue: number = parseInt(this._resultSpan.getTextContent('.ajs-photo-result'), 10);
        if (this._min !== null && currentValue === this._min) {
            return;
        }

        let newValue: number;
        if (!this._steps) {
            newValue = Utils.roundToMultiple(currentValue + this._increment * -1, this._increment);
            if (newValue + this._increment < currentValue) {
                newValue = newValue + this._increment;
            }
            if (this._min !== null && newValue < this._min) {
                newValue = this._min;
            }
        } else {
            newValue = Utils.roundToSteps(currentValue, this._steps, 'prev');
        }

        const v: number = this.setResultValue(newValue);
        if (v !== null) {
            this.dom.dispatchEvent(new CustomEvent(IncrementInfo.events.change, {
                detail: {
                    value: v
                }
            }));
        }
    }

    public showRealSize() {
        const v: number = this.setResultValue(100);
        this.dom.dispatchEvent(new CustomEvent(IncrementInfo.events.change, {
            detail: {
                value: v,
                center: true
            }
        }));
    }

    public setResultValue(value: number) {
        this._resultSpan.setTextContent(value.toString(), '.ajs-photo-result');
        return value;
    }

    public enable() {
        this._btnMinus.enable();
        this._btnPlus.enable();
        this._resultSpan.enable();
    }

    public disable() {
        this._btnMinus.disable();
        this._btnPlus.disable();
        this._resultSpan.disable();
    }

    public removeFromDom() {
        this._btnPlus.removeFromDom();
        this._btnMinus.removeFromDom();
        this._resultSpan.removeFromDom();
        super.removeFromDom();
    }
}

