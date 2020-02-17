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
import {PrimeNGModule} from "@shiptech/core/ui/primeng.module";

@NgModule({
  declarations: [
    SidebarComponent,
    AppSubMenuComponent,
    TopbarComponent,
    BlankComponent,
    AccessDeniedComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    PrimeNGModule,
    ButtonModule,
    ScrollPanelModule
  ],
  exports: [
    SidebarComponent,
    AppSubMenuComponent,
    TopbarComponent,
    BlankComponent,
    AccessDeniedComponent
  ]
})
export class NavigationModule {
}
