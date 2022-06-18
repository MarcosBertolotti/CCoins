import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FIELD_ERROR_MESSAGES } from 'src/app/const/field-error-messages.const';
import { AppPaths } from 'src/app/enums/app-paths.enum';
import { Bar } from 'src/app/models/bar-model';
import { Table } from 'src/app/models/table.model';
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
  idBar!: number;
  barTables: Table[] = [];
  formGroup!: FormGroup;

  fieldErrors = FIELD_ERROR_MESSAGES;
  barPathBase = AppPaths.BAR;
  
  constructor(
    private formBuilder: FormBuilder,
    private barService: BarService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router,
    private tableService: TableService,
  ) { }

  async ngOnInit(): Promise<void> {    
    this.idBar = +this.route.snapshot.paramMap.get('id')!;

    const bar: Bar = await this.barService.findById(this.idBar);
    if (!bar) this.goToHome();

    const tables: any = await this.tableService.findAllByBar(bar.id!)
      .catch((error: HttpErrorResponse) => console.error(error.error.message));

    if(tables && tables.list?.length > 0) this.barTables = tables.list;

    this.bar = bar;
    this.buildForm();
  }

  private goToHome(): void {
    this.router.navigate(['/']);
  }

  private buildForm() {
    this.formGroup = this.formBuilder.group({
      name: [this.bar.name, [Validators.required]],
      address: [this.bar.address, [Validators.required]],
      city: [this.bar.city, [Validators.required]],
      menuLink: [this.bar.menuLink],
      tables: [this.barTables.length, [Validators.required, Validators.min(1), Validators.max(20)]]
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
      
      let quantityToCreate = (this.tables.value - this.barTables.length);
      quantityToCreate = quantityToCreate > 0 ? quantityToCreate : 0;
      const tablesCreated = this.tableService.createByQuantity(quantityToCreate, this.bar.id!)
        .catch((error: HttpErrorResponse) => {
          //const message = error.error?.name === ApiErrorResponses.EXISTING_OBJECT ? 'Ya existe un Bar' : error.message;
          this.toastService.openErrorToast(error.error.message);
        });

      const response = await Promise.all([barCreated, tablesCreated]);

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
