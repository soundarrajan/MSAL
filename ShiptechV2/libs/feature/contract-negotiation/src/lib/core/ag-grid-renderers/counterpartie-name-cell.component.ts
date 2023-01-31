import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { EmailPreviewPopupComponent } from '../../views/contract-negotiation-components/contract-negotiation-popups/email-preview-popup/email-preview-popup.component';
import _ from 'lodash';
import { RemoveCounterpartyPopupComponent } from '../../views/contract-negotiation-components/contract-negotiation-popups/remove-counterparty-popup/remove-counterparty-popup.component';
import { ContractNegotiationService } from '../../services/contract-negotiation.service';
import { ContractNegotiationStoreModel } from '../../store/contract-negotiation.store';
import { Store } from '@ngxs/store';
import { ContractRequest } from '../../store/actions/ag-grid-row.action';
import { LocalService } from '../../services/local-service.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'shiptech-counterpartie-name-cell',
  template: `
    <div class="fly-away">
      <div class="hover-cell-lookup d-flex align-items-center ">
        <span class="info-flag" *ngIf="params.node.data?.isSellerSuspended" matTooltipClass="lightTooltip" matTooltip="Temporary suspended counterparty"></span>

        <div class="m-l-7 ellipsis" style="cursor: pointer;" matTooltip="{{ decodeSpecificField(params.value) }}" matTooltipClass="lightTooltip" [matMenuTriggerFor]="clickmenupopup" #menuPopupTrigger="matMenuTrigger" [matMenuTriggerData]="{ data: params.value }" (click)="menuPopupTrigger.closeMenu()" (contextmenu)="$event.preventDefault(); $event.stopPropagation(); menuPopupTrigger.openMenu()">
          {{ decodeSpecificField(params.value) }}
        </div>
        <div (click)="params.value && openEmailPreview(params)" *ngIf="rfqSendFlag" matTooltip="Preview RFQ" matTooltipClass="lightTooltip" [ngClass]="{ 'preview-rfq-icon': params.value }"></div>
      </div>

      <mat-menu #clickmenupopup="matMenu" class="small-menu darkPanel">
        <ng-template matMenuContent let-aliasMenuItems="data">
          <div class="p-tb-5" style="display:flex;align-items:center;" *ngIf="params.node.data?.Status != 'Open'" (click)="addAnotherOffer(params)">
            <div class="popup-icon-align">
              <div class="add-blue-icon"></div>
            </div>
            <div class="fs-13">Add another offer</div>
          </div>
          <div class="p-tb-5" style="display:flex;align-items:center;">
            <div class="popup-icon-align">
              <div class="preview-rfq-icon"></div>
            </div>
            <div class="fs-13" (click)="openEmailPreview(params)">Preview RFQ email</div>
          </div>
          <div class="p-tb-5" style="display:flex;align-items:center;" *ngIf="params.node.data?.Status == 'Inquired' && params.node.data?.isNoQuote">
                <div class="popup-icon-align">
                    <div class="contract-enable-quote-icon"></div>
                </div>
                <div class="fs-13" (click)="switchEnableOrNoQuoteAction(params,'enable-Quote')">Enable quote</div>
          </div>
          <div class="p-tb-5" style="display:flex;align-items:center;" *ngIf="params.node.data?.Status == 'Inquired' && !params.node.data?.isNoQuote">
                <div class="popup-icon-align">
                    <div class="contract-no-quote-icon"></div>
                </div>
                <div class="fs-13" (click)="switchEnableOrNoQuoteAction(params,'no-Quote')">No quote</div>
          </div>
          <hr class="menu-divider-line" />

          <ng-container *ngIf="aliasMenuItems.Status == 'Contracted'">
            <!-- *ngIf="aliasMenuItems.Status=='Contracted'" -->
            <div class="p-tb-5" (click)="addToAnotherNego()" style="display:flex;align-items:center;">
              <div class="popup-icon-align">
                <div class="add-blue-icon"></div>
              </div>
              <div class="fs-13">Add to another nego</div>
            </div>
            <hr class="menu-divider-line" />
          </ng-container>
          <div class="p-tb-5" style="display:flex;align-items:center;">
            <div class="popup-icon-align">
              <div class="delete-icon"></div>
            </div>
            <div class="fs-13" (click)="removeCounterpartyPopup(params)">Remove counterparty</div>
          </div>
        </ng-template>
      </mat-menu>
    </div>
  `,
  styles: []
})
export class CounterpartieNameCellComponent implements OnInit, ICellRendererAngularComp {
  public params: any;
  public rfqSendFlag: boolean = false;
  dummyId = 121;
  constructor(
    public dialog: MatDialog,
    private toaster: ToastrService,
    private contractService : ContractNegotiationService,
    private store : Store,
    private localService: LocalService,
    private route: ActivatedRoute,
    ) {}

  ngOnInit(): void {}
  agInit(params: any): void {
    this.params = params;
    this.rfqSendFlag = params?.node?.data?.Status != 'Open' ? true : false;
  }

  refresh(): boolean {
    return false;
  }

