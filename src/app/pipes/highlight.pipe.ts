import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'replace',
  standalone: true
})
export class ReplacePipe implements PipeTransform {
  transform(value: string, strToReplace: string, replacementStr: string): string {
    if (!value) {
      return value;
    }
    return value.replace(new RegExp(strToReplace, 'g'), replacementStr);
  }
}

@Pipe({
  name: 'highlight',
  standalone: true
})
export class HighlightPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(text: string, search: string): SafeHtml {
    if (!search) {
      return this.sanitizer.bypassSecurityTrustHtml(text);
    }
    const pattern = search.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    const regex = new RegExp(pattern, 'gi');
    const match = text.match(regex);

    if (!match) {
      return this.sanitizer.bypassSecurityTrustHtml(text);
    }

    const replacedText = text.replace(regex, `<mark>${match[0]}</mark>`);
    return this.sanitizer.bypassSecurityTrustHtml(replacedText);
  }
}
