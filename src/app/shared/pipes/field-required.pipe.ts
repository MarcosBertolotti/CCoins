import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Pipe({
  name: 'fieldRequired'
})
export class FieldRequiredPipe implements PipeTransform {

  transform(abstractControl: AbstractControl | null): boolean {
    if (abstractControl) {
      if (abstractControl.validator) {
        const validator = abstractControl.validator({} as AbstractControl);
        if (validator && validator['required']) {
          return true;
        }
      }
    }
    return false;
  };
}
