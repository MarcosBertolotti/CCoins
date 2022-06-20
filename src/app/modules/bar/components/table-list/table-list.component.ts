import { SelectionModel } from '@angular/cdk/collections';
import { BreakpointObserver } from '@angular/cdk/layout';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, PartialObserver } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Bar } from 'src/app/models/bar-model';
import { Table } from 'src/app/models/table.model';
import { BarService } from 'src/app/services/bar.service';
import { TableService } from 'src/app/services/table.service';
import { ToastService } from 'src/app/shared/services/toast.services';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.scss']
})
export class TableListComponent implements OnInit {

  bar!: Bar;
  tables: Table[] = [];
  formGroup!: FormGroup;

  initColumns: any[] = [
    { name: 'detail', display: 'Detalle', show: true },
    { name: 'active', display: 'Activo' , show: true },
    { name: 'number', display: 'Número', show: true },
    { name: 'qrCode', display: 'Código QR', show: true },
  ];
  displayedColumns: any[] = this.initColumns.map(col => col.name);

  dataSource!: MatTableDataSource<Table>;
  selection!: SelectionModel<Table>;

  isSmallScreen$: Observable<boolean> = this.breakpointObserver.observe('(max-width: 960px)')
   .pipe(
     map(result => result.matches),
     shareReplay()
   );

  constructor(
    private toastService: ToastService,
    private barService: BarService,
    private tableService: TableService,
    private route: ActivatedRoute,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    const idBar = +this.route.snapshot.paramMap.get('id')!;
    if(!idBar) this.goToHome();

    this.getCurrentBar(idBar);
  }

  private goToHome(): void {
    this.router.navigate(['/']);
  }

  private getCurrentBar(idBar: number): void {
    const barObserver: PartialObserver<Bar> = {
      next: async (bar: Bar) => {
        this.bar = bar;
        this.getTables(idBar);
      },
      error: (error: HttpErrorResponse) => { 
        this.toastService.openErrorToast(error.error.message);
        this.goToHome();
      },
    };
    this.barService.getCurrentBar(idBar).subscribe(barObserver);  
  }

  private async getTables(idBar: number): Promise<void> {
    const tables: any = await this.tableService.findAllByBar(idBar)
      .catch((error: HttpErrorResponse) =>  this.toastService.openErrorToast(error.error.message));

    if(tables && tables.list?.length > 0) {
      this.tables = tables.list;
      this.buildForm();
      this.dataSource = new MatTableDataSource<Table>(this.tables);
      this.selection = new SelectionModel<Table>(true, this.tables);
    }
  }

  private buildForm(): void {
    this.formGroup = this.formBuilder.group({
      tables: this.formBuilder.array([])
    })
    this.setTablesForm();
    this.formGroup.get('tables')?.valueChanges.subscribe(tables => {console.log('tables', tables)});
  }

  private setTablesForm(){
    const tableCtrl = this.formGroup.get('tables') as FormArray;
    this.tables.forEach((table: Table)=>{
      tableCtrl.push(this.setTablesFormArray(table))
    })
  };

  private setTablesFormArray(table: Table){
    return this.formBuilder.group({
      id: [table.id],
      active: [table.active],
    });
  }

  update(): void {
    // WIP
    console.log(this.formGroup.get('tables')?.value)
  }

  // Selects all rows if they are not all selected; otherwise clear selection.
  masterToggle(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  // Whether the number of selected items matches the total number of rows.
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
}
