import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  NO_ERRORS_SCHEMA
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoggingModule } from '@shiptech/core/logging/logging.module';
import { ModuleLoggerFactory } from './core/logging/module-logger-factory';

import { SearchBoxModule } from '@shiptech/core/ui/components/search-box/search-box.module';
import { FilterPresetsModule } from '@shiptech/core/ui/components/filter-preferences/filter-presets.module';
import { UIModule } from '@shiptech/core/ui/ui.module';
import { MessageBoxModule } from '@shiptech/core/ui/components/message-box/message-box.module';
import { MainControlTowerComponent } from './views/main-control-tower.component';
import { ControlTowerGridModule } from './control-tower-grid.module';
import { NgxsModule } from '@ngxs/store';

import { environment } from '@shiptech/environment';
import { RelatedLinksModule } from '@shiptech/core/ui/components/related-links/related-links.module';
import { EntityStatusModule } from '@shiptech/core/ui/components/entity-status/entity-status.module';
import { ControlTowerModuleResolver } from './control-tower-route.resolver';
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
import { WunderBarModule } from '@shiptech/core/ui/components/wonder-bar/wunder-bar.module';
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
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ExportModule } from '@shiptech/core/ui/components/export/export.module';
import { ControlTowerRoutingModule } from './control-tower-routing.module';

import { ControlTowerViewComponent } from './views/control-tower/view/control-tower-view.component';
import { MasterSelectorModule } from '@shiptech/core/ui/components/master-selector/master-selector.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { PortalModule } from '@angular/cdk/portal';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule
} from '@angular-material-components/datetime-picker';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BreadcrumbsModule } from '@shiptech/core/ui/components/breadcrumbs/breadcrumbs.module';
import { MatSelectInfiniteScrollModule } from 'ng-mat-select-infinite-scroll';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ControlTowerModalComponent } from '@shiptech/core/ui/components/control-tower-modal/control-tower-modal.component';
import { AgGridExtensionsModule } from '@shiptech/core/ui/components/ag-grid/ag-grid-extensions.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@shiptech/core/ui/material.module';
import { DSV2ComponentsModule } from '@shiptech/core/ui/components/designsystem-v2/ds-v2.module';
import { ResidueDifferenceComponent } from './views/control-tower/view/components/residue-difference/residue-difference.component';
import { ResidueClaimsComponent } from './views/control-tower/view/components/residue-claims/residue-claims.component';
import { QuantityDifferenceComponent } from './views/control-tower/view/components/quantity-difference/quantity-difference.component';
import { QualityLabsComponent } from './views/control-tower/view/components/quality-labs/quality-labs.component';
import { QualityClaimsComponent } from './views/control-tower/view/components/quality-claims/quality-claims.component';
import {
  HighlightPipe,
  MyNotesComponent
} from './views/control-tower/view/components/my-notes/my-notes.component';
import { ControlTowerHomeNewComponent } from './views/control-tower/view/components/control-tower-home-new/control-tower-home-new.component';
import { ControlTowerQuantityDifferenceComponent } from './views/control-tower/view/components/control-tower-quantity-difference/control-tower-quantity-difference.component';
import {
  ControlTowerApi,
  CONTROL_TOWER_API_SERVICE
} from './services/api/control-tower-api';
import { ControlTowerService } from './services/control-tower.service';
import { ControlTowerState } from './store/control-tower.state';
import { AgFooterNewModule } from '@shiptech/core/ui/components/ag-footer-new/ag-footer-new.module';
import { ExportNewModule } from '@shiptech/core/ui/components/export-new/export-new.module';
import { ControlTowerListState } from './store/control-tower-general-list/control-tower-general-list.state';
import { ControlTowerGeneralListComponent } from './views/control-tower/view/components/control-tower-general-view-list/control-tower-general-view-list.component';
import { ControlTowerQuantityClaimsComponent } from './views/control-tower/view/components/control-tower-quantity-claims/control-tower-quantity-claims.component';

let useAdal = false;

if (window.location.hostname.includes('cma')) {
  useAdal = true;
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DynamicDialogModule,
    MaterialModule,
    DSV2ComponentsModule,
    LoggingModule,
    !useAdal
      ? AuthenticationMsalModule.forFeature()
      : AuthenticationAdalModule.forFeature(),
    SearchBoxModule,
    UIModule,
    FilterPresetsModule,
    MasterAutocompleteModule,
    MessageBoxModule,
    RelatedLinksModule,
    EntityStatusModule,
    NgxsResetPluginModule.forRoot(),
    AgGridExtensionsModule,
    ControlTowerGridModule,
    ControlTowerRoutingModule,
    LoggingModule,
    SearchBoxModule,
    UIModule,
    FilterPresetsModule,
    MasterAutocompleteModule,
    MessageBoxModule,
    RelatedLinksModule,
    EntityStatusModule,
    DynamicDialogModule,
    ExportModule,
    ExportNewModule,
    NgxsModule.forFeature([ControlTowerState, ControlTowerListState]),
    NgxsResetPluginModule.forRoot(),
    AgFilterDisplayModule,
    AgFooterModule,
    AgFooterNewModule,
    SelectTextOnFocusDirectiveModule,
    EmailLogModule,
    AuditLogModule,
    DocumentsModule,
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
    MainControlTowerComponent,
    ControlTowerViewComponent,
    ControlTowerModalComponent,
    ResidueDifferenceComponent,
    ResidueClaimsComponent,
    QuantityDifferenceComponent,
    ControlTowerQuantityClaimsComponent,
    QualityLabsComponent,
    QualityClaimsComponent,
    MyNotesComponent,
    ControlTowerHomeNewComponent,
    HighlightPipe,
    ControlTowerQuantityDifferenceComponent,
    ControlTowerGeneralListComponent
  ],
  entryComponents: [ControlTowerModalComponent],
  exports: [MainControlTowerComponent, HighlightPipe],
  providers: [
    ModuleLoggerFactory,
    ControlTowerModuleResolver,
    {
      provide: CONTROL_TOWER_API_SERVICE,
      useClass: environment.production ? ControlTowerApi : ControlTowerApi
    },
    DialogService,
    MessageService,
    ConfirmationService,
    ControlTowerService
  ]
})
export class ControlTowerModule {}
