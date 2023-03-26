import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PartialObserver } from 'rxjs';
import { Game } from 'src/app/models/game.model';
import { ResponseList } from 'src/app/models/response-list.model';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ToastService } from 'src/app/shared/services/toast.services';
import { SseEvents } from '../../enums/sse-events.enum';
import { ClientTableDTO } from '../../models/client-table.dto';
import { ClientService } from '../../services/client.service';
import { PartyService } from '../../services/party.service';
import { PlayerService } from '../../services/player.service';
import { SseService } from '../../services/sse.service';

@Component({
  selector: 'app-router',
  templateUrl: './router.component.html',
  styleUrls: ['./router.component.scss']
})
export class RouterComponent implements OnInit {

  me!: ClientTableDTO;
  
  constructor(
    private sseService: SseService,
    private toastService: ToastService,
    private partyService: PartyService,
    private playerService: PlayerService,
    private clientService: ClientService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.subscribeSSe();
    this.me = this.clientService.clientTable;
  }

  subscribeSSe(): void {
    this.sseService.getServerSentEvent().subscribe((event: Partial<MessageEvent<any>>) => {
      if(event?.type === SseEvents.ACTUAL_SONG_SPTF && event.data) {
        this.playerService.currentSong = JSON.parse(event.data);
      } 
      else if(event?.type === SseEvents.ACTUAL_VOTES_SPTF && event.data) {
        this.playerService.currentVoting = JSON.parse(event.data) || [];
        if(!this.playerService.newVoting)
          this.playerService.newVoting = true;
      } 
      else if(event?.type === SseEvents.NEW_WINNER_SPTF && event.data) {
        this.playerService.currentWinnerSong = JSON.parse(event.data);
        this.playerService.currentVoting = [];
        //if(!this.playerService.newVoting)
        //  this.playerService.newVoting = true;
      } 
      else if(event?.type === SseEvents.YOU_WIN_SONG_VOTE_SPTF) {
        this.getVoteGame();
      }
    });
  }

  openWinSongVoteDialog(gamePoints: number = 0): void {
    this.notificationService.openDialog(
      [
        `Su party ha ganado la votación, recibirán ${gamePoints} coins de recompensa!`, 
        'Pueden seguir participando para canjear la recompensa que mas les guste.'
      ],
      'Felicitaciones!',
      false,
    );
  }

  getVoteGame(): void {
    const gamesObserver: PartialObserver<ResponseList<Game>> = {
      next: (games: ResponseList<Game>) => {
        const game = games?.list?.find((game: Game) => game.gameType?.name === 'VOTE');

        if(game && game.points > 0) {
          this.openWinSongVoteDialog(game.points);
          this.getPartyCoins();
        }
      },
      error: (error: HttpErrorResponse) => this.toastService.openErrorToast(error.error?.message)
    };
    this.partyService.getBarGames().subscribe(gamesObserver);
  }

  getPartyCoins(): void {
    this.partyService.getCoins(this.me.partyId).subscribe();
  }

}
