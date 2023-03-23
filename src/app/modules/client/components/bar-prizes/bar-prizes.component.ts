import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { PartialObserver } from 'rxjs';
import { take } from 'rxjs/operators';
import { Value } from 'src/app/models/dto/value.dto';
import { Prize } from 'src/app/models/prize.model';
import { ResponseList } from 'src/app/models/response-list.model';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ToastService } from 'src/app/shared/services/toast.services';
import { ClientTableDTO } from '../../models/client-table.dto';
import { ClientService } from '../../services/client.service';
import { PartyService } from '../../services/party.service';

@Component({
  selector: 'app-bar-prizes',
  templateUrl: './bar-prizes.component.html',
  styleUrls: ['./bar-prizes.component.scss']
})
export class BarPrizesComponent implements OnInit {

  prizes: Prize[] = [];
  loading = false;
  me!: ClientTableDTO;
  
  constructor(
    private matDialog: MatDialog,
    private clientService: ClientService,
    private toastService: ToastService,
    private partyService: PartyService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.getPrizes();
    this.me = this.clientService.clientTable;
  }

  getPrizes(): void {
    this.loading = true;
    const prizesObserver: PartialObserver<ResponseList<Prize>> = {
      next: (prizes: ResponseList<Prize>) => {
        this.prizes = prizes?.list;
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.openErrorToast(error.error?.message);
        this.loading = false;
      }
    };
    this.partyService.getBarPrizes().subscribe(prizesObserver);
  }

  openReedemPrizeDialog(prize: Prize): void {
    this.matDialog.open(DialogComponent, {
      panelClass: 'custom-dialog-container',
      width: '80%',
      maxWidth: '350px',
      data: {
        title: 'Atención!',
        messages: [`Deseas canjear '${prize.name}'?`, `Se le descontarán ${prize.points} coins a tu party.`],
        canCancel: true,
        closeMessage: 'Cancelar',
        actions: [{
          message: 'Canjear'
        }],
      },
    }).beforeClosed().subscribe((response) => {
      if(response)
        this.redeemPrize(prize);
    });
  }

  redeemPrize(prize: Prize): void {
    const redeemPrizeObserver: PartialObserver<{ code: number, message: string }> = {
      next: (response: { code: number, message: string }) => {
        if(response.code == 0)
          this.openSuccessfullReddemPrizeDialog(prize)
        else
          this.notificationService.openWarningDialog([response.message]);
      },
      error: (error: HttpErrorResponse) => {
       if(error.error?.code && error.error.code >= 0 && error.error.message) {
        if(error.error.code === "0052")
          this.notificationService.openWarningDialog([
            'Lo sentimos, el premio no esta disponible en este momento.', 
            `Fecha de validez: ${moment(prize.startDate).format('DD/MM/YYYY')} a ${moment(prize.endDate).format('DD/MM/YYYY')}.`
          ]);
        else
          this.notificationService.openWarningDialog([error.error.message]);
       }
       else
        this.toastService.openErrorToast(error.error?.message)
      }
    };
    this.partyService.redeemPrize(prize.id!).subscribe(redeemPrizeObserver);
  }

  checkCurrentCoins(prize: Prize): void {
    const coinsObserver: PartialObserver<Value | number> = {
      next: (coins: Value | number) => {
        const currentCoins = typeof coins === "number" ? coins : coins.value;

        if(!currentCoins || currentCoins < prize.points) {
          const messages = ['No tienes suficientes puntos para canjear el premio. Participá en las votaciones y demas actividades del bar para conseguir mas coins.'];
          this.notificationService.openWarningDialog(messages);
        } else 
          this.openReedemPrizeDialog(prize);
      },
      error: (error: HttpErrorResponse) => this.toastService.openErrorToast(error.error?.message)
    };
    this.partyService.getCurrentCoins(this.me.partyId).pipe(take(1)).subscribe(coinsObserver);
  }

  openSuccessfullReddemPrizeDialog(prize: Prize): void {
    this.matDialog.open(DialogComponent, {
      panelClass: 'custom-dialog-container',
      width: '80%',
      maxWidth: '350px',
      data: {
        title: 'Felicitaciones!',
        messages: [`Acabas de ganar: ${prize.name}.`, 'Espero que disfrutes tu premio!'],
        canCancel: false,
        actions: [{}],
      },
    });
  }
}
