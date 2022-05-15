import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// COMPONENTS
import { RouterComponent } from './components/router/router.component';


@NgModule({
  declarations: [
    RouterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    RouterComponent,
  ]
})
export class SharedModule { }
