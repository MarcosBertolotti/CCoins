import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PartialObserver } from 'rxjs';
import { ToastService } from 'src/app/shared/services/toast.services';
import { Voting } from '../../models/voting.model';
import { VoteService } from '../../services/vote.service';

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.scss']
})
export class VotingComponent implements OnInit {

  formGroup!: FormGroup;
  currentVoting: Voting[];

  constructor(
    public matDialog: MatDialogRef<VotingComponent>,
    private toastService: ToastService,
    private formBuilder: FormBuilder,
    private voteService: VoteService,
    @Inject(MAT_DIALOG_DATA) public data: Voting[],
  ) { 
    this.currentVoting = data;
  }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.formGroup = this.formBuilder.group({
      optionVote: [null, Validators.required],
    })
  }

  vote(): void {
    const voteObserver: PartialObserver<void> = {
      next: () => {
        this.toastService.openSuccessToast("Su voto ha sido registrado exitosamente!");
        this.matDialog.close();
      },
      error: (error: HttpErrorResponse) => {
        const message = error.error?.message?.includes('[403]') ? 'Lo sentimos, Ya has votado en esta sesión, espera a la siguiente para volver a votar!' : error.error?.message;
        this.toastService.openErrorToast(message)
      }
    };    
    this.voteService.voteNextSong(this.optionVote.value).subscribe(voteObserver);
  }

  close(): void {
    this.matDialog.close();
  }

  get optionVote(): FormControl { return this.formGroup.get("optionVote") as FormControl }

}
