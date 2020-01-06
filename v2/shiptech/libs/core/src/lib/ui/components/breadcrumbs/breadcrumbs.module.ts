import { NgModule } from '@angular/core';
import { BreadcrumbComponent } from './breadcrumbs.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BreadcrumbsService } from './breadcrumbs.service';
import { PrimeNGModule } from '../../primeng.module';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({

  declarations: [
    BreadcrumbComponent
  ],
  providers: [
    BreadcrumbsService
  ],
  imports: [
    RouterModule,
    CommonModule,
    PrimeNGModule,
    FlexLayoutModule
  ],
  exports: [BreadcrumbComponent]
})
export class BreadcrumbsModule {
  constructor() {
  }

}

