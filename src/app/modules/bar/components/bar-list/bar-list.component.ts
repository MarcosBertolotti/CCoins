import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AppPaths } from 'src/app/enums/app-paths.enum';
import { Bar } from 'src/app/models/bar-model';
import { BarService } from 'src/app/services/bar.service';
import { ToastService } from 'src/app/shared/services/toast.services';

@Component({
  selector: 'app-bar-list',
  templateUrl: './bar-list.component.html',
  styleUrls: ['./bar-list.component.scss']
})
export class BarListComponent implements OnInit {

  initColumns: any[] = [
    { name: 'detail', display: 'Detalle', show: true },
    { name: 'tables', display: 'Mesas' , show: false },
    { name: 'active', display: 'Activo', show: false },
    { name: 'name', display: 'Nombre', show: true },
    { name: 'address', display: 'Dirección', show: true },
    { name: 'city', display: 'Localidad', show: false },
    { name: 'menuLink', display: 'Link menu', show: false },
  ];
  displayedColumns: any[] = this.initColumns.map(col => col.name);

  dataSource!: MatTableDataSource<Bar>;

  isSmallScreen$: Observable<boolean> = this.breakpointObserver.observe('(max-width: 960px)')
   .pipe(
     map(result => result.matches),
     shareReplay()
   );
 
  bars: Bar[] = [];
  appPaths = AppPaths;

  constructor(
    private barsService: BarService,
    private toastService: ToastService,
    private breakpointObserver: BreakpointObserver,
  ) { }

  async ngOnInit(): Promise<void> {
    this.barsService.findAllByOwner()
    .then((response) => {
      if(response && response.list && response.list.length > 0) {
        this.bars = response.list;
        this.dataSource = new MatTableDataSource<Bar>(this.bars);
      }
    })
    .catch((error: HttpErrorResponse) => {})
  }

  toggleActive(id: number): void {
    this.barsService.updateActive(id)
      .then(() => this.toastService.openSuccessToast('Bar actualizado exitosamente!'))
      .catch(() => this.toastService.openSuccessToast('Ocurrió un error al actualizar el bar'))
  }
}

 /*
  selection = new SelectionModel<Bar>(true, []);

  // Whether the number of selected items matches the total number of rows.
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  // Selects all rows if they are not all selected; otherwise clear selection.
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  // The label for the checkbox on the passed row
  checkboxLabel(row?: Bar): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${2}`; // revisar
  }
*/
