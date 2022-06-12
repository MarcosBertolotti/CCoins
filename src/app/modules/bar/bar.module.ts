import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { BarRoutingModule } from './bar-routing.module';
import { BarComponent } from './components/bar/bar.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { BarUpdateComponent } from './components/bar-update/bar-update.component';
import { BarListComponent } from './components/bar-list/bar-list.component';


@NgModule({
  declarations: [
    BarComponent,
    BarUpdateComponent,
    BarListComponent,
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
  ]
})
export class BarModule { }
