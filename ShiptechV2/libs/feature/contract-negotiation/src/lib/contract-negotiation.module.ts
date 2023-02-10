import { NgModule } from '@angular/core';
import { AuthenticationMsalModule } from '@shiptech/core/authentication/authentication-msal.module';
import { AuthenticationAdalModule } from '@shiptech/core/authentication/authentication-adal.module';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { TabMenuModule } from 'primeng/tabmenu';
import 'ag-grid-enterprise';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContractNegotiationRoutingModule } from './contract-negotiation-routing.module';
import { ContractNegotiationComponent } from './views/contract-negotiation-components/contract-negotiation.component';
import { RequestListComponent } from './views/contract-negotiation-components/request-list/request-list.component';
import { ContractRequestDetailsComponent } from './views/contract-negotiation-components/conract-request-details/contract-request-details.component';
import { negoPricingDetailsComponent } from '../../../../core/src/lib/formula-pricing/pricing-details/pricing-details.component';
import { MainPageComponent } from './views/contract-negotiation-components/main-page/main-page.component';
import { CreateContractRequestPopupComponent } from './views/contract-negotiation-components/contract-negotiation-popups/create-contract-request-popup/create-contract-request-popup.component';

//import { SharedModule } from 'src/public_api';
import { SharedModule } from '@shiptech/core/shared/shared.module';
import { environment } from '@shiptech/environment';
import {
  CONTRACT_NEGOTIATION_API_SERVICE,
  ContractNegotiationApi
} from './services/api/contract-negotiation-api';
import { ContractNegotiationService } from './services/contract-negotiation.service';
import { UIModule } from '@shiptech/core/ui/ui.module';
import { MasterSelectorModule } from '@shiptech/core/ui/components/master-selector/master-selector.module';
import { FilterPresetsModule } from '@shiptech/core/ui/components/filter-preferences/filter-presets.module';
import { BreadcrumbsModule } from '@shiptech/core/ui/components/breadcrumbs/breadcrumbs.module';
import { AGGridCellClickRendererComponent } from './core/ag-grid-renderers/ag-grid-cell-click-renderer.component';
import { AGGridCellLinkRenderer } from './core/ag-grid-renderers/ag-grid-cell-link-renderer.component';
import { AGGridCellMenuRenderer } from './core/ag-grid-renderers/ag-grid-cell-menu-renderer.component';
import { AGGridCheckboxRenderer } from './core/ag-grid-renderers/ag-grid-checkbox-renderer.component';
import { AGGridDatepickerRenderer } from './core/ag-grid-renderers/ag-grid-datepicker-renderer.component';
import { AGGridInputSelectRenderer } from './core/ag-grid-renderers/ag-grid-input-select-renderer.component';
import { AGGridMultiDataRendererComponent } from './core/ag-grid-renderers/ag-grid-multi-data-renderer.component';
import { AGGridRatingChipRenderer } from './core/ag-grid-renderers/ag-grid-rating-chip-renderer.component';
import { fullWidthCellRenderer } from './core/ag-grid-renderers/fullWidthCellRenderer.component';
import { MatCheckboxHeaderComponent } from './core/ag-grid-renderers/mat-checkbox-header.component';
import { ContractNegotiationModuleResolver } from './contract-negotiation-route.resolver';
import { MainContractNegotiationComponent } from './views/main-contract-negotiation.component';
import { ContractNegotiationHeaderComponent } from './views/contract-negotiation-components/contract-negotiation-header/contract-negotiation-header.component';
import { ContractNegotiationDetailsComponent } from './views/contract-negotiation-components/contract-negotiation-details/contract-negotiation-details.component';
import { OfferChatComponent } from './views/contract-negotiation-components/offer-chat/offer-chat.component';
import { DetailsTableHeaderComponent } from './views/contract-negotiation-components/details-table-header/details-table-header.component';
import { ContractNegoGridComponent } from './views/contract-negotiation-components/contract-nego-grid/contract-nego-grid.component';
import { ContractNegoEmaillogComponent } from './views/contract-negotiation-components/contract-nego-emaillog/contract-nego-emaillog.component';
import { EmailPreviewPopupComponent } from './views/contract-negotiation-components/contract-negotiation-popups/email-preview-popup/email-preview-popup.component';
import { ModifyOfferPeriodPopupComponent } from './views/contract-negotiation-components/contract-negotiation-popups/modify-offer-period-popup/modify-offer-period-popup.component';
import { ContractNegoAuditlogComponent } from './views/contract-negotiation-components/contract-nego-auditlog/contract-nego-auditlog.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { FormulaPricingPopupComponent } from './views/contract-negotiation-components/contract-negotiation-popups/formula-pricing-popup/formula-pricing-popup.component';
import { SearchFormulaPopupComponent } from '../../../../../libs/core/src/lib/formula-pricing/search-formula-popup/search-formula-popup.component';
import { AdditionalCostPopupComponent } from './views/contract-negotiation-components/contract-negotiation-popups/additional-cost-popup/additional-cost-popup.component';
import { ContractNegoTableComponent } from './views/contract-negotiation-components/contract-nego-table/contract-nego-table.component';
import { SendRfqPopupComponent } from './views/contract-negotiation-components/contract-negotiation-popups/send-rfq-popup/send-rfq-popup.component';
import { UpdateRfqPopupComponent } from './views/contract-negotiation-components/contract-negotiation-popups/update-rfq-popup/update-rfq-popup.component';
import { DeleteChatPopupComponent } from './views/contract-negotiation-components/contract-negotiation-popups/delete-chat-popup/delete-chat-popup.component';
import { DSV2ComponentsModule } from '@shiptech/core/ui/components/designsystem-v2/ds-v2.module';
import { FilterListComponent } from './views/contract-negotiation-components/filter-components/filter-list/filter-list.component';
import { HeaderFilterChipComponent } from './views/contract-negotiation-components/filter-components/header-filter-chip/header-filter-chip.component';
import { MoreFilterChipComponent } from './views/contract-negotiation-components/filter-components/more-filter-chip/more-filter-chip.component';
import { DocDragDropUploadComponent } from './views/contract-negotiation-components/doc-drag-drop-upload/doc-drag-drop-upload.component';
import { HeaderBreadcrumbComponent } from './views/contract-negotiation-components/header-breadcrumb/header-breadcrumb.component';
import { ModuleLoggerFactory } from './core/logging/module-logger-factory';
import { AgFooterNewModule } from '@shiptech/core/ui/components/ag-footer-new/ag-footer-new.module';
import { CKEditorModule } from 'ckeditor4-angular';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PortalModule } from '@angular/cdk/portal';
import { MaterialModule } from '@shiptech/core/ui/material.module';
import { MatTableModule } from '@angular/material/table';
import { SpotNegotiationService } from './../../../spot-negotiation/src/lib/services/spot-negotiation.service';
import { AgFilterDisplayModule } from '@shiptech/core/ui/components/ag-filter-display/ag-filter-display.module';
import { CounterpartieNameCellComponent } from './core/ag-grid-renderers/counterpartie-name-cell.component';
import { SearchAllCounterpartiesComponent } from 'libs/feature/spot-negotiation/src/lib/views/main/details/components/spot-negotiation-popups/search-all-counterparties/search-all-counterparties.component';
import { AGGridSpecSelectRenderer } from './core/ag-grid-renderers/ag-grid-spec-select-renderer.component';
import { AGGridMinMaxCellRenderer } from './core/ag-grid-renderers/ag-grid-min-max-cell-renderer.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AGGridCellActionsDocumentsComponent } from './core/ag-grid-renderers/ag-grid-cell-actions-documents.component';
import { AGGridCellV2RendererComponent } from './core/ag-grid-renderers/ag-grid-cell-renderer-v2.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DragDropFileUploadDirective } from './directives/drag-drop-file-upload.directive';
import { EventBasedContinuous } from '../../../../core/src/lib/formula-pricing/event-based-continuous/event-based-continuous.component';
import { PricingFormulaSimple } from '../../../../core/src/lib/formula-pricing/pricing-formula-simple/pricing-formula-simple.component';
import { PricingFormulaComplex } from '../../../../core/src/lib/formula-pricing/pricing-formula-complex/pricing-formula-complex.component';
import { SpecificDates } from '../../../../core/src/lib/formula-pricing/specific-dates/specific-dates.component';
import { EventBasedExtended } from '../../../../core/src/lib/formula-pricing/event-based-extended/event-based-extended.component';
import { ProductBased } from '../../../../core/src/lib/formula-pricing/product-based/product-based.component';
import { VesselLocationBased } from '../../../../core/src/lib/formula-pricing/vessel-location-based/vessel-location-based.component';
import { EventBasedSimple } from '../../../../core/src/lib/formula-pricing/event-based-simple/event-based-simple.component';
import { DateRange } from '../../../../core/src/lib/formula-pricing/date-range/date-range.component';
import { QuantityBased } from '../../../../core/src/lib/formula-pricing/quantity-based/quantity-based.component';
//import { RemoveCounterpartyPopupComponent } from './views/contract-negotiation-components/contract-negotiation-popups/remove-counterparty-popup/remove-counterparty-popup.component';
//import { ConfirmdialogComponent } from './views/contract-negotiation-components/contract-negotiation-popups/confirmdialog/confirmdialog.component';

