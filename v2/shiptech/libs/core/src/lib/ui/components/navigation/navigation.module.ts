import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AppSubMenuComponent } from './sidebar/menu-items/menu-items.component';
import { TopbarComponent } from './topbar/topbar.component';
import { BlankComponent } from '../blank/blank.component';
import { AccessDeniedComponent } from '../access-denied/access-denied.component';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TopbarAdalComponent } from './topbar-adal/topbar-adal.component';
import { SharedModule } from '@shiptech/core/shared/shared.module';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [
    SidebarComponent,
    AppSubMenuComponent,
    TopbarComponent,
    TopbarAdalComponent,
    BlankComponent,
    AccessDeniedComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    ScrollPanelModule,
    SharedModule,
    MatMenuModule
  ],
  exports: [
    SidebarComponent,
    AppSubMenuComponent,
    TopbarComponent,
    TopbarAdalComponent,
    BlankComponent,
    AccessDeniedComponent
  ]
})
export class NavigationModule {}
