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
    private matDialog: MatDialogRef<VotingComponent>,
    private toastService: ToastService,
    private formBuilder: FormBuilder,
    private voteService: VoteService,
    @Inject(MAT_DIALOG_DATA) data: Voting[],
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
      error: (error: HttpErrorResponse) => this.toastService.openErrorToast(error.error?.message)
    };    
    this.voteService.voteNextSong(this.optionVote.value).subscribe(voteObserver);
  }

  close(): void {
    this.matDialog.close();
  }

  get optionVote(): FormControl { return this.formGroup.get("optionVote") as FormControl }

}
