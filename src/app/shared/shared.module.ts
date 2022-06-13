import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { FieldRequiredPipe } from './pipes/field-required.pipe';

// COMPONENTS
import { RouterComponent } from './components/router/router.component';
import { LogoComponent } from './components/logo/logo.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { TitleComponent } from './components/title/title.component';
import { ErrorMessagePipe } from './pipes/error-message.pipe';
import { SlideToggleComponent } from './components/slide-toggle/slide-toggle.component';


@NgModule({
  declarations: [
    RouterComponent,
    LogoComponent,
    LoadingSpinnerComponent,
    TitleComponent,
    FieldRequiredPipe,
    ErrorMessagePipe,
    SlideToggleComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
  ],
  exports: [
    RouterComponent,
    LogoComponent,
    TitleComponent,
    FieldRequiredPipe,
    ErrorMessagePipe,
    SlideToggleComponent,
  ],
})
export class SharedModule { }
