import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EntityStatusComponent } from '@shiptech/core/ui/components/entity-status/entity-status.component';

@NgModule({
  declarations: [
    EntityStatusComponent
  ],
  providers: [],
  imports: [
    RouterModule,
    CommonModule
  ],
  exports: [EntityStatusComponent]
})
export class EntityStatusModule {
  constructor() {
  }
}

