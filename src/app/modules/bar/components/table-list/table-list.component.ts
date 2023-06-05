import { SelectionModel } from '@angular/cdk/collections';
import { BreakpointObserver } from '@angular/cdk/layout';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, PartialObserver } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Bar } from 'src/app/models/bar-model';
import { ResponseData } from 'src/app/models/response-data.model';
import { Table } from 'src/app/models/table.model';
import { BarService } from 'src/app/services/bar.service';
import { ImagesService } from 'src/app/services/images.service';
import { TableService } from 'src/app/services/table.service';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { QrcodeDialogComponent } from 'src/app/shared/components/qrcode-dialog/qrcode-dialog.component';
import { ToastService } from 'src/app/shared/services/toast.services';
import { format } from 'date-fns';
import esLocale from 'date-fns/locale/es';
import { TableParty } from '../../models/table-party.model';
import { ResponseList } from 'src/app/models/response-list.model';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.scss']
})
export class TableListComponent implements OnInit {

  bar!: Bar;
  barTables: Table[] = [];
  formGroup!: FormGroup;

  initColumns: any[] = [
    { name: 'detail', display: 'Detalle', show: true },
    { name: 'active', display: 'Activo' , show: true },
    { name: 'number', display: 'Número', show: true },
    { name: 'partyName', display: 'Party', show: false },
    { name: 'qrCode', display: 'Código QR', show: false },
    { name: 'updateQr', display: 'Actualizar QR', show: true },
  ];
  displayedColumns: any[] = this.initColumns.map(col => col.name);

  dataSource!: MatTableDataSource<Table>;
  selection!: SelectionModel<Table>;
  selectionQR: SelectionModel<Table> = new SelectionModel<Table>(true);

  isSmallScreen$: Observable<boolean> = this.breakpointObserver.observe('(max-width: 960px)')
  .pipe(
    map(result => result.matches),
    shareReplay()
  );
  
