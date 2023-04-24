import { BreakpointObserver } from '@angular/cdk/layout';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, PartialObserver } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Bar } from 'src/app/models/bar-model';
import { CoinsRegister } from 'src/app/models/coins-register.model';
import { CoinsReport } from 'src/app/models/coins-report.model';
import { Table } from 'src/app/models/table.model';
import { BarService } from 'src/app/services/bar.service';
import { TableService } from 'src/app/services/table.service';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { ParseArrayToDatePipe } from 'src/app/shared/pipes/parse-array-to-date';
import { ToastService } from 'src/app/shared/services/toast.services';
import { environment } from 'src/environments/environment';
import { CoinsService } from '../../services/coins.service';

@Component({
  selector: 'app-table-detail',
  templateUrl: './table-detail.component.html',
  styleUrls: ['./table-detail.component.scss']
})
export class TableDetailComponent implements OnInit {

  bar!: Bar;
  table!: Table;
  QRURL!: string;

  initColumns: any[] = [
    { name: 'coins', display: 'Coins', show: true },
    { name: 'client', display: 'Miembro', show: false },
    { name: 'activity', display: 'Actividad', show: true },
    { name: 'date', display: 'Fecha' , show: false },
    { name: 'state', display: 'Estado' , show: true },
  ];
  displayedColumns: any[] = this.initColumns.map(col => col.name);

  dataSource!: MatTableDataSource<CoinsRegister>;

  isSmallScreen$: Observable<boolean> = this.breakpointObserver.observe('(max-width: 960px)')
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  coinsReport!: CoinsReport;
  selectedType: string = '';
  currentPage = 0;
  reportLength = 0;

  constructor(
    private barService: BarService,
    private tableService: TableService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router,
    private matDialog: MatDialog,
    private parseArrayToDatePipe: ParseArrayToDatePipe,
    private breakpointObserver: BreakpointObserver,
    private coinsService: CoinsService,
  ) { }

  ngOnInit(): void {
    const idBar = +this.route.snapshot.paramMap.get('id')!;
    const idTable = +this.route.snapshot.paramMap.get('idTable')!;
    if(!idBar || !idTable) this.goToHome();

    this.getCurrentBar(idBar, idTable);
  }

  private goToHome(): void {
    this.router.navigate(['/']);
  }

  private getCurrentBar(idBar: number, idTable: number): void {
    const barObserver: PartialObserver<Bar> = {
      next: async (bar: Bar) => {
        this.bar = bar;
        this.getTable(idTable);
      },
      error: (error: HttpErrorResponse) => { 
        this.toastService.openErrorToast(error.error?.message);
        this.goToHome();
      },
    };
    this.barService.getCurrentBar(idBar).subscribe(barObserver);  
  }

  private getTable(idTable: number): void {
    this.tableService.findById(idTable)
      .then((table: Table) => { 
        this.table = table;
        this.getPartyCoinsReport();
        this.QRURL = `${environment.PWA_URL}/login/${table.code}`;
        const date = table.startDate;
        if(table.startDate.length > 0) {
          this.table.startDate = this.parseArrayToDatePipe.transform(date);
          this.table.startDate.setHours(date[3], date[4], date[5]);
        }
      })
      .catch((error: HttpErrorResponse) => this.toastService.openErrorToast(error.error?.message));
  }

  toggleActive(): void {
    this.tableService.updateActive(this.table.id)
      .then((table: Table) => {
        this.table.active = table.active;
        const status = this.table.active ? 'activada' : 'desactivada';
        this.toastService.openSuccessToast(`Mesa ${this.table.number} ${status} exitosamente!`);
      })
      .catch(() => this.toastService.openErrorToast('Ocurrió un error al actualizar la mesa'))
  }

  updateQR(): void {
    const dialogRef = this.matDialog.open(DialogComponent, {
      width: '80%',
      maxWidth: '350px',
      panelClass: 'custom-dialog-container',
      data: {
        messages: [
          `Se actualizará el código QR de la mesa número ${this.table.number}`,
          'Recordá que se deberá descargar nuevamente la imagen QR para su correcto funcionamiento.',
        ],
        title: `Actualizar código QR`,
        closeMessage: "Cancelar",
        canCancel: true,
        actions: [{
            message: "Actualizar",
            action: () => this.generateQRCode(),
        }],
      },
      disableClose: true
    });
  }

  generateQRCode(): void {
    this.tableService.generateCodesByList([this.table.id])
    .then(() => this.toastService.openSuccessToast(`Código QR de mesa ${this.table.number} actualizado exitosamente!`))
    .catch((error: HttpErrorResponse) => this.toastService.openErrorToast(error.error?.message))
  }

  // party coins

  getPartyCoinsReport(): void {
    //this.loading = true;
    const gamesObserver: PartialObserver<CoinsReport> = {
      next: (response: CoinsReport) => {
        this.coinsReport = response;
        this.reportLength = this.coinsReport?.report?.totalElements;
        if(this.coinsReport?.report?.content)
          this.dataSource = new MatTableDataSource<CoinsRegister>(this.coinsReport.report.content);
        //this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.openErrorToast(error.error?.message);
        //this.loading = false;
      },   
    };
    this.coinsService.partyReport(this.table.id, this.selectedType, this.currentPage).subscribe(gamesObserver);
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
