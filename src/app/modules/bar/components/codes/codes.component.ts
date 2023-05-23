import { Component, OnInit } from '@angular/core';
import { AppPaths } from 'src/app/enums/app-paths.enum';
import { codeService } from '../../services/code.service';
import { Code } from 'src/app/models/code.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from 'src/app/shared/services/toast.services';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';

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
  
  constructor(
    private toastService: ToastService,
    private codeService: codeService,
    private breakpointObserver: BreakpointObserver,
  ) {
    this.subscribeBreakpointObserver();
  }

  ngOnInit(): void {
    this.getActiveCodes();
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

  subscribeBreakpointObserver() {
    this.isSmallScreen$ = this.breakpointObserver.observe('(max-width: 960px)')
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  }
}
