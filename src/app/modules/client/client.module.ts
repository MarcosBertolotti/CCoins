import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

import { ShowOnDirtyTouchedOrSubmittedErrorStateMatcher } from 'src/app/shared/config/error-state-matcher.config';

import { ClientRoutingModule } from './client-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';

import { LoginComponent } from './components/login/login.component';
import { LoginWarningComponent } from './components/login-warning/login-warning.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { RouterComponent } from './components/router/router.component';
import { HomeComponent } from './components/home/home.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';

@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    LoginWarningComponent,
    WelcomeComponent,
    RouterComponent,
    ToolbarComponent,
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    SharedModule,
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { floatLabel: 'always' } },
    {
      provide: ErrorStateMatcher,
      useClass: ShowOnDirtyTouchedOrSubmittedErrorStateMatcher
    }
  ]
})
export class ClientModule { }
