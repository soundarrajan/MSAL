import { NgModule } from '@angular/core';
import { LayoutMainComponent } from './layout-main.component';
import { NavigationModule } from '../../components/navigation/navigation.module';
import { BreadcrumbsModule } from '../../components/breadcrumbs/breadcrumbs.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
  imports: [
    CommonModule,
    NavigationModule,
    BreadcrumbsModule,
    RouterModule,
    ConfirmDialogModule
  ],
  declarations: [
    LayoutMainComponent
  ],
  exports: [
    LayoutMainComponent
  ]
})
export class LayoutMainModule {
}
