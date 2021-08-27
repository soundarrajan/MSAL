import { FooterV2Component } from './../../../../core/src/lib/ui/components/ds-components/footer-v2/footer-v2.component';
// Store

// Components
import { SupplierCommentsPopupComponent } from './views/main/details/components/spot-negotiation-popups/supplier-comments-popup/supplier-comments-popup.component';
import { SpotnegoPricingDetailsComponent } from './views/main/details/components/spot-negotiation-popups/spotnego-pricing-details/spotnego-pricing-details.component';
import { SpotnegoOtherdetails2Component } from './views/main/details/components/spot-negotiation-popups/spotnego-otherdetails2/spotnego-otherdetails2.component';
import { SpotnegoOtherdetailsComponent } from './views/main/details/components/spot-negotiation-popups/spotnego-otherdetails/spotnego-otherdetails.component';
import { SpotnegoOfferpricehistoryComponent } from './views/main/details/components/spot-negotiation-popups/spotnego-offerpricehistory/spotnego-offerpricehistory.component';
import { SpotnegoConfirmorderComponent } from './views/main/details/components/spot-negotiation-popups/spotnego-confirmorder/spotnego-confirmorder.component';
import { SpotnegoAdditionalcostComponent } from './views/main/details/components/spot-negotiation-popups/spotnego-additionalcost/spotnego-additionalcost.component';
import { SellerratingpopupComponent } from './views/main/details/components/spot-negotiation-popups/sellerratingpopup/sellerratingpopup.component';
import { SearchRequestPopupComponent } from './views/main/details/components/spot-negotiation-popups/search-request-popup/search-request-popup.component';
import { RfqspopupComponent } from './views/main/details/components/spot-negotiation-popups/rfqspopup/rfqspopup.component';
import { MarketpricehistorypopupComponent } from './views/main/details/components/spot-negotiation-popups/marketpricehistorypopup/marketpricehistorypopup.component';
import { EmailPreviewPopupComponent } from './views/main/details/components/spot-negotiation-popups/email-preview-popup/email-preview-popup.component';
import { ContactinformationpopupComponent } from './views/main/details/components/spot-negotiation-popups/contactinformationpopup/contactinformationpopup.component';
import { AvailabletermcontractspopupComponent } from './views/main/details/components/spot-negotiation-popups/availabletermcontractspopup/availabletermcontractspopup.component';
import { ApplicablecostpopupComponent } from './views/main/details/components/spot-negotiation-popups/applicablecostpopup/applicablecostpopup.component';
import { SpotnegoemaillogComponent } from './views/main/details/components/spotnegoemaillog/spotnegoemaillog.component';
import { SpotNegotiationHomeComponent } from './views/main/details/components/spot-negotiation-home/spot-negotiation-home.component';
import { SpotNegotiationHeaderComponent } from './views/main/details/components/spot-negotiation-header/spot-negotiation-header.component';
import { SpotNegotiationDetailsComponent } from './views/main/details/components/spot-negotiation-details/spot-negotiation-details.component';
import { SpotNegotiationCommentsComponent } from './views/main/details/components/spot-negotiation-comments/spot-negotiation-comments.component';
import { DocDragDropUploadComponent } from './views/main/details/components/doc-drag-drop-upload/doc-drag-drop-upload.component';
import { MainSpotNegotiationComponent } from './views/main-spot-negotiation.component';
import { SpotNegotiationComponent } from './views/main/details/spot-negotiation.component';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { LoggingModule } from '@shiptech/core/logging/logging.module';
import { ModuleLoggerFactory } from './core/logging/module-logger-factory';
import { SearchBoxModule } from '@shiptech/core/ui/components/search-box/search-box.module';
import { FilterPresetsModule } from '@shiptech/core/ui/components/filter-preferences/filter-presets.module';
import { UIModule } from '@shiptech/core/ui/ui.module';
import { MessageBoxModule } from '@shiptech/core/ui/components/message-box/message-box.module';
import { SpotNegotiationGridModule } from './spot-negotiation-grid.module';
import { environment } from '@shiptech/environment';
import { RelatedLinksModule } from '@shiptech/core/ui/components/related-links/related-links.module';
import { EntityStatusModule } from '@shiptech/core/ui/components/entity-status/entity-status.module';
import { AuthenticationModule } from '@shiptech/core/authentication/authentication.module';
import { MasterAutocompleteModule } from '@shiptech/core/ui/components/master-autocomplete/master-autocomplete.module';
import { AgFilterDisplayModule } from '@shiptech/core/ui/components/ag-filter-display/ag-filter-display.module';
import { SelectTextOnFocusDirectiveModule } from '@shiptech/core/ui/directives/default/select-text-on-focus.directive';
import { EmailLogModule } from '@shiptech/core/ui/components/email-log/email-log.module';
import { AuditLogModule } from '@shiptech/core/ui/components/audit-log/audit-log.module';
import { DocumentsModule } from '@shiptech/core/ui/components/documents/documents.module';
import { AgFooterModule } from '@shiptech/core/ui/components/ag-footer/ag-footer.module';
import { WunderBarDeliveryModule } from '@shiptech/core/ui/components/wonder-bar-delivery/wunder-bar-delivery.module';
import { WunderBarModule } from '@shiptech/core/ui/components/wonder-bar/wunder-bar.module';
import { WunderTabDeliveryModule } from '@shiptech/core/ui/components/wonder-tab-delivery/wunder-tab-delivery.module';

