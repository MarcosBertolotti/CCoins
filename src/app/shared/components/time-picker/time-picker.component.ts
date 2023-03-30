import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss']
})
export class TimePickerComponent implements OnInit {

  @Input()
  formGroup!: FormGroup;

  constructor() { }

  ngOnInit(): void {
    this.openTime?.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(0),
      tap((openTimeValue) => {
        if (openTimeValue || this.closeTime.value) {
          this.openTime.setValidators(Validators.required);
          this.closeTime.setValidators(Validators.required);
        } else {
          this.openTime.clearValidators();
          this.closeTime.clearValidators();
        }
        this.openTime.updateValueAndValidity();
        this.closeTime.updateValueAndValidity();
      }),
    )
    .subscribe();

    this.closeTime?.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(0),
      tap((closeTimeValue) => {
        if (closeTimeValue || this.openTime.value) {
          this.openTime.setValidators(Validators.required);
          this.closeTime.setValidators(Validators.required);
        } else {
          this.openTime.clearValidators();
          this.closeTime.clearValidators();
        }
        this.openTime.updateValueAndValidity();
        this.closeTime.updateValueAndValidity();
      }),
    )
    .subscribe();
  }

  get openTime() { return this.formGroup?.get('openTime') as FormControl }
  get closeTime() { return this.formGroup?.get('closeTime') as FormControl }
}