  openEmailPreview(params) {
    let contractRequestData = this.store.selectSnapshot((state: ContractNegotiationStoreModel) => {
      return state['contractNegotiation'].ContractRequest[0];
    });
    let selectedDataIds = []; let selectedCounterPartyId = 0;
    let contractRequestId = contractRequestData.id;
    let sellerData = []; let prodData = {};
    let noCounterPartyChecked = true;
    let multipleCounterPartySelected = false;
    let isCurrentRowNotChecked = true;
    contractRequestData.locations.forEach( prod => {
      if(prod.data.length > 0){
        prod.data.forEach( data => {
          if(data.check === true){
            if(params.node.data.id == data.id) isCurrentRowNotChecked = false;
            noCounterPartyChecked = false;
            if(selectedCounterPartyId == 0) selectedCounterPartyId = data.CounterpartyId;
            if(selectedCounterPartyId === data.CounterpartyId){
              prodData[prod.contractRequestProductId] = {
                productId: prod.productId,
                specGroupId: prod.specGroupId,
                minQuantity: prod.minQuantity,
                maxQuantity: prod.maxQuantity,
                quantityUomId: prod.maxQuantityUomId,
                pricingTypeId: prod.pricingTypeId
              }
              selectedDataIds.push(data.id);
              sellerData.push(data);
            }
            else{
              multipleCounterPartySelected = true;
            }
          }
        });
      }
    });
    if(multipleCounterPartySelected){
      this.toaster.error('Please select same seller to previewRFQ email.');
      return;
    }
    if(noCounterPartyChecked || isCurrentRowNotChecked){
      prodData[params.node.data.contractRequestProductId] = contractRequestData.locations.filter( prod => prod.contractRequestProductId == params.node.data.contractRequestProductId)[0];
      selectedDataIds.push(params.node.data.id);
      sellerData.push(params.node.data);
    }
    this.dialog.open(EmailPreviewPopupComponent, {
      width: '80vw',
      height: '90vh',
      panelClass: 'remove-padding-popup',
      data: {
        counterPartyId: params.node.data.CounterpartyId,
        contractRequestProductOfferIds: selectedDataIds,
        readOnly: false,
        contractRequestId: contractRequestId,
        popupSource: 'previewRFQTemplate',
        sellerData: sellerData,
        prodData: prodData
      }
    });
  }

  switchEnableOrNoQuoteAction(params, type){
    if(params.node.data.Status == 'Inquired' && (params.node.data.isNoQuote || !params.node.data.isNoQuote) ){
      this.contractService.contructEnableOrNoQuote(params.node.data,type)?.subscribe(res => {
        this.contractService.getContractRequestDetails(this.route.snapshot.params.requestId)
        .subscribe(response => {
          this.localService.contractRequestData(response).then(() => {
            this.localService.callGridRefreshService([params.node.data.id]);
          })
          type=='no-Quote'?this.toaster.success("Selected Offer have been marked as No Quote successfully -"+params?.value):this.toaster.success("Selected Offer Price has been enabled  "+params.value);         
        });
      });
    }else if(params.node.data.Status == 'Open' && !params.node.data.isNoQuote  && type=='no-quote'){
      this.toaster.warning(" Offer Price cannot be marked as 'No Quote' as RFQ has not sent."+" Counterparty:"+params?.value);
      return;
    }else{
      this.localService.setEnableQuote(false);
      this.toaster.warning("Enable Quote can be applied only on Offer Price marked as 'No Quote"+" Counterparty:"+params?.value);
      return;
    }
  }
  removeCounterpartyPopup(params) {
    
    if(params.node.data.Status == 'Open'){
      this.toaster.success(params.node.data.CounterpartyName+' have been removed');
      this.deleteRow(params.node.data.id);
      return;
    }
    const dialogRef = this.dialog.open(RemoveCounterpartyPopupComponent, {
      width: '340px',
      height: 'auto',
      panelClass: 'delete-chat-popup',
      data : {counterpartyName : params.node.data.CounterpartyName}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.deleteRow(params.node.data.id);
        this.toaster.success(params.node.data.CounterpartyName+' have been removed');
      }
    });
  }


  addToAnotherNego() {
    this.toaster.show('<div class="image-placeholder"><span class="image"></span></div><div class="message">Negotiation duplicated successfully and available in request list</div>', '', {
      enableHtml: true,
      toastClass: 'toast-alert toast-green custom-toast', // toast-green, toast-amber, toast-red, toast-grey
      timeOut: 2000
    });
  }

  addAnotherOffer(cParam) {
   let  pArray = {
      'contractRequestProductId' : cParam.node.data.contractRequestProductId,
      'counterpartyId' :cParam.node.data.CounterpartyId,
      'locationId' : cParam.node.data.LocationId,
      "statusId": 1,
      'IsDeleted' :false,
      'IsSelected' :true,
      'Id' : 0,
      "createdOn": "2022-12-05T05:21:28.504Z",
      "createdById": 1
    };
    this.contractService.addAnotherOfferCounterparty([pArray]).subscribe(res => {
      this.contractService.getContractRequestDetails(this.route.snapshot.params.requestId)
      .subscribe(response => {
        this.localService.contractRequestData(response);
      });
    });
  }

  deleteRow(counterpartyId) {
    this.contractService.RemoveCounterparty(counterpartyId).subscribe(res => {
      if(res['isDeleted']){
      let storeData = this.store.selectSnapshot((state: ContractNegotiationStoreModel) => {
        return state['contractNegotiation'].ContractRequest[0].locations;
      });
      let storePayload = JSON.parse(JSON.stringify(storeData));
      storeData.filter((el1,index1) => {
        el1['data'].filter((el2,index2) => {
            if(el2.id == counterpartyId){
              storePayload[index1]['data'].splice(index2,1);
              return;
            }
        });
      });
      let noCounterParty = true;
      storePayload.forEach( loc => {
        if(loc.data.length > 0){
          noCounterParty = false;
        }
      });
      this.localService.setSendRFQButtonStauts(noCounterParty);
      this.store.dispatch(new ContractRequest([{'locations' : storePayload}]));
      }else{
        this.toaster.error('Data not deleted, Please Refresh the page and try again.')
      }
  });
    
  }

  decodeSpecificField(modelValue) {
    const decode = function (str) {
      return str.replace(/&#(\d+);/g, function (match, dec) {
        return String.fromCharCode(dec);
      });
    };
    return decode(_.unescape(modelValue));
  }

  
}
