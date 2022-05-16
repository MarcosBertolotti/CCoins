import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouterComponent } from 'src/app/shared/components/router/router.component';
import { BarComponent } from './components/bar/bar.component';

const routes: Routes = [
  {
    path: '',
    component: RouterComponent,
    children: [
      { path: '', component: BarComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BarRoutingModule { }
