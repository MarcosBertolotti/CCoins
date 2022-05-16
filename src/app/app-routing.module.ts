import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppPaths } from './enums/app-paths.enum';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: AppPaths.SIDENAV
  },
  {
    path: AppPaths.SIDENAV,
    loadChildren: () => import("src/app/modules/layout/layout.module").then(m => m.LayoutModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
