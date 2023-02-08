import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';
import { SseService } from '../../services/sse.service';

@Component({
  selector: 'app-router',
  templateUrl: './router.component.html',
  styleUrls: ['./router.component.scss']
})
export class RouterComponent implements OnInit {

  constructor(
    private sseService: SseService,
    private spotifyService: SpotifyService,
  ) { }

  ngOnInit(): void {
    this.sseService.getServerSentEvent().subscribe((event: Partial<MessageEvent<any>>) => {
      if(event?.type === 'ACTUAL_SONG_SPTF' && event.data) {
        this.spotifyService.currentSong = JSON.parse(event.data);
      }
    });
  }

}
