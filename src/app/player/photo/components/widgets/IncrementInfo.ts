import BaseHtmlElement from "../BaseHtmlElement";
import Utils from "../../business/Utils";

export default class IncrementInfo extends BaseHtmlElement {

    private readonly _btnMinus: HTMLButtonElement;
    private readonly _btnPlus: HTMLButtonElement;
    private readonly _resultSpan: HTMLElement;
    private readonly _increment: number;
    private readonly _steps: number[];
    private readonly _max: number;
    private readonly _min: number;

    public static readonly events: any = {
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
            const sortedSteps = [...steps];
            sortedSteps.sort((a: number, b: number) => a - b);
            this._steps = sortedSteps;
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

        this._btnMinus = document.createElement('button');
        this._btnMinus.className = settings.minus.className + ' ajs-photo-minus';
        this._btnMinus.addEventListener('click', this.decrement.bind(this));

        this._btnPlus = document.createElement('button');
        this._btnPlus.className = settings.plus.className + ' ajs-photo-plus';
        this._btnPlus.addEventListener('click', this.increment.bind(this));

        this._resultSpan = document.createElement('span');
        this._resultSpan.className = settings.result.className;
        this._resultSpan.addEventListener('click', this.showRealSize.bind(this));

        this.dom.appendChild(this._btnMinus);
        this.dom.appendChild(this._resultSpan);
        this.dom.appendChild(this._btnPlus);
    }

    public increment() {
        const currentValue: number = this.getCurrentValue();
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
        const currentValue: number = this.getCurrentValue();
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
        const normalizedValue: number = this.normalizeValue(value);
        this._resultSpan.textContent = normalizedValue.toString();
        return normalizedValue;
    }

    private getCurrentValue(): number {
        return this.normalizeValue(parseInt(this._resultSpan.textContent || '100', 10));
    }

    private normalizeValue(value: number): number {
        if (!Number.isFinite(value)) {
            return 100;
        }
        let normalizedValue: number = Math.round(value);
        if (this._min !== null && normalizedValue < this._min) {
            normalizedValue = this._min;
        }
        if (this._max !== null && normalizedValue > this._max) {
            normalizedValue = this._max;
        }
        return normalizedValue;
    }

    public enable() {
        this._btnMinus.disabled = false;
        this._btnPlus.disabled = false;
        this._resultSpan.style.pointerEvents = 'auto';
    }

    public disable() {
        this._btnMinus.disabled = true;
        this._btnPlus.disabled = true;
        this._resultSpan.style.pointerEvents = 'none';
    }

    public override removeFromDom() {
        super.removeFromDom();
    }
}
