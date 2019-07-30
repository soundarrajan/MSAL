import { NgModule } from '@angular/core';
import { BreadcrumbComponent } from './breadcrumbs.component';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { BreadcrumbsService } from './breadcrumbs.service';
import { PrimeNGModule } from '@shiptech/core';

@NgModule({

  declarations: [
    BreadcrumbComponent
  ],
  providers: [
    BreadcrumbsService
  ],
  imports: [
    RouterModule,
    BrowserModule,
    CommonModule,
    PrimeNGModule
  ],
  exports: [BreadcrumbComponent]
})
export class BreadcrumbsModule {
  constructor() {
  }

}

