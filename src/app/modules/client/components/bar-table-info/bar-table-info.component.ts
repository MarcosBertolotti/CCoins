import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, PartialObserver } from 'rxjs';
import { ResponseList } from 'src/app/models/response-list.model';
import { ToastService } from 'src/app/shared/services/toast.services';
import { ClientPaths } from '../../enums/client-paths.eum';
import { WarningType } from '../../enums/warning-type.enum';
import { ClientTableDTO } from '../../models/client-table.dto';
import { Client } from '../../models/client.model';
import { Party } from '../../models/party.model';
import { ClientService } from '../../services/client.service';
import { PartyService } from '../../services/party.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-bar-table-info',
  templateUrl: './bar-table-info.component.html',
  styleUrls: ['./bar-table-info.component.scss']
})
export class BarTableInfoComponent implements OnInit {

  me!: ClientTableDTO;
  nickName$!: Observable<string>;

  party!: Party;
  clients!: Client[];
  formGroup!: FormGroup;
  
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private toastService: ToastService,
    private partyService: PartyService,
    private clientService: ClientService,
  ) { }

  ngOnInit(): void {
    this.me = this.clientService.clientTable;
    this.nickName$ = this.clientService.nickName$;

    this.getClients();
    this.getParty();
  }

  getClients(): void {
    const partyClientsObserver: PartialObserver<ResponseList<Client>> = {
      next: (clients: ResponseList<Client>) => {
        this.clients = clients?.list || [];
        this.buildForm();
      },
      error: (error: HttpErrorResponse) => this.toastService.openErrorToast(error.error?.message)
    };
    this.partyService.getInfoClients(this.me.partyId).subscribe(partyClientsObserver);
  }

  getParty(): void {
    const partyObserver: PartialObserver<Party> = {
      next: (partyInfo: Party) => {
        this.party = partyInfo;
      },
      error: (error: HttpErrorResponse) => this.toastService.openErrorToast(error.error?.message)
    };
    this.partyService.getInfo(this.me.partyId).subscribe(partyObserver);
  }

  buildForm(): void {
    this.formGroup = this.formBuilder.group({
      members: this.formBuilder.array([])
    });

    this.addCheckboxes();
  }

  private addCheckboxes() {
    this.clients.forEach(() => {
      (this.formGroup.get('members') as FormArray).push(new FormControl(false));
    });
  }

  logout(): void {
    const clientsObserver: PartialObserver<void> = {
      next: () => this.router.navigate([ClientPaths.WARNING_LOGIN], { queryParams: {
        type: WarningType.LOGOUT
      }}),
      error: (error: HttpErrorResponse) => this.toastService.openErrorToast(error.error?.message)
    };
    this.clientService.logout().subscribe(clientsObserver);
  }

  openSetLeaderDialog(client: Client): void {
    this.matDialog.open(DialogComponent, {
      backdropClass: 'back-drop-dialog',
      panelClass: 'custom-dialog-container-dark',
      width: '80%',
      maxWidth: '350px',
      disableClose: true,
      data: {
        title: 'Atención!',
        messages: [`Estás por ceder el lider de la party a ${client.nickName}, estás seguro de continuar?`],
        canCancel: true,
        actions: [
          {
            message: 'Ceder',
            action: () => {
              this.setLeader(client.id);
            },
          },
        ],
      },
    });
  }

  setLeader(clientId: number): void {
    const clientsObserver: PartialObserver<any> = {
      next: () => {
        this.toastService.openSuccessToast("se ha cedido el lider exitosamente!");
        this.getClients();
      },
      error: (error: HttpErrorResponse) => this.toastService.openErrorToast(error.error?.message)
    };
    this.partyService.setLeader(clientId).subscribe(clientsObserver);
  }

  openRemoveClientsDialog(): void {
    const members = this.formGroup.value.members as boolean[];

    const selectedClients = members.map((checked: boolean, index: number) => checked ? this.clients[index] : null)
      .filter((client: Client | null) => client !== null) as Client[] || [];

    if(selectedClients.length == 0) {
      this.toastService.openToast("Primero debe seleccionar al menos un miembro de la party");
      return;
    }

    let clientNames: string[] | string = selectedClients.map((client: Client) => client.nickName);
    clientNames = clientNames.length > 1 ? `${clientNames.slice(0, -1).join('\n ')}\n ${clientNames.slice(-1)}` : clientNames[0];

    this.matDialog.open(DialogComponent, {
      width: '90%',
      maxWidth: '350px',
      maxHeight: '90vh',
      backdropClass: 'back-drop-dialog',
      panelClass: 'custom-dialog-container-dark',
      data: {
        messages: [
          'Se eliminarán los siguientes miembros de la party:',
          `${clientNames}`,
          "Si seleccionás 'Bannear', los miembros no podrán volver acceder a la party durante esta sesión.",
        ],
        title: 'Atención!',
        canCancel: false,
        showCloseIcon: true,
        actions: [
          {
            message: "Eliminar",
            action: () => this.deleteMembers(selectedClients),
          },
          {
            message: "Bannear",
            action: () => this.deleteMembers(selectedClients, true),
          },
        ],
      },
    });
  }

  deleteMembers(members: Client[], banned = false): void {
    const ids = members.map((member: Client) => member.id);

    const membersObserver: PartialObserver<any> = {
      next: (response: any) => {
        this.toastService.openSuccessToast("se han eliminado los miembros seleccionados exitosamente!");
        this.getClients();
      },
      error: (error: HttpErrorResponse) => this.toastService.openErrorToast(error.error?.message)
    };
    this.partyService.kickMembers(ids, banned).subscribe(membersObserver);
  }
}
