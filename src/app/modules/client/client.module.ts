import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorStateMatcher, MatRippleModule } from '@angular/material/core';

import { ShowOnDirtyTouchedOrSubmittedErrorStateMatcher } from 'src/app/shared/config/error-state-matcher.config';

import { ClientRoutingModule } from './client-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialogModule } from '@angular/material/dialog';

import { LoginComponent } from './components/login/login.component';
import { LoginWarningComponent } from './components/login-warning/login-warning.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { RouterComponent } from './components/router/router.component';
import { HomeComponent } from './components/home/home.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { BarTableInfoComponent } from './components/bar-table-info/bar-table-info.component';
import { BarPrizesComponent } from './components/bar-prizes/bar-prizes.component';
import { VotingComponent } from './components/voting/voting.component';
import { PlayerComponent } from './components/player/player.component';
import { PartyCoinsComponent } from './components/party-coins/party-coins.component';
import { BarGamesComponent } from './components/bar-games/bar-games.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CodeRedeemComponent } from './components/code-redeem/code-redeem.component';

@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    LoginWarningComponent,
    WelcomeComponent,
    RouterComponent,
    ToolbarComponent,
    BarTableInfoComponent,
    BarPrizesComponent,
    VotingComponent,
    PlayerComponent,
    PartyCoinsComponent,
    BarGamesComponent,
    CodeRedeemComponent,
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
    MatRadioModule,
    MatDividerModule,
    MatListModule,
    MatPaginatorModule,
    MatBadgeModule,
    MatDialogModule,
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
