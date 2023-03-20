import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, PartialObserver } from 'rxjs';
import { ToastService } from 'src/app/shared/services/toast.services';
import { CoinsReport } from '../../models/coins-report.model';
import { Party } from '../../models/party.model';
import { CoinsService } from '../../services/coins.service';
import { PartyService } from '../../services/party.service';

@Component({
  selector: 'app-party-coins',
  templateUrl: './party-coins.component.html',
  styleUrls: ['./party-coins.component.scss']
})
export class PartyCoinsComponent implements OnInit {

  coinsReport!: CoinsReport;
  loading!: boolean;
  currentParty$!: Observable<Party>;

  constructor(
    private toastService: ToastService,
    private coinsService: CoinsService,
    private partyService: PartyService,
  ) { }

  ngOnInit(): void {
    this.currentParty$ = this.partyService.currentParty$;
    this.getPartyCoinsReport();
  }

  getPartyCoinsReport(): void {
    this.loading = true;
    const gamesObserver: PartialObserver<CoinsReport> = {
      next: (response: CoinsReport) => {
        this.coinsReport = response;
        console.log(response);
      },
      error: (error: HttpErrorResponse) => this.toastService.openErrorToast(error.error?.message),
      complete: () => this.loading = false
    };
    this.coinsService.partyReport().subscribe(gamesObserver);
  }

}
