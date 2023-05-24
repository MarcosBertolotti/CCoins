import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Table } from 'src/app/models/table.model';

@Component({
  selector: 'app-code-redeem',
  templateUrl: './code-redeem.component.html',
  styleUrls: ['./code-redeem.component.scss']
})
export class CodeRedeemComponent implements OnInit {

  formGroup!: FormGroup;
  barTables: Table[] = [];

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { tables: Table[] }
  ) {
    this.barTables = this.data?.tables || [];
   }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.formGroup = this.formBuilder.group({
      code: [null, Validators.required],
      tables: [null, Validators.required],
    });
  }

  submitForm(): void {

  }

  displayItemFn(item?: Table): string {
    return `${item?.number}` || "";
  }

  get code() { return this.formGroup.get('code') as FormControl }
  get tables() { return this.formGroup.get('tables') as FormControl }
}
