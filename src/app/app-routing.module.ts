import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppPaths } from './enums/app-paths.enum';
import { AuthGuard } from './guards/auth.guard';
import { IsAuthenticatedGuard } from './guards/is-authenticated.guard';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: AppPaths.CLIENT
  },
  {
    path: AppPaths.CLIENT,
    loadChildren: () => import("src/app/modules/client/client.module").then(m => m.ClientModule),
  },
  {
    path: AppPaths.ADMIN,
    loadChildren: () => import("src/app/modules/layout/layout.module").then(m => m.LayoutModule),
    canActivate: [AuthGuard]
  },
  {
    path: AppPaths.AUTH,
    loadChildren: () => import("src/app/modules/bar/auth/auth.module").then(m => m.AuthModule),
    canActivateChild: [IsAuthenticatedGuard]
  },
  { path: '**', pathMatch: 'full', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
