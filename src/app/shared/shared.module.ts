import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { QRCodeModule } from 'angularx-qrcode';

// MATERIAL
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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
import { QrcodeDialogComponent } from './components/qrcode-dialog/qrcode-dialog.component';
import { SelectComponent } from './components/select/select.component';
import { ParseToDatePipe } from './pipes/parse-to-date.pipe';
import { ParseArrayToDatePipe } from './pipes/parse-array-to-date';
import { SpotifyPlayerComponent } from './components/spotify-player/spotify-player.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TimePickerComponent } from './components/time-picker/time-picker.component';
import { NotificationComponent } from './components/notification/notification.component';


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
    SelectComponent,
    ParseToDatePipe,
    ParseArrayToDatePipe,
    SpotifyPlayerComponent,
    TimePickerComponent,
    NotificationComponent,
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
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
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
    SelectComponent,
    ParseToDatePipe,
    ParseArrayToDatePipe,
    SpotifyPlayerComponent,
    TimePickerComponent,
    NotificationComponent,
  ],
})
export class SharedModule { }
