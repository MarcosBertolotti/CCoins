import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PartialObserver } from 'rxjs';
import { ClientTableDTO } from '../../models/client-table.dto';
import { PartyService } from '../../services/party.service';
import { ClientService } from '../../services/client.service';
import { WelcomeComponent } from '../welcome/welcome.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  openedWelcomeDialogKey = 'openedWelcomeDialog';
  me: ClientTableDTO;

  constructor(
    private matDialog: MatDialog,
    private partyService: PartyService,
    private clientService: ClientService,
  ) { 
    this.me = this.clientService.clientTable;
  }

  ngOnInit(): void {
    this.checkWelcomeDialog();
    this.getPartyCoins();
    this.getPartyInfo();
  }

  checkWelcomeDialog(): void {
    const openedWelcomeDialog = localStorage.getItem(this.openedWelcomeDialogKey);
    
    if(!openedWelcomeDialog) {
      const dialogRef = this.matDialog.open(WelcomeComponent, {
        width: '80%',
        backdropClass: 'back-drop-dialog',
        panelClass: 'custom-dialog-container-dark',
        disableClose: true,
        data: this.me,
      });

      dialogRef.beforeClosed().subscribe(() => {
        localStorage.setItem(this.openedWelcomeDialogKey, JSON.stringify(true));
        this.me = this.clientService.clientTable;
      });
    }
  }

  getPartyCoins(): void {
    const partyObserver: PartialObserver<any> = {
      next:(response: any) => {
        console.log(response);
      },
      error:(error: HttpErrorResponse) => console.error(error.error.message)
    }
    this.partyService.getCoins(this.me.partyId).subscribe(partyObserver);
  }

  getPartyInfo(): void {
    const partyObserver: PartialObserver<any> = {
      next:(response: any) => {
        console.log(response);
      },
      error:(error: HttpErrorResponse) => console.error(error.error.message)
    }
    this.partyService.getInfo(this.me.partyId).subscribe(partyObserver);
  }
}
