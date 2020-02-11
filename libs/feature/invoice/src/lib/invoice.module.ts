import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoggingModule } from '@shiptech/core/logging/logging.module';
import { AuthenticationModule } from '@shiptech/core/authentication/authentication.module';
import { SearchBoxModule } from '@shiptech/core/ui/components/search-box/search-box.module';
import { UIModule } from '@shiptech/core/ui/ui.module';
import { FilterPresetsModule } from '@shiptech/core/ui/components/filter-preferences/filter-presets.module';
import { MasterAutocompleteModule } from '@shiptech/core/ui/components/master-autocomplete/master-autocomplete.module';
import { MessageBoxModule } from '@shiptech/core/ui/components/message-box/message-box.module';
import { RelatedLinksModule } from '@shiptech/core/ui/components/related-links/related-links.module';
import { EntityStatusModule } from '@shiptech/core/ui/components/entity-status/entity-status.module';
import { NgxsResetPluginModule } from 'ngxs-reset-plugin';
import { AgFilterDisplayModule } from '@shiptech/core/ui/components/ag-filter-display/ag-filter-display.module';
import { AgFooterModule } from '@shiptech/core/ui/components/ag-footer/ag-footer.module';
import { SelectTextOnFocusDirectiveModule } from '@shiptech/core/ui/directives/default/select-text-on-focus.directive';
import { ModuleLoggerFactory } from '../../../quantity-control/src/lib/core/logging/module-logger-factory';
import { environment } from '@shiptech/environment';
import { InvoiceRoutingModule } from './invoice-routing.module';
import { InvoiceCompleteService } from './services/invoice-complete.service';
import { INVOICE_COMPLETE_API_SERVICE, InvoiceCompleteApi } from './services/api/invoice-complete-api';
import { InvoiceCompleteApiMock } from './services/api/invoice-complete-api.mock';
import { FeatureInvoiceModuleResolver } from './invoice-route.resolver';
import { InvoiceCompleteListComponent } from './views/invoice-complete-list/invoice-complete-list.component';
import { AgGridExtensionsModule } from '@shiptech/core/ui/components/ag-grid/ag-grid-extensions.module';
import { AgGridModule } from 'ag-grid-angular';
import { AgCellTemplateComponent } from '@shiptech/core/ui/components/ag-grid/ag-cell-template/ag-cell-template.component';
import { AgColumnHeaderComponent } from '@shiptech/core/ui/components/ag-grid/ag-column-header/ag-column-header.component';
import { AgColumnGroupHeaderComponent } from '@shiptech/core/ui/components/ag-grid/ag-column-group-header/ag-column-group-header.component';
import { AgDatePickerComponent } from '@shiptech/core/ui/components/ag-grid/ag-data-picker/ag-date-picker.component';
import { AgCheckBoxHeaderComponent } from '@shiptech/core/ui/components/ag-grid/ag-check-box-header/ag-check-box-header.component';
import { AgCheckBoxRendererComponent } from '@shiptech/core/ui/components/ag-grid/ag-check-box-renderer/ag-check-box-renderer.component';
import { MainInvoiceComponent } from './views/main-invoice.component';
import { InvoiceListComponent } from './views/invoice-list/invoice-list.component';
import { WunderBarModule } from '@shiptech/core/ui/components/wonder-bar/wunder-bar.module';
import { AgAsyncBackgroundFillComponent } from '@shiptech/core/ui/components/ag-grid/ag-async-background-fill/ag-async-background-fill.component';
import { MessagesModule } from 'primeng/messages';
import { ButtonModule } from 'primeng/button';

@NgModule({
  imports: [
    CommonModule,
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
      AgCellTemplateComponent, AgColumnHeaderComponent, AgColumnGroupHeaderComponent, AgDatePickerComponent, AgCheckBoxHeaderComponent, AgCheckBoxRendererComponent, AgAsyncBackgroundFillComponent
    ]),
    AgFilterDisplayModule,
    AgFooterModule,
    SelectTextOnFocusDirectiveModule,
    WunderBarModule,
    ButtonModule,
    MessagesModule
  ],
  declarations: [
    MainInvoiceComponent,
    InvoiceListComponent,
    InvoiceCompleteListComponent
  ],
  providers: [
    ModuleLoggerFactory,
    FeatureInvoiceModuleResolver,
    {
      provide: INVOICE_COMPLETE_API_SERVICE,
      useClass: environment.production ? InvoiceCompleteApi : InvoiceCompleteApiMock
    },
    InvoiceCompleteService
  ]
})
export class InvoiceModule {
}
