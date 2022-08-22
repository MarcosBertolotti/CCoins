import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginWarningComponent } from './components/login-warning/login-warning.component';
import { LoginComponent } from './components/login/login.component';
import { RouterComponent } from './components/router/router.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
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
