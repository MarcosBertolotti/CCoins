import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PartialObserver } from 'rxjs';
import { ToastService } from 'src/app/shared/services/toast.services';
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
    const gamesObserver: PartialObserver<any> = {
      next: (response: any) => {
        console.log(response);
      },
      error: (error: HttpErrorResponse) => this.toastService.openErrorToast(error.error?.message)
    };
    this.coinsService.partyReport().subscribe(gamesObserver);
  }

}
