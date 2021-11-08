import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { LoggingModule } from '@shiptech/core/logging/logging.module';
import { ModuleLoggerFactory } from './core/logging/module-logger-factory';
import {
  QUANTITY_CONTROL_API_SERVICE,
  QuantityControlApi
} from './services/api/quantity-control-api';
import { SearchBoxModule } from '@shiptech/core/ui/components/search-box/search-box.module';
import { FilterPresetsModule } from '@shiptech/core/ui/components/filter-preferences/filter-presets.module';
import { UIModule } from '@shiptech/core/ui/ui.module';
import { MessageBoxModule } from '@shiptech/core/ui/components/message-box/message-box.module';
import { MainDeliveryComponent } from './views/main-delivery.component';
import { DeliveryGridModule } from './delivery-grid.module';
import { NgxsModule } from '@ngxs/store';
import { DeliveryRoutingModule } from './delivery-routing.module';
import { DeliveryDetailsComponent } from './views/delivery/details/delivery-details.component';
import { QuantityControlApiMock } from './services/api/quantity-control-api.mock';
import { environment } from '@shiptech/environment';
import { RelatedLinksModule } from '@shiptech/core/ui/components/related-links/related-links.module';
import { NotesService } from './services/notes.service';
import { EntityStatusModule } from '@shiptech/core/ui/components/entity-status/entity-status.module';
import { UserProfileState } from '@shiptech/core/store/states/user-profile/user-profile.state';
import { DeliveryModuleResolver } from './delivery-route.resolver';
import { NotesLogComponent } from './views/delivery/details/components/notes-log/notes-log.component';
import { DeliveryDetailsRouteResolver } from './views/delivery/details/delivery-details-route.resolver';
import { DeliveryRouteResolver } from './views/delivery/details/delivery-route.resolver';
import { AuthenticationMsalModule } from '@shiptech/core/authentication/authentication-msal.module';
import { AuthenticationAdalModule } from '@shiptech/core/authentication/authentication-adal.module';
import { DeliveryDetailsToolbarComponent } from './views/delivery/toolbar/delivery-details-toolbar.component';
import { UomSelectorComponent } from './views/delivery/details/components/uom-selector/uom-selector.component';
import { DeliveryDetailsUnsavedChangesGuard } from './guards/delivery-details-unsaved-changes-guard.service';
import { NgxsResetPluginModule } from 'ngxs-reset-plugin';
import { MasterAutocompleteModule } from '@shiptech/core/ui/components/master-autocomplete/master-autocomplete.module';
import { AgFilterDisplayModule } from '@shiptech/core/ui/components/ag-filter-display/ag-filter-display.module';
import { DeliveryDetailsEmailLogsComponent } from './views/delivery/email-logs/delivery-details-email-logs.component';
import { DeliveryDetailsDocumentsComponent } from './views/delivery/documents/delivery-details-documents.component';
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
import { BdnInformationComponent } from './views/delivery/details/components/bdn-information/bdn-information.component';
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
import { InputComponent } from './views/delivery/details/components/input/input.component';
import { DatePickerComponent } from './views/delivery/details/components/date-picker/date-picker.component';
import { AutocompleteInputComponent } from './views/delivery/details/components/autocomplete-input/autocomplete-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeliveryAutocompleteModule } from './views/delivery/details/components/delivery-autocomplete/delivery-autocomplete.module';
import { AutocompleteDComponent } from './views/delivery/details/components/delivery-autocomplete/autocomplete-d/autocomplete-d.component';
import { DropdownComponent } from './views/delivery/details/components/dropdown/dropdown.component';
import { DeliveryApi, DELIVERY_API_SERVICE } from './services/api/delivery-api';
import { DeliveryService } from './services/delivery.service';
import { MasterSelectorModule } from '@shiptech/core/ui/components/master-selector/master-selector.module';
import { DeliveryProductsGroupComponent } from './views/delivery/details/components/delivery-products-group/delivery-products-group.component';
import { DeliveryProductComponent } from './views/delivery/details/components/delivery-product/delivery-product.component';
import { ProductQualityComponent } from './views/delivery/details/components/product-quality/product-quality.component';
import { ProductQuantityComponent } from './views/delivery/details/components/product-quantity/product-quantity.component';
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule
} from '@angular-material-components/datetime-picker';

