import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild,ChangeDetectorRef } from '@angular/core';
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
  isLoading = true;
  detailFormvalues:any;
  displayDetailFormvalues:boolean = false;
  saveDisabled=true;
  tabData: any;
  navBar: any;
  reportUrl: string;
  constructor(private route: ActivatedRoute, private invoiceService: InvoiceDetailsService,private changeDetectorRef: ChangeDetectorRef,){
    this._entityId = route.snapshot.params[KnownInvoiceRoutes.InvoiceIdParam];

    const baseOrigin = new URL(window.location.href).origin;
    this.tabData = [
      { disabled: false, name: 'Details' },
      { disabled: false, name: 'Related Invoices' },
      { disabled: false, name: 'Documents', url: `${baseOrigin}/#/invoices/invoice/documents/${this._entityId}` },
      { disabled: false, name: 'Audit Log', url: `${baseOrigin}/#/invoices/invoice/audit/${this._entityId}` },
      { disabled: false, name: 'Email Log', url: `${baseOrigin}/#/invoices/invoice/email-log/${this._entityId}` },
    ]
    this.reportUrl = `${baseOrigin}/#/reports/ordertoinvoice/IID=${this._entityId}`;
  }

  selectedTab = 0;

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      // if (data.invoice) {
      //   this.formValues = data.invoice;
      // }
      this.navBar = data.navBar;
    });
    this.getInvoiceItem();
  }

  ngOnDestroy(): void {
  }

  detailsSave(){
    this.invoiceDetailsComponent.saveInvoiceDetails();
    // this.isConfirm = !this.isConfirm;
  }
  invoiceOptions(options){
    this.invoiceDetailsComponent.invoiceOptionSelected(options);
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
      this.displayDetailFormvalues = true;
      this.isLoading = false;
      this.detailFormvalues = <IInvoiceDetailsItemDto>response.payload;
      // this.invoiceDetailsComponent.formValues = <IInvoiceDetailsItemDto>response.payload;
      // this.invoiceDetailsComponent.parseProductDetailData(this.invoiceDetailsComponent.formValues.productDetails);
      // //  console.log(this.invoiceDetailsComponent.parseProductDetailData);
      //  this.invoiceDetailsComponent.setOrderDetailsLables(this.invoiceDetailsComponent.formValues.orderDetails);
      //  this.invoiceDetailsComponent.setcounterpartyDetailsLables(this.invoiceDetailsComponent.formValues.counterpartyDetails);
      //  this.invoiceDetailsComponent.setChipDatas();
        this.setSubmitMode(response.payload.status.transactionTypeId);
        this.changeDetectorRef.detectChanges();
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

