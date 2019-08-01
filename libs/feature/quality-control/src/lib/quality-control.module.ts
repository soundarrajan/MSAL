import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MainQualityControlComponent } from './views/main-quality-control/main-quality-control.component';
import { QualityControlGridModule } from './quality-control-grid.module';
import { LoggingModule } from '../../../../core/src/lib/logging/logging.module';
import { ModuleLoggerFactory } from './core/logging/module-logger-factory';
import { PROCUREMENT_API_SERVICE, ProcurementApiService } from './services/api/procurement.api.service';
import { ProcurementService } from './services/procurement.service';
import { AuthenticationModule } from '@shiptech/core';
import { AgPagingComponent } from '../../../../core/src/lib/ui/components/ag-paging/ag-paging.component';
import { SearchBoxModule } from '../../../../core/src/lib/ui/components/search-box/search-box.module';
import { UIModule } from '../../../../core/src/lib/ui/ui.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: MainQualityControlComponent }]),
    QualityControlGridModule,
    LoggingModule,
    AuthenticationModule.forFeature(),
    SearchBoxModule,
    UIModule
  ],
  declarations: [MainQualityControlComponent],
  providers: [
    ModuleLoggerFactory,
    {
      provide: PROCUREMENT_API_SERVICE,
      useClass: ProcurementApiService
      // useClass: environment.production ? ProcurementApiService : QuantityControlMockApiService
    },
    ProcurementService
  ]
})
export class QualityControlModule {
}
