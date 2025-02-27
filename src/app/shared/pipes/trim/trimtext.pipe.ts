import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trimtext',
})
export class TrimtextPipe implements PipeTransform {
  transform(value: string, words: number): string {
    return value.split(' ', words).join(' ');
  }
}
