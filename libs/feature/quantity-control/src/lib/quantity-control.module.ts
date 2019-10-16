import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
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
import { MainQuantityControlComponent } from './views/main-quantity-control.component';
import { QuantityControlGridModule } from './quantity-control-grid.module';
import { NgxsModule } from '@ngxs/store';
import { QuantityControlState } from './store/quantity-control.state';
import { PortCallsListState } from './store/port-call-list/port-calls-list.state';
import { PortCallState } from './store/port-call/port-call.state';
import { QuantityControlRoutingModule } from './quantity-control-routing.module';
import { PortCallsListComponent } from './views/port-calls-list/port-calls-list.component';
import { PortCallComponent } from './views/port-call/port-call.component';

@NgModule({
  imports: [
    CommonModule,
    QuantityControlGridModule,
    QuantityControlRoutingModule,
    LoggingModule,
    AuthenticationModule.forFeature(),
    SearchBoxModule,
    UIModule,
    FilterPresetsModule,
    PrimeNGModule,
    MessageBoxModule,
    NgxsModule.forFeature([QuantityControlState, PortCallsListState, PortCallState]),
  ],
  declarations: [
    MainQuantityControlComponent,
    WunderBarComponent,
    PortCallsListComponent,
    PortCallComponent
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
export class QuantityControlModule {
}
