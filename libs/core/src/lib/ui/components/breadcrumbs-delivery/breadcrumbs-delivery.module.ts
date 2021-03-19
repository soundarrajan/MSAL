import { NgModule } from '@angular/core';
import { BreadcrumbDeliveryComponent } from './breadcrumbs-delivery.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@NgModule({
  declarations: [BreadcrumbDeliveryComponent],
  imports: [RouterModule, CommonModule, BreadcrumbModule, FlexLayoutModule],
  exports: [BreadcrumbDeliveryComponent]
})
export class BreadcrumbsDeliveryModule {
  constructor() {}
}
