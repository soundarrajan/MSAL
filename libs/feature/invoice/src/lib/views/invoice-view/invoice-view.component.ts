import { INewInvoiceDetailsItemRequest } from './../../services/api/dto/invoice-details-item.dto';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild,ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KnownInvoiceRoutes } from '../../known-invoice.routes';
import { IInvoiceDetailsItemDto, IInvoiceDetailsItemRequest, IInvoiceDetailsItemResponse } from '../../services/api/dto/invoice-details-item.dto';
import { InvoiceDetailsService } from '../../services/invoice-details.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'shiptech-invoice-view',
  templateUrl: './invoice-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceViewComponent implements OnInit, OnDestroy {

  @ViewChild("invoiceDetails") invoiceDetailsComponent: any;
  _entityId;
  isConfirm=false;
  detailFormvalues:any;
  displayDetailFormvalues:boolean = false;
  saveDisabled=true;
  tabData: any;
  navBar: any;
  reportUrl: string;
  selectedTab = 0;
  submitreviewBtn:boolean = true;
  submitapproveBtn:boolean = true;
  cancelBtn:boolean = true;
  acceptBtn:boolean = true;
  revertBtn:boolean = true;
  rejectBtn:boolean = true;

  constructor(private route: ActivatedRoute, private invoiceService: InvoiceDetailsService,private changeDetectorRef: ChangeDetectorRef,private spinner: NgxSpinnerService,){
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

  ngOnInit(): void {
    this.spinner.show();
    this.route.data.subscribe(data => {
      this.navBar = data.navBar;
      this._entityId = this.route.snapshot.params[KnownInvoiceRoutes.InvoiceIdParam];
      // http://localhost:9016/#/invoices/invoice/edit/0
      if (localStorage.getItem('invoiceFromDelivery')) {
        // this.openedScreenLoaders = 0;
        this.createNewInvoiceFromDelivery();
      }
      else{
        this.getInvoiceItem();
      }
    });
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
    if(!this._entityId || this._entityId == 0)
      return;
    this.invoiceService.getInvoicDetails(this._entityId)
      .subscribe((response: any) => {
        this.setScreenActions(response);
      });
  }

  createNewInvoiceFromDelivery(){
    let data = JSON.parse(localStorage.getItem('invoiceFromDelivery'));
    localStorage.removeItem('invoiceFromDelivery');

    this.invoiceService.getNewInvoicDetails(data)
      .subscribe((response: IInvoiceDetailsItemResponse) => {
        this.setScreenActions(response);
      });
  }

  setScreenActions(formValues: any){
    this.displayDetailFormvalues = true;
    this.spinner.hide();
    this.detailFormvalues = <IInvoiceDetailsItemDto>formValues;
        this.detailFormvalues.screenActions.forEach(action => {
          if(action.name == 'Cancel'){
            this.cancelBtn = false;
          }else if(action.name == "SubmitForReview"){
            this.submitreviewBtn = false;
          }else if(action.name == 'ApproveInvoice'){
            this.saveDisabled = false;
          }else if(action.name == "RejectInvoice"){
            this.rejectBtn = false;
          }else if(action.name == "Revert"){
            this.revertBtn = false;
          }else if(action.name == "Accept"){
            this.acceptBtn = false;
          }else if(action.name == "SubmitForApprovalInvoice"){
            this.submitapproveBtn = false;
          }
        });
        this.changeDetectorRef.detectChanges();
  }

}
