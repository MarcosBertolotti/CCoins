import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PartialObserver } from 'rxjs';
import { Prize } from 'src/app/models/prize.model';
import { ResponseList } from 'src/app/models/response-list.model';
import { ToastService } from 'src/app/shared/services/toast.services';
import { PartyService } from '../../services/party.service';

@Component({
  selector: 'app-bar-prizes',
  templateUrl: './bar-prizes.component.html',
  styleUrls: ['./bar-prizes.component.scss']
})
export class BarPrizesComponent implements OnInit {

  prizes: Prize[] = [];
  loading = false;

  constructor(
    private toastService: ToastService,
    private partyService: PartyService,
  ) { }

  ngOnInit(): void {
    this.getPrizes();
  }

  getPrizes(): void {
    this.loading = true;
    const prizesObserver: PartialObserver<ResponseList<Prize>> = {
      next: (prizes: ResponseList<Prize>) => {
        this.prizes = prizes?.list;
        this.loading = false;
        console.log(this.prizes);
      },
      error: (error: HttpErrorResponse) => this.toastService.openErrorToast(error.error?.message)
    };
    this.partyService.getBarPrizes().subscribe(prizesObserver);
  }

  redeemPrize(): void {

  }
}
