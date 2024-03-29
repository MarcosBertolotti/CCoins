import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { interval, Observable, PartialObserver, Subscription } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { ClientPaths } from '../../enums/client-paths.eum';
import { ClientTableDTO } from '../../models/client-table.dto';
import { Party } from '../../models/party.model';
import { ClientService } from '../../services/client.service';
import { PartyService } from '../../services/party.service';
import { WelcomeComponent } from '../welcome/welcome.component';
import { SseService } from '../../services/sse.service';

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
  partyCoins$!: Observable<number>;
  currentParty!: Party;

  subscription: Subscription = new Subscription();
  
  coinsInterval$ = interval(60000).pipe(
    tap(() => this.getPartyCoins())
  );

  showNotifications = false;
  notifications: string[] = [];

  constructor(
    private router: Router,
    private matDialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    private clientService: ClientService,
    private partyService: PartyService,
    private sseService: SseService,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.nickName$ = this.clientService.nickName$;
    this.partyCoins$ = this.partyService.coins$;

    this.me = this.clientService.clientTable;
    this.getPartyCoins();
    this.getPartyInfo();

    this.subscription.add(this.coinsInterval$.subscribe());

    this.subscription.add(
      this.sseService.newNotification$.subscribe((notification: any) => {
        this.notifications.unshift(notification);
      })
    );

    this.subscription.add(
      this.partyCoins$.subscribe(() => {
        this.changeDetectorRef.detectChanges();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getPartyCoins(): void {
    this.partyService.getCoins(this.me.partyId).subscribe();
  }

  getPartyInfo(): void {
    const partyObserver: PartialObserver<Party> = {
      next:(partyInfo: Party) => {
        this.currentParty = partyInfo;
      },
      error:(error: HttpErrorResponse) => console.error(error.error?.message)
    }
    this.partyService.getCurrentParty(this.me.partyId).subscribe(partyObserver);
  }

  goToHome(): void {
    this.router.navigate([ClientPaths.HOME]);
  }

  goToTableInfo(): void {
    if(window.location.pathname == `/${ClientPaths.BAR_TABLE}`)
      this.goToHome();
    else
      this.router.navigate([ClientPaths.BAR_TABLE]);
  }

  goToCoinsInfo(): void {
    if(window.location.pathname == `/${ClientPaths.PARTY_COINS}`)
      this.goToHome();
    else
      this.router.navigate([ClientPaths.PARTY_COINS]);
  }

  openChangeNameDialog(): void {
    const dialogRef = this.matDialog.open(WelcomeComponent, {
      width: '80%',
      backdropClass: 'back-drop-dialog',
      panelClass: 'custom-dialog-container-dark',
      data: this.me,
    });

    dialogRef.beforeClosed().subscribe(() => {
      this.me = this.clientService.clientTable;
    });
  }

  removeNotification(index: number): void {
    this.notifications = this.notifications.filter((n: string, i: number) => i !== index);
  }
}
