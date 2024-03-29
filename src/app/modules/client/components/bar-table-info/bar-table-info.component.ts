import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PartialObserver, Subscription } from 'rxjs';
import { ResponseList } from 'src/app/models/response-list.model';
import { ToastService } from 'src/app/shared/services/toast.services';
import { ClientPaths } from '../../enums/client-paths.eum';
import { WarningType } from '../../enums/warning-type.enum';
import { ClientTableDTO } from '../../models/client-table.dto';
import { Party } from '../../models/party.model';
import { ClientService } from '../../services/client.service';
import { PartyService } from '../../services/party.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Client } from 'src/app/models/client.model';
import { SseService } from '../../services/sse.service';

@Component({
  selector: 'app-bar-table-info',
  templateUrl: './bar-table-info.component.html',
  styleUrls: ['./bar-table-info.component.scss']
})
export class BarTableInfoComponent implements OnInit, OnDestroy {

  me!: ClientTableDTO;

  party!: Party;
  clients!: Client[];
  formGroup!: FormGroup;
  subscription = new Subscription();
  
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private toastService: ToastService,
    private partyService: PartyService,
    private clientService: ClientService,
    private sseService: SseService,
  ) { }

  ngOnInit(): void {
    this.me = this.clientService.clientTable;
    this.getClients();
    this.getParty();

    this.subscription.add(
      this.sseService.newLeader$.subscribe(() => {
        this.getClients();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getClients(): void {
    const partyClientsObserver: PartialObserver<ResponseList<Client>> = {
      next: (clients: ResponseList<Client>) => {
        this.clients = clients?.list || [];
        this.checkLeader();
        this.buildForm();
      },
      error: (error: HttpErrorResponse) => this.toastService.openErrorToast(error.error?.message)
    };
    this.partyService.getInfoClients(this.me.partyId).subscribe(partyClientsObserver);
  }

  checkLeader(): void {
    if(this.clients && this.clients.length > 0) {
      const me = this.clients.find((client: Client) => client.id == this.me.clientId);
      if(me) {
        this.me.leader = me.leader;
        this.clientService.clientTable = this.me;
      }
    }
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
        this.me.leader = false;
        this.clientService.clientTable = this.me;
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
    clientNames = clientNames.length > 1 ? `- ${clientNames.slice(0, -1).join('\n- ')}\n - ${clientNames.slice(-1)}` : `- ${clientNames[0]}`;

    this.matDialog.open(DialogComponent, {
      width: '90%',
      maxWidth: '350px',
      maxHeight: '90vh',
      backdropClass: 'back-drop-dialog',
      panelClass: ['custom-dialog-container-dark', 'remove-members'],
      data: {
        messages: [
          selectedClients.length > 1 ? 'Se eliminarán los siguientes miembros de la party:' : 'Se eliminará a el siguiente miembro de la party:',
          `${clientNames}`,
        ],
        title: 'Atención!',
        canCancel: true,
        actions: [
          {
            message: "Eliminar",
            action: () => this.deleteMembers(selectedClients),
          },
        ],
      },
    });
  }

  deleteMembers(members: Client[], banned = false): void {
    const ids = members.map((member: Client) => member.id);

    const membersObserver: PartialObserver<any> = {
      next: (response: any) => {
        const message = members.length > 1 ? 'se han eliminado los miembros seleccionados exitosamente!' : 'se ha eliminado a el miembro seleccionado exitosamente!'
        this.toastService.openSuccessToast(message);
        this.getClients();
      },
      error: (error: HttpErrorResponse) => this.toastService.openErrorToast(error.error?.message),
      complete: (() => this.formGroup.reset())
    };
    this.partyService.kickMembers(ids, banned).subscribe(membersObserver);
  }
}
