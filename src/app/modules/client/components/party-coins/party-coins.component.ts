import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PartialObserver } from 'rxjs';
import { ToastService } from 'src/app/shared/services/toast.services';
import { CoinsReport } from '../../models/coins-report.model';
import { CoinsService } from '../../services/coins.service';

@Component({
  selector: 'app-party-coins',
  templateUrl: './party-coins.component.html',
  styleUrls: ['./party-coins.component.scss']
})
export class PartyCoinsComponent implements OnInit {

  constructor(
    private toastService: ToastService,
    private coinsService: CoinsService,
  ) { }

  ngOnInit(): void {
    this.getPartyCoinsReport();
  }

  getPartyCoinsReport(): void {
    const gamesObserver: PartialObserver<CoinsReport> = {
      next: (response: CoinsReport) => {
        console.log(response);
      },
      error: (error: HttpErrorResponse) => this.toastService.openErrorToast(error.error?.message)
    };
    this.coinsService.partyReport().subscribe(gamesObserver);
  }

}
