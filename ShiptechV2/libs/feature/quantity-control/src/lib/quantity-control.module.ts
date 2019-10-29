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
import { QcReportsListState } from './store/reports-list/qc-reports-list.state';
import { QcReportViewState } from './store/report-view/qc-report-view.state';
import { QuantityControlRoutingModule } from './quantity-control-routing.module';
import { QcReportsListComponent } from './views/qc-reports-list/qc-reports-list.component';
import { QcReportViewComponent } from './views/qc-report-view/qc-report-view.component';
import { QuantityControlApiMock } from './services/api/quantity-control-api.mock';
import { environment } from '@shiptech/environment';
import { RelatedLinksModule } from '@shiptech/core/ui/components/related-links/related-links.module';
import { ReportViewService } from './services/report-view.service';
import { EntityStatusModule } from '@shiptech/core/ui/components/entity-status/entity-status.module';
import { QuantityControlRouteResolver } from './quantiy-control-route.resolver';
import { SoundingReportsComponent } from './views/qc-report-view/components/sounding-reports/sounding-reports.component';
import { EventsLogComponent } from './views/qc-report-view/components/events-log/events-log.component';
import { SurveyReportHistoryComponent } from './views/qc-report-view/components/survey-report-history/survey-report-history.component';
import { ProductDetailsComponent } from './views/qc-report-view/components/port-call-grid/product-details.component';
import { QcReportViewRouteResolver } from './views/qc-report-view/qc-report-view-route.resolver';
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
    NgxsModule.forFeature([QuantityControlState, QcReportsListState, QcReportViewState])
  ],
  declarations: [
    MainQuantityControlComponent,
    WunderBarComponent,
    QcReportsListComponent,
    QcReportViewComponent,
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
    QcReportViewRouteResolver,
    {
      provide: QUANTITY_CONTROL_API_SERVICE,
      useClass: environment.production ? QuantityControlApi : QuantityControlApiMock
    },

    // TODO: Recheck, if we don't provide it here it crashes inside of PortCallsGridViewModel
    ReportViewService
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
