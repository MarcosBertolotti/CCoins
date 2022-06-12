import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppPaths } from 'src/app/enums/app-paths.enum';
import { RouterComponent } from 'src/app/shared/components/router/router.component';
import { BarUpdateComponent } from './components/bar-update/bar-update.component';
import { BarComponent } from './components/bar/bar.component';

const routes: Routes = [
  {
    path: '',
    component: RouterComponent,
    children: [
      { path: '', component: BarComponent },
      { path: AppPaths.UPDATE, component: BarUpdateComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BarRoutingModule { }
