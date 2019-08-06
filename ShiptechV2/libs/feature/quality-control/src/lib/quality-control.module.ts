import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MainQualityControlComponent } from './views/main-quality-control/main-quality-control.component';
import { QualityControlGridModule } from './quality-control-grid.module';
import { LoggingModule } from '../../../../core/src/lib/logging/logging.module';
import { ModuleLoggerFactory } from './core/logging/module-logger-factory';
import { PROCUREMENT_API_SERVICE, ProcurementApiService } from './services/api/procurement.api.service';
import { ProcurementService } from './services/procurement.service';
import { AuthenticationModule, PrimeNGModule } from '@shiptech/core';
import { SearchBoxModule } from '@shiptech/core/ui/components/search-box/search-box.module';
import { FilterPresetsModule } from '@shiptech/core/ui/components/filter-preferences/filter-presets.module';
import { WunderBarComponent } from '@shiptech/core/ui/components/wonder-bar/wunder-bar.component';
import { UIModule } from '@shiptech/core/ui/ui.module';
import { MessageBoxModule } from '@shiptech/core/ui/components/message-box/message-box.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: MainQualityControlComponent }]),
    QualityControlGridModule,
    LoggingModule,
    AuthenticationModule.forFeature(),
    SearchBoxModule,
    UIModule,
    FilterPresetsModule,
    PrimeNGModule,
    MessageBoxModule
  ],
  declarations: [
    MainQualityControlComponent,
    WunderBarComponent
  ],
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
