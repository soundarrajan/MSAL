import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoggingModule } from '../../../../core/src/lib/logging/logging.module';
import { ModuleLoggerFactory } from './core/logging/module-logger-factory';
import { QUANTITY_CONTROL_API_SERVICE, QuantityControlApiService } from './services/api/quantity-control.api.service';
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
import { QuantityControlMockApiService } from './services/api/quantity-control.api.service.mock';
import { environment } from '@shiptech/environment';
import { RelatedLinksModule } from '@shiptech/core/ui/components/related-links/related-links.module';
import { QuantityControlService } from './services/quantity-control.service';

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
    RelatedLinksModule,
    NgxsModule.forFeature([QuantityControlState, PortCallsListState, PortCallState])
  ],
  declarations: [
    MainQuantityControlComponent,
    WunderBarComponent,
    PortCallsListComponent,
    PortCallComponent
  ],
  exports: [
    MainQuantityControlComponent
  ],
  providers: [
    ModuleLoggerFactory,
    {
      provide: QUANTITY_CONTROL_API_SERVICE,
      useClass: environment.production ? QuantityControlApiService : QuantityControlMockApiService
    },

    // TODO: Recheck, if we don't provide it here it crashes inside of PortCallsGridViewModel
    QuantityControlService
  ]
})
export class QuantityControlModule {

  // TODO: Workaround to jump start creation of the Mock Service in order for it to register it with the developer toolbar.
  // TODO: This doesn t work, for some reason QuantityControlApiService is created, and the appConfig is not yet loaded
  // constructor(bootStrap : BootstrapService, devService: DeveloperToolbarService, injector: Injector) {
  //   bootStrap.initialized.pipe(tap(() => {
  //     injector.get(QuantityControlMockApiService);
  //   })).subscribe()
  // }
}