import { NgxSpinnerModule } from 'ngx-spinner';
import { BdnAdditionalInformationComponent } from './views/delivery/details/components/bdn-additional-information/bdn-additional-information.component';
import { QuantityTenantFormatDirective } from './views/delivery/details/directives/quantity-tenant-format.directive';
import { UomsRouteResolver } from './views/delivery/details/uoms-route.resolver';
import { DeliveryFeedbackRouteResolver } from './views/delivery/details/delivery-feedback-route.resolver';
import { SatisfactionLevelRouteResolver } from './views/delivery/details/satisfaction-level-route.resolver';
import { MatSelectInfiniteScrollModule } from 'ng-mat-select-infinite-scroll';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NavBarResolver } from './views/delivery/details/navbar-route.resolver';
import { BargeRouteResolver } from './views/delivery/details/barge-route.resolver';
import { RaiseClaimModalComponent } from './views/delivery/details/components/raise-claim-modal/raise-claim-modal.component';
import { ClaimTypeRouteResolver } from './views/delivery/details/claim-type-route.resolver';
import { ScheduleDashboardLabelsRouteResolver } from './views/delivery/details/schedule-dashboard-labels-route.resolver';
import { SplitDeliveryModalComponent } from './views/delivery/details/components/split-delivery-modal/split-delivery-modal.component';
import { QuantityCategoryRouteResolver } from './views/delivery/details/quantity-category-route.resolver';
import { NumberOnlyDirective } from './views/delivery/details/directives/number-only.directive';
import { BreadcrumbsModule } from '@shiptech/core/ui/components/breadcrumbs/breadcrumbs.module';
import { UomMassRouteResolver } from './views/delivery/details/uom-mass-route.resolver';
import { UomVolumeRouteResolver } from './views/delivery/details/uom-volume-route.resolver';
import { PumpingRateUomRouteResolver } from './views/delivery/details/pumping-rate-uom-route.resolver';
import { SampleSourceRouteResolver } from './views/delivery/details/sample-source-route.resolver';
import { StaticListsRouteResolver } from './views/delivery/details/static-lists-route.resolver';
import { TextareaAutoresizeDirective } from './views/delivery/details/directives/textarea-autoresize.directive';
import { InvoiceDetailsService } from 'libs/feature/invoice/src/lib/services/invoice-details.service';
import { RemoveDeliveryModalComponent } from './views/delivery/details/components/remove-delivery-modal/remove-delivery-modal.component';
import { HtmlDecode } from '@shiptech/core/pipes/htmlDecode/html-decode.pipe';

let useAdal = false;

if (window.location.hostname.includes('cma')) {
  useAdal = true;
}

@NgModule({
  imports: [
    CommonModule,
    DeliveryGridModule,
    DeliveryRoutingModule,
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
    MatSelectInfiniteScrollModule,
    BreadcrumbsModule
  ],
  declarations: [
    HtmlDecode,
    MainDeliveryComponent,
    DeliveryDetailsComponent,
    NotesLogComponent,
    BdnInformationComponent,
    InputComponent,
    DropdownComponent,
    DatePickerComponent,
    AutocompleteInputComponent,
    DeliveryDetailsToolbarComponent,
    DeliveryDetailsEmailLogsComponent,
    DeliveryDetailsDocumentsComponent,
    UomSelectorComponent,
    DeliveryProductsGroupComponent,
    DeliveryProductComponent,
    ProductQualityComponent,
    ProductQuantityComponent,
    BdnAdditionalInformationComponent,
    QuantityTenantFormatDirective,
    NumberOnlyDirective,
    TextareaAutoresizeDirective,
    RaiseClaimModalComponent,
    SplitDeliveryModalComponent,
    RemoveDeliveryModalComponent
    //PSpinnerDisableKeysSpinDirective,
    //PSpinnerTenantFormatDirective
  ],
  entryComponents: [
    RaiseClaimModalComponent,
    SplitDeliveryModalComponent,
    RemoveDeliveryModalComponent
  ],
  exports: [
    MainDeliveryComponent,
    QuantityTenantFormatDirective,
    NumberOnlyDirective,
    TextareaAutoresizeDirective
    // PSpinnerDisableKeysSpinDirective,
    //PSpinnerTenantFormatDirective
  ],
  providers: [
    ModuleLoggerFactory,
    DeliveryModuleResolver,
    DeliveryRouteResolver,
    UomsRouteResolver,
    DeliveryFeedbackRouteResolver,
    SatisfactionLevelRouteResolver,
    DeliveryDetailsRouteResolver,
    NavBarResolver,
    BargeRouteResolver,
    ClaimTypeRouteResolver,
    ScheduleDashboardLabelsRouteResolver,
    QuantityCategoryRouteResolver,
    UomVolumeRouteResolver,
    UomMassRouteResolver,
    PumpingRateUomRouteResolver,
    SampleSourceRouteResolver,
    StaticListsRouteResolver,
    {
      provide: QUANTITY_CONTROL_API_SERVICE,
      useClass: environment.production
        ? QuantityControlApi
        : QuantityControlApiMock
    },
    {
      provide: DELIVERY_API_SERVICE,
      useClass: environment.production ? DeliveryApi : QuantityControlApiMock
    },
    DeliveryDetailsUnsavedChangesGuard,
    NotesService,
    DeliveryService,
    DialogService,
    MessageService,
    ConfirmationService,
    InvoiceDetailsService,
    DecimalPipe
  ]
})
export class DeliveryModule {}
