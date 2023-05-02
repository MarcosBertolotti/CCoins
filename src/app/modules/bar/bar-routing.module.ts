import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppPaths } from 'src/app/enums/app-paths.enum';
import { RouterComponent } from 'src/app/shared/components/router/router.component';
import { BarListComponent } from './components/bar-list/bar-list.component';
import { BarUpdateComponent } from './components/bar-update/bar-update.component';
import { BarCreateComponent } from './components/bar-create/bar-create.component';
import { TableListComponent } from './components/table-list/table-list.component';
import { TableDetailComponent } from './components/table-detail/table-detail.component';
import { ActivityListComponent } from './components/activity-list/activity-list.component';
import { ActivityCreateComponent } from './components/activity-create/activity-create.component';
import { ActivityDetailComponent } from './components/activity-detail/activity-detail.component';
import { PrizeListComponent } from './components/prize-list/prize-list.component';
import { PrizeCreateComponent } from './components/prize-create/prize-create.component';
import { PrizeDetailComponent } from './components/prize-detail/prize-detail.component';
import { SpotifyConfigComponent } from './components/spotify-config/spotify-config.component';
import { DemandComponent } from './components/demand/demand.component';

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
      { path: `:id/${AppPaths.TABLES}/:idTable`, component: TableDetailComponent },
      { path: `:id/${AppPaths.ACTIVITIES}`, component: ActivityListComponent },
      { path: `:id/${AppPaths.ACTIVITIES}/${AppPaths.CREATE}`, component: ActivityCreateComponent },
      { path: `:id/${AppPaths.ACTIVITIES}/:idGame`, component: ActivityDetailComponent },
      { path: `:id/${AppPaths.PRIZES}`, component: PrizeListComponent },
      { path: `:id/${AppPaths.PRIZES}/${AppPaths.CREATE}`, component: PrizeCreateComponent },
      { path: `:id/${AppPaths.PRIZES}/:idPrize`, component: PrizeDetailComponent },
      { path: `:id/${AppPaths.DEMAND}`, component: DemandComponent },
      { path: AppPaths.SPOTIFY, component: SpotifyConfigComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BarRoutingModule { }
