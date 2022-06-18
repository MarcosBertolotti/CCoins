import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FIELD_ERROR_MESSAGES } from 'src/app/const/field-error-messages.const';
import { AppPaths } from 'src/app/enums/app-paths.enum';
import { Bar } from 'src/app/models/bar-model';
import { BarService } from 'src/app/services/bar.service';
import { ToastService } from 'src/app/shared/services/toast.services';

@Component({
  selector: 'app-bar-create',
  templateUrl: './bar-create.component.html',
  styleUrls: ['./bar-create.component.scss']
})
export class BarCreateComponent implements OnInit {

  @ViewChild('form') 
  ngForm!: HTMLFormElement;

  formGroup!: FormGroup;

  fieldErrors = FIELD_ERROR_MESSAGES;
  barPathBase = AppPaths.BAR;
  
  constructor(
    private formBuilder: FormBuilder,
    private barService: BarService,
    private toastService: ToastService,
    private router: Router,
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
      //  city: this.city.value.trim(),
        menuLink: this.menuLink.value.trim(),
      }

      const barCreated = await this.barService.create(newBar)
        .catch((error: HttpErrorResponse) => {
          //const message = error.error?.name === ApiErrorResponses.EXISTING_OBJECT ? 'Ya existe un Bar' : error.message;
          this.toastService.openErrorToast(error.error.message);
        });

      if(barCreated) {
        this.ngForm['resetForm']();
        this.toastService.openSuccessToast('Bar creado exitosamente!');
        this.router.navigate([AppPaths.SIDENAV, AppPaths.BAR, AppPaths.UPDATE, barCreated.id]);
      }
    }
  }

  get name() { return this.formGroup.get('name') as FormControl }
  get address() { return this.formGroup.get('address') as FormControl }
  get city() { return this.formGroup.get('city') as FormControl }
  get menuLink() { return this.formGroup.get('menuLink') as FormControl }

}