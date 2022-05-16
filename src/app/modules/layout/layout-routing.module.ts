import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppPaths } from 'src/app/enums/app-paths.enum';
import { SidenavListComponent } from './components/sidenav-list/sidenav-list.component';

const routes: Routes = [
  {
    path: '',
    component: SidenavListComponent,
    children: [
      { 
        path: '', 
        pathMatch: 'full',
        redirectTo: AppPaths.BAR
      },
      {
        path: AppPaths.BAR,
        loadChildren: () => import("src/app/modules/bar/bar.module").then(m => m.BarModule),
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
