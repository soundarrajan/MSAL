import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContractNegotiationRoutingModule } from './contract-negotiation-routing.module';
import { ContractNegotiationComponent } from './views/contract-negotiation-components/contract-negotiation.component';
import { RequestListComponent } from './views/contract-negotiation-components/request-list/request-list.component';
import { ContractRequestDetailsComponent } from './views/contract-negotiation-components/conract-request-details/contract-request-details.component';
import { FormulaPricingDetailsComponent } from './views/contract-negotiation-components/formula-pricing-details/formula-pricing-details.component';
import { MainPageComponent } from './views/contract-negotiation-components/main-page/main-page.component';
import { CreateContractRequestPopupComponent } from './views/contract-negotiation-components/contract-negotiation-popups/create-contract-request-popup/create-contract-request-popup.component';
import { MaterialModule } from '@shiptech/core/ui/material.module';
//import { SharedModule } from 'src/public_api';
import { SharedModule } from '@shiptech/core/shared/shared.module';
import { UIModule } from '@shiptech/core/ui/ui.module';
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
import { SearchFormulaPopupComponent } from './views/contract-negotiation-components/contract-negotiation-popups/search-formula-popup/search-formula-popup.component';
import { AdditionalCostPopupComponent } from './views/contract-negotiation-components/contract-negotiation-popups/additional-cost-popup/additional-cost-popup.component';
import { ContractNegoTableComponent } from './views/contract-negotiation-components/contract-nego-table/contract-nego-table.component';
import { SendRfqPopupComponent } from './views/contract-negotiation-components/contract-negotiation-popups/send-rfq-popup/send-rfq-popup.component';
import { UpdateRfqPopupComponent } from './views/contract-negotiation-components/contract-negotiation-popups/update-rfq-popup/update-rfq-popup.component';
import { DeleteChatPopupComponent } from './views/contract-negotiation-components/contract-negotiation-popups/delete-chat-popup/delete-chat-popup.component';
import { DSV2ComponentsModule } from '@shiptech/core/ui/components/designsystem-v2/ds-v2.module';
import { FilterListComponent } from './views/contract-negotiation-components/filter-components/filter-list/filter-list.component';
import { HeaderFilterChipComponent } from './views/contract-negotiation-components/filter-components/header-filter-chip/header-filter-chip.component';
import { MoreFilterChipComponent } from './views/contract-negotiation-components/filter-components/more-filter-chip/more-filter-chip.component';
import { DocDragDropUploadComponent } from '@shiptech/core/ui/components/doc-drag-drop-upload/doc-drag-drop-upload.component';


@NgModule({
  declarations: [
    MainContractNegotiationComponent,
    ContractNegotiationComponent,
    RequestListComponent,
    ContractRequestDetailsComponent,
    FormulaPricingDetailsComponent,
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
    DocDragDropUploadComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    UIModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    AgGridModule.withComponents([]),
    ContractNegotiationRoutingModule,
    DSV2ComponentsModule
  ]
})
export class ContractNegotiationModule { }