import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { TabMenuModule } from 'primeng/tabmenu';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { PanelModule } from 'primeng/panel';
import { SpinnerModule } from 'primeng/spinner';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AccordionModule } from 'primeng/accordion';
import { DropdownModule } from 'primeng/dropdown';
import { MessagesModule } from 'primeng/messages';
import { PSpinnerDisableKeysSpinDirective } from '@shiptech/core/ui/directives/p-spinner-disable-keys-spin.directive';
import { PSpinnerTenantFormatDirective } from '@shiptech/core/ui/directives/p-spinner-tenant-format.directive';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ExportModule } from '@shiptech/core/ui/components/export/export.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { PortalModule } from '@angular/cdk/portal';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CdkTableModule } from '@angular/cdk/table';
import { ClipboardModule } from '@ag-grid-enterprise/all-modules';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { A11yModule } from '@angular/cdk/a11y';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSliderModule } from '@angular/material/slider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpotNegotiationService } from './services/spot-negotiation.service';
import { MasterSelectorModule } from '@shiptech/core/ui/components/master-selector/master-selector.module';
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule
} from '@angular-material-components/datetime-picker';

import { HighchartsChartModule } from 'highcharts-angular';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatSelectInfiniteScrollModule } from 'ng-mat-select-infinite-scroll';
import { MatFormFieldModule } from '@angular/material/form-field';

import { BreadcrumbsModule } from '@shiptech/core/ui/components/breadcrumbs/breadcrumbs.module';
import { SpotNegotiationRoutingModule } from './spot-negotiation-routing.module';
import {
  SpotNegotiationApi,
  SPOT_NEGOTIATION_API_SERVICE
} from './services/api/spot-negotiation-api';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { CellHoverDetailsComponent } from './core/dialog-popup/cell-hover-details/cell-hover-details.component';
import { CogsCalculationComponent } from './core/dialog-popup/cogs-calculation/cogs-calculation.component';
import { OperationSummaryPopComponent } from './core/dialog-popup/operation-summary-pop/operation-summary-pop.component';
import { OperationSummaryWithStatusComponent } from './core/dialog-popup/operation-summary-with-status/operation-summary-with-status.component';
import { OperationSummaryWithoutaddnewComponent } from './core/dialog-popup/operation-summary-withoutaddnew/operation-summary-withoutaddnew.component';
import { PipelineTariffComponent } from './core/dialog-popup/pipeline-tariff/pipeline-tariff.component';
import { ProductDetailsComponent } from './core/dialog-popup/product-details/product-details.component';
import { WarningDeletePopupComponent } from './core/dialog-popup/warning-delete-popup/warning-delete-popup.component';
import { InventoryReportPopupComponent } from './core/ops-inventory/popup-screens/inventory-report-popup/inventory-report-popup.component';
import { MovDetailsComponent } from './core/ops-inventory/popup-screens/mov-details/mov-details.component';
import { ChangeLogPopupComponent } from './core/dialog-popup/change-log-popup/change-log-popup.component';
import { LocalService } from './services/local-service.service';
import { AgGridCellStyleComponent } from './core/ag-grid/ag-grid-cell-style.component';
import { AGGridCellDataComponent } from './core/ag-grid/ag-grid-celldata.component';
import { AggridStatusChipComponent } from './core/ag-grid/ag-grid-status-chip.component';
import { AggridCustomFilter } from './core/ag-grid/ag-grid-custom-filter.component';
import { AgGridCustomRadiobuttonComponent } from './core/ag-grid/ag-grid-custom-radiobutton.component';

