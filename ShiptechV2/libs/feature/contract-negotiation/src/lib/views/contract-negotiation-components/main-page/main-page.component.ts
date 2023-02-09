import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { EmailPreviewPopupComponent } from '../contract-negotiation-popups/email-preview-popup/email-preview-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { LocalService } from '../../../services/local-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateContractRequestPopupComponent } from '../contract-negotiation-popups/create-contract-request-popup/create-contract-request-popup.component';
import { ContractNegotiationService } from '../../../services/contract-negotiation.service';
import { Store } from '@ngxs/store';
import { ContractNegotiationStoreModel } from '../../../store/contract-negotiation.store';
import moment from 'moment';
import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import { delay } from 'rxjs/operators';
import { ContractNegoEmaillogComponent } from '../contract-nego-emaillog/contract-nego-emaillog.component';
import { IDocumentsUpdateIsVerifiedRequest } from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-update-isVerified.dto';
import { GridOptions } from 'ag-grid-community/dist/lib/main';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonApiService } from '@shiptech/core/services/common/common-api.service';
import { UserProfileState } from '@shiptech/core/store/states/user-profile/user-profile.state';
import { DocDragDropUploadComponent } from '../doc-drag-drop-upload/doc-drag-drop-upload.component';
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
  showPreviewEmail: boolean;
  showNoQuote: boolean;
  noQuote: boolean;
  isNegotiationClosed: boolean = false;
  public isBuyer: boolean = true;
  public rowSelected: boolean = false;
  contractStatus: string;
  disableActionButtons: Boolean = true;
  disableSendRFQButton: Boolean = true;
  currentUserId: number;
  generalTenantSettings: any;
  clicked: boolean;
  resendButton: boolean = false;
  requestId: any;
  Verify: boolean = false;
  @ViewChild(ContractNegoEmaillogComponent) contractNegoEmaillog: ContractNegoEmaillogComponent;
  public gridOptions_data: GridOptions;
  endpointCount: number;
  anErrorHasOccured: boolean;
  @ViewChild(DocDragDropUploadComponent) docUploadComponent: DocDragDropUploadComponent;
  constructor(private commonApiService: CommonApiService, private toaster: ToastrService, public dialog: MatDialog, private localService: LocalService, private router: Router, private contractNegoService: ContractNegotiationService, private store: Store, private tenantSettingsService: TenantSettingsService, private ref: ChangeDetectorRef, private route: ActivatedRoute, private spinner: NgxSpinnerService) {
    this.currentUserId = this.store.selectSnapshot(UserProfileState.user).id;
    this.generalTenantSettings = this.tenantSettingsService.getGeneralTenantSettings();
    this.requestId = this.route.snapshot.params.requestId;
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
      }
    ];
    this.localService.contractPreviewEmail.subscribe(data => {
      this.showPreviewEmail = data;
    });

    this.localService.getSendRFQButtonStauts().subscribe(data => {
      this.disableSendRFQButton = data;
      this.ref.markForCheck();
    });

    this.localService.getContractStatus().subscribe(data => {
      this.contractStatus = data;
      this.ref.markForCheck();
    });
    /*if (this.router.url.includes("buyer")){
      this.isBuyer = true;
    }else{
      this.isBuyer = false;
    }*/
  }

  updateContractRequestStatus(status: string) {
    this.contractStatus = status;
  }
  ngDoCheck() {
    this.showNoQuote = this.localService.getNoQuote();
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
    let counterpartyDetails = [];
    let alreadySent = [];
    let selectedCount = 0;
    let rowNodeIds = [];
    let contractRequestData;
    this.store.selectSnapshot((state: ContractNegotiationStoreModel) => {
      contractRequestData = state['contractNegotiation'].ContractRequest[0];
      contractRequestData.locations.forEach(prodData => {
        if (prodData.data && prodData.data.length > 0) {
          prodData.data.forEach(data => {
            if (data.check) {
              selectedCount++;
              rowNodeIds.push(data.id);
              if (data.Status == 'Open') {
                let productDetails = {
                  // contractRequestProductId: prodData.contractRequestProductId,
                  contractRequestProductOfferIds: data.contractRequestProductOfferIds,
                  counterpartyId: data.CounterpartyId,
                  createdById: data.createdById,
                  lastModifiedById: this.currentUserId,
                  createdOn: data.createdOn,
                  lastModifiedOn: moment.utc(),
                  id: data.id,
                  productId: prodData.productId,
                  specGroupId: prodData.specGroupId,
                  minQuantity: prodData.minQuantity,
                  minQuantityUomId: prodData.minQuantityUomId,
                  maxQuantity: prodData.maxQuantity,
                  maxQuantityUomId: prodData.maxQuantityUomId,
                  quantityUomId: prodData.maxQuantityUomId,
                  validityDate: contractRequestData.minValidity,
                  currencyId: this.generalTenantSettings.tenantFormats.currency.id,
                  pricingTypeId: prodData.pricingTypeId
                };
                counterpartyDetails.push(productDetails);
              } else {
                alreadySent.push(data.CounterpartyName);
              }
            }
          });
        }
      });
    });
    if (selectedCount == 0) {
      this.toaster.error('Atleast one counterparty should be selected to Send RFQ');
    }
    if (alreadySent.length > 0) {
      this.toaster.error('RFQ is already sent for ' + alreadySent.join(', ') + ' and the mail can be retriggered from Email Log');
    }
    if (selectedCount > 0 && counterpartyDetails.length > 0) {
      let payload = {
        loginUserId: this.currentUserId,
        contractRequestId: contractRequestData.id,
        conReqProdSellerWithProdDetatilDtos: counterpartyDetails
      };
      this.contractNegoService.sendRFQ(payload).subscribe(res => {
        if (res.rfqSent) {
          this.displaySuccessMsg('RFQ Sent successfully!');
          this.rfqSent = true;
          if (res.sellerRFQSendIds && res.sellerRFQSendIds.length > 0) {
            const contractRequestIdFromUrl = this.route.snapshot.params.requestId;
            this.contractNegoService.getContractRequestDetails(contractRequestIdFromUrl).subscribe(response => {
              this.localService.contractRequestData(response).then(() => {
                this.localService.callGridRefreshService(rowNodeIds);
              });
            });
          }
        }
        if (res.message !== '') {
          this.toaster.error(res.message);
        }
      });
    }
    //this.localService.updateSendRFQStatus(true);
    //this.displaySuccessMsg('RFQ Sent successfully!');
    //this.contractStatus=this.showCalculatedValue?"Quoted":"Inquired";
  }

  displaySuccessMsg(msg) {
    this.toaster.show('<div class="image-placeholder"><span class="image"></span></div><div class="message">' + msg + '</div>', '', {
      enableHtml: true,
      toastClass: 'toast-alert toast-green', // toast-green, toast-amber, toast-red, toast-grey
      timeOut: 2000
    });
  }

  amendRFQ() {
    let checkedCounterPartyInquiredStatus = [];
    let checkedCounterPartyOpenStatus = [];
    let noCounterPartyChecked = true;

    let checkedRows = this.localService.getCheckedSellerRows();
    if (checkedRows.length > 0) {
      noCounterPartyChecked = false;
      checkedRows.forEach(data => {
        if (data.Status !== 'Open' && data.Status !== 'Closed') {
          checkedCounterPartyInquiredStatus.push({
            id: data.id,
            counterpartyId: data.CounterpartyId
          });
        }
        if (data.Status === 'Open') {
          checkedCounterPartyOpenStatus.push(data.CounterpartyName);
        }
      });
    }

    checkedCounterPartyOpenStatus = [...new Set(checkedCounterPartyOpenStatus)];
    if (noCounterPartyChecked) {
      this.toaster.error('Atleast one counterparty should be selected to Amend RFQ');
      return;
    }
    if (checkedCounterPartyOpenStatus.length > 0 && checkedCounterPartyInquiredStatus.length == 0) {
      this.toaster.error('Amend RFQ cannot be sent as RFQ was not communicated for ' + checkedCounterPartyOpenStatus.join(', ') + '');
      return;
    }

    let amendRFQPayloyd = {
      loginUserId: this.currentUserId,
      contractRequestId: this.requestId,
      conReqProdSellerWithProdDetatilDtos: checkedCounterPartyInquiredStatus
    };

    this.contractNegoService.amendRFQ(amendRFQPayloyd).subscribe(response => {
      let isErrorResponse = this.checkAndShowError(response);
      if (isErrorResponse !== '') {
        this.toaster.error(isErrorResponse);
        return;
      }
      if (response.amendRfqSent) {
        this.toaster.success('Amend RFQ sent successfully.');
      }
      if (response.message !== '') {
        this.toaster.warning(response.message);
      }
    });
  }

  duplicateRequest() {
    const dialogRef = this.dialog.open(CreateContractRequestPopupComponent, {
      width: '1136px',
      minHeight: '90vh',
      maxHeight: '100vh',
      panelClass: ['additional-cost-popup', 'supplier-contact-popup'],
      data: { createReqPopup: false, rfqStatus: this.rfqSent }
    });

    dialogRef.afterClosed().subscribe(result => {});

    this.toaster.show('<div class="image-placeholder"><span class="image"></span></div><div class="message">Request duplicated successfully and available in request list</div>', '', {
      enableHtml: true,
      toastClass: 'toast-alert toast-green', // toast-green, toast-amber, toast-red, toast-grey
      timeOut: 2000
    });
  }

  closeNegotiation() {
    this.toaster.show('<div class="image-placeholder"><span class="image"></span></div><div class="message">Negotiation closed successfully</div>', '', {
      enableHtml: true,
      toastClass: 'toast-alert toast-green', // toast-green, toast-amber, toast-red, toast-grey
      timeOut: 2000
    });
    this.isNegotiationClosed = true;
  }

  calculatePrice() {
    if (this.rfqSent) {
      this.showCalculatedValue = true;
      this.localService.updatecalculatePriceStatus(true);
      this.contractStatus = 'Quoted';
    }
  }

  emailPreviewApproval() {
    const dialogRef = this.dialog.open(EmailPreviewPopupComponent, {
      width: '80vw',
      height: '90vh',
      panelClass: 'remove-padding-popup',
      data: { requestId: this.route.snapshot.params.requestId }
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  emailLogsResendMail() {
    var loginUserId = this.currentUserId;
    var contractRequestIdFromUrl = this.route.snapshot.params.requestId;
    var emailLogsIds = this.contractNegoEmaillog.getEmailLogSelectedItem();
    let reqpayload = { loginUserId: loginUserId, emailLogsIds: emailLogsIds, requestId: contractRequestIdFromUrl };
    if(emailLogsIds.length == 0){
      this.toaster.error("Select items from the list");
      return ;
    }
    this.contractNegoService.emailLogsResendMail(reqpayload).subscribe((response:any)  => { 
    if(response?.message == 'Unauthorized'){
        return;
    }
      this.displaySuccessMsg('Mail has been resend successfully');
      delay(1500);
      this.contractNegoEmaillog.getEmailLogs();
      
    });
  }

  sendToApproval() {
    //this.localService.updateContractStatus("Awaiting Approval");
    this.displaySuccessMsg('Offers sent for approval');
  }

  noQuoteAction(type) {
    this.contractNegoService.constructUpdateNoQuote(type)?.subscribe(res => {
      this.contractNegoService.getContractRequestDetails(this.route.snapshot.params.requestId).subscribe(response => {
        this.localService.contractRequestData(response).then(() => {
          this.localService.callGridRefreshService('all');
        });
      });
    });
  }

  createContract() {
    //this.localService.updateContractStatus({ "oldStatus": 2, "newStatus": 4 });
    this.displaySuccessMsg('Contract created successfully');
  }

  toApprove() {
    //this.localService.updateContractStatus("Approved");
    this.displaySuccessMsg('Offers approved successfully');
  }

  toReject() {
    //this.localService.updateContractStatus("Rejected");
    this.displaySuccessMsg('Offers Rejected');
  }

  updateIsVerifiedDocument() {
    let selectedNodes = this.commonApiService.shared_rowData_grid.api.getSelectedNodes();
    let selectedData = selectedNodes.map(node => node.data);
    if (!selectedData.length) {
      this.toaster.error('Please select a row !');
      return;
    } else {
      this.endpointCount = 0;
      this.spinner.show();
      selectedData.forEach((selectedRow: any) => {
        const request: IDocumentsUpdateIsVerifiedRequest = {
          id: selectedRow.id,
          isVerified: true
        };
        this.endpointCount += 1;
        this.anErrorHasOccured = false;
        this.commonApiService.updateIsVerifiedDocument(request).subscribe(response => {
          this.endpointCount -= 1;
          if (response.message == 'Unauthorized') {
            return;
          } else if (typeof response == 'string') {
            this.spinner.hide();
            this.anErrorHasOccured = true;
            this.toaster.error(response);
          } else {
            this.anErrorHasOccured = false;
            this.checkIfAllCalledAreFinished();
          }
        });
      });
    }
  }
  checkIfAllCalledAreFinished() {
    if (!this.endpointCount && !this.anErrorHasOccured) {
      this.spinner.hide();
      this.toaster.success('Document(s) verified !');
      this.docUploadComponent.getDocumentsList();
    }
  }

  checkAndShowError(res) {
    let err = '';
    if (res.message && res.message !== '') {
      err = "You don't have access to perform this action";
    } else if (res.errors) {
      err = JSON.stringify(res.errors);
    } else if (res.errorMessage && res.errorMessage !== '') {
      err = res.errorMessage;
    }
    return err;
  }
}
