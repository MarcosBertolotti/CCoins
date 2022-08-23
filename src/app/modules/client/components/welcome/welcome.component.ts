import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PartialObserver } from 'rxjs';
import { ToastService } from 'src/app/shared/services/toast.services';
import { ClientTableDTO } from '../../models/client-table.dto';
import { ClientService } from '../../services/client.service';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  me: ClientTableDTO;
  formGroup!: FormGroup;

  constructor(
    private matDialog: MatDialogRef<WelcomeComponent>,
    private formBuilder: FormBuilder,
    private clientService: ClientService,
    private toastService: ToastService,
    @Inject(MAT_DIALOG_DATA) data: ClientTableDTO,
  ) {
    this.me = data;
   }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.formGroup = this.formBuilder.group({
      nickname: [this.me.nickName, [Validators.required, Validators.maxLength(20)]],
    })
  }

  submitForm(): void {
    const nickname = this.nickname.value.trim();

    if(nickname !== this.me.nickName)
      this.changeNickName(nickname);
    else
      this.matDialog.close();
  }

  changeNickName(nickname: string): void {
    const clientObserver: PartialObserver<void> = {
      next:() => {
        this.me.nickName = nickname;
        this.clientService.nickName = nickname;
        this.clientService.clientTable = this.me;
        this.matDialog.close();
      },
      error:(error: HttpErrorResponse) => {
        this.toastService.openErrorToast("Ha ocurrido un error al intentar cambiar el nombre.");
        this.matDialog.close();
      }
    }
    this.clientService.changeName(nickname).subscribe(clientObserver);
  }

  get nickname() { return this.formGroup.get('nickname') as FormControl }

}
