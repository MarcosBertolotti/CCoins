import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { FIELD_ERROR_MESSAGES } from 'src/app/const/field-error-messages.const';


@Pipe({
  name: 'errorMessage',
  pure: false
})
export class ErrorMessagePipe implements PipeTransform {

  constructor() {}

  transform(name: string, form: FormGroup, text?: string): string | undefined {
    let message: string;
    const abstractControl = form.get(name);

    for (let propertyName in abstractControl?.errors) {
      switch (propertyName) {
        case "required":
          message = FIELD_ERROR_MESSAGES.required;
          break;
        case "minlength":
          message = FIELD_ERROR_MESSAGES.minlength8;
          break;
        case "email":
          message = FIELD_ERROR_MESSAGES.email;
          break;
        case "pattern":
          message = FIELD_ERROR_MESSAGES.email;
          break;
        case "min":
          message = `${FIELD_ERROR_MESSAGES.minQuantity} ${abstractControl?.errors?.['min'].min} ${text}`;
          break;
        case "max":
          message = `${FIELD_ERROR_MESSAGES.maxQuantity} ${abstractControl?.errors?.['max'].max} ${text}`;
          break;
        default:
          message = "Campo invalido."
      }
      return message;
    }
    return undefined;
  }
}
