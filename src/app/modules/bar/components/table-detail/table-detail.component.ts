import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { PartialObserver } from 'rxjs';
import { Bar } from 'src/app/models/bar-model';
import { Table } from 'src/app/models/table.model';
import { BarService } from 'src/app/services/bar.service';
import { TableService } from 'src/app/services/table.service';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { ParseArrayToDatePipe } from 'src/app/shared/pipes/parse-array-to-date';
import { ToastService } from 'src/app/shared/services/toast.services';

@Component({
  selector: 'app-table-detail',
  templateUrl: './table-detail.component.html',
  styleUrls: ['./table-detail.component.scss']
})
export class TableDetailComponent implements OnInit {

  bar!: Bar;
  table!: Table;

  constructor(
    private barService: BarService,
    private tableService: TableService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router,
    private matDialog: MatDialog,
    private parseArrayToDatePipe: ParseArrayToDatePipe,
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
        this.toastService.openErrorToast(error.error.message);
        this.goToHome();
      },
    };
    this.barService.getCurrentBar(idBar).subscribe(barObserver);  
  }

  private getTable(idTable: number): void {
    this.tableService.findById(idTable)
      .then((table: Table) => { 
        this.table = table;
        const date = table.startDate;
        if(table.startDate.length > 0) {
          this.table.startDate = this.parseArrayToDatePipe.transform(date);
          this.table.startDate.setHours(date[3], date[4], date[5]);
        }
      })
      .catch((error: HttpErrorResponse) => this.toastService.openErrorToast(error.error.message));
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
    .catch((error: HttpErrorResponse) => this.toastService.openErrorToast(error.error.message))
  }
}
