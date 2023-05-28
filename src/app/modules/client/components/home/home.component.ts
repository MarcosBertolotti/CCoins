import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PartialObserver } from 'rxjs';
import { GameTypes } from 'src/app/enums/game-types.enum';
import { Game } from 'src/app/models/game.model';
import { ResponseList } from 'src/app/models/response-list.model';
import { ToastService } from 'src/app/shared/services/toast.services';
import { ClientPaths } from '../../enums/client-paths.eum';
import { ClientTableDTO } from '../../models/client-table.dto';
import { ClientService } from '../../services/client.service';
import { PartyService } from '../../services/party.service';
import { WelcomeComponent } from '../welcome/welcome.component';
import { Party } from '../../models/party.model';
import { CodeRedeemComponent } from '../code-redeem/code-redeem.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  openedWelcomeDialogKey = 'openedWelcomeDialog';
  me: ClientTableDTO;

  party!: Party;
  games!: Game[];
  voteGame!: Game;

  constructor(
    private router: Router,
    private matDialog: MatDialog,
    private partyService: PartyService,
    private toastService: ToastService,
    private clientService: ClientService,
  ) { 
    this.me = this.clientService.clientTable;
  }

  ngOnInit(): void {
    this.checkWelcomeDialog();

    this.me = this.clientService.clientTable;
    this.getBarGames();
    this.getCurrentParty();
  }

  checkWelcomeDialog(): void {
    const openedWelcomeDialog = localStorage.getItem(this.openedWelcomeDialogKey);
    
    if(!openedWelcomeDialog) {
      const dialogRef = this.matDialog.open(WelcomeComponent, {
        width: '80%',
        maxWidth: '600px',
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
  
  getCurrentParty(): void {
    const partyObserver: PartialObserver<Party> = {
      next: (partyInfo: Party) => this.party = partyInfo,
      error: (error: HttpErrorResponse) => console.error(error.error?.message)
    };
    this.partyService.getCurrentParty(this.me.partyId).subscribe(partyObserver);
  }

  openMenu(): void {
    const MenuBarObserver: PartialObserver<{ text: string}> = {
      next: (menu: { text: string}) => {
        if(menu?.text?.length > 0)
          window.open(menu.text, "_blank");
        else
          this.toastService.openErrorToast('El menú no esta disponible');
      },
      error: (error: HttpErrorResponse) => this.toastService.openErrorToast(error.error?.message)
    };
    this.clientService.getBarMenu().subscribe(MenuBarObserver);
  }

  goToTableInfo(): void {
    this.router.navigate([ClientPaths.BAR_TABLE]);
  }

  goToBarPrizes(): void {
    this.router.navigate([ClientPaths.BAR_PRIZES]);
  }

  goToBarGames(): void {
    this.router.navigate([ClientPaths.BAR_GAMES]);
  }

  getBarGames(): void {
    const gamesObserver: PartialObserver<any> = {
      next: (response: ResponseList<Game>) => {
        this.games = response?.list;
        this.voteGame = this.games.find((game: Game) => game.gameType?.name === GameTypes.VOTE)!;
      },
      error: (error: HttpErrorResponse) => console.error(error.error?.message)
    };
    this.partyService.getBarGames().subscribe(gamesObserver);
  }

  openRedeemDialog(): void {
    this.matDialog.open(CodeRedeemComponent, {
      backdropClass: 'back-drop-dialog',
      panelClass: 'custom-dialog-container-dark',
      width: '90%',
      maxWidth: '450px',
    })
  } 
}
