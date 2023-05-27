import { Pipe, PipeTransform } from '@angular/core';
import { parse } from 'date-fns';

@Pipe({
  name: 'parseArrayToDate'
})
export class ParseArrayToDatePipe implements PipeTransform {

  transform(dateArray: number[], end = 3, format: string = 'dd/MM/yyyy'): any {
    const date = dateArray?.slice(0, end) as any;
    return date ? new Date(date).setHours(dateArray[3] || 0, dateArray[4] || 0) : null;
  }

}
