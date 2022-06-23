import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// MATERIAL
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

// PIPES
import { FieldRequiredPipe } from './pipes/field-required.pipe';
import { ErrorMessagePipe } from './pipes/error-message.pipe';

// COMPONENTS
import { RouterComponent } from './components/router/router.component';
import { LogoComponent } from './components/logo/logo.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { TitleComponent } from './components/title/title.component';
import { SlideToggleComponent } from './components/slide-toggle/slide-toggle.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { QRCodeModule } from 'angularx-qrcode';
import { QrcodeDialogComponent } from './components/qrcode-dialog/qrcode-dialog.component';


@NgModule({
  declarations: [
    RouterComponent,
    LogoComponent,
    LoadingSpinnerComponent,
    TitleComponent,
    FieldRequiredPipe,
    ErrorMessagePipe,
    SlideToggleComponent,
    NavbarComponent,
    PageNotFoundComponent,
    DialogComponent,
    QrcodeDialogComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatButtonModule,
    QRCodeModule,
  ],
  exports: [
    RouterComponent,
    LogoComponent,
    TitleComponent,
    FieldRequiredPipe,
    ErrorMessagePipe,
    SlideToggleComponent,
    NavbarComponent,
    PageNotFoundComponent,
    DialogComponent,
    QrcodeDialogComponent,
  ],
})
export class SharedModule { }
