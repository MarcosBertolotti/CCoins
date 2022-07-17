import { Pipe, PipeTransform } from '@angular/core';
import { parse } from 'date-fns';

@Pipe({
  name: 'parseArrayToDate'
})
export class ParseArrayToDatePipe implements PipeTransform {

  transform(dateArray: any, format: string = 'dd/MM/yyyy'): Date {
    return new Date(dateArray.slice(0, 3));
  }

}
