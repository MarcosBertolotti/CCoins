import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppPaths } from 'src/app/enums/app-paths.enum';
import { RouterComponent } from 'src/app/shared/components/router/router.component';
import { BarListComponent } from './components/bar-list/bar-list.component';
import { BarUpdateComponent } from './components/bar-update/bar-update.component';
import { BarCreateComponent } from './components/bar-create/bar-create.component';
import { TableListComponent } from './components/table-list/table-list.component';

const routes: Routes = [
  {
    path: '',
    component: RouterComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: AppPaths.LIST
      },
      { path: AppPaths.LIST, component: BarListComponent },
      { path: AppPaths.CREATE, component: BarCreateComponent },
      { path: `${AppPaths.UPDATE}/:id`, component: BarUpdateComponent },
      { path: `:id/${AppPaths.TABLES}`, component: TableListComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BarRoutingModule { }
