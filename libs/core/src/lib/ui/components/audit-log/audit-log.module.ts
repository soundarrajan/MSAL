import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PrimeNGModule } from '../../primeng.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AuditLogComponent } from '@shiptech/core/ui/components/audit-log/audit-log.component';

@NgModule({

  declarations: [
    AuditLogComponent
  ],
  providers: [],
  imports: [
    RouterModule,
    CommonModule,
    PrimeNGModule,
    FlexLayoutModule
  ],
  exports: [AuditLogComponent]
})
export class AuditLogModule {
  constructor() {
  }

}

