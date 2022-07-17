import { Pipe, PipeTransform } from '@angular/core';
import { parse } from 'date-fns';

@Pipe({
  name: 'parseToDate'
})
export class ParseToDatePipe implements PipeTransform {

  transform(dateString: string, format: string = 'dd/MM/yyyy'): Date {
    return parse(dateString, format, new Date());
  }

}
