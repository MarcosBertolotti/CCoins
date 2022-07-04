import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FIELD_ERROR_MESSAGES } from 'src/app/const/field-error-messages.const';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit {

  @Input()
  items: any[] | null = [];

  @Input()
  placeholder!: string;

  @Input()
  name!: string;

  @Input()
  label!: string;
  
  @Input()
  formGroup!: FormGroup;

  @Input()
  displayValue!: (item: any) => string;

  fieldErrorMessages: any = FIELD_ERROR_MESSAGES;

  constructor() { }

  ngOnInit(): void {
  }

  get control(): FormControl {
    return this.formGroup.get(this.name) as FormControl;
  }
}
