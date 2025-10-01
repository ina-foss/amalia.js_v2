import { Utils } from './utils';

describe('Utils', () => {


    it('Utils:  ', () => {
        const array1 = ['1', '2', '3'];
        expect(Utils.isArrayLike(array1)).toEqual(true);
    });




    it('devrait retourner true si l\'élément avec l\'ID est dans le composedPath', () => {
        const fakeEvent = {
            composedPath: () => [
                { id: 'autre-element' },
                { id: 'mon-element' },
                { id: '' }
            ]
        };

        const result = Utils.isInComposedPath('mon-element', fakeEvent);
        expect(result).toBeTrue();
    });

    it('devrait retourner false si aucun élément du composedPath n\'a l\'ID donné', () => {
        const fakeEvent = {
            composedPath: () => [
                { id: 'autre-element' },
                { id: 'encore-un' }
            ]
        };

        const result = Utils.isInComposedPath('mon-element', fakeEvent);
        expect(result).toBeFalse();
    });

    it('devrait gérer un composedPath vide', () => {
        const fakeEvent = {
            composedPath: () => []
        };

        const result = Utils.isInComposedPath('mon-element', fakeEvent);
        expect(result).toBeFalse();
    });


    describe('Utils.needsToMutePlayerShortcuts', () => {
        it('retourne false si el est null', () => {
            expect(Utils.needsToMutePlayerShortcuts(null)).toBeFalse();
        });

        it("retourne false si el n'est pas un HTMLElement (ex: SVGElement)", () => {
            const svgNS = 'http://www.w3.org/2000/svg';
            const svg = document.createElementNS(svgNS, 'svg');
            // Sanity check
            expect((svg as any) instanceof HTMLElement).toBeFalse();
            expect(Utils.needsToMutePlayerShortcuts(svg as unknown as Element)).toBeFalse();
        });

        describe('Pseudo-sélecteur :read-write', () => {
            it("utilise ':read-write' quand il est supporté (retourne true)", () => {
                const input = document.createElement('input');
                const spy = spyOn(input, 'matches').and.returnValue(true);

                expect(Utils.needsToMutePlayerShortcuts(input)).toBeTrue();
                expect(spy).toHaveBeenCalledWith(':read-write');
            });

            it("si ':read-write' lève une erreur, on retombe sur le fallback", () => {
                const textarea = document.createElement('textarea');
                // Simule un moteur ne reconnaissant pas :read-write
                spyOn(textarea, 'matches').and.callFake(() => { throw new Error('unsupported'); });
                textarea.disabled = false;
                textarea.readOnly = false;

                expect(Utils.needsToMutePlayerShortcuts(textarea)).toBeTrue();
            });

            it("si ':read-write' retourne false, le fallback s'applique (ex: input readonly => false)", () => {
                const input = document.createElement('input');
                spyOn(input, 'matches').and.returnValue(false);
                input.disabled = false;
                input.readOnly = true;

                expect(Utils.needsToMutePlayerShortcuts(input)).toBeFalse();
            });
        });

        describe('Fallback manuel : textarea', () => {
            it('textarea actif et éditable => true', () => {
                const ta = document.createElement('textarea');
                spyOn(ta, 'matches').and.returnValue(false); // pour forcer le chemin fallback
                ta.disabled = false;
                ta.readOnly = false;

                expect(Utils.needsToMutePlayerShortcuts(ta)).toBeTrue();
            });

            it('textarea readonly => false', () => {
                const ta = document.createElement('textarea');
                spyOn(ta, 'matches').and.returnValue(false);
                ta.readOnly = true;

                expect(Utils.needsToMutePlayerShortcuts(ta)).toBeFalse();
            });

            it('textarea disabled => false', () => {
                const ta = document.createElement('textarea');
                spyOn(ta, 'matches').and.returnValue(false);
                ta.disabled = true;

                expect(Utils.needsToMutePlayerShortcuts(ta)).toBeFalse();
            });
        });

        describe('Fallback manuel : input', () => {
            it('input actif et éditable => true', () => {
                const input = document.createElement('input');
                spyOn(input, 'matches').and.returnValue(false);
                input.disabled = false;
                input.readOnly = false;

                expect(Utils.needsToMutePlayerShortcuts(input)).toBeTrue();
            });

            it('input readonly => false', () => {
                const input = document.createElement('input');
                spyOn(input, 'matches').and.returnValue(false);
                input.readOnly = true;

                expect(Utils.needsToMutePlayerShortcuts(input)).toBeFalse();
            });

            it('input disabled => false', () => {
                const input = document.createElement('input');
                spyOn(input, 'matches').and.returnValue(false);
                input.disabled = true;

                expect(Utils.needsToMutePlayerShortcuts(input)).toBeFalse();
            });
        });

        describe('Fallback manuel : select', () => {
            it('select non-disabled => true', () => {
                const sel = document.createElement('select');
                spyOn(sel, 'matches').and.returnValue(false);
                sel.disabled = false;

                expect(Utils.needsToMutePlayerShortcuts(sel)).toBeTrue();
            });

            it('select disabled => false', () => {
                const sel = document.createElement('select');
                spyOn(sel, 'matches').and.returnValue(false);
                sel.disabled = true;

                expect(Utils.needsToMutePlayerShortcuts(sel)).toBeFalse();
            });
        });

        describe('Fallback manuel : button', () => {
            it('button non-disabled => true', () => {
                const btn = document.createElement('button');
                spyOn(btn, 'matches').and.returnValue(false);
                btn.disabled = false;

                expect(Utils.needsToMutePlayerShortcuts(btn)).toBeTrue();
            });

            it('button disabled => false', () => {
                const btn = document.createElement('button');
                spyOn(btn, 'matches').and.returnValue(false);
                btn.disabled = true;

                expect(Utils.needsToMutePlayerShortcuts(btn)).toBeFalse();
            });
        });

        describe('contenteditable', () => {
            it('div contenteditable => true', () => {
                const div = document.createElement('div');
                spyOn(div, 'matches').and.returnValue(false);
                div.setAttribute('contenteditable', 'true');

                // Sanity check
                expect(div.isContentEditable).toBeTrue();
                expect(Utils.needsToMutePlayerShortcuts(div)).toBeTrue();
            });

            it('div non contenteditable => false', () => {
                const div = document.createElement('div');
                spyOn(div, 'matches').and.returnValue(false);

                expect(div.isContentEditable).toBeFalse();
                expect(Utils.needsToMutePlayerShortcuts(div)).toBeFalse();
            });
        });
    });

});


