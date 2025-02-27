import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  transform(arr: any[], text: string): any[] {
    return arr.filter((item) => {
      if (item.title) {
        return item.title.toLowerCase().includes(text.toLowerCase());
      }
      if (item.name) {
        return item.name.toLowerCase().includes(text.toLowerCase());
      }
    });
  }
}
