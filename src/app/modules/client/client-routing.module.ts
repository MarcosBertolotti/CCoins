import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BarGamesComponent } from './components/bar-games/bar-games.component';
import { BarPrizesComponent } from './components/bar-prizes/bar-prizes.component';
import { BarTableInfoComponent } from './components/bar-table-info/bar-table-info.component';
import { HomeComponent } from './components/home/home.component';
import { LoginWarningComponent } from './components/login-warning/login-warning.component';
import { LoginComponent } from './components/login/login.component';
import { PartyCoinsComponent } from './components/party-coins/party-coins.component';
import { RouterComponent } from './components/router/router.component';
import { ClientPaths } from './enums/client-paths.eum';
import { AuthClientGuard } from './guards/auth-client.guard';

const routes: Routes = [
  {
    path: '',
    component: RouterComponent, // cambiar a layout
    canActivate: [AuthClientGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: ClientPaths.HOME
      },
      { path: ClientPaths.HOME, component: HomeComponent },
      { path: ClientPaths.BAR_TABLE, component: BarTableInfoComponent },
      { path: ClientPaths.BAR_PRIZES, component: BarPrizesComponent },
      { path: ClientPaths.BAR_GAMES, component: BarGamesComponent },
      { path: ClientPaths.PARTY_COINS, component: PartyCoinsComponent },
    ]
  },
  { path: `${ClientPaths.LOGIN}/:code`, component: LoginComponent },
  { path: ClientPaths.WARNING_LOGIN, component: LoginWarningComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
