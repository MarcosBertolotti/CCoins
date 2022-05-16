import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// MODULES
import { LayoutRoutingModule } from './layout-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

// MATERIAL
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';

// COMPONENTS
import { LayoutComponent } from './components/layout/layout.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { SidenavListComponent } from './components/sidenav-list/sidenav-list.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';


@NgModule({
  declarations: [
    LayoutComponent,
    SidenavComponent,
    SidenavListComponent,
    ToolbarComponent
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    SharedModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatListModule,
    MatBadgeModule,
    MatDividerModule,
  ]
})
export class LayoutModule { }
