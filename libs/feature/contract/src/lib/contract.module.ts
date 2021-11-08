import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { LoggingModule } from '@shiptech/core/logging/logging.module';
import { ModuleLoggerFactory } from './core/logging/module-logger-factory';
import { SearchBoxModule } from '@shiptech/core/ui/components/search-box/search-box.module';
import { FilterPresetsModule } from '@shiptech/core/ui/components/filter-preferences/filter-presets.module';
import { UIModule } from '@shiptech/core/ui/ui.module';
import { MessageBoxModule } from '@shiptech/core/ui/components/message-box/message-box.module';
import { ContractGridModule } from './contract-grid.module';
import { NgxsModule } from '@ngxs/store';
import { environment } from '@shiptech/environment';
import { RelatedLinksModule } from '@shiptech/core/ui/components/related-links/related-links.module';
import { EntityStatusModule } from '@shiptech/core/ui/components/entity-status/entity-status.module';
import { AuthenticationMsalModule } from '@shiptech/core/authentication/authentication-msal.module';
import { AuthenticationAdalModule } from '@shiptech/core/authentication/authentication-adal.module';
import { NgxsResetPluginModule } from 'ngxs-reset-plugin';
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
import { ContractService } from './services/contract.service';
import { MasterSelectorModule } from '@shiptech/core/ui/components/master-selector/master-selector.module';
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule
} from '@angular-material-components/datetime-picker';

import { NgxSpinnerModule } from 'ngx-spinner';
import { MatSelectInfiniteScrollModule } from 'ng-mat-select-infinite-scroll';
import { MatFormFieldModule } from '@angular/material/form-field';

import { BreadcrumbsModule } from '@shiptech/core/ui/components/breadcrumbs/breadcrumbs.module';
import { ContractRoutingModule } from './contract-routing.module';
import { DeliveryAutocompleteModule } from './views/contract/details/components/delivery-autocomplete/delivery-autocomplete.module';
import { MainContractComponent } from './views/main-contract.component';
import { ContractDetailsComponent } from './views/contract/details/contract-details.component';
import { AutocompleteInputComponent } from './views/contract/details/components/autocomplete-input/autocomplete-input.component';
import { ContractDetailsToolbarComponent } from './views/contract/toolbar/contract-details-toolbar.component';
import { ContractDetailsDocumentsComponent } from './views/contract/documents/contract-details-documents.component';
import { QuantityTenantFormatDirective } from './views/contract/details/directives/quantity-tenant-format.directive';
import { NumberOnlyDirective } from './views/contract/details/directives/number-only.directive';
import { ContractRouteResolver } from './views/contract/details/contract-route.resolver';
import { ContractModuleResolver } from './contract-route.resolver';
import { UomsRouteResolver } from './views/contract/details/uoms-route.resolver';
import { ContractFeedbackRouteResolver } from './views/contract/details/contract-feedback-route.resolver';
import { QuantityCategoryRouteResolver } from './views/contract/details/quantity-category-route.resolver';
import { ScheduleDashboardLabelsRouteResolver } from './views/contract/details/schedule-dashboard-labels-route.resolver';
import { ClaimTypeRouteResolver } from './views/contract/details/claim-type-route.resolver';
import { BargeRouteResolver } from './views/contract/details/barge-route.resolver';
import { NavBarResolver } from './views/contract/details/navbar-route.resolver';
import { ContractDetailsRouteResolver } from './views/contract/details/contract-details-route.resolver';
import { ContractDetailsUnsavedChangesGuard } from './guards/contract-details-unsaved-changes-guard.service';
import { ContractApi, CONTRACT_API_SERVICE } from './services/api/contract-api';
import { GeneralInformationContract } from './views/contract/details/components/general-information-contract/general-information-contract.component';
import { StaticListsRouteResolver } from './views/contract/details/static-lists-route.resolver';
import { AgreementTypeRouteResolver } from './views/contract/details/agreement-type-route.resolver';
import { ContractQuantity } from './views/contract/details/components/contract-quantity/contract-quantity.component';
import { ContractProduct } from './views/contract/details/components/contract-product/contract-product.component';
import { LocationMasterRouteResolver } from './views/contract/details/location-master-route.resolver';
import { ProductMasterRouteResolver } from './views/contract/details/product-master-route.resolver';
import { ProductSpecGroupModalComponent } from './views/contract/details/components/product-spec-group-modal/product-spec-group-modal.component';
import { ProductDetails } from './views/contract/details/components/product-details/product-details.component';
import { ProductPricing } from './views/contract/details/components/product-pricing/product-pricing.component';
import { CreateNewFormulaModalComponent } from './views/contract/details/components/create-new-formula-modal/create-new-formula-modal.component';
import { AmountTenantFormatDirective } from './views/contract/details/directives/amount-tenant-format.directive';
import { PricingFormulaSimple } from './views/contract/details/components/pricing-formula-simple/pricing-formula-simple.component';
import { PricingFormulaComplex } from './views/contract/details/components/pricing-formula-complex/pricing-formula-complex.component';
import { DateRange } from './views/contract/details/components/date-range/date-range.component';
import { SpecificDates } from './views/contract/details/components/specific-dates/specific-dates.component';
import { EventBasedContinuous } from './views/contract/details/components/event-based-continuous/event-based-continuous.component';
import { EventBasedExtended } from './views/contract/details/components/event-based-extended/event-based-extended.component';
import { EventBasedSimple } from './views/contract/details/components/event-based-simple/event-based-simple.component';
import { QuantityBased } from './views/contract/details/components/quantity-based/quantity-based.component';
import { ProductBased } from './views/contract/details/components/product-based/product-based.component';
import { VesselLocationBased } from './views/contract/details/components/vessel-location-based/vessel-location-based.component';
import { PriceTenantFormatDirective } from './views/contract/details/directives/price-tenant-format.directive';
import { ExtendContractModalComponent } from './views/contract/details/components/extend-contract-modal/extend-contract-modal.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { FormulaHistoryModalComponent } from './views/contract/details/components/formula-history-modal/formula-history-modal.component';

