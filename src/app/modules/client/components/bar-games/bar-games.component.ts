import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PartialObserver } from 'rxjs';
import { Game } from 'src/app/models/game.model';
import { ResponseList } from 'src/app/models/response-list.model';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { ToastService } from 'src/app/shared/services/toast.services';
import { PartyService } from '../../services/party.service';

@Component({
  selector: 'app-bar-games',
  templateUrl: './bar-games.component.html',
  styleUrls: ['./bar-games.component.scss']
})
export class BarGamesComponent implements OnInit {

  games: Game[] = [];
  loading = false;

  constructor(
    private matDialog: MatDialog,
    private toastService: ToastService,
    private partyService: PartyService,
  ) { }

  ngOnInit(): void {
    this.getGames();
  }

  getGames(): void {
    this.loading = true;
    const gamesObserver: PartialObserver<ResponseList<Game>> = {
      next: (games: ResponseList<Game>) => {
        this.games = games?.list;
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => this.toastService.openErrorToast(error.error?.message)
    };
    this.partyService.getBarGames().subscribe(gamesObserver);
  }

  openGameDetail(game: Game): void {
    this.matDialog.open(DialogComponent, {
      width: '90%',
      maxWidth: '350px',
      panelClass: 'custom-dialog-container',
      data: {
        messages: [
          game.rules,
        ],
        title: 'Reglas',
        closeMessage: "Cerrar",
        canCancel: true,
      },
    });
  }

}
