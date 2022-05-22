import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// COMPONENTS
import { RouterComponent } from './components/router/router.component';
import { LogoComponent } from './components/logo/logo.component';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    RouterComponent,
    LogoComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
  ],
  exports: [
    RouterComponent,
    LogoComponent,
  ]
})
export class SharedModule { }
