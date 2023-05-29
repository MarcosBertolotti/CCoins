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
  
  constructor(
    private router: Router,
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
      panelClass: 'custom-dialog-container',
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
        this.getClients();
      },
      error: (error: HttpErrorResponse) => this.toastService.openErrorToast(error.error?.message)
    };
    this.partyService.setLeader(clientId).subscribe(clientsObserver);
  }
}
