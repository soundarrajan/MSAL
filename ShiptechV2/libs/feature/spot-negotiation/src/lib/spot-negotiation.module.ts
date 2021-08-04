import { MainSpotNegotiationComponent } from './views/main-spot-negotiation.component';
import { SpotNegotiationComponent } from './views/contract/details/spot-negotiation.component';
import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { LoggingModule } from '@shiptech/core/logging/logging.module';
import { ModuleLoggerFactory } from './core/logging/module-logger-factory';
import { SearchBoxModule } from '@shiptech/core/ui/components/search-box/search-box.module';
import { FilterPresetsModule } from '@shiptech/core/ui/components/filter-preferences/filter-presets.module';
import { UIModule } from '@shiptech/core/ui/ui.module';
import { MessageBoxModule } from '@shiptech/core/ui/components/message-box/message-box.module';
import { ContractGridModule } from './spot-negotiation-grid.module';
import { NgxsModule } from '@ngxs/store';
import { QuantityControlState } from './store/quantity-control.state';
import { QcReportsListState } from './store/reports-list/qc-reports-list.state';
import { QcReportState } from './store/report/qc-report.state';
import { environment } from '@shiptech/environment';
import { RelatedLinksModule } from '@shiptech/core/ui/components/related-links/related-links.module';
import { EntityStatusModule } from '@shiptech/core/ui/components/entity-status/entity-status.module';
import { AuthenticationModule } from '@shiptech/core/authentication/authentication.module';
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
import { SpotNegotiationService } from './services/spot-negotiation.service';
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
import { SpotNegotiationRoutingModule } from './spot-negotiation-routing.module';
import { ContractDetailsUnsavedChangesGuard } from './guards/contract-details-unsaved-changes-guard.service';
import { ContractApi, CONTRACT_API_SERVICE } from './services/api/contract-api';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@NgModule({
  imports: [
    CommonModule,
    ContractGridModule,
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
    NgxsModule.forFeature([
      QuantityControlState,
      QcReportsListState,
      QcReportState
    ]),
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
  declarations: [MainSpotNegotiationComponent, SpotNegotiationComponent],
  entryComponents: [],
  exports: [],
  providers: [
    ModuleLoggerFactory,
    {
      provide: CONTRACT_API_SERVICE,
      useClass: environment.production ? ContractApi : ContractApi
    },
    ContractDetailsUnsavedChangesGuard,
    SpotNegotiationService,
    DialogService,
    MessageService,
    ConfirmationService,
    DecimalPipe
  ]
})
export class SpotNegotiationModule {}
