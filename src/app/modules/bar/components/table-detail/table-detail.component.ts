import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, PartialObserver, forkJoin } from 'rxjs';
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
import { Client } from 'src/app/models/client.model';
import { ResponseList } from 'src/app/models/response-list.model';
import { PartyService } from '../../services/party.service';
import { MemberList } from 'src/app/models/member-list.model';

@Component({
  selector: 'app-table-detail',
  templateUrl: './table-detail.component.html',
  styleUrls: ['./table-detail.component.scss']
})
export class TableDetailComponent implements OnInit {

  bar!: Bar;
  table!: Table;
  QRURL!: string;

  dataSource!: MatTableDataSource<CoinsRegister>;
  coinsReport!: CoinsReport;
  reportLength = 0;

  dataSourceClients!: MatTableDataSource<Client>;
  idParty!: number;
  idTable!: number;
  members!: Client[];

  initColumns: any[] = [
    { name: 'nickName', display: 'Nickname', show: true },
    { name: 'leader', display: 'Líder', show: false },
    { name: 'active', display: 'Activo', show: true },
    { name: 'startDate', display: 'Fecha inicio', show: true },
  ];
  displayedColumns: any[] = this.initColumns.map(col => col.name);

  loading = false;

  constructor(
    private barService: BarService,
    private tableService: TableService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router,
    private matDialog: MatDialog,
    private parseArrayToDatePipe: ParseArrayToDatePipe,
    private coinsService: CoinsService,
    private partyService: PartyService,
  ) { }

  ngOnInit(): void {
    const idBar = +this.route.snapshot.paramMap.get('id')!;
    this.idTable = +this.route.snapshot.paramMap.get('idTable')!;
    if(!idBar || !this.idTable) this.goToHome();

    this.getCurrentBar(idBar, this.idTable);
    this.getMembers();
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
        }
      })
      .catch((error: HttpErrorResponse) => this.toastService.openErrorToast(error.error?.message));
  }

  async getMembers(): Promise<void> {
    this.tableService.getTablePartyMembers(this.idTable)
    .then((response: MemberList) => {
      this.members = response?.list || [];
      this.idParty = response?.party;
      this.dataSourceClients = new MatTableDataSource<Client>(this.members);
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
    .then(() => {
      this.toastService.openSuccessToast(`Código QR de mesa ${this.table.number} actualizado exitosamente!`);
      this.getTable(this.table.id);
    })
    .catch((error: HttpErrorResponse) => this.toastService.openErrorToast(error.error?.message))
  }

  getPartyCoinsReport(selectedType = '', currentPage = 0): void {
    const reportObserver: PartialObserver<CoinsReport> = {
      next: (response: CoinsReport) => {
        this.coinsReport = response;
        this.reportLength = this.coinsReport?.report?.totalElements;
        if(this.coinsReport?.report?.content)
          this.dataSource = new MatTableDataSource<CoinsRegister>(this.coinsReport.report.content);
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.openErrorToast(error.error?.message);
      },   
    };
    this.coinsService.partyReport(this.table.id, selectedType, currentPage).subscribe(reportObserver);
  }

  getReportEvent(event: { selectedType: string, currentPage: number}): void {
    this.getPartyCoinsReport(event.selectedType, event.currentPage);
  }

  refresh(): void {
    this.loading = true;

    const coinsReportObservable = new Observable<void>((observer) => {
      try {
        this.getPartyCoinsReport();
        observer.next();
        observer.complete();
      } catch (error) {
        observer.error(error);
      }
    });
    
    forkJoin([this.getMembers(), coinsReportObservable])
    .toPromise()
    .finally(() => this.loading = false);
  }

  closeTable(): void {
    if(!this.members) return;
    
    const idMembers = this.members.map((client: Client) => client.id);

    this.partyService.kickMembers(this.idParty, idMembers, false)
    .then((response: any) => {
      this.toastService.openSuccessToast("Se ha cerrado la mesa exitosamente!");
      this.members = [];
      this.dataSourceClients.data = [];
    })
    .catch((error: HttpErrorResponse) => this.toastService.openErrorToast(error.error?.message))
  }
}
