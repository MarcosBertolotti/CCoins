import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BarRoutingModule } from './bar-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { QRCodeModule } from 'angularx-qrcode';

import { ParseToDatePipe } from 'src/app/shared/pipes/parse-to-date.pipe';
import { ParseArrayToDatePipe } from 'src/app/shared/pipes/parse-array-to-date';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';

import { BarCreateComponent } from './components/bar-create/bar-create.component';
import { BarUpdateComponent } from './components/bar-update/bar-update.component';
import { BarListComponent } from './components/bar-list/bar-list.component';
import { TableListComponent } from './components/table-list/table-list.component';
import { TableDetailComponent } from './components/table-detail/table-detail.component';
import { ActivityListComponent } from './components/activity-list/activity-list.component';
import { ActivityDetailComponent } from './components/activity-detail/activity-detail.component';
import { ActivityCreateComponent } from './components/activity-create/activity-create.component';
import { PrizeListComponent } from './components/prize-list/prize-list.component';
import { PrizeCreateComponent } from './components/prize-create/prize-create.component';
import { PrizeDetailComponent } from './components/prize-detail/prize-detail.component';
import { SpotifyConfigComponent } from './components/spotify-config/spotify-config.component';
import { DemandComponent } from './components/demand/demand.component';
import { DemandTableComponent } from './components/demand-table/demand-table.component';
import { CodesComponent } from './components/codes/codes.component';
import { CodeCreateComponent } from './components/code-create/code-create.component';
import { CodeRedeemComponent } from './components/code-redeem/code-redeem.component';
import { TableReportComponent } from './components/table-report/table-report.component';
import { TableMembersComponent } from './components/table-members/table-members.component';


@NgModule({
  declarations: [
    BarCreateComponent,
    BarUpdateComponent,
    BarListComponent,
    TableListComponent,
    TableDetailComponent,
    ActivityListComponent,
    ActivityDetailComponent,
    ActivityCreateComponent,
    PrizeListComponent,
    PrizeCreateComponent,
    PrizeDetailComponent,
    SpotifyConfigComponent,
    DemandComponent,
    DemandTableComponent,
    CodesComponent,
    CodeCreateComponent,
    CodeRedeemComponent,
    TableReportComponent,
    TableMembersComponent,
  ],
  imports: [
    CommonModule,
    BarRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    SharedModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatCheckboxModule,
    QRCodeModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatDialogModule,
    MatTabsModule,
  ],
  providers: [
    ParseToDatePipe,
    ParseArrayToDatePipe,
  ]
})
export class BarModule { }