import { AGGridCellRendererComponent } from './core/ag-grid/ag-grid-cell-renderer.component';
import { AgGridDatetimePickerNewComponent } from './core/ag-grid/ag-grid-datetime-picker-new.component';
import { AgGridDatetimePickerToggleComponent } from './core/ag-grid/ag-grid-datetimePicker-Toggle';
import { AGGridDateTimePickerComponent } from './core/ag-grid/ag-grid-datetimePicker.component';
import { AGGridEditorComponent } from './core/ag-grid/ag-grid-editor.component';
import { AgGridHoverPopupComponent } from './core/ag-grid/ag-grid-hover-popup.component';
import { AggridLinkComponent } from './core/ag-grid/ag-grid-link.component';
import { AgGridLookupEditor } from './core/ag-grid/ag-grid-lookup.component';
import { CustomHeaderGroupNotify } from './core/ag-grid/custom-header-group-notification.component';
import { CustomHeaderGroup } from './core/ag-grid/custom-header-group.component';
import { ShiptechCustomHeaderGroup } from './core/ag-grid/shiptech-custom-header-group';
import { AGGridCellRendererV2Component } from './core/ag-grid/ag-grid-cell-rendererv2.component';
import { AGGridCellActionsComponent } from './core/ag-grid/ag-grid-cell-actions.component';
import { AGGridCellMenuPopupComponent } from './core/ag-grid/ag-grid-cell-menu.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { BadgeComponent } from './views/main/details/components/badge/badge.component';
import { LocPanDataComponent } from './views/main/details/components/loc-pan-data/loc-pan-data.component';
import { SpotNegotiationStore } from './store/spot-negotiation.store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsModule } from '@ngxs/store';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { StaticListsRouteResolver } from './static-lists-route.resolver';
import { SpotNegotiationNewCommentsComponent } from './views/main/details/components/spot-negotiation-new-comments/spot-negotiation-new-comments.component';


