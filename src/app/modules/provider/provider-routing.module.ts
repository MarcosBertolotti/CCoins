import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouterComponent } from 'src/app/shared/components/router/router.component';
import { ProviderComponent } from './components/provider/provider.component';

const routes: Routes = [
  {
    path: '',
    component: RouterComponent,
    children: [
      { path: '', component: ProviderComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProviderRoutingModule { }
