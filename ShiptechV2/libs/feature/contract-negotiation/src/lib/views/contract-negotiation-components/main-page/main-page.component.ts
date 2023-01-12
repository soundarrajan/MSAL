import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { EmailPreviewPopupComponent } from '../contract-negotiation-popups/email-preview-popup/email-preview-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { LocalService } from '../../../services/local-service.service';
import { ActivatedRoute, Router } from "@angular/router";
import { CreateContractRequestPopupComponent } from '../contract-negotiation-popups/create-contract-request-popup/create-contract-request-popup.component';
import { ContractNegotiationService } from '../../../services/contract-negotiation.service';
import { Store } from '@ngxs/store';
import { ContractNegotiationStoreModel } from '../../../store/contract-negotiation.store';
import { UserProfileState } from '@shiptech/core/store/states/user-profile/user-profile.state';
import moment from 'moment';
import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import { ContractRequest } from '../../../store/actions/ag-grid-row.action';

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
  isNegotiationClosed: boolean = false;
  public isBuyer:boolean = true;
  public rowSelected:boolean = false;
  contractStatus: string;
  disableActionButtons : Boolean = true;
  disableSendRFQButton: Boolean = true;
  currentUserId: number;
  generalTenantSettings: any;
  clicked: boolean;
  resendButton: boolean = false;
  
  constructor(
    private toaster: ToastrService,
    public dialog: MatDialog,
    private localService: LocalService,
    private router : Router,
    private contractNegoService: ContractNegotiationService,
    private store: Store,
    private tenantSettingsService: TenantSettingsService,
    private ref: ChangeDetectorRef,
    public contractService: ContractNegotiationService,
    private route: ActivatedRoute,
  ) {
    this.currentUserId = this.store.selectSnapshot(UserProfileState.user).id;
    this.generalTenantSettings = this.tenantSettingsService.getGeneralTenantSettings();
  }

  ngOnInit(): void {
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
    this.localService.getSendRFQButtonStauts().subscribe(data => {
      this.disableSendRFQButton = data;
    })
    /*if (this.router.url.includes("buyer")){
      this.isBuyer = true;
    }else{
      this.isBuyer = false;
    }*/
  }

  updateContractRequestStatus(status: string){
    this.contractStatus = status;
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
    /* // Need to remove after testing //
    this.localService.isRowSelected.subscribe(data => {
      this.rowSelected = data;
    });*/
    let counterpartyDetails = []; let alreadySent = []; let selectedCount = 0;
    let contractRequestData;
    this.store.selectSnapshot((state: ContractNegotiationStoreModel) => {
      contractRequestData = state['contractNegotiation'].ContractRequest[0];
      contractRequestData.locations.forEach( prodData => {
        if(prodData.data && prodData.data.length > 0){
          prodData.data.forEach( data => {
            if(data.check) {
              selectedCount++;
              if(data.Status == 'Open') {
                let productDetails = {
                  "contractRequestProductId": prodData.contractRequestProductId,
                  "counterpartyId": data.CounterpartyId,
                  "createdById": data.createdById,
                  "lastModifiedById": this.currentUserId,
                  "createdOn": data.createdOn,
                  "lastModifiedOn": moment.utc(),
                  "id": data.id,
                  "productId": prodData.productId,
                  "specGroupId": prodData.specGroupId,
                  "minQuantity": prodData.minQuantity,
                  "minQuantityUomId": prodData.minQuantityUomId,
                  "maxQuantity": prodData.maxQuantity,
                  "maxQuantityUomId": prodData.maxQuantityUomId,
                  "validityDate": contractRequestData.minValidity,
                  "currencyId": this.generalTenantSettings.tenantFormats.currency.id,
                  "pricingTypeId": prodData.pricingTypeId
                }
                counterpartyDetails.push(productDetails);
              } else {
                alreadySent.push(data.CounterpartyName);
              }
            }
          })
        }
      });
    });
    if(selectedCount == 0){
      this.toaster.error('Atleast one counterparty should be selected to Send RFQ');
    }
    if(alreadySent.length > 0){
      this.toaster.error('RFQ is already sent for '+ alreadySent.join(', ') +' and the mail can be retriggered from Email Log');
    }
    if(selectedCount > 0 && counterpartyDetails.length > 0){
      let payload = {
        loginUserId: this.currentUserId,
        contractRequestId: contractRequestData.id,
        conReqProdSellerWithProdDetatilDtos: counterpartyDetails
      };
      this.contractNegoService.sendRFQ(payload).subscribe( res => {
        if(res.rfqSent){
          this.displaySuccessMsg('RFQ Sent successfully!');
          this.rfqSent = true;
          this.contractStatus = 'Inquired';
          let contractReq: any = false;
          if(res.contractRequestProductOfferIds.length > 0){
            contractReq = JSON.parse(JSON.stringify(this.store.selectSnapshot((state: ContractNegotiationStoreModel) => {
              return state['contractNegotiation'].ContractRequest[0];
            })));
            contractReq.locations.map( prod => {
              if(prod.data.length > 0){
                prod.data.map( data => {
                  if(res.contractRequestProductOfferIds.includes(data.id)) {
                    data.Status = 'Inquired';
                    data.check = false;
                    data.rfqStatus = true;
                  }
                })
              }
            })
           // this.store.dispatch(new ContractRequest([contractReq]));
          const contractRequestIdFromUrl = this.route.snapshot.params.requestId;
          this.contractService.getContractRequestDetails(contractRequestIdFromUrl)
          .subscribe(response => {
          this.localService.contractRequestData(response).then(() => {
            this.ref.markForCheck();
          });
          });
          }
        }
        if(res.message !== ""){
          this.toaster.error(res.message);
        }
      });
    }
    //this.localService.updateSendRFQStatus(true);
    //this.displaySuccessMsg('RFQ Sent successfully!');
    //this.contractStatus=this.showCalculatedValue?"Quoted":"Inquired";
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
    this.isNegotiationClosed = true;
  }

  calculatePrice() {
    if(this.rfqSent){
      this.showCalculatedValue = true;
      this.localService.updatecalculatePriceStatus(true);
      this.contractStatus = "Quoted";
    }
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

  emailLogsResendMail() {
    let reqpayload = 
     {"loginUserId":167,"emailLogsIds":["185794","185793"],"requestId":91};
          
    this.contractNegoService.emailLogsResendMail(
      reqpayload
    ).subscribe( data => {
      this.displaySuccessMsg('Mail Sent successfully!');
    }
    );
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
