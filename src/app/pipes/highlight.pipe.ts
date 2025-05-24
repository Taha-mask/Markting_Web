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

  transform(text: string | null | undefined, search: string | null | undefined): SafeHtml {
    // Handle null or undefined text
    if (text === null || text === undefined) {
      return this.sanitizer.bypassSecurityTrustHtml('');
    }
    
    // Handle empty or null search
    if (!search || search.trim() === '') {
      return this.sanitizer.bypassSecurityTrustHtml(text);
    }
    
    // Escape special regex characters to avoid errors
    const pattern = search.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    const regex = new RegExp(pattern, 'gi');
    
    // Replace all occurrences with highlighted version
    const replacedText = text.replace(regex, match => `<mark>${match}</mark>`);
    
    return this.sanitizer.bypassSecurityTrustHtml(replacedText);
  }
}
