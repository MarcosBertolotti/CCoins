import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProviderRoutingModule } from './provider-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { ProviderComponent } from './components/provider/provider.component';


@NgModule({
  declarations: [
    ProviderComponent,
  ],
  imports: [
    CommonModule,
    ProviderRoutingModule,
    SharedModule,
  ]
})
export class ProviderModule { }
