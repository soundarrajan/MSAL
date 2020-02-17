import { NgModule } from '@angular/core';
import { RelatedLinksComponent } from './related-links.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [RelatedLinksComponent],
  providers: [],
  imports: [RouterModule, CommonModule],
  exports: [RelatedLinksComponent]
})
export class RelatedLinksModule {
  constructor() {}
}
