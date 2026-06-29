import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filterByName' })
export class FilterByNamePipe implements PipeTransform {
  transform(items: any[], search: string): any[] {
    if (!items || !search) return items;
    const s = search.toLowerCase();
    return items.filter(i =>
      (i.name || '').toLowerCase().includes(s) ||
      (i.shortName || '').toLowerCase().includes(s) ||
      (i.fullName || '').toLowerCase().includes(s) ||
      (i.article || '').toLowerCase().includes(s)
    );
  }
}