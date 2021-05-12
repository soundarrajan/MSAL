import { AgGridModule } from '@ag-grid-community/angular';
import { CommonModule, DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationModule } from '@shiptech/core/authentication/authentication.module';
import { LoggingModule } from '@shiptech/core/logging/logging.module';
import { AgFilterDisplayModule } from '@shiptech/core/ui/components/ag-filter-display/ag-filter-display.module';
import { AgFooterModule } from '@shiptech/core/ui/components/ag-footer/ag-footer.module';
import { AgAsyncBackgroundFillComponent } from '@shiptech/core/ui/components/ag-grid/ag-async-background-fill/ag-async-background-fill.component';
import { AgCellTemplateComponent } from '@shiptech/core/ui/components/ag-grid/ag-cell-template/ag-cell-template.component';
import { AgCheckBoxHeaderComponent } from '@shiptech/core/ui/components/ag-grid/ag-check-box-header/ag-check-box-header.component';
import { AgCheckBoxRendererComponent } from '@shiptech/core/ui/components/ag-grid/ag-check-box-renderer/ag-check-box-renderer.component';
import { AgColumnGroupHeaderComponent } from '@shiptech/core/ui/components/ag-grid/ag-column-group-header/ag-column-group-header.component';
import { AgColumnHeaderComponent } from '@shiptech/core/ui/components/ag-grid/ag-column-header/ag-column-header.component';
import { AgDatePickerComponent } from '@shiptech/core/ui/components/ag-grid/ag-data-picker/ag-date-picker.component';
import { AgGridExtensionsModule } from '@shiptech/core/ui/components/ag-grid/ag-grid-extensions.module';
import { DSComponentsModule } from '@shiptech/core/ui/components/ds-components/ds.module';
import { EntityStatusModule } from '@shiptech/core/ui/components/entity-status/entity-status.module';
import { ExportModule } from '@shiptech/core/ui/components/export/export.module';
import { FilterPresetsModule } from '@shiptech/core/ui/components/filter-preferences/filter-presets.module';
import { MasterAutocompleteModule } from '@shiptech/core/ui/components/master-autocomplete/master-autocomplete.module';
import { MasterSelectorModule } from '@shiptech/core/ui/components/master-selector/master-selector.module';
import { MessageBoxModule } from '@shiptech/core/ui/components/message-box/message-box.module';
import { RelatedLinksModule } from '@shiptech/core/ui/components/related-links/related-links.module';
import { SearchBoxModule } from '@shiptech/core/ui/components/search-box/search-box.module';
import { WunderBarModule } from '@shiptech/core/ui/components/wonder-bar/wunder-bar.module';
import { SelectTextOnFocusDirectiveModule } from '@shiptech/core/ui/directives/default/select-text-on-focus.directive';
import { MaterialModule } from '@shiptech/core/ui/material.module';
import { UIModule } from '@shiptech/core/ui/ui.module';
import { environment } from '@shiptech/environment';
import { NgxsResetPluginModule } from 'ngxs-reset-plugin';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { MessagesModule } from 'primeng/messages';
import { ModuleLoggerFactory } from '../../../quantity-control/src/lib/core/logging/module-logger-factory';
import { FeatureInvoiceModuleResolver } from './invoice-route.resolver';
import { InvoiceRoutingModule } from './invoice-routing.module';
import {
  InvoiceCompleteApi, INVOICE_COMPLETE_API_SERVICE
} from './services/api/invoice-complete-api';
import { InvoiceCompleteApiMock } from './services/api/invoice-complete-api.mock';
import { InvoiceCompleteService } from './services/invoice-complete.service';
import { InvoiceDetailsService } from './services/invoice-details.service';
import { InvoiceCompleteListComponent } from './views/invoice-complete-list/invoice-complete-list.component';
import { InvoiceListComponent } from './views/invoice-list/invoice-list.component';
import { InvoiceDetailComponent } from './views/invoice-view/details/invoice-details.component';
import { InvoiceViewComponent } from './views/invoice-view/invoice-view.component';
import { MainInvoiceComponent } from './views/main-invoice.component';
import { RelatedInvoiceComponent } from './views/invoice-view/related-invoice/related-invoice.component';
import { AddProductDetailsComponent} from './views/invoice-view/details/component/add-product/add-product.component';
import { NavBarResolver } from './views/invoice-view/details/navbar-route-resolver';
import { BreadcrumbsModule } from '@shiptech/core/ui/components/breadcrumbs/breadcrumbs.module';
import { InvoiceDetailsToolbarComponent } from './views/invoice-view/toolbar/invoice-details-toolbar.component';
import { InvoiceTypeSelectionComponent } from './views/invoice-view/details/component/invoice-type-selection/invoice-type-selection.component';
import { AdditionalCostModalComponent } from './views/invoice-view/details/component/additional-cost-modal/additional-cost-modal.component';
import { MatMenuModule } from '@angular/material/menu';
import { ProductDetailsComponent } from './views/invoice-view/details/component/product-details/product-details.component';
import { PanelModule } from 'primeng/panel';
import { PortalModule } from '@angular/cdk/portal';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table/public-api';
import { PaginatorModule } from 'primeng/paginator';
import { TabMenuModule } from 'primeng/tabmenu';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { SpinnerModule } from 'primeng/spinner';
import { CheckboxModule } from 'primeng/checkbox';
import { AccordionModule } from 'primeng/accordion';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { A11yModule } from '@angular/cdk/a11y';
import { CdkTableModule } from '@angular/cdk/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSliderModule } from '@angular/material/slider';
import { StaticListsRouteResolver } from './views/invoice-view/details/static-lists-route.resolver';
import { QuantityTenantFormatDirective } from './views/invoice-view/details/component/directives/quantity-tenant-format.directive';
import { AmountTenantFormatDirective } from './views/invoice-view/details/component/directives/amount-tenant-format.directive';
import { PriceTenantFormatDirective } from './views/invoice-view/details/component/directives/price-tenant-format.directive';
import { NumberOnlyDirective } from './views/invoice-view/details/component/directives/number-only.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DynamicDialogModule,
    MaterialModule,
    DSComponentsModule,
    InvoiceRoutingModule,
    LoggingModule,
    AuthenticationModule.forFeature(),
    SearchBoxModule,
    UIModule,
    FilterPresetsModule,
    MasterAutocompleteModule,
    MessageBoxModule,
    RelatedLinksModule,
    EntityStatusModule,
    NgxsResetPluginModule.forRoot(),
    AgGridExtensionsModule,
    AgGridModule.withComponents([
      AgCellTemplateComponent,
      AgColumnHeaderComponent,
      AgColumnGroupHeaderComponent,
      AgDatePickerComponent,
      AgCheckBoxHeaderComponent,
      AgCheckBoxRendererComponent,
      AgAsyncBackgroundFillComponent
    ]),
    AgFilterDisplayModule,
    AgFooterModule,
    SelectTextOnFocusDirectiveModule,
    WunderBarModule,
    ButtonModule,
    MessagesModule,
    ExportModule,
    MasterSelectorModule,
    BreadcrumbsModule,
    MatMenuModule,
    PanelModule,
    MatTooltipModule,
    UIModule,
    MasterSelectorModule,
    ButtonModule,
    PortalModule,
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
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    OverlayModule,
    PortalModule,
    ScrollingModule,
  ],
  declarations: [
    MainInvoiceComponent,
    InvoiceListComponent,
    InvoiceCompleteListComponent,
    InvoiceViewComponent,
    InvoiceDetailComponent,
    RelatedInvoiceComponent,
    AddProductDetailsComponent,
    InvoiceDetailsToolbarComponent,
    InvoiceTypeSelectionComponent,
    ProductDetailsComponent,
    QuantityTenantFormatDirective,
    AmountTenantFormatDirective,
    PriceTenantFormatDirective,
    NumberOnlyDirective,
    AdditionalCostModalComponent
  ],
  exports: [
    QuantityTenantFormatDirective,
    NumberOnlyDirective,
    AmountTenantFormatDirective,
    PriceTenantFormatDirective
   // PSpinnerDisableKeysSpinDirective,
    //PSpinnerTenantFormatDirective
  ],
  providers: [
    ModuleLoggerFactory,
    FeatureInvoiceModuleResolver,
    NavBarResolver,
    {
      provide: INVOICE_COMPLETE_API_SERVICE,
      useClass: environment.production
        ? InvoiceCompleteApi
        : InvoiceCompleteApiMock
    },
    InvoiceCompleteService,
    InvoiceDetailsService,
    DialogService,
    DecimalPipe,
    StaticListsRouteResolver
  ],
  entryComponents:[
    InvoiceTypeSelectionComponent
  ]
})
export class InvoiceModule {}
