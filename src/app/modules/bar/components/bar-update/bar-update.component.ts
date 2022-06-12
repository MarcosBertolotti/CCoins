import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FIELD_ERROR_MESSAGES } from 'src/app/const/fieldErrorMessages.const';
import { Bar } from 'src/app/models/bar-model';
import { BarService } from 'src/app/services/bar.service';
import { ToastService } from 'src/app/shared/services/toast.services';

@Component({
  selector: 'app-bar-update',
  templateUrl: './bar-update.component.html',
  styleUrls: ['./bar-update.component.scss']
})
export class BarUpdateComponent implements OnInit {

  formGroup!: FormGroup;

  fieldErrors = FIELD_ERROR_MESSAGES;
  
  constructor(
    private formBuilder: FormBuilder,
    private barService: BarService,
    private toastService: ToastService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.buildForm();
  }

  buildForm() {
    this.formGroup = this.formBuilder.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      menuLink: [''],
    });
  }
  
  async submitForm(): Promise<void> {
    if (this.formGroup.valid) {
      const newBar: Bar = {
        name: this.name.value.trim(),
         address: this.address.value.trim(),
        city: this.city.value.trim(),
        menuLink: this.menuLink.value.trim(),
      }

      const barCreated = await this.barService.create(newBar)
        .catch((error: HttpErrorResponse) => {
          //const message = error.error?.name === ApiErrorResponses.EXISTING_OBJECT ? 'Ya existe un Bar' : error.message;
          this.toastService.openErrorToast(error.error.message);
        });

      if(barCreated)
        this.toastService.openSuccessToast('Bar creado exitosamente!');
    }
  }

  get name() { return this.formGroup.get('name') as FormControl }
  get address() { return this.formGroup.get('address') as FormControl }
  get city() { return this.formGroup.get('city') as FormControl }
  get menuLink() { return this.formGroup.get('menuLink') as FormControl }

}
