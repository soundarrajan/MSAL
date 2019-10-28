import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoggingModule } from '../../../../core/src/lib/logging/logging.module';
import { ModuleLoggerFactory } from './core/logging/module-logger-factory';
import { QUANTITY_CONTROL_API_SERVICE, QuantityControlApi } from './services/api/quantity-control-api';
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
import { PortCallDetailsState } from './store/port-call-details/port-call-details.state';
import { QuantityControlRoutingModule } from './quantity-control-routing.module';
import { PortCallsListComponent } from './views/port-calls-list/port-calls-list.component';
import { PortCallDetailsComponent } from './views/port-call-details/port-call-details.component';
import { QuantityControlApiMock } from './services/api/quantity-control-api.mock';
import { environment } from '@shiptech/environment';
import { RelatedLinksModule } from '@shiptech/core/ui/components/related-links/related-links.module';
import { PortCallDetailsService } from './services/port-call-details.service';
import { EntityStatusModule } from '@shiptech/core/ui/components/entity-status/entity-status.module';
import { QuantityControlRouteResolver } from './quantiy-control-route.resolver';
import { SoundingReportsComponent } from './views/port-call-details/components/sounding-reports/sounding-reports.component';
import { EventsLogComponent } from './views/port-call-details/components/events-log/events-log.component';
import { SurveyReportHistoryComponent } from './views/port-call-details/components/survey-report-history/survey-report-history.component';
import { ProductDetailsComponent } from './views/port-call-details/components/port-call-grid/product-details.component';
import { PortCallDetailsRouteResolver } from './views/port-call-details/port-call-details-route.resolver';
import { AuthenticationModule } from '@shiptech/core/authentication/authentication.module';
import { PrimeNGModule } from '@shiptech/core/ui/primeng.module';

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
    EntityStatusModule,
    NgxsModule.forFeature([QuantityControlState, PortCallsListState, PortCallDetailsState])
  ],
  declarations: [
    MainQuantityControlComponent,
    WunderBarComponent,
    PortCallsListComponent,
    PortCallDetailsComponent,
    SoundingReportsComponent,
    EventsLogComponent,
    SurveyReportHistoryComponent,
    ProductDetailsComponent
  ],
  exports: [
    MainQuantityControlComponent
  ],
  providers: [
    ModuleLoggerFactory,
    QuantityControlRouteResolver,
    PortCallDetailsRouteResolver,
    {
      provide: QUANTITY_CONTROL_API_SERVICE,
      useClass: environment.production ? QuantityControlApi : QuantityControlApiMock
    },

    // TODO: Recheck, if we don't provide it here it crashes inside of PortCallsGridViewModel
    PortCallDetailsService
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
