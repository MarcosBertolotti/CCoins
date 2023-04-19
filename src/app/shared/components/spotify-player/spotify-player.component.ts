import { Component, Input, OnInit } from '@angular/core';
import { SpotifySong } from 'src/app/enums/spotifySong.model';

@Component({
  selector: 'app-spotify-player',
  templateUrl: './spotify-player.component.html',
  styleUrls: ['./spotify-player.component.scss']
})
export class SpotifyPlayerComponent implements OnInit {

  @Input()
  spotifyPlayer!: SpotifySong;

  @Input()
  showAppLogo = true;

  @Input()
  openSongLink = false;

  @Input()
  connected = true;

  constructor() { }

  ngOnInit(): void {
  }

  openSpotifySong(): void {
    if(this.openSongLink) {
      const songLink = this.spotifyPlayer?.songLink;

      if(songLink) {
        window.open(songLink, '_blank');
      }
    }
  }

}
