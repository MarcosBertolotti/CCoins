import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SpotifySong } from '../models/spotifySong.model';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  spotifySong!: SpotifySong;

  currentSongSubject = new Subject<SpotifySong>();

  get currentSong$(): Observable<SpotifySong> {
    return this.currentSongSubject.asObservable();
  }

  set currentSong(spotifySong: SpotifySong) {
    this.spotifySong = spotifySong;
    this.currentSongSubject.next(spotifySong);
  }

  constructor() { }

}
