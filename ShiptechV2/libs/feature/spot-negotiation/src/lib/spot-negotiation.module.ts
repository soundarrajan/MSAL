import { StaticListsRouteResolver } from './static-lists-route.resolver';
import { DocumentsModule } from './../../../../core/src/lib/ui/components/documents/documents.module';
import { AuditLogModule } from './../../../../core/src/lib/ui/components/audit-log/audit-log.module';
import { EmailLogModule } from './../../../../core/src/lib/ui/components/email-log/email-log.module';
import { ExportModule } from './../../../../core/src/lib/ui/components/export/export.module';
import { EntityStatusModule } from './../../../../core/src/lib/ui/components/entity-status/entity-status.module';
import { RelatedLinksModule } from './../../../../core/src/lib/ui/components/related-links/related-links.module';
import { MessageBoxModule } from './../../../../core/src/lib/ui/components/message-box/message-box.module';
import { MasterAutocompleteModule } from './../../../../core/src/lib/ui/components/master-autocomplete/master-autocomplete.module';
import { SearchBoxModule } from './../../../../core/src/lib/ui/components/search-box/search-box.module';
import { AuthenticationMsalModule } from '@shiptech/core/authentication/authentication-msal.module';
import { AuthenticationAdalModule } from '@shiptech/core/authentication/authentication-adal.module';
import { LoggingModule } from './../../../../core/src/lib/logging/logging.module';
import { HighchartsChartModule } from 'highcharts-angular';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { UIModule } from './../../../../core/src/lib/ui/ui.module';
import { NgModule } from '@angular/core';
import { MainSpotNegotiationComponent } from './views/main-spot-negotiation.component';
import { SpotNegotiationComponent } from './views/main/details/spot-negotiation.component';
import { SpotNegotiationHomeComponent } from './views/main/details/components/spot-negotiation-home/spot-negotiation-home.component';
import { AgGridDatetimePickerToggleComponent } from './core/ag-grid/ag-grid-datetimePicker-Toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModuleLoggerFactory } from './core/logging/module-logger-factory';
import {
  SPOT_NEGOTIATION_API_SERVICE,
  SpotNegotiationApi
} from './services/api/spot-negotiation-api';
import { environment } from '@shiptech/environment';
import { SpotNegotiationService } from './services/spot-negotiation.service';
import { SpotNegotiationGridModule } from './spot-negotiation-grid.module';
import { SpotNegotiationRoutingModule } from './spot-negotiation-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '@shiptech/core/ui/material.module';
import { AGGridCellActionsComponent } from './core/ag-grid/ag-grid-cell-actions.component';
import { AGGridCellRendererComponent } from './core/ag-grid/ag-grid-cell-renderer.component';
import { DocDragDropUploadComponent } from './views/main/details/components/doc-drag-drop-upload/doc-drag-drop-upload.component';
import { AGGridCellRendererV2Component } from './core/ag-grid/ag-grid-cell-rendererv2.component';
import { SpotnegoAdditionalcostComponent } from './views/main/details/components/spot-negotiation-popups/spotnego-additionalcost/spotnego-additionalcost.component';
import { SpotnegoPricingDetailsComponent } from './views/main/details/components/spot-negotiation-popups/spotnego-pricing-details/spotnego-pricing-details.component';
import { SupplierCommentsPopupComponent } from './views/main/details/components/spot-negotiation-popups/supplier-comments-popup/supplier-comments-popup.component';
import { EmailPreviewPopupComponent } from './views/main/details/components/spot-negotiation-popups/email-preview-popup/email-preview-popup.component';
import { SpotnegoOtherdetailsComponent } from './views/main/details/components/spot-negotiation-popups/spotnego-otherdetails/spotnego-otherdetails.component';
import { SellerratingpopupComponent } from './views/main/details/components/spot-negotiation-popups/sellerratingpopup/sellerratingpopup.component';
import { ContactinformationpopupComponent } from './views/main/details/components/spot-negotiation-popups/contactinformationpopup/contactinformationpopup.component';
import { SpotnegoOtherdetails2Component } from './views/main/details/components/spot-negotiation-popups/spotnego-otherdetails2/spotnego-otherdetails2.component';
import { SpotnegoemaillogComponent } from './views/main/details/components/spotnegoemaillog/spotnegoemaillog.component';
import { SpotNegotiationDetailsComponent } from './views/main/details/components/spot-negotiation-details/spot-negotiation-details.component';
import { SpotNegotiationHeaderComponent } from './views/main/details/components/spot-negotiation-header/spot-negotiation-header.component';
import { SearchRequestPopupComponent } from './views/main/details/components/spot-negotiation-popups/search-request-popup/search-request-popup.component';
import { SpotnegoSearchCtpyComponent } from './views/main/details/components/spot-negotiation-popups/spotnego-counterparties/spotnego-searchctpy.component';
import { ShiptechCustomHeaderGroup } from './core/ag-grid/shiptech-custom-header-group';
import { AvailabletermcontractspopupComponent } from './views/main/details/components/spot-negotiation-popups/availabletermcontractspopup/availabletermcontractspopup.component';
import { SpotnegoOfferpricehistoryComponent } from './views/main/details/components/spot-negotiation-popups/spotnego-offerpricehistory/spotnego-offerpricehistory.component';
import { MarketpricehistorypopupComponent } from './views/main/details/components/spot-negotiation-popups/marketpricehistorypopup/marketpricehistorypopup.component';
import { LocPanDataComponent } from './views/main/details/components/loc-pan-data/loc-pan-data.component';
import { ApplicablecostpopupComponent } from './views/main/details/components/spot-negotiation-popups/applicablecostpopup/applicablecostpopup.component';
import { BestcontractpopupComponent } from './views/main/details/components/spot-negotiation-popups/bestcontractpopup/bestcontractpopup.component';
import { ConfirmdialogComponent } from './views/main/details/components/spot-negotiation-popups/confirmdialog/confirmdialog.component';
import { SpotNegotiationNewCommentsComponent } from './views/main/details/components/spot-negotiation-new-comments/spot-negotiation-new-comments.component';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { DynamicDialogModule, DialogService } from 'primeng/dynamicdialog';
import { AgFilterDisplayModule } from '@shiptech/core/ui/components/ag-filter-display/ag-filter-display.module';
import { AgFooterModule } from '@shiptech/core/ui/components/ag-footer/ag-footer.module';
import { SelectTextOnFocusDirectiveModule } from '@shiptech/core/ui/directives/default/select-text-on-focus.directive';
import { BreadcrumbsModule } from '@shiptech/core/ui/components/breadcrumbs/breadcrumbs.module';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SpotnegoConfirmorderComponent } from './views/main/details/components/spot-negotiation-popups/spotnego-confirmorder/spotnego-confirmorder.component';
import { SpotnegoSendRfqComponent } from './views/main/details/components/spot-negotiation-popups/spotnego-send-rfq/spotnego-send-rfq.component';
import { CustomHeaderGroupNotify } from './core/ag-grid/custom-header-group-notification.component';
import { CustomHeaderGroup } from './core/ag-grid/custom-header-group.component';
import { RfqspopupComponent } from './views/main/details/components/spot-negotiation-popups/rfqspopup/rfqspopup.component';
import { BadgeComponent } from './views/main/details/components/badge/badge.component';
import { FilterPresetsModule } from '@shiptech/core/ui/components/filter-preferences/filter-presets.module';
import { FooterV2Component } from '@shiptech/core/ui/components/ds-components/footer-v2/footer-v2.component';
import { AgFooterNewModule } from '@shiptech/core/ui/components/ag-footer-new/ag-footer-new.module';
import { SpotnegoRequestChangesComponent } from './views/main/details/components/spot-negotiation-popups/spotnego-request-changes/spotnego-request-changes.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NegotiationDetailsToolbarComponent } from './views/main/toolbar/spot-negotiation-details-toolbar.component';
import { NavBarResolver } from './views/main/details/navbar-route.resolver';
import { UomsRouteResolver } from './uoms-route.resolver';
import { RemoveCounterpartyComponent } from './views/main/details/components/remove-counterparty-confirmation/remove-counterparty-confirmation';
import { MasterSelectorModule } from '@shiptech/core/ui/components/master-selector/master-selector.module';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { PortalModule } from '@angular/cdk/portal';
import { DeliveryModule } from '@shiptech/feature/delivery';
import { DeliveryRoutingModule } from 'libs/feature/delivery/src/lib/delivery-routing.module';
import { NgxMatDatetimePickerModule } from '@angular-material-components/datetime-picker';
import { PriceTenantFormatDirective } from './views/main/details/directives/price-tenant-format.directive';
import { NegotiationToolbarComponent } from './views/main/details/components/toolbar/negotiation-toolbar.component';
import { WunderBarModule } from '@shiptech/core/ui/components/wonder-bar/wunder-bar.module';
import { NegotiationDocumentsComponent } from './views/main/details/components/negotiation-documents/negotiation-documents.component';
import { NegotiationReportComponent } from './views/main/details/components/negotiation-report/negotiation-report.component';
import { FileUploadModule } from 'primeng/fileupload';
import { AGGridCellV2RendererComponent } from './core/ag-grid/ag-grid-cell-renderer-v2.component';
import { AGGridCellActionsDocumentsComponent } from './core/ag-grid/ag-grid-cell-actions-documents.component';
import { TabMenuModule } from 'primeng/tabmenu';
import { SharedModule } from '@shiptech/core/shared/shared.module';
import { DragDropFileUploadDirective } from './views/main/details/directives/drag-drop-file-upload.directive';
import { MatTableModule } from '@angular/material/table';
import { CustomHeader } from './core/ag-grid/custom-header.component';
import { CustomHeaderSelectAll } from './core/ag-grid/custom-header-select-all.component';
import { CKEditorModule } from 'ckeditor4-angular';

