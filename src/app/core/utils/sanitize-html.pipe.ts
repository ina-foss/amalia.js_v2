import {Pipe, PipeTransform, SecurityContext} from '@angular/core';
import {DomSanitizer, SafeHtml, SafeResourceUrl, SafeScript, SafeStyle, SafeUrl} from '@angular/platform-browser';
import DOMPurify from 'dompurify';

@Pipe({name: 'sanitizeHtml', pure: false})
export class SanitizeHtmlPipe implements PipeTransform {

    constructor(protected sanitizer: DomSanitizer) {
    }

    public transform(value: any, type: string): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
        value = DOMPurify.sanitize(value);
        switch (type) {
            case 'html':
                return this.sanitizer.sanitize(SecurityContext.HTML, this.sanitizer.bypassSecurityTrustHtml(value));
            case 'style':
                return this.sanitizer.sanitize(SecurityContext.STYLE, this.sanitizer.bypassSecurityTrustStyle(value));
            case 'script':
                return this.sanitizer.sanitize(SecurityContext.SCRIPT, this.sanitizer.bypassSecurityTrustScript(value));
            case 'url':
                return this.sanitizer.sanitize(SecurityContext.URL, this.sanitizer.bypassSecurityTrustUrl(value));
            case 'resourceUrl':
                return this.sanitizer.sanitize(SecurityContext.RESOURCE_URL, this.sanitizer.bypassSecurityTrustResourceUrl(value));
            default:
                throw new Error(`Invalid safe type specified: ${type}`);
        }
    }
}
