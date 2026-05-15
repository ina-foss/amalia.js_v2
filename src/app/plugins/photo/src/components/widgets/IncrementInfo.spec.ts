import IncrementInfo from './IncrementInfo';

describe('IncrementInfo', () => {
    it('should increment and decrement with bounds and emit change', () => {
        const widget = new IncrementInfo(25, null, 10, 200, {});
        const emitted: number[] = [];
        widget.getDom().addEventListener(IncrementInfo.events.change, (e: any) => {
            emitted.push(e.detail.value);
        });

        widget.setResultValue(100);
        widget.increment();
        expect(widget.getDom().querySelector('.ajs-photo-result')?.textContent).toBe('125');

        widget.decrement();
        expect(widget.getDom().querySelector('.ajs-photo-result')?.textContent).toBe('100');

        widget.setResultValue(200);
        widget.increment();
        expect(widget.getDom().querySelector('.ajs-photo-result')?.textContent).toBe('200');

        widget.setResultValue(10);
        widget.decrement();
        expect(widget.getDom().querySelector('.ajs-photo-result')?.textContent).toBe('10');

        expect(emitted.length).toBeGreaterThan(0);
        widget.removeFromDom();
    });

    it('should use steps for increment/decrement', () => {
        const widget = new IncrementInfo(25, [50, 100, 200], 10, 300, {});
        widget.setResultValue(100);
        widget.increment();
        expect(widget.getDom().querySelector('.ajs-photo-result')?.textContent).toBe('200');

        widget.decrement();
        expect(widget.getDom().querySelector('.ajs-photo-result')?.textContent).toBe('100');
        widget.removeFromDom();
    });

    it('should emit centered event on showRealSize and handle enable/disable', () => {
        const widget = new IncrementInfo(25, null, 10, 300, {});
        let centerFlag = false;
        widget.getDom().addEventListener(IncrementInfo.events.change, (e: any) => {
            centerFlag = !!e.detail.center;
        });

        widget.showRealSize();
        expect(widget.getDom().querySelector('.ajs-photo-result')?.textContent).toBe('100');
        expect(centerFlag).toBeTrue();

        widget.disable();
        expect(widget.getDom().querySelector('.ajs-photo-result')?.className).toContain('ajs-photo-disable');

        widget.enable();
        expect(widget.getDom().querySelector('.ajs-photo-result')?.className).not.toContain('ajs-photo-disable');
        widget.removeFromDom();
    });
});

