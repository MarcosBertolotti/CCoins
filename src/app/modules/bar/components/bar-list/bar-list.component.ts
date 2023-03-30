import { BreakpointObserver } from '@angular/cdk/layout';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AppPaths } from 'src/app/enums/app-paths.enum';
import { Bar } from 'src/app/models/bar-model';
import { BarService } from 'src/app/services/bar.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { ToastService } from 'src/app/shared/services/toast.services';

@Component({
  selector: 'app-bar-list',
  templateUrl: './bar-list.component.html',
  styleUrls: ['./bar-list.component.scss']
})
export class BarListComponent implements OnInit, OnDestroy {

  initColumns: any[] = [
    { name: 'detail', display: 'Detalle', show: true},
    { name: 'tables', display: 'Mesas' , show: false, routeTo: AppPaths.TABLES, icon: 'table_bar' },
    { name: 'games', display: 'Actividades', show: false, routeTo: AppPaths.ACTIVITIES, icon: 'emoji_objects' },
    { name: 'prizes', display: 'Premios', show: false, routeTo: AppPaths.PRIZES, icon: 'emoji_events' },
    { name: 'active', display: 'Activo', show: false },
    { name: 'name', display: 'Nombre', show: true },
    { name: 'address', display: 'Dirección', show: true },
  ];
  displayedColumns: any[] = this.initColumns.map(col => col.name);

  dataSource!: MatTableDataSource<Bar>;

  isSmallScreen$!: Observable<boolean>;
 
  bars: Bar[] = [];
  appPaths = AppPaths;
  loading = true;

  constructor(
    private barsService: BarService,
    private toastService: ToastService,
    private breakpointObserver: BreakpointObserver,
    private navigationService: NavigationService,
  ) { 
    this.navigationService.showNavbar();
    this.subscribeBreakpointObserver();
  }

  async ngOnInit(): Promise<void> {
    this.barsService.findAllByOwner()
    .then((response) => {
      if(response && response.list && response.list.length > 0) {
        this.bars = response.list;
        this.dataSource = new MatTableDataSource<Bar>(this.bars);
      }
      if(!this.barsService.currentBar && this.bars?.length === 1)
        this.barsService.currentBar = this.bars[0];
        
      this.loading = false;
    })
    .catch(() => this.loading = false)
  }

  ngOnDestroy(): void {
    this.navigationService.hideNavbar();
  }

  toggleActive(id: number): void {
    this.barsService.updateActive(id)
      .then((bar: Bar) => {
        const message = bar.active ? `${bar.name} activado exitosamente!` : `${bar.name} desactivado exitosamente!`;
        this.toastService.openSuccessToast(message);
      })
      .catch(() => this.toastService.openErrorToast('Ocurrió un error al actualizar el bar'))
  }

  subscribeBreakpointObserver() {
    this.isSmallScreen$ = this.breakpointObserver.observe('(max-width: 960px)')
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  }
}

