import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PartialObserver } from 'rxjs';
import { ResponseList } from 'src/app/models/response-list.model';
import { ToastService } from 'src/app/shared/services/toast.services';
import { ClientPaths } from '../../enums/client-paths.eum';
import { WarningType } from '../../enums/warning-type.enum';
import { ClientTableDTO } from '../../models/client-table.dto';
import { Client } from '../../models/client.model';
import { Party } from '../../models/party.model';
import { ClientService } from '../../services/client.service';
import { PartyService } from '../../services/party.service';

@Component({
  selector: 'app-bar-table-info',
  templateUrl: './bar-table-info.component.html',
  styleUrls: ['./bar-table-info.component.scss']
})
export class BarTableInfoComponent implements OnInit {

  me!: ClientTableDTO;
  party!: Party;
  clients!: Client[];

  constructor(
    private router: Router,
    private toastService: ToastService,
    private partyService: PartyService,
    private clientService: ClientService,
  ) { }

  ngOnInit(): void {
    this.me = this.clientService.clientTable;

    const partyClientsObserver: PartialObserver<ResponseList<Client>> = {
      next: (clients: ResponseList<Client>) => {
        this.clients = clients?.list;
      },
      error: (error: HttpErrorResponse) => this.toastService.openErrorToast(error.error.message)
    };
    this.partyService.getInfoClients(this.me.partyId).subscribe(partyClientsObserver);

    const partyObserver: PartialObserver<Party> = {
      next: (partyInfo: Party) => {
        this.party = partyInfo;
      },
      error: (error: HttpErrorResponse) => this.toastService.openErrorToast(error.error.message)
    };
    this.partyService.getInfo(this.me.partyId).subscribe(partyObserver);
  }

  logout(): void {
    const clientsObserver: PartialObserver<void> = {
      next: () => this.router.navigate([ClientPaths.WARNING_LOGIN], { queryParams: {
        type: WarningType.LOGOUT
      }}),
      error: (error: HttpErrorResponse) => this.toastService.openErrorToast(error.error.message)
    };
    this.clientService.logout().subscribe(clientsObserver);
  }

}
