import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Table } from 'src/app/models/table.model';
import { TableParty } from '../../models/table-party.model';
import { codeService } from '../../services/code.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from 'src/app/shared/services/toast.services';
import { ResponseData } from 'src/app/models/response-data.model';
import { CoinsRegister } from 'src/app/models/coins-register.model';

@Component({
  selector: 'app-code-redeem',
  templateUrl: './code-redeem.component.html',
  styleUrls: ['./code-redeem.component.scss']
})
export class CodeRedeemComponent implements OnInit {

  formGroup!: FormGroup;
  barTables: TableParty[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private codeService: codeService,
    private toastService: ToastService,
    private matDialogRef: MatDialogRef<CodeRedeemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { tables: TableParty[] }
  ) {
    this.barTables = this.data?.tables || [];
   }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.formGroup = this.formBuilder.group({
      code: [null, Validators.required],
      table: [null, Validators.required],
    });
  }

  submitForm(): void {
    const { code, partyId } = {
      code: this.code.value?.trim(),
      partyId: this.table.value?.id,
    }

    this.codeService.redeem(code, partyId)
    .then((response: ResponseData<CoinsRegister>) => {
      if(response?.message && response?.data) {
        this.toastService.openSuccessToast(response.message);
        this.matDialogRef.close(true);
      } else
        this.toastService.openErrorToast(response.message);
    })
    .catch((error: HttpErrorResponse) => this.toastService.openErrorToast(error.error?.message))
  }

  displayItemFn(item?: TableParty): string {
    return `Nro. ${item?.tableNumber} - ${item?.name}` || "";
  }

  get code() { return this.formGroup.get('code') as FormControl }
  get table() { return this.formGroup.get('table') as FormControl }
}
