import { Component, OnInit } from '@angular/core';
import { SseEvents } from '../../enums/sse-events.enum';
import { SpotifyService } from '../../services/spotify.service';
import { SseService } from '../../services/sse.service';
import { SpotifyService as SpotifyService2} from 'src/app/services/spotify.service';

@Component({
  selector: 'app-router',
  templateUrl: './router.component.html',
  styleUrls: ['./router.component.scss']
})
export class RouterComponent implements OnInit {

  constructor(
    private sseService: SseService,
    private spotifyService: SpotifyService,
    private spotifyService2: SpotifyService2,
  ) { }

  ngOnInit(): void {
    this.spotifyService2.getTestRequest().then(() => {});

    this.sseService.getServerSentEvent().subscribe((event: Partial<MessageEvent<any>>) => {
      if(event?.type === SseEvents.ACTUAL_SONG_SPTF && event.data) {
        this.spotifyService.currentSong = JSON.parse(event.data);
      } else if(event?.type === SseEvents.ACTUAL_VOTES_SPTF && event.data) {
        console.log("ACTUAL_VOTES_SPTF: ", JSON.parse(event.data))
      } else if(event?.type === SseEvents.NEW_WINNER_SPTF && event.data) {
        console.log("NEW_WINNER_SPTF: ", JSON.parse(event.data))
      } else if(event?.type === SseEvents.YOU_WIN_SONG_VOTE_SPTF && event.data) {
        console.log("YOU_WIN_SONG_VOTE_SPTF: ", event)
      }
    });
  }

}
