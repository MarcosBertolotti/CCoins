import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FIELD_ERROR_MESSAGES } from 'src/app/const/field-error-messages.const';
import { AppPaths } from 'src/app/enums/app-paths.enum';
import { Bar } from 'src/app/models/bar-model';
import { BarService } from 'src/app/services/bar.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { ToastService } from 'src/app/shared/services/toast.services';

@Component({
  selector: 'app-bar-create',
  templateUrl: './bar-create.component.html',
  styleUrls: ['./bar-create.component.scss']
})
export class BarCreateComponent implements OnInit, OnDestroy {

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
    private navigationService: NavigationService,
  ) { 
    this.navigationService.showNavbar();
  }

  ngOnDestroy(): void {
    this.navigationService.hideNavbar();
  }

  async ngOnInit(): Promise<void> {
    this.buildForm();
  }

  buildForm() {
    this.formGroup = this.formBuilder.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      location: ['', [Validators.required]],
      menuLink: [''],
      openTime: [''],
      closeTime: [''],
    });
  }
  
  async submitForm(): Promise<void> {
    if (this.formGroup.valid) {
      const newBar: Bar = {
        name: this.name.value.trim(),
        address: this.address.value.trim(),
        location: this.location.value.trim(),
        menuLink: this.menuLink.value.trim(),
        openTime: this.openTime.value,
        closeTime: this.closeTime.value,
        active: true,
      }

      const barCreated = await this.barService.create(newBar)
        .catch((error: HttpErrorResponse) => {
          //const message = error.error?.name === ApiErrorResponses.EXISTING_OBJECT ? 'Ya existe un Bar' : error.message;
          this.toastService.openErrorToast(error.error?.message);
        });

      if(barCreated) {
        this.ngForm['resetForm']();
        this.toastService.openSuccessToast('Bar creado exitosamente!');
        this.router.navigate([AppPaths.ADMIN, AppPaths.BAR, AppPaths.UPDATE, barCreated.id]);
      }
    }
  }

  get name() { return this.formGroup.get('name') as FormControl }
  get address() { return this.formGroup.get('address') as FormControl }
  get location() { return this.formGroup.get('location') as FormControl }
  get menuLink() { return this.formGroup.get('menuLink') as FormControl }
  get openTime() { return this.formGroup.get('openTime') as FormControl }
  get closeTime() { return this.formGroup.get('closeTime') as FormControl }

}