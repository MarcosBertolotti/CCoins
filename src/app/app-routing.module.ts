import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppPaths } from './enums/app-paths.enum';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: AppPaths.provider
  },
  {
    path: AppPaths.provider,
    loadChildren: () => import("src/app/modules/provider/provider.module").then(m => m.ProviderModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
