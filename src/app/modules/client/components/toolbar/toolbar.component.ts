import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { interval, Observable, PartialObserver, Subscription } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { ClientTableDTO } from '../../models/client-table.dto';
import { ClientService } from '../../services/client.service';
import { PartyService } from '../../services/party.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit, OnDestroy {

  @Input() drawer!: MatDrawer;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  me!: ClientTableDTO;
  nickName$!: Observable<string>;
  partyName$!: Observable<string>;
  partyCoins$!: Observable<number>;

  subscription: Subscription = new Subscription();
  coinsInterval$ = interval(5000).pipe(
    tap(() => this.getPartyCoins())
  );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private clientService: ClientService,
    private partyService: PartyService,
  ) { }

  ngOnInit(): void {
    this.nickName$ = this.clientService.nickName$;
    this.partyName$ = this.partyService.partyName$;
    this.partyCoins$ = this.partyService.coins$;

    this.me = this.clientService.clientTable;
    this.getPartyCoins();
    this.getPartyInfo();

    this.subscription.add(this.coinsInterval$.subscribe());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getPartyCoins(): void {
    this.partyService.getCoins(this.me.partyId).subscribe();
  }

  getPartyInfo(): void {
    const partyObserver: PartialObserver<any> = {
      next:(response: any) => {
        console.log("[Home] getPartyInfo: ", response);
      },
      error:(error: HttpErrorResponse) => console.error(error.error.message)
    }
    this.partyService.getInfo(this.me.partyId).subscribe(partyObserver);
  }

  goToParty(): void {
    
  }
}
