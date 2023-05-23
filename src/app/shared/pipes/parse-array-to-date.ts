import { Pipe, PipeTransform } from '@angular/core';
import { parse } from 'date-fns';

@Pipe({
  name: 'parseArrayToDate'
})
export class ParseArrayToDatePipe implements PipeTransform {

  transform(dateArray: any, end = 3, format: string = 'dd/MM/yyyy'): Date | null {
    return dateArray ? new Date(dateArray.slice(0, end)) : null;
  }

}
