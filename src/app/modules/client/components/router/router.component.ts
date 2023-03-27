import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/shared/services/notification.service';
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
        const messages = JSON.parse(event.data);
        if(messages?.list && messages.list.length > 0) {
          this.openWinSongVoteDialog(messages.list);
          this.getPartyCoins();
        }
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