let useAdal = false;

if (window.location.hostname.includes('cma')) {
  useAdal = true;
}

@NgModule({
  imports: [
    CommonModule,
    ContractGridModule,
    ContractRoutingModule,
    LoggingModule,
    !useAdal
      ? AuthenticationMsalModule.forFeature()
      : AuthenticationAdalModule.forFeature(),
    SearchBoxModule,
    UIModule,
    FilterPresetsModule,
    MasterAutocompleteModule,
    DeliveryAutocompleteModule,
    MessageBoxModule,
    RelatedLinksModule,
    EntityStatusModule,
    DynamicDialogModule,
    ExportModule,
    NgxsModule.forFeature([]),
    FormsModule,
    ReactiveFormsModule,
    NgxsResetPluginModule.forRoot(),
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
    BreadcrumbsModule
  ],
  declarations: [
    MainContractComponent,
    ContractDetailsComponent,
    GeneralInformationContract,
    ContractQuantity,
    ContractProduct,
    ProductDetails,
    ProductPricing,
    PricingFormulaSimple,
    PricingFormulaComplex,
    DateRange,
    SpecificDates,
    EventBasedContinuous,
    EventBasedExtended,
    ProductBased,
    VesselLocationBased,
    EventBasedSimple,
    QuantityBased,
    AutocompleteInputComponent,
    ContractDetailsToolbarComponent,
    ContractDetailsDocumentsComponent,
    QuantityTenantFormatDirective,
    AmountTenantFormatDirective,
    PriceTenantFormatDirective,
    NumberOnlyDirective,
    ProductSpecGroupModalComponent,
    CreateNewFormulaModalComponent,
    ExtendContractModalComponent,
    FormulaHistoryModalComponent
    //PSpinnerDisableKeysSpinDirective,
    //PSpinnerTenantFormatDirective
  ],
  entryComponents: [
    ProductSpecGroupModalComponent,
    CreateNewFormulaModalComponent,
    ExtendContractModalComponent,
    FormulaHistoryModalComponent
  ],
  exports: [
    MainContractComponent,
    QuantityTenantFormatDirective,
    NumberOnlyDirective,
    AmountTenantFormatDirective,
    PriceTenantFormatDirective
    // PSpinnerDisableKeysSpinDirective,
    //PSpinnerTenantFormatDirective
  ],
  providers: [
    ModuleLoggerFactory,
    ContractModuleResolver,
    ContractRouteResolver,
    UomsRouteResolver,
    ContractFeedbackRouteResolver,
    StaticListsRouteResolver,
    ContractDetailsRouteResolver,
    NavBarResolver,
    BargeRouteResolver,
    ClaimTypeRouteResolver,
    ScheduleDashboardLabelsRouteResolver,
    AgreementTypeRouteResolver,
    QuantityCategoryRouteResolver,
    ProductMasterRouteResolver,
    LocationMasterRouteResolver,
    {
      provide: CONTRACT_API_SERVICE,
      useClass: environment.production ? ContractApi : ContractApi
    },
    ContractDetailsUnsavedChangesGuard,
    ContractService,
    DialogService,
    MessageService,
    ConfirmationService,
    DecimalPipe
  ]
})
export class ContractModule {}
