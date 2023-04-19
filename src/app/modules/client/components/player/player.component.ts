import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PartialObserver, Subscription } from 'rxjs';
import { Game } from 'src/app/models/game.model';
import { ResponseData } from 'src/app/models/response-data.model';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ToastService } from 'src/app/shared/services/toast.services';
import { Voting } from '../../models/voting.model';
import { WinnerSong } from '../../models/winner-song.model';
import { VoteService } from '../../services/vote.service';
import { VotingComponent } from '../voting/voting.component';
import { SpotifySong } from 'src/app/enums/spotifySong.model';
import { PlayerService } from 'src/app/services/player.service';

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
  dialogRef?: MatDialogRef<VotingComponent>;
  
  constructor(
    private matDialog: MatDialog,
    private voteService: VoteService,
    private toastService: ToastService,
    private playerService: PlayerService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.currentSong = this.playerService.spotifySong;
    this.subscription.add(this.playerService.currentSong$.subscribe((currentSong: SpotifySong) =>
      this.currentSong = currentSong
    ));

    this.currentVoting = this.playerService.currentVoting;
    this.subscription.add(this.playerService.currentVoting$.subscribe((currentVoting: Voting[]) =>
      this.currentVoting = currentVoting
    ));

    this.currentWinnerSong = this.playerService.winnerSong;
    this.subscription.add(this.playerService.currentWinnerSong$.subscribe((winnerSong: WinnerSong) => {
      this.currentWinnerSong = winnerSong;

      if(this.dialogRef && this.dialogRef.getState() != 2) {
        this.dialogRef.close();
        this.toastService.openToast("La votación ha finalizado.");
        this.dialogRef = undefined;
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  checkCanVote(): void {
    const voteObservable: PartialObserver<ResponseData<void>> = {
      next: (response: ResponseData<void>) => this.openVotingDialog(),
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
    this.dialogRef = this.matDialog.open(VotingComponent, {
      width: '90%',
      backdropClass: 'back-drop-dialog',
      panelClass: 'custom-dialog-container-dark',
      data: this.currentVoting,
    })
  }
}
