import { Component, Input, OnInit } from '@angular/core';
import { SpotifyPlayer } from 'src/app/models/spotify-player-model';

@Component({
  selector: 'app-spotify-player',
  templateUrl: './spotify-player.component.html',
  styleUrls: ['./spotify-player.component.scss']
})
export class SpotifyPlayerComponent implements OnInit {

  @Input()
  spotifyPlayer!: SpotifyPlayer;

  constructor() { }

  ngOnInit(): void {
  }

}
