import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BarRoutingModule } from './bar-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { BarComponent } from './components/bar/bar.component';


@NgModule({
  declarations: [
    BarComponent,
  ],
  imports: [
    CommonModule,
    BarRoutingModule,
    SharedModule,
  ]
})
export class BarModule { }
