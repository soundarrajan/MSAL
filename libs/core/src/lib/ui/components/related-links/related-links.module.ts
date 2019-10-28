import { NgModule } from '@angular/core';
import { RelatedLinksComponent } from './related-links.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PrimeNGModule } from '@shiptech/core/ui/primeng.module';

@NgModule({

  declarations: [
    RelatedLinksComponent
  ],
  providers: [],
  imports: [
    RouterModule,
    CommonModule,
    PrimeNGModule
  ],
  exports: [RelatedLinksComponent]
})
export class RelatedLinksModule {
  constructor() {
  }
}

