import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EntityStatusComponent } from '@shiptech/core/ui/components/entity-status/entity-status.component';
import { PrimeNGModule } from '@shiptech/core/ui/primeng.module';

@NgModule({
  declarations: [
    EntityStatusComponent
  ],
  providers: [],
  imports: [
    RouterModule,
    CommonModule,
    PrimeNGModule
  ],
  exports: [EntityStatusComponent]
})
export class EntityStatusModule {
  constructor() {
  }
}

