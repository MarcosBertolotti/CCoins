import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PartialObserver, Subscription } from 'rxjs';
import { GameTypes } from 'src/app/enums/game-types.enum';
import { Game } from 'src/app/models/game.model';
import { ResponseList } from 'src/app/models/response-list.model';
import { ToastService } from 'src/app/shared/services/toast.services';
import { ClientPaths } from '../../enums/client-paths.eum';
import { ClientTableDTO } from '../../models/client-table.dto';
import { SpotifySong } from '../../models/spotifySong.model';
import { Voting } from '../../models/voting.model';
import { WinnerSong } from '../../models/winner-song.model';
import { ClientService } from '../../services/client.service';
import { PartyService } from '../../services/party.service';
import { PlayerService } from '../../services/player.service';
import { VotingComponent } from '../voting/voting.component';
import { WelcomeComponent } from '../welcome/welcome.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  openedWelcomeDialogKey = 'openedWelcomeDialog';
  me: ClientTableDTO;

  games!: Game[];
  voteGame!: Game;

  currentVoting!: Voting[];
  currentWinnerSong!: WinnerSong;
  currentSong!: SpotifySong;
  subscription = new Subscription();

  constructor(
    private router: Router,
    private matDialog: MatDialog,
    private partyService: PartyService,
    private toastService: ToastService,
    private clientService: ClientService,
    private playerService: PlayerService,
  ) { 
    this.me = this.clientService.clientTable;
  }

  ngOnInit(): void {
    this.checkWelcomeDialog();

    this.currentSong = this.playerService.spotifySong;
    this.subscription.add(this.playerService.currentSong$.subscribe((value: SpotifySong) =>
      this.currentSong = value
    ));

    this.currentVoting = this.playerService.currentVoting;
    this.subscription.add(this.playerService.currentVoting$.subscribe((value: Voting[]) =>
      this.currentVoting = value
    ));

    this.currentWinnerSong = this.playerService.winnerSong;
    this.subscription.add(this.playerService.currentWinnerSong$.subscribe((value: WinnerSong) =>
      this.currentWinnerSong = value
    ));

    this.me = this.clientService.clientTable;
    this.getBarGames();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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

  goToBarPrizes(): void {
    this.router.navigate([ClientPaths.BAR_PRIZES]);
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

  openVotingDialog(): void {
    const dialogRef = this.matDialog.open(VotingComponent, {
      width: '90%',
      backdropClass: 'back-drop-dialog',
      panelClass: 'custom-dialog-container-dark',
      data: this.currentVoting,
    });

    dialogRef.beforeClosed().subscribe(() => {
      
    });
  }
}