import { grpc } from '@improbable-eng/grpc-web';
import { GrpcCoreModule } from '@ngx-grpc/core';
import { GrpcWebClientModule } from '@ngx-grpc/grpc-web-client';
import { ImprobableEngGrpcWebClientModule } from '@ngx-grpc/improbable-eng-grpc-web-client';
@NgModule({
  imports: [
    CommonModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    // gRPC
    GrpcCoreModule.forRoot(),
    ImprobableEngGrpcWebClientModule.forChild({
      settings: {
        host: 'https://localhost:5001',
        transport: grpc.CrossBrowserHttpTransport({}),
      },
    }),
    // STORE
    NgxsModule.forRoot([SpotNegotiationStore]),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot(),

    SpotNegotiationGridModule,
    SpotNegotiationRoutingModule,
    LoggingModule,
    AuthenticationModule.forFeature(),
    SearchBoxModule,
    UIModule,
    FilterPresetsModule,
    MasterAutocompleteModule,
    MessageBoxModule,
    RelatedLinksModule,
    EntityStatusModule,
    DynamicDialogModule,
    ExportModule,
    FormsModule,
    ReactiveFormsModule,
    AgFilterDisplayModule,
    AgFooterModule,
    SelectTextOnFocusDirectiveModule,
    EmailLogModule,
    AuditLogModule,
    DocumentsModule,
    WunderBarDeliveryModule,
    WunderTabDeliveryModule,
    WunderBarModule,
    ButtonModule,
    PaginatorModule,
    TabMenuModule,
    AutoCompleteModule,
    PanelModule,
    SpinnerModule,
    CheckboxModule,
    InputTextareaModule,
    AccordionModule,
    DropdownModule,
    MessagesModule,
    A11yModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTableModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    OverlayModule,
    PortalModule,
    ScrollingModule,
    UIModule,
    MasterSelectorModule,
    ButtonModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    NgxSpinnerModule,
    MatFormFieldModule,
    NgxMatSelectSearchModule,
    MatSelectInfiniteScrollModule,
    BreadcrumbsModule,
    HighchartsChartModule
  ],
  declarations: [
    MainSpotNegotiationComponent,
    // Ag grid, unable to load from module
    AgGridCellStyleComponent,
    AGGridCellDataComponent,
    AggridCustomFilter,
    AggridStatusChipComponent,
    AgGridCustomRadiobuttonComponent,
    AGGridCellRendererComponent,
    AgGridDatetimePickerNewComponent,
    AgGridDatetimePickerToggleComponent,
    AGGridDateTimePickerComponent,
    AGGridEditorComponent,
    AgGridHoverPopupComponent,
    AggridLinkComponent,
    AgGridLookupEditor,
    CustomHeaderGroupNotify,
    CustomHeaderGroup,
    ShiptechCustomHeaderGroup,
    AGGridCellRendererV2Component,
    AGGridCellActionsComponent,
    AGGridCellMenuPopupComponent,
    // Components
    MovDetailsComponent,
    FooterV2Component,
    SpotNegotiationNewCommentsComponent,
    ApplicablecostpopupComponent,
    SupplierCommentsPopupComponent,
    AvailabletermcontractspopupComponent,
    ContactinformationpopupComponent,
    EmailPreviewPopupComponent,
    MarketpricehistorypopupComponent,
    RfqspopupComponent,
    SearchRequestPopupComponent,
    SellerratingpopupComponent,
    SpotnegoAdditionalcostComponent,
    SpotnegoConfirmorderComponent,
    SpotnegoOfferpricehistoryComponent,
    SpotnegoOtherdetailsComponent,
    SpotnegoOtherdetails2Component,
    SpotNegotiationCommentsComponent,
    SpotNegotiationDetailsComponent,
    SpotnegoPricingDetailsComponent,
    SpotNegotiationHeaderComponent,
    CogsCalculationComponent,
    OperationSummaryPopComponent,
    OperationSummaryWithStatusComponent,
    OperationSummaryWithoutaddnewComponent,
    PipelineTariffComponent,
    ProductDetailsComponent,
    WarningDeletePopupComponent,
    CellHoverDetailsComponent,
    InventoryReportPopupComponent,
    ChangeLogPopupComponent,
    SpotNegotiationComponent,
    DocDragDropUploadComponent,
    SpotNegotiationHomeComponent,
    SpotnegoemaillogComponent,
    BadgeComponent,
    LocPanDataComponent
  ],
  entryComponents: [
    AGGridCellRendererV2Component,
    AGGridCellActionsComponent,
    ShiptechCustomHeaderGroup,
    SellerratingpopupComponent,
    ApplicablecostpopupComponent,
    SpotnegoOfferpricehistoryComponent,
    MarketpricehistorypopupComponent,
    AvailabletermcontractspopupComponent,
    SpotnegoAdditionalcostComponent,
    SupplierCommentsPopupComponent,
    SpotnegoConfirmorderComponent,
    EmailPreviewPopupComponent,
    ContactinformationpopupComponent,
    SpotnegoPricingDetailsComponent
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
    LocalService,
    ConfirmationService,
    DecimalPipe,
    DatePipe,
    StaticListsRouteResolver
  ]
})
export class SpotNegotiationModule {}
