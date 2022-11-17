import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { EmailPreviewPopupComponent } from '../contract-negotiation-popups/email-preview-popup/email-preview-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { LocalService } from '../../../services/local-service.service';
import { ActivatedRoute, Router } from "@angular/router";

import { isNumeric } from 'rxjs/internal-compatibility';
import { CreateContractRequestPopupComponent } from '../contract-negotiation-popups/create-contract-request-popup/create-contract-request-popup.component';
import { ContractNegotiationService } from '../../../services/contract-negotiation.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  navigationItems = [];
  public tab1: boolean;
  public tab2: boolean;
  public tab3: boolean;
  public tab4: boolean;
  rfqSent: boolean = false;
  sendToApprove: boolean = false;
  showCalculatedValue: boolean;
  showPreviewEmail:boolean;
  showNoQuote:boolean;
  noQuote: boolean;
  isNegotiationClosed: boolean = true;
  public isBuyer:boolean = true;
  public rowSelected:boolean = false;
  disableActionButtons : Boolean = true;
  constructor(private _location: Location, private toaster: ToastrService, public dialog: MatDialog, private localService: LocalService,
    private route: ActivatedRoute, private router : Router, private contractService: ContractNegotiationService) { }

  ngOnInit(): void {
    //const contractRequestIdFromUrl = this.route.snapshot.params.requestId;
    // if(contractRequestIdFromUrl && isNumeric(contractRequestIdFromUrl)){
    //   this.contractService.getContractRequestDetails(contractRequestIdFromUrl)
    //   .subscribe(response => {
    //     this.localService.contractRequestDetails = response;
    //   });
    // }
    this.navigationItems = [
      {
        id: 'request',
        displayName: 'Request',
        url: '',
        entityId: '',
        indexStatus: 'navigationBar-previous',
        hidden: false
      },
      {
        id: 'rfq',
        displayName: 'RFQ',
        url: '',
        entityId: '',
        indexStatus: 'navigationBar-active',
        hidden: false
      },
      {
        id: 'order',
        displayName: 'Order',
        url: '',
        entityId: '',
        indexStatus: 'navigationBar-next',
        hidden: false
      },

      {
        id: 'delivery',
        displayName: 'Delivery',
        url: '',
        entityId: '',
        indexStatus: 'navigationBar-next',
        hidden: false
      },
      {
        id: 'labs',
        displayName: 'Labs',
        url: '',
        entityId: '',
        indexStatus: 'navigationBar-next',
        hidden: false
      },
      {
        id: 'claims',
        displayName: 'Claims',
        url: '',
        entityId: '',
        indexStatus: 'navigationBar-next',
        hidden: false
      },
      {
        id: 'invoices',
        displayName: 'Invoices',
        url: '',
        entityId: '',
        indexStatus: 'navigationBar-next',
        hidden: false
      },
      {
        id: 'recon',
        displayName: 'Recon',
        url: '',
        entityId: '',
        indexStatus: 'navigationBar-next',
        hidden: false
      },
    ];
    this.localService.contractPreviewEmail.subscribe(data => {
      this.showPreviewEmail = data;
    })
    this.localService.contractNoQuote.subscribe(data => {
      this.showNoQuote = data;
    })
    /*if (this.router.url.includes("buyer")){
      this.isBuyer = true;
    }else{
      this.isBuyer = false;
    }*/
  }
  
  changeActionButtonStatus(val: boolean) {
    
    this.disableActionButtons = val;
  }
  
  goBack() {
    this.router.navigate(['/contract-negotiation/requests']);
  }
  onSubTabChange(tabs, tabIndex) {
    //alert(tabIndex);
    if (tabIndex == 0) {
      this.tab1 = true;
      this.tab2 = false;
      this.tab3 = false;
      this.tab4 = false;
    } else if (tabIndex == 1) {
      this.tab1 = false;
      this.tab2 = true;
      this.tab3 = false;
      this.tab4 = false;
    } else if (tabIndex == 2) {
      this.tab1 = false;
      this.tab2 = false;
      this.tab3 = true;
      this.tab4 = false;
    } else {
      this.tab1 = false;
      this.tab2 = false;
      this.tab3 = false;
      this.tab4 = true;
    }
  }

  sendRFQ() {
    this.rfqSent = true;
    this.localService.isRowSelected.subscribe(data => {
      this.rowSelected = data;
    });
    if(this.rowSelected){
    this.localService.updateSendRFQStatus(true);
    this.displaySuccessMsg('RFQ Sent successfully!');
    }
  }
  displaySuccessMsg(msg) {

    this.toaster.show('<div class="image-placeholder"><span class="image"></span></div><div class="message">'+msg+'</div>',
      '', {
      enableHtml: true,
      toastClass: "toast-alert toast-green", // toast-green, toast-amber, toast-red, toast-grey
      timeOut: 2000
    });
  }

  duplicateRequest() {
    const dialogRef = this.dialog.open(CreateContractRequestPopupComponent, {
      width: '1136px',
      minHeight: '90vh',
      maxHeight: '100vh',
      panelClass: ['additional-cost-popup', 'supplier-contact-popup'],
      data: { createReqPopup:false,rfqStatus: this.rfqSent }
    });

    dialogRef.afterClosed().subscribe(result => {
    });

    this.toaster.show('<div class="image-placeholder"><span class="image"></span></div><div class="message">Request duplicated successfully and available in request list</div>',
      '', {
      enableHtml: true,
      toastClass: "toast-alert toast-green", // toast-green, toast-amber, toast-red, toast-grey
      timeOut: 2000
    });
  }

  closeNegotiation() {
    this.toaster.show('<div class="image-placeholder"><span class="image"></span></div><div class="message">Negotiation closed successfully</div>',
      '', {
      enableHtml: true,
      toastClass: "toast-alert toast-green", // toast-green, toast-amber, toast-red, toast-grey
      timeOut: 2000
    });
    this.isNegotiationClosed = false;
  }

  calculatePrice() {
    this.showCalculatedValue = true;
    this.localService.updatecalculatePriceStatus(true);
  }

  emailPreviewApproval() {
    const dialogRef = this.dialog.open(EmailPreviewPopupComponent, {
      width: '80vw',
      height: '90vh',
      panelClass: 'remove-padding-popup'
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  sendToApproval() {
    this.localService.updateContractStatus({ "oldStatus": 0, "newStatus": 1 });
    this.displaySuccessMsg('Offers sent for approval');
  }

  onClickNoQuote(){
    this.noQuote = true;
  }

  createContract(){
    this.localService.updateContractStatus({ "oldStatus": 2, "newStatus": 4 });
    this.displaySuccessMsg('Contract created successfully');

  }
  toApprove(){
    this.localService.updateContractStatus({ "oldStatus": 1, "newStatus": 2 });
    this.displaySuccessMsg('Offers approved successfully');
  }
  toReject(){
    this.localService.updateContractStatus({ "oldStatus": 1, "newStatus": 3 });
    this.displaySuccessMsg('Offers Rejected');
  }
  
}
