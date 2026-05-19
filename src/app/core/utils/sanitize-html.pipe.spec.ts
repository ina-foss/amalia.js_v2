import { SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SanitizeHtmlPipe } from './sanitize-html.pipe';

describe('SanitizeHtmlPipe', () => {
    let sanitizer: jasmine.SpyObj<DomSanitizer>;
    let pipe: SanitizeHtmlPipe;

    beforeEach(() => {
        sanitizer = jasmine.createSpyObj<DomSanitizer>('DomSanitizer', ['sanitize']);
        sanitizer.sanitize.and.callFake((ctx: SecurityContext, value: string) => `${ctx}:${value}`);
        pipe = new SanitizeHtmlPipe(sanitizer);
    });

    it('should sanitize html', () => {
        const result = pipe.transform('<b>x</b>', 'html');
        expect(sanitizer.sanitize).toHaveBeenCalledWith(SecurityContext.HTML, '<b>x</b>');
        expect(result).toContain('<b>x</b>');
    });

    it('should sanitize style/script/url/resourceUrl', () => {
        expect(pipe.transform('color:red', 'style')).toContain('color:red');
        expect(pipe.transform('alert(1)', 'script')).toContain('alert(1)');
        expect(pipe.transform('https://x', 'url')).toContain('https://x');
        expect(pipe.transform('https://cdn/x', 'resourceUrl')).toContain('https://cdn/x');
        expect(sanitizer.sanitize).toHaveBeenCalledWith(SecurityContext.STYLE, 'color:red');
        expect(sanitizer.sanitize).toHaveBeenCalledWith(SecurityContext.SCRIPT, 'alert(1)');
        expect(sanitizer.sanitize).toHaveBeenCalledWith(SecurityContext.URL, 'https://x');
        expect(sanitizer.sanitize).toHaveBeenCalledWith(SecurityContext.RESOURCE_URL, 'https://cdn/x');
    });

    it('should throw for invalid type', () => {
        expect(() => pipe.transform('x', 'invalid')).toThrowError('Invalid safe type specified: invalid');
    });
});