@NgModule({
  declarations: [
    MainContractNegotiationComponent,
    ContractNegotiationComponent,
    RequestListComponent,
    ContractRequestDetailsComponent,
    negoPricingDetailsComponent,
    MainPageComponent,
    CreateContractRequestPopupComponent,
    ContractNegotiationHeaderComponent,
    ContractNegotiationDetailsComponent,
    OfferChatComponent,
    DetailsTableHeaderComponent,
    ContractNegoGridComponent,
    ContractNegoEmaillogComponent,
    EmailPreviewPopupComponent,
    ModifyOfferPeriodPopupComponent,
    ContractNegoAuditlogComponent,
    FormulaPricingPopupComponent,
    SearchFormulaPopupComponent,
    AdditionalCostPopupComponent,
    ContractNegoTableComponent,
    SendRfqPopupComponent,
    UpdateRfqPopupComponent,
    DeleteChatPopupComponent,
    FilterListComponent,
    HeaderFilterChipComponent,
    MoreFilterChipComponent,
    DocDragDropUploadComponent,
    AGGridCellClickRendererComponent,
    AGGridCellLinkRenderer,
    AGGridCellMenuRenderer,
    AGGridCheckboxRenderer,
    AGGridDatepickerRenderer,
    AGGridInputSelectRenderer,
    AGGridSpecSelectRenderer,
    AGGridMultiDataRendererComponent,
    AGGridRatingChipRenderer,
    fullWidthCellRenderer,
    MatCheckboxHeaderComponent,
    HeaderBreadcrumbComponent,
    CounterpartieNameCellComponent,
    AGGridMinMaxCellRenderer,
   // RemoveCounterpartyPopupComponent,
   //ConfirmdialogComponent,
   SearchAllCounterpartiesComponent,
   AGGridCellActionsDocumentsComponent,
   AGGridCellV2RendererComponent,
   DragDropFileUploadDirective,
   EventBasedContinuous,
   PricingFormulaSimple,
   PricingFormulaComplex,
   SpecificDates,
   EventBasedExtended,
   ProductBased,
   VesselLocationBased,
   EventBasedSimple,
   DateRange,
   QuantityBased
  ],
  imports: [
    CommonModule,
    TabMenuModule,
    MaterialModule,
    MatTableModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    MasterSelectorModule,
    PortalModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    !environment.useAdal
      ? AuthenticationMsalModule.forFeature()
      : AuthenticationAdalModule.forFeature(),
    UIModule,
    FilterPresetsModule,
    AgFilterDisplayModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    AgGridModule.withComponents([]),
    ContractNegotiationRoutingModule,
    DSV2ComponentsModule,
    BreadcrumbsModule,
    AgFooterNewModule,
    CKEditorModule,
    NgxSpinnerModule,
    MatTooltipModule,
    DragDropModule
  ],
  entryComponents: [
    AGGridCellClickRendererComponent,
    AGGridCellLinkRenderer,
    AGGridCellMenuRenderer,
    AGGridCheckboxRenderer,
    AGGridDatepickerRenderer,
    AGGridInputSelectRenderer, 
    AGGridSpecSelectRenderer,
    AGGridMultiDataRendererComponent,
    AGGridRatingChipRenderer,
    fullWidthCellRenderer,
    SearchAllCounterpartiesComponent,
    AGGridMinMaxCellRenderer
  ],
  providers: [
    ModuleLoggerFactory,
    {
      provide: CONTRACT_NEGOTIATION_API_SERVICE,
      useClass: environment.production ? ContractNegotiationApi : ContractNegotiationApi
    },
    ContractNegotiationService,
    ContractNegotiationModuleResolver,
    SpotNegotiationService,
  ]
})
export class ContractNegotiationModule { }
