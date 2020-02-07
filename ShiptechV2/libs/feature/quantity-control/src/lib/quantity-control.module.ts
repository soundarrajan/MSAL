import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoggingModule } from "@shiptech/core/logging/logging.module";
import { ModuleLoggerFactory } from "./core/logging/module-logger-factory";
import { QUANTITY_CONTROL_API_SERVICE, QuantityControlApi } from "./services/api/quantity-control-api";
import { SearchBoxModule } from "@shiptech/core/ui/components/search-box/search-box.module";
import { FilterPresetsModule } from "@shiptech/core/ui/components/filter-preferences/filter-presets.module";
import { WunderBarComponent } from "@shiptech/core/ui/components/wonder-bar/wunder-bar.component";
import { UIModule } from "@shiptech/core/ui/ui.module";
import { MessageBoxModule } from "@shiptech/core/ui/components/message-box/message-box.module";
import { MainQuantityControlComponent } from "./views/main-quantity-control.component";
import { QuantityControlGridModule } from "./quantity-control-grid.module";
import { NgxsModule } from "@ngxs/store";
import { QuantityControlState } from "./store/quantity-control.state";
import { QcReportsListState } from "./store/reports-list/qc-reports-list.state";
import { QcReportState } from "./store/report/qc-report.state";
import { QuantityControlRoutingModule } from "./quantity-control-routing.module";
import { QcReportsListComponent } from "./views/qc-reports-list/qc-reports-list.component";
import { QcReportDetailsComponent } from "./views/qc-report/details/qc-report-details.component";
import { QuantityControlApiMock } from "./services/api/quantity-control-api.mock";
import { environment } from "@shiptech/environment";
import { RelatedLinksModule } from "@shiptech/core/ui/components/related-links/related-links.module";
import { QcReportService } from "./services/qc-report.service";
import { EntityStatusModule } from "@shiptech/core/ui/components/entity-status/entity-status.module";
import { QuantityControlModuleResolver } from "./quantiy-control-route.resolver";
import { SoundingReportsComponent } from "./views/qc-report/details/components/sounding-reports/sounding-reports.component";
import { EventsLogComponent } from "./views/qc-report/details/components/events-log/events-log.component";
import { SurveyReportHistoryComponent } from "./views/qc-report/details/components/survey-report-history/survey-report-history.component";
import { ProductDetailsComponent } from "./views/qc-report/details/components/port-call-grid/product-details.component";
import { QcReportDetailsRouteResolver } from "./views/qc-report/details/qc-report-details-route.resolver";
import { AuthenticationModule } from "@shiptech/core/authentication/authentication.module";
import { PrimeNGModule } from "@shiptech/core/ui/primeng.module";
import { QcReportDetailsToolbarComponent } from "./views/qc-report/toolbar/qc-report-details-toolbar.component";
import { UomSelectorComponent } from "./views/qc-report/details/components/uom-selector/uom-selector.component";
import { RaiseClaimComponent } from "./views/qc-report/details/components/raise-claim/raise-claim.component";
import { QcReportDetailsUnsavedChangesGuard } from "./guards/qc-report-details-unsaved-changes-guard.service";
import { NgxsResetPluginModule } from "ngxs-reset-plugin";
import { MasterAutocompleteModule } from "@shiptech/core/ui/components/master-autocomplete/master-autocomplete.module";
import { AgFilterDisplayModule } from "@shiptech/core/ui/components/ag-filter-display/ag-filter-display.module";
import { QcReportDetailsEmailLogsComponent } from "./views/qc-report/email-logs/qc-report-details-email-logs.component";
import { QcReportDetailsAuditLogsComponent } from "./views/qc-report/audit-logs/qc-report-details-audit-logs.component";
import { DocumentsComponent } from "@shiptech/core/ui/components/documents/documents.component";
import { QcReportDetailsDocumentsComponent } from "./views/qc-report/documents/qc-report-details-documents.component";
import { SelectTextOnFocusDirectiveModule } from "@shiptech/core/ui/directives/default/select-text-on-focus.directive";
import { EmailLogModule } from "@shiptech/core/ui/components/email-log/email-log.module";
import { AuditLogModule } from "@shiptech/core/ui/components/audit-log/audit-log.module";
import { DocumentsModule } from "@shiptech/core/ui/components/documents/documents.module";
import { AgFooterModule } from "@shiptech/core/ui/components/ag-footer/ag-footer.module";
import { WunderBarModule } from '@shiptech/core/ui/components/wonder-bar/wunder-bar.module';

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
    MasterAutocompleteModule,
    PrimeNGModule,
    MessageBoxModule,
    RelatedLinksModule,
    EntityStatusModule,
    NgxsModule.forFeature([QuantityControlState, QcReportsListState, QcReportState]),
    NgxsResetPluginModule.forRoot(),
    AgFilterDisplayModule,
    AgFooterModule,
    SelectTextOnFocusDirectiveModule,
    EmailLogModule,
    AuditLogModule,
    DocumentsModule,
    WunderBarModule
  ],
  declarations: [
    MainQuantityControlComponent,
    QcReportsListComponent,
    QcReportDetailsComponent,
    SoundingReportsComponent,
    EventsLogComponent,
    SurveyReportHistoryComponent,
    ProductDetailsComponent,
    QcReportDetailsToolbarComponent,
    QcReportDetailsEmailLogsComponent,
    QcReportDetailsAuditLogsComponent,
    QcReportDetailsDocumentsComponent,
    UomSelectorComponent,
    RaiseClaimComponent
  ],
  entryComponents: [
    RaiseClaimComponent
  ],
  exports: [
    MainQuantityControlComponent
  ],
  providers: [
    ModuleLoggerFactory,
    QuantityControlModuleResolver,
    QcReportDetailsRouteResolver,
    {
      provide: QUANTITY_CONTROL_API_SERVICE,
      useClass: environment.production ? QuantityControlApi : QuantityControlApiMock
    },
    QcReportDetailsUnsavedChangesGuard,
    QcReportService
  ]
})
export class QuantityControlModule {
}
