import { SelectionModel } from '@angular/cdk/collections';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { PartialObserver } from 'rxjs';
import { Bar } from 'src/app/models/bar-model';
import { ResponseData } from 'src/app/models/response-data.model';
import { Table } from 'src/app/models/table.model';
import { BarService } from 'src/app/services/bar.service';
import { ImagesService } from 'src/app/services/images.service';
import { TableService } from 'src/app/services/table.service';
import { QrcodeDialogComponent } from 'src/app/shared/components/qrcode-dialog/qrcode-dialog.component';
import { ToastService } from 'src/app/shared/services/toast.services';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.scss']
})
export class TableListComponent implements OnInit {

  bar!: Bar;
  barTables: Table[] = [];
  formGroup!: FormGroup;
  initForm: boolean = false;

  initColumns: any[] = [
    { name: 'detail', display: 'Detalle', show: true },
    { name: 'active', display: 'Activo' , show: true },
    { name: 'number', display: 'Número', show: true },
    { name: 'qrCode', display: 'Código QR', show: true },
  ];
  displayedColumns: any[] = this.initColumns.map(col => col.name);

  dataSource!: MatTableDataSource<Table>;
  selection!: SelectionModel<Table>;

  constructor(
    private toastService: ToastService,
    private barService: BarService,
    private tableService: TableService,
    private imagesService: ImagesService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
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
      this.barTables = tables.list;
      this.updateMatTable();
    }
    this.buildForm();
  }

  private buildForm(): void {
    this.formGroup = this.formBuilder.group({
      tables: this.formBuilder.array([]),
      quantity: [this.barTables.length, [Validators.required, Validators.min(1), Validators.max(20)]],
    })
    this.setTablesForm(this.barTables);
    this.initForm = true;
    //this.tables?.valueChanges.subscribe(tables => {console.log('tables', tables)});
  }

  private setTablesForm(barTables: Table[]) {
    const tablesCtrl = this.tables;
    barTables.forEach((table: Table)=>{
      tablesCtrl.push(this.setTablesFormArray(table))
    })
  };

  private setTablesFormArray(table: Table){
    return this.formBuilder.group({
      id: [table.id],
      active: [table.active],
    });
  }

  private removeTablesForm(quantity: number) {
    this.tables.removeAt(quantity);
  };

  update(): void {
    // WIP
    console.log("WIP", this.tables?.value)
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

  downloadPDF(): void {
    const tables: any = this.barTables.map((table: Table) => { return { number: table.number, code: table.qrCode } })

    this.imagesService.generatePDFWithQRCodes(tables)
      .then((response) => console.log("download PDF",response))
      .catch((error: HttpErrorResponse) => this.toastService.openErrorToast(error.error.message))
  }

  async updateQuantity(quantity?: number): Promise<void> {
    if(quantity && (quantity > 0 || (quantity <= 0 && this.quantity.value > 1)))
      this.quantity.setValue(this.quantity.value + quantity);

    const quantityToUpdate = (this.quantity.value - this.barTables.length);
    let response;

    if(quantityToUpdate !== 0 && (this.barTables.length + quantityToUpdate) > 0)
      response = quantityToUpdate > 0 ? this.createTables(quantityToUpdate) : this.removeTables(quantityToUpdate * -1);
  }

  private createTables(quantity: number): Promise<any> {
    return this.tableService.createByQuantity(quantity, this.bar.id!)
    .then((response: ResponseData<Table>) => {
      if(response.data && response.data.length > 0) {
        this.barTables = [...this.barTables, ...response.data];
        this.setTablesForm(response.data);
        this.updateMatTable();
      }
    })
    .catch((error: HttpErrorResponse) => this.toastService.openErrorToast(error.error.message));
  }

  private removeTables(quantity: number): Promise<any> {
    return this.tableService.removeByQuantity(quantity, this.bar.id!)
    .then(() => {
      this.barTables.length = this.barTables.length - quantity;
      this.removeTablesForm(quantity);
      this.updateMatTable();
    })
    .catch((error: HttpErrorResponse) => this.toastService.openErrorToast(error.error.message));
  }

  private updateMatTable(): void {
    this.dataSource = new MatTableDataSource<Table>(this.barTables);
    this.selection = new SelectionModel<Table>(true, this.barTables);
  }

  public openQRDialog(qrCode: string, tableNumber: string) {
    const dialogRef = this.matDialog.open(QrcodeDialogComponent, {
      width: '80%',
      maxWidth: '350px',
      panelClass: 'custom-dialog-container',
      data: {
        url: qrCode,
        title: `Mesa ${tableNumber}`,
        closeMessage: "Cerrar",
        canCancel: true,
      },
      disableClose: true
    });
  }

  get quantity() { return this.formGroup.get('quantity') as FormControl }
  get tables() { return this.formGroup.get('tables') as FormArray }

}
