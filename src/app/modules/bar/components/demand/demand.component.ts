import { Component, OnInit } from '@angular/core';
import { Observable, PartialObserver } from 'rxjs';
import { DemandReport } from '../../models/demand-report.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from 'src/app/shared/services/toast.services';
import { CoinsService } from '../../services/coins.service';
import { MatTableDataSource } from '@angular/material/table';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { Demand } from '../../models/demand.model';
import { DemandActionDescription } from '../../models/demand-action-description.model';

@Component({
  selector: 'app-demand',
  templateUrl: './demand.component.html',
  styleUrls: ['./demand.component.scss']
})
export class DemandComponent implements OnInit {

  outDemandReport!: DemandReport;
  inDemandReport!: DemandReport;

  dataSourceOutDemand!: MatTableDataSource<Demand>;
  dataSourceInDemand!: MatTableDataSource<Demand>;

  isSmallScreen$!: Observable<boolean>;

  demandActionsDescription: { [key: string]: string } = {};

  constructor(
    private toastService: ToastService,
    private coinsService: CoinsService,
    private breakpointObserver: BreakpointObserver,
  ) { }

  ngOnInit(): void {
    this.subscribeBreakpointObserver();
    this.findOutDemandReport();
    this.findInDemandReport();
    this.getCurrentActionsDescription();
  }

  findDemandReport(): void {
    this.findOutDemandReport();
    this.findInDemandReport();
    this.countCurrentDemand();
  }

  findOutDemandReport(): void {
    const outDemandObserver: PartialObserver<DemandReport> = {
      next: async (outDemand: DemandReport) => {
        this.outDemandReport = outDemand;
        this.dataSourceOutDemand = new MatTableDataSource<Demand>(this.outDemandReport?.data || []);
      },
      error: (error: HttpErrorResponse) => this.toastService.openErrorToast(error.error?.message),
    };
    this.coinsService.getOutDemandReport().subscribe(outDemandObserver);  
  }

  findInDemandReport(): void {
    const inDemandObserver: PartialObserver<DemandReport> = {
      next: async (inDemand: DemandReport) => {
        this.inDemandReport = inDemand;
        this.dataSourceInDemand = new MatTableDataSource<Demand>(this.inDemandReport?.data || []);
      },
      error: (error: HttpErrorResponse) => this.toastService.openErrorToast(error.error?.message),
    };
    this.coinsService.getInDemandReport().subscribe(inDemandObserver);  
  }

  getCurrentActionsDescription(): void {
    const actionsDescriptionObserver: PartialObserver<DemandActionDescription[]> = {
      next: async (response: DemandActionDescription[]) => {
        if(response) {
          const actionsDescriptionObj: { [key: string]: string } = {};
          response.forEach((action: DemandActionDescription) => {
            actionsDescriptionObj[action.name] = action.description;
          })
          this.demandActionsDescription = actionsDescriptionObj;
        }
      },
      error: (error: HttpErrorResponse) => this.toastService.openErrorToast(error.error?.message),
    };
    this.coinsService.getCurrentActionsDescription().subscribe(actionsDescriptionObserver);  
  }

  countCurrentDemand(): void {
    this.coinsService.countCurrentDemand().subscribe();
  }

  subscribeBreakpointObserver() {
    this.isSmallScreen$ = this.breakpointObserver.observe('(max-width: 960px)')
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  }

}