  constructor(
    private toastService: ToastService,
    private barService: BarService,
    private tableService: TableService,
    private imagesService: ImagesService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
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
        this.getTableParties(idBar);
      },
      error: (error: HttpErrorResponse) => { 
        this.toastService.openErrorToast(error.error?.message);
        this.goToHome();
      },
    };
    this.barService.getCurrentBar(idBar).subscribe(barObserver);  
  }

  async getTableParties(idBar: number): Promise<void> {
    const [tables, parties] = await Promise.all([
      this.getTables(idBar),
      this.getParties()
    ])

    if(tables && tables?.length > 0) {
      this.barTables = tables;
      if(parties && parties.length > 0)
        this.mapTableParties(parties);
      this.updateMatTable();
    }
    this.buildForm();
  }

  private async getTables(idBar: number): Promise<Table[]> {
    return await this.tableService.findAllByBar(idBar)
      .then((response: ResponseList<Table>) => response?.list || [])
      .catch((error: HttpErrorResponse) => {
        this.toastService.openErrorToast(error.error?.message);
        return [];
      });
  }

  private async getParties(): Promise<TableParty[]> {
    return await this.tableService.findAllWithActivePartyByBar()
      .catch((error: HttpErrorResponse) => {
        this.toastService.openErrorToast(error.error?.message);
        return [];
      });
  }

  async mapTableParties(parties: TableParty[]) {
    this.barTables.map((table: Table) => {
      let tableParty = parties.find((partyTable: TableParty) => partyTable.tableNumber === table.number);
      if(tableParty) {
        table.partyId = tableParty.id;
        table.partyName = tableParty.name;
        table.partyActive = table.active;
      }
    })
  }

  private buildForm(): void {
    this.formGroup = this.formBuilder.group({
      tables: this.formBuilder.array([]),
      quantity: [this.barTables.length, [Validators.required, Validators.min(1), Validators.max(20)]],
    })
    this.addTablesForm(this.barTables);
  }

  private addTablesForm(barTables: Table[]) {
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

  private removeTablesForm() {
    this.tables.clear();
    this.addTablesForm(this.barTables);
  };

  private updateMatTable(): void {
    if(!this.dataSource)
      this.dataSource = new MatTableDataSource<Table>(this.barTables);
    else
      this.dataSource.data = this.barTables;

    const tables = this.barTables.filter((table: Table) => table.active);

    if(!this.selection) {
      this.selection = new SelectionModel<Table>(true, tables, true);
    } else {
      this.selection.clear();
      this.selection.select(...tables);
    }
  }

  // Selects all rows if they are not all selected; otherwise clear selection.
  masterToggle(): void {
    if (this.isAllSelected(this.selection)) {
      this.updateActiveByList(this.dataSource.data);
      this.selection.clear();
      return;
    }
    const auxSelected = this.selection.selected;
    this.selection.select(...this.dataSource.data);

    const changedTables = this.selection.selected.filter(val => !auxSelected.includes(val));
    this.updateActiveByList(changedTables);
  }

  masterToggleQR(): void {
    if (this.isAllSelected(this.selectionQR))
      this.selectionQR.clear();
    else
      this.selectionQR.select(...this.dataSource.data);
  }

  toggleSelectionQR(table: Table): void {
    if(this.selectionQR.isSelected(table))
      this.selectionQR.deselect(table);
    else
      this.selectionQR.select(table);
  }

  updateQRSelecteds(): void {
    let ids: number[] = []
    let numbers: number[] = [];

    if(this.selectionQR.selected.length === 0) {
      this.toastService.openToast('Primero debe seleccionar los códigos QRs a actualizar.');
      return;
    }

    this.selectionQR.selected.forEach((table: Table) => {
      ids = [...ids, table.id];
      numbers = [...numbers, table.number];
    })
    numbers = numbers.sort((a: number, b: number) => a - b);
    const displayNumbers = numbers.length > 1 ? `${numbers.slice(0, -1).join(' - ')} - ${numbers.slice(-1)}` : numbers[0];

    const dialogRef = this.matDialog.open(DialogComponent, {
      width: '80%',
      maxWidth: '350px',
      panelClass: 'custom-dialog-container',
      data: {
        messages: [
          'Se actualizarán los códigos QRs de los siguientes números de mesas seleccionadas:',
          `${displayNumbers}`,
          'Recordá que se deberán descargar nuevamente las imágenes QR para su correcto funcionamiento.',
        ],
        title: `Actualizar códigos QRs`,
        closeMessage: "Cancelar",
        canCancel: true,
        actions: [{
            message: "Actualizar",
            action: () => this.generateQRCodes(ids),
        }],
      },
      disableClose: true
    });
  }

  generateQRCodes(ids: number[]): void {
    this.tableService.generateCodesByList(ids)
    .then(() => this.toastService.openSuccessToast(`${ids.length} códigos QRs actualizados exitosamente!`))
    .catch((error: HttpErrorResponse) => this.toastService.openErrorToast(error.error?.message))
    .finally(() => this.selectionQR.clear())
  }

  // Whether the number of selected items matches the total number of rows.
  isAllSelected(selection: SelectionModel<any>): boolean {
    const numSelected = selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  downloadPDF(): void {
    const ids: number[] = this.barTables.map((table: Table) => table.id)

    const pdfObserver: PartialObserver<Blob> = {
      next:(response: Blob) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const PDFUrl = window.URL.createObjectURL(blob);
        const PDFLink = document.createElement('a');

        PDFLink.href = PDFUrl;
        window.open(PDFUrl, '_blank');
        PDFLink.download = `${this.bar.name.replace(/ /g, "_")}_${format(new Date(), 'dd_MMMM_yyyy', { locale: esLocale })}.pdf`;
        PDFLink.click();
      },
      error:((error: HttpErrorResponse) => { console.error(error); this.toastService.openErrorToast(error.error?.message) })
    }
    this.imagesService.generatePDFWithQRCodes(ids).subscribe(pdfObserver);
  }

  async updateQuantity(quantity?: number): Promise<void> {
    if(quantity && ((quantity > 0 && this.quantity.value < 20) || (quantity <= 0 && this.quantity.value > 1)))
      this.quantity.setValue(this.quantity.value + quantity);
    else if ((quantity && this.quantity.value >= 20) || this.quantity.value > 20) {
      this.toastService.openToast('Se ha alcanzado el máximo de mesas a crear');
      this.quantity.setValue(20);
    }

    const quantityToUpdate = (this.quantity.value - this.barTables.length);
    const quantityUpdated = this.barTables.length + quantityToUpdate;

    if(quantityToUpdate !== 0 && quantityUpdated > 0 && quantityUpdated <= 20)
      quantityToUpdate > 0 ? this.createTables(quantityToUpdate) : this.removeTables(quantityToUpdate * -1);
  }

  private createTables(quantity: number): Promise<any> {
    return this.tableService.createByQuantity(quantity, this.bar.id!)
    .then((response: ResponseData<Table>) => {
      if(response.data && response.data.length > 0) {
        this.barTables = [...this.barTables, ...response.data];
        this.addTablesForm(response.data);
        this.updateMatTable();
        const message = quantity === 1 ? 'Se ha creado 1 mesa' : `Se han creado ${quantity} mesas`;
        this.toastService.openSuccessToast(message);
      }
    })
    .catch((error: HttpErrorResponse) => this.toastService.openErrorToast(error.error?.message));
  }

  private removeTables(quantity: number): Promise<any> {
    return this.tableService.removeByQuantity(quantity, this.bar.id!)
    .then(() => {
      this.barTables.length = this.barTables.length - quantity;
      this.removeTablesForm();
      this.updateMatTable();
      const message = quantity === 1 ? 'Se ha eliminado 1 mesa' : `Se han eliminado ${quantity} mesas`;
      this.toastService.openSuccessToast(message);
    })
    .catch((error: HttpErrorResponse) => this.toastService.openErrorToast(error.error?.message));
  }

  toggleActive(id: number): void {
    this.tableService.updateActive(id)
      .then((table: Table) => {
        this.barTables.forEach((t: Table) => t.id === table.id ? t.active = table.active : {});
        this.updateMatTable();

        const message = table.active ? `Mesa ${table.number} activada exitosamente!` : `Mesa ${table.number} desactivada exitosamente!`;
        this.toastService.openSuccessToast(message);
      })
      .catch(() => this.toastService.openErrorToast('Ocurrió un error al actualizar la mesa'))
  }

  updateActiveByList(tables: Table[]) {
    const ids: number[] = tables.map((table: Table) => table.id);

    this.tableService.updateActiveByList(ids)
    .then((response: ResponseData<Table>) => {
      this.barTables.forEach((table: Table) => 
        response.data.some((t: Table) => t.id === table.id) ? table.active = !table.active : {}
      );
      this.updateMatTable();

      const status = response.data[0].active === true ? 'activado' : 'desactivado';
      this.toastService.openSuccessToast(`Se han ${status} ${response.data.length} mesas`);
    })
    .catch((error: HttpErrorResponse) => this.toastService.openErrorToast(error.error?.message))
  }

  public openQRDialog(qrCode: string, tableNumber: string) {
    const dialogRef = this.matDialog.open(QrcodeDialogComponent, {
      width: '80%',
      maxWidth: '350px',
      panelClass: 'custom-dialog-container',
      data: {
        qrCode: qrCode,
        title: `Mesa ${tableNumber}`,
        closeMessage: "Cerrar",
        canCancel: true,
      },
      disableClose: true
    });
  }

  get quantity() { return this.formGroup.get('quantity') as FormControl }
  get tables() { return this.formGroup.get('tables') as FormArray }
  get active() { return this.formGroup.get('tables')?.get('active') as FormControl }
}
