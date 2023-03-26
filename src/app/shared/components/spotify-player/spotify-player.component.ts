import { Component, Input, OnInit } from '@angular/core';
import { SpotifyPlayer } from 'src/app/models/spotify-player-model';
import { SpotifySong } from 'src/app/modules/client/models/spotifySong.model';

@Component({
  selector: 'app-spotify-player',
  templateUrl: './spotify-player.component.html',
  styleUrls: ['./spotify-player.component.scss']
})
export class SpotifyPlayerComponent implements OnInit {

  @Input()
  spotifyPlayer!: SpotifyPlayer | SpotifySong; // SpotifyPlayer = Spotify Api response. SpotifySong = SSE response

  @Input()
  showAppLogo = true;

  @Input()
  openSongLink = false;

  constructor() { }

  ngOnInit(): void {
  }

  openSpotifySong(): void {
    if(this.openSongLink) {
      const songLink = (this.spotifyPlayer as SpotifySong)?.songLink;

      if(songLink) {
        window.open(songLink, '_blank');
      }
    }
  }

}
