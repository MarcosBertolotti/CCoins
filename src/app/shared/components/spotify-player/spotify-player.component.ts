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
  spotifyPlayer!: SpotifyPlayer | SpotifySong;

  @Input()
  showAppLogo = true;

  constructor() { }

  ngOnInit(): void {
  }

}
