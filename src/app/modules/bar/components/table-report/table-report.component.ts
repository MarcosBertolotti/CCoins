import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { CoinsRegister } from 'src/app/models/coins-register.model';

@Component({
  selector: 'app-table-report',
  templateUrl: './table-report.component.html',
  styleUrls: ['./table-report.component.scss']
})
export class TableReportComponent implements OnInit {

  @Input()
  dataSource!: MatTableDataSource<CoinsRegister>;

  selectedType: string = '';
  currentPage = 0;
  @Input()
  reportLength = 0;

  @Output()
  getReportEvent = new EventEmitter<{selectedType: string, currentPage: number}>();

  initColumns: any[] = [
    { name: 'coins', display: 'Coins', show: true },
    { name: 'client', display: 'Miembro', show: false },
    { name: 'activity', display: 'Actividad', show: true },
    { name: 'date', display: 'Fecha' , show: false },
    { name: 'state', display: 'Estado' , show: true },
  ];
  displayedColumns: any[] = this.initColumns.map(col => col.name);

  isSmallScreen$: Observable<boolean> = this.breakpointObserver.observe('(max-width: 960px)')
  .pipe(
    map(result => result.matches),
    shareReplay()
  );
  
  constructor(
    private breakpointObserver: BreakpointObserver,
  ) { }

  ngOnInit(): void {
  }

  filter(type: string = ''): void {
    this.selectedType = type;
    this.currentPage = 0;
    this.getReportEvent.emit({ selectedType: this.selectedType, currentPage: this.currentPage});
  }

  pageChangeEvent(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.getReportEvent.emit({ selectedType: this.selectedType, currentPage: this.currentPage});
  }
}
