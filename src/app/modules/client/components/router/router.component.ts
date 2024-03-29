import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SseEvents } from '../../enums/sse-events.enum';
import { ClientTableDTO } from '../../models/client-table.dto';
import { SseService } from '../../services/sse.service';
import { PartyService } from '../../services/party.service';
import { PlayerService } from 'src/app/services/player.service';
import { ClientService } from '../../services/client.service';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-router',
  templateUrl: './router.component.html',
  styleUrls: ['./router.component.scss'],
})
export class RouterComponent implements OnInit {

  me!: ClientTableDTO;
  
  constructor(
    private sseService: SseService,
    private partyService: PartyService,
    private playerService: PlayerService,
    private clientService: ClientService,
    private spotifyService: SpotifyService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.subscribeSSe();
    this.me = this.clientService.clientTable;
  }

  subscribeSSe(): void {
    this.sseService.getServerSentEvent().subscribe((event: Partial<MessageEvent<any>>) => {
      switch (event?.type) {

        case SseEvents.ACTUAL_SONG_SPTF:
          if(event.data) {
            this.playerService.currentSong = JSON.parse(event.data);
            if(!this.spotifyService.connected)
              this.spotifyService.connected = true;
          }
          break;

        case SseEvents.ACTUAL_VOTES_SPTF:
          if(event.data)
            this.playerService.currentVoting = JSON.parse(event.data) || [];
          break;

        case SseEvents.NEW_WINNER_SPTF:
          if(event.data) {
            this.playerService.currentWinnerSong = JSON.parse(event.data);
            this.playerService.currentVoting = [];
          }
        break;

        case SseEvents.YOU_WIN_SONG_VOTE_SPTF:
          const messages = JSON.parse(event.data);
          if(messages?.list && messages.list.length > 0) {
            this.openWinSongVoteDialog(messages.list);
            this.getPartyCoins();
          }
          break;

        case SseEvents.UPDATE_COINS:
          this.getPartyCoins();
          break;

        case SseEvents.NEW_PRIZE:
          break;

        case SseEvents.NEW_LEADER:
          this.sseService.newLeaderSubject.next();
          break;

        case SseEvents.YOU_ARE_THE_LEADER:
          this.clientService.leader = true;
          break;

        case SseEvents.LOGOUT_CLIENT:
          this.clientService.logoutByKick();
          break;

        case SseEvents.LOGOUT_SPOTIFY:
          if(this.spotifyService.connected) {
            this.spotifyService.connected = false;
            this.playerService.reset();
          }
          break;

        case SseEvents.CLIENT_LEFT_THE_PARTY:
          break;

        default:
          console.info('unkown event:', event.type);
      }
    });
  }

  openWinSongVoteDialog(messages: string[]): void {
    this.notificationService.openDialog(
      messages,
      'Felicitaciones!',
      false,
    );
  }

  getPartyCoins(): void {
    this.partyService.getCoins(this.me.partyId).subscribe();
  }

}
