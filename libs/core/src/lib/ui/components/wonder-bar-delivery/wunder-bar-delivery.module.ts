import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WunderBarDeliveryComponent } from '@shiptech/core/ui/components/wonder-bar-delivery/wunder-bar-delivery.component';

@NgModule({
  imports: [CommonModule],
  declarations: [WunderBarDeliveryComponent],
  exports: [WunderBarDeliveryComponent]
})
export class WunderBarDeliveryModule {}
