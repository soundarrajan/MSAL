import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WunderBarComponent } from '@shiptech/core/ui/components/wonder-bar/wunder-bar.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    WunderBarComponent
  ],
  exports: [
    WunderBarComponent
  ]
})
export class WunderBarModule {
}
