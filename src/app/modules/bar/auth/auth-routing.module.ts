import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppPaths } from 'src/app/enums/app-paths.enum';
import { RouterComponent } from 'src/app/shared/components/router/router.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  {
    path: '',
    component: RouterComponent,
    children: [
      { 
        path: '', 
        pathMatch: 'full',
        redirectTo: AppPaths.LOGIN 
      },
      {
        path: AppPaths.LOGIN,
        component: LoginComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
