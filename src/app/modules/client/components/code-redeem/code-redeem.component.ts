import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CoinsRegister } from 'src/app/models/coins-register.model';
import { ResponseData } from 'src/app/models/response-data.model';
import { ToastService } from 'src/app/shared/services/toast.services';
import { CodeService } from '../../services/code.service';

@Component({
  selector: 'app-code-redeem',
  templateUrl: './code-redeem.component.html',
  styleUrls: ['./code-redeem.component.scss']
})
export class CodeRedeemComponent implements OnInit {

  formGroup!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private codeService: CodeService,
    private toastService: ToastService,
    private matDialogRef: MatDialogRef<CodeRedeemComponent>,
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.formGroup = this.formBuilder.group({
      code: [null, Validators.required],
    });
  }

  submitForm(): void {
    const code = this.code.value?.trim();

    this.codeService.redeem(code)
    .then((response: ResponseData<CoinsRegister>) => {
      console.log("response: ", response);
      if(response?.message && response?.data) {
        this.toastService.openSuccessToast(response.message);
        this.matDialogRef.close(true);
      } else
        this.toastService.openErrorToast(response.message);
    })
    .catch((error: HttpErrorResponse) => this.toastService.openErrorToast(error.error?.message))
  }

  get code() { return this.formGroup.get('code') as FormControl }
}
