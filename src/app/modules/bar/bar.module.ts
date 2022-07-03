import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BarRoutingModule } from './bar-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { QRCodeModule } from 'angularx-qrcode';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

import { BarCreateComponent } from './components/bar-create/bar-create.component';
import { BarUpdateComponent } from './components/bar-update/bar-update.component';
import { BarListComponent } from './components/bar-list/bar-list.component';
import { TableListComponent } from './components/table-list/table-list.component';
import { TableDetailComponent } from './components/table-detail/table-detail.component';


@NgModule({
  declarations: [
    BarCreateComponent,
    BarUpdateComponent,
    BarListComponent,
    TableListComponent,
    TableDetailComponent,
  ],
  imports: [
    CommonModule,
    BarRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    SharedModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatCheckboxModule,
    QRCodeModule,
  ]
})
export class BarModule { }
