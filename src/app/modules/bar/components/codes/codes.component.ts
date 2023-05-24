import { Component, OnInit } from '@angular/core';
import { AppPaths } from 'src/app/enums/app-paths.enum';
import { codeService } from '../../services/code.service';
import { Code } from 'src/app/models/code.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from 'src/app/shared/services/toast.services';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, PartialObserver } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CodeRedeemComponent } from '../code-redeem/code-redeem.component';
import { Bar } from 'src/app/models/bar-model';
import { ResponseList } from 'src/app/models/response-list.model';
import { Table } from 'src/app/models/table.model';
import { BarService } from 'src/app/services/bar.service';
import { TableService } from 'src/app/services/table.service';

@Component({
  selector: 'app-codes',
  templateUrl: './codes.component.html',
  styleUrls: ['./codes.component.scss']
})
export class CodesComponent implements OnInit {

  appPaths = AppPaths;
  codes: Code[] = [];
  showActive = true;

  initColumns: any[] = [
    { name: 'code', display: 'Código', show: true},
    { name: 'points', display: 'Puntos' , show: true },
    { name: 'prize', display: 'Premio', show: true },
    { name: 'perPerson', display: 'Por persona', show: false },
    { name: 'oneUse', display: 'Un uso', show: false },
    { name: 'active', display: 'Activo', show: false },
    { name: 'state', display: 'Estado', show: true },
    { name: 'startDate', display: 'Inicio', show: false },
    { name: 'EndDate', display: 'Fin', show: false },
    { name: 'action', display: '', show: false },
  ];
  displayedColumns: any[] = this.initColumns.map(col => col.name);
  dataSource!: MatTableDataSource<Code>;

  isSmallScreen$!: Observable<boolean>;
  idBar!: number;
  barTables: Table[] = [];

  constructor(
    private matDialog: MatDialog,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private codeService: codeService,
    private barService: BarService,
    private tableService: TableService,
    private breakpointObserver: BreakpointObserver,
  ) {
    this.subscribeBreakpointObserver();
  }

  ngOnInit(): void {
    this.idBar = +this.route.snapshot.paramMap.get('id')!;

    this.getActiveCodes();
    this.getTables();
  }

  getActiveCodes(): void {
    this.showActive = true;

    this.codeService.getActives()
    .then((codes: Code[]) => {
      this.codes = codes;
      if(this.dataSource)
        this.dataSource.data = this.codes;
      else
        this.dataSource = new MatTableDataSource<Code>(this.codes);
    })
    .catch((error: HttpErrorResponse) => this.toastService.openErrorToast(error.error?.message));
  }

  getInactiveCodes(): void {
    this.showActive = false;

    this.codeService.getInactives()
    .then((codes: Code[]) => {
      this.codes = codes;
      if(this.dataSource)
        this.dataSource.data = this.codes;
      else
        this.dataSource = new MatTableDataSource<Code>(this.codes);
    })
    .catch((error: HttpErrorResponse) => this.toastService.openErrorToast(error.error?.message));
  }

  invalidate(codeText: string): void {
    this.codeService.invalidate(codeText)
    .then((updatedCode: Code) => {
      if(this.showActive)
        this.getActiveCodes();
      else
        this.getInactiveCodes();
    })
    .catch((error: HttpErrorResponse) => this.toastService.openErrorToast(error.error?.message));
  }

  private async getTables(): Promise<void> {
    this.tableService.findAllByBar(this.idBar)
    .then((tables: ResponseList<Table>) => {
      this.barTables = tables?.list || [];
    })
    .catch((error: HttpErrorResponse) =>  this.toastService.openErrorToast(error.error?.message));
  }

  openRedeemDialog(): void {
    this.matDialog.open(CodeRedeemComponent, {
      panelClass: ['custom-dialog-container', 'bg-white'],
      width: '80%',
      maxWidth: '350px',
      data: {
        tables: this.barTables
      }
    })
  }

  redeem(codeText: string, partyId: number): void {
    this.codeService.redeem(codeText, partyId)
    .then((response) => {
      console.log("redeem response: ", response);
    })
    .catch((error: HttpErrorResponse) => this.toastService.openErrorToast(error.error?.message));
  }

  subscribeBreakpointObserver() {
    this.isSmallScreen$ = this.breakpointObserver.observe('(max-width: 960px)')
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  }
}
