import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KnownInvoiceRoutes } from '../../known-invoice.routes';
import { IInvoiceDetailsItemDto, IInvoiceDetailsItemRequest, IInvoiceDetailsItemResponse } from '../../services/api/dto/invoice-details-item.dto';
import { InvoiceDetailsService } from '../../services/invoice-details.service';


@Component({
  selector: 'shiptech-invoice-view',
  templateUrl: './invoice-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceViewComponent implements OnInit, OnDestroy {

  @ViewChild("invoiceDetails") invoiceDetailsComponent: any;
  _entityId;
  invoiceSubmitState:EsubmitMode;
  isConfirm=false;
  saveDisabled=true;
  constructor(route: ActivatedRoute, private invoiceService: InvoiceDetailsService){
    this._entityId = route.snapshot.params[KnownInvoiceRoutes.InvoiceIdParam];
  }
  selectedTab = 0;
  tabData = [
    { disabled: false, name: 'Details' },
    { disabled: false, name: 'Related Invoices' },
    { disabled: false, name: 'Documents' },
    { disabled: false, name: 'Email Log' },
    { disabled: false, name: 'Seller Rating' },
    { disabled: false, name: 'Audit Log' }
  ]
    
  ngOnInit(): void {
    this.getInvoiceItem();
  }

  ngOnDestroy(): void {
  }

  detailsSave(){
    // this.invoiceDetailsComponent.saveInvoiceDetails();
    this.isConfirm = !this.isConfirm;
  }

  getInvoiceItem() {
    if(!this._entityId)
      return;
    
    let data : IInvoiceDetailsItemRequest = {
      Payload: this._entityId
    };

    this.invoiceService
    .getInvoicDetails(data)
    .subscribe((response: IInvoiceDetailsItemResponse) => {
      this.invoiceDetailsComponent.formValues = <IInvoiceDetailsItemDto>response.payload;
      this.invoiceDetailsComponent.parseProductDetailData(this.invoiceDetailsComponent.formValues.productDetails);
       console.log(this.invoiceDetailsComponent.parseProductDetailData);
       this.invoiceDetailsComponent.setOrderDetailsLables(this.invoiceDetailsComponent.formValues.orderDetails);
       this.invoiceDetailsComponent.setcounterpartyDetailsLables(this.invoiceDetailsComponent.formValues.counterpartyDetails);
       this.invoiceDetailsComponent.setChipDatas();
       this.setSubmitMode(response.payload.status.transactionTypeId)
    });
  }

  setSubmitMode(type){
    // this.setSubmitMode = type == 5? EsubmitMode.
  }

}



export enum EsubmitMode{
  Save = 'save', // for draft
  Confirm = 'confirm',
  Approve = 'approve',
  Disabled = 'disabled'

}

