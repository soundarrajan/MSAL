import { AgGridModule } from '@ag-grid-community/angular';
import { CommonModule } from '@angular/common';
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
import { AGGridCellActionsComponent } from '@shiptech/core/ui/components/ds-components/ag-grid/ag-grid-cell-actions.component';
import { AGGridCellEditableComponent } from '@shiptech/core/ui/components/ds-components/ag-grid/ag-grid-cell-editable.component';
import { AGGridCellRendererComponent } from '@shiptech/core/ui/components/ds-components/ag-grid/ag-grid-cell-renderer.component';
import { AgGridCellStyleComponent } from '@shiptech/core/ui/components/ds-components/ag-grid/ag-grid-cell-style.component';
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
import { DialogService } from 'primeng/dynamicdialog';
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

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
      AgAsyncBackgroundFillComponent,
      AGGridCellActionsComponent,
      AGGridCellEditableComponent,
      AgGridCellStyleComponent,
      AGGridCellRendererComponent
    ]),
    AgFilterDisplayModule,
    AgFooterModule,
    SelectTextOnFocusDirectiveModule,
    WunderBarModule,
    ButtonModule,
    MessagesModule,
    ExportModule,
    MasterSelectorModule
  ],
  declarations: [
    MainInvoiceComponent,
    InvoiceListComponent,
    InvoiceCompleteListComponent,
    InvoiceViewComponent,
    InvoiceDetailComponent
  ],
  providers: [
    ModuleLoggerFactory,
    FeatureInvoiceModuleResolver,
    {
      provide: INVOICE_COMPLETE_API_SERVICE,
      useClass: environment.production
        ? InvoiceCompleteApi
        : InvoiceCompleteApiMock
    },
    InvoiceCompleteService,
    InvoiceDetailsService,    
    DialogService
  ],
  entryComponents:[
    
  ]
})
export class InvoiceModule {}
