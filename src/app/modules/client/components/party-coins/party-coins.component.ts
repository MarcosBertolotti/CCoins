import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, PartialObserver } from 'rxjs';
import { ToastService } from 'src/app/shared/services/toast.services';
import { Party } from '../../models/party.model';
import { CoinsService } from '../../services/coins.service';
import { PartyService } from '../../services/party.service';
import { PageEvent } from '@angular/material/paginator';
import { CoinsReport } from 'src/app/models/coins-report.model';

@Component({
  selector: 'app-party-coins',
  templateUrl: './party-coins.component.html',
  styleUrls: ['./party-coins.component.scss']
})
export class PartyCoinsComponent implements OnInit {

  coinsReport!: CoinsReport;
  loading!: boolean;
  currentParty$!: Observable<Party>;

  // paginator
  selectedType: string = '';
  currentPage = 0;
  reportLength = 0;

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
        this.reportLength = this.coinsReport?.report?.totalElements;
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.openErrorToast(error.error?.message);
        this.loading = false;
      },   
    };
    this.coinsService.partyReport(this.selectedType, this.currentPage).subscribe(gamesObserver);
  }

  filter(type: string = ''): void {
    this.selectedType = type;
    this.currentPage = 0;
    this.getPartyCoinsReport();
  }

  pageChangeEvent(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.getPartyCoinsReport();
  }

}
