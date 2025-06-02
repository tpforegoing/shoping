import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'localDate',
  standalone: true
})
export class LocalDatePipe implements PipeTransform {
  private datePipe = new DatePipe('uk-UA');

  transform(value: string | Date, format: string = 'yyyy-MM-dd HH:mm:ss'): string | null {
    return this.datePipe.transform(value, format);
  }
}