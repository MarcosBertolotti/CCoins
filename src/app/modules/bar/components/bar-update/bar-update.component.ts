import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FIELD_ERROR_MESSAGES } from 'src/app/const/field-error-messages.const';
import { Bar } from 'src/app/models/bar-model';
import { BarService } from 'src/app/services/bar.service';
import { TableService } from 'src/app/services/table.service';
import { ToastService } from 'src/app/shared/services/toast.services';

@Component({
  selector: 'app-bar-update',
  templateUrl: './bar-update.component.html',
  styleUrls: ['./bar-update.component.scss']
})
export class BarUpdateComponent implements OnInit {

  bar!: Bar;
  formGroup!: FormGroup;

  fieldErrors = FIELD_ERROR_MESSAGES;
  
  constructor(
    private formBuilder: FormBuilder,
    private barService: BarService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router,
    private tableService: TableService,
  ) { }

  async ngOnInit(): Promise<void> {    
    const idBar = this.route.snapshot.paramMap.get('id')!;
    
    if (!idBar) this.router.navigate(['/']);

    this.bar = await this.barService.findById(+idBar);
    this.buildForm();
  }

  buildForm() {
    this.formGroup = this.formBuilder.group({
      name: [this.bar.name, [Validators.required]],
      address: [this.bar.address, [Validators.required]],
      city: [this.bar.city, [Validators.required]],
      menuLink: [this.bar.menuLink],
      tables: ['', [Validators.required, Validators.min(1), Validators.max(20)]],
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

      const barCreated = this.barService.create(newBar)
        .catch((error: HttpErrorResponse) => {
          //const message = error.error?.name === ApiErrorResponses.EXISTING_OBJECT ? 'Ya existe un Bar' : error.message;
          this.toastService.openErrorToast(error.error.message);
        });

      const tablesCreated = this.tableService.createByQuantity(this.tables.value, this.bar.id!)
        .catch((error: HttpErrorResponse) => {
          //const message = error.error?.name === ApiErrorResponses.EXISTING_OBJECT ? 'Ya existe un Bar' : error.message;
          this.toastService.openErrorToast(error.error.message);
        });

      const response = await Promise.all([barCreated, tablesCreated]);
      console.log("response: ", response)

      if(response[0])
        this.toastService.openSuccessToast('Bar actualizado exitosamente!');
    }
  }

  async toggleActive(): Promise<void> {
    const updatedBar = await this.barService.updateActive(this.bar.id!)
      .catch((error: HttpErrorResponse) => {
        //const message = error.error?.name === ApiErrorResponses.EXISTING_OBJECT ? 'Ya existe un Bar' : error.message;
        this.toastService.openErrorToast(error.error.message);
      });
    
    if(updatedBar)
      this.bar.active = updatedBar.active!;
  }

  get name() { return this.formGroup.get('name') as FormControl }
  get address() { return this.formGroup.get('address') as FormControl }
  get city() { return this.formGroup.get('city') as FormControl }
  get menuLink() { return this.formGroup.get('menuLink') as FormControl }
  get tables() { return this.formGroup.get('tables') as FormControl }
}
