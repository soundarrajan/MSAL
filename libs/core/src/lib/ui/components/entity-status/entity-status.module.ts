import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PrimeNGModule } from '@shiptech/core';
import { EntityStatusComponent } from '@shiptech/core/ui/components/entity-status/entity-status.component';

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

