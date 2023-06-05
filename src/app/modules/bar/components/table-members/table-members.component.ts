import { BreakpointObserver } from '@angular/cdk/layout';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, PartialObserver } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Client } from 'src/app/models/client.model';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { ToastService } from 'src/app/shared/services/toast.services';
import { PartyService } from '../../services/party.service';

@Component({
  selector: 'app-table-members',
  templateUrl: './table-members.component.html',
  styleUrls: ['./table-members.component.scss']
})
export class TableMembersComponent implements OnInit {

  @Input()
  dataSource!: MatTableDataSource<Client>;

  @Input()
  idParty!: number;
  
  initColumns: any[] = [
    { name: 'nickName', display: 'Nickname', show: true },
    { name: 'leader', display: 'Líder', show: false },
    { name: 'active', display: 'Activo', show: true },
    { name: 'startDate', display: 'Fecha inicio', show: true },
    { name: 'action', display: 'Eliminar', show: true },
  ];
  displayedColumns: any[] = this.initColumns.map(col => col.name);
  
  isSmallScreen$: Observable<boolean> = this.breakpointObserver.observe('(max-width: 960px)')
  .pipe(
    map(result => result.matches),
    shareReplay()
  );
  
  formGroup!: FormGroup;

  @Output()
  deleteMembersEvent = new EventEmitter<void>();
  
  constructor(
    private matDialog: MatDialog,
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    private partyService: PartyService,
    private breakpointObserver: BreakpointObserver,
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.formGroup = this.formBuilder.group({
      members: this.formBuilder.array([])
    });

    this.addCheckboxes();
  }

  private addCheckboxes() {
    this.dataSource.data.forEach(() => {
      (this.formGroup.get('members') as FormArray).push(new FormControl(false));
    });
  }

  openRemoveClientsDialog(): void {
    const members = this.formGroup.value.members as boolean[];

    const selectedClients = members.map((checked: boolean, index: number) => checked ? this.dataSource.data[index] : null)
      .filter((client: Client | null) => client !== null) as Client[] || [];

    if(selectedClients.length == 0) {
      this.toastService.openToast("Primero debe seleccionar al menos un miembro de la party");
      return;
    }

    let clientNames: string[] | string = selectedClients.map((client: Client) => client.nickName);
    clientNames = clientNames.length > 1 ? `- ${clientNames.slice(0, -1).join('\n- ')}\n - ${clientNames.slice(-1)}` : `- ${clientNames[0]}`;

    this.matDialog.open(DialogComponent, {
      width: '90%',
      maxWidth: '350px',
      maxHeight: '90vh',
      panelClass: ['custom-dialog-container', 'remove-members'],
      data: {
        showCloseIcon: true,
        messages: [
          selectedClients.length > 1 ? 'Se eliminarán los siguientes miembros de la party:' : 'Se eliminará a el siguiente miembro de la party:',
          `${clientNames}`,
          `Si selecciona 'Bannear' ${selectedClients.length > 1 ? 'los miembros no podran' : 'el miembro no podra'} volver a ingresar a la mesa.` 
        ],
        title: 'Atención!',
        canCancel: false,
        actions: [
          {
            message: "Eliminar",
            action: () => this.deleteMembers(selectedClients),
          },
          {
            message: "Bannear",
            action: () => this.deleteMembers(selectedClients, true),
          }
        ],
      },
    });
  }

  deleteMembers(members: Client[], banned = false): void {
    const ids = members.map((member: Client) => member.id);

    this.partyService.kickMembers(this.idParty, ids, banned)
    .then((response: any) => {
      const message = members.length > 1 ? 'se han eliminado los miembros seleccionados exitosamente!' : 'se ha eliminado a el miembro seleccionado exitosamente!'
      this.toastService.openSuccessToast(message);
      this.deleteMembersEvent.next();
    })
    .catch((error: HttpErrorResponse) => this.toastService.openErrorToast(error.error?.message))
    .finally(() => this.formGroup.reset())
  }
}
