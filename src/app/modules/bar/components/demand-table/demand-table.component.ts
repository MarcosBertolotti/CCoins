import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, PartialObserver } from 'rxjs';
import { Demand } from '../../models/demand.model';
import { DemandTypes } from '../../enums/demand-types.enum';
import { DemandReport } from '../../models/demand-report.model';
import { ResponseHttp } from 'src/app/models/response-http.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from 'src/app/shared/services/toast.services';
import { CoinsService } from '../../services/coins.service';

@Component({
  selector: 'app-demand-table',
  templateUrl: './demand-table.component.html',
  styleUrls: ['./demand-table.component.scss']
})
export class DemandTableComponent implements OnInit {

  @Input()
  demandReport!: DemandReport

  @Input()
  dataSource!: MatTableDataSource<Demand>;

  @Input()
  isSmallScreen$!: Observable<boolean>;

  @Input()
  actionsDescription: { [key: string]: string } = {};

  @Output()
  onAction = new EventEmitter<void>();
  
  demandTypes = DemandTypes;

  initColumns: any[] = [
    { name: 'tableNumber', display: 'Mesa', show: true},
    { name: 'prizeName', display: 'Solicitud' , show: true },
    { name: 'partyName', display: 'Party', show: true},
    { name: 'date', display: 'Fecha', show: false },
    { name: 'state', display: 'Estado', show: true },
    { name: 'action', display: 'Acciones', show: true },
  ];
  displayedColumns: any[] = this.initColumns.map(col => col.name);

  constructor(
    private coinsService: CoinsService,
    private toastService: ToastService,
  ) { }

  ngOnInit(): void {
  }

  deliver(coinsId: number): void {
    const deliverObserver: PartialObserver<ResponseHttp> = {
      next: async (response: ResponseHttp) => {
        if(response?.code == null)
          this.toastService.openSuccessToast(response?.message);
        else
          this.toastService.openErrorToast(response?.message);
      },
      error: (error: HttpErrorResponse) => this.toastService.openErrorToast(error.error?.message),
      complete: () => this.onAction.next()
    };
    this.coinsService.deliver(coinsId).subscribe(deliverObserver);  
  }

  cancel(coinsId: number): void {
    const cancelObserver: PartialObserver<ResponseHttp> = {
      next: async (response: ResponseHttp) => {
        if(response?.code == null)
          this.toastService.openSuccessToast(response?.message);
        else
          this.toastService.openErrorToast(response?.message);
      },
      error: (error: HttpErrorResponse) => this.toastService.openErrorToast(error.error?.message),
      complete: () => this.onAction.next()
    };
    this.coinsService.cancel(coinsId).subscribe(cancelObserver);  
  }

  adjust(coinsId: number): void {
    const adjustObserver: PartialObserver<ResponseHttp> = {
      next: async (response: ResponseHttp) => {
        if(response?.code == null)
          this.toastService.openSuccessToast(response?.message);
        else
          this.toastService.openErrorToast(response?.message);
      },
      error: (error: HttpErrorResponse) => this.toastService.openErrorToast(error.error?.message),
      complete: () => this.onAction.next()
    };
    this.coinsService.adjust(coinsId).subscribe(adjustObserver);  
  }

}
