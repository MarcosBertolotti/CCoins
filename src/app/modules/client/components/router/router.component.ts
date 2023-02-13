import { Component, OnInit } from '@angular/core';
import { SseEvents } from '../../enums/sse-events.enum';
import { PlayerService } from '../../services/player.service';
import { SseService } from '../../services/sse.service';

@Component({
  selector: 'app-router',
  templateUrl: './router.component.html',
  styleUrls: ['./router.component.scss']
})
export class RouterComponent implements OnInit {

  constructor(
    private sseService: SseService,
    private playerService: PlayerService,
  ) { }

  ngOnInit(): void {
    this.sseService.getServerSentEvent().subscribe((event: Partial<MessageEvent<any>>) => {
      if(event?.type === SseEvents.ACTUAL_SONG_SPTF && event.data) {
        this.playerService.currentSong = JSON.parse(event.data);
      } 
      else if(event?.type === SseEvents.ACTUAL_VOTES_SPTF && event.data) {
        this.playerService.currentVoting = JSON.parse(event.data) || [];
        if(!this.playerService.newVoting)
          this.playerService.newVoting = true;
        console.log("ACTUAL_VOTES_SPTF: ", JSON.parse(event.data))
      } 
      else if(event?.type === SseEvents.NEW_WINNER_SPTF && event.data) {
        this.playerService.currentWinnerSong = JSON.parse(event.data);
        this.playerService.currentVoting = [];
        //if(!this.playerService.newVoting)
        //  this.playerService.newVoting = true;
        console.log("NEW_WINNER_SPTF: ", JSON.parse(event.data))
      } 
      else if(event?.type === SseEvents.YOU_WIN_SONG_VOTE_SPTF && event.data) {
        console.log("YOU_WIN_SONG_VOTE_SPTF: ", event)
      }
    });
  }

}
