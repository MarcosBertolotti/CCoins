import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SpotifySong } from '../enums/spotifySong.model';
import { Voting } from '../modules/client/models/voting.model';
import { WinnerSong } from '../modules/client/models/winner-song.model';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  /* currentSong */

  spotifySong!: SpotifySong;

  currentSongSubject = new Subject<SpotifySong>();

  get currentSong$(): Observable<SpotifySong> {
    return this.currentSongSubject.asObservable();
  }

  set currentSong(spotifySong: SpotifySong) {
    this.spotifySong = spotifySong;
    this.currentSongSubject.next(spotifySong);
  }

  /* currentVoting */

  voting!: Voting[];

  currentVotingSubject = new Subject<Voting[]>();

  get currentVoting$(): Observable<Voting[]> {
    return this.currentVotingSubject.asObservable();
  }

  set currentVoting(voting: Voting[]) {
    this.voting = voting;
    this.currentVotingSubject.next(voting);
  }

  /* newVoting */

  get newVoting(): boolean {
    const newVoting = localStorage.getItem("newVoting");
    return newVoting ? JSON.parse(newVoting) : false;
  }

  set newVoting(newVoting: boolean) {
    localStorage.setItem("newVoting", JSON.stringify(newVoting));
  }

  /* currentWinnerSong */

  winnerSong!: WinnerSong;

  currentWinnerSongSubject = new Subject<WinnerSong>();

  get currentWinnerSong$(): Observable<WinnerSong> {
    return this.currentWinnerSongSubject.asObservable();
  }

  set currentWinnerSong(winnerSong: WinnerSong) {
    this.winnerSong = winnerSong;
    this.currentWinnerSongSubject.next(winnerSong);
  }

  constructor() { }

}
