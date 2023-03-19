import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PartialObserver, Subscription } from 'rxjs';
import { Game } from 'src/app/models/game.model';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ToastService } from 'src/app/shared/services/toast.services';
import { SpotifySong } from '../../models/spotifySong.model';
import { Voting } from '../../models/voting.model';
import { WinnerSong } from '../../models/winner-song.model';
import { PlayerService } from '../../services/player.service';
import { VoteService } from '../../services/vote.service';
import { VotingComponent } from '../voting/voting.component';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  @Input()
  voteGame!: Game;

  currentVoting!: Voting[];
  currentWinnerSong!: WinnerSong;
  currentSong!: SpotifySong;
  subscription = new Subscription();
  
  constructor(
    private matDialog: MatDialog,
    private voteService: VoteService,
    private toastService: ToastService,
    private playerService: PlayerService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.currentSong = this.playerService.spotifySong;
    this.subscription.add(this.playerService.currentSong$.subscribe((value: SpotifySong) =>
      this.currentSong = value
    ));

    this.currentVoting = this.playerService.currentVoting;
    this.subscription.add(this.playerService.currentVoting$.subscribe((value: Voting[]) =>
      this.currentVoting = value.sort((a, b) => b.votes - a.votes)
    ));

    this.currentWinnerSong = this.playerService.winnerSong;
    this.subscription.add(this.playerService.currentWinnerSong$.subscribe((value: WinnerSong) =>
      this.currentWinnerSong = value
    ));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  checkCanVote(): void {
    const voteObservable: PartialObserver<any> = {
      next: (response: any) => {
        console.log("esta todo bien, ", response);
        this.openVotingDialog();
      },
      error: (error: HttpErrorResponse) => {
        const message = error.error?.message;
        if(message)
          this.notificationService.openWarningDialog([message]);
        else
          this.toastService.openErrorToast();
      }
    }
    this.voteService.checkCanVote().subscribe(voteObservable);
  }

  openVotingDialog(): void {
    this.matDialog.open(VotingComponent, {
      width: '90%',
      backdropClass: 'back-drop-dialog',
      panelClass: 'custom-dialog-container-dark',
      data: this.currentVoting,
    });
  }
}