@NgModule({
  imports: [
    CommonModule,
    TabMenuModule,
    MatTableModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FilterPresetsModule,
    MasterSelectorModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    SpotNegotiationGridModule,
    SpotNegotiationRoutingModule,
    LoggingModule,
    AgFooterNewModule,
    PortalModule,
    !environment.useAdal
      ? AuthenticationMsalModule.forFeature()
      : AuthenticationAdalModule.forFeature(),
    SearchBoxModule,
    UIModule,

    MasterAutocompleteModule,
    NgxMatDatetimePickerModule,
    AutoCompleteModule,
    MessageBoxModule,
    RelatedLinksModule,
    EntityStatusModule,
    DynamicDialogModule,
    ExportModule,
    AgFilterDisplayModule,
    AgFooterModule,
    SelectTextOnFocusDirectiveModule,
    EmailLogModule,
    AuditLogModule,
    DocumentsModule,
    BreadcrumbsModule,
    HighchartsChartModule,
    NgxSpinnerModule,
    CKEditorModule,
    DeliveryModule,
    DeliveryRoutingModule,
    WunderBarModule,
    FileUploadModule,
    SharedModule
  ],
  declarations: [
    MainSpotNegotiationComponent,
    SpotNegotiationComponent,
    SpotNegotiationHomeComponent,
    DocDragDropUploadComponent,
    SpotnegoAdditionalcostComponent,
    SpotnegoPricingDetailsComponent,
    SupplierCommentsPopupComponent,
    EmailPreviewPopupComponent,
    SpotnegoOtherdetailsComponent,
    SellerratingpopupComponent,
    ContactinformationpopupComponent,
    SpotnegoOtherdetails2Component,
    SpotnegoemaillogComponent,
    SpotNegotiationHeaderComponent,
    SearchRequestPopupComponent,
    SpotnegoSearchCtpyComponent,
    SpotNegotiationDetailsComponent,
    AvailabletermcontractspopupComponent,
    SpotnegoOfferpricehistoryComponent,
    MarketpricehistorypopupComponent,
    LocPanDataComponent,
    ApplicablecostpopupComponent,
    BestcontractpopupComponent,
    ConfirmdialogComponent,
    SpotNegotiationNewCommentsComponent,
    NegotiationToolbarComponent,

    AGGridCellActionsComponent,
    AGGridCellRendererComponent,
    AGGridCellRendererV2Component,
    AGGridCellV2RendererComponent,
    AGGridCellActionsDocumentsComponent,

    CustomHeaderGroupNotify,
    CustomHeaderGroup,
    ShiptechCustomHeaderGroup,
    SpotnegoConfirmorderComponent,
    SpotnegoSendRfqComponent,
    RfqspopupComponent,
    // SpotNegotiationCommentsComponent,
    BadgeComponent,
    // FooterV2Component,
    AgGridDatetimePickerToggleComponent,
    SpotnegoRequestChangesComponent,
    NegotiationDetailsToolbarComponent,
    RemoveCounterpartyComponent,
    NegotiationDocumentsComponent,
    NegotiationReportComponent,
    PriceTenantFormatDirective,
    DragDropFileUploadDirective,
    CustomHeader,
    CustomHeaderSelectAll
    // QuantityTenantFormatDirective,
    // AmountTenantFormatDirective,
    // NumberOnlyDirective,
  ],
  entryComponents: [
    MainSpotNegotiationComponent,
    AGGridCellRendererComponent,
    AGGridCellV2RendererComponent,
    AGGridCellActionsDocumentsComponent,
    AGGridCellRendererV2Component,
    AGGridCellActionsComponent,
    ShiptechCustomHeaderGroup,
    SellerratingpopupComponent,
    ApplicablecostpopupComponent,
    BestcontractpopupComponent,
    ConfirmdialogComponent,
    SpotnegoOfferpricehistoryComponent,
    MarketpricehistorypopupComponent,
    AvailabletermcontractspopupComponent,
    SpotnegoAdditionalcostComponent,
    SupplierCommentsPopupComponent,
    SpotnegoConfirmorderComponent,
    EmailPreviewPopupComponent,
    ContactinformationpopupComponent,
    SpotnegoPricingDetailsComponent,
    SpotnegoOtherdetails2Component,
    SpotnegoSendRfqComponent,
    SearchRequestPopupComponent,
    SpotnegoSearchCtpyComponent,
    RemoveCounterpartyComponent,
    CustomHeader,
    CustomHeaderSelectAll
  ],
  exports: [],
  providers: [
    ModuleLoggerFactory,
    {
      provide: SPOT_NEGOTIATION_API_SERVICE,
      useClass: environment.production ? SpotNegotiationApi : SpotNegotiationApi
    },
    SpotNegotiationService,
    DialogService,
    MessageService,
    ConfirmationService,
    DecimalPipe,
    DatePipe,
    StaticListsRouteResolver,
    NavBarResolver,
    UomsRouteResolver
  ]
})
export class SpotNegotiationModule {}
