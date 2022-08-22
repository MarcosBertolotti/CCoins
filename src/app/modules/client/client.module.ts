import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

import { ShowOnDirtyTouchedOrSubmittedErrorStateMatcher } from 'src/app/shared/config/error-state-matcher.config';

import { ClientRoutingModule } from './client-routing.module';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

import { LoginComponent } from './components/login/login.component';
import { LoginWarningComponent } from './components/login-warning/login-warning.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { RouterComponent } from './components/router/router.component';
import { HomeComponent } from './components/home/home.component';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    LoginWarningComponent,
    WelcomeComponent,
    RouterComponent,
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
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
