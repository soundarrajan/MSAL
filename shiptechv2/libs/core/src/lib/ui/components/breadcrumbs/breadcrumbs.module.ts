import { NgModule } from '@angular/core';
import { BreadcrumbComponent } from './breadcrumbs.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@NgModule({
  declarations: [BreadcrumbComponent],
  imports: [RouterModule, CommonModule, BreadcrumbModule, FlexLayoutModule],
  exports: [BreadcrumbComponent]
})
export class BreadcrumbsModule {
  constructor() {}
}
